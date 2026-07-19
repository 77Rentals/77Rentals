export interface ThirdPartyProperty {
  id: string;
  buildingName: string;
  apartmentNumber: string;
  featuredAmenity: string;
  nightlyRate: number;
}

const STORAGE_KEY = 'cotizacion.thirdPartyProperties';

export function getThirdPartyProperties(): ThirdPartyProperty[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveThirdPartyProperty(property: Omit<ThirdPartyProperty, 'id'>): ThirdPartyProperty {
  const list = getThirdPartyProperties();
  const existing = list.find(
    (p) => p.buildingName === property.buildingName && p.apartmentNumber === property.apartmentNumber
  );
  if (existing) {
    const updated = { ...existing, ...property };
    const next = list.map((p) => (p.id === existing.id ? updated : p));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    return updated;
  }
  const created: ThirdPartyProperty = { ...property, id: crypto.randomUUID() };
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...list, created]));
  return created;
}
