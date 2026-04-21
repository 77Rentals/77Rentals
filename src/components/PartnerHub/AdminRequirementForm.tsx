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

const requirementSchema = z.object({
  guestCount: z.number().min(1, 'Guest count must be at least 1').max(20),
  checkInDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format'),
  checkOutDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format'),
  budget: z.number().min(50, 'Budget must be at least $50').max(10000),
  notes: z.string().max(500, 'Notes must be less than 500 characters'),
  adminName: z.string().min(2, 'Name is required'),
  adminPhone: z.string().min(5, 'Phone number is required'),
  adminEmail: z.string().email('Valid email is required'),
});

type RequirementFormData = z.infer<typeof requirementSchema>;

interface AdminRequirementFormProps {
  onClose: () => void;
  onSubmit: () => void;
}

export function AdminRequirementForm({ onClose, onSubmit }: AdminRequirementFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const { addRequirement } = usePartnerHub();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RequirementFormData>({
    resolver: zodResolver(requirementSchema),
    defaultValues: {
      guestCount: 2,
      budget: 150,
      notes: '',
    },
  });

  const onSubmitForm = async (data: RequirementFormData) => {
    try {
      setIsSubmitting(true);
      setSubmitError(null);

      // Validate date range
      if (data.checkInDate >= data.checkOutDate) {
        setSubmitError('Check-out date must be after check-in date');
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
        city: 'Santa Marta' as const,
        status: 'open' as const,
        adminContact: {
          name: data.adminName,
          phone: data.adminPhone,
          email: data.adminEmail,
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
                Budget per Night (USD)
              </label>
              <Input
                type="number"
                min="50"
                step="10"
                {...register('budget', { valueAsNumber: true })}
                placeholder="150"
              />
              {errors.budget && (
                <p className="text-red-500 text-sm mt-1">{errors.budget.message}</p>
              )}
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

          {/* Contact Info Section */}
          <div className="space-y-4 pt-4 border-t">
            <h3 className="font-semibold text-gray-900">Contact Information</h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <Input
                type="text"
                {...register('adminName')}
                placeholder="Your name"
              />
              {errors.adminName && (
                <p className="text-red-500 text-sm mt-1">{errors.adminName.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone
              </label>
              <Input
                type="tel"
                {...register('adminPhone')}
                placeholder="+1 (555) 123-4567"
              />
              {errors.adminPhone && (
                <p className="text-red-500 text-sm mt-1">{errors.adminPhone.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <Input
                type="email"
                {...register('adminEmail')}
                placeholder="you@77rentals.com"
              />
              {errors.adminEmail && (
                <p className="text-red-500 text-sm mt-1">{errors.adminEmail.message}</p>
              )}
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
