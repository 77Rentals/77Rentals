import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { usePartnerHub } from '@/hooks/usePartnerHub';
import { useLanguage } from '@/contexts/LanguageContext';
import { t } from '@/lib/translations';
import { generateUUID } from '@/lib/uuid';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { X } from 'lucide-react';
import type { ApartmentType } from '@/data/partnerHub';

const APARTMENT_TYPES: ApartmentType[] = ['Tipo A', 'Tipo B', 'Tipo C', 'Tipo D'];

const requirementSchema = z.object({
  guestCount: z.preprocess(
    (v) => (v === '' || v === null || isNaN(Number(v)) ? undefined : Number(v)),
    z.number({ required_error: 'Guest count is required' }).min(1, 'Guest count must be at least 1').max(20)
  ),
  checkInDate: z.string().min(1, 'Check-in date is required'),
  checkOutDate: z.string().min(1, 'Check-out date is required'),
  budget: z.preprocess(
    (v) => (v === '' || v === null || isNaN(Number(v)) ? undefined : Number(v)),
    z.number({ required_error: 'Budget is required' }).min(10000, 'Budget must be at least $10,000').max(10000000)
  ),
  city: z.string().min(1, 'City is required'),
  notes: z.string().max(500, 'Notes must be less than 500 characters').optional().default(''),
  allowedApartmentTypes: z.array(z.string()).min(1, 'Select at least one apartment type'),
  commissionType: z.enum(['fixed', 'markup'], { errorMap: () => ({ message: 'Select a commission type' }) }),
  commissionValue: z.preprocess(
    (v) => (v === '' || v === null || v === undefined || isNaN(Number(v)) ? undefined : Number(v)),
    z.number().min(0).optional()
  ),
});

type RequirementFormData = z.infer<typeof requirementSchema>;

interface AdminRequirementFormProps {
  onClose?: () => void;
  onSubmit?: () => void;
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
  const navigate = useNavigate();
  const handleClose = () => { if (onClose) onClose(); else navigate('/partner-hub'); };
  const handleSubmitDone = () => { if (onSubmit) onSubmit(); else navigate('/partner-hub'); };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [commissionType, setCommissionType] = useState<'fixed' | 'markup'>('fixed');
  const { addRequirement } = usePartnerHub();
  const { language } = useLanguage();

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

      setIsSubmitting(true);

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
      handleSubmitDone();
    } catch (error) {
      setSubmitError('Failed to post requirement. Please try again.');
      console.error('Error posting requirement:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 flex items-center justify-between p-6 border-b bg-white">
          <h2 className="text-xl font-bold text-gray-900">{t('form.postNewRequirement', language)}</h2>
          <button
            type="button"
            onClick={handleClose}
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
            <h3 className="font-semibold text-gray-900">{t('form.guestInformation', language)}</h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('form.numberOfGuests', language)}
              </label>
              <Input
                type="number"
                min="1"
                max="20"
                {...register('guestCount')}
                placeholder="2"
              />
              {errors.guestCount && (
                <p className="text-red-500 text-sm mt-1">{errors.guestCount.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('form.checkInDate', language)}
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
                  {t('form.checkOutDate', language)}
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
                {t('form.city', language)}
              </label>
              <Input
                type="text"
                {...register('city')}
                placeholder={t('common.santaMartaDelventto', language)}
                defaultValue={t('common.santaMartaDelventto', language)}
              />
              {errors.city && (
                <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('form.budgetPerNight', language)}
              </label>
              <Input
                type="number"
                min="10000"
                step="10000"
                {...register('budget')}
                placeholder="150000"
              />
              {errors.budget && (
                <p className="text-red-500 text-sm mt-1">{errors.budget.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('form.apartmentTypesAccepted', language)}
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
                {t('form.commissionType', language)}
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
                    <p className="font-medium text-gray-900">{t('form.fixedCommission', language)}</p>
                    <p className="text-xs text-gray-600">{t('form.fixedCommissionDesc', language)}</p>
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
                    <p className="font-medium text-gray-900">{t('form.markup', language)}</p>
                    <p className="text-xs text-gray-600 mb-2">{t('form.markupDesc', language)}</p>
                    <Input
                      type="number"
                      min="0"
                      step="5000"
                      {...register('commissionValue')}
                      placeholder={t('form.markupAmount', language)}
                      className="text-sm"
                      disabled={watchCommissionType !== 'markup'}
                    />
                  </div>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('form.additionalNotes', language)}
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
            <h3 className="font-semibold text-gray-900">{t('form.contactInformation', language)}</h3>
            <p className="text-sm text-gray-600">{t('form.automaticallyFilled', language)}</p>
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
              onClick={handleClose}
              className="flex-1"
            >
              {t('form.cancel', language)}
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-[#D4A843] hover:bg-[#c9963e] text-black font-bold"
            >
              {isSubmitting ? t('form.posting', language) : t('form.postRequirement', language)}
            </Button>
          </div>
        </form>
      </Card>
    </div>,
    document.body
  );
}
