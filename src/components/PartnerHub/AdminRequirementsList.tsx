import { useState } from 'react';
import { usePartnerHub } from '@/hooks/usePartnerHub';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, Check, X, Edit2, Trash2, CheckCircle, Eye } from 'lucide-react';
import { EditRequirementForm } from './EditRequirementForm';
import { AdminOfferDetailModal } from './AdminOfferDetailModal';
import type { GuestRequirement, PartnershipResponse } from '@/data/partnerHub';

const MONTHS_ES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
const MONTHS_EN = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function formatDateDisplay(dateString: string, language: string): string {
  if (!dateString) return '';
  const [year, month, day] = dateString.split('-');
  const monthIndex = parseInt(month, 10) - 1;
  const monthName = language === 'es' ? MONTHS_ES[monthIndex] : MONTHS_EN[monthIndex];
  return `${parseInt(day, 10)} ${monthName} ${year}`;
}

function formatCOP(amount: number): string {
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(amount);
}

export function AdminRequirementsList() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedResponse, setSelectedResponse] = useState<PartnershipResponse | null>(null);
  const [selectedRequirement, setSelectedRequirement] = useState<GuestRequirement | null>(null);
  const { language } = useLanguage();
  const { getRequirements, getResponses, updateRequirement, updateResponse, deleteRequirement } =
    usePartnerHub();

  const requirements = getRequirements();
  const allResponses = getResponses();

  const handleAcceptResponse = (responseId: string, requirementId: string) => {
    updateResponse(responseId, { status: 'accepted' });
    // Mark requirement as successful when first response is accepted
    const req = requirements.find((r) => r.id === requirementId);
    if (req?.status === 'open') {
      updateRequirement(requirementId, { status: 'successful' });
    }
  };

  const handleRejectResponse = (responseId: string) => {
    updateResponse(responseId, { status: 'rejected' });
  };

  const handleMarkSuccessful = (requirementId: string) => {
    if (window.confirm(language === 'es'
      ? '¿Marcar como exitoso?'
      : 'Mark as successful?')) {
      updateRequirement(requirementId, { status: 'successful' });
    }
  };

  const handleCancel = (requirementId: string) => {
    if (window.confirm(language === 'es'
      ? '¿Cancelar este requisito?'
      : 'Cancel this requirement?')) {
      updateRequirement(requirementId, { status: 'cancelled' });
    }
  };

  const handleDelete = (requirementId: string) => {
    if (window.confirm(language === 'es'
      ? '¿Eliminar este requisito permanentemente?'
      : 'Permanently delete this requirement?')) {
      deleteRequirement(requirementId);
    }
  };

  const handleEditSave = (requirementId: string, updates: Partial<GuestRequirement>) => {
    updateRequirement(requirementId, updates);
    setEditingId(null);
  };

  const handleViewOfferDetails = (response: PartnershipResponse, requirement: GuestRequirement) => {
    setSelectedResponse(response);
    setSelectedRequirement(requirement);
  };

  const handleCloseModal = () => {
    setSelectedResponse(null);
    setSelectedRequirement(null);
  };

  if (requirements.length === 0) {
    return (
      <Card className="p-12 text-center">
        <p className="text-gray-600">
          {language === 'es'
            ? 'Sin requisitos aún. Publica tu primer requisito para comenzar.'
            : 'No requirements yet. Post your first guest requirement to get started.'}
        </p>
      </Card>
    );
  }

  return (
    <>
      <div className="space-y-3">
        {requirements.map((requirement) => {
        const isExpanded = expandedId === requirement.id;
        const requirementResponses = allResponses.filter(
          (r) => r.requirementId === requirement.id
        );
        const acceptedCount = requirementResponses.filter(
          (r) => r.status === 'accepted'
        ).length;
        const pendingCount = requirementResponses.filter(
          (r) => r.status === 'pending'
        ).length;

        return (
          <Card key={requirement.id} className="overflow-hidden border-0 shadow-md">
            {/* Main Row */}
            <button
              onClick={() =>
                setExpandedId(isExpanded ? null : requirement.id)
              }
              className="w-full p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0">
                  {isExpanded ? (
                    <ChevronUp className="text-gray-600" />
                  ) : (
                    <ChevronDown className="text-gray-600" />
                  )}
                </div>

                <div className="flex-1 text-left">
                  <div className="flex items-center gap-3 mb-1">
                    <div className="font-semibold text-gray-900">
                      {formatDateDisplay(requirement.checkInDate, language)} → {formatDateDisplay(requirement.checkOutDate, language)}
                    </div>
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        requirement.status === 'open'
                          ? 'bg-green-100 text-green-800'
                          : requirement.status === 'successful'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {requirement.status === 'open'
                        ? (language === 'es' ? 'Abierto' : 'Open')
                        : requirement.status === 'successful'
                        ? (language === 'es' ? 'Exitoso' : 'Successful')
                        : (language === 'es' ? 'Cancelado' : 'Cancelled')}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    {requirement.guestCount} {language === 'es' ? 'huéspedes' : 'guests'} • {formatCOP(requirement.budget)}/{language === 'es' ? 'noche' : 'night'}
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-semibold text-gray-900">
                    {requirementResponses.length}
                  </div>
                  <div className="text-xs text-gray-600">{language === 'es' ? 'respuestas' : 'responses'}</div>
                </div>
              </div>
            </button>

            {/* Expanded Content */}
            {isExpanded && (
              <>
                {editingId === requirement.id ? (
                  <EditRequirementForm
                    requirement={requirement}
                    onSave={(updates) => handleEditSave(requirement.id, updates)}
                    onCancel={() => setEditingId(null)}
                  />
                ) : (
                  <div className="border-t bg-gray-50 p-4 space-y-4">
                    {/* Requirement Details */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">{language === 'es' ? 'Contacto' : 'Admin Contact'}</p>
                    <p className="font-medium text-gray-900">
                      {requirement.adminContact.name}
                    </p>
                    <p className="text-gray-600 text-xs">
                      {requirement.adminContact.email}
                    </p>
                    <p className="text-gray-600 text-xs">
                      {requirement.adminContact.phone}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">{language === 'es' ? 'Notas' : 'Notes'}</p>
                    <p className="text-gray-900">{requirement.notes || (language === 'es' ? 'Ninguna' : 'None')}</p>
                  </div>
                </div>

                {/* Responses */}
                {requirementResponses.length > 0 && (
                  <div className="pt-4 border-t">
                    <h4 className="font-semibold text-gray-900 mb-3">
                      {language === 'es' ? 'Respuestas' : 'Responses'} ({requirementResponses.length})
                    </h4>
                    <div className="space-y-2">
                      {requirementResponses.map((response) => (
                        <div
                          key={response.id}
                          className="p-3 bg-white rounded-lg border border-gray-200"
                        >
                          <div className="flex items-start gap-3">
                            <div className="flex-1">
                              <div className="font-medium text-gray-900">
                                {response.propertyName}
                              </div>
                              <div className="text-sm text-gray-600 mt-1">
                                {formatCOP(response.proposedPrice)}/{language === 'es' ? 'noche' : 'night'} •{' '}
                                <span
                                  className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
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
                              </div>
                              <div className="text-xs text-gray-600 mt-1">
                                {response.commissionPercent === 10
                                  ? (language === 'es' ? '10% comisión' : '10% commission')
                                  : `${formatCOP(response.commissionAmount)} markup`}
                                {' • '}
                                {language === 'es' ? 'Final' : 'Final'}: {formatCOP(response.finalPrice)}/{language === 'es' ? 'noche' : 'night'}
                              </div>
                              <div className="text-xs text-gray-600 mt-2">
                                <strong>{response.ownerContact.name}</strong> •{' '}
                                {response.ownerContact.email}
                              </div>
                            </div>

                            <div className="flex gap-1">
                              <Button
                                size="sm"
                                onClick={() => handleViewOfferDetails(response, requirement)}
                                className="bg-blue-600 hover:bg-blue-700 text-white h-8 w-8 p-0"
                                title={language === 'es' ? 'Ver detalles' : 'View details'}
                              >
                                <Eye size={16} />
                              </Button>
                              {response.status === 'pending' && (
                                <>
                                  <Button
                                    size="sm"
                                    onClick={() =>
                                      handleAcceptResponse(response.id, requirement.id)
                                    }
                                    className="bg-green-600 hover:bg-green-700 text-white h-8 w-8 p-0"
                                  >
                                    <Check size={16} />
                                  </Button>
                                  <Button
                                    size="sm"
                                    onClick={() => handleRejectResponse(response.id)}
                                    className="bg-red-600 hover:bg-red-700 text-white h-8 w-8 p-0"
                                  >
                                    <X size={16} />
                                  </Button>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                    {requirementResponses.length === 0 && (
                      <div className="text-center py-6 text-gray-600">
                        <p className="text-sm">{language === 'es' ? 'Sin respuestas aún' : 'No responses yet'}</p>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="pt-4 border-t flex gap-2">
                      {requirement.status === 'open' && (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setEditingId(requirement.id)}
                            className="flex items-center gap-2"
                          >
                            <Edit2 size={16} />
                            {language === 'es' ? 'Editar' : 'Edit'}
                          </Button>
                          <Button
                            size="sm"
                            className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
                            onClick={() => handleMarkSuccessful(requirement.id)}
                          >
                            <CheckCircle size={16} />
                            {language === 'es' ? 'Marcar Exitoso' : 'Mark Successful'}
                          </Button>
                        </>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleCancel(requirement.id)}
                        disabled={requirement.status !== 'open'}
                        className="flex items-center gap-2"
                      >
                        {language === 'es' ? 'Cancelar' : 'Cancel'}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(requirement.id)}
                        className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 size={16} />
                        {language === 'es' ? 'Eliminar' : 'Delete'}
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </Card>
        );
      })}
    </div>

    {selectedResponse && selectedRequirement && (
      <AdminOfferDetailModal
        response={selectedResponse}
        requirement={selectedRequirement}
        onClose={handleCloseModal}
        onStatusChange={() => {
          // Refresh requirements to get latest data
          handleCloseModal();
        }}
      />
    )}
    </>
  );
}
