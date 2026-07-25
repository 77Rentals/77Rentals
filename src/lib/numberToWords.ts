const UNITS = ['', 'UN', 'DOS', 'TRES', 'CUATRO', 'CINCO', 'SEIS', 'SIETE', 'OCHO', 'NUEVE'];
const TEENS = [
  'DIEZ', 'ONCE', 'DOCE', 'TRECE', 'CATORCE', 'QUINCE',
  'DIECISÉIS', 'DIECISIETE', 'DIECIOCHO', 'DIECINUEVE',
];
const TWENTIES = [
  'VEINTE', 'VEINTIUNO', 'VEINTIDÓS', 'VEINTITRÉS', 'VEINTICUATRO', 'VEINTICINCO',
  'VEINTISÉIS', 'VEINTISIETE', 'VEINTIOCHO', 'VEINTINUEVE',
];
const TENS = ['', '', '', 'TREINTA', 'CUARENTA', 'CINCUENTA', 'SESENTA', 'SETENTA', 'OCHENTA', 'NOVENTA'];
const HUNDREDS = [
  '', 'CIENTO', 'DOSCIENTOS', 'TRESCIENTOS', 'CUATROCIENTOS', 'QUINIENTOS',
  'SEISCIENTOS', 'SETECIENTOS', 'OCHOCIENTOS', 'NOVECIENTOS',
];

function convertTens(n: number): string {
  if (n < 10) return UNITS[n];
  if (n < 20) return TEENS[n - 10];
  if (n < 30) return TWENTIES[n - 20];
  const tens = Math.floor(n / 10);
  const units = n % 10;
  return units === 0 ? TENS[tens] : `${TENS[tens]} Y ${UNITS[units]}`;
}

function convertHundreds(n: number): string {
  if (n === 0) return '';
  if (n === 100) return 'CIEN';
  const hundreds = Math.floor(n / 100);
  const rest = n % 100;
  const hundredsWord = hundreds > 0 ? HUNDREDS[hundreds] : '';
  const restWord = rest > 0 ? convertTens(rest) : '';
  return [hundredsWord, restWord].filter(Boolean).join(' ');
}

function convertGroupOfThree(n: number, isMillionsGroup = false): string {
  if (n === 0) return '';
  if (n === 1 && !isMillionsGroup) return '';
  return convertHundreds(n);
}

export function numberToWords(value: number): string {
  const n = Math.round(Math.abs(value));
  if (n === 0) return 'CERO';

  const millions = Math.floor(n / 1_000_000);
  const thousands = Math.floor((n % 1_000_000) / 1000);
  const units = n % 1000;

  const parts: string[] = [];

  if (millions > 0) {
    const millionsWord = convertHundreds(millions);
    parts.push(millions === 1 ? 'UN MILLÓN' : `${millionsWord} MILLONES`);
  }

  if (thousands > 0) {
    const thousandsWord = convertGroupOfThree(thousands);
    parts.push(thousands === 1 ? 'MIL' : `${thousandsWord} MIL`);
  }

  if (units > 0) {
    parts.push(convertHundreds(units));
  }

  return parts.join(' ');
}

export function pesosToWords(value: number): string {
  return `${numberToWords(value)} PESOS M/CTE`;
}
