import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabaseClient';
import type { OwnerProperty } from '@/data/partnerHub';

interface AllOwnerPropertyRow {
  id: string;
  owner_id: string;
  property_name: string;
  apartment_type: OwnerProperty['apartmentType'];
  google_drive_link: string;
  ical_link: string | null;
  city: string;
  address: string;
  max_guests: number;
  bedrooms: number;
  bathrooms: number;
  nightly_rate: number | null;
  description: string;
  amenities: string;
  created_at: string;
  updated_at: string;
}

interface OwnerProfileLookupRow {
  id: string;
  name: string;
  email: string;
  phone: string;
}

export interface OwnerPropertyWithOwner extends OwnerProperty {
  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;
}

/** Admin-only: every property listed by every owner, newest first. */
export function useAllOwnerProperties() {
  const query = useQuery({
    queryKey: ['all-owner-properties'],
    queryFn: async () => {
      const { data: rows, error } = await supabase
        .from('owner_properties')
        .select(
          'id, owner_id, property_name, apartment_type, google_drive_link, ical_link, city, address, max_guests, bedrooms, bathrooms, nightly_rate, description, amenities, created_at, updated_at'
        )
        .order('created_at', { ascending: false })
        .returns<AllOwnerPropertyRow[]>();
      if (error) throw error;

      const ownerIds = [...new Set(rows.map((r) => r.owner_id))];
      const ownerByI: Record<string, OwnerProfileLookupRow> = {};
      if (ownerIds.length > 0) {
        const { data: owners, error: ownersError } = await supabase
          .from('owner_profiles')
          .select('id, name, email, phone')
          .in('id', ownerIds)
          .returns<OwnerProfileLookupRow[]>();
        if (ownersError) throw ownersError;
        for (const o of owners) ownerByI[o.id] = o;
      }

      return rows.map((row): OwnerPropertyWithOwner => ({
        id: row.id,
        ownerId: row.owner_id,
        propertyName: row.property_name,
        apartmentType: row.apartment_type,
        googleDriveLink: row.google_drive_link,
        iCalLink: row.ical_link ?? undefined,
        city: row.city,
        address: row.address,
        maxGuests: row.max_guests,
        bedrooms: row.bedrooms,
        bathrooms: row.bathrooms,
        nightlyRate: row.nightly_rate ?? undefined,
        description: row.description,
        amenities: row.amenities,
        createdAt: new Date(row.created_at),
        updatedAt: new Date(row.updated_at),
        ownerName: ownerByI[row.owner_id]?.name ?? '',
        ownerEmail: ownerByI[row.owner_id]?.email ?? '',
        ownerPhone: ownerByI[row.owner_id]?.phone ?? '',
      }));
    },
  });

  return {
    properties: query.data ?? [],
    isLoading: query.isLoading,
  };
}
