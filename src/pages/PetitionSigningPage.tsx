import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { DocumentText } from '@/components/DocumentText';
import { SignaturePad } from '@/components/SignaturePad';
import type { Petition, PetitionSignatureFormData } from '@/data/petition';
import { getPetition, signPetition } from '@/lib/petitionClient';

const EMPTY_FORM: PetitionSignatureFormData = {
  unitNumber: '',
  signerName: '',
  signerIdNumber: '',
  coefficientPct: '',
  consentMethod: 'Firma electrónica en línea (77Rentals)',
};

async function hashText(text: string): Promise<string> {
  const encoded = new TextEncoder().encode(text);
  const digest = await crypto.subtle.digest('SHA-256', encoded);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export default function PetitionSigningPage() {
  const { petitionId } = useParams<{ petitionId: string }>();
  const { toast } = useToast();

  const [petition, setPetition] = useState<Petition | null | 'not_found'>(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<PetitionSignatureFormData>(EMPTY_FORM);
  const [agreed, setAgreed] = useState(false);
  const [signatureImage, setSignatureImage] = useState<string | null>(null);
  const [isSigning, setIsSigning] = useState(false);
  const [signError, setSignError] = useState<string | null>(null);
  const [justSigned, setJustSigned] = useState(false);
  const [showCoefficientHelp, setShowCoefficientHelp] = useState(false);

  const load = () => {
    if (!petitionId) {
      setPetition('not_found');
      setLoading(false);
      return;
    }
    getPetition(petitionId)
      .then((result) => setPetition(result ?? 'not_found'))
      .catch(() => setPetition('not_found'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [petitionId]);

  const coefficientNumber = Number(form.coefficientPct.replace(',', '.'));
  const maxCoefficientPct = petition !== 'not_found' && petition ? petition.maxCoefficientPct : 100;
  const coefficientProvided = form.coefficientPct.trim().length > 0;
  const coefficientHasEnoughDecimals = /^\d+[.,]\d{4,}$/.test(form.coefficientPct.trim());
  const coefficientValid =
    !coefficientProvided ||
    (coefficientHasEnoughDecimals && coefficientNumber > 0 && coefficientNumber <= maxCoefficientPct);

  const isFormValid =
    form.unitNumber.trim().length > 0 &&
    form.signerName.trim().length > 1 &&
    coefficientValid &&
    !!signatureImage &&
    agreed;

  const handleSign = async () => {
    if (!petitionId || petition === 'not_found' || !petition) return;
    setSignError(null);
    if (!isFormValid || !signatureImage) {
      toast({
        title: 'Error',
        description: 'Completa tus datos, indica tu coeficiente, dibuja tu firma y acepta antes de continuar.',
        variant: 'destructive',
      });
      return;
    }

    setIsSigning(true);
    try {
      const hash = await hashText(petition.documentText);
      await signPetition(
        petitionId,
        { ...form, coefficientPct: coefficientProvided ? String(coefficientNumber) : '' },
        signatureImage,
        hash
      );
      setJustSigned(true);
      toast({
        title: 'Firmado',
        description: 'Tu firma quedó registrada correctamente en la solicitud.',
        variant: 'default',
      });
      load();
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

  if (petition === 'not_found' || !petition) {
    return (
      <div className="min-h-screen bg-[#f8f7ff] flex items-center justify-center p-6">
        <Card className="max-w-md w-full p-8 text-center">
          <h1 className="text-xl font-bold text-gray-900 mb-2">Link no encontrado</h1>
          <p className="text-gray-600 text-sm">Esta solicitud no existe o ya no está disponible.</p>
        </Card>
      </div>
    );
  }

  const progressPct = Math.min(100, (petition.totalCoefficientPct / petition.thresholdPct) * 100);

  return (
    <div className="min-h-screen bg-[#f8f7ff] py-10 px-4">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">{petition.title}</h1>
          <p className="text-gray-600 text-sm mt-1">77Rentals · Firma electrónica (Ley 527 de 1999)</p>
        </div>

        <Card className="p-4 space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-700 font-medium">
              {petition.signedCount} propietario{petition.signedCount === 1 ? '' : 's'} ha
              {petition.signedCount === 1 ? '' : 'n'} firmado
            </span>
            <span className="text-gray-700 font-medium">
              {petition.totalCoefficientPct.toFixed(4)}% de {petition.thresholdPct}% requerido
            </span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${progressPct >= 100 ? 'bg-green-600' : 'bg-[#D4A843]'}`}
              style={{ width: `${progressPct}%` }}
            />
          </div>
          {petition.rosterPublic && (
            <p className="text-center text-xs">
              <Link to={`/peticion/${petition.id}/firmantes`} className="text-[#2D1B69] underline">
                Ver quiénes han firmado →
              </Link>
            </p>
          )}
          {petition.status === 'closed' && (
            <p className="text-xs text-orange-600 font-medium">Esta solicitud fue cerrada y ya no admite más firmas.</p>
          )}
        </Card>

        {justSigned ? (
          <Card className="p-8 text-center space-y-3">
            <p className="text-green-700 font-semibold text-lg">✓ Tu firma quedó registrada correctamente.</p>
            <p className="text-gray-600 text-sm">
              Gracias por participar. Puedes cerrar esta página; no es necesario descargar nada — 77Rentals
              consolidará todas las firmas en un solo documento para entregarlo a la administración.
            </p>
          </Card>
        ) : (
          <>
            <Card className="p-4">
              <p className="text-sm text-gray-700">
                Revisa el documento a continuación. Completa tus datos como propietario y firma al final. No
                necesitas crear ninguna cuenta. Cada unidad privada puede firmar una sola vez.
              </p>
            </Card>

            <Card className="p-6 space-y-3">
              <div className="bg-white border border-gray-200 rounded-lg p-6 max-h-[32rem] overflow-y-auto shadow-inner">
                <DocumentText text={petition.documentText} />
              </div>
            </Card>

            {petition.status === 'open' && (
              <Card className="p-6 space-y-4">
                <h2 className="text-lg font-semibold text-gray-900">Tus datos y firma</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">Torre y Apartamento</label>
                    <input
                      type="text"
                      value={form.unitNumber}
                      onChange={(e) => setForm((f) => ({ ...f, unitNumber: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      placeholder="Ej: 1-101"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">Nombre completo</label>
                    <input
                      type="text"
                      value={form.signerName}
                      onChange={(e) => setForm((f) => ({ ...f, signerName: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      placeholder="Nombre y apellidos"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">Cédula (opcional)</label>
                    <input
                      type="text"
                      value={form.signerIdNumber}
                      onChange={(e) => setForm((f) => ({ ...f, signerIdNumber: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      placeholder="Ej: 79.719.972"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-1 flex items-center gap-1.5">
                      Coeficiente de tu unidad (%) <span className="text-gray-400 font-normal">(opcional)</span>
                      <button
                        type="button"
                        onClick={() => setShowCoefficientHelp((v) => !v)}
                        className="w-4 h-4 rounded-full bg-gray-200 text-gray-600 text-[10px] font-bold leading-4 text-center hover:bg-gray-300"
                        aria-label="¿Dónde encuentro mi coeficiente?"
                      >
                        ?
                      </button>
                    </label>
                    {showCoefficientHelp && (
                      <p className="text-xs text-gray-500 bg-gray-50 border border-gray-200 rounded-lg p-2 mb-2">
                        Es el porcentaje de participación de tu unidad en la copropiedad (no es el área en m²).
                        Lo encuentras en el <strong>certificado de tradición y libertad</strong> o la escritura
                        pública de tu inmueble, o en el <strong>reglamento de propiedad horizontal</strong> del
                        edificio (cuadro de coeficientes). Si tienes dudas, pregúntale a la administración.
                      </p>
                    )}
                    <input
                      type="text"
                      inputMode="decimal"
                      value={form.coefficientPct}
                      onChange={(e) => setForm((f) => ({ ...f, coefficientPct: e.target.value }))}
                      className={`w-full px-3 py-2 border rounded-lg ${
                        form.coefficientPct && !coefficientValid ? 'border-red-400' : 'border-gray-300'
                      }`}
                      placeholder="Ej: 0,1514"
                    />
                    {form.coefficientPct && !coefficientValid && !coefficientHasEnoughDecimals && (
                      <p className="text-xs text-red-600 mt-1">
                        Debe tener mínimo 4 decimales, tal como aparece en tu certificado (ej: 0,1514).
                      </p>
                    )}
                    {form.coefficientPct && !coefficientValid && coefficientHasEnoughDecimals && (
                      <p className="text-xs text-red-600 mt-1">
                        Debe ser un número entre 0 y {maxCoefficientPct}. Verifica tu certificado de tradición y
                        libertad — parece muy alto para una unidad de esta copropiedad.
                      </p>
                    )}
                  </div>
                </div>

                <SignaturePad label="Firma (dibuja con el mouse, dedo o lápiz óptico)" onChange={setSignatureImage} />

                {petition.rosterPublic && (
                  <p className="text-xs text-gray-500">
                    Tu nombre, unidad y fecha de firma serán visibles para los demás copropietarios en un listado
                    público de transparencia (no se publican tu cédula ni tu firma).
                  </p>
                )}

                <div className="flex items-start gap-3 pt-2">
                  <input
                    type="checkbox"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    id="agree-petition"
                    className="mt-1"
                  />
                  <label htmlFor="agree-petition" className="text-sm text-gray-700">
                    Declaro ser propietario de la unidad indicada y manifiesto expresamente mi voluntad de que sea
                    convocada la Asamblea General Extraordinaria descrita en el documento anterior. Entiendo que
                    esta aceptación constituye firma electrónica válida y vinculante (Ley 527 de 1999).
                  </label>
                </div>

                {signError && <p className="text-sm text-red-600">{signError}</p>}

                <Button
                  onClick={handleSign}
                  disabled={isSigning || !isFormValid}
                  className="w-full bg-[#D4A843] hover:bg-[#c9963e] text-black font-bold disabled:opacity-50"
                >
                  {isSigning ? 'Firmando…' : 'Firmar Solicitud'}
                </Button>
              </Card>
            )}
          </>
        )}

        <p className="text-center text-[11px] text-gray-400 pt-2">
          Tratamiento de datos personales: tu nombre, número de unidad, cédula (si la suministras), coeficiente y
          firma se recolectan únicamente para acreditar y tramitar esta solicitud de convocatoria ante la
          administración del Edificio Delventto P.H., de acuerdo con la Ley 1581 de 2012 y el Decreto 1377 de
          2013 (protección de datos personales / habeas data). Puedes ejercer tus derechos de conocer, actualizar,
          rectificar o solicitar la eliminación de tus datos contactando directamente a 77Rentals.
        </p>
      </div>
    </div>
  );
}
