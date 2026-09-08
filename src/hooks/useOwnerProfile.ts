import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabaseClient';
import type { OwnerProfile } from '@/data/partnerHub';

interface OwnerProfileRow {
  name: string;
  phone: string;
  email: string;
  del_venttto_id: string;
  approved: boolean;
}

/** ownerId is the Supabase Auth user UUID (auth.userId), not an email. */
export function useOwnerProfile(ownerId: string) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['owner-profile', ownerId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('owner_profiles')
        .select('name, phone, email, del_venttto_id, approved')
        .eq('id', ownerId)
        .maybeSingle<OwnerProfileRow>();
      if (error) throw error;
      if (!data) return null;
      const profile: OwnerProfile & { approved: boolean } = {
        name: data.name,
        phone: data.phone,
        email: data.email,
        delVenttoId: data.del_venttto_id,
        approved: data.approved,
      };
      return profile;
    },
    enabled: !!ownerId,
  });

  const saveProfile = async (profile: OwnerProfile) => {
    const { error } = await supabase.from('owner_profiles').upsert({
      id: ownerId,
      name: profile.name,
      phone: profile.phone,
      email: profile.email,
      del_venttto_id: profile.delVenttoId,
      updated_at: new Date().toISOString(),
    });
    if (error) throw error;
    await queryClient.invalidateQueries({ queryKey: ['owner-profile', ownerId] });
  };

  return {
    profile: query.data ?? null,
    isLoading: query.isLoading,
    saveProfile,
  };
}
