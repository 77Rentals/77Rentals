import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useOwnerProfile } from '@/hooks/useOwnerProfile';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import type { OwnerProfile } from '@/data/partnerHub';

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().min(5, 'Phone number is required'),
  email: z.string().email('Valid email is required'),
  delVenttoId: z.string().min(1, 'DelVentto Owner ID is required'),
});

type ProfileFormData = z.infer<typeof profileSchema>;

interface OwnerProfileProps {
  ownerId: string;
}

export function OwnerProfileComponent({ ownerId }: OwnerProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { getProfile, saveProfile } = useOwnerProfile(ownerId);
  const { toast } = useToast();

  const existingProfile = getProfile();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: existingProfile || {
      name: '',
      phone: '',
      email: '',
      delVenttoId: '',
    },
  });

  useEffect(() => {
    if (existingProfile) {
      reset(existingProfile);
    }
  }, [existingProfile, reset]);

  const onSubmit = async (data: ProfileFormData) => {
    try {
      setIsSaving(true);
      const success = saveProfile(data as OwnerProfile);

      if (success) {
        toast({
          title: 'Success',
          description: 'Your profile has been saved.',
          variant: 'default',
        });
        setIsEditing(false);
      } else {
        toast({
          title: 'Error',
          description: 'Failed to save your profile. Please try again.',
          variant: 'destructive',
        });
      }
    } finally {
      setIsSaving(false);
    }
  };

  if (!isEditing && existingProfile) {
    return (
      <div className="space-y-6">
        <Card className="p-6">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-600">Name</label>
              <p className="text-lg font-semibold text-gray-900">{existingProfile.name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Phone</label>
              <p className="text-lg text-gray-900">{existingProfile.phone}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Email</label>
              <p className="text-lg text-gray-900">{existingProfile.email}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">DelVentto Owner ID</label>
              <p className="text-lg text-gray-900">{existingProfile.delVenttoId}</p>
            </div>
          </div>
          <div className="mt-6 flex gap-3">
            <Button
              type="button"
              onClick={() => setIsEditing(true)}
              className="bg-[#D4A843] hover:bg-[#c9963e] text-black font-semibold"
            >
              Edit Profile
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <Input
              type="text"
              {...register('name')}
              placeholder="Your full name"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone
            </label>
            <Input
              type="tel"
              {...register('phone')}
              placeholder="+1 (555) 123-4567"
            />
            {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <Input
              type="email"
              {...register('email')}
              placeholder="you@example.com"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              DelVentto Owner ID
            </label>
            <Input
              type="text"
              {...register('delVenttoId')}
              placeholder="Your DelVentto owner ID"
            />
            {errors.delVenttoId && (
              <p className="text-red-500 text-sm mt-1">{errors.delVenttoId.message}</p>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            {isEditing && (
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsEditing(false);
                  reset();
                }}
              >
                Cancel
              </Button>
            )}
            <Button
              type="submit"
              disabled={isSaving}
              className="bg-[#D4A843] hover:bg-[#c9963e] text-black font-semibold"
            >
              {isSaving ? 'Saving...' : 'Save Profile'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
