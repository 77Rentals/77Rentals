export type PropertyType = 'A' | 'B' | 'C' | 'D';

export interface Petition {
  id: string;
  status: 'open' | 'closed';
  title: string;
  documentText: string;
  signedCount: number;
  totalApartments: number;
  rosterPublic: boolean;
}

/** One row of the public, name+unit-only transparency roster — never includes
 *  the signature image, cédula, or any other admin-only field. */
export interface PetitionRosterEntry {
  unitNumber: string;
  signerName: string;
  propertyType: PropertyType;
  apartmentCount: number;
  signedAt: Date;
}

export interface PetitionSignatureFormData {
  unitNumber: string;
  signerName: string;
  signerIdNumber: string;
  propertyType: PropertyType;
  apartmentCount: string; // kept as string in the form, parsed to number on submit
  consentMethod: string;
}

export interface PetitionSignature {
  id: string;
  unitNumber: string;
  signerName: string;
  signerIdNumber: string | null;
  propertyType: PropertyType;
  apartmentCount: number;
  consentMethod: string;
  signatureImage: string;
  signedAt: Date;
}
