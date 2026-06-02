import { useState } from 'react';
import { createPortal } from 'react-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { usePartnerHub } from '@/hooks/usePartnerHub';
import { X, Check, AlertCircle, ExternalLink } from 'lucide-react';
import type { GuestRequirement, PartnershipResponse, NDASignature } from '@/data/partnerHub';
import { NDASigningSection } from './NDASigningSection';

const MONTHS_ES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
const MONTHS_EN = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function formatDateDisplay(dateString: string, language: string): string {
  if (!dateString) return '';
  const [year, month, day] = dateString.split('-');
  const monthIndex = parseInt(month, 10) - 1;
  const monthName = language === 'es' ? MONTHS_ES[monthIndex] : MONTHS_EN[monthIndex];
  return `${parseInt(day, 10)} ${monthName} ${year}`;
}

function formatDateRange(checkIn: string, checkOut: string, language: string): string {
  if (!checkIn || !checkOut) return '';
  const [inYear, inMonth, inDay] = checkIn.split('-');
  const [outYear, outMonth, outDay] = checkOut.split('-');

  const inMonthIndex = parseInt(inMonth, 10) - 1;
  const outMonthIndex = parseInt(outMonth, 10) - 1;
  const inMonthName = language === 'es' ? MONTHS_ES[inMonthIndex] : MONTHS_EN[inMonthIndex];
  const outMonthName = language === 'es' ? MONTHS_ES[outMonthIndex] : MONTHS_EN[outMonthIndex];

  if (inMonth === outMonth) {
    return `${inMonthName} ${parseInt(inDay, 10)} – ${parseInt(outDay, 10)}, ${inYear}`;
  }
  return `${inMonthName} ${parseInt(inDay, 10)} – ${outMonthName} ${parseInt(outDay, 10)}, ${inYear}`;
}

function formatCOP(amount: number): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0
  }).format(amount);
}

interface AdminOfferDetailModalProps {
  response: PartnershipResponse;
  requirement: GuestRequirement;
  onClose: () => void;
  onStatusChange?: () => void;
}

