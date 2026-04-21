import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { usePartnerHub } from '@/hooks/usePartnerHub';
import { useLanguage } from '@/contexts/LanguageContext';
import { t } from '@/lib/translations';
import { calculateCommission, calculateFinalPriceWithCleaning } from '@/lib/commissionCalculator';
import { generateUUID } from '@/lib/uuid';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { X, AlertCircle } from 'lucide-react';
import type { GuestRequirement, ApartmentType } from '@/data/partnerHub';
import { apartments } from '@/data/apartments';

const APARTMENT_TYPES: ApartmentType[] = ['Tipo A', 'Tipo B', 'Tipo C', 'Tipo D'];

// Validation: Google Drive link format
const googleDriveLinkRegex = /^https:\/\/drive\.google\.com\//;

const responseSchema = z.object({
  propertyId: z.string().min(1, 'Please select a property'),
  proposedPrice: z.preprocess(
    (v) => (v === '' || v === null || isNaN(Number(v)) ? undefined : Number(v)),
    z.number({ required_error: 'Price is required' }).min(10000, 'Proposed price must be at least $10,000').max(10000000)
  ),
  cleaningFee: z.preprocess(
    (v) => (v === '' || v === null || isNaN(Number(v)) ? undefined : Number(v)),
    z.number({ required_error: 'Cleaning fee is required' }).min(0).optional().default(0)
  ),
  commissionType: z.enum(['10percent', 'markup']),
  markupAmount: z.preprocess(
    (v) => (v === '' || v === null || v === undefined || isNaN(Number(v)) ? undefined : Number(v)),
    z.number().min(0).optional()
  ),
  apartmentType: z.enum(['Tipo A', 'Tipo B', 'Tipo C', 'Tipo D'], { errorMap: () => ({ message: 'Please select apartment type' }) }),
  torreApartamento: z.string().min(1, 'Tower and apartment number is required'),
  googleDriveLink: z.string().url('Invalid URL').refine(
    (url) => googleDriveLinkRegex.test(url),
    'Must be a valid Google Drive link (https://drive.google.com/...)'
  ),
  apartmentBio: z.string().min(10, 'Apartment description must be at least 10 characters').max(1000, 'Description must be less than 1000 characters'),
  notes: z.string().max(500, 'Additional notes must be less than 500 characters'),
  ownerName: z.string().min(2, 'Name is required'),
  ownerPhone: z.string().min(5, 'Phone number is required'),
  ownerEmail: z.string().email('Valid email is required'),
  ownerId: z.string().min(1, 'Owner ID is required'),
});

type ResponseFormData = z.infer<typeof responseSchema>;

interface OwnerResponseFormProps {
  requirement: GuestRequirement;
  onClose: () => void;
  onSubmit: () => void;
}

// Mock DelVentto properties - in real app would come from database
const delVenttoProperties = apartments.filter((apt) => apt.isDelVenttoProp);

