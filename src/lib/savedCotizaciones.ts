export interface SavedCotizacion {
  id: string;
  createdAt: string;
  guestName: string;
  buildingName: string;
  apartmentNumber: string;
  total: number;
  source: 'own' | 'third-party';
  apartmentId: string;
  apartmentUnitId: string;
  apartmentUnitName: string;
  checkIn: string | null;
  checkOut: string | null;
  checkInTime: string;
  checkOutTime: string;
  guestsCount: string;
  nightlyRate: string;
  cleaningFee: string;
  registrationFee: string;
  depositPercent: string;
}

const STORAGE_KEY = 'cotizacion.savedList';
const MAX_ITEMS = 30;

function persist(list: SavedCotizacion[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

export function getSavedCotizaciones(): SavedCotizacion[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const list: SavedCotizacion[] = raw ? JSON.parse(raw) : [];
    return list.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  } catch {
    return [];
  }
}

export function saveCotizacion(record: Omit<SavedCotizacion, 'createdAt'>): SavedCotizacion {
  const list = getSavedCotizaciones();
  const existing = list.find((c) => c.id === record.id);
  const saved: SavedCotizacion = { ...record, createdAt: existing?.createdAt || new Date().toISOString() };
  const next = existing ? list.map((c) => (c.id === saved.id ? saved : c)) : [saved, ...list];
  persist(next.slice(0, MAX_ITEMS));
  return saved;
}

export function deleteCotizacion(id: string) {
  persist(getSavedCotizaciones().filter((c) => c.id !== id));
}
