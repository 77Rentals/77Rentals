import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useLanguage } from '@/contexts/LanguageContext';
import { t } from '@/lib/translations';
import { useOwnerProfile } from '@/hooks/useOwnerProfile';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import type { OwnerProfile as IOwnerProfile } from '@/data/partnerHub';

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name must be less than 100 characters'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits').max(20, 'Phone number must be less than 20 characters'),
  email: z.string().email('Must be a valid email'),
  delVenttoId: z.string().min(1, 'DelVentto Owner ID is required').max(50, 'DelVentto Owner ID must be less than 50 characters'),
});

type ProfileFormData = z.infer<typeof profileSchema>;

interface OwnerProfileProps {
  ownerId: string;
}

export function OwnerProfile({ ownerId }: OwnerProfileProps) {
  const [isSaving, setIsSaving] = useState(false);
  const { language } = useLanguage();
  const { toast } = useToast();
  const { getProfile, saveProfile } = useOwnerProfile(ownerId);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
  });

  // Load existing profile on mount
  useEffect(() => {
    const existingProfile = getProfile();
    if (existingProfile) {
      reset({
        name: existingProfile.name,
        phone: existingProfile.phone,
        email: existingProfile.email,
        delVenttoId: existingProfile.delVenttoId,
      });
    }
  }, [ownerId, getProfile, reset]);

  const onSubmit = async (data: ProfileFormData) => {
    try {
      setIsSaving(true);
      const profile: IOwnerProfile = {
        name: data.name,
        phone: data.phone,
        email: data.email,
        delVenttoId: data.delVenttoId,
      };
      saveProfile(profile);
      
      toast({
        title: language === 'es' ? 'Éxito' : 'Success',
        description: language === 'es' 
          ? 'Perfil guardado correctamente' 
          : 'Profile saved successfully',
        variant: 'default',
      });
    } catch (error) {
      toast({
        title: language === 'es' ? 'Error' : 'Error',
        description: language === 'es'
          ? 'No se pudo guardar el perfil'
          : 'Failed to save profile',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {language === 'es' ? 'Mi Perfil' : 'My Profile'}
        </h2>
        <p className="text-gray-600">
          {language === 'es'
            ? 'Actualiza tu información de contacto. Esta información se usará para tus ofertas de propiedades.'
            : 'Update your contact information. This will be used for your property offers.'}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {language === 'es' ? 'Nombre Completo' : 'Full Name'}
          </label>
          <Input
            type="text"
            {...register('name')}
            placeholder={language === 'es' ? 'Tu nombre' : 'Your name'}
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {language === 'es' ? 'Teléfono' : 'Phone'}
          </label>
          <Input
            type="tel"
            {...register('phone')}
            placeholder="+57 300 123 4567"
          />
          {errors.phone && (
            <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {language === 'es' ? 'Correo Electrónico' : 'Email'}
          </label>
          <Input
            type="email"
            {...register('email')}
            placeholder="you@example.com"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {language === 'es' ? 'ID de Propietario DelVentto' : 'DelVentto Owner ID'}
          </label>
          <Input
            type="text"
            {...register('delVenttoId')}
            placeholder={language === 'es' ? 'Tu ID de propietario' : 'Your owner ID'}
          />
          {errors.delVenttoId && (
            <p className="text-red-500 text-sm mt-1">{errors.delVenttoId.message}</p>
          )}
        </div>

        <Button
          type="submit"
          disabled={isSaving}
          className="w-full bg-[#D4A843] hover:bg-[#c9963e] text-black font-bold"
        >
          {isSaving 
            ? (language === 'es' ? 'Guardando...' : 'Saving...') 
            : (language === 'es' ? 'Guardar Perfil' : 'Save Profile')}
        </Button>
      </form>
    </div>
  );
}
