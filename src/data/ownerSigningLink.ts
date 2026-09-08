// A public, no-login link sent to a Galcol-deal apartment owner so they can
// review and sign the Contrato de Arriendo a Tarifa Fija + NDA for their
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
