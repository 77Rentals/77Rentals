import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabaseClient';
import type { ApartmentType, OwnerProperty } from '@/data/partnerHub';

interface OwnerPropertyRow {
  id: string;
  owner_id: string;
  property_name: string;
  apartment_type: ApartmentType;
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

function rowToProperty(row: OwnerPropertyRow): OwnerProperty {
  return {
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
  };
}

/**
 * Hook for managing owner properties via Supabase. ownerId is the Supabase
 * Auth user UUID (auth.userId), not an email.
 */
export function useOwnerProperties(ownerId: string) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['owner-properties', ownerId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('owner_properties')
        .select('*')
        .eq('owner_id', ownerId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return (data ?? []).map(rowToProperty);
    },
    enabled: !!ownerId,
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['owner-properties', ownerId] });

  const addProperty = async (prop: Omit<OwnerProperty, 'id' | 'ownerId' | 'createdAt' | 'updatedAt'>) => {
    const { error } = await supabase.from('owner_properties').insert({
      owner_id: ownerId,
      property_name: prop.propertyName,
      apartment_type: prop.apartmentType,
      google_drive_link: prop.googleDriveLink,
      ical_link: prop.iCalLink ?? null,
      city: prop.city,
      address: prop.address,
      max_guests: prop.maxGuests,
      bedrooms: prop.bedrooms,
      bathrooms: prop.bathrooms,
      nightly_rate: prop.nightlyRate ?? null,
      description: prop.description,
      amenities: prop.amenities,
    });
    if (error) throw error;
    await invalidate();
  };

  const updateProperty = async (
    id: string,
    updates: Partial<Omit<OwnerProperty, 'id' | 'ownerId' | 'createdAt'>>
  ) => {
    const payload: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (updates.propertyName !== undefined) payload.property_name = updates.propertyName;
    if (updates.apartmentType !== undefined) payload.apartment_type = updates.apartmentType;
    if (updates.googleDriveLink !== undefined) payload.google_drive_link = updates.googleDriveLink;
    if (updates.iCalLink !== undefined) payload.ical_link = updates.iCalLink ?? null;
    if (updates.city !== undefined) payload.city = updates.city;
    if (updates.address !== undefined) payload.address = updates.address;
    if (updates.maxGuests !== undefined) payload.max_guests = updates.maxGuests;
    if (updates.bedrooms !== undefined) payload.bedrooms = updates.bedrooms;
    if (updates.bathrooms !== undefined) payload.bathrooms = updates.bathrooms;
    if (updates.nightlyRate !== undefined) payload.nightly_rate = updates.nightlyRate ?? null;
    if (updates.description !== undefined) payload.description = updates.description;
    if (updates.amenities !== undefined) payload.amenities = updates.amenities;

    const { error } = await supabase.from('owner_properties').update(payload).eq('id', id);
    if (error) throw error;
    await invalidate();
  };

  const deleteProperty = async (id: string) => {
    const { error } = await supabase.from('owner_properties').delete().eq('id', id);
    if (error) throw error;
    await invalidate();
  };

  return {
    properties: query.data ?? [],
    isLoading: query.isLoading,
    addProperty,
    updateProperty,
    deleteProperty,
  };
}
