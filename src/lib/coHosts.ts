export interface CoHost {
  id: string;
  name: string;
  phone: string;
}

const STORAGE_KEY = 'cotizacion.coHosts';

const DEFAULT_CO_HOSTS: CoHost[] = [
  { id: 'default-sebastian-ruiz', name: 'Sebastian Ruiz', phone: '+573502053147' },
];

export function getCoHosts(): CoHost[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_CO_HOSTS));
      return DEFAULT_CO_HOSTS;
    }
    return JSON.parse(raw);
  } catch {
    return DEFAULT_CO_HOSTS;
  }
}

export function saveCoHost(coHost: Omit<CoHost, 'id'>): CoHost {
  const list = getCoHosts();
  const existing = list.find((c) => c.name === coHost.name);
  if (existing) {
    const updated = { ...existing, ...coHost };
    const next = list.map((c) => (c.id === existing.id ? updated : c));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    return updated;
  }
  const created: CoHost = { ...coHost, id: crypto.randomUUID() };
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...list, created]));
  return created;
}
