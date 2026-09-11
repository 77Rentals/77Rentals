import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { DocumentText } from '@/components/DocumentText';
import { SignaturePad } from '@/components/SignaturePad';
import type { ClientSigningFormData, ClientSigningLink } from '@/data/clientSigningLink';
import { getClientSigningLink, signClientSigningLink } from '@/lib/clientSigningLinkClient';
import { downloadDocumentPdf } from '@/lib/pdfGenerator';

const EMPTY_FORM: ClientSigningFormData = {
  clientName: '',
  clientIdNumber: '',
  clientContactEmail: '',
  clientContactPhone: '',
};

const ID_NUMBER_PATTERN = /^\d[\d.]{4,}(-\d)?$/;

async function hashText(text: string): Promise<string> {
  const encoded = new TextEncoder().encode(text);
  const digest = await crypto.subtle.digest('SHA-256', encoded);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export default function ClientSigningPage() {
  const { linkId } = useParams<{ linkId: string }>();
  const { toast } = useToast();

  const [link, setLink] = useState<ClientSigningLink | null | 'not_found'>(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<ClientSigningFormData>(EMPTY_FORM);
  const [agreed, setAgreed] = useState(false);
  const [signatureImage, setSignatureImage] = useState<string | null>(null);
  const [isSigning, setIsSigning] = useState(false);
  const [signError, setSignError] = useState<string | null>(null);

  useEffect(() => {
    if (!linkId) {
      setLink('not_found');
      setLoading(false);
      return;
    }
    getClientSigningLink(linkId)
      .then((result) => setLink(result ?? 'not_found'))
      .catch(() => setLink('not_found'))
      .finally(() => setLoading(false));
  }, [linkId]);

  const idNumberError = form.clientIdNumber.trim().length > 0 && !ID_NUMBER_PATTERN.test(form.clientIdNumber.trim());

  const isFormValid =
    form.clientName.trim().length > 1 &&
    ID_NUMBER_PATTERN.test(form.clientIdNumber.trim()) &&
    form.clientContactEmail.trim().includes('@') &&
    form.clientContactPhone.trim().length >= 7 &&
    !!signatureImage &&
    agreed;

  const handleSign = async () => {
    if (!linkId || link === 'not_found' || !link) return;
    setSignError(null);
    if (!isFormValid || !signatureImage) {
      toast({
        title: 'Error',
        description: 'Completa todos los campos, dibuja tu firma y acepta los términos antes de firmar.',
        variant: 'destructive',
      });
      return;
    }

    setIsSigning(true);
    try {
      const contractHash = await hashText(link.contractText);
      await signClientSigningLink(linkId, form, contractHash, signatureImage);

      setLink({ ...link, status: 'signed', clientName: form.clientName, signedAt: new Date(), signatureImage });

      toast({
        title: 'Firmado',
        description: 'El documento quedó firmado correctamente. Puedes descargar tu copia abajo.',
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

  return (
    <div className="min-h-screen bg-[#f8f7ff] py-10 px-4">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">{link.title}</h1>
          <p className="text-gray-600 text-sm mt-1">77Rentals</p>
        </div>

        {link.status === 'signed' ? (
          <Card className="p-8 text-center space-y-4">
            <p className="text-green-700 font-semibold text-lg">✓ Documento firmado correctamente.</p>
            {link.clientName && (
              <p className="text-gray-600 text-sm">
                Firmado por {link.clientName}
                {link.signedAt ? ` el ${link.signedAt.toLocaleDateString('es-CO')}` : ''}.
              </p>
            )}
            {link.signatureImage && (
              <div className="flex justify-center">
                <img
                  src={link.signatureImage}
                  alt="Firma"
                  className="border border-gray-200 rounded-lg bg-white max-w-xs w-full"
                />
              </div>
            )}
            <div className="flex justify-center pt-2">
              <Button
                variant="outline"
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
                📄 Descargar Documento Firmado
              </Button>
            </div>
          </Card>
        ) : (
          <>
            <Card className="p-4">
              <p className="text-sm text-gray-700">
                Revisa el documento a continuación. Completa tus datos y firma al final de la página. No
                necesitas crear ninguna cuenta.
              </p>
            </Card>

            <Card className="p-6 space-y-3">
              <div className="bg-white border border-gray-200 rounded-lg p-6 max-h-[32rem] overflow-y-auto shadow-inner">
                <DocumentText text={link.contractText} />
              </div>
            </Card>

            <Card className="p-6 space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">Tus datos y firma</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Nombre completo</label>
                  <input
                    type="text"
                    value={form.clientName}
                    onChange={(e) => setForm((f) => ({ ...f, clientName: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="Nombre y apellidos"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Cédula o NIT</label>
                  <input
                    type="text"
                    value={form.clientIdNumber}
                    onChange={(e) => setForm((f) => ({ ...f, clientIdNumber: e.target.value }))}
                    className={`w-full px-3 py-2 border rounded-lg ${idNumberError ? 'border-red-400' : 'border-gray-300'}`}
                    placeholder="Ej: 79.719.972"
                  />
                  {idNumberError && <p className="text-xs text-red-600 mt-1">Formato inválido</p>}
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Correo electrónico</label>
                  <input
                    type="email"
                    value={form.clientContactEmail}
                    onChange={(e) => setForm((f) => ({ ...f, clientContactEmail: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="tucorreo@ejemplo.com"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Teléfono</label>
                  <input
                    type="tel"
                    value={form.clientContactPhone}
                    onChange={(e) => setForm((f) => ({ ...f, clientContactPhone: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="300 000 0000"
                  />
                </div>
              </div>

              <SignaturePad label="Firma (dibuja con el mouse, dedo o lápiz óptico)" onChange={setSignatureImage} />

              <div className="flex items-start gap-3 pt-2">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  id="agree-all"
                  className="mt-1"
                />
                <label htmlFor="agree-all" className="text-sm text-gray-700">
                  He leído y acepto la totalidad de las cláusulas del documento anterior. Entiendo que mi
                  nombre, documento de identidad y esta aceptación constituyen firma electrónica válida y
                  vinculante (Ley 527 de 1999).
                </label>
              </div>

              {signError && <p className="text-sm text-red-600">{signError}</p>}

              <Button
                onClick={handleSign}
                disabled={isSigning || !isFormValid}
                className="w-full bg-[#D4A843] hover:bg-[#c9963e] text-black font-bold disabled:opacity-50"
              >
                {isSigning ? 'Firmando…' : 'Firmar Documento'}
              </Button>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
