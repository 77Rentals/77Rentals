export interface Petition {
  id: string;
  status: 'open' | 'closed';
  title: string;
  documentText: string;
  thresholdPct: number;
  maxCoefficientPct: number;
  signedCount: number;
  totalCoefficientPct: number;
  rosterPublic: boolean;
}

export interface PetitionSignatureFormData {
  unitNumber: string;
  signerName: string;
  signerIdNumber: string;
  coefficientPct: string; // kept as string in the form, parsed to number on submit
  consentMethod: string;
}

export interface PetitionSignature {
  id: string;
  unitNumber: string;
  signerName: string;
  signerIdNumber: string | null;
  coefficientPct: number | null;
  consentMethod: string;
  signatureImage: string;
  signedAt: Date;
}

/** One row of the public, name+unit-only transparency roster — never includes
 *  the signature image, cédula, or any other admin-only field. */
export interface PetitionRosterEntry {
  unitNumber: string;
  signerName: string;
  coefficientPct: number | null;
  signedAt: Date;
}
