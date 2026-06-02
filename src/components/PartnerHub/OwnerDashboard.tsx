import { useContext, useState } from 'react';
import { usePartnerHub } from '@/hooks/usePartnerHub';
import { PartnerAuthContext } from '@/contexts/PartnerAuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/components/ui/use-toast';
import { Card } from '@/components/ui/card';
import { TrendingUp, MessageSquare, CheckCircle, Clock } from 'lucide-react';
import { OwnerRequirementBrowser } from './OwnerRequirementBrowser';
import { OwnerProfile } from './OwnerProfile';
import { OwnerPropertyManager } from './OwnerPropertyManager';
import { NDASigningSection } from './NDASigningSection';
import type { PartnershipResponse, GuestRequirement } from '@/data/partnerHub';
import { generateNDATemplate } from '@/lib/ndaGenerator';

type TabType = 'browse' | 'responses' | 'profile' | 'properties';
type ResponseFilter = 'all' | 'pending' | 'accepted' | 'rejected';

export function OwnerDashboard() {
  const [activeTab, setActiveTab] = useState<TabType>('browse');
  const [responseFilter, setResponseFilter] = useState<ResponseFilter>('all');
  const [responseRefreshKey, setResponseRefreshKey] = useState(0);
  const auth = useContext(PartnerAuthContext);
  const { getRequirements, getResponses, updateResponse } = usePartnerHub();

  const requirements = getRequirements();
  const allResponses = getResponses();
  const ownerResponses = allResponses.filter(
    (r) => r.ownerContact.email === auth?.userEmail
  );

  const openRequirements = requirements.filter((r) => r.status === 'open').length;
  const pendingResponses = ownerResponses.filter((r) => r.status === 'pending').length;
  const acceptedResponses = ownerResponses.filter((r) => r.status === 'accepted').length;
  const rejectedResponses = ownerResponses.filter((r) => r.status === 'rejected').length;

  const stats = [
    {
      label: 'Open Requirements',
      value: openRequirements,
      icon: TrendingUp,
      color: 'from-blue-500 to-blue-600',
    },
    {
      label: 'Pending Responses',
      value: pendingResponses,
      icon: Clock,
      color: 'from-yellow-500 to-yellow-600',
    },
    {
      label: 'Accepted',
      value: acceptedResponses,
      icon: CheckCircle,
      color: 'from-green-500 to-green-600',
    },
    {
      label: 'Total Responses',
      value: ownerResponses.length,
      icon: MessageSquare,
      color: 'from-purple-500 to-purple-600',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Owner Dashboard</h1>
        <p className="text-gray-600 mt-1">
          Browse guest requirements and submit your property offers
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card
              key={stat.label}
              className="p-6 border-0 shadow-md hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => {
                if (stat.label === 'Open Requirements') {
                  setActiveTab('browse');
                } else if (stat.label === 'Pending Responses') {
                  setActiveTab('responses');
                  setResponseFilter('pending');
                } else if (stat.label === 'Accepted') {
                  setActiveTab('responses');
                  setResponseFilter('accepted');
                } else if (stat.label === 'Total Responses') {
                  setActiveTab('responses');
                  setResponseFilter('all');
                }
              }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {stat.value}
                  </p>
                </div>
                <div className={`bg-gradient-to-br ${stat.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex gap-4 flex-wrap">
          <button
            onClick={() => setActiveTab('browse')}
            className={`px-4 py-3 font-medium border-b-2 transition-colors ${
              activeTab === 'browse'
                ? 'border-[#D4A843] text-[#D4A843]'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Browse Requirements
          </button>
          <button
            onClick={() => setActiveTab('responses')}
            className={`px-4 py-3 font-medium border-b-2 transition-colors ${
              activeTab === 'responses'
                ? 'border-[#D4A843] text-[#D4A843]'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            My Responses ({ownerResponses.length})
          </button>
          <button
            onClick={() => setActiveTab('properties')}
            className={`px-4 py-3 font-medium border-b-2 transition-colors ${
              activeTab === 'properties'
                ? 'border-[#D4A843] text-[#D4A843]'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            My Properties
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-3 font-medium border-b-2 transition-colors ${
              activeTab === 'profile'
                ? 'border-[#D4A843] text-[#D4A843]'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            My Profile
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'browse' && <OwnerRequirementBrowser />}
        {activeTab === 'responses' && (
          <MyResponses
            key={responseRefreshKey}
            responses={ownerResponses}
            requirements={requirements}
            initialFilter={responseFilter}
            onNDAUpdate={(responseId, updates) => {
              updateResponse(responseId, updates);
              setResponseRefreshKey((k) => k + 1);
            }}
          />
        )}
        {activeTab === 'properties' && auth?.userEmail && <OwnerPropertyManager ownerId={auth.userEmail} />}
        {activeTab === 'profile' && auth?.userEmail && <OwnerProfile ownerId={auth.userEmail} />}
      </div>
    </div>
  );
}

function formatCOP(amount: number): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(amount);
}

function MyResponses({
  responses,
  requirements,
  initialFilter = 'all',
  onNDAUpdate,
}: {
  responses: PartnershipResponse[];
  requirements: GuestRequirement[];
  initialFilter?: 'all' | 'pending' | 'accepted' | 'rejected';
  onNDAUpdate: (responseId: string, updates: Partial<PartnershipResponse>) => void;
}) {
  const { language } = useLanguage();
  const { toast } = useToast();
  const [filter, setFilter] = useState<'all' | 'pending' | 'accepted' | 'rejected'>(initialFilter);

  const visible = filter === 'all' ? responses : responses.filter((r) => r.status === filter);

  const filterLabels: Record<typeof filter, string> = {
    all: language === 'es' ? 'Todas' : 'All',
    pending: language === 'es' ? 'Pendientes' : 'Pending',
    accepted: language === 'es' ? 'Aceptadas' : 'Accepted',
    rejected: language === 'es' ? 'Rechazadas' : 'Rejected',
  };

  if (responses.length === 0) {
    return (
      <Card className="p-12 text-center">
        <p className="text-gray-600">
          {language === 'es'
            ? 'Aún no has enviado ninguna respuesta. ¡Explora requisitos para comenzar!'
            : "You haven't submitted any responses yet. Browse requirements to get started!"}
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filter pills */}
      <div className="flex gap-2 flex-wrap">
        {(['all', 'pending', 'accepted', 'rejected'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              filter === f
                ? f === 'accepted'
                  ? 'bg-green-600 text-white'
                  : f === 'rejected'
                  ? 'bg-red-600 text-white'
                  : f === 'pending'
                  ? 'bg-yellow-500 text-white'
                  : 'bg-gray-800 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {filterLabels[f]}
            {f !== 'all' && (
              <span className="ml-1 opacity-75">
                ({responses.filter((r) => r.status === f).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {visible.length === 0 && (
        <Card className="p-8 text-center">
          <p className="text-gray-500 text-sm">
            {language === 'es'
              ? `No hay respuestas ${filterLabels[filter].toLowerCase()}.`
              : `No ${filterLabels[filter].toLowerCase()} responses.`}
          </p>
        </Card>
      )}

      {visible.map((response) => {
        const requirement = requirements.find((r) => r.id === response.requirementId);
        const ndaStatus = response.ndaStatus || 'not_started';
        const adminHasSigned = !!response.adminSignature;
        const ownerHasSigned = !!response.ownerSignature;
        const needsOwnerSignature = response.status === 'accepted' && adminHasSigned && !ownerHasSigned;
        const bothSigned = ndaStatus === 'both_signed';

        return (
          <Card key={response.id} className="border-0 shadow-md overflow-hidden">
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {response.propertyName}
                  </h3>
                  <div className="mt-2 space-y-1 text-sm text-gray-600">
                    <p>
                      {language === 'es' ? 'Precio propuesto' : 'Proposed Price'}:{' '}
                      {formatCOP(response.proposedPrice)}/{language === 'es' ? 'noche' : 'night'}
                    </p>
                    <p>
                      {language === 'es' ? 'Comisión' : 'Commission'}:{' '}
                      {response.commissionPercent === 10 ? '10%' : formatCOP(response.commissionAmount)} •{' '}
                      {language === 'es' ? 'Precio final' : 'Final Price'}:{' '}
                      {formatCOP(response.finalPrice)}/{language === 'es' ? 'noche' : 'night'}
                    </p>
                  </div>

                  {/* NDA status indicator for accepted offers */}
                  {response.status === 'accepted' && (
                    <div className="mt-3">
                      {bothSigned ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium">
                          ✓ {language === 'es' ? 'NDA Firmado' : 'NDA Signed'}
                        </span>
                      ) : needsOwnerSignature ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-orange-100 text-orange-800 rounded text-xs font-medium animate-pulse">
                          ⚠ {language === 'es' ? 'Tu firma requerida' : 'Your signature required'}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs font-medium">
                          📄 {language === 'es' ? 'Esperando firma del admin' : 'Awaiting admin signature'}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium flex-shrink-0 ${
                    response.status === 'pending'
                      ? 'bg-yellow-100 text-yellow-800'
                      : response.status === 'accepted'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {response.status === 'pending'
                    ? language === 'es' ? 'Pendiente' : 'Pending'
                    : response.status === 'accepted'
                    ? language === 'es' ? 'Aceptada ✓' : 'Accepted ✓'
                    : language === 'es' ? 'Rechazada' : 'Rejected'}
                </span>
              </div>
            </div>

            {/* Rejection note — shown to owner when offer was rejected with a note */}
            {response.status === 'rejected' && response.rejectionNote && (
              <div className="px-6 pb-4">
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-xs font-medium text-red-700 mb-0.5">
                    {language === 'es' ? 'Razón del rechazo:' : 'Rejection reason:'}
                  </p>
                  <p className="text-sm text-red-800 italic">"{response.rejectionNote}"</p>
                </div>
              </div>
            )}

            {/* NDA Signing Section for owner — appears when admin has signed */}
            {response.status === 'accepted' && requirement && needsOwnerSignature && (
              <div className="border-t">
                <NDASigningSection
                  response={response}
                  requirement={requirement}
                  isAdmin={false}
                  onSignatureUpdate={(updates) => {
                    try {
                      onNDAUpdate(response.id, updates);
                      toast({
                        title: language === 'es' ? 'Éxito' : 'Success',
                        description: language === 'es' ? 'NDA firmado correctamente' : 'NDA signed successfully',
                        variant: 'default',
                      });
                    } catch {
                      toast({
                        title: language === 'es' ? 'Error' : 'Error',
                        description: language === 'es' ? 'No se pudo firmar el NDA' : 'Failed to sign NDA',
                        variant: 'destructive',
                      });
                    }
                  }}
                />
              </div>
            )}

            {/* Both signed — show contact confirmation + download */}
            {response.status === 'accepted' && bothSigned && requirement && (
              <div className="border-t p-4 bg-green-50 space-y-3">
                <p className="text-green-800 font-medium text-sm">
                  ✓ {language === 'es'
                    ? 'NDA completamente firmado. El equipo de 77Rentals se pondrá en contacto contigo.'
                    : 'NDA fully signed. The 77Rentals team will be in touch with you.'}
                </p>
                <button
                  onClick={() => {
                    const ndaText = generateNDATemplate(requirement, response);
                    const blob = new Blob([ndaText], { type: 'text/plain;charset=utf-8' });
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = `NDA_Firmado_${response.propertyName.replace(/\s+/g, '_')}_${Date.now()}.txt`;
                    link.click();
                    URL.revokeObjectURL(url);
                  }}
                  className="text-sm font-medium text-green-800 underline hover:text-green-900"
                >
                  📄 {language === 'es' ? 'Descargar NDA Firmado' : 'Download Signed NDA'}
                </button>
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
}
