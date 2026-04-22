export function generateWhatsAppLink(
  phoneNumber: string,
  ownerName: string,
  propertyName: string,
  checkInDate: string,
  checkOutDate: string
): string {
  // Format phone for WhatsApp (remove formatting, add country code if needed)
  const cleanPhone = phoneNumber.replace(/\D/g, '');
  const formattedPhone = cleanPhone.startsWith('57') ? cleanPhone : `57${cleanPhone}`;

  const message = encodeURIComponent(
    `Hola ${ownerName}, te estoy contactando sobre la propiedad "${propertyName}" para las fechas ${checkInDate} a ${checkOutDate}. ¿Está disponible?`
  );

  return `https://wa.me/${formattedPhone}?text=${message}`;
}

export function getOwnerContactInfoDisplay(
  ownerName: string,
  ownerPhone: string,
  ownerEmail: string,
  isNDASigned: boolean
): { phone: string; email: string; visible: boolean } {
  return {
    phone: ownerPhone,
    email: ownerEmail,
    visible: isNDASigned,
  };
}
