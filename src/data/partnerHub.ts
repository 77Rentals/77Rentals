// Partner Hub data types and structures

// Apartment type for matching requirements with responses
export type ApartmentType = 'Tipo A' | 'Tipo B' | 'Tipo C' | 'Tipo D';

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
  status: 'pending' | 'accepted' | 'rejected';
  respondedAt: Date;
}

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

// Owner property (pre-created properties for quick selection)
export interface OwnerProperty {
  id: string; // UUID
  ownerId: string;
  propertyName: string;
  apartmentType: ApartmentType;
  googleDriveLink: string;
  iCalLink?: string; // Optional: Google Calendar or iCal link for availability
  createdAt: Date;
  updatedAt: Date;
}

// Mock data for MVP
export const mockRequirements: GuestRequirement[] = [];
export const mockResponses: PartnershipResponse[] = [];