export function AdminOfferDetailModal({
  response,
  requirement,
  onClose,
  onStatusChange,
}: AdminOfferDetailModalProps) {
  const [rejectionNote, setRejectionNote] = useState('');
  const { language } = useLanguage();
  const { updateResponse } = usePartnerHub();
  const { toast } = useToast();

  const handleAccept = () => {
    try {
      updateResponse(response.id, {
        status: 'accepted',
        ndaStatus: 'not_started',
        adminSignature: undefined,
        ownerSignature: undefined,
      });
      toast({
        title: language === 'es' ? 'Éxito' : 'Success',
        description: language === 'es'
          ? 'Oferta aceptada'
          : 'Offer accepted',
        variant: 'default',
      });
      onStatusChange?.();
    } catch (error) {
      toast({
        title: language === 'es' ? 'Error' : 'Error',
        description: language === 'es'
          ? 'No se pudo aceptar la oferta'
          : 'Failed to accept offer',
        variant: 'destructive',
      });
    }
  };

  const handleReject = () => {
    try {
      updateResponse(response.id, {
        status: 'rejected',
        ...(rejectionNote.trim() ? { rejectionNote: rejectionNote.trim() } : {}),
      });
      toast({
        title: language === 'es' ? 'Éxito' : 'Success',
        description: language === 'es'
          ? 'Oferta rechazada'
          : 'Offer rejected',
        variant: 'default',
      });
      onStatusChange?.();
      onClose();
    } catch (error) {
      toast({
        title: language === 'es' ? 'Error' : 'Error',
        description: language === 'es'
          ? 'No se pudo rechazar la oferta'
          : 'Failed to reject offer',
        variant: 'destructive',
      });
    }
  };

  const nightCount = Math.ceil(
    (new Date(requirement.checkOutDate).getTime() - new Date(requirement.checkInDate).getTime()) /
    (1000 * 60 * 60 * 24)
  );

  return createPortal(
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">
            {language === 'es' ? 'Detalles de la Oferta' : 'Offer Details'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Status Badge */}
          <div className="flex items-center justify-between">
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                response.status === 'pending'
                  ? 'bg-yellow-100 text-yellow-800'
                  : response.status === 'accepted'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}
            >
              {response.status === 'pending'
                ? (language === 'es' ? 'Pendiente' : 'Pending')
                : response.status === 'accepted'
                ? (language === 'es' ? 'Aceptada' : 'Accepted')
                : (language === 'es' ? 'Rechazada' : 'Rejected')}
            </span>
            <div className="text-sm text-gray-600">
              {language === 'es' ? 'Respondido' : 'Responded'}: {formatDateDisplay(
                new Date(response.respondedAt).toISOString().split('T')[0],
                language
              )}
            </div>
          </div>

          {/* Requirement Info */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {language === 'es' ? 'Requisito de Huésped' : 'Guest Requirement'}
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">{language === 'es' ? 'Fechas' : 'Dates'}</p>
                <p className="font-medium text-gray-900">
                  {formatDateRange(requirement.checkInDate, requirement.checkOutDate, language)}
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  {nightCount} {language === 'es' ? 'noche(s)' : 'night(s)'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">{language === 'es' ? 'Huéspedes' : 'Guests'}</p>
                <p className="font-medium text-gray-900">{requirement.guestCount}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">{language === 'es' ? 'Presupuesto' : 'Budget'}</p>
                <p className="font-medium text-gray-900">
                  {formatCOP(requirement.budget)} / {language === 'es' ? 'noche' : 'night'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">{language === 'es' ? 'Ciudad' : 'City'}</p>
                <p className="font-medium text-gray-900">{requirement.city}</p>
              </div>
              {requirement.notes && (
                <div className="col-span-2">
                  <p className="text-sm text-gray-600 mb-1">{language === 'es' ? 'Notas' : 'Notes'}</p>
                  <p className="text-gray-900 text-sm">{requirement.notes}</p>
                </div>
              )}
            </div>
          </div>

          {/* Property Info */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {language === 'es' ? 'Información de la Propiedad' : 'Property Information'}
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">{language === 'es' ? 'Propiedad' : 'Property'}</p>
                <p className="font-medium text-gray-900">{response.propertyName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">{language === 'es' ? 'Tipo de Apartamento' : 'Apartment Type'}</p>
                <p className="font-medium text-gray-900">{response.apartmentType || 'N/A'}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-gray-600 mb-1">{language === 'es' ? 'Enlace de Fotos' : 'Photos Link'}</p>
                <a
                  href={response.googleDriveLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
                >
                  {language === 'es' ? 'Ver en Google Drive' : 'View on Google Drive'}
                  <ExternalLink size={16} />
                </a>
              </div>
              {response.iCalLink && (
                <div className="col-span-2">
                  <p className="text-sm text-gray-600 mb-1">{language === 'es' ? 'Disponibilidad' : 'Availability'}</p>
                  <a
                    href={response.iCalLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
                  >
                    📅 {language === 'es' ? 'Ver Calendario' : 'View Calendar'}
                    <ExternalLink size={16} />
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Pricing Breakdown */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {language === 'es' ? 'Desglose de Precios' : 'Pricing Breakdown'}
            </h3>
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">
                  {language === 'es' ? 'Precio por Noche' : 'Price Per Night'}
                </span>
                <span className="font-medium text-gray-900">
                  {formatCOP(response.proposedPrice)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">
                  {language === 'es' ? 'Noches' : 'Nights'}
                </span>
                <span className="font-medium text-gray-900">
                  {nightCount}
                </span>
              </div>
              <div className="flex justify-between items-center border-t pt-2">
                <span className="text-gray-600">
                  {language === 'es' ? 'Subtotal (hospedaje)' : 'Subtotal (lodging)'}
                </span>
                <span className="font-medium text-gray-900">
                  {formatCOP(response.proposedPrice * nightCount)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">
                  {response.commissionPercent === 10
                    ? (language === 'es' ? 'Comisión (10% del hospedaje)' : 'Commission (10% of lodging)')
                    : (language === 'es' ? 'Recargo' : 'Markup')}
                </span>
                <span className="font-medium text-gray-900">
                  {response.commissionPercent === 10
                    ? `- ${formatCOP(response.proposedPrice * nightCount * 0.1)}`
                    : `+ ${formatCOP(response.commissionAmount)}`}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">
                  {language === 'es' ? 'Tarifa de Limpieza (una sola vez)' : 'Cleaning Fee (one-time)'}
                </span>
                <span className="font-medium text-gray-900">
                  + {formatCOP(response.cleaningFee || 0)}
                </span>
              </div>
              <div className="border-t pt-2 flex justify-between items-center bg-white p-2 rounded">
                <span className="font-semibold text-gray-900">
                  {language === 'es' ? 'Total a Pagar' : 'Total Amount'}
                </span>
                <span className="font-semibold text-lg text-gray-900">
                  {formatCOP(
                    (response.commissionPercent === 10
                      ? response.proposedPrice * nightCount * 0.9
                      : response.proposedPrice * nightCount + response.commissionAmount) + (response.cleaningFee || 0)
                  )}
                </span>
              </div>
            </div>
          </div>

          {/* Owner Contact */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {language === 'es' ? 'Contacto del Propietario' : 'Owner Contact'}
            </h3>
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <div>
                <p className="text-sm text-gray-600">{language === 'es' ? 'Nombre' : 'Name'}</p>
                <p className="font-medium text-gray-900">{response.ownerContact.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">{language === 'es' ? 'Email' : 'Email'}</p>
                <a href={`mailto:${response.ownerContact.email}`} className="text-blue-600 hover:text-blue-700 font-medium">
                  {response.ownerContact.email}
                </a>
              </div>
              <div>
                <p className="text-sm text-gray-600">{language === 'es' ? 'Teléfono' : 'Phone'}</p>
                <a href={`tel:${response.ownerContact.phone}`} className="text-blue-600 hover:text-blue-700 font-medium">
                  {response.ownerContact.phone}
                </a>
              </div>
            </div>
          </div>

          {/* Notes */}
          {response.notes && (
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {language === 'es' ? 'Notas del Propietario' : 'Owner Notes'}
              </h3>
              <p className="text-gray-900 bg-gray-50 p-4 rounded-lg">{response.notes}</p>
            </div>
          )}

          {/* NDA Signing Section - Appears after acceptance */}
          {response.status === 'accepted' && (
            <NDASigningSection
              response={response}
              requirement={requirement}
              adminName={requirement.adminContact.name}
              isAdmin={true}
              onSignatureUpdate={(updates) => {
                try {
                  updateResponse(response.id, updates);
                  toast({
                    title: language === 'es' ? 'Éxito' : 'Success',
                    description: language === 'es' ? 'NDA actualizado' : 'NDA updated',
                    variant: 'default',
                  });
                  onStatusChange?.();
                } catch (error) {
                  toast({
                    title: language === 'es' ? 'Error' : 'Error',
                    description: language === 'es' ? 'No se pudo actualizar NDA' : 'Failed to update NDA',
                    variant: 'destructive',
                  });
                }
              }}
            />
          )}

          {/* Action Buttons - Only if pending */}
          {response.status === 'pending' && (
            <div className="border-t pt-6 space-y-4">
              {/* Optional rejection note */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {language === 'es' ? 'Razón del rechazo (opcional)' : 'Rejection reason (optional)'}
                </label>
                <textarea
                  value={rejectionNote}
                  onChange={(e) => setRejectionNote(e.target.value)}
                  placeholder={language === 'es'
                    ? 'Explica por qué rechazas esta oferta...'
                    : 'Explain why you are rejecting this offer...'}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-300"
                />
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={handleAccept}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white flex items-center justify-center gap-2"
                >
                  <Check size={18} />
                  {language === 'es' ? 'Aceptar Oferta' : 'Accept Offer'}
                </Button>
                <Button
                  onClick={handleReject}
                  variant="outline"
                  className="flex-1 border-red-600 text-red-600 hover:bg-red-50"
                >
                  {language === 'es' ? 'Rechazar' : 'Reject'}
                </Button>
                <Button
                  onClick={onClose}
                  variant="outline"
                  className="flex-1"
                >
                  {language === 'es' ? 'Cerrar' : 'Close'}
                </Button>
              </div>
            </div>
          )}

          {/* Rejection note display - when viewing a rejected offer */}
          {response.status === 'rejected' && response.rejectionNote && (
            <div className="border-t pt-6">
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm font-medium text-red-800 mb-1">
                  {language === 'es' ? 'Razón del rechazo:' : 'Rejection reason:'}
                </p>
                <p className="text-sm text-red-700">{response.rejectionNote}</p>
              </div>
            </div>
          )}

          {/* Close Button - After NDA signed or if rejected */}
          {response.status !== 'pending' && (
            <div className="border-t pt-6">
              <Button
                onClick={onClose}
                variant="outline"
                className="w-full"
              >
                {language === 'es' ? 'Cerrar' : 'Close'}
              </Button>
            </div>
          )}
        </div>
      </Card>
    </div>,
    document.body
  );
}
