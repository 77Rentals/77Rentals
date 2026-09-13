import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import type { Petition, PetitionSignature } from '@/data/petition';
import {
  createPetition,
  deletePetition,
  deletePetitionSignature,
  listPetitionSignatures,
  listPetitions,
  setPetitionRosterPublic,
  setPetitionStatus,
} from '@/lib/petitionClient';
import { downloadPetitionPdf } from '@/lib/petitionPdfGenerator';

function buildLinkUrl(id: string): string {
  return `${window.location.origin}/peticion/${id}`;
}

function buildRosterUrl(id: string): string {
  return `${window.location.origin}/peticion/${id}/firmantes`;
}

export function AdminPetitionManager() {
  const [petitions, setPetitions] = useState<Petition[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [documentText, setDocumentText] = useState('');
  const [thresholdPct, setThresholdPct] = useState('20');
  const [isCreating, setIsCreating] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [signatures, setSignatures] = useState<PetitionSignature[]>([]);
  const [isLoadingSignatures, setIsLoadingSignatures] = useState(false);
  const { toast } = useToast();

  const refresh = () => {
    setIsLoading(true);
    listPetitions()
      .then(setPetitions)
      .catch(() => toast({ title: 'Error', description: 'No se pudieron cargar las solicitudes.', variant: 'destructive' }))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCreate = async () => {
    const threshold = Number(thresholdPct);
    if (!title.trim() || !documentText.trim() || !threshold || threshold <= 0 || threshold > 100) {
      toast({
        title: 'Error',
        description: 'Completa el título, el texto del documento y un umbral válido (1-100).',
        variant: 'destructive',
      });
      return;
    }
    setIsCreating(true);
    try {
      const id = await createPetition(title.trim(), documentText.trim(), threshold);
      await navigator.clipboard.writeText(buildLinkUrl(id)).catch(() => {});
      toast({ title: 'Solicitud creada', description: 'Se copió el link al portapapeles.', variant: 'default' });
      setTitle('');
      setDocumentText('');
      setThresholdPct('20');
      setShowForm(false);
      refresh();
    } catch {
      toast({ title: 'Error', description: 'No se pudo crear la solicitud.', variant: 'destructive' });
    } finally {
      setIsCreating(false);
    }
  };

  const handleCopy = async (id: string) => {
    await navigator.clipboard.writeText(buildLinkUrl(id)).catch(() => {});
    toast({ title: 'Copiado', description: 'Link copiado al portapapeles.', variant: 'default' });
  };

  const handleCopyRoster = async (id: string) => {
    await navigator.clipboard.writeText(buildRosterUrl(id)).catch(() => {});
    toast({ title: 'Copiado', description: 'Link del listado de firmantes copiado al portapapeles.', variant: 'default' });
  };

  const handleToggleRosterPublic = async (petition: Petition) => {
    try {
      await setPetitionRosterPublic(petition.id, !petition.rosterPublic);
      refresh();
    } catch {
      toast({ title: 'Error', description: 'No se pudo cambiar la visibilidad del listado.', variant: 'destructive' });
    }
  };

  const handleToggleExpand = async (id: string) => {
    if (expandedId === id) {
      setExpandedId(null);
      return;
    }
    setExpandedId(id);
    setIsLoadingSignatures(true);
    try {
      setSignatures(await listPetitionSignatures(id));
    } catch {
      toast({ title: 'Error', description: 'No se pudieron cargar las firmas.', variant: 'destructive' });
    } finally {
      setIsLoadingSignatures(false);
    }
  };

  const handleDeleteSignature = async (sigId: string, petitionId: string) => {
    try {
      await deletePetitionSignature(sigId);
      setSignatures((prev) => prev.filter((s) => s.id !== sigId));
      refresh();
      toast({ title: 'Eliminada', description: 'Firma eliminada; esa unidad puede volver a firmar.', variant: 'default' });
    } catch {
      toast({ title: 'Error', description: 'No se pudo eliminar la firma.', variant: 'destructive' });
    }
  };

  const handleToggleStatus = async (petition: Petition) => {
    const next = petition.status === 'open' ? 'closed' : 'open';
    try {
      await setPetitionStatus(petition.id, next);
      refresh();
    } catch {
      toast({ title: 'Error', description: 'No se pudo cambiar el estado.', variant: 'destructive' });
    }
  };

  const handleDeletePetition = async (id: string) => {
    try {
      await deletePetition(id);
      if (expandedId === id) setExpandedId(null);
      refresh();
      toast({ title: 'Eliminada', description: 'Solicitud eliminada.', variant: 'default' });
    } catch {
      toast({ title: 'Error', description: 'No se pudo eliminar la solicitud.', variant: 'destructive' });
    }
  };

  const handleExport = async (petition: Petition) => {
    try {
      const sigs = expandedId === petition.id ? signatures : await listPetitionSignatures(petition.id);
      downloadPetitionPdf(petition, sigs, `${petition.title.replace(/\s+/g, '_')}.pdf`);
    } catch {
      toast({ title: 'Error', description: 'No se pudo generar el PDF.', variant: 'destructive' });
    }
  };

  return (
    <Card className="p-6 space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Solicitudes con Múltiples Firmantes</h2>
          <p className="text-sm text-gray-600 mt-1">
            Un solo link para que muchos propietarios firmen el mismo documento (ej. convocatoria a
            asamblea extraordinaria). Cada uno indica su unidad, coeficiente y firma; no necesitan cuenta.
          </p>
        </div>
        <Button
          onClick={() => setShowForm((v) => !v)}
          className="bg-[#D4A843] hover:bg-[#c9963e] text-black font-bold"
        >
          {showForm ? 'Cancelar' : '+ Nueva Solicitud'}
        </Button>
      </div>

      {showForm && (
        <div className="space-y-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div>
            <label className="block text-sm text-gray-700 mb-1">Título (visible para los firmantes)</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              placeholder='Ej: "Solicitud de Convocatoria de Asamblea Extraordinaria — Edificio Delventto P.H."'
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">
              Texto del documento (separa los párrafos con una línea en blanco)
            </label>
            <textarea
              value={documentText}
              onChange={(e) => setDocumentText(e.target.value)}
              rows={12}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg font-mono text-xs"
              placeholder="Pega aquí el texto completo de la solicitud..."
            />
          </div>
          <div className="max-w-xs">
            <label className="block text-sm text-gray-700 mb-1">Umbral de coeficiente requerido (%)</label>
            <input
              type="text"
              inputMode="decimal"
              value={thresholdPct}
              onChange={(e) => setThresholdPct(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="20"
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
      ) : petitions.length === 0 ? (
        <p className="text-sm text-gray-500">Aún no has creado ninguna solicitud.</p>
      ) : (
        <div className="space-y-2">
          {petitions.map((petition) => {
            const progressPct = Math.min(100, (petition.totalCoefficientPct / petition.thresholdPct) * 100);
            const isExpanded = expandedId === petition.id;
            return (
              <div key={petition.id} className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="flex items-center justify-between gap-3 p-3 bg-gray-50">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {petition.title}{' '}
                      <span className={petition.status === 'open' ? 'text-green-700' : 'text-gray-500'}>
                        · {petition.status === 'open' ? 'Abierta' : 'Cerrada'}
                      </span>
                    </p>
                    <p className="text-xs text-gray-500 truncate">{buildLinkUrl(petition.id)}</p>
                    <div className="mt-1.5 flex items-center gap-2">
                      <div className="w-40 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${progressPct >= 100 ? 'bg-green-600' : 'bg-[#D4A843]'}`}
                          style={{ width: `${progressPct}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-600">
                        {petition.signedCount} firmas · {petition.totalCoefficientPct.toFixed(2)}% / {petition.thresholdPct}% ·{' '}
                        <span className={petition.rosterPublic ? 'text-green-700' : 'text-gray-500'}>
                          Listado {petition.rosterPublic ? 'público' : 'privado'}
                        </span>
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2 flex-shrink-0 flex-wrap justify-end">
                    <Button variant="outline" size="sm" onClick={() => handleCopy(petition.id)}>
                      Copiar link
                    </Button>
                    {petition.rosterPublic && (
                      <Button variant="outline" size="sm" onClick={() => handleCopyRoster(petition.id)}>
                        Copiar link de firmantes
                      </Button>
                    )}
                    <Button variant="outline" size="sm" onClick={() => handleToggleRosterPublic(petition)}>
                      {petition.rosterPublic ? 'Hacer listado privado' : 'Hacer listado público'}
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleToggleExpand(petition.id)}>
                      {isExpanded ? 'Ocultar firmas' : 'Ver firmas'}
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleExport(petition)}>
                      📄 Exportar PDF
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleToggleStatus(petition)}>
                      {petition.status === 'open' ? 'Cerrar' : 'Reabrir'}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600 border-red-300 hover:bg-red-50"
                      onClick={() => handleDeletePetition(petition.id)}
                    >
                      Eliminar
                    </Button>
                  </div>
                </div>

                {isExpanded && (
                  <div className="p-3 bg-white border-t border-gray-200 overflow-x-auto">
                    {isLoadingSignatures ? (
                      <p className="text-sm text-gray-500">Cargando firmas…</p>
                    ) : signatures.length === 0 ? (
                      <p className="text-sm text-gray-500">Nadie ha firmado todavía.</p>
                    ) : (
                      <table className="w-full text-xs">
                        <thead>
                          <tr className="text-left text-gray-500 border-b border-gray-200">
                            <th className="py-1 pr-3">Unidad</th>
                            <th className="py-1 pr-3">Nombre</th>
                            <th className="py-1 pr-3">Coef. %</th>
                            <th className="py-1 pr-3">Fecha</th>
                            <th className="py-1 pr-3">Firma</th>
                            <th className="py-1"></th>
                          </tr>
                        </thead>
                        <tbody>
                          {signatures.map((sig) => (
                            <tr key={sig.id} className="border-b border-gray-100">
                              <td className="py-1.5 pr-3 font-medium">{sig.unitNumber}</td>
                              <td className="py-1.5 pr-3">{sig.signerName}</td>
                              <td className="py-1.5 pr-3">{sig.coefficientPct.toFixed(3)}</td>
                              <td className="py-1.5 pr-3">{sig.signedAt.toLocaleDateString('es-CO')}</td>
                              <td className="py-1.5 pr-3">
                                <img src={sig.signatureImage} alt="Firma" className="h-6 border border-gray-200 rounded bg-white" />
                              </td>
                              <td className="py-1.5">
                                <button
                                  className="text-red-600 hover:underline"
                                  onClick={() => handleDeleteSignature(sig.id, petition.id)}
                                >
                                  Eliminar
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}
