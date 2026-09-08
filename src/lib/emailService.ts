import type { GuestRequirement, PartnershipResponse } from '@/data/partnerHub';

const WEB3FORMS_KEY = '6979f913-1573-41ce-bbdd-1df63fa27f73';

/**
 * Sends an automated NDA notification email to team@77rentals.com via Web3Forms.
 * Fire-and-forget — call without await and catch silently so signing flow is never blocked.
 *
 * Usage:
 *   sendNDANotificationEmail('admin_signed', response, requirement).catch(() => {});
 *   sendNDANotificationEmail('owner_signed', response, requirement).catch(() => {});
 *   sendNDANotificationEmail('both_signed', response, requirement).catch(() => {});
 */
export async function sendNDANotificationEmail(
  event: 'admin_signed' | 'owner_signed' | 'both_signed',
  response: PartnershipResponse,
  requirement: GuestRequirement
): Promise<void> {
  const checkIn = new Date(requirement.checkInDate).toLocaleDateString('es-CO');
  const checkOut = new Date(requirement.checkOutDate).toLocaleDateString('es-CO');
  const nightCount = Math.ceil(
    (new Date(requirement.checkOutDate).getTime() - new Date(requirement.checkInDate).getTime()) /
      (1000 * 60 * 60 * 24)
  );
  const priceFormatted = `COP ${response.proposedPrice.toLocaleString('es-CO')}/noche`;

  let subject: string;
  let message: string;

  if (event === 'admin_signed') {
    subject = `✍️ NDA Firmado por Intermediario — ${response.propertyName}`;
    message = `
El intermediario ha firmado el NDA para la siguiente propiedad.
Se requiere la firma del propietario para completar el proceso.

PROPIEDAD: ${response.propertyName} (${response.apartmentType})
TORRE / APTO: ${response.torreApartamento || 'No especificado'}
FECHAS: ${checkIn} → ${checkOut} (${nightCount} noches)
TARIFA: ${priceFormatted}

PROPIETARIO (pendiente de firma):
  Nombre: ${response.ownerContact.name}
  Correo: ${response.ownerContact.email}
  Teléfono: ${response.ownerContact.phone}

INTERMEDIARIO (ya firmó):
  Nombre: ${response.adminSignature?.signerName ?? '—'}
  Fecha firma: ${response.adminSignature ? new Date(response.adminSignature.timestamp).toLocaleString('es-CO') : '—'}

Accede al Partner Hub para ver el estado completo.
    `.trim();
  } else if (event === 'owner_signed') {
    subject = `✍️ NDA Firmado por Propietario — ${response.propertyName}`;
    message = `
El propietario ha firmado el NDA para la siguiente propiedad.
Se requiere la firma del intermediario para completar el proceso.

PROPIEDAD: ${response.propertyName} (${response.apartmentType})
TORRE / APTO: ${response.torreApartamento || 'No especificado'}
FECHAS: ${checkIn} → ${checkOut} (${nightCount} noches)
TARIFA: ${priceFormatted}

PROPIETARIO (ya firmó):
  Nombre: ${response.ownerSignature?.signerName ?? '—'}
  Fecha firma: ${response.ownerSignature ? new Date(response.ownerSignature.timestamp).toLocaleString('es-CO') : '—'}

Accede al Partner Hub para completar la firma.
    `.trim();
  } else {
    subject = `✅ NDA Completamente Firmado — ${response.propertyName}`;
    message = `
Ambas partes han firmado el NDA. La reserva puede proceder.

PROPIEDAD: ${response.propertyName} (${response.apartmentType})
TORRE / APTO: ${response.torreApartamento || 'No especificado'}
FECHAS: ${checkIn} → ${checkOut} (${nightCount} noches)
TARIFA: ${priceFormatted}

CONTACTO DEL PROPIETARIO:
  Nombre: ${response.ownerContact.name}
  Correo: ${response.ownerContact.email}
  Teléfono: ${response.ownerContact.phone}

FIRMAS:
  Intermediario: ${response.adminSignature?.signerName ?? '—'} — ${response.adminSignature ? new Date(response.adminSignature.timestamp).toLocaleString('es-CO') : '—'}
  Propietario: ${response.ownerSignature?.signerName ?? '—'} — ${response.ownerSignature ? new Date(response.ownerSignature.timestamp).toLocaleString('es-CO') : '—'}

Accede al Partner Hub para descargar el NDA firmado.
    `.trim();
  }

  await fetch('https://api.web3forms.com/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      access_key: WEB3FORMS_KEY,
      subject,
      from_name: 'Partner Hub — 77Rentals',
      email: 'team@77rentals.com',
      message,
    }),
  });
}