export function OwnerResponseForm({
  requirement,
  onClose,
  onSubmit,
}: OwnerResponseFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [proposedPrice, setProposedPrice] = useState(requirement.budget);
  const [cleaningFee, setCleaningFee] = useState(0);
  const [commissionType, setCommissionType] = useState<'10percent' | 'markup'>('10percent');
  const [markupAmount, setMarkupAmount] = useState(0);
  const { addResponse } = usePartnerHub();
  const { language } = useLanguage();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ResponseFormData>({
    resolver: zodResolver(responseSchema),
    defaultValues: {
      proposedPrice: requirement.budget,
      cleaningFee: 0,
      commissionType: '10percent',
      markupAmount: 0,
      notes: '',
      apartmentBio: '',
      apartmentType: 'Tipo A',
      torreApartamento: '',
      googleDriveLink: '',
    },
  });

  const watchProposedPrice = watch('proposedPrice');
  const watchCleaningFee = watch('cleaningFee');
  const watchCommissionType = watch('commissionType');
  const watchMarkupAmount = watch('markupAmount');
  const watchApartmentType = watch('apartmentType');

  // Calculate commission based on inputs
  const commissionCalc = calculateCommission(
    watchProposedPrice || requirement.budget,
    watchCommissionType,
    watchMarkupAmount
  );

  const onSubmitForm = async (data: ResponseFormData) => {
    try {
      setSubmitError(null);

      const property = delVenttoProperties.find((p) => p.id === data.propertyId);
      if (!property) {
        setSubmitError('Invalid property selected');
        return;
      }

      // Type-matching validation: auto-reject if apartment type doesn't match requirement
      if (!requirement.allowedApartmentTypes.includes(data.apartmentType as any)) {
        setIsSubmitting(true);
        setSubmitError(
          `Your apartment type (${data.apartmentType}) does not match the requirement's accepted types: ${requirement.allowedApartmentTypes.join(', ')}. Your offer will be automatically rejected.`
        );
        // Still submit but with rejected status
        const response = {
          id: generateUUID(),
          requirementId: requirement.id,
          ownerId: data.ownerId,
          propertyName: property.name,
          proposedPrice: data.proposedPrice,
          cleaningFee: data.cleaningFee || 0,
          commissionPercent: data.commissionType === '10percent' ? 10 : 0,
          commissionAmount: commissionCalc.commission,
          finalPrice: calculateFinalPriceWithCleaning(commissionCalc.finalPrice, data.cleaningFee || 0),
          apartmentType: data.apartmentType,
          torreApartamento: data.torreApartamento,
          googleDriveLink: data.googleDriveLink,
          apartmentBio: data.apartmentBio,
          notes: data.notes,
          ownerContact: {
            name: data.ownerName,
            phone: data.ownerPhone,
            email: data.ownerEmail,
          },
          status: 'rejected' as const,
          respondedAt: new Date(),
        };
        addResponse(response);
        setTimeout(() => {
          onSubmit();
        }, 2000);
        return;
      }

      setIsSubmitting(true);

      const response = {
        id: generateUUID(),
        requirementId: requirement.id,
        ownerId: data.ownerId,
        propertyName: property.name,
        proposedPrice: data.proposedPrice,
        cleaningFee: data.cleaningFee || 0,
        commissionPercent: data.commissionType === '10percent' ? 10 : 0,
        commissionAmount: commissionCalc.commission,
        finalPrice: calculateFinalPriceWithCleaning(commissionCalc.finalPrice, data.cleaningFee || 0),
        apartmentType: data.apartmentType,
        torreApartamento: data.torreApartamento,
        googleDriveLink: data.googleDriveLink,
        apartmentBio: data.apartmentBio,
        notes: data.notes,
        ownerContact: {
          name: data.ownerName,
          phone: data.ownerPhone,
          email: data.ownerEmail,
        },
        status: 'pending' as const,
        respondedAt: new Date(),
      };

      addResponse(response);
      console.log('Response submitted successfully');
      onSubmit();
    } catch (error) {
      setSubmitError('Failed to submit response. Please try again.');
      console.error('Error submitting response:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 flex items-center justify-between p-6 border-b bg-white">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{t('owner.submitPropertyOffer', language)}</h2>
            <p className="text-sm text-gray-600">
              {requirement.checkInDate} → {requirement.checkOutDate} •{' '}
              {requirement.guestCount} guests • ${requirement.budget}/night budget
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmitForm)} className="p-6 space-y-6">
          {submitError && (
            <div className={`p-4 border rounded-lg text-sm flex gap-2 ${submitError.includes('automatically rejected') ? 'bg-yellow-50 border-yellow-200 text-yellow-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
              <AlertCircle size={20} className="flex-shrink-0" />
              <div>{submitError}</div>
            </div>
          )}

          {/* Property Selection Section */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Your Property</h3>

            {delVenttoProperties.length === 0 ? (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-yellow-800 text-sm">
                  No DelVentto properties available. Please contact support to register your properties.
                </p>
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Property
                </label>
                <select
                  {...register('propertyId')}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A843]"
                >
                  <option value="">Choose a property...</option>
                  {delVenttoProperties.map((prop) => (
                    <option key={prop.id} value={prop.id}>
                      {prop.name} - {prop.city}
                    </option>
                  ))}
                </select>
                {errors.propertyId && (
                  <p className="text-red-500 text-sm mt-1">{errors.propertyId.message}</p>
                )}
              </div>
            )}
          </div>

          {/* Apartment Information Section */}
          <div className="space-y-4 pt-4 border-t">
            <h3 className="font-semibold text-gray-900">Apartment Information</h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Torre y número de apt
              </label>
              <Input
                type="text"
                {...register('torreApartamento')}
                placeholder="e.g., A-407 or Torre Norte, Apt 201"
              />
              {errors.torreApartamento && (
                <p className="text-red-500 text-sm mt-1">{errors.torreApartamento.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Apartment Type
              </label>
              <select
                {...register('apartmentType')}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A843]"
              >
                {APARTMENT_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              {errors.apartmentType && (
                <p className="text-red-500 text-sm mt-1">{errors.apartmentType.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Google Drive Photos Link
              </label>
              <Input
                type="url"
                {...register('googleDriveLink')}
                placeholder="https://drive.google.com/drive/folders/..."
              />
              {errors.googleDriveLink && (
                <p className="text-red-500 text-sm mt-1">{errors.googleDriveLink.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Apartment Bio / Description
              </label>
              <textarea
                {...register('apartmentBio')}
                placeholder="Describe your apartment: size, amenities, location highlights, etc."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A843]"
              />
              {errors.apartmentBio && (
                <p className="text-red-500 text-sm mt-1">{errors.apartmentBio.message}</p>
              )}
            </div>
          </div>

          {/* Price & Commission Section */}
          <div className="space-y-4 pt-4 border-t">
            <h3 className="font-semibold text-gray-900">Pricing & Commission</h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Proposed Nightly Price (COP)
              </label>
              <Input
                type="number"
                min="10000"
                step="10000"
                {...register('proposedPrice')}
                placeholder="150000"
              />
              {errors.proposedPrice && (
                <p className="text-red-500 text-sm mt-1">{errors.proposedPrice.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cleaning Fee (COP) - Optional
              </label>
              <Input
                type="number"
                min="0"
                step="10000"
                {...register('cleaningFee')}
                placeholder="50000"
              />
              {errors.cleaningFee && (
                <p className="text-red-500 text-sm mt-1">{errors.cleaningFee.message}</p>
              )}
              <p className="text-xs text-gray-600 mt-1">
                Commission is only applied to nightly price, not cleaning fee
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Commission Model
              </label>
              <div className="space-y-2">
                <label className="flex items-center gap-2 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    value="10percent"
                    {...register('commissionType')}
                    className="w-4 h-4"
                  />
                  <div>
                    <p className="font-medium text-gray-900">10% Deduction</p>
                    <p className="text-xs text-gray-600">
                      Commission: ${(watchProposedPrice * 0.1).toFixed(2)} • Final: ${(watchProposedPrice * 0.9).toFixed(2)}/night
                    </p>
                  </div>
                </label>

                <label className="flex items-center gap-2 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    value="markup"
                    {...register('commissionType')}
                    className="w-4 h-4"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">Custom Markup</p>
                    <p className="text-xs text-gray-600 mb-2">
                      Commission added to base price
                    </p>
                    <Input
                      type="number"
                      min="0"
                      step="5000"
                      {...register('markupAmount')}
                      placeholder="Markup amount in COP"
                      className="text-sm"
                      disabled={watchCommissionType !== 'markup'}
                    />
                  </div>
                </label>
              </div>
            </div>

            {/* Final Price Summary */}
            <Card className="p-4 bg-blue-50 border-blue-200">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <p className="text-gray-600">Nightly Price (before commission)</p>
                  <p className="font-medium text-gray-900">COP {(watchProposedPrice || 0).toLocaleString()}</p>
                </div>
                <div className="flex items-center justify-between text-sm border-t pt-2">
                  <p className="text-gray-600">Commission ({watchCommissionType === '10percent' ? '10%' : 'Markup'})</p>
                  <p className="font-medium text-gray-900">- COP {commissionCalc.commission.toLocaleString()}</p>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <p className="text-gray-600">Cleaning Fee</p>
                  <p className="font-medium text-gray-900">+ COP {(watchCleaningFee || 0).toLocaleString()}</p>
                </div>
                <div className="flex items-center justify-between text-base border-t pt-2 font-semibold">
                  <p className="text-gray-900">Total Per Night</p>
                  <p className="text-lg text-gray-900">
                    COP {calculateFinalPriceWithCleaning(commissionCalc.finalPrice, watchCleaningFee || 0).toLocaleString()}
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Notes Section */}
          <div className="space-y-4 pt-4 border-t">
            <h3 className="font-semibold text-gray-900">Additional Information</h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes (Why This Property is Perfect)
              </label>
              <textarea
                {...register('notes')}
                placeholder="E.g., Great beach access, modern kitchen, spacious living area, etc."
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
            <h3 className="font-semibold text-gray-900">Your Contact Information</h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <Input
                type="text"
                {...register('ownerName')}
                placeholder="Your name"
              />
              {errors.ownerName && (
                <p className="text-red-500 text-sm mt-1">{errors.ownerName.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone
              </label>
              <Input
                type="tel"
                {...register('ownerPhone')}
                placeholder="+1 (555) 123-4567"
              />
              {errors.ownerPhone && (
                <p className="text-red-500 text-sm mt-1">{errors.ownerPhone.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <Input
                type="email"
                {...register('ownerEmail')}
                placeholder="you@example.com"
              />
              {errors.ownerEmail && (
                <p className="text-red-500 text-sm mt-1">{errors.ownerEmail.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                DelVentto Owner ID
              </label>
              <Input
                type="text"
                {...register('ownerId')}
                placeholder="Your DelVentto owner ID"
              />
              {errors.ownerId && (
                <p className="text-red-500 text-sm mt-1">{errors.ownerId.message}</p>
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
              disabled={isSubmitting || delVenttoProperties.length === 0}
              className="flex-1 bg-[#D4A843] hover:bg-[#c9963e] text-black font-bold"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Offer'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
