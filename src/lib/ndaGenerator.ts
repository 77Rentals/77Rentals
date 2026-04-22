import type { GuestRequirement, PartnershipResponse } from '@/data/partnerHub';

export function generateNDATemplate(
  requirement: GuestRequirement,
  response: PartnershipResponse,
  adminName?: string
): string {
  const checkInDate = new Date(requirement.checkInDate).toLocaleDateString('es-CO');
  const checkOutDate = new Date(requirement.checkOutDate).toLocaleDateString('es-CO');
  const nightCount = Math.ceil(
    (new Date(requirement.checkOutDate).getTime() - new Date(requirement.checkInDate).getTime()) /
    (1000 * 60 * 60 * 24)
  );

  return `
NON-DISCLOSURE AGREEMENT & INTERMEDIARY TERMS

This Non-Disclosure Agreement ("Agreement") is entered into as of ${new Date().toLocaleDateString('es-CO')} between:

ADMIN/INTERMEDIARY:
Name: ${adminName || requirement.adminContact.name}
Email: ${requirement.adminContact.email}
Phone: ${requirement.adminContact.phone}

PROPERTY OWNER:
Name: ${response.ownerContact.name}
Email: ${response.ownerContact.email}
Phone: ${response.ownerContact.phone}

PROPERTY DETAILS:
Property Name: ${response.propertyName}
Check-in: ${checkInDate}
Check-out: ${checkOutDate}
Duration: ${nightCount} night(s)
Nightly Rate: COP ${response.proposedPrice.toLocaleString('es-CO')}

TERMS & CONDITIONS:

1. INTERMEDIARY ROLE
The Admin acts solely as an intermediary facilitating contact between the Guest and Property Owner. The Admin is NOT responsible for:
   - Property condition or damages
   - Guest behavior or conduct
   - Cancellations or refunds
   - Any disputes between Guest and Owner
   - Loss or damage to guest belongings

2. CONFIDENTIALITY
All contact information disclosed in this agreement (names, phone numbers, emails) is provided solely for completing this specific booking and shall not be shared with third parties without consent.

3. CONTACT INFORMATION
By signing this agreement, both parties consent to sharing contact information for booking completion and communication purposes only.

4. DISPUTE RESOLUTION
Any disputes regarding the property, booking, or guest experience should be resolved directly between the Guest and Property Owner. The Admin is not liable.

5. BINDING AGREEMENT
This agreement becomes effective upon signature of both parties and remains valid for the duration of the booking period.

---

I agree to the terms and conditions outlined in this Non-Disclosure Agreement.

ADMIN SIGNATURE: ___________________________
Name: __________________________ Date: __________

OWNER SIGNATURE: ___________________________
Name: __________________________ Date: __________
`.trim();
}

export function formatNDAForDisplay(nda: string): string {
  // Format NDA text for clean display with proper line breaks
  return nda.split('\n').filter(line => line.trim()).join('\n');
}
