import type { GuestRequirement, PartnershipResponse } from '@/data/partnerHub';

export function generateNDATemplate(
  requirement: GuestRequirement,
  response: PartnershipResponse,
  adminName?: string
): string {
  const checkInDate = new Date(requirement.checkInDate).toLocaleDateString('es-CO');
  const checkOutDate = new Date(requirement.checkOutDate).toLocaleDateString('es-CO');
  const today = new Date().toLocaleDateString('es-CO');
  const nightCount = Math.ceil(
    (new Date(requirement.checkOutDate).getTime() - new Date(requirement.checkInDate).getTime()) /
    (1000 * 60 * 60 * 24)
  );

  // Signature lines — fill in actual name + date if already signed, otherwise blank
  const adminSigName = response.adminSignature
    ? response.adminSignature.signerName
    : '___________________________';
  const adminSigDate = response.adminSignature
    ? new Date(response.adminSignature.timestamp).toLocaleDateString('es-CO')
    : '__________';

  const ownerSigName = response.ownerSignature
    ? response.ownerSignature.signerName
    : '___________________________';
  const ownerSigDate = response.ownerSignature
    ? new Date(response.ownerSignature.timestamp).toLocaleDateString('es-CO')
    : '__________';

  return `
ACUERDO DE CONFIDENCIALIDAD E INTERMEDIACIÓN

Este Acuerdo de Confidencialidad ("Acuerdo") se celebra el ${today} entre:

INTERMEDIARIO:
Nombre: ${adminName || requirement.adminContact.name}
Correo: ${requirement.adminContact.email}
Teléfono: ${requirement.adminContact.phone}

PROPIETARIO DEL INMUEBLE:
Nombre: ${response.ownerContact.name}
Correo: ${response.ownerContact.email}
Teléfono: ${response.ownerContact.phone}

DETALLES DEL INMUEBLE:
Nombre de la propiedad: ${response.propertyName}
Torre / Apartamento: ${response.torreApartamento || 'No especificado'}
Fecha de entrada: ${checkInDate}
Fecha de salida: ${checkOutDate}
Duración: ${nightCount} noche(s)
Tarifa por noche: COP ${response.proposedPrice.toLocaleString('es-CO')}

TÉRMINOS Y CONDICIONES:

1. ROL DEL INTERMEDIARIO
El Administrador actúa únicamente como intermediario para facilitar el contacto entre el
Huésped y el Propietario del inmueble. El Administrador NO es responsable de:
   - Estado o daños de la propiedad
   - Comportamiento o conducta del huésped
   - Cancelaciones o reembolsos
   - Disputas entre el Huésped y el Propietario
   - Pérdida o daño a las pertenencias del huésped

2. CONFIDENCIALIDAD
Toda la información de contacto divulgada en este acuerdo (nombres, números telefónicos,
correos electrónicos) se proporciona exclusivamente para completar esta reserva específica
y no deberá compartirse con terceros sin previo consentimiento escrito.

3. INFORMACIÓN DE CONTACTO
Al firmar este acuerdo, ambas partes consienten en compartir su información de contacto
únicamente para los fines de coordinación y comunicación relacionados con esta reserva.

4. RESOLUCIÓN DE DISPUTAS
Cualquier disputa relacionada con la propiedad, la reserva o la experiencia del huésped
deberá resolverse directamente entre el Huésped y el Propietario del inmueble.
El Administrador no asume responsabilidad en dichas disputas.

5. ACUERDO VINCULANTE
Este acuerdo entra en vigor a partir de la firma de ambas partes y permanece válido
durante todo el período de la reserva indicada.

---

Declaro que he leído, entendido y acepto los términos y condiciones establecidos en este
Acuerdo de Confidencialidad e Intermediación.

FIRMA DEL INTERMEDIARIO: ___________________________
Nombre: ${adminSigName}   Fecha: ${adminSigDate}

FIRMA DEL PROPIETARIO: ___________________________
Nombre: ${ownerSigName}   Fecha: ${ownerSigDate}
`.trim();
}

export function formatNDAForDisplay(nda: string): string {
  // Format NDA text for clean display with proper line breaks
  return nda.split('\n').filter(line => line.trim()).join('\n');
}
