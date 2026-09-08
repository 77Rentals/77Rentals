import { useState } from 'react';
import { useOwnerApprovals } from '@/hooks/useOwnerApprovals';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { UserCheck, Clock } from 'lucide-react';

export function AdminOwnerApprovals() {
  const { owners, isLoading, approveOwner } = useOwnerApprovals();
  const { toast } = useToast();
  const [approvingId, setApprovingId] = useState<string | null>(null);

  const pending = owners.filter((o) => !o.approved);

  if (isLoading || pending.length === 0) return null;

  const handleApprove = async (ownerId: string, name: string) => {
    try {
      setApprovingId(ownerId);
      await approveOwner(ownerId);
      toast({
        title: 'Success',
        description: `${name} approved. They can now browse requirements and submit offers.`,
        variant: 'default',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to approve owner. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setApprovingId(null);
    }
  };

  return (
    <Card className="p-6 border-0 shadow-md border-l-4 border-l-amber-500">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="w-5 h-5 text-amber-600" />
        <h2 className="text-xl font-bold text-gray-900">
          Pending Owner Approvals ({pending.length})
        </h2>
      </div>
      <div className="divide-y">
        {pending.map((owner) => (
          <div key={owner.id} className="py-4 flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900">{owner.name}</p>
              <p className="text-sm text-gray-600">{owner.email}</p>
              <p className="text-sm text-gray-600">{owner.phone}</p>
              {owner.delVenttoId && (
                <p className="text-xs text-gray-500 mt-1">DelVentto ID: {owner.delVenttoId}</p>
              )}
            </div>
            <Button
              type="button"
              size="sm"
              onClick={() => handleApprove(owner.id, owner.name)}
              disabled={approvingId === owner.id}
              className="bg-[#D4A843] hover:bg-[#c9963e] text-black font-semibold gap-1.5 flex-shrink-0"
            >
              <UserCheck size={16} />
              {approvingId === owner.id ? 'Approving...' : 'Approve'}
            </Button>
          </div>
        ))}
      </div>
    </Card>
  );
}
