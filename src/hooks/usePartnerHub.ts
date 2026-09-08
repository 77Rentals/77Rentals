import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabaseClient';
import type {
  ApartmentType,
  ContractSignature,
  GuestRequirement,
  NDASignature,
  PartnershipResponse,
} from '@/data/partnerHub';

interface RequirementRow {
  id: string;
  created_at: string;
  guest_count: number;
  check_in_date: string;
  check_out_date: string;
  budget: number;
  notes: string;
  city: string;
  status: GuestRequirement['status'];
  allowed_apartment_types: ApartmentType[];
  commission_type: GuestRequirement['commissionType'];
  commission_value: number | null;
  admin_contact_name: string;
  admin_contact_phone: string;
  admin_contact_email: string;
}

interface OfferRow {
  id: string;
  requirement_id: string;
  owner_id: string;
  property_id: string | null;
  property_name: string;
  proposed_price: number;
  cleaning_fee: number;
  commission_percent: number;
  commission_amount: number;
  final_price: number;
  apartment_type: ApartmentType;
  torre_apartamento: string;
  google_drive_link: string;
  apartment_bio: string;
  notes: string;
  owner_contact_name: string;
  owner_contact_phone: string;
  owner_contact_email: string;
  ical_link: string | null;
  status: PartnershipResponse['status'];
  rejection_note: string | null;
  responded_at: string;
  nda_status: PartnershipResponse['ndaStatus'];
  contract_status: PartnershipResponse['contractStatus'];
}

interface NdaSignatureRow {
  id: string;
  offer_id: string;
  signed_by: 'admin' | 'owner';
  signer_name: string;
  signed_at: string;
}

interface ContractSignatureRow {
  id: string;
  offer_id: string;
  signed_by: 'admin' | 'owner';
  signer_name: string;
  signer_id_number: string;
  contract_hash: string;
  user_agent: string | null;
  signed_at: string;
}

function rowToRequirement(row: RequirementRow): GuestRequirement {
  return {
    id: row.id,
    createdAt: new Date(row.created_at),
    guestCount: row.guest_count,
    checkInDate: row.check_in_date,
    checkOutDate: row.check_out_date,
    budget: row.budget,
    notes: row.notes,
    city: row.city,
    status: row.status,
    allowedApartmentTypes: row.allowed_apartment_types,
    commissionType: row.commission_type,
    commissionValue: row.commission_value ?? undefined,
    adminContact: {
      name: row.admin_contact_name,
      phone: row.admin_contact_phone,
      email: row.admin_contact_email,
    },
  };
}

function rowToOffer(
  row: OfferRow,
  signatures: NdaSignatureRow[],
  contractSignatures: ContractSignatureRow[]
): PartnershipResponse {
  const toSignature = (s: NdaSignatureRow): NDASignature => ({
    signedBy: s.signed_by,
    signerName: s.signer_name,
    timestamp: new Date(s.signed_at),
  });
  const adminSig = signatures.find((s) => s.signed_by === 'admin');
  const ownerSig = signatures.find((s) => s.signed_by === 'owner');

  const toContractSignature = (s: ContractSignatureRow): ContractSignature => ({
    signedBy: s.signed_by,
    signerName: s.signer_name,
    signerIdNumber: s.signer_id_number,
    timestamp: new Date(s.signed_at),
    contractHash: s.contract_hash,
    userAgent: s.user_agent ?? undefined,
  });
  const adminContractSig = contractSignatures.find((s) => s.signed_by === 'admin');
  const ownerContractSig = contractSignatures.find((s) => s.signed_by === 'owner');

  return {
    id: row.id,
    requirementId: row.requirement_id,
    ownerId: row.owner_id,
    propertyName: row.property_name,
    proposedPrice: row.proposed_price,
    cleaningFee: row.cleaning_fee,
    commissionPercent: row.commission_percent,
    commissionAmount: row.commission_amount,
    finalPrice: row.final_price,
    apartmentType: row.apartment_type,
    torreApartamento: row.torre_apartamento,
    googleDriveLink: row.google_drive_link,
    apartmentBio: row.apartment_bio,
    notes: row.notes,
    ownerContact: {
      name: row.owner_contact_name,
      phone: row.owner_contact_phone,
      email: row.owner_contact_email,
    },
    iCalLink: row.ical_link ?? undefined,
    status: row.status,
    rejectionNote: row.rejection_note ?? undefined,
    respondedAt: new Date(row.responded_at),
    ndaStatus: row.nda_status,
    adminSignature: adminSig ? toSignature(adminSig) : undefined,
    ownerSignature: ownerSig ? toSignature(ownerSig) : undefined,
    contractStatus: row.contract_status,
    adminContractSignature: adminContractSig ? toContractSignature(adminContractSig) : undefined,
    ownerContractSignature: ownerContractSig ? toContractSignature(ownerContractSig) : undefined,
  };
}

