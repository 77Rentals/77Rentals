export interface OwnApartmentOverride {
  apartmentId: string;
  apartmentNickname?: string;
  includedText?: string;
  buildingAmenitiesText?: string;
  neighborhoodText?: string;
  liaisonName?: string;
  liaisonPhone?: string;
}

const STORAGE_KEY = 'reserva.ownApartmentOverrides';

function persist(overrides: OwnApartmentOverride[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(overrides));
}

export function getAllOwnOverrides(): OwnApartmentOverride[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function getOwnOverride(apartmentId: string): OwnApartmentOverride | null {
  return getAllOwnOverrides().find((o) => o.apartmentId === apartmentId) || null;
}

export function saveOwnOverride(override: OwnApartmentOverride): OwnApartmentOverride {
  const overrides = getAllOwnOverrides();
  const existing = overrides.find((o) => o.apartmentId === override.apartmentId);
  const updated = { ...existing, ...override };
  const next = existing
    ? overrides.map((o) => (o.apartmentId === override.apartmentId ? updated : o))
    : [...overrides, updated];
  persist(next);
  return updated;
}
