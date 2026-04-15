# Properties Section Redesign — Implementation Spec
**Date:** 2026-04-14
**Status:** Approved

---

## Overview

Redesign the properties section of 77Rentals with:
1. City-first layout (Santa Marta featured) with filter pills
2. Enhanced property cards with review quotes + "Ver detalles" CTA
3. Full property detail pages at `/propiedades/:slug`
4. Extended data layer with real Booking.com data for 5 properties

---

## 1. Data Layer — `src/data/apartments.ts`

### Extended Interface

```typescript
export interface PropertyReview {
  name: string;
  country: string;        // ISO 2-letter code e.g. "CO", "PE", "PL"
  rating: number;         // e.g. 10, 9.0, 8.0
  title?: string;
  comment: string;
  stayType?: string;      // "Pareja", "Familia", "Solo", "Grupo"
  nights?: number;
  date?: string;          // "Octubre 2025"
  hostResponse?: string;
}

export interface PropertyScores {
  overall: number;
  label: string;          // "Excepcional", "Fantástico", etc.
  totalReviews: number;
  staff?: number;
  facilities?: number;
  cleanliness?: number;
  comfort?: number;
  value?: number;
  location?: number;
  wifi?: number;
}

export interface NearbyPlace {
  name: string;
  distance: string;       // "200 m", "3 km"
}

export interface PropertyLocation {
  address?: string;
  neighborhood: string;
  city: string;
  beaches?: NearbyPlace[];
  attractions?: NearbyPlace[];
  restaurants?: NearbyPlace[];
  distanceToCenter?: string;
  distanceToAirport?: string;
  accessNote?: string;
}

export interface HouseRules {
  checkIn: string;
  checkOut: string;
  pets?: string;
  smoking?: string;
  parties?: string;
  children?: string;
  extraBed?: string;
  paymentMethods?: string[];
  specialNote?: string;
}

export interface AmenitiesDetail {
  kitchen?: string[];
  bathroom?: string[];
  bedroom?: string[];
  tech?: string[];
  outdoors?: string[];
  services?: string[];
  safety?: string[];
  other?: string[];
}

export interface Apartment {
  // Existing fields (unchanged)
  id: string;
  name: string;
  nameEn: string;
  city: string;
  cityEn: string;
  neighborhood: string;
  neighborhoodEn: string;
  description: string;
  descriptionEn: string;
  guests: number;
  rooms: number;
  bathrooms: number;
  priceFrom: number;
  rating?: number;
  reviewCount?: number;
  images: string[];
  amenities: string[];
  featured?: boolean;

  // New extended fields (all optional — backward compatible)
  slug?: string;               // URL slug e.g. "macondo-77rentals"
  nameBooking?: string;        // Full name as shown on Booking.com
  buildingName?: string;       // e.g. "Edificio DelVentto"
  propertyType?: string;       // "apartment" | "cabin" | "villa"
  sizeM2?: number;
  floor?: number;
  stars?: number;
  licenseNumber?: string;
  priceFromCOP?: number;
  bookingUrl?: string;
  descriptionLong?: string;
  descriptionLongEn?: string;
  neighborhoodDesc?: string;
  neighborhoodDescEn?: string;
  views?: string[];
  bedConfiguration?: string;
  scores?: PropertyScores;
  reviews?: PropertyReview[];
  amenitiesDetail?: AmenitiesDetail;
  houseRules?: HouseRules;
  locationDetail?: PropertyLocation;
  highlightReviewIndex?: number;  // index into reviews[] to show as card quote
  hostName?: string;
  hostBio?: string;
  tag?: string;                // e.g. "beach cabin", "featured"
  isComingSoon?: boolean;
}
```

### Properties

**1 — Macondo - 77Rentals** (`id: 'macondo-77rentals'`, replaces `vela-mare-717`)
- slug: `macondo-77rentals`
- nameBooking: `Macondo - 77Rentals`
- buildingName: `Vela Mare` (Edificio DelVentto)
- city: `Santa Marta`, neighborhood: `Pozos Colorados`
- guests: 4, rooms: 1, bathrooms: 1, sizeM2: 40, floor: 7
- priceFrom: 75, stars: 4, licenseNumber: `252673`
- scores: { overall: 10, label: "Excepcional", totalReviews: 11, staff: 10, facilities: 10, cleanliness: 10, comfort: 10, value: 10, location: 10, wifi: 10 }
- bookingUrl: `https://www.booking.com/hotel/co/77-rentals-717-vela-mare.es.html`
- highlightReviewIndex: 3 (Moncada — "Muy cómodo, súper bien equipado...")
- images: keep existing Unsplash placeholders
- 8 reviews: Daniel, Andres, Juan, Moncada, Diesel, Camilo, Santiago, Ewelina

