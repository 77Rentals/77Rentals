import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import type { GuestRequirement, PartnershipResponse, ContractSignature, SigningStatus } from '@/data/partnerHub';
import {
  generateContractTemplate,
  formatContractForDisplay,
  hashContractText,
} from '@/lib/contractGenerator';
import { sendContractNotificationEmail } from '@/lib/emailService';

interface ContractSigningSectionProps {
  response: PartnershipResponse;
  requirement: GuestRequirement;
  adminName?: string;
  isAdmin: boolean;
  onSign: (signerName: string, signerIdNumber: string, contractHash: string) => Promise<SigningStatus>;
}

// Colombian cédula/NIT: digits, optionally with dots and a NIT check digit
// (e.g. "79.719.972" or "900.123.456-7"). Loose on purpose — this only
// guards against empty/garbage input, not a full NIT checksum.
const ID_NUMBER_PATTERN = /^\d[\d.]{4,}(-\d)?$/;

export function ContractSigningSection({
  response,
  requirement,
  adminName,
  isAdmin,
  onSign,
}: ContractSigningSectionProps) {
  const [signerName, setSignerName] = useState('');
  const [signerIdNumber, setSignerIdNumber] = useState('');
  const [isAgreed, setIsAgreed] = useState(false);
  const [isSigning, setIsSigning] = useState(false);
  const { language } = useLanguage();
  const { toast } = useToast();

  const contractStatus = response.contractStatus || 'not_started';
  const hasAdminSigned = !!response.adminContractSignature;
  const hasOwnerSigned = !!response.ownerContractSignature;
  const isBothSigned = contractStatus === 'both_signed';

  const contractTemplate = generateContractTemplate(
    requirement,
    response,
    adminName,
    response.adminContractSignature,
    response.ownerContractSignature
  );

  const canDownload = (isAdmin && hasAdminSigned) || (!isAdmin && hasOwnerSigned) || isBothSigned;

  const idNumberError =
    signerIdNumber.trim().length > 0 && !ID_NUMBER_PATTERN.test(signerIdNumber.trim());

  const handleSign = async () => {
    const trimmedName = signerName.trim();
    const trimmedId = signerIdNumber.trim();

    if (!trimmedName) {
      toast({
        title: 'Error',
        description: language === 'es' ? 'Por favor ingresa tu nombre completo' : 'Please enter your full name',
        variant: 'destructive',
      });
      return;
    }

    if (!trimmedId || !ID_NUMBER_PATTERN.test(trimmedId)) {
      toast({
        title: 'Error',
        description: language === 'es'
          ? 'Ingresa un número de cédula o NIT válido'
          : 'Enter a valid ID (cédula/NIT) number',
        variant: 'destructive',
      });
      return;
    }

    if (!isAgreed) {
      toast({
        title: 'Error',
        description: language === 'es' ? 'Debes aceptar los términos del contrato' : 'You must agree to the contract terms',
        variant: 'destructive',
      });
      return;
    }

    setIsSigning(true);
    try {
      // Hash the exact text this party is agreeing to right now, so a later
      // edit to the template can never silently change what was signed.
      const contractHash = await hashContractText(contractTemplate);
      // The RPC recomputes status server-side from the actual signature
      // rows and returns it -- trust that instead of guessing client-side.
      const newStatus = await onSign(trimmedName, trimmedId, contractHash);

      const signature: ContractSignature = {
        signedBy: isAdmin ? 'admin' : 'owner',
        signerName: trimmedName,
        signerIdNumber: trimmedId,
        timestamp: new Date(),
        contractHash,
        userAgent: navigator.userAgent,
      };
      const responseWithNewSig: PartnershipResponse = {
        ...response,
        ...(isAdmin ? { adminContractSignature: signature } : { ownerContractSignature: signature }),
        contractStatus: newStatus,
      };
      sendContractNotificationEmail(
        newStatus as 'admin_signed' | 'owner_signed' | 'both_signed',
        responseWithNewSig,
        requirement
      ).catch(() => {});

      toast({
        title: language === 'es' ? 'Éxito' : 'Success',
        description: language === 'es' ? 'Contrato firmado correctamente' : 'Contract signed successfully',
        variant: 'default',
      });

      setSignerName('');
      setSignerIdNumber('');
      setIsAgreed(false);
    } catch (error) {
      toast({
        title: 'Error',
        description: language === 'es' ? 'No se pudo firmar el contrato' : 'Failed to sign the contract',
        variant: 'destructive',
      });
    } finally {
      setIsSigning(false);
    }
  };

  const showSignatureForm =
    (isAdmin && !hasAdminSigned) || (!isAdmin && !hasOwnerSigned && hasAdminSigned);

  return (
    <Card className="border-t pt-6 mt-6">
      <div className="space-y-6 p-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {language === 'es' ? 'Contrato de Servicio de Alquiler Turístico de Inmueble' : 'Fixed-Rate Lease Contract'}
          </h3>
          <p className="text-xs text-gray-500 mb-4">
            {language === 'es'
              ? 'Documento vinculante entre 77Rentals y el propietario para esta reserva. Complementa el NDA.'
              : 'Binding document between 77Rentals and the owner for this booking. Complements the NDA.'}
          </p>

          {/* Contract Text — updates in real-time as signatures are added */}
          <div className="bg-gray-50 rounded-lg p-4 mb-4 max-h-96 overflow-y-auto">
            <pre className="text-xs text-gray-700 whitespace-pre-wrap font-mono">
              {formatContractForDisplay(contractTemplate)}
            </pre>
          </div>

          {/* Signature Status */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="p-3 bg-gray-50 rounded">
              <p className="text-sm text-gray-600 mb-1">
                {language === 'es' ? 'Firma de 77Rentals' : '77Rentals Signature'}
              </p>
              {hasAdminSigned && response.adminContractSignature ? (
                <p className="font-medium text-green-600">
                  ✓ {response.adminContractSignature.signerName}
                </p>
              ) : (
                <p className="text-gray-400">{language === 'es' ? 'Pendiente' : 'Pending'}</p>
              )}
            </div>

            <div className="p-3 bg-gray-50 rounded">
              <p className="text-sm text-gray-600 mb-1">
                {language === 'es' ? 'Firma del Propietario' : 'Owner Signature'}
              </p>
              {hasOwnerSigned && response.ownerContractSignature ? (
                <p className="font-medium text-green-600">
                  ✓ {response.ownerContractSignature.signerName}
                </p>
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
                onClick={() => downloadSignedContract(contractTemplate, response)}
              >
                📄 {language === 'es' ? 'Descargar Contrato Firmado' : 'Download Signed Contract'}
              </Button>
            </div>
          )}

          {/* Signature Form */}
          {showSignatureForm && (
            <div className="space-y-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                <div>
                  <label className="block text-sm text-gray-700 mb-2">
                    {language === 'es' ? 'Cédula o NIT' : 'ID (Cédula/NIT)'}
                  </label>
                  <input
                    type="text"
                    value={signerIdNumber}
                    onChange={(e) => setSignerIdNumber(e.target.value)}
                    placeholder={language === 'es' ? 'Ej: 79.719.972' : 'e.g. 79.719.972'}
                    className={`w-full px-3 py-2 border rounded-lg ${
                      idNumberError ? 'border-red-400' : 'border-gray-300'
                    }`}
                  />
                  {idNumberError && (
                    <p className="text-xs text-red-600 mt-1">
                      {language === 'es' ? 'Formato de documento inválido' : 'Invalid ID format'}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={isAgreed}
                  onChange={(e) => setIsAgreed(e.target.checked)}
                  id="agree-contract"
                  className="mt-1"
                />
                <label htmlFor="agree-contract" className="text-sm text-gray-700">
                  {language === 'es'
                    ? 'He leído y acepto la totalidad de las cláusulas del Contrato de Servicio de Alquiler Turístico de Inmueble. Entiendo que mi nombre, documento de identidad y la aceptación aquí registrada constituyen firma electrónica válida y vinculante (Ley 527 de 1999).'
                    : 'I have read and accept all clauses of the Fixed-Rate Lease Contract. I understand my name, ID number, and this acceptance constitute a valid, binding electronic signature (Ley 527 de 1999).'}
                </label>
              </div>

              <Button
                onClick={handleSign}
                disabled={isSigning}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-60"
              >
                {isSigning
                  ? (language === 'es' ? 'Firmando...' : 'Signing...')
                  : (language === 'es' ? 'Firmar Contrato' : 'Sign Contract')}
              </Button>
            </div>
          )}

          {/* Post-Signature (both signed) */}
          {isBothSigned && (
            <div className="p-4 bg-green-50 rounded-lg border border-green-200 mt-4">
              <p className="font-semibold text-green-900">
                ✓ {language === 'es'
                  ? 'Ambas partes han firmado el Contrato de Servicio de Alquiler Turístico de Inmueble'
                  : 'Both parties have signed the Fixed-Rate Lease Contract'}
              </p>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}

function downloadSignedContract(contractTemplate: string, response: PartnershipResponse) {
  const blob = new Blob([contractTemplate], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `Contrato_Servicio_Alquiler_Turistico_${response.propertyName.replace(/\s+/g, '_')}_${Date.now()}.txt`;
  link.click();
  URL.revokeObjectURL(url);
}
