export interface Petition {
  id: string;
  status: 'open' | 'closed';
  title: string;
  documentText: string;
  thresholdPct: number;
  signedCount: number;
  totalCoefficientPct: number;
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
  coefficientPct: number;
  consentMethod: string;
  signatureImage: string;
  signedAt: Date;
}
