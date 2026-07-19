export const formatCOP = (value: number): string =>
  new Intl.NumberFormat('es-CO', { maximumFractionDigits: 0 }).format(Math.round(value || 0));

export interface CotizacionData {
  guestName: string;
  guestPhone?: string;
  buildingName: string;
  apartmentNumber: string;
  featuredAmenity: string;
  checkInDate: string; // "5 de agosto"
  checkInTime: string; // "3:00 p. m."
  checkOutDate: string;
  checkOutTime: string;
  nights: number;
  guests: number;
  nightlyRate: number;
  hospedajeTotal: number;
  cleaningFee: number;
  registrationFee: number;
  total: number;
  depositPercent: number;
  depositAmount: number;
  remainingBalance: number;
  notes?: string;
  validUntil?: string;
  hostName: string;
  hostPhone: string;
}

export function buildCotizacionText(d: CotizacionData): string {
  const lines = [
    '🏖️ COTIZACIÓN DE HOSPEDAJE',
    '',
    `👤 Huésped: ${d.guestName}`,
    '',
    `🏢 Edificio: ${d.buildingName}`,
    `🏠 Apartamento: ${d.apartmentNumber}`,
  ];
  if (d.featuredAmenity) lines.push(`🌇 Amenidad destacada: ${d.featuredAmenity}`);
  lines.push(
    '',
    '📅 Detalle de la reserva',
    '',
    `🗓️ Check-in: ${d.checkInDate} – ${d.checkInTime}`,
    `🗓️ Check-out: ${d.checkOutDate} – ${d.checkOutTime}`,
    `🌙 Noches: ${d.nights}`,
    `👥 Huéspedes: ${d.guests}`,
    '',
    '💰 Valor de la reserva',
    '',
    `🏡 Hospedaje (${d.nights} noches × $${formatCOP(d.nightlyRate)}): $${formatCOP(d.hospedajeTotal)}`,
  );
  if (d.cleaningFee > 0) lines.push(`🧹 Aseo de check-out: $${formatCOP(d.cleaningFee)}`);
  if (d.registrationFee > 0) lines.push(`🪪 Registro del edificio (toda la reserva): $${formatCOP(d.registrationFee)}`);
  lines.push(
    '',
    `💳 Total de la reserva: $${formatCOP(d.total)}`,
    '',
    '✅ Estado del pago',
    '',
    `🟡 Anticipo mínimo (${d.depositPercent}%): $${formatCOP(d.depositAmount)} (Pendiente de pago)`,
    `💰 Saldo restante: $${formatCOP(d.remainingBalance)}`,
    '',
    '📌 El saldo deberá ser cancelado al momento del ingreso y entrega del apartamento.',
  );
  lines.push(
    '',
    '💳 Datos para pago',
    '👤 Claudia Moreno Velosa',
    '🏦 Bancolombia',
    '💼 Cuenta de ahorros: 20444432854',
    '📲 Nequi: 304 673 6241',
    '🏦 Davivienda: 488 446 486 604 (ahorros)',
    '🔑 Llave Bancolombia: @claudia8523',
    '',
    '👤 Roberto Carlos Ruiz Gómez',
    '🏦 BBVA',
    '💼 Cuenta de ahorros: 0142274059',
    '',
    '💳✨ Hazme saber si requieres el link para pago con tarjeta de crédito.',
  );
  if (d.notes) lines.push('', `📝 ${d.notes}`);
  if (d.validUntil) lines.push('', `⏳ Cotización válida hasta: ${d.validUntil}`);
  lines.push(
    '',
    '✨ Será un gusto recibirlos y hacer de su estadía una excelente experiencia.',
    '',
    '🤝 Your Host',
    d.hostName,
    '💜 77Rentals',
    `📱 ${d.hostPhone}`,
  );
  return lines.join('\n');
}