**2 — Vista al Mar Fragata Style** (`id: 'fragata-style'`, updated in place)
- slug: `fragata-style`
- nameBooking: `Vista al Mar Fragata Style`
- buildingName: `Tacohagua`
- city: `Cartagena`, neighborhood: `El Laguito`
- guests: 5, rooms: 1, bathrooms: 1, sizeM2: 56
- priceFrom: 54, stars: 4, licenseNumber: `129017`
- scores: { overall: 9.5, label: "Excepcional", totalReviews: 122, staff: 9.5, facilities: 9.3, cleanliness: 9.4, comfort: 9.6, value: 9.6, location: 9.7, wifi: 10 }
- bookingUrl: `https://www.booking.com/hotel/co/fragata-style-2.es.html`
- highlightReviewIndex: 3 (Gonzalez — "El apto es muy lindo y acogedor...")
- images: keep existing Unsplash placeholders
- 10 reviews: Diana, Hector, Nicole, Gonzalez, Sayury, Claudia, Pillimue, Yanet, Josué, Santiago

**3 — Boho 1108** (`id: 'boho-1108'`, updated in place)
- slug: `boho-1108`
- nameBooking: `Vista al Mar - 77Rentals`
- city: `Cartagena`, neighborhood: `Laguito`
- guests: 6, rooms: 2, bathrooms: 2, sizeM2: 60
- priceFrom: 65, stars: 4, licenseNumber: `193850`
- scores: { overall: 9.2, label: "Fantástico", totalReviews: 56, staff: 9.4, facilities: 9.0, cleanliness: 9.2, comfort: 9.4, value: 9.2, location: 9.6, wifi: 10 }
- bookingUrl: `https://www.booking.com/hotel/co/boho1108.es.html`
- highlightReviewIndex: 4 (Paula — "La estadía fue muy agradable. La vista al mar es un regalo...")
- images: keep existing Unsplash placeholders
- 10 reviews: Johnny, Yhoana, Rudy, Jorge, Paula, Maríe, Jhon, Ospina, Janeth, Jdlondonoc

**4 — Perla Suite** (`id: 'perla-suite'`, replaces `chess-loft-707`)
- slug: `perla-suite`
- nameBooking: `Perla Luxury Suite`
- buildingName: `Edificio DelVentto`
- city: `Santa Marta`, neighborhood: `Pozos Colorados`
- guests: 4, rooms: 1, bathrooms: 1, sizeM2: 35, floor: 12
- priceFrom: 90, stars: 4, licenseNumber: `252118`
- scores: { overall: 9.6, label: "Excepcional", totalReviews: 10, staff: 9.7, facilities: 9.7, cleanliness: 9.7, comfort: 9.7, value: 9.4, location: 9.2 }
- highlightReviewIndex: 0 (Gomez — "Nuestra experiencia en este alojamiento fue simplemente maravillosa...")
- images: keep existing Unsplash placeholders
- 9 reviews: Gomez, Carrero, Sara H, Martha, Valeria, Pulido, Castro, Carlos (6/10 + host response), Jassay

**5 — Cabaña Salinas del Rey** (`id: 'cabana-salinas'`, NEW)
- slug: `cabana-salinas`
- name: `Cabaña Salinas del Rey`, internalName: `Montes Paradise`
- city: `Cartagena`, neighborhood: `Salinas del Rey, Atlántico`
- propertyType: `cabin`, tag: `beach cabin`
- guests: 10, rooms: 2, bathrooms: 3, sizeM2: null (not specified)
- priceFrom: null (no pricing data — CTA: "Consultar precio")
- licenseNumber: `245654`
- scores: null, reviews: [] — isNewListing: true
- hostName: `Judith`
- images: keep existing Unsplash placeholders (beach/cabin aesthetic)
- No reviews — show "¡Sé el primero en dejar una reseña!"

**6 — VillaBaru Casa** (`id: 'villabaru'`, keep as placeholder)
- isComingSoon: true
- All existing data kept
- "Ver detalles" button disabled, shows "Próximamente"

---

## 2. ApartmentCard Section Redesign

**File:** `src/components/ApartmentCard.tsx` (rewrite)

### City Tiles (top of section)
- Layout B: Santa Marta = large featured tile (left, 1.6fr), Cartagena + Medellín stacked (right, 1fr)
- Santa Marta tile: gold "DESTACADO" badge, "8 propiedades" (real count)
- Cartagena tile: "15+ propiedades"
- Medellín tile: "4 propiedades" (placeholder)
- Clicking a tile sets the active filter
- City images: Unsplash (Santa Marta beach, Cartagena wall, Medellín skyline)

### Filter Pills
- Pills: Todas (N) / Cartagena / Santa Marta / Medellín
- Active = `bg-[#2D1B69] text-white`, inactive = `bg-white border text-[#2D1B69]`
- Cabaña Salinas del Rey → counts under Cartagena