export interface NewRequirementInput {
  guestCount: number;
  checkInDate: string;
  checkOutDate: string;
  budget: number;
  notes: string;
  city: string;
  allowedApartmentTypes: ApartmentType[];
  commissionType: GuestRequirement['commissionType'];
  commissionValue?: number;
  adminContact: GuestRequirement['adminContact'];
}

export interface NewOfferInput {
  requirementId: string;
  propertyId: string;
  propertyName: string;
  proposedPrice: number;
  cleaningFee: number;
  commissionPercent: number;
  commissionAmount: number;
  finalPrice: number;
  apartmentType: ApartmentType;
  torreApartamento: string;
  googleDriveLink: string;
  apartmentBio: string;
  notes: string;
  ownerContact: PartnershipResponse['ownerContact'];
  iCalLink?: string;
  status: PartnershipResponse['status'];
}

/**
 * Hook for managing Partner Hub data via Supabase (requirements + offers +
 * NDA signatures). Row Level Security scopes what each query returns: admins
 * see everything, approved owners see all requirements but only their own
 * offers -- so no client-side "is this mine" filtering is needed.
 */
export function usePartnerHub() {
  const queryClient = useQueryClient();

  const requirementsQuery = useQuery({
    queryKey: ['partner-requirements'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('partner_requirements')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return (data ?? []).map(rowToRequirement);
    },
  });

  const offersQuery = useQuery({
    queryKey: ['partner-offers'],
    queryFn: async () => {
      const { data: offers, error } = await supabase
        .from('partner_offers')
        .select('*')
        .order('responded_at', { ascending: false });
      if (error) throw error;

      const offerIds = (offers ?? []).map((o) => o.id);
      let signatures: NdaSignatureRow[] = [];
      let contractSignatures: ContractSignatureRow[] = [];
      if (offerIds.length > 0) {
        const [{ data: sigData, error: sigError }, { data: contractSigData, error: contractSigError }] =
          await Promise.all([
            supabase.from('nda_signatures').select('*').in('offer_id', offerIds),
            supabase.from('contract_signatures').select('*').in('offer_id', offerIds),
          ]);
        if (sigError) throw sigError;
        if (contractSigError) throw contractSigError;
        signatures = sigData ?? [];
        contractSignatures = contractSigData ?? [];
      }

      return (offers ?? []).map((row) =>
        rowToOffer(
          row,
          signatures.filter((s) => s.offer_id === row.id),
          contractSignatures.filter((s) => s.offer_id === row.id)
        )
      );
    },
  });

  const requirements = requirementsQuery.data ?? [];
  const responses = offersQuery.data ?? [];

  const invalidateRequirements = () =>
    queryClient.invalidateQueries({ queryKey: ['partner-requirements'] });
  const invalidateOffers = () => queryClient.invalidateQueries({ queryKey: ['partner-offers'] });

  const addRequirement = async (req: NewRequirementInput) => {
    const { data: userData } = await supabase.auth.getUser();
    const { error } = await supabase.from('partner_requirements').insert({
      created_by: userData.user?.id,
      guest_count: req.guestCount,
      check_in_date: req.checkInDate,
      check_out_date: req.checkOutDate,
      budget: req.budget,
      notes: req.notes,
      city: req.city,
      status: 'open',
      allowed_apartment_types: req.allowedApartmentTypes,
      commission_type: req.commissionType,
      commission_value: req.commissionValue ?? null,
      admin_contact_name: req.adminContact.name,
      admin_contact_phone: req.adminContact.phone,
      admin_contact_email: req.adminContact.email,
    });
    if (error) throw error;
    await invalidateRequirements();
  };

  const updateRequirement = async (id: string, updates: Partial<GuestRequirement>) => {
    const payload: Record<string, unknown> = {};
    if (updates.checkInDate !== undefined) payload.check_in_date = updates.checkInDate;
    if (updates.checkOutDate !== undefined) payload.check_out_date = updates.checkOutDate;
    if (updates.budget !== undefined) payload.budget = updates.budget;
    if (updates.notes !== undefined) payload.notes = updates.notes;
    if (updates.status !== undefined) payload.status = updates.status;
    if (updates.allowedApartmentTypes !== undefined)
      payload.allowed_apartment_types = updates.allowedApartmentTypes;
    if (updates.commissionType !== undefined) payload.commission_type = updates.commissionType;
    if (updates.commissionValue !== undefined) payload.commission_value = updates.commissionValue;

    const { error } = await supabase.from('partner_requirements').update(payload).eq('id', id);
    if (error) throw error;
    await invalidateRequirements();
  };

  const deleteRequirement = async (id: string) => {
    const { error } = await supabase.from('partner_requirements').delete().eq('id', id);
    if (error) throw error;
    await invalidateRequirements();
  };

  const addResponse = async (resp: NewOfferInput) => {
    const { data: userData } = await supabase.auth.getUser();
    const { error } = await supabase.from('partner_offers').insert({
      requirement_id: resp.requirementId,
      owner_id: userData.user?.id,
      property_id: resp.propertyId,
      property_name: resp.propertyName,
      proposed_price: resp.proposedPrice,
      cleaning_fee: resp.cleaningFee,
      commission_percent: resp.commissionPercent,
      commission_amount: resp.commissionAmount,
      final_price: resp.finalPrice,
      apartment_type: resp.apartmentType,
      torre_apartamento: resp.torreApartamento,
      google_drive_link: resp.googleDriveLink,
      apartment_bio: resp.apartmentBio,
      notes: resp.notes,
      owner_contact_name: resp.ownerContact.name,
      owner_contact_phone: resp.ownerContact.phone,
      owner_contact_email: resp.ownerContact.email,
      ical_link: resp.iCalLink ?? null,
      status: resp.status,
    });
    if (error) throw error;
    await invalidateOffers();
  };

  const updateResponse = async (
    id: string,
    updates: Partial<Pick<PartnershipResponse, 'status' | 'rejectionNote'>>
  ) => {
    const payload: Record<string, unknown> = {};
    if (updates.status !== undefined) payload.status = updates.status;
    if (updates.rejectionNote !== undefined) payload.rejection_note = updates.rejectionNote;

    const { error } = await supabase.from('partner_offers').update(payload).eq('id', id);
    if (error) throw error;
    await invalidateOffers();
  };

  /**
   * Records one party's NDA signature and recomputes nda_status, via a
   * SECURITY DEFINER RPC (public/shared/partner-hub-signing-rpc-migration.sql).
   * A direct client-side `update partner_offers` here would silently affect
   * 0 rows for an owner signing first -- there is no RLS policy letting an
   * owner update partner_offers -- so the status recompute has to happen
   * server-side, atomically with the signature insert, authorized per-call.
   */
  const signNDA = async (
    offerId: string,
    signedBy: 'admin' | 'owner',
    signerName: string
  ): Promise<PartnershipResponse['ndaStatus']> => {
    const { data, error } = await supabase.rpc('sign_nda', {
      p_offer_id: offerId,
      p_signed_by: signedBy,
      p_signer_name: signerName,
    });
    if (error) throw error;
    await invalidateOffers();
    return data as PartnershipResponse['ndaStatus'];
  };

  /** Records one party's contract signature and recomputes contract_status (see signNDA). */
  const signContract = async (
    offerId: string,
    signedBy: 'admin' | 'owner',
    signerName: string,
    signerIdNumber: string,
    contractHash: string
  ): Promise<PartnershipResponse['contractStatus']> => {
    const { data, error } = await supabase.rpc('sign_contract', {
      p_offer_id: offerId,
      p_signed_by: signedBy,
      p_signer_name: signerName,
      p_signer_id_number: signerIdNumber,
      p_contract_hash: contractHash,
      p_user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : null,
    });
    if (error) throw error;
    await invalidateOffers();
    return data as PartnershipResponse['contractStatus'];
  };

  const getResponseCountForRequirement = (requirementId: string): number =>
    responses.filter((r) => r.requirementId === requirementId).length;

  const getOpenRequirementsCount = (): number =>
    requirements.filter((r) => r.status === 'open').length;

  return {
    requirements,
    responses,
    isLoading: requirementsQuery.isLoading || offersQuery.isLoading,
    addRequirement,
    updateRequirement,
    deleteRequirement,
    addResponse,
    updateResponse,
    signNDA,
    signContract,
    getResponseCountForRequirement,
    getOpenRequirementsCount,
  };
}
