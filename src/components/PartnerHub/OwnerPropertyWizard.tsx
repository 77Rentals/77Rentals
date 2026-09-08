import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/components/ui/use-toast';
import { ChevronLeft, ChevronRight, X, Check } from 'lucide-react';
import type { ApartmentType, OwnerProperty } from '@/data/partnerHub';

const APARTMENT_TYPES: ApartmentType[] = ['Tipo A', 'Tipo B', 'Tipo C', 'Tipo D'];

const wizardSchema = z.object({
  propertyName: z.string().min(2, 'min2'),
  apartmentType: z.enum(['Tipo A', 'Tipo B', 'Tipo C', 'Tipo D']),
  city: z.string().min(2, 'min2'),
  address: z.string().min(3, 'min3'),
  maxGuests: z.coerce.number().int().min(1, 'min1'),
  bedrooms: z.coerce.number().int().min(0, 'min0'),
  bathrooms: z.coerce.number().int().min(0, 'min0'),
  nightlyRate: z.union([z.coerce.number().min(0, 'min0'), z.literal('')]).optional(),
  description: z.string().min(20, 'min20'),
  amenities: z.string().min(3, 'min3'),
  googleDriveLink: z
    .string()
    .url('url')
    .refine((url) => url.includes('drive.google.com'), 'drive'),
  iCalLink: z.string().url('url').optional().or(z.literal('')),
});

type WizardFormData = z.infer<typeof wizardSchema>;

const STEP_FIELDS: (keyof WizardFormData)[][] = [
  ['propertyName', 'apartmentType', 'city', 'address'],
  ['maxGuests', 'bedrooms', 'bathrooms', 'nightlyRate'],
  ['description', 'amenities'],
  ['googleDriveLink', 'iCalLink'],
];

interface OwnerPropertyWizardProps {
  onClose: () => void;
  onSubmitProperty: (
    prop: Omit<OwnerProperty, 'id' | 'ownerId' | 'createdAt' | 'updatedAt'>
  ) => Promise<void>;
}