/**
 * Sends an automated Contrato de Servicio de Alquiler Turístico de Inmueble notification email
 * to team@77rentals.com via Web3Forms.
 * Fire-and-forget — call without await and catch silently so signing flow is never blocked.
 *
 * Usage:
 *   sendContractNotificationEmail('admin_signed', response, requirement).catch(() => {});
 *   sendContractNotificationEmail('owner_signed', response, requirement).catch(() => {});
 *   sendContractNotificationEmail('both_signed', response, requirement).catch(() => {});
 */
export async function sendContractNotificationEmail(
  event: 'admin_signed' | 'owner_signed' | 'both_signed',
  response: PartnershipResponse,
  requirement: GuestRequirement
): Promise<void> {
  const checkIn = new Date(requirement.checkInDate).toLocaleDateString('es-CO');
  const checkOut = new Date(requirement.checkOutDate).toLocaleDateString('es-CO');
  const nightCount = Math.ceil(
    (new Date(requirement.checkOutDate).getTime() - new Date(requirement.checkInDate).getTime()) /
      (1000 * 60 * 60 * 24)
  );
  const priceFormatted = `COP ${response.proposedPrice.toLocaleString('es-CO')}/noche`;

  let subject: string;
  let message: string;

  if (event === 'admin_signed') {
    subject = `✍️ Contrato de Servicio de Alquiler Turístico Firmado por 77Rentals — ${response.propertyName}`;
    message = `
77Rentals ha firmado el Contrato de Servicio de Alquiler Turístico de Inmueble para la siguiente propiedad.
Se requiere la firma del propietario para completar el proceso.

PROPIEDAD: ${response.propertyName} (${response.apartmentType})
TORRE / APTO: ${response.torreApartamento || 'No especificado'}
FECHAS: ${checkIn} → ${checkOut} (${nightCount} noches)
TARIFA: ${priceFormatted}

PROPIETARIO (pendiente de firma):
  Nombre: ${response.ownerContact.name}
  Correo: ${response.ownerContact.email}
  Teléfono: ${response.ownerContact.phone}

77RENTALS (ya firmó):
  Nombre: ${response.adminContractSignature?.signerName ?? '—'}
  Documento: ${response.adminContractSignature?.signerIdNumber ?? '—'}
  Fecha firma: ${response.adminContractSignature ? new Date(response.adminContractSignature.timestamp).toLocaleString('es-CO') : '—'}

Accede al Partner Hub para ver el estado completo.
    `.trim();
  } else if (event === 'owner_signed') {
    subject = `✍️ Contrato de Servicio de Alquiler Turístico Firmado por Propietario — ${response.propertyName}`;
    message = `
El propietario ha firmado el Contrato de Servicio de Alquiler Turístico de Inmueble para la siguiente propiedad.
Se requiere la firma de 77Rentals para completar el proceso.

PROPIEDAD: ${response.propertyName} (${response.apartmentType})
TORRE / APTO: ${response.torreApartamento || 'No especificado'}
FECHAS: ${checkIn} → ${checkOut} (${nightCount} noches)
TARIFA: ${priceFormatted}

PROPIETARIO (ya firmó):
  Nombre: ${response.ownerContractSignature?.signerName ?? '—'}
  Documento: ${response.ownerContractSignature?.signerIdNumber ?? '—'}
  Fecha firma: ${response.ownerContractSignature ? new Date(response.ownerContractSignature.timestamp).toLocaleString('es-CO') : '—'}

Accede al Partner Hub para completar la firma.
    `.trim();
  } else {
    subject = `✅ Contrato de Servicio de Alquiler Turístico Completamente Firmado — ${response.propertyName}`;
    message = `
Ambas partes han firmado el Contrato de Servicio de Alquiler Turístico de Inmueble. La reserva queda formalizada.

PROPIEDAD: ${response.propertyName} (${response.apartmentType})
TORRE / APTO: ${response.torreApartamento || 'No especificado'}
FECHAS: ${checkIn} → ${checkOut} (${nightCount} noches)
TARIFA: ${priceFormatted}

CONTACTO DEL PROPIETARIO:
  Nombre: ${response.ownerContact.name}
  Correo: ${response.ownerContact.email}
  Teléfono: ${response.ownerContact.phone}

FIRMAS:
  77Rentals: ${response.adminContractSignature?.signerName ?? '—'} (${response.adminContractSignature?.signerIdNumber ?? '—'}) — ${response.adminContractSignature ? new Date(response.adminContractSignature.timestamp).toLocaleString('es-CO') : '—'}
  Propietario: ${response.ownerContractSignature?.signerName ?? '—'} (${response.ownerContractSignature?.signerIdNumber ?? '—'}) — ${response.ownerContractSignature ? new Date(response.ownerContractSignature.timestamp).toLocaleString('es-CO') : '—'}

Accede al Partner Hub para descargar el contrato firmado.
    `.trim();
  }

  await fetch('https://api.web3forms.com/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      access_key: WEB3FORMS_KEY,
      subject,
      from_name: 'Partner Hub — 77Rentals',
      email: 'team@77rentals.com',
      message,
    }),
  });
}
