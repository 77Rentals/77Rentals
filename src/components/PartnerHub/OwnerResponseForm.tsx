import { useState, useContext, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { usePartnerHub } from '@/hooks/usePartnerHub';
import { useOwnerProperties } from '@/hooks/useOwnerProperties';
import { useOwnerProfile } from '@/hooks/useOwnerProfile';
import { PartnerAuthContext } from '@/contexts/PartnerAuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { t } from '@/lib/translations';
import { calculateCommission, calculateFinalPriceWithCleaning } from '@/lib/commissionCalculator';
import { formatDateRange, formatCOP } from '@/lib/dateFormatter';
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
    z.number({ required_error: 'Cleaning fee is required' }).min(0, 'Cleaning fee must be 0 or greater')
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
});

type ResponseFormData = z.infer<typeof responseSchema>;

interface OwnerResponseFormProps {
  requirement: GuestRequirement;
  onClose: () => void;
  onSubmit: () => void;
}

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
  const auth = useContext(PartnerAuthContext);
  const { getProperties } = useOwnerProperties(auth?.userEmail || '');
  const ownerProperties = getProperties();
  const { getProfile } = useOwnerProfile(auth?.userEmail || '');

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
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
  const watchPropertyId = watch('propertyId');

  // Auto-fill apartment information when property is selected
  useEffect(() => {
    if (watchPropertyId) {
      const selectedProperty = ownerProperties.find((p) => p.id === watchPropertyId);
      if (selectedProperty) {
        setValue('apartmentType', selectedProperty.apartmentType);
        setValue('googleDriveLink', selectedProperty.googleDriveLink);
      }
    }
  }, [watchPropertyId, ownerProperties, setValue]);

  // Auto-fill owner contact information from saved profile
  useEffect(() => {
    const profile = getProfile();
    if (profile) {
      setValue('ownerName', profile.name);
      setValue('ownerPhone', profile.phone);
      setValue('ownerEmail', profile.email);
    }
  }, [getProfile, setValue]);

  // Calculate commission based on inputs
  const commissionCalc = calculateCommission(
    watchProposedPrice || requirement.budget,
    watchCommissionType,
    watchMarkupAmount
  );

  const onSubmitForm = async (data: ResponseFormData) => {
    try {
      setSubmitError(null);

      const property = ownerProperties.find((p) => p.id === data.propertyId);
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
          ownerId: data.ownerEmail,
          propertyName: property.propertyName,
          proposedPrice: data.proposedPrice,
          cleaningFee: data.cleaningFee || 0,
          commissionPercent: data.commissionType === '10percent' ? 10 : 0,
          commissionAmount: commissionCalc.commission,
          finalPrice: calculateFinalPriceWithCleaning(commissionCalc.finalPrice, data.cleaningFee || 0),
          apartmentType: data.apartmentType,
          torreApartamento: data.torreApartamento,
          googleDriveLink: property.googleDriveLink,
          iCalLink: property.iCalLink,
          apartmentBio: data.apartmentBio,
          notes: data.notes,
          ownerContact: {
            name: data.ownerName,
            phone: data.ownerPhone,
            email: data.ownerEmail,
          },
          status: 'rejected' as const,
          respondedAt: new Date(),
          ndaStatus: 'not_started' as const,
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
        ownerId: data.ownerEmail,
        propertyName: property.propertyName,
        proposedPrice: data.proposedPrice,
        cleaningFee: data.cleaningFee || 0,
        commissionPercent: data.commissionType === '10percent' ? 10 : 0,
        commissionAmount: commissionCalc.commission,
        finalPrice: calculateFinalPriceWithCleaning(commissionCalc.finalPrice, data.cleaningFee || 0),
        apartmentType: data.apartmentType,
        torreApartamento: data.torreApartamento,
        googleDriveLink: property.googleDriveLink,
        iCalLink: property.iCalLink,
        apartmentBio: data.apartmentBio,
        notes: data.notes,
        ownerContact: {
          name: data.ownerName,
          phone: data.ownerPhone,
          email: data.ownerEmail,
        },
        status: 'pending' as const,
        respondedAt: new Date(),
        ndaStatus: 'not_started' as const,
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

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 flex items-center justify-between p-6 border-b bg-white">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{t('owner.submitPropertyOffer', language)}</h2>
            <p className="text-sm text-gray-600">
              {formatDateRange(requirement.checkInDate, requirement.checkOutDate)} •{' '}
              {requirement.guestCount} guests • {formatCOP(requirement.budget)}/night budget
            </p>
          </div>
          <button
            type="button"
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
            <h3 className="font-semibold text-gray-900">{t('owner.yourProperty', language)}</h3>

            {ownerProperties.length === 0 ? (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-yellow-800 text-sm">
                  {t('owner.noPropertiesMessage', language)}
                </p>
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('owner.selectProperty', language)}
                </label>
                <select
                  {...register('propertyId')}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A843]"
                >
                  <option value="">{t('owner.chooseProperty', language)}</option>
                  {ownerProperties.map((prop) => (
                    <option key={prop.id} value={prop.id}>
                      {prop.propertyName} - {prop.apartmentType}
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
            <h3 className="font-semibold text-gray-900">{t('owner.apartmentInformation', language)}</h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('owner.torreApartamento', language)}
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
                {t('owner.apartmentType', language)}
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
                {t('owner.googleDrivePhotos', language)}
              </label>
              <Input
                type="url"
                {...register('googleDriveLink')}
                placeholder={t('owner.googleDrivePhotosPlaceholder', language)}
              />
              {errors.googleDriveLink && (
                <p className="text-red-500 text-sm mt-1">{errors.googleDriveLink.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('owner.apartmentBio', language)}
              </label>
              <textarea
                {...register('apartmentBio')}
                placeholder={t('owner.apartmentBioPlaceholder', language)}
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
            <h3 className="font-semibold text-gray-900">{t('owner.pricingCommission', language)}</h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('owner.proposedNightlyPrice', language)}
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
                {t('owner.cleaningFee', language)}
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
                {t('owner.cleaningFeeNote', language)}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('owner.commissionModel', language)}
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
                    <p className="font-medium text-gray-900">{t('owner.tenPercentDeduction', language)}</p>
                    <p className="text-xs text-gray-600">
                      {t('owner.commission', language)}: {formatCOP((Number(watchProposedPrice) || 0) * 0.1)} • {t('owner.finalPrice', language)}: {formatCOP((Number(watchProposedPrice) || 0) * 0.9)}/night
                    </p>
                  </div>
                </label>

              </div>
            </div>

            {/* Final Price Summary */}
            <Card className="p-4 bg-blue-50 border-blue-200">
              <h4 className="font-semibold text-gray-900 mb-3">{t('owner.pricingBreakdown', language)}</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <p className="text-gray-600">{t('owner.pricePerNight', language)}</p>
                  <p className="font-medium text-gray-900">{formatCOP(Number(watchProposedPrice) || 0)}</p>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <p className="text-gray-600">{t('owner.numberOfNights', language)}</p>
                  <p className="font-medium text-gray-900">
                    {Math.ceil(
                      (new Date(requirement.checkOutDate).getTime() - new Date(requirement.checkInDate).getTime()) /
                      (1000 * 60 * 60 * 24)
                    )}
                  </p>
                </div>
                <div className="flex items-center justify-between text-sm border-t pt-2">
                  <p className="text-gray-600">{t('owner.subtotal', language)}</p>
                  <p className="font-medium text-gray-900">
                    {formatCOP(
                      (Number(watchProposedPrice) || 0) *
                      Math.ceil(
                        (new Date(requirement.checkOutDate).getTime() - new Date(requirement.checkInDate).getTime()) /
                        (1000 * 60 * 60 * 24)
                      )
                    )}
                  </p>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <p className="text-gray-600">{t('owner.commissionPercentage', language)}</p>
                  <p className="font-medium text-gray-900">
                    - {formatCOP(
                      (Number(watchProposedPrice) || 0) *
                      Math.ceil(
                        (new Date(requirement.checkOutDate).getTime() - new Date(requirement.checkInDate).getTime()) /
                        (1000 * 60 * 60 * 24)
                      ) *
                      0.1
                    )}
                  </p>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <p className="text-gray-600">{t('owner.cleaningFeeOneTime', language)}</p>
                  <p className="font-medium text-gray-900">+ {formatCOP(Number(watchCleaningFee) || 0)}</p>
                </div>
                <div className="flex items-center justify-between text-base border-t pt-2 font-semibold bg-white p-2 rounded">
                  <p className="text-gray-900">{t('owner.totalAmountDue', language)}</p>
                  <p className="text-lg text-gray-900">
                    {formatCOP(
                      (Number(watchProposedPrice) || 0) *
                      Math.ceil(
                        (new Date(requirement.checkOutDate).getTime() - new Date(requirement.checkInDate).getTime()) /
                        (1000 * 60 * 60 * 24)
                      ) *
                      0.9 +
                      (Number(watchCleaningFee) || 0)
                    )}
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Notes Section */}
          <div className="space-y-4 pt-4 border-t">
            <h3 className="font-semibold text-gray-900">{t('owner.additionalInformation', language)}</h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('owner.notes', language)}
              </label>
              <textarea
                {...register('notes')}
                placeholder={t('owner.notesPlaceholder', language)}
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
            <h3 className="font-semibold text-gray-900">{t('owner.yourContactInformation', language)}</h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('form.name', language)}
              </label>
              <Input
                type="text"
                {...register('ownerName')}
                placeholder={t('form.name', language)}
              />
              {errors.ownerName && (
                <p className="text-red-500 text-sm mt-1">{errors.ownerName.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('form.phone', language)}
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
                {t('form.email', language)}
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
              disabled={isSubmitting || ownerProperties.length === 0}
              className="flex-1 bg-[#D4A843] hover:bg-[#c9963e] text-black font-bold"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Offer'}
            </Button>
          </div>
        </form>
      </Card>
    </div>,
    document.body
  );
}