export function OwnerPropertyWizard({ onClose, onSubmitProperty }: OwnerPropertyWizardProps) {
  const { language } = useLanguage();
  const { toast } = useToast();
  const [step, setStep] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const totalSteps = STEP_FIELDS.length + 1; // + review step

  const {
    register,
    handleSubmit,
    trigger,
    getValues,
    formState: { errors },
  } = useForm<WizardFormData>({
    resolver: zodResolver(wizardSchema),
    defaultValues: {
      propertyName: '',
      apartmentType: 'Tipo A',
      city: '',
      address: '',
      maxGuests: 2,
      bedrooms: 1,
      bathrooms: 1,
      nightlyRate: '',
      description: '',
      amenities: '',
      googleDriveLink: '',
      iCalLink: '',
    },
  });

  const es = language === 'es';

  const stepTitles = es
    ? ['Ubicación', 'Capacidad y precio', 'Descripción', 'Fotos y calendario', 'Revisar y enviar']
    : ['Location', 'Capacity & price', 'Description', 'Photos & calendar', 'Review & submit'];

  const handleNext = async () => {
    const valid = await trigger(STEP_FIELDS[step]);
    if (valid) setStep((s) => Math.min(s + 1, totalSteps - 1));
  };

  const handleBack = () => setStep((s) => Math.max(s - 1, 0));

  const onSubmit = async (data: WizardFormData) => {
    try {
      setIsSaving(true);
      await onSubmitProperty({
        propertyName: data.propertyName,
        apartmentType: data.apartmentType,
        city: data.city,
        address: data.address,
        maxGuests: Number(data.maxGuests),
        bedrooms: Number(data.bedrooms),
        bathrooms: Number(data.bathrooms),
        nightlyRate: data.nightlyRate === '' || data.nightlyRate === undefined ? undefined : Number(data.nightlyRate),
        description: data.description,
        amenities: data.amenities,
        googleDriveLink: data.googleDriveLink,
        iCalLink: data.iCalLink || undefined,
      });
      toast({
        title: es ? 'Éxito' : 'Success',
        description: es ? 'Tu propiedad fue publicada correctamente.' : 'Your property was listed successfully.',
        variant: 'default',
      });
      onClose();
    } catch (error) {
      toast({
        title: es ? 'Error' : 'Error',
        description: es ? 'No se pudo publicar la propiedad. Intenta de nuevo.' : 'Failed to list property. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const fieldError = (msg?: string) => {
    if (!msg) return null;
    const map: Record<string, string> = es
      ? {
          min2: 'Debe tener al menos 2 caracteres',
          min3: 'Debe tener al menos 3 caracteres',
          min20: 'Cuéntanos un poco más (mínimo 20 caracteres)',
          min1: 'Debe ser al menos 1',
          min0: 'No puede ser negativo',
          url: 'Debe ser un enlace válido',
          drive: 'Debe ser un enlace de Google Drive',
        }
      : {
          min2: 'Must be at least 2 characters',
          min3: 'Must be at least 3 characters',
          min20: 'Tell us a bit more (minimum 20 characters)',
          min1: 'Must be at least 1',
          min0: "Can't be negative",
          url: 'Must be a valid link',
          drive: 'Must be a Google Drive link',
        };
    return <p className="text-red-500 text-sm mt-1">{map[msg] ?? msg}</p>;
  };

  const values = getValues();

  return (
    <Card className="p-6 border-[#D4A843]">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold text-gray-900 text-lg">
          {es ? 'Publica tu propiedad' : 'List your property'}
        </h3>
        <button type="button" onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
          <X size={20} />
        </button>
      </div>

      <div className="mb-6">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-sm font-medium text-[#D4A843]">
            {es ? 'Paso' : 'Step'} {step + 1} {es ? 'de' : 'of'} {totalSteps}: {stepTitles[step]}
          </span>
        </div>
        <Progress value={((step + 1) / totalSteps) * 100} className="h-2" />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Step 0: Location */}
        {step === 0 && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {es ? 'Nombre de la propiedad' : 'Property name'}
              </label>
              <Input
                type="text"
                {...register('propertyName')}
                placeholder={es ? 'ej. Estudio frente al mar' : 'e.g., Beachfront Studio'}
              />
              {fieldError(errors.propertyName?.message)}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {es ? 'Tipo de apartamento' : 'Apartment type'}
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
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {es ? 'Ciudad' : 'City'}
              </label>
              <Input type="text" {...register('city')} placeholder={es ? 'ej. Santa Marta' : 'e.g., Santa Marta'} />
              {fieldError(errors.city?.message)}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {es ? 'Dirección o sector' : 'Address or neighborhood'}
              </label>
              <Input
                type="text"
                {...register('address')}
                placeholder={es ? 'ej. Conjunto DelVentto, Torre A' : 'e.g., DelVentto Complex, Tower A'}
              />
              {fieldError(errors.address?.message)}
              <p className="text-xs text-gray-500 mt-1">
                {es
                  ? 'Esta información es solo para uso interno de 77Rentals, no se publica.'
                  : "This is for 77Rentals' internal use only, not published publicly."}
              </p>
            </div>
          </div>
        )}

        {/* Step 1: Capacity & price */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {es ? 'Huéspedes máx.' : 'Max guests'}
                </label>
                <Input type="number" min={1} {...register('maxGuests')} />
                {fieldError(errors.maxGuests?.message)}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {es ? 'Habitaciones' : 'Bedrooms'}
                </label>
                <Input type="number" min={0} {...register('bedrooms')} />
                {fieldError(errors.bedrooms?.message)}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {es ? 'Baños' : 'Bathrooms'}
                </label>
                <Input type="number" min={0} {...register('bathrooms')} />
                {fieldError(errors.bathrooms?.message)}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {es ? 'Tarifa por noche (COP) — opcional' : 'Nightly rate (COP) — optional'}
              </label>
              <Input type="number" min={0} {...register('nightlyRate')} placeholder="200000" />
              {fieldError(errors.nightlyRate?.message as string | undefined)}
              <p className="text-xs text-gray-500 mt-1">
                {es
                  ? 'Si no tienes una tarifa fija, déjalo en blanco. La comisión se acuerda por reserva.'
                  : "Leave blank if you don't have a fixed rate. Commission is agreed per booking."}
              </p>
            </div>
          </div>
        )}

        {/* Step 2: Description & amenities */}
        {step === 2 && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {es ? 'Descripción de la propiedad' : 'Property description'}
              </label>
              <Textarea
                {...register('description')}
                rows={5}
                placeholder={
                  es
                    ? 'Describe tu propiedad: ambiente, vista, distribución, qué la hace especial...'
                    : 'Describe your property: vibe, view, layout, what makes it special...'
                }
              />
              {fieldError(errors.description?.message)}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {es ? 'Comodidades' : 'Amenities'}
              </label>
              <Textarea
                {...register('amenities')}
                rows={3}
                placeholder={es ? 'ej. Piscina, WiFi, aire acondicionado, parqueadero' : 'e.g., Pool, WiFi, A/C, parking'}
              />
              {fieldError(errors.amenities?.message)}
              <p className="text-xs text-gray-500 mt-1">
                {es ? 'Sepáralas por comas.' : 'Separate with commas.'}
              </p>
            </div>
          </div>
        )}

        {/* Step 3: Photos & calendar */}
        {step === 3 && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {es ? 'Enlace de fotos (Google Drive)' : 'Photos link (Google Drive)'}
              </label>
              <Input
                type="url"
                {...register('googleDriveLink')}
                placeholder="https://drive.google.com/drive/folders/..."
              />
              {fieldError(errors.googleDriveLink?.message)}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {es ? 'Enlace de calendario (opcional)' : 'Calendar link (optional)'}
              </label>
              <Input
                type="url"
                {...register('iCalLink')}
                placeholder="https://calendar.google.com/calendar/ical/..."
              />
              {fieldError(errors.iCalLink?.message)}
              <p className="text-xs text-gray-500 mt-1">
                {es
                  ? 'Comparte tu calendario de Google para que sepamos cuándo está disponible tu propiedad.'
                  : 'Share your Google Calendar so we know when your property is available.'}
              </p>
            </div>
          </div>
        )}

        {/* Step 4: Review */}
        {step === 4 && (
          <div className="space-y-3">
            <p className="text-sm text-gray-600">
              {es
                ? 'Revisa la información antes de publicar. Tu propiedad quedará visible para 77Rentals de inmediato.'
                : 'Review your info before publishing. Your property will be visible to 77Rentals right away.'}
            </p>
            <div className="rounded-lg border divide-y">
              <ReviewRow label={es ? 'Propiedad' : 'Property'} value={values.propertyName} />
              <ReviewRow label={es ? 'Tipo' : 'Type'} value={values.apartmentType} />
              <ReviewRow label={es ? 'Ciudad' : 'City'} value={values.city} />
              <ReviewRow label={es ? 'Dirección' : 'Address'} value={values.address} />
              <ReviewRow
                label={es ? 'Capacidad' : 'Capacity'}
                value={`${values.maxGuests} ${es ? 'huéspedes' : 'guests'} • ${values.bedrooms} ${es ? 'hab.' : 'bed'} • ${values.bathrooms} ${es ? 'baños' : 'bath'}`}
              />
              {values.nightlyRate !== '' && values.nightlyRate !== undefined && (
                <ReviewRow label={es ? 'Tarifa' : 'Rate'} value={`COP ${values.nightlyRate}/${es ? 'noche' : 'night'}`} />
              )}
              <ReviewRow label={es ? 'Comodidades' : 'Amenities'} value={values.amenities} />
              <ReviewRow label={es ? 'Fotos' : 'Photos'} value={values.googleDriveLink} truncate />
            </div>
          </div>
        )}

        {/* Step nav */}
        <div className="flex items-center justify-between pt-4 border-t">
          <Button type="button" variant="outline" onClick={step === 0 ? onClose : handleBack} className="gap-1.5">
            {step === 0 ? (
              es ? 'Cancelar' : 'Cancel'
            ) : (
              <>
                <ChevronLeft size={16} /> {es ? 'Atrás' : 'Back'}
              </>
            )}
          </Button>
          {step < totalSteps - 1 ? (
            <Button
              type="button"
              onClick={handleNext}
              className="bg-[#D4A843] hover:bg-[#c9963e] text-black font-semibold gap-1.5"
            >
              {es ? 'Siguiente' : 'Next'} <ChevronRight size={16} />
            </Button>
          ) : (
            <Button
              type="submit"
              disabled={isSaving}
              className="bg-[#D4A843] hover:bg-[#c9963e] text-black font-semibold gap-1.5"
            >
              <Check size={16} />
              {isSaving ? (es ? 'Publicando...' : 'Publishing...') : es ? 'Publicar propiedad' : 'Publish property'}
            </Button>
          )}
        </div>
      </form>
    </Card>
  );
}

function ReviewRow({ label, value, truncate }: { label: string; value: string; truncate?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-4 px-4 py-2.5">
      <span className="text-sm text-gray-500 flex-shrink-0">{label}</span>
      <span className={`text-sm text-gray-900 text-right ${truncate ? 'truncate max-w-[220px]' : ''}`}>{value}</span>
    </div>
  );
}
