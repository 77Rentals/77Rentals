import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import type { GuestRequirement, ApartmentType } from '@/data/partnerHub';

const APARTMENT_TYPES: ApartmentType[] = ['Tipo A', 'Tipo B', 'Tipo C', 'Tipo D'];

const editSchema = z.object({
  checkInDate: z.string().min(1, 'Check-in date is required'),
  checkOutDate: z.string().min(1, 'Check-out date is required'),
  budget: z.preprocess(
    (v) => (v === '' || v === null || isNaN(Number(v)) ? undefined : Number(v)),
    z.number({ required_error: 'Budget is required' }).min(10000, 'Budget must be at least $10,000').max(10000000)
  ),
  notes: z.string().max(500, 'Notes must be less than 500 characters').optional().default(''),
  allowedApartmentTypes: z.array(z.string()).min(1, 'Select at least one apartment type'),
});

type EditFormData = z.infer<typeof editSchema>;

interface EditRequirementFormProps {
  requirement: GuestRequirement;
  onSave: (updates: Partial<GuestRequirement>) => void;
  onCancel: () => void;
}

export function EditRequirementForm({ requirement, onSave, onCancel }: EditRequirementFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const { language } = useLanguage();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EditFormData>({
    resolver: zodResolver(editSchema),
    defaultValues: {
      checkInDate: requirement.checkInDate,
      checkOutDate: requirement.checkOutDate,
      budget: requirement.budget,
      notes: requirement.notes,
      allowedApartmentTypes: requirement.allowedApartmentTypes,
    },
  });

  const onSubmitForm = async (data: EditFormData) => {
    try {
      setSubmitError(null);

      // Validate date range
      if (data.checkInDate >= data.checkOutDate) {
        setSubmitError(language === 'es'
          ? 'La fecha de salida debe ser posterior a la fecha de entrada'
          : 'Check-out date must be after check-in date');
        return;
      }

      // Validate apartment types selected
      if (data.allowedApartmentTypes.length === 0) {
        setSubmitError(language === 'es'
          ? 'Selecciona al menos un tipo de apartamento'
          : 'Please select at least one apartment type');
        return;
      }

      setIsSubmitting(true);

      // Prepare updates
      const updates: Partial<GuestRequirement> = {
        checkInDate: data.checkInDate,
        checkOutDate: data.checkOutDate,
        budget: data.budget,
        notes: data.notes,
        allowedApartmentTypes: data.allowedApartmentTypes as ApartmentType[],
      };

      onSave(updates);
    } catch (error) {
      setSubmitError(language === 'es'
        ? 'Error al actualizar el requisito'
        : 'Failed to update requirement. Please try again.');
      console.error('Error updating requirement:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="border-t bg-yellow-50 border-yellow-200 p-4">
      <h3 className="font-semibold text-gray-900 mb-4">
        {language === 'es' ? 'Editar Requisito' : 'Edit Requirement'}
      </h3>

      <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4">
        {submitError && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {submitError}
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {language === 'es' ? 'Fecha de Entrada' : 'Check-in Date'}
            </label>
            <Input
              type="date"
              {...register('checkInDate')}
              className="w-full"
            />
            {errors.checkInDate && (
              <p className="text-red-500 text-sm mt-1">{errors.checkInDate.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {language === 'es' ? 'Fecha de Salida' : 'Check-out Date'}
            </label>
            <Input
              type="date"
              {...register('checkOutDate')}
              className="w-full"
            />
            {errors.checkOutDate && (
              <p className="text-red-500 text-sm mt-1">{errors.checkOutDate.message}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {language === 'es' ? 'Presupuesto por Noche (COP)' : 'Budget per Night (COP)'}
          </label>
          <Input
            type="number"
            min="10000"
            step="10000"
            {...register('budget')}
            className="w-full"
          />
          {errors.budget && (
            <p className="text-red-500 text-sm mt-1">{errors.budget.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {language === 'es' ? 'Tipos de Apartamento Aceptados' : 'Apartment Types Accepted'}
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
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {language === 'es' ? 'Notas Adicionales' : 'Additional Notes'}
          </label>
          <textarea
            {...register('notes')}
            placeholder={language === 'es' ? 'Ej: cerca de playa, debe tener cocina, etc.' : 'E.g., near beach, must have kitchen, etc.'}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A843]"
          />
          {errors.notes && (
            <p className="text-red-500 text-sm mt-1">{errors.notes.message}</p>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-2 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="flex-1"
          >
            {language === 'es' ? 'Cancelar' : 'Cancel'}
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 bg-[#D4A843] hover:bg-[#c9963e] text-black font-bold"
          >
            {isSubmitting ? (language === 'es' ? 'Guardando...' : 'Saving...') : (language === 'es' ? 'Guardar Cambios' : 'Save Changes')}
          </Button>
        </div>
      </form>
    </div>
  );
}
