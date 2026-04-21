import { useMemo, useState } from 'react';
import { usePartnerHub } from '@/hooks/usePartnerHub';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Users, DollarSign, MessageCircle } from 'lucide-react';
import { OwnerResponseForm } from './OwnerResponseForm';
import type { GuestRequirement } from '@/data/partnerHub';

export function OwnerRequirementBrowser() {
  const { getRequirements, getResponseCountForRequirement } = usePartnerHub();
  const [selectedRequirement, setSelectedRequirement] = useState<GuestRequirement | null>(null);
  const [showForm, setShowForm] = useState(false);

  // Filter state
  const [minBudget, setMinBudget] = useState(0);
  const [maxBudget, setMaxBudget] = useState(500);
  const [minGuests, setMinGuests] = useState(1);
  const [maxGuests, setMaxGuests] = useState(20);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const allRequirements = getRequirements();

  // Filter requirements
  const filtered = useMemo(() => {
    return allRequirements
      .filter((r) => r.status === 'open')
      .filter((r) => r.budget >= minBudget && r.budget <= maxBudget)
      .filter((r) => r.guestCount >= minGuests && r.guestCount <= maxGuests)
      .filter((r) => {
        if (fromDate && r.checkOutDate < fromDate) return false;
        if (toDate && r.checkInDate > toDate) return false;
        return true;
      })
      .sort((a, b) => new Date(a.checkInDate).getTime() - new Date(b.checkInDate).getTime());
  }, [allRequirements, minBudget, maxBudget, minGuests, maxGuests, fromDate, toDate]);

  const handleOfferProperty = (requirement: GuestRequirement) => {
    setSelectedRequirement(requirement);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setSelectedRequirement(null);
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card className="p-6 border-0 shadow-md bg-gradient-to-r from-blue-50 to-indigo-50">
        <h3 className="font-semibold text-gray-900 mb-4">Filter Requirements</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Budget Range
            </label>
            <div className="flex gap-2 items-center">
              <Input
                type="number"
                min="0"
                value={minBudget}
                onChange={(e) => setMinBudget(Number(e.target.value))}
                placeholder="Min"
                className="w-20"
              />
              <span className="text-gray-600">-</span>
              <Input
                type="number"
                max="10000"
                value={maxBudget}
                onChange={(e) => setMaxBudget(Number(e.target.value))}
                placeholder="Max"
                className="w-20"
              />
            </div>
            <p className="text-xs text-gray-600 mt-1">
              ${minBudget} - ${maxBudget}/night
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Guest Count
            </label>
            <div className="flex gap-2 items-center">
              <Input
                type="number"
                min="1"
                value={minGuests}
                onChange={(e) => setMinGuests(Number(e.target.value))}
                placeholder="Min"
                className="w-20"
              />
              <span className="text-gray-600">-</span>
              <Input
                type="number"
                max="20"
                value={maxGuests}
                onChange={(e) => setMaxGuests(Number(e.target.value))}
                placeholder="Max"
                className="w-20"
              />
            </div>
            <p className="text-xs text-gray-600 mt-1">
              {minGuests} - {maxGuests} guests
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Check-In From
            </label>
            <Input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Check-Out Before
            </label>
            <Input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />
          </div>
        </div>

        <Button
          onClick={() => {
            setMinBudget(0);
            setMaxBudget(500);
            setMinGuests(1);
            setMaxGuests(20);
            setFromDate('');
            setToDate('');
          }}
          variant="outline"
          className="mt-4 text-sm"
        >
          Reset Filters
        </Button>
      </Card>

      {/* Requirements List */}
      {filtered.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-gray-600">
            No requirements match your filters. Try adjusting your search criteria.
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((requirement) => {
            const responseCount = getResponseCountForRequirement(requirement.id);
            return (
              <Card
                key={requirement.id}
                className="p-6 border-0 shadow-md hover:shadow-lg transition-all cursor-pointer hover:translate-y-[-2px]"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="inline-block px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                      {requirement.checkInDate} → {requirement.checkOutDate}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-gray-600 text-sm">
                    <MessageCircle size={16} />
                    {responseCount}
                  </div>
                </div>

                <h3 className="font-semibold text-gray-900 mb-3">
                  Santa Marta - {requirement.guestCount > 1 ? `${requirement.guestCount} Guests` : '1 Guest'}
                </h3>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Users size={16} />
                    <span>{requirement.guestCount} guest{requirement.guestCount !== 1 ? 's' : ''}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <DollarSign size={16} />
                    <span>Budget: ${requirement.budget}/night</span>
                  </div>
                </div>

                {requirement.notes && (
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {requirement.notes}
                  </p>
                )}

                <Button
                  onClick={() => handleOfferProperty(requirement)}
                  className="w-full bg-[#D4A843] hover:bg-[#c9963e] text-black font-bold"
                >
                  Offer Property
                </Button>
              </Card>
            );
          })}
        </div>
      )}

      {/* Response Form Modal */}
      {showForm && selectedRequirement && (
        <OwnerResponseForm
          requirement={selectedRequirement}
          onClose={handleCloseForm}
          onSubmit={handleCloseForm}
        />
      )}
    </div>
  );
}
