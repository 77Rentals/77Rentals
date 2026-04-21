import { useContext, useState } from 'react';
import { usePartnerHub } from '@/hooks/usePartnerHub';
import { PartnerAuthContext } from '@/contexts/PartnerAuthContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, MessageSquare, CheckCircle, Clock } from 'lucide-react';
import { OwnerRequirementBrowser } from './OwnerRequirementBrowser';

type TabType = 'browse' | 'responses';

export function OwnerDashboard() {
  const [activeTab, setActiveTab] = useState<TabType>('browse');
  const auth = useContext(PartnerAuthContext);
  const { getRequirements, getResponses } = usePartnerHub();

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
                } else if (
                  stat.label === 'Pending Responses' ||
                  stat.label === 'Accepted' ||
                  stat.label === 'Total Responses'
                ) {
                  setActiveTab('responses');
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
        <div className="flex gap-4">
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
        </div>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'browse' ? (
          <div>
            <OwnerRequirementBrowser />
          </div>
        ) : (
          <div>
            <MyResponses responses={ownerResponses} />
          </div>
        )}
      </div>
    </div>
  );
}

function MyResponses({
  responses,
}: {
  responses: Array<{
    id: string;
    requirementId: string;
    propertyName: string;
    proposedPrice: number;
    commissionPercent: number;
    commissionAmount: number;
    finalPrice: number;
    status: string;
    respondedAt: Date;
  }>;
}) {
  if (responses.length === 0) {
    return (
      <Card className="p-12 text-center">
        <p className="text-gray-600">
          You haven't submitted any responses yet. Browse requirements to get started!
        </p>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      {responses.map((response) => (
        <Card key={response.id} className="p-6 border-0 shadow-md hover:shadow-lg transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {response.propertyName}
              </h3>
              <div className="mt-2 space-y-1 text-sm text-gray-600">
                <p>Proposed Price: ${response.proposedPrice}/night</p>
                <p>
                  Commission: {response.commissionPercent === 10 ? '10%' : `$${response.commissionAmount}`} •
                  {' '}
                  Final Price: ${response.finalPrice}/night
                </p>
              </div>
            </div>
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
                ? 'Pending'
                : response.status === 'accepted'
                  ? 'Accepted ✓'
                  : 'Rejected'}
            </span>
          </div>
        </Card>
      ))}
    </div>
  );
}
