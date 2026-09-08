// Partner Hub data types and structures

// Apartment type for matching requirements with responses
export type ApartmentType = 'Tipo A' | 'Tipo B' | 'Tipo C' | 'Tipo D';

// NDA Signature data
export interface NDASignature {
  signedBy: 'admin' | 'owner';
  signerName: string;
  timestamp: Date;
}

// Contract (Contrato de Servicio de Alquiler Turístico de Inmueble) signature data.
// Stronger than NDASignature — the contract carries payment/penalty
// obligations, so it captures an ID number and a hash of the exact
// contract text signed, for evidentiary weight under Ley 527 de 1999.
export interface ContractSignature {
  signedBy: 'admin' | 'owner';
  signerName: string;
  signerIdNumber: string; // Cédula de ciudadanía / NIT
  timestamp: Date;
  contractHash: string; // SHA-256 of the exact rendered contract text at signing time
  userAgent?: string;
}

// Partner requirement posted by admin
export interface GuestRequirement {
  id: string; // UUID
  createdAt: Date;
  guestCount: number;
  checkInDate: string; // YYYY-MM-DD
  checkOutDate: string; // YYYY-MM-DD
  budget: number; // COP per night (estimated/flexible)
  notes: string;
  city: string; // e.g., "Santa Marta, Delventto"
  status: 'open' | 'successful' | 'cancelled'; // open = accepting responses, successful = deal made, cancelled = no longer accepting
  allowedApartmentTypes: ApartmentType[]; // Types admin is accepting (Tipo A, B, C, D)
  commissionType: 'fixed' | 'markup'; // 'fixed' = 10%, 'markup' = admin-set amount
  commissionValue?: number; // For markup type: the markup amount in COP
  adminContact: {
    name: string;
    phone: string;
    email: string;
  };
}

// Owner's response to a requirement
export interface PartnershipResponse {
  id: string;
  requirementId: string;
  ownerId: string; // DelVentto property owner identifier
  propertyName: string; // DelVentto property name
  proposedPrice: number; // COP per night
  cleaningFee: number; // COP cleaning fee (commission NOT applied to this)
  commissionPercent: number; // 10 or custom
  commissionAmount: number; // Auto-calculated (only on proposedPrice, not cleaningFee)
  finalPrice: number; // (proposedPrice - commission) + cleaningFee (or + markup)
  apartmentType: ApartmentType; // Must match requirement's allowedApartmentTypes
  torreApartamento: string; // Tower and apartment number (e.g., "A-407")
  googleDriveLink: string; // Google Drive folder link with photos
  apartmentBio: string; // Apartment description/bio
  notes: string; // Additional notes about the property
  ownerContact: {
    name: string;
    phone: string;
    email: string;
  };
  iCalLink?: string; // Optional: iCal availability link from property
  status: 'pending' | 'accepted' | 'rejected';
  rejectionNote?: string; // Optional note from admin explaining why offer was rejected
  respondedAt: Date;
  // NDA signing fields
  ndaStatus: SigningStatus;
  adminSignature?: NDASignature;
  ownerSignature?: NDASignature;
  // Contrato de Servicio de Alquiler Turístico de Inmueble signing fields
  contractStatus: SigningStatus;
  adminContractSignature?: ContractSignature;
  ownerContractSignature?: ContractSignature;
}

// 'owner_signed' covers the case where the owner signs before the admin
// does -- previously mislabeled 'not_started', which hid the fact a
// signature already existed.
export type SigningStatus = 'not_started' | 'admin_signed' | 'owner_signed' | 'both_signed';

// Partner auth (simple email-based MVP)
export interface PartnerAuth {
  email: string;
  delVenttoId: string; // Identifies owner as DelVentto partner
  lastLogin: Date;
}

// Owner profile (contact info)
export interface OwnerProfile {
  name: string;
  phone: string;
  email: string;
  delVenttoId: string;
}

// Owner property (self-serve listing, also used for quick selection when
// offering against a guest requirement)
export interface OwnerProperty {
  id: string; // UUID
  ownerId: string;
  propertyName: string;
  apartmentType: ApartmentType;
  googleDriveLink: string;
  iCalLink?: string; // Optional: Google Calendar or iCal link for availability
  city: string;
  address: string;
  maxGuests: number;
  bedrooms: number;
  bathrooms: number;
  nightlyRate?: number; // COP, optional (owner may not have a fixed rate)
  description: string;
  amenities: string; // Free-text list, comma or line separated
  createdAt: Date;
  updatedAt: Date;
}

// Mock data for MVP
export const mockRequirements: GuestRequirement[] = [];
export const mockResponses: PartnershipResponse[] = [];