### Property Card (enhanced)
Cards with full data (`!isComingSoon`):
- Image carousel (existing logic, keep)
- Rating + price badges (existing)
- Neighborhood · City label
- Property name (serif)
- **Review quote** — gold left-border, italic, reviewer name + flag + "Booking.com ✓"
- Two CTA buttons: `flex-1 "Ver detalles →"` (links to `/propiedades/:slug`) + green WhatsApp icon button

Cards with `isComingSoon: true` (VillaBaru):
- Dimmed image area with "📸 Fotos próximamente"
- Name + neighborhood shown
- "Próximamente" grey button (disabled) + WhatsApp button still active

Cards with `propertyType === 'cabin'` (Cabaña Salinas):
- Gold "🌊 Cabaña de playa" badge overlaid on image
- "Consultar precio" instead of price badge

### Footer
`text-center`: "Mostrando X de 27 propiedades"

---

## 3. Property Detail Page

**File:** `src/pages/PropertyDetail.tsx`
**Route:** `/propiedades/:slug`
**Register in:** `src/App.tsx`

### Layout (desktop: 2-column, mobile: single column)

**Left column:**
1. **Hero image** — first image, full-width, max-height 400px, with city/neighborhood badge + star rating badge
2. **Title block** — building name label (gold, uppercase), property name (serif h1), specs row (guests / rooms / bathrooms / size)
3. **Score bar** — overall score badge + label + total reviews + category chips (staff, cleanliness, location, wifi, comfort, value)
4. **Description** — "Sobre este apartamento" heading, full description text. If `descriptionLong` exists, show it; otherwise `description`
5. **Amenities grid** — 3-column grid of emoji + label chips. Use `amenitiesDetail` groups if available; fall back to `amenities[]`
6. **Reviews section** — heading "Reseñas de huéspedes" + "Reseñas verificadas de Booking.com" badge. Each review: reviewer initial avatar (purple bg) + name + flag emoji + rating badge (10 scale) + title (bold) + comment + stayType/nights/date. If `isNewListing` → show "¡Sé el primero en dejar una reseña!" placeholder. Max 5 shown, "+ N más" expander.
7. **House rules** — 2-column grid: check-in, check-out, pets, smoking, payment methods
8. **Location** — distances to beaches (🏖), attractions (🗺), airport (✈️), center (🏙). Access note if present. Google Maps link (links to address string)
9. **Same building** — if `buildingName` matches another property, show a small cross-sell card ("También en Edificio DelVentto → Perla Suite")

**Right column (sticky sidebar):**
- Price (`priceFrom` in USD + COP if available, or "Consultar precio")
- Check-in / Check-out times (from houseRules)
- WhatsApp reserve button (green, full width) — pre-filled: `"Hola 77Rentals, me interesa reservar [name], ¿está disponible?"`
- "Ver en Booking.com →" button (if `bookingUrl` exists)
- Quick rules chips: pets, smoking, parking

### Mobile
Right column collapses to bottom sticky bar: price + "Reservar" WhatsApp button.

---

## 4. Route Registration

**File:** `src/App.tsx`

Add:
```tsx
import PropertyDetail from "./pages/PropertyDetail.tsx";
// ...
<Route path="/propiedades/:slug" element={<PropertyDetail />} />
```

---

## 5. Country Flag Helper

**File:** `src/lib/flags.ts` (new)

Map ISO 2-letter country codes to emoji flags:
```typescript
export const countryFlag = (code: string): string => {
  const map: Record<string, string> = {
    CO: '🇨🇴', PE: '🇵🇪', PL: '🇵🇱', GB: '🇬🇧', US: '🇺🇸',
    CL: '🇨🇱', PA: '🇵🇦',
  };
  return map[code.toUpperCase()] ?? '🌍';
};
```

Reviews with `country: "Colombia"` → normalize to `"CO"` in the data.

---

## 6. Amenity Icon Map

Keep existing `amenities` string[] for backward compat. For the detail page, use `amenitiesDetail` grouped object + an emoji map:

```typescript
const amenityIcons: Record<string, string> = {
  wifi: '📶', pool: '🏊', oceanView: '🌊', beach: '🏖',
  kitchen: '🍳', ac: '❄️', parking: '🚗', balcony: '🌅',
  netflix: '📺', pets: '🐾', elevator: '🛗', bbq: '🔥',
  gym: '💪', washer: '👕', security: '🔒', starlink: '🛰',
};
```

---

## 7. Unsplash Placeholder for Cabaña Salinas

Use beach/cabin themed images (existing Unsplash approach):
- `https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=800&q=80` (beach cabin)
- `https://images.unsplash.com/photo-1440342359743-84fcb8c21f21?w=800&q=80` (ocean beach)
- `https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80` (sea view)

---

## Out of Scope
- Real photos (user will provide later — images[] arrays accept any URL)
- Medellín city tile (exists as placeholder only)
- Booking/availability calendar integration
- VillaBaru Casa full data (placeholder until user provides)
- Map embed (existing MapSection covers global)
