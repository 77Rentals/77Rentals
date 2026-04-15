// src/lib/flags.ts

const FLAG_MAP: Record<string, string> = {
  CO: '🇨🇴',
  PE: '🇵🇪',
  PL: '🇵🇱',
  GB: '🇬🇧',
  US: '🇺🇸',
  CL: '🇨🇱',
  PA: '🇵🇦',
  AR: '🇦🇷',
  MX: '🇲🇽',
  VE: '🇻🇪',
  EC: '🇪🇨',
  BR: '🇧🇷',
};

export const countryFlag = (code: string): string =>
  FLAG_MAP[code.toUpperCase()] ?? '🌍';

export const countryName: Record<string, string> = {
  CO: 'Colombia',
  PE: 'Perú',
  PL: 'Polonia',
  GB: 'Reino Unido',
  US: 'Estados Unidos',
  CL: 'Chile',
  PA: 'Panamá',
};
