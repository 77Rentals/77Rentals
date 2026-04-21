// Partner Hub data types and structures

// Partner requirement posted by admin
export interface GuestRequirement {
  id: string; // UUID
  createdAt: Date;
  guestCount: number;
  checkInDate: string; // YYYY-MM-DD
  checkOutDate: string; // YYYY-MM-DD
  budget: number; // USD per night
  notes: string;
  city: 'Santa Marta'; // Only for MVP
  status: 'open' | 'closed'; // closed = deal made
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
  proposedPrice: number; // USD per night
  commissionPercent: number; // 10 or custom
  commissionAmount: number; // Auto-calculated
  finalPrice: number; // proposedPrice - commission (or + markup)
  notes: string; // Why this property is perfect
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

// Mock data for MVP
export const mockRequirements: GuestRequirement[] = [];
export const mockResponses: PartnershipResponse[] = [];
