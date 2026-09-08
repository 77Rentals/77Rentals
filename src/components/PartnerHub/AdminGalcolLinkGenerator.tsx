import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import type { OwnerSigningLink, OwnerUnitType } from '@/data/ownerSigningLink';
import { createOwnerSigningLink, listOwnerSigningLinks } from '@/lib/ownerSigningLinkClient';

function buildLinkUrl(id: string): string {
  return `${window.location.origin}/firmar/${id}`;
}

export function AdminGalcolLinkGenerator() {
  const [links, setLinks] = useState<(OwnerSigningLink & { createdAt: Date })[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState<OwnerUnitType | null>(null);
  const { toast } = useToast();

  const refresh = () => {
    setIsLoading(true);
    listOwnerSigningLinks()
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

  const handleCreate = async (unitType: OwnerUnitType) => {
    setIsCreating(unitType);
    try {
      const id = await createOwnerSigningLink(unitType);
      const url = buildLinkUrl(id);
      await navigator.clipboard.writeText(url).catch(() => {});
      toast({
        title: 'Link creado',
        description: 'Se copió al portapapeles. Puedes pegarlo en WhatsApp o correo.',
        variant: 'default',
      });
      refresh();
    } catch (error) {
      toast({ title: 'Error', description: 'No se pudo crear el link.', variant: 'destructive' });
    } finally {
      setIsCreating(null);
    }
  };

  const handleCopy = async (id: string) => {
    await navigator.clipboard.writeText(buildLinkUrl(id)).catch(() => {});
    toast({ title: 'Copiado', description: 'Link copiado al portapapeles.', variant: 'default' });
  };

  return (
    <Card className="p-6 space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Links de firma — Contrato Galcol (Propietarios)</h2>
          <p className="text-sm text-gray-600 mt-1">
            Genera un link por propietario. No necesita cuenta ni login: solo abre el link, llena
            sus datos y firma el contrato + NDA de una vez.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => handleCreate('B')}
            disabled={isCreating !== null}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isCreating === 'B' ? 'Creando…' : '+ Link Tipo B'}
          </Button>
          <Button
            onClick={() => handleCreate('D')}
            disabled={isCreating !== null}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            {isCreating === 'D' ? 'Creando…' : '+ Link Tipo D'}
          </Button>
        </div>
      </div>

      {isLoading ? (
        <p className="text-sm text-gray-500">Cargando…</p>
      ) : links.length === 0 ? (
        <p className="text-sm text-gray-500">Aún no has creado ningún link.</p>
      ) : (
        <div className="space-y-2">
          {links.map((link) => (
            <div
              key={link.id}
              className="flex items-center justify-between gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200"
            >
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-900">
                  Tipo {link.unitType} —{' '}
                  {link.status === 'signed' ? (
                    <span className="text-green-700">✓ Firmado{link.ownerName ? ` por ${link.ownerName}` : ''}</span>
                  ) : (
                    <span className="text-orange-600">Pendiente de firma</span>
                  )}
                </p>
                <p className="text-xs text-gray-500 truncate">{buildLinkUrl(link.id)}</p>
              </div>
              {link.status === 'pending' && (
                <Button variant="outline" size="sm" onClick={() => handleCopy(link.id)}>
                  Copiar link
                </Button>
              )}
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
