import { supabase } from '@/lib/supabaseClient';
import type { ClientSigningFormData, ClientSigningLink } from '@/data/clientSigningLink';

interface ClientLinkRow {
  id: string;
  status: 'pending' | 'signed';
  title: string;
  contract_text: string;
  client_name: string | null;
  signed_at: string | null;
  signature_image?: string | null;
}

function rowToLink(row: ClientLinkRow): ClientSigningLink {
  return {
    id: row.id,
    status: row.status,
    title: row.title,
    contractText: row.contract_text,
    clientName: row.client_name ?? undefined,
    signedAt: row.signed_at ? new Date(row.signed_at) : undefined,
    signatureImage: row.signature_image ?? undefined,
  };
}

/** Public, no-login lookup of one client signing link by its (unguessable) id. */
export async function getClientSigningLink(id: string): Promise<ClientSigningLink | null> {
  const { data, error } = await supabase.rpc('get_client_signing_link', { p_id: id });
  if (error) throw error;
  const row = Array.isArray(data) ? data[0] : data;
  if (!row) return null;
  return rowToLink(row as ClientLinkRow);
}

/** Public, no-login signing of one link. Fails if it was already signed. */
export async function signClientSigningLink(
  id: string,
  data: ClientSigningFormData,
  contractHash: string,
  signatureImage: string
): Promise<void> {
  const { error } = await supabase.rpc('sign_client_signing_link', {
    p_id: id,
    p_client_name: data.clientName,
    p_client_id_number: data.clientIdNumber,
    p_client_contact_email: data.clientContactEmail,
    p_client_contact_phone: data.clientContactPhone,
    p_signature_image: signatureImage,
    p_contract_hash: contractHash,
    p_user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : null,
  });
  if (error) throw error;
}

/** Admin-only: creates a new client signing link with the pasted contract text. */
export async function createClientSigningLink(title: string, contractText: string): Promise<string> {
  const { data: userData } = await supabase.auth.getUser();
  const { data, error } = await supabase
    .from('client_signing_links')
    .insert({ title, contract_text: contractText, created_by: userData.user?.id })
    .select('id')
    .single();
  if (error) throw error;
  return data.id as string;
}

/** Admin-only: lists all client signing links created so far, newest first. */
export async function listClientSigningLinks(): Promise<(ClientSigningLink & { createdAt: Date })[]> {
  const { data, error } = await supabase
    .from('client_signing_links')
    .select('id, status, title, contract_text, client_name, signed_at, signature_image, created_at')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []).map((row) => ({
    ...rowToLink(row as ClientLinkRow),
    createdAt: new Date((row as { created_at: string }).created_at),
  }));
}

/** Admin-only: deletes a link that hasn't been signed yet (e.g. created by mistake). */
export async function deleteClientSigningLink(id: string): Promise<void> {
  const { error } = await supabase.from('client_signing_links').delete().eq('id', id);
  if (error) throw error;
}
