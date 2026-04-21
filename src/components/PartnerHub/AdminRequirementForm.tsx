import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { usePartnerHub } from '@/hooks/usePartnerHub';
import { generateUUID } from '@/lib/uuid';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { X } from 'lucide-react';
import type { ApartmentType } from '@/data/partnerHub';

const APARTMENT_TYPES: ApartmentType[] = ['Tipo A', 'Tipo B', 'Tipo C', 'Tipo D'];

const requirementSchema = z.object({
  guestCount: z.number().min(1, 'Guest count must be at least 1').max(20),
  checkInDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format'),
  checkOutDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format'),
  budget: z.number().min(10000, 'Budget must be at least ₡10,000').max(10000000),
  city: z.string().min(1, 'City is required'),
  notes: z.string().max(500, 'Notes must be less than 500 characters'),
  allowedApartmentTypes: z.array(z.string()).min(1, 'Select at least one apartment type'),
  commissionType: z.enum(['fixed', 'markup'], { errorMap: () => ({ message: 'Select a commission type' }) }),
  commissionValue: z.number().min(0).optional(),
});

type RequirementFormData = z.infer<typeof requirementSchema>;

interface AdminRequirementFormProps {
  onClose: () => void;
  onSubmit: () => void;
}

// Helper function to format date with month names
function formatDateForDisplay(dateString: string): string {
  const date = new Date(dateString + 'T00:00:00');
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  const ordinal = day === 1 || day === 21 || day === 31 ? 'st' : day === 2 || day === 22 ? 'nd' : day === 3 || day === 23 ? 'rd' : 'th';
  return `${month} ${day}${ordinal} ${year}`;
}

export function AdminRequirementForm({ onClose, onSubmit }: AdminRequirementFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [commissionType, setCommissionType] = useState<'fixed' | 'markup'>('fixed');
  const { addRequirement } = usePartnerHub();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<RequirementFormData>({
    resolver: zodResolver(requirementSchema),
    defaultValues: {
      guestCount: 2,
      budget: 150000,
      notes: '',
      city: 'Santa Marta, Delventto',
      allowedApartmentTypes: [],
      commissionType: 'fixed',
    },
  });

  const watchCommissionType = watch('commissionType');

  const onSubmitForm = async (data: RequirementFormData) => {
    try {
      setIsSubmitting(true);
      setSubmitError(null);

      // Validate date range
      if (data.checkInDate >= data.checkOutDate) {
        setSubmitError('Check-out date must be after check-in date');
        return;
      }

      // Validate apartment types selected
      if (data.allowedApartmentTypes.length === 0) {
        setSubmitError('Please select at least one apartment type');
        return;
      }

      const requirement = {
        id: generateUUID(),
        createdAt: new Date(),
        guestCount: data.guestCount,
        checkInDate: data.checkInDate,
        checkOutDate: data.checkOutDate,
        budget: data.budget,
        notes: data.notes,
        city: data.city,
        status: 'open' as const,
        allowedApartmentTypes: data.allowedApartmentTypes as any,
        commissionType: data.commissionType,
        commissionValue: data.commissionValue,
        adminContact: {
          name: 'Claudia Moreno',
          phone: '+573046736241',
          email: 'team@77rentals.com',
        },
      };

      addRequirement(requirement);

      // Show success (in real app would be toast)
      console.log('Requirement posted successfully');
      onSubmit();
    } catch (error) {
      setSubmitError('Failed to post requirement. Please try again.');
      console.error('Error posting requirement:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 flex items-center justify-between p-6 border-b bg-white">
          <h2 className="text-xl font-bold text-gray-900">Post New Requirement</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmitForm)} className="p-6 space-y-6">
          {submitError && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {submitError}
            </div>
          )}

          {/* Guest Requirement Section */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Guest Information</h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Number of Guests
              </label>
              <Input
                type="number"
                min="1"
                max="20"
                {...register('guestCount', { valueAsNumber: true })}
                placeholder="2"
              />
              {errors.guestCount && (
                <p className="text-red-500 text-sm mt-1">{errors.guestCount.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Check-In Date
                </label>
                <Input
                  type="date"
                  {...register('checkInDate')}
                />
                {errors.checkInDate && (
                  <p className="text-red-500 text-sm mt-1">{errors.checkInDate.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Check-Out Date
                </label>
                <Input
                  type="date"
                  {...register('checkOutDate')}
                />
                {errors.checkOutDate && (
                  <p className="text-red-500 text-sm mt-1">{errors.checkOutDate.message}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                City
              </label>
              <Input
                type="text"
                {...register('city')}
                placeholder="Santa Marta, Delventto"
                defaultValue="Santa Marta, Delventto"
              />
              {errors.city && (
                <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Budget per Night (COP) - Estimate
              </label>
              <Input
                type="number"
                min="10000"
                step="10000"
                {...register('budget', { valueAsNumber: true })}
                placeholder="150000"
              />
              {errors.budget && (
                <p className="text-red-500 text-sm mt-1">{errors.budget.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Apartment Types Accepted
              </label>
              <div className="space-y-2">
                {APARTMENT_TYPES.map((type) => (
                  <label key={type} className="flex items-center gap-3 p-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="checkbox"
                      value={type}
                      {...register('allowedApartmentTypes')}
                      className="w-4 h-4"
                    />
                    <span className="text-gray-900 font-medium">{type}</span>
                  </label>
                ))}
              </div>
              {errors.allowedApartmentTypes && (
                <p className="text-red-500 text-sm mt-1">{errors.allowedApartmentTypes.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Commission Type
              </label>
              <div className="space-y-2">
                <label className="flex items-center gap-3 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    value="fixed"
                    {...register('commissionType')}
                    className="w-4 h-4"
                  />
                  <div>
                    <p className="font-medium text-gray-900">Fixed Commission (10%)</p>
                    <p className="text-xs text-gray-600">Standard 10% commission deduction</p>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    value="markup"
                    {...register('commissionType')}
                    className="w-4 h-4"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">Markup</p>
                    <p className="text-xs text-gray-600 mb-2">Custom markup amount added to final price</p>
                    <Input
                      type="number"
                      min="0"
                      step="5000"
                      {...register('commissionValue', { valueAsNumber: true })}
                      placeholder="Markup amount in COP"
                      className="text-sm"
                      disabled={watchCommissionType !== 'markup'}
                    />
                  </div>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Additional Notes
              </label>
              <textarea
                {...register('notes')}
                placeholder="E.g., near beach, must have kitchen, etc."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A843]"
              />
              {errors.notes && (
                <p className="text-red-500 text-sm mt-1">{errors.notes.message}</p>
              )}
            </div>
          </div>

          {/* Contact Info Section - Hardcoded */}
          <div className="space-y-4 pt-4 border-t bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-900">Contact Information</h3>
            <p className="text-sm text-gray-600">Automatically filled</p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-600">Name</p>
                <p className="font-medium text-gray-900">Claudia Moreno</p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Email</p>
                <p className="font-medium text-gray-900">team@77rentals.com</p>
              </div>
              <div className="col-span-2">
                <p className="text-xs text-gray-600">Phone</p>
                <p className="font-medium text-gray-900">+573046736241</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-[#D4A843] hover:bg-[#c9963e] text-black font-bold"
            >
              {isSubmitting ? 'Posting...' : 'Post Requirement'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
