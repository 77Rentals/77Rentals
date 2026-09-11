// A public, no-login link sent to a CLIENT (e.g. a corporate client like
// Galcol S.A.S.) so they can review and sign a bespoke contract or otrosí.
// Unlike owner_signing_links, the admin pastes the exact contract text when
// creating the link -- every client contract is different.

export interface ClientSigningLink {
  id: string;
  status: 'pending' | 'signed';
  title: string;
  contractText: string;
  clientName?: string;
  signedAt?: Date;
  signatureImage?: string;
}

// Fields the client fills in when signing.
export interface ClientSigningFormData {
  clientName: string;
  clientIdNumber: string;
  clientContactEmail: string;
  clientContactPhone: string;
}
