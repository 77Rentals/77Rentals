// A public, no-login link sent to a Galcol-deal apartment owner so they can
// review and sign the Contrato de Servicio de Alquiler Turístico de Inmueble + NDA for their
// unit type (Tipo B or Tipo D). The link's id is the only credential.

export type OwnerUnitType = 'B' | 'D';

export interface OwnerSigningLink {
  id: string;
  unitType: OwnerUnitType;
  status: 'pending' | 'signed';
  ownerName?: string;
  buildingName?: string;
  apartmentNumber?: string;
  unitCount?: number;
  signedAt?: Date;
  // Exact rendered text at signing time, stored verbatim so a reload never
  // has to regenerate the document from partial data.
  contractText?: string;
  ndaText?: string;
}

// Fields the owner fills in when signing.
export interface OwnerSigningFormData {
  ownerName: string;
  ownerIdNumber: string;
  ownerContactEmail: string;
  ownerContactPhone: string;
  buildingName: string;
  apartmentNumber: string;
  unitCount: number;
}
