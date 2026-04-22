import type { OwnerProfile } from '@/data/partnerHub';

/**
 * Hook for managing owner profile data in localStorage
 * Each owner's profile is stored separately using their email as key
 */
export function useOwnerProfile(ownerId: string) {
  const getProfile = (): OwnerProfile | null => {
    try {
      const data = localStorage.getItem(`ownerProfile_${ownerId}`);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error reading profile:', error);
      return null;
    }
  };

  const saveProfile = (profile: OwnerProfile): boolean => {
    try {
      localStorage.setItem(`ownerProfile_${ownerId}`, JSON.stringify(profile));
      return true;
    } catch (error) {
      console.error('Error saving profile:', error);
      return false;
    }
  };

  const deleteProfile = (): boolean => {
    try {
      localStorage.removeItem(`ownerProfile_${ownerId}`);
      return true;
    } catch (error) {
      console.error('Error deleting profile:', error);
      return false;
    }
  };

  return { getProfile, saveProfile, deleteProfile };
}
