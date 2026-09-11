import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import type { ClientSigningLink } from '@/data/clientSigningLink';
import {
  createClientSigningLink,
  deleteClientSigningLink,
  listClientSigningLinks,
} from '@/lib/clientSigningLinkClient';
import { downloadDocumentPdf } from '@/lib/pdfGenerator';

function buildLinkUrl(id: string): string {
  return `${window.location.origin}/firmar-cliente/${id}`;
}

export function AdminClientContractManager() {
  const [links, setLinks] = useState<(ClientSigningLink & { createdAt: Date })[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [contractText, setContractText] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();

  const refresh = () => {
    setIsLoading(true);
    listClientSigningLinks()
      .then(setLinks)
      .catch(() => {
        toast({ title: 'Error', description: 'No se pudieron cargar los links.', variant: 'destructive' });
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCreate = async () => {
    if (!title.trim() || !contractText.trim()) {
      toast({
        title: 'Error',
        description: 'Completa el título y pega el texto del contrato antes de generar el link.',
        variant: 'destructive',
      });
      return;
    }

    setIsCreating(true);
    try {
      const id = await createClientSigningLink(title.trim(), contractText.trim());
      const url = buildLinkUrl(id);
      await navigator.clipboard.writeText(url).catch(() => {});
      toast({
        title: 'Link creado',
        description: 'Se copió al portapapeles. Puedes pegarlo en WhatsApp o correo.',
        variant: 'default',
      });
      setTitle('');
      setContractText('');
      setShowForm(false);
      refresh();
    } catch (error) {
      toast({ title: 'Error', description: 'No se pudo crear el link.', variant: 'destructive' });
    } finally {
      setIsCreating(false);
    }
  };

  const handleCopy = async (id: string) => {
    await navigator.clipboard.writeText(buildLinkUrl(id)).catch(() => {});
    toast({ title: 'Copiado', description: 'Link copiado al portapapeles.', variant: 'default' });
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteClientSigningLink(id);
      toast({ title: 'Eliminado', description: 'Link eliminado.', variant: 'default' });
      refresh();
    } catch (error) {
      toast({ title: 'Error', description: 'No se pudo eliminar el link.', variant: 'destructive' });
    }
  };

  return (
    <Card className="p-6 space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Contratos con Clientes</h2>
          <p className="text-sm text-gray-600 mt-1">
            Pega el texto de un contrato u otrosí y genera un link de firma para el cliente. No necesita
            cuenta ni login: revisa el documento, llena sus datos y firma con dibujo.
          </p>
        </div>
        <Button
          onClick={() => setShowForm((v) => !v)}
          className="bg-[#D4A843] hover:bg-[#c9963e] text-black font-bold"
        >
          {showForm ? 'Cancelar' : '+ Nuevo Contrato'}
        </Button>
      </div>

      {showForm && (
        <div className="space-y-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div>
            <label className="block text-sm text-gray-700 mb-1">Título (visible para el cliente)</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              placeholder='Ej: "Otrosí No. 1 al Contrato 77Rentals-CT-2026-01 — Galcol S.A.S."'
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">
              Texto del contrato (separa las cláusulas con una línea en blanco, encabézalas con
              "CLÁUSULA X — ...")
            </label>
            <textarea
              value={contractText}
              onChange={(e) => setContractText(e.target.value)}
              rows={12}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg font-mono text-xs"
              placeholder="Pega aquí el texto completo del contrato..."
            />
          </div>
          <Button
            onClick={handleCreate}
            disabled={isCreating}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-60"
          >
            {isCreating ? 'Creando…' : 'Generar Link'}
          </Button>
        </div>
      )}

      {isLoading ? (
        <p className="text-sm text-gray-500">Cargando…</p>
      ) : links.length === 0 ? (
        <p className="text-sm text-gray-500">Aún no has creado ningún contrato.</p>
      ) : (
        <div className="space-y-2">
          {links.map((link) => (
            <div
              key={link.id}
              className="flex items-center justify-between gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200"
            >
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {link.title} —{' '}
                  {link.status === 'signed' ? (
                    <span className="text-green-700">✓ Firmado{link.clientName ? ` por ${link.clientName}` : ''}</span>
                  ) : (
                    <span className="text-orange-600">Pendiente de firma</span>
                  )}
                </p>
                <p className="text-xs text-gray-500 truncate">{buildLinkUrl(link.id)}</p>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                {link.status === 'pending' ? (
                  <>
                    <Button variant="outline" size="sm" onClick={() => handleCopy(link.id)}>
                      Copiar link
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600 border-red-300 hover:bg-red-50"
                      onClick={() => handleDelete(link.id)}
                    >
                      Eliminar
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      downloadDocumentPdf(
                        link.contractText,
                        `${link.title.replace(/\s+/g, '_')}.pdf`,
                        link.signatureImage
                          ? [{ roleLabel: link.clientName ?? 'CLIENTE', signatureImage: link.signatureImage }]
                          : []
                      )
                    }
                  >
                    📄 Descargar
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
