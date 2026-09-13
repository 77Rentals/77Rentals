import { supabase } from '@/lib/supabaseClient';
import type { Petition, PetitionSignature, PetitionSignatureFormData, PropertyType } from '@/data/petition';

interface PetitionRow {
  id: string;
  status: 'open' | 'closed';
  title: string;
  document_text: string;
  signed_count: number;
  total_apartments: number;
}

function rowToPetition(row: PetitionRow): Petition {
  return {
    id: row.id,
    status: row.status,
    title: row.title,
    documentText: row.document_text,
    signedCount: Number(row.signed_count),
    totalApartments: Number(row.total_apartments),
  };
}

/** Public, no-login lookup of a petition by its (unguessable) id, plus a live headcount. */
export async function getPetition(id: string): Promise<Petition | null> {
  const { data, error } = await supabase.rpc('get_petition', { p_id: id });
  if (error) throw error;
  const row = Array.isArray(data) ? data[0] : data;
  if (!row) return null;
  return rowToPetition(row as PetitionRow);
}

/** Public, no-login signing: one row per unit. Fails if the unit already signed or the petition is closed. */
export async function signPetition(
  id: string,
  data: PetitionSignatureFormData,
  signatureImage: string,
  documentHash: string
): Promise<void> {
  const { error } = await supabase.rpc('sign_petition', {
    p_id: id,
    p_unit_number: data.unitNumber,
    p_signer_name: data.signerName,
    p_signer_id_number: data.signerIdNumber || null,
    p_property_type: data.propertyType,
    p_apartment_count: Number(data.apartmentCount),
    p_consent_method: data.consentMethod,
    p_signature_image: signatureImage,
    p_document_hash: documentHash,
    p_user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : null,
  });
  if (error) throw error;
}

/** Admin-only: creates a new petition with the pasted document text. */
export async function createPetition(title: string, documentText: string): Promise<string> {
  const { data: userData } = await supabase.auth.getUser();
  const { data, error } = await supabase
    .from('petitions')
    .insert({
      title,
      document_text: documentText,
      created_by: userData.user?.id,
    })
    .select('id')
    .single();
  if (error) throw error;
  return data.id as string;
}

/** Admin-only: lists all petitions, newest first. */
export async function listPetitions(): Promise<Petition[]> {
  const { data: petitionRows, error: petitionsError } = await supabase
    .from('petitions')
    .select('id, status, title, document_text')
    .order('created_at', { ascending: false });
  if (petitionsError) throw petitionsError;
  if (!petitionRows || petitionRows.length === 0) return [];

  const { data: signatureRows, error: signaturesError } = await supabase
    .from('petition_signatures')
    .select('petition_id, apartment_count')
    .in(
      'petition_id',
      petitionRows.map((p) => p.id as string)
    );
  if (signaturesError) throw signaturesError;

  const tallies = new Map<string, { count: number; apartments: number }>();
  (signatureRows ?? []).forEach((row) => {
    const petitionId = row.petition_id as string;
    const tally = tallies.get(petitionId) ?? { count: 0, apartments: 0 };
    tally.count += 1;
    tally.apartments += Number(row.apartment_count);
    tallies.set(petitionId, tally);
  });

  return petitionRows.map((row) => {
    const tally = tallies.get(row.id as string) ?? { count: 0, apartments: 0 };
    return {
      id: row.id as string,
      status: row.status as 'open' | 'closed',
      title: row.title as string,
      documentText: row.document_text as string,
      signedCount: tally.count,
      totalApartments: tally.apartments,
    };
  });
}

/** Admin-only: lists every individual signature for one petition, newest first. */
export async function listPetitionSignatures(petitionId: string): Promise<PetitionSignature[]> {
  const { data, error } = await supabase
    .from('petition_signatures')
    .select(
      'id, unit_number, signer_name, signer_id_number, property_type, apartment_count, consent_method, signature_image, signed_at'
    )
    .eq('petition_id', petitionId)
    .order('signed_at', { ascending: true });
  if (error) throw error;
  return (data ?? []).map((row) => ({
    id: row.id as string,
    unitNumber: row.unit_number as string,
    signerName: row.signer_name as string,
    signerIdNumber: (row.signer_id_number as string | null) ?? null,
    propertyType: row.property_type as PropertyType,
    apartmentCount: Number(row.apartment_count),
    consentMethod: row.consent_method as string,
    signatureImage: row.signature_image as string,
    signedAt: new Date(row.signed_at as string),
  }));
}

/** Admin-only: removes one mistaken/duplicate signature so the owner can re-sign. */
export async function deletePetitionSignature(id: string): Promise<void> {
  const { error } = await supabase.from('petition_signatures').delete().eq('id', id);
  if (error) throw error;
}

/** Admin-only: opens/closes a petition to new signatures. */
export async function setPetitionStatus(id: string, status: 'open' | 'closed'): Promise<void> {
  const { error } = await supabase.from('petitions').update({ status }).eq('id', id);
  if (error) throw error;
}

/** Admin-only: deletes a petition and all its signatures (e.g. created by mistake). */
export async function deletePetition(id: string): Promise<void> {
  const { error } = await supabase.from('petitions').delete().eq('id', id);
  if (error) throw error;
}
