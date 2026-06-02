import type { OwnerProfile } from '@/data/partnerHub';

export function useOwnerProfile(ownerId: string) {
  const getProfile = (): OwnerProfile | null => {
    const data = localStorage.getItem(`ownerProfile_${ownerId}`);
    return data ? JSON.parse(data) : null;
  };

  const saveProfile = (profile: OwnerProfile) => {
    localStorage.setItem(`ownerProfile_${ownerId}`, JSON.stringify(profile));
  };

  const deleteProfile = () => {
    localStorage.removeItem(`ownerProfile_${ownerId}`);
  };

  return { getProfile, saveProfile, deleteProfile };
}
