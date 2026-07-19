export interface ApartmentUnit {
  id: string;
  name: string;
  apartmentNumber: string;
  featuredAmenity: string;
  nightlyRate: number;
  apartmentNickname?: string;
  includedText?: string;
}

export interface ThirdPartyBuilding {
  id: string;
  name: string;
  apartments: ApartmentUnit[];
  buildingAmenitiesText?: string;
  neighborhoodText?: string;
  liaisonName?: string;
  liaisonPhone?: string;
}

const STORAGE_KEY = 'cotizacion.thirdPartyBuildings';
const LEGACY_KEY = 'cotizacion.thirdPartyProperties';

interface LegacyProperty {
  buildingName: string;
  apartmentNumber: string;
  featuredAmenity: string;
  nightlyRate: number;
}

function persist(buildings: ThirdPartyBuilding[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(buildings));
}

function migrateLegacy(): ThirdPartyBuilding[] {
  try {
    const raw = localStorage.getItem(LEGACY_KEY);
    if (!raw) return [];
    const legacy: LegacyProperty[] = JSON.parse(raw);
    const buildings: ThirdPartyBuilding[] = [];
    for (const p of legacy) {
      let building = buildings.find((b) => b.name === p.buildingName);
      if (!building) {
        building = { id: crypto.randomUUID(), name: p.buildingName, apartments: [] };
        buildings.push(building);
      }
      building.apartments.push({
        id: crypto.randomUUID(),
        name: p.apartmentNumber,
        apartmentNumber: p.apartmentNumber,
        featuredAmenity: p.featuredAmenity,
        nightlyRate: p.nightlyRate,
      });
    }
    persist(buildings);
    return buildings;
  } catch {
    return [];
  }
}

export function getBuildings(): ThirdPartyBuilding[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
    return migrateLegacy();
  } catch {
    return [];
  }
}

export function saveBuildingApartment(
  buildingName: string,
  apartment: Omit<ApartmentUnit, 'id'> & { id?: string }
): { building: ThirdPartyBuilding; apartment: ApartmentUnit } {
  const buildings = getBuildings();
  let building = buildings.find((b) => b.name.trim().toLowerCase() === buildingName.trim().toLowerCase());
  if (!building) {
    building = { id: crypto.randomUUID(), name: buildingName, apartments: [] };
    buildings.push(building);
  }

  const existing = apartment.id
    ? building.apartments.find((a) => a.id === apartment.id)
    : building.apartments.find((a) => a.name.trim().toLowerCase() === apartment.name.trim().toLowerCase());

  let unit: ApartmentUnit;
  if (existing) {
    unit = { ...existing, ...apartment, id: existing.id };
    building.apartments = building.apartments.map((a) => (a.id === existing.id ? unit : a));
  } else {
    unit = { ...apartment, id: apartment.id || crypto.randomUUID() };
    building.apartments.push(unit);
  }

  persist(buildings);
  return { building, apartment: unit };
}

export function saveBuildingDetails(
  buildingName: string,
  details: Partial<Pick<ThirdPartyBuilding, 'buildingAmenitiesText' | 'neighborhoodText' | 'liaisonName' | 'liaisonPhone'>>
): ThirdPartyBuilding {
  const buildings = getBuildings();
  let building = buildings.find((b) => b.name.trim().toLowerCase() === buildingName.trim().toLowerCase());
  if (!building) {
    building = { id: crypto.randomUUID(), name: buildingName, apartments: [] };
    buildings.push(building);
  }
  Object.assign(building, details);
  persist(buildings);
  return building;
}
