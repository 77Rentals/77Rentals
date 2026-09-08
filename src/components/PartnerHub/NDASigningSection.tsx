import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { SignaturePad } from '@/components/SignaturePad';
import type { GuestRequirement, PartnershipResponse, NDASignature, SigningStatus } from '@/data/partnerHub';
import { generateNDATemplate, formatNDAForDisplay } from '@/lib/ndaGenerator';
import { generateWhatsAppLink } from '@/lib/whatsappHelper';
import { sendNDANotificationEmail } from '@/lib/emailService';
import { downloadDocumentPdf, type PdfSignature } from '@/lib/pdfGenerator';

interface NDASigningSectionProps {
  response: PartnershipResponse;
  requirement: GuestRequirement;
  adminName?: string;
  isAdmin: boolean;
  onSign: (signerName: string, signatureImage: string) => Promise<SigningStatus>;
}

export function NDASigningSection({
  response,
  requirement,
  adminName,
  isAdmin,
  onSign,
}: NDASigningSectionProps) {
  const [signerName, setSignerName] = useState('');
  const [isAgreed, setIsAgreed] = useState(false);
  const [signatureImage, setSignatureImage] = useState<string | null>(null);
  const [isSigning, setIsSigning] = useState(false);
  const { language } = useLanguage();
  const { toast } = useToast();

  const ndaTemplate = generateNDATemplate(requirement, response, adminName);
  const isBothSigned = response.ndaStatus === 'both_signed';
  const hasAdminSigned = response.adminSignature !== undefined;
  const hasOwnerSigned = response.ownerSignature !== undefined;

  // Show download button as soon as THIS party has signed
  const canDownload =
    (isAdmin && hasAdminSigned) || (!isAdmin && hasOwnerSigned) || isBothSigned;

  const handleSign = async () => {
    if (!signerName.trim()) {
      toast({
        title: 'Error',
        description: language === 'es'
          ? 'Por favor ingresa tu nombre completo'
          : 'Please enter your full name',
        variant: 'destructive',
      });
      return;
    }

    if (!signatureImage) {
      toast({
        title: 'Error',
        description: language === 'es' ? 'Por favor dibuja tu firma' : 'Please draw your signature',
        variant: 'destructive',
      });
      return;
    }

    if (!isAgreed) {
      toast({
        title: 'Error',
        description: language === 'es'
          ? 'Debes aceptar los términos del acuerdo'
          : 'You must agree to the terms',
        variant: 'destructive',
      });
      return;
    }

    setIsSigning(true);
    try {
      // The RPC recomputes status server-side from the actual signature
      // rows and returns it -- trust that instead of guessing client-side
      // from (possibly stale) props, which previously mislabeled "owner
      // signed first" as 'not_started' and could send the wrong email.
      const newStatus = await onSign(signerName.trim(), signatureImage);

      // Fire-and-forget email notification — never blocks signing flow
      const signature: NDASignature = {
        signedBy: isAdmin ? 'admin' : 'owner',
        signerName: signerName.trim(),
        timestamp: new Date(),
        signatureImage,
      };
      const responseWithNewSig: PartnershipResponse = {
        ...response,
        ...(isAdmin ? { adminSignature: signature } : { ownerSignature: signature }),
        ndaStatus: newStatus,
      };
      sendNDANotificationEmail(
        newStatus as 'admin_signed' | 'owner_signed' | 'both_signed',
        responseWithNewSig,
        requirement
      ).catch(() => {});

      toast({
        title: language === 'es' ? 'Éxito' : 'Success',
        description: language === 'es' ? 'NDA firmado correctamente' : 'NDA signed successfully',
        variant: 'default',
      });

      setSignerName('');
      setIsAgreed(false);
      setSignatureImage(null);
    } catch (error) {
      toast({
        title: 'Error',
        description: language === 'es' ? 'No se pudo firmar el NDA' : 'Failed to sign NDA',
        variant: 'destructive',
      });
    } finally {
      setIsSigning(false);
    }
  };

  const showSignatureForm =
    (isAdmin && !hasAdminSigned) ||
    (!isAdmin && !hasOwnerSigned && hasAdminSigned);

  const whatsappLink = isBothSigned
    ? generateWhatsAppLink(
        response.ownerContact.phone,
        response.ownerContact.name,
        response.propertyName,
        requirement.checkInDate,
        requirement.checkOutDate
      )
    : '';

  return (
    <Card className="border-t pt-6 mt-6">
      <div className="space-y-6 p-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {language === 'es'
              ? 'Acuerdo de Confidencialidad (NDA)'
              : 'Non-Disclosure Agreement (NDA)'}
          </h3>

          {/* NDA Text — updates in real-time as signatures are added */}
          <div className="bg-gray-50 rounded-lg p-4 mb-4 max-h-64 overflow-y-auto">
            <pre className="text-xs text-gray-700 whitespace-pre-wrap font-mono">
              {formatNDAForDisplay(ndaTemplate)}
            </pre>
          </div>

          {/* Signature Status */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="p-3 bg-gray-50 rounded">
              <p className="text-sm text-gray-600 mb-1">
                {language === 'es' ? 'Firma del Intermediario' : 'Admin Signature'}
              </p>
              {hasAdminSigned && response.adminSignature ? (
                <div>
                  <p className="font-medium text-green-600">
                    ✓ {response.adminSignature.signerName}
                  </p>
                  {response.adminSignature.signatureImage && (
                    <img
                      src={response.adminSignature.signatureImage}
                      alt=""
                      className="h-10 mt-1 border border-gray-200 rounded bg-white"
                    />
                  )}
                </div>
              ) : (
                <p className="text-gray-400">{language === 'es' ? 'Pendiente' : 'Pending'}</p>
              )}
            </div>

            <div className="p-3 bg-gray-50 rounded">
              <p className="text-sm text-gray-600 mb-1">
                {language === 'es' ? 'Firma del Propietario' : 'Owner Signature'}
              </p>
              {hasOwnerSigned && response.ownerSignature ? (
                <div>
                  <p className="font-medium text-green-600">
                    ✓ {response.ownerSignature.signerName}
                  </p>
                  {response.ownerSignature.signatureImage && (
                    <img
                      src={response.ownerSignature.signatureImage}
                      alt=""
                      className="h-10 mt-1 border border-gray-200 rounded bg-white"
                    />
                  )}
                </div>
              ) : (
                <p className="text-gray-400">{language === 'es' ? 'Pendiente' : 'Pending'}</p>
              )}
            </div>
          </div>

          {/* Download button — visible as soon as this party has signed */}
          {canDownload && (
            <div className="mb-4">
              <Button
                variant="outline"
                className="w-full border-gray-300"
                onClick={() => downloadSignedNDA(ndaTemplate, response)}
              >
                📄 {language === 'es' ? 'Descargar NDA Firmado' : 'Download Signed NDA'}
              </Button>
            </div>
          )}

          {/* Signature Form */}
          {showSignatureForm && (
            <div className="space-y-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  {language === 'es' ? 'Tu Nombre Completo' : 'Your Full Name'}
                </label>
                <input
                  type="text"
                  value={signerName}
                  onChange={(e) => setSignerName(e.target.value)}
                  placeholder={language === 'es' ? 'Ingresa tu nombre' : 'Enter your name'}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>

              <SignaturePad
                label={language === 'es' ? 'Firma' : 'Signature'}
                clearLabel={language === 'es' ? 'Borrar y firmar de nuevo' : 'Clear and sign again'}
                onChange={setSignatureImage}
              />

              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={isAgreed}
                  onChange={(e) => setIsAgreed(e.target.checked)}
                  id="agree-nda"
                  className="mt-1"
                />
                <label htmlFor="agree-nda" className="text-sm text-gray-700">
                  {language === 'es'
                    ? 'Acepto los términos del Acuerdo de Confidencialidad'
                    : 'I agree to the terms of the Non-Disclosure Agreement'}
                </label>
              </div>

              <Button
                onClick={handleSign}
                disabled={isSigning}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-60"
              >
                {isSigning
                  ? (language === 'es' ? 'Firmando...' : 'Signing...')
                  : (language === 'es' ? 'Firmar NDA' : 'Sign NDA')}
              </Button>
            </div>
          )}

          {/* Post-Signature (both signed) — contact info + WhatsApp */}
          {isBothSigned && (
            <div className="space-y-4 p-4 bg-green-50 rounded-lg border border-green-200 mt-4">
              <p className="font-semibold text-green-900">
                ✓{' '}
                {language === 'es'
                  ? 'Ambas partes han firmado el NDA'
                  : 'Both parties have signed the NDA'}
              </p>

              {/* Owner Contact Info (Unlocked) */}
              <div className="bg-white rounded p-3 border border-green-200">
                <p className="text-sm text-gray-600 mb-2">
                  {language === 'es' ? 'Contacto del Propietario' : 'Owner Contact'}
                </p>
                <p className="font-medium text-gray-900">{response.ownerContact.name}</p>
                <p className="text-sm text-gray-600">{response.ownerContact.phone}</p>
                <p className="text-sm text-gray-600">{response.ownerContact.email}</p>
              </div>

              {/* WhatsApp Button */}
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded"
              >
                {language === 'es' ? '💬 Enviar por WhatsApp' : '💬 Send via WhatsApp'}
              </a>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}

function downloadSignedNDA(ndaTemplate: string, response: PartnershipResponse) {
  const signatures: PdfSignature[] = [];
  if (response.adminSignature?.signatureImage) {
    signatures.push({ roleLabel: 'INTERMEDIARIO', signatureImage: response.adminSignature.signatureImage });
  }
  if (response.ownerSignature?.signatureImage) {
    signatures.push({ roleLabel: 'PROPIETARIO', signatureImage: response.ownerSignature.signatureImage });
  }
  downloadDocumentPdf(
    ndaTemplate,
    `NDA_Firmado_${response.propertyName.replace(/\s+/g, '_')}_${Date.now()}.pdf`,
    signatures
  );
}
