import { supabase } from '@/lib/supabaseClient';
import type { OwnerSigningFormData, OwnerSigningLink, OwnerUnitType } from '@/data/ownerSigningLink';

interface SigningLinkRow {
  id: string;
  unit_type: OwnerUnitType;
  status: 'pending' | 'signed';
  owner_name: string | null;
  building_name: string | null;
  apartment_number: string | null;
  unit_count: number | null;
  signed_at: string | null;
}

function rowToLink(row: SigningLinkRow): OwnerSigningLink {
  return {
    id: row.id,
    unitType: row.unit_type,
    status: row.status,
    ownerName: row.owner_name ?? undefined,
    buildingName: row.building_name ?? undefined,
    apartmentNumber: row.apartment_number ?? undefined,
    unitCount: row.unit_count ?? undefined,
    signedAt: row.signed_at ? new Date(row.signed_at) : undefined,
  };
}

/** Public, no-login lookup of one signing link by its (unguessable) id. */
export async function getOwnerSigningLink(id: string): Promise<OwnerSigningLink | null> {
  const { data, error } = await supabase.rpc('get_owner_signing_link', { p_id: id });
  if (error) throw error;
  const row = Array.isArray(data) ? data[0] : data;
  if (!row) return null;
  return rowToLink(row as SigningLinkRow);
}

/** Public, no-login signing of one link. Fails if it was already signed. */
export async function signOwnerSigningLink(
  id: string,
  data: OwnerSigningFormData,
  contractHash: string,
  ndaHash: string
): Promise<void> {
  const { error } = await supabase.rpc('sign_owner_signing_link', {
    p_id: id,
    p_owner_name: data.ownerName,
    p_owner_id_number: data.ownerIdNumber,
    p_owner_contact_email: data.ownerContactEmail,
    p_owner_contact_phone: data.ownerContactPhone,
    p_building_name: data.buildingName,
    p_apartment_number: data.apartmentNumber,
    p_unit_count: data.unitCount,
    p_contract_hash: contractHash,
    p_nda_hash: ndaHash,
    p_user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : null,
  });
  if (error) throw error;
}

/** Admin-only: creates a new signing link for one unit type. */
export async function createOwnerSigningLink(unitType: OwnerUnitType): Promise<string> {
  const { data: userData } = await supabase.auth.getUser();
  const { data, error } = await supabase
    .from('owner_signing_links')
    .insert({ unit_type: unitType, created_by: userData.user?.id })
    .select('id')
    .single();
  if (error) throw error;
  return data.id as string;
}

/** Admin-only: lists all signing links created so far, newest first. */
export async function listOwnerSigningLinks(): Promise<
  (OwnerSigningLink & { createdAt: Date })[]
> {
  const { data, error } = await supabase
    .from('owner_signing_links')
    .select('id, unit_type, status, owner_name, building_name, apartment_number, unit_count, signed_at, created_at')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []).map((row) => ({
    ...rowToLink(row as SigningLinkRow),
    createdAt: new Date((row as { created_at: string }).created_at),
  }));
}
