import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import type { OwnerSigningFormData, OwnerSigningLink } from '@/data/ownerSigningLink';
import { getOwnerSigningLink, signOwnerSigningLink } from '@/lib/ownerSigningLinkClient';
import {
  formatForDisplay,
  generateGalcolContractText,
  generateGalcolNDAText,
  getUnitConfig,
  hashText,
} from '@/lib/galcolOwnerTemplates';

const EMPTY_FORM: OwnerSigningFormData = {
  ownerName: '',
  ownerIdNumber: '',
  ownerContactEmail: '',
  ownerContactPhone: '',
  buildingName: '',
  apartmentNumber: '',
  unitCount: 1,
};

const ID_NUMBER_PATTERN = /^\d[\d.]{4,}(-\d)?$/;

function downloadText(filename: string, text: string) {
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export default function OwnerSigningPage() {
  const { linkId } = useParams<{ linkId: string }>();
  const { toast } = useToast();

  const [link, setLink] = useState<OwnerSigningLink | null | 'not_found'>(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<OwnerSigningFormData>(EMPTY_FORM);
  const [agreed, setAgreed] = useState(false);
  const [isSigning, setIsSigning] = useState(false);
  const [signError, setSignError] = useState<string | null>(null);

  useEffect(() => {
    if (!linkId) {
      setLink('not_found');
      setLoading(false);
      return;
    }
    getOwnerSigningLink(linkId)
      .then((result) => setLink(result ?? 'not_found'))
      .catch(() => setLink('not_found'))
      .finally(() => setLoading(false));
  }, [linkId]);

  const previewData: OwnerSigningFormData = useMemo(
    () => ({
      ownerName: form.ownerName || '[Nombre del propietario]',
      ownerIdNumber: form.ownerIdNumber || '[C.C.]',
      ownerContactEmail: form.ownerContactEmail || '[correo]',
      ownerContactPhone: form.ownerContactPhone || '[teléfono]',
      buildingName: form.buildingName || '[Nombre del edificio]',
      apartmentNumber: form.apartmentNumber || '[Número de apartamento / torre]',
      unitCount: form.unitCount || 1,
    }),
    [form]
  );

  const contractText = useMemo(
    () => (link && link !== 'not_found' ? generateGalcolContractText(link.unitType, previewData) : ''),
    [link, previewData]
  );
  const ndaText = useMemo(
    () => (link && link !== 'not_found' ? generateGalcolNDAText(link.unitType, previewData) : ''),
    [link, previewData]
  );

  const idNumberError = form.ownerIdNumber.trim().length > 0 && !ID_NUMBER_PATTERN.test(form.ownerIdNumber.trim());

  const isFormValid =
    form.ownerName.trim().length > 1 &&
    ID_NUMBER_PATTERN.test(form.ownerIdNumber.trim()) &&
    form.ownerContactEmail.trim().includes('@') &&
    form.ownerContactPhone.trim().length >= 7 &&
    form.buildingName.trim().length > 1 &&
    form.apartmentNumber.trim().length > 0 &&
    form.unitCount >= 1 &&
    agreed;

  const handleSign = async () => {
    if (!linkId || link === 'not_found' || !link) return;
    setSignError(null);
    if (!isFormValid) {
      toast({
        title: 'Error',
        description: 'Completa todos los campos y acepta los términos antes de firmar.',
        variant: 'destructive',
      });
      return;
    }

    setIsSigning(true);
    try {
      const finalContractText = generateGalcolContractText(link.unitType, form);
      const finalNdaText = generateGalcolNDAText(link.unitType, form);
      const [contractHash, ndaHash] = await Promise.all([
        hashText(finalContractText),
        hashText(finalNdaText),
      ]);

      await signOwnerSigningLink(linkId, form, contractHash, ndaHash);

      setLink({
        id: linkId,
        unitType: link.unitType,
        status: 'signed',
        ownerName: form.ownerName,
        buildingName: form.buildingName,
        apartmentNumber: form.apartmentNumber,
        unitCount: form.unitCount,
        signedAt: new Date(),
      });

      toast({
        title: 'Firmado',
        description: 'El contrato y el NDA quedaron firmados correctamente. Puedes descargar tu copia abajo.',
        variant: 'default',
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'No se pudo firmar. Intenta de nuevo.';
      setSignError(message);
      toast({ title: 'Error', description: message, variant: 'destructive' });
    } finally {
      setIsSigning(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f7ff] flex items-center justify-center text-[#2D1B69]">
        Cargando…
      </div>
    );
  }

  if (link === 'not_found' || !link) {
    return (
      <div className="min-h-screen bg-[#f8f7ff] flex items-center justify-center p-6">
        <Card className="max-w-md w-full p-8 text-center">
          <h1 className="text-xl font-bold text-gray-900 mb-2">Link no encontrado</h1>
          <p className="text-gray-600 text-sm">
            Este link no existe o ya no está disponible. Contacta a 77Rentals para obtener un nuevo enlace.
          </p>
        </Card>
      </div>
    );
  }

  const cfg = getUnitConfig(link.unitType);

  return (
    <div className="min-h-screen bg-[#f8f7ff] py-10 px-4">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Contrato de Arriendo + NDA — {cfg.label}
          </h1>
          <p className="text-gray-600 text-sm mt-1">77Rentals · Pozos Colorados, Santa Marta</p>
        </div>

        {link.status === 'signed' ? (
          <Card className="p-8 text-center space-y-4">
            <p className="text-green-700 font-semibold text-lg">
              ✓ Ya firmaste el contrato y el NDA correspondientes a esta unidad.
            </p>
            {link.ownerName && (
              <p className="text-gray-600 text-sm">
                Firmado por {link.ownerName}
                {link.signedAt ? ` el ${link.signedAt.toLocaleDateString('es-CO')}` : ''}.
              </p>
            )}
            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <Button
                variant="outline"
                onClick={() => downloadText(`Contrato_Arriendo_${cfg.label.replace(/\s+/g, '_')}.txt`, contractText)}
              >
                📄 Descargar Contrato Firmado
              </Button>
              <Button
                variant="outline"
                onClick={() => downloadText(`NDA_${cfg.label.replace(/\s+/g, '_')}.txt`, ndaText)}
              >
                📄 Descargar NDA Firmado
              </Button>
            </div>
          </Card>
        ) : (
          <>
            <Card className="p-4">
              <p className="text-sm text-gray-700">
                Revisa el contrato y el acuerdo de confidencialidad (NDA) a continuación. Completa
                tus datos y los de tu unidad, y firma al final de la página. No necesitas crear
                ninguna cuenta.
              </p>
            </Card>

            <Card className="p-6 space-y-3">
              <h2 className="text-lg font-semibold text-gray-900">Contrato de Arriendo a Tarifa Fija</h2>
              <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto">
                <pre className="text-xs text-gray-700 whitespace-pre-wrap font-mono">
                  {formatForDisplay(contractText)}
                </pre>
              </div>
            </Card>

            <Card className="p-6 space-y-3">
              <h2 className="text-lg font-semibold text-gray-900">Acuerdo de Confidencialidad (NDA)</h2>
              <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto">
                <pre className="text-xs text-gray-700 whitespace-pre-wrap font-mono">
                  {formatForDisplay(ndaText)}
                </pre>
              </div>
            </Card>

            <Card className="p-6 space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">Tus datos y firma</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Nombre completo</label>
                  <input
                    type="text"
                    value={form.ownerName}
                    onChange={(e) => setForm((f) => ({ ...f, ownerName: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="Nombre y apellidos"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Cédula de ciudadanía</label>
                  <input
                    type="text"
                    value={form.ownerIdNumber}
                    onChange={(e) => setForm((f) => ({ ...f, ownerIdNumber: e.target.value }))}
                    className={`w-full px-3 py-2 border rounded-lg ${idNumberError ? 'border-red-400' : 'border-gray-300'}`}
                    placeholder="Ej: 79.719.972"
                  />
                  {idNumberError && <p className="text-xs text-red-600 mt-1">Formato inválido</p>}
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Correo electrónico</label>
                  <input
                    type="email"
                    value={form.ownerContactEmail}
                    onChange={(e) => setForm((f) => ({ ...f, ownerContactEmail: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="tucorreo@ejemplo.com"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Teléfono</label>
                  <input
                    type="tel"
                    value={form.ownerContactPhone}
                    onChange={(e) => setForm((f) => ({ ...f, ownerContactPhone: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="300 000 0000"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Edificio / Conjunto</label>
                  <input
                    type="text"
                    value={form.buildingName}
                    onChange={(e) => setForm((f) => ({ ...f, buildingName: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="Nombre del edificio, Pozos Colorados"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Apartamento / Torre</label>
                  <input
                    type="text"
                    value={form.apartmentNumber}
                    onChange={(e) => setForm((f) => ({ ...f, apartmentNumber: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="Ej: Torre A - Apto 407"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">
                    Número de unidades {cfg.label} que aportas
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={form.unitCount}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, unitCount: Math.max(1, parseInt(e.target.value, 10) || 1) }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="flex items-start gap-3 pt-2">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  id="agree-all"
                  className="mt-1"
                />
                <label htmlFor="agree-all" className="text-sm text-gray-700">
                  He leído y acepto la totalidad de las cláusulas del Contrato de Arriendo a Tarifa
                  Fija y del Acuerdo de Confidencialidad (NDA) anteriores. Entiendo que mi nombre,
                  cédula y esta aceptación constituyen firma electrónica válida y vinculante para
                  ambos documentos (Ley 527 de 1999).
                </label>
              </div>

              {signError && <p className="text-sm text-red-600">{signError}</p>}

              <Button
                onClick={handleSign}
                disabled={isSigning || !isFormValid}
                className="w-full bg-[#D4A843] hover:bg-[#c9963e] text-black font-bold disabled:opacity-50"
              >
                {isSigning ? 'Firmando…' : 'Firmar Contrato y NDA'}
              </Button>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
