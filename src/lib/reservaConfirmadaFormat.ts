import { formatCOP } from './cotizacionFormat';

export interface GuestEntry {
  name: string;
  idNumber: string;
}

export interface ReservaConfirmadaData {
  reservationHolderName: string;
  guests: GuestEntry[];
  guestsFreeText?: string;
  buildingName: string;
  apartmentNumber: string;
  apartmentNickname?: string;
  checkInDate: string;
  checkInTime: string;
  checkOutDate: string;
  checkOutTime: string;
  nights: number;
  guestsCount: number;
  nightlyRate: number;
  hospedajeTotal: number;
  cleaningFee: number;
  registrationFee: number;
  total: number;
  depositAmount: number;
  depositConfirmedDate: string;
  remainingBalance: number;
  includedText?: string;
  buildingAmenitiesText?: string;
  neighborhoodText?: string;
  hostName: string;
  hostPhone: string;
  liaisonName?: string;
  liaisonPhone?: string;
}

function buildGuestBlock(d: ReservaConfirmadaData): string[] {
  if (d.guestsFreeText) return [d.guestsFreeText];
  return d.guests.map((g, i) => `${i + 1}. ${g.name}${g.idNumber ? ` – C.C. ${g.idNumber}` : ''}`);
}

export function buildReservaConfirmadaText(d: ReservaConfirmadaData): string {
  const lines: string[] = [
    `Estimado/a ${d.reservationHolderName},`,
    '',
    'Es un placer saludarte. En nombre de 77Rentals, agradecemos la confianza depositada en nosotros.',
    `Nos complace confirmar tu reserva en el Edificio ${d.buildingName} – Apartamento ${d.apartmentNumber}, y compartir con ustedes el detalle de su estadía.`,
    `Titular de la reserva: ${d.reservationHolderName}`,
    '',
    'Huéspedes',
    '',
    ...buildGuestBlock(d),
    '',
    'Alojamiento',
    `Edificio: ${d.buildingName}`,
    `Apartamento: ${d.apartmentNumber}${d.apartmentNickname ? ` – ${d.apartmentNickname}` : ''}`,
    '',
    'Detalle de la reserva',
    `Check-in: ${d.checkInDate} – ${d.checkInTime}`,
    `Check-out: ${d.checkOutDate} – ${d.checkOutTime}`,
    `Noches: ${d.nights}`,
    `Huéspedes: ${d.guestsCount}`,
    '',
    'Resumen de la reserva',
    `Hospedaje (${d.nights} noches × $${formatCOP(d.nightlyRate)}): $${formatCOP(d.hospedajeTotal)}`,
  ];

  if (d.cleaningFee > 0) lines.push(`Aseo de check-out: $${formatCOP(d.cleaningFee)}`);
  if (d.registrationFee > 0) lines.push(`Registro del edificio: $${formatCOP(d.registrationFee)}`);

  lines.push(
    `Valor total de la reserva: $${formatCOP(d.total)}`,
    '',
    'Estado del pago',
    `Anticipo: $${formatCOP(d.depositAmount)} — Confirmado el ${d.depositConfirmedDate}.`,
    `Saldo pendiente al ingreso: $${formatCOP(d.remainingBalance)}`,
    'El saldo deberá ser cancelado al momento del ingreso y entrega del apartamento.',
  );

  if (d.includedText) lines.push('', 'El apartamento incluye', d.includedText);
  if (d.buildingAmenitiesText) lines.push('', `Amenidades del Edificio ${d.buildingName}`, d.buildingAmenitiesText);
  if (d.neighborhoodText) lines.push('', d.neighborhoodText);

  lines.push(
    '',
    '—————————————————',
    '',
    'Un día antes de tu llegada les enviaremos toda la información necesaria para el proceso de check-in, incluyendo las claves de acceso al edificio y al apartamento, la contraseña del WiFi y las recomendaciones para tu ingreso.',
    'Quedamos atentos a cualquier inquietud y estaremos disponibles para asistirlos antes y durante su estadía.',
    '',
    'Cordialmente,',
    '',
    'Your Host',
    d.hostName,
    '77Rentals',
    d.hostPhone,
  );

  if (d.liaisonName) {
    lines.push('', 'Co-Host', d.liaisonName);
    if (d.liaisonPhone) lines.push(d.liaisonPhone);
  }

  return lines.join('\n');
}
