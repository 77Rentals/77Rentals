import { useState } from 'react';
import { usePartnerHub } from '@/hooks/usePartnerHub';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Plus, TrendingUp, MessageSquare, CheckCircle } from 'lucide-react';
import { AdminRequirementForm } from './AdminRequirementForm';
import { AdminRequirementsList } from './AdminRequirementsList';

export function AdminDashboard() {
  const [showForm, setShowForm] = useState(false);
  const { getRequirements, getResponses } = usePartnerHub();

  const requirements = getRequirements();
  const responses = getResponses();

  const openCount = requirements.filter((r) => r.status === 'open').length;
  const closedCount = requirements.filter((r) => r.status === 'closed').length;
  const acceptedResponses = responses.filter((r) => r.status === 'accepted').length;

  const stats = [
    {
      label: 'Open Requirements',
      value: openCount,
      icon: TrendingUp,
      color: 'from-blue-500 to-blue-600',
    },
    {
      label: 'Total Responses',
      value: responses.length,
      icon: MessageSquare,
      color: 'from-purple-500 to-purple-600',
    },
    {
      label: 'Accepted',
      value: acceptedResponses,
      icon: CheckCircle,
      color: 'from-green-500 to-green-600',
    },
    {
      label: 'Closed Deals',
      value: closedCount,
      icon: CheckCircle,
      color: 'from-amber-500 to-amber-600',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Manage guest requirements and partner responses
          </p>
        </div>
        <Button
          onClick={() => setShowForm(true)}
          className="bg-[#D4A843] hover:bg-[#c9963e] text-black font-bold gap-2"
        >
          <Plus size={20} />
          Post Requirement
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card
              key={stat.label}
              className="p-6 border-0 shadow-md hover:shadow-lg transition-shadow"
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

      {/* Requirements List */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Requirements</h2>
        <AdminRequirementsList />
      </div>

      {/* Post Requirement Form Modal */}
      {showForm && (
        <AdminRequirementForm
          onClose={() => setShowForm(false)}
          onSubmit={() => setShowForm(false)}
        />
      )}
    </div>
  );
}
