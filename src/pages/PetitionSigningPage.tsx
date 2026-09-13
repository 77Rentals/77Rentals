import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { DocumentText } from '@/components/DocumentText';
import { SignaturePad } from '@/components/SignaturePad';
import type { Petition, PetitionSignatureFormData, PropertyType } from '@/data/petition';
import { getPetition, signPetition } from '@/lib/petitionClient';

const PROPERTY_TYPES: PropertyType[] = ['A', 'B', 'C', 'D'];

const EMPTY_FORM: PetitionSignatureFormData = {
  unitNumber: '',
  signerName: '',
  signerIdNumber: '',
  propertyType: 'A',
  apartmentCount: '1',
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

  const apartmentCountNumber = Number(form.apartmentCount);
  const apartmentCountValid = Number.isInteger(apartmentCountNumber) && apartmentCountNumber > 0;

  const isFormValid =
    form.unitNumber.trim().length > 0 &&
    form.signerName.trim().length > 1 &&
    apartmentCountValid &&
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
      await signPetition(petitionId, form, signatureImage, hash);
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

  return (
    <div className="min-h-screen bg-[#f8f7ff] py-10 px-4">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">{petition.title}</h1>
          <p className="text-gray-600 text-sm mt-1">77Rentals · Firma electrónica (Ley 527 de 1999)</p>
        </div>

        <Card className="p-4 space-y-1">
          <p className="text-center text-lg font-bold text-gray-900">
            {petition.signedCount} propietario{petition.signedCount === 1 ? '' : 's'} ha
            {petition.signedCount === 1 ? '' : 'n'} firmado
          </p>
          <p className="text-center text-xs text-gray-500">
            {petition.totalApartments} apartamento{petition.totalApartments === 1 ? '' : 's'} representado
            {petition.totalApartments === 1 ? '' : 's'}
          </p>
          {petition.rosterPublic && (
            <p className="text-center text-xs pt-1">
              <Link to={`/peticion/${petition.id}/firmantes`} className="text-[#2D1B69] underline">
                Ver quiénes han firmado →
              </Link>
            </p>
          )}
          {petition.status === 'closed' && (
            <p className="text-center text-xs text-orange-600 font-medium pt-1">
              Esta solicitud fue cerrada y ya no admite más firmas.
            </p>
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
                    <label className="block text-sm text-gray-700 mb-1">Unidad privada</label>
                    <input
                      type="text"
                      value={form.unitNumber}
                      onChange={(e) => setForm((f) => ({ ...f, unitNumber: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      placeholder="Ej: Apto 502"
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
                    <label className="block text-sm text-gray-700 mb-1">Tipo de Propiedad</label>
                    <select
                      value={form.propertyType}
                      onChange={(e) => setForm((f) => ({ ...f, propertyType: e.target.value as PropertyType }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white"
                    >
                      {PROPERTY_TYPES.map((type) => (
                        <option key={type} value={type}>
                          Tipo {type}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">¿Cuántos apartamentos?</label>
                    <input
                      type="number"
                      min={1}
                      step={1}
                      value={form.apartmentCount}
                      onChange={(e) => setForm((f) => ({ ...f, apartmentCount: e.target.value }))}
                      className={`w-full px-3 py-2 border rounded-lg ${
                        form.apartmentCount && !apartmentCountValid ? 'border-red-400' : 'border-gray-300'
                      }`}
                      placeholder="1"
                    />
                    {form.apartmentCount && !apartmentCountValid && (
                      <p className="text-xs text-red-600 mt-1">Debe ser un número entero mayor a 0</p>
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
      </div>
    </div>
  );
}
