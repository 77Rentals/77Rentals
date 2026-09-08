import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabaseClient';

export interface OwnerApprovalRow {
  id: string;
  name: string;
  phone: string;
  email: string;
  delVenttoId: string;
  approved: boolean;
  createdAt: string;
}

interface OwnerApprovalRowRaw {
  id: string;
  name: string;
  phone: string;
  email: string;
  del_venttto_id: string;
  approved: boolean;
  created_at: string;
}

/** Admin-only: list every owner registration and approve pending ones. */
export function useOwnerApprovals() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['owner-approvals'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('owner_profiles')
        .select('id, name, phone, email, del_venttto_id, approved, created_at')
        .order('created_at', { ascending: true })
        .returns<OwnerApprovalRowRaw[]>();
      if (error) throw error;
      return data.map((row): OwnerApprovalRow => ({
        id: row.id,
        name: row.name,
        phone: row.phone,
        email: row.email,
        delVenttoId: row.del_venttto_id,
        approved: row.approved,
        createdAt: row.created_at,
      }));
    },
  });

  const approveOwner = async (ownerId: string) => {
    const { error } = await supabase
      .from('owner_profiles')
      .update({ approved: true, approved_at: new Date().toISOString() })
      .eq('id', ownerId);
    if (error) throw error;
    await queryClient.invalidateQueries({ queryKey: ['owner-approvals'] });
  };

  const revokeOwner = async (ownerId: string) => {
    const { error } = await supabase
      .from('owner_profiles')
      .update({ approved: false, approved_at: null })
      .eq('id', ownerId);
    if (error) throw error;
    await queryClient.invalidateQueries({ queryKey: ['owner-approvals'] });
  };

  return {
    owners: query.data ?? [],
    isLoading: query.isLoading,
    approveOwner,
    revokeOwner,
  };
}
