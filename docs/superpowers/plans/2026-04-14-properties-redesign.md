# Properties Section Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the properties section with a city-first layout, enhanced cards with real review data, and full property detail pages for each listing.

**Architecture:** Extend `src/data/apartments.ts` with rich types (reviews, scores, amenities, location, house rules), rewrite `ApartmentCard.tsx` with Santa Marta featured tile + filter pills + enhanced cards, add `PropertyDetail.tsx` as a new route at `/propiedades/:slug`, and a `flags.ts` utility for country emoji flags.

**Tech Stack:** React 18 + TypeScript + Vite + Tailwind CSS + shadcn/ui + react-router-dom v6. No new npm packages.

---

## File Map

| Action | File | Responsibility |
|---|---|---|
| Rewrite | `src/data/apartments.ts` | All types + all 6 property objects with full data |
| Create | `src/lib/flags.ts` | Country code → emoji flag helper |
| Rewrite | `src/components/ApartmentCard.tsx` | City tiles + filter pills + enhanced property cards |
| Create | `src/pages/PropertyDetail.tsx` | Full property detail page |
| Modify | `src/App.tsx` | Register `/propiedades/:slug` route |

---

## Task 1: Extend data types and populate all properties

**Files:**
- Rewrite: `src/data/apartments.ts`

- [ ] **Step 1: Replace `src/data/apartments.ts` with the full extended version**

```typescript
// src/data/apartments.ts

export interface PropertyReview {
  name: string;
  country: string;       // ISO 2-letter e.g. "CO", "GB"
  rating: number;        // 1–10 scale
  title?: string;
  comment: string;
  stayType?: string;     // "Pareja", "Familia", "Solo", "Grupo"
  nights?: number;
  date?: string;         // "Octubre 2025"
  hostResponse?: string;
}

export interface PropertyScores {
  overall: number;
  label: string;         // "Excepcional", "Fantástico"
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
  distance: string;      // "200 m", "3 km"
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
  // Core fields (unchanged)
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

  // Extended fields (all optional)
  slug?: string;
  nameBooking?: string;
  buildingName?: string;
  propertyType?: 'apartment' | 'cabin' | 'villa';
  tag?: string;
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
  highlightReviewIndex?: number;
  hostName?: string;
  hostBio?: string;
  isComingSoon?: boolean;
  isNewListing?: boolean;
}

export const apartments: Apartment[] = [
  // ─────────────────────────────────────────
  // 1. VillaBaru Casa — placeholder
  // ─────────────────────────────────────────
  {
    id: 'villabaru',
    slug: 'villabaru-casa',
    name: 'VillaBaru Casa',
    nameEn: 'VillaBaru Casa',
    city: 'Cartagena',
    cityEn: 'Cartagena',
    neighborhood: 'Bocagrande',
    neighborhoodEn: 'Bocagrande',
    description: 'Villa de lujo con diseño moderno, terraza privada con piscina y vistas panorámicas. Perfecta para grupos que buscan privacidad y exclusividad en Cartagena.',
    descriptionEn: 'Luxury villa with modern design, private rooftop pool and panoramic views. Perfect for groups seeking privacy and exclusivity in Cartagena.',
    guests: 10,
    rooms: 4,
    bathrooms: 3,
    priceFrom: 180,
    rating: 4.9,
    reviewCount: 48,
    images: [
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80',
      'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80',
      'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80',
      'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?w=800&q=80',
    ],
    amenities: ['pool', 'oceanView', 'wifi', 'kitchen', 'balcony', 'ac', 'parking', 'security'],
    featured: true,
    isComingSoon: true,
  },

  // ─────────────────────────────────────────
  // 2. Vista al Mar Fragata Style
  // ─────────────────────────────────────────
  {
    id: 'fragata-style',
    slug: 'fragata-style',
    name: 'Fragata Style',
    nameEn: 'Fragata Style',
    nameBooking: 'Vista al Mar Fragata Style',
    buildingName: 'Tacohagua',
    city: 'Cartagena',
    cityEn: 'Cartagena',
    neighborhood: 'El Laguito',
    neighborhoodEn: 'El Laguito',
    description: 'Apartamento náutico con vista directa al mar Caribe. A pasos de Playa El Laguito, con diseño cuidado y atención personalizada.',
    descriptionEn: 'Nautical-style apartment with direct Caribbean sea views. Steps from Playa El Laguito with thoughtful design and personalized service.',
    descriptionLong: 'Nuestro alojamiento se distingue por su estilo náutico, cuidadosamente diseñado para transmitir una sensación de calidez y confort desde el primer momento. Cada detalle ha sido pensado para que los huéspedes se sientan como en casa: desde la decoración acogedora hasta los colchones de alta calidad que garantizan un descanso reparador. La combinación de comodidad, tranquilidad y una atmósfera relajada crea una experiencia única. Uno de los mayores atractivos es la vista privilegiada que ofrece el alojamiento, con panorámicas impresionantes del mar y la ciudad que invitan a desconectar y disfrutar. Nos esforzamos por brindar un ambiente sereno, ideal para relajarse, y una atención personalizada que hace sentir a cada huésped como en su propio hogar, pero con el encanto de un lugar especial.',
    descriptionLongEn: 'Our accommodation stands out for its nautical style, carefully designed to convey a sense of warmth and comfort from the very first moment. Every detail has been thoughtfully considered to make guests feel at home—from the cozy décor to the high-quality mattresses that ensure a restful night\'s sleep. The combination of comfort, tranquility, and a relaxed atmosphere creates a truly unique experience. One of the most remarkable features is the privileged view, offering stunning panoramas of the sea and the city, inviting guests to unwind and enjoy.',
    neighborhoodDesc: 'El barrio El Laguito es uno de los sectores más exclusivos y tranquilos de Cartagena. Se destaca por su ambiente seguro, ideal para caminar y disfrutar en familia o en pareja. La ubicación es privilegiada, a pocos pasos de la playa y rodeada de opciones gastronómicas, tiendas y actividades turísticas.',
    neighborhoodDescEn: 'El Laguito is one of the most exclusive and peaceful neighborhoods in Cartagena. Known for its safety, perfect for walking and enjoying time with family or your partner. Steps from the beach and surrounded by restaurants, shops, and tourist attractions.',
    guests: 5,
    rooms: 1,
    bathrooms: 1,
    sizeM2: 56,
    priceFrom: 54,
    stars: 4,
    licenseNumber: '129017',
    rating: 9.5,
    reviewCount: 122,
    views: ['Sea views'],
    bedConfiguration: '1 cama doble + 1 cama individual + 1 sofá cama',
    bookingUrl: 'https://www.booking.com/hotel/co/fragata-style-2.es.html',
    hostName: 'Claudia Moreno',
    images: [
      'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800&q=80',
      'https://images.unsplash.com/photo-1560448075-bb485b067938?w=800&q=80',
      'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800&q=80',
    ],
    amenities: ['oceanView', 'beach', 'wifi', 'kitchen', 'ac', 'streaming'],
    amenitiesDetail: {
      kitchen: ['Mesa de comedor', 'Cafetera', 'Tostadora', 'Cocina', 'Utensilios de cocina', 'Nevera'],
      bathroom: ['Papel higiénico', 'Toallas', 'Baño privado', 'Ducha'],
      bedroom: ['Ropa de cama', 'Armario'],
      tech: ['Netflix', 'TV de pantalla plana'],
      services: ['Recepción 24 horas', 'WiFi gratis'],
      other: ['Aire acondicionado', 'Ascensor', 'No fumar'],
    },
    houseRules: {
      checkIn: '15:00 – 23:00',
      checkOut: '01:00 – 12:00',
      pets: 'Permitidas, sin cargo',
      smoking: 'No permitido',
      parties: 'No permitidas',
      children: 'Todas las edades bienvenidas',
      paymentMethods: ['Efectivo', 'Visa', 'Mastercard'],
      specialNote: 'Sin fiestas de despedida de soltero/a.',
    },
    locationDetail: {
      address: 'Calle 1A Carrera 1-96 Apt 901, El Laguito, Cartagena',
      neighborhood: 'El Laguito',
      city: 'Cartagena',
      distanceToCenter: '3.7 km',
      distanceToAirport: '10 km (Aeropuerto Rafael Núñez)',
      beaches: [
        { name: 'Playa El Laguito', distance: '4 m' },
        { name: 'Playa de Bocagrande', distance: '350 m' },
        { name: 'Playa Castillo Grande', distance: '500 m' },
      ],
      restaurants: [
        { name: 'Yogen Fruz', distance: '10 m' },
        { name: "Charlie's Coffee", distance: '100 m' },
      ],
      attractions: [
        { name: 'Muralla de Cartagena', distance: '5 km' },
        { name: 'Castillo de San Felipe', distance: '5 km' },
        { name: 'Palacio de la Inquisición', distance: '4.1 km' },
      ],
    },
    scores: {
      overall: 9.5,
      label: 'Excepcional',
      totalReviews: 122,
      staff: 9.5,
      facilities: 9.3,
      cleanliness: 9.4,
      comfort: 9.6,
      value: 9.6,
      location: 9.7,
      wifi: 10,
    },
    highlightReviewIndex: 3,
    reviews: [
      { name: 'Diana', country: 'CO', rating: 10, title: 'Excepcional', comment: 'La ubicación increíble.', stayType: 'Grupo', nights: 7, date: 'Marzo 2026' },
      { name: 'Hector', country: 'CO', rating: 9, title: 'Un atardecer maravillo plus adicional para una buena estadía', comment: 'La Atención ante TODO porque siempre estabas desde el inicio a fin. Muy atento con el impasse de wi-fi lo solucionaste super rápido. El apartamento es tal como aparece en las fotos. Volveremos, créeme.', stayType: 'Pareja', nights: 3, date: 'Febrero 2026' },
      { name: 'Nicole', country: 'CO', rating: 10, title: 'Estadía 10/10', comment: 'La ubicación es perfecta, muy cerca a las playas y a la tienda D1, el edificio es muy tranquilo y lo mejor fue la atención de la señora Claudia con nosotros. El apartamento es muy completo. El alojamiento está excelente.', stayType: 'Grupo', nights: 3, date: 'Febrero 2026' },
      { name: 'Gonzalez', country: 'CO', rating: 10, title: 'Excepcional', comment: 'El apto es muy lindo y acogedor, la limpieza es impecable, todo es tal cuál se muestra en las fotos, buena ubicación, hay tiendas cerca, el mar queda a un minuto de el lugar y la encargada es amable y atenta, definitivamente lo recomiendo.', stayType: 'Grupo', nights: 3, date: 'Enero 2026' },
      { name: 'Sayury', country: 'CO', rating: 10, title: 'Excepcional', comment: 'Absolutamente todo, es un apartamento con una vista hermosa.', stayType: 'Grupo', nights: 4, date: 'Enero 2026' },
      { name: 'Claudia', country: 'CL', rating: 10, title: 'Recomendable', comment: 'La Ubicación. Que no había lavadora ni zona de ropas.', stayType: 'Familia', nights: 5, date: 'Enero 2026' },
      { name: 'Pillimue', country: 'CO', rating: 10, title: 'Excepcional', comment: 'Todo, la estadía, la vista, la atención, fue excelente. Que no tuviera un espacio para lavar la ropa, y que no estaba funcionando la piscina.', stayType: 'Grupo', nights: 4, date: 'Diciembre 2025' },
      { name: 'Yanet', country: 'CO', rating: 8, title: 'Muy bien', comment: 'El apartamento está ubicado en un lugar tranquilo, es cómodo. Queda un poco retirado de la parte turística, y el acceso a la playa no es el mejor.', stayType: 'Familia', nights: 2, date: 'Octubre 2025' },
      { name: 'Josué', country: 'CO', rating: 10, title: 'Excepcional', comment: 'Apartamento muy céntrico a partes hermosas de la ciudad, y una linda vista.', stayType: 'Familia', nights: 3, date: 'Octubre 2025' },
      { name: 'Santiago', country: 'CO', rating: 10, title: 'Excepcional', comment: 'Todo durante la estadía fue excepcional, las instalaciones, camas cómodas, aire acondicionado y demás elementos. Por otro lado Claudia, la anfitriona, super atenta a cualquier problema o necesidad. En resumen súper contento mi grupo y yo con la estadía.', stayType: 'Grupo', nights: 4, date: 'Septiembre 2025' },
    ],
  },

  // ─────────────────────────────────────────
  // 3. Boho 1108
  // ─────────────────────────────────────────
  {
    id: 'boho-1108',
    slug: 'boho-1108',
    name: 'Boho 1108',
    nameEn: 'Boho 1108',
    nameBooking: 'Vista al Mar - 77Rentals',
    city: 'Cartagena',
    cityEn: 'Cartagena',
    neighborhood: 'Laguito',
    neighborhoodEn: 'Laguito',
    description: 'Vista directa al mar, apartamento completo con 2 baños, aire acondicionado, descanso y tranquilidad.',
    descriptionEn: 'Direct sea view, complete apartment with 2 bathrooms, air conditioning, rest and tranquility.',
    descriptionLong: 'Vista al Mar - 77Rentals está ubicado en el barrio Laguito en Cartagena de Indias, a pasos de Playa El Laguito, a 5 km del Palacio de la Inquisición y a 5.1 km del Parque Bolívar. Este apartamento con vistas a la ciudad y al mar también ofrece WiFi gratuito. El apartamento tiene 2 habitaciones separadas, 2 baños y sala de estar. Se proporcionan toallas y ropa de cama. El personal habla inglés y español.',
    guests: 6,
    rooms: 2,
    bathrooms: 2,
    sizeM2: 60,
    priceFrom: 65,
    stars: 4,
    licenseNumber: '193850',
    rating: 9.2,
    reviewCount: 56,
    views: ['Vista al mar', 'Vista a la ciudad'],
    bedConfiguration: '2 camas dobles (habitaciones) + 2 camas individuales (sala)',
    bookingUrl: 'https://www.booking.com/hotel/co/boho1108.es.html',
    hostName: 'Claudia Moreno',
    images: [
      'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=800&q=80',
      'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&q=80',
      'https://images.unsplash.com/photo-1502672023488-70e25813eb80?w=800&q=80',
    ],
    amenities: ['oceanView', 'beach', 'wifi', 'kitchen', 'ac', 'streaming'],
    amenitiesDetail: {
      kitchen: ['Mesa de comedor', 'Cafetera', 'Tostadora', 'Cocina', 'Utensilios de cocina', 'Nevera', 'Productos de limpieza'],
      bathroom: ['Papel higiénico', 'Toallas', 'Baño privado', 'Ducha'],
      bedroom: ['Ropa de cama', 'Armario'],
      tech: ['Netflix', 'TV de pantalla plana'],
      services: ['Recepción 24 horas', 'WiFi gratis'],
      other: ['Aire acondicionado', 'Ascensor', 'No fumar'],
    },
    houseRules: {
      checkIn: '15:00 – 23:00',
      checkOut: '06:00 – 11:00',
      pets: 'Permitidas, sin cargo',
      smoking: 'No permitido',
      parties: 'No permitidas',
      children: 'Todas las edades. Niños de 3+ años cuentan como adultos.',
      extraBed: 'Disponible bajo petición. COP 48,900 por persona/noche.',
      paymentMethods: ['Efectivo', 'Visa', 'Mastercard'],
    },
    locationDetail: {
      address: 'Calle 1A 1-96, Laguito, Cartagena',
      neighborhood: 'Laguito',
      city: 'Cartagena',
      distanceToCenter: '3.7 km',
      distanceToAirport: '8 km (Aeropuerto Rafael Núñez)',
      beaches: [
        { name: 'Playa El Laguito', distance: '3 m' },
        { name: 'Playa de Bocagrande', distance: '400 m' },
        { name: 'Playa Castillo Grande', distance: '500 m' },
      ],
      restaurants: [
        { name: 'Yogen Fruz', distance: '4 m' },
        { name: "Charlie's Coffee", distance: '100 m' },
        { name: 'D-Licious', distance: '200 m' },
      ],
      attractions: [
        { name: 'Parque Bolívar', distance: '4.1 km' },
        { name: 'Muralla de Cartagena', distance: '5 km' },
        { name: 'Castillo de San Felipe', distance: '5 km' },
      ],
    },
    scores: {
      overall: 9.2,
      label: 'Fantástico',
      totalReviews: 56,
      staff: 9.4,
      facilities: 9.0,
      cleanliness: 9.2,
      comfort: 9.4,
      value: 9.2,
      location: 9.6,
      wifi: 10,
    },
    highlightReviewIndex: 4,
    reviews: [
      { name: 'Johnny', country: 'CO', rating: 10, comment: 'La ubicación, la vista, el apartamento muy cómodo y limpio. Excelente estado.' },
      { name: 'Yhoana', country: 'PE', rating: 10, comment: 'La vista, la ubicación, el apartamento muy lindo y fresco.' },
      { name: 'Rudy', country: 'CO', rating: 10, comment: 'Se que hay grandes anfitriones pero quiero resaltar la forma, el trato y dedicación de Claudia para que nuestra estadía fuese placentera no solo por las instalaciones sino por el deseo que estemos bien, recomiendo al 100%.' },
      { name: 'Jorge', country: 'PA', rating: 10, comment: 'Excelente ubicación y precio. La brisa y la vista espectaculares.' },
      { name: 'Paula', country: 'CO', rating: 10, comment: 'La estadía fue muy agradable. La vista al mar es un regalo en cada momento del día. La cercanía a la playa es una maravilla, además sus aguas son tranquilas y el ambiente muy alegre. El apartamento es fresco, iluminado, y sus camas son cómodas.' },
      { name: 'Maríe', country: 'CO', rating: 10, comment: 'La ubicación es excelente, el sector es muy seguro, pudimos dejar nuestro carro afuera durante los 3 días sin ningún problema. Además hay cerca tiendas, supermercado, farmacia y muchos restaurantes.' },
      { name: 'Jhon', country: 'CO', rating: 10, comment: 'Super recomendado, es igual que en las imágenes cumpliendo con las expectativas y excelente atención de la anfitriona.' },
      { name: 'Ospina', country: 'CO', rating: 10, comment: 'El lugar era perfecto, la ubicación super estratégica y en un sector de la ciudad súper seguro y bonito. Todo estuvo perfecto.' },
      { name: 'Janeth', country: 'CO', rating: 10, comment: 'El apartamento es muy cómodo con una excelente ubicación, la vista es hermosa. La anfitriona está siempre disponible para cualquier requerimiento. Definitivamente 10 de 10.' },
      { name: 'Jdlondonoc', country: 'CO', rating: 10, comment: 'Excelente ubicación, hermosa vista, muy cómodo el apartamento. La amabilidad y atención oportuna de Claudia quien siempre está atenta.' },
    ],
  },

  // ─────────────────────────────────────────
  // 4. Macondo - 77Rentals (formerly Vela Mare 717)
  // ─────────────────────────────────────────
  {
    id: 'macondo-77rentals',
    slug: 'macondo-77rentals',
    name: 'Macondo - 77Rentals',
    nameEn: 'Macondo - 77Rentals',
    nameBooking: 'Macondo - 77Rentals',
    buildingName: 'Vela Mare (Edificio DelVentto)',
    city: 'Santa Marta',
    cityEn: 'Santa Marta',
    neighborhood: 'Pozos Colorados',
    neighborhoodEn: 'Pozos Colorados',
    description: 'Moderno apartamento en Pozos Colorados con vista parcial al mar y balcón. A 2 minutos de Playa Cabo Tortuga.',
    descriptionEn: 'Modern apartment in Pozos Colorados with partial sea view and balcony. 2 minutes from Playa Cabo Tortuga.',
    descriptionLong: 'Bienvenido a Vela Mare, tu santuario moderno en el exclusivo barrio de Pozos Colorados, Santa Marta. Este elegante apartamento ofrece la combinación perfecta de relajación y comodidad, ideal para parejas o viajeros solitarios. Relájate en un espacio bellamente diseñado con toques tropicales que evocan el espíritu del Caribe. El apartamento cuenta con una cocina totalmente equipada, una cómoda sala de estar y aire acondicionado para garantizar tu total confort. También disfrutarás de una vista parcial al mar, que ofrece un telón de fondo pintoresco para tu café de la mañana o cócteles por la noche.',
    guests: 4,
    rooms: 1,
    bathrooms: 1,
    sizeM2: 40,
    priceFrom: 75,
    priceFromCOP: 221000,
    stars: 4,
    licenseNumber: '252673',
    rating: 10,
    reviewCount: 11,
    views: ['Vista parcial al mar', 'Balcón'],
    bedConfiguration: '1 cama doble + 1 sofá cama',
    bookingUrl: 'https://www.booking.com/hotel/co/77-rentals-717-vela-mare.es.html',
    hostName: 'Claudia Moreno',
    images: [
      'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&q=80',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80',
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&q=80',
    ],
    amenities: ['oceanView', 'beach', 'wifi', 'kitchen', 'balcony', 'ac', 'parking', 'streaming'],
    amenitiesDetail: {
      kitchen: ['Mesa de comedor', 'Cafetera', 'Tostadora', 'Cocina', 'Utensilios de cocina', 'Nevera', 'Lavavajillas'],
      bathroom: ['Papel higiénico', 'Toallas', 'Baño privado', 'Artículos de baño gratis'],
      bedroom: ['Ropa de cama', 'Armario'],
      tech: ['Netflix', 'TV de pantalla plana', 'Canales de cable', 'Videojuegos'],
      outdoors: ['Muebles exteriores', 'Balcón'],
      services: ['Recepción 24 horas', 'WiFi gratis', 'Parking privado gratis', 'Servicio de despertador'],
      safety: ['Detector de monóxido de carbono'],
      other: ['Aire acondicionado', 'Ascensor', 'No fumar', 'Mascotas permitidas', 'Accesible en silla de ruedas'],
    },
    houseRules: {
      checkIn: '15:00 – 23:00',
      checkOut: '06:00 – 11:00',
      pets: 'Permitidas (puede aplicar recargo)',
      smoking: 'No permitido',
      parties: 'No permitidas',
      children: 'Todas las edades bienvenidas',
      paymentMethods: ['Efectivo'],
      specialNote: 'Pago requerido antes de la llegada vía transferencia bancaria.',
    },
    locationDetail: {
      address: '70 Carrera 4C, 470001, Pozos Colorados, Santa Marta',
      neighborhood: 'Pozos Colorados',
      city: 'Santa Marta',
      distanceToCenter: '8 km (10–15 min en coche)',
      distanceToAirport: '6 km (Aeropuerto Simón Bolívar)',
      beaches: [
        { name: 'Playa Cabo Tortuga', distance: '200 m' },
        { name: 'Playa Bello Horizonte', distance: '2.1 km' },
        { name: 'Playa Rodadero', distance: '3.6 km' },
      ],
      restaurants: [
        { name: 'La Parrilla', distance: '900 m' },
        { name: 'La Susheria Dorada', distance: '950 m' },
      ],
      attractions: [
        { name: 'Acuario y Museo del Mar del Rodadero', distance: '6 km' },
        { name: 'Catedral de Santa Marta', distance: '10 km' },
        { name: 'Quinta de San Pedro Alejandrino', distance: '11 km' },
      ],
    },
    scores: {
      overall: 10,
      label: 'Excepcional',
      totalReviews: 11,
      staff: 10,
      facilities: 10,
      cleanliness: 10,
      comfort: 10,
      value: 10,
      location: 10,
      wifi: 10,
    },
    highlightReviewIndex: 3,
    reviews: [
      { name: 'Daniel', country: 'CO', rating: 10, title: 'Acogedora y Emocionante', comment: 'El edificio con grandes condiciones muy bonito, excelentes zonas comunes, el personal amable, las instrucciones super claras, el propietario super pendiente de la llegada, de la entrada y de la organización, el manejo de todo el apartamento muy fácil, acogedor y con una linda vista.', stayType: 'Pareja', nights: 2, date: 'Abril 2026' },
      { name: 'Andres', country: 'CO', rating: 10, title: 'Gran estadía para estar en pareja!', comment: 'Fue especial y espectacular, el sitio es perfecto para lo que se puede necesitar en Santa Marta. Claudia fue sencillamente espectacular con su servicio, nos ayudó y todo fluyó con normalidad. Volveríamos, sí. Mil veces sí!', stayType: 'Pareja', nights: 2, date: 'Marzo 2026' },
      { name: 'Juan', country: 'CO', rating: 10, title: 'Excepcional', comment: 'El alojamiento es exactamente como se ve en las fotos. El apto es muy acogedor y el edificio es nuevo, tiene disponibilidad de parqueo sin problema.', stayType: 'Familia', nights: 1, date: 'Enero 2026' },
      { name: 'Moncada', country: 'CO', rating: 10, title: 'Recomendado al 100.', comment: 'Muy cómodo, súper bien equipado, limpio, ubicación central. Instalaciones 10/10. Pronto volveremos. Todo excelente.', stayType: 'Pareja', nights: 3, date: 'Septiembre 2025' },
      { name: 'Diesel', country: 'CO', rating: 10, title: 'Excepcional', comment: 'Tuvimos una excelente estadía en el apartamento de Claudia Moreno. Desde el primer momento, el recibimiento fue maravilloso, con una atención cálida y amable. El apartamento es divino, todo está en su lugar, muy hermoso, acogedor y con un ambiente familiar que te hace sentir como en casa. ¡Recomendado al 100%!', stayType: 'Familia', nights: 5, date: 'Julio 2025' },
      { name: 'Camilo', country: 'GB', rating: 10, title: 'We had such a fantastic time, we loved It!', comment: 'The flat was spotless and very well-maintained, which is something that\'s really important to us when we travel. We flew all the way from the UK and found Colombia and Santa Marta to be an amazing city! A huge thank you to Claudia and Juan Sebastian.', stayType: 'Solo', nights: 1, date: 'Agosto 2025' },
      { name: 'Santiago', country: 'US', rating: 10, title: 'The best place to stay in Santa Marta', comment: 'The place was beautiful, clean, and well-located. The hosts\' hospitality was outstanding — I really enjoyed the experience. I would have loved to have even more days to enjoy this amazing place.', stayType: 'Solo', nights: 1, date: 'Julio 2025' },
      { name: 'Ewelina', country: 'PL', rating: 10, title: 'Wszystko super bardzo polecam', comment: 'Wszystko super, polecam. (Everything great, I recommend — verified stay from Poland 🇵🇱)', stayType: 'Pareja', nights: 1, date: 'Marzo 2026' },
    ],
  },

  // ─────────────────────────────────────────
  // 5. Perla Suite (formerly 707 Chess Loft)
  // ─────────────────────────────────────────
  {
    id: 'perla-suite',
    slug: 'perla-suite',
    name: 'Perla Suite',
    nameEn: 'Perla Suite',
    nameBooking: 'Perla Luxury Suite',
    buildingName: 'Edificio DelVentto',
    city: 'Santa Marta',
    cityEn: 'Santa Marta',
    neighborhood: 'Pozos Colorados',
    neighborhoodEn: 'Pozos Colorados',
    description: 'Suite minimalista en el piso 12 con vista lateral al mar. A 2 minutos de Playa Cabo Tortuga. WiFi 900 Mbps, mascotas bienvenidas.',
    descriptionEn: 'Minimalist suite on the 12th floor with partial sea views. 2 minutes from Playa Cabo Tortuga. 900 Mbps WiFi, pets welcome.',
    descriptionLong: 'Disfruta de un apartamento fresco, cómodo, acogedor y de estilo minimalista, pensado para que te sientas como en casa desde el primer momento. Está ubicado en el piso 12, con vista lateral al mar, y se encuentra a solo 2 minutos caminando de la playa Cabo Tortuga. Además, cuenta con WiFi de alta velocidad (900 Mbps). Un espacio tranquilo y funcional, perfecto para descansar y vivir una experiencia relajada cerca del mar. 🐾 Mascotas bienvenidas (con condiciones).',
    guests: 4,
    rooms: 1,
    bathrooms: 1,
    sizeM2: 35,
    floor: 12,
    priceFrom: 90,
    stars: 4,
    licenseNumber: '252118',
    rating: 9.6,
    reviewCount: 10,
    views: ['Vista parcial al mar', 'Vista a la ciudad'],
    bedConfiguration: '2 camas dobles',
    hostName: '77Rentals',
    hostBio: 'Somos una empresa familiar especializada en rentas cortas. Somos pet friendly, porque entendemos que las mascotas también son parte de la familia. Nos apasionan los carros, el buceo y viajar. ¡Será un placer recibirte!',
    images: [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80',
      'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=800&q=80',
    ],
    amenities: ['oceanView', 'beach', 'wifi', 'kitchen', 'balcony', 'ac', 'parking', 'streaming', 'pets'],
    amenitiesDetail: {
      kitchen: ['Mesa de comedor', 'Cafetera', 'Tostadora', 'Cocina', 'Utensilios de cocina', 'Lavavajillas', 'Microondas', 'Nevera'],
      bathroom: ['Papel higiénico', 'Toallas', 'Baño privado', 'Ducha', 'Artículos de baño gratis'],
      bedroom: ['Ropa de cama', 'Armario'],
      tech: ['Netflix', 'TV de pantalla plana'],
      outdoors: ['Muebles exteriores', 'Balcón', 'Terraza', 'Frente a la playa'],
      services: ['Recepción 24 horas', 'WiFi Starlink 900 Mbps', 'Parking privado gratis'],
      other: ['Aire acondicionado', 'Ascensor', 'No fumar', 'Mascotas permitidas', 'Suelos de mármol'],
    },
    houseRules: {
      checkIn: '15:00 – 23:00',
      checkOut: '06:00 – 11:00',
      pets: 'Permitidas (puede aplicar recargo)',
      smoking: 'No permitido',
      parties: 'No permitidas',
      children: 'Todas las edades bienvenidas',
    },
    locationDetail: {
      address: 'Carrera 4C 70-75, Piso 12, Pozos Colorados, Santa Marta',
      neighborhood: 'Pozos Colorados',
      city: 'Santa Marta',
      distanceToCenter: '10 km',
      distanceToAirport: '5 km (Aeropuerto Simón Bolívar)',
      accessNote: 'Mismo edificio que Macondo - 77Rentals (Edificio DelVentto)',
      beaches: [
        { name: 'Playa Cabo Tortuga', distance: '250 m' },
        { name: 'Playa Pozos Colorados', distance: '200 m' },
        { name: 'Playa Rodadero', distance: '3.7 km' },
      ],
      restaurants: [
        { name: 'La Parrilla', distance: '750 m' },
        { name: 'La Susheria Dorada', distance: '850 m' },
      ],
      attractions: [
        { name: 'Acuario y Museo del Mar', distance: '6 km' },
        { name: 'Parque Tayrona', distance: '25 km' },
        { name: 'Museo del Oro Tairona', distance: '10 km' },
      ],
    },
    scores: {
      overall: 9.6,
      label: 'Excepcional',
      totalReviews: 10,
      staff: 9.7,
      facilities: 9.7,
      cleanliness: 9.7,
      comfort: 9.7,
      value: 9.4,
      location: 9.2,
    },
    highlightReviewIndex: 0,
    reviews: [
      { name: 'Gomez', country: 'CO', rating: 10, comment: 'Nuestra experiencia en este alojamiento fue simplemente maravillosa. Desde el proceso de reserva, todo fue ágil y con una atención excelente. El lugar es confortable, familiar y acogedor, ideal para descansar y disfrutar. La ubicación, frente al mar, es un verdadero encanto: despertar con esa vista no tiene precio.', stayType: 'Familia', nights: 4, date: 'Octubre 2025' },
      { name: 'Carrero', country: 'CO', rating: 10, comment: 'Excelente respuesta y atención por parte de la señora Claudia y Sebastian, estuvieron pendientes en todo momento. El apartamento es cómodo y tiene linda decoración.', stayType: 'Pareja', nights: 5, date: 'Septiembre 2025' },
      { name: 'Sara H', country: 'CO', rating: 10, title: 'La atención y el sitio, todo espectacular', comment: 'Todo fue excelente.', nights: 1, date: 'Agosto 2025' },
      { name: 'Martha', country: 'CO', rating: 10, title: 'Excelente experiencia', comment: 'La atención de Claudia fue impecable, siempre atenta y amable. Los paisajes son espectaculares y el lugar transmite mucha tranquilidad. Además, es un sitio muy bien ubicado. Todo estuvo perfecto. ¡Muy recomendado y sin duda volveré!', stayType: 'Solo', nights: 2, date: 'Julio 2025' },
      { name: 'Valeria', country: 'CO', rating: 10, comment: 'Todo perfecto.', stayType: 'Solo', nights: 1, date: 'Julio 2025' },
      { name: 'Pulido', country: 'CO', rating: 10, title: 'Comodidad y tranquilidad', comment: 'Gracias a Claudia que nos recibió y colaboró con toda la reserva. La suite es muy linda, cómoda con todo lo necesario. A solo pasos de playa Tortuga y muy cerca al centro comercial Zazue. ¡Nos encantó!', stayType: 'Solo', nights: 1, date: 'Junio 2025' },
      { name: 'Castro', country: 'CO', rating: 10, title: '¡Excelente! Recomendado 100%', comment: 'Hermoso, excelente servicio, justo lo que buscaba!', stayType: 'Pareja', nights: 1, date: 'Junio 2025' },
      { name: 'Carlos', country: 'CO', rating: 6, title: 'Regular por los alrededores con barro', comment: 'Los alrededores son calles destapadas y no tiene cerca nada.', stayType: 'Pareja', nights: 1, date: 'Agosto 2025', hostResponse: 'Muchas gracias por tu comentario. Lamentamos la situación con el clima. Las obras en la zona están fuera de nuestro control, pero seguimos trabajando para mejorar la experiencia.' },
      { name: 'Jassay', country: 'CO', rating: 10, comment: '', stayType: 'Pareja', nights: 1, date: 'Octubre 2025' },
    ],
  },

  // ─────────────────────────────────────────
  // 6. Cabaña Salinas del Rey
  // ─────────────────────────────────────────
  {
    id: 'cabana-salinas',
    slug: 'cabana-salinas',
    name: 'Cabaña Salinas del Rey',
    nameEn: 'Cabaña Salinas del Rey',
    nameBooking: 'Montes Paradise',
    city: 'Cartagena',
    cityEn: 'Cartagena',
    neighborhood: 'Salinas del Rey, Atlántico',
    neighborhoodEn: 'Salinas del Rey, Atlántico',
    description: 'Chalet de madera con lujo rústico, 20m de playa semi-privada ideal para kitesurf. Piscina privada, WiFi Starlink, hasta 10 huéspedes.',
    descriptionEn: 'Wooden chalet with rustic luxury, 20m semi-private beach ideal for kitesurfing. Private pool, Starlink WiFi, up to 10 guests.',
    descriptionLong: '¡Bienvenido a Montes Paradise! Chalet de madera, lujo rústico con 20 m de playa semi-privada ideal para kitesurf, 2 habitaciones con AA, 2 mezanines, 3 baños, sala, comedor, cocina, 2 balcones (vista mar/montaña). Piscina, juegos infantiles, terraza con barril BBQ, accesorios golf. WiFi Starlink.\n\nUbicación: 45 km (40 min) de Barranquilla, 80 km (75 min) de Cartagena.\n\n🐾 Niños menores de 6 años y mascotas gratis (confirmar al reservar). Copa de bienvenida incluida.',
    guests: 10,
    rooms: 2,
    bathrooms: 3,
    priceFrom: 0,
    licenseNumber: '245654',
    rating: undefined,
    reviewCount: 0,
    propertyType: 'cabin',
    tag: 'beach cabin',
    views: ['Vista al mar', 'Vista a la montaña'],
    bedConfiguration: '1 cama queen (hab 1) + 2 camas dobles (hab 2) + 1 sofá cama + 2 mezanines',
    hostName: 'Judith',
    isNewListing: true,
    images: [
      'https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=800&q=80',
      'https://images.unsplash.com/photo-1440342359743-84fcb8c21f21?w=800&q=80',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
    ],
    amenities: ['beach', 'pool', 'wifi', 'kitchen', 'balcony', 'ac', 'parking', 'bbq', 'pets'],
    amenitiesDetail: {
      kitchen: ['Cocina completa', 'Nevera', 'Mini nevera', 'Congelador', 'Cafetera', 'Utensilios básicos', 'BBQ carbón', 'Mesa de comedor'],
      bathroom: ['Secador', 'Champú', 'Acondicionador', 'Jabón corporal', 'Ducha exterior', 'Productos de limpieza'],
      bedroom: ['Ropa de cama', 'Almohadas extra', 'Cortinas oscuras', 'Plancha'],
      tech: ['TV 50" HD con Netflix', 'WiFi Starlink', 'Área de trabajo con silla ergonómica'],
      outdoors: ['Piscina privada', 'Playa semi-privada 20m', 'Hamaca', 'BBQ', 'Muebles exteriores', 'Terraza con barril BBQ', '2 balcones', 'Acceso directo a la playa'],
      services: ['Parking gratis (8 espacios)', 'Check-in anticipado (bajo petición)', 'Servicio doméstico (bajo petición, costo adicional)'],
      safety: ['4 cámaras de seguridad exteriores', 'Extintor', 'Botiquín de primeros auxilios'],
      other: ['Aire acondicionado', 'Ventilador de techo', 'Cuna de viaje disponible', 'Juegos de mesa', 'Mini golf', 'Parque infantil'],
    },
    houseRules: {
      checkIn: 'Desde las 11:00',
      checkOut: 'Antes de las 15:00',
      pets: 'Permitidas (gratis con confirmación previa)',
      smoking: 'No permitido',
      parties: 'No permitidas — espacio para descanso y tranquilidad',
      children: 'Todas las edades. Niños menores de 6 años gratis.',
      specialNote: 'Acceso por 900m de carretera sin pavimentar desde la Vía al Mar. Automóvil normal suficiente, no se necesita 4x4.',
    },
    locationDetail: {
      neighborhood: 'Salinas del Rey',
      city: 'Atlántico, Colombia',
      distanceToCenter: '45 km de Barranquilla (40 min) · 80 km de Cartagena (75 min)',
      distanceToAirport: 'Aeropuerto El Dorado de Barranquilla aprox. 50 km',
      accessNote: '900m de carretera sin pavimentar desde la Vía al Mar. Automóvil normal suficiente.',
      beaches: [
        { name: 'Playa semi-privada (frente a la cabaña)', distance: '20 m' },
      ],
    },
    scores: undefined,
    reviews: [],
  },
];
```

- [ ] **Step 2: Verify the dev server compiles with no TypeScript errors**

```bash
cd "C:/Users/57350/Desktop/Claude 77Rentals/GitHub code v1/rentals77-main"
npm run build 2>&1 | tail -20
```
Expected: `✓ built in` with no errors. Fix any type errors before continuing.

- [ ] **Step 3: Commit**

```bash
git add src/data/apartments.ts
git commit -m "feat: extend apartments data with full property info and real Booking.com reviews"
```

---

## Task 2: Create country flag helper

**Files:**
- Create: `src/lib/flags.ts`

- [ ] **Step 1: Create `src/lib/flags.ts`**

```typescript
// src/lib/flags.ts

const FLAG_MAP: Record<string, string> = {
  CO: '🇨🇴',
  PE: '🇵🇪',
  PL: '🇵🇱',
  GB: '🇬🇧',
  US: '🇺🇸',
  CL: '🇨🇱',
  PA: '🇵🇦',
  AR: '🇦🇷',
  MX: '🇲🇽',
  VE: '🇻🇪',
  EC: '🇪🇨',
  BR: '🇧🇷',
};

export const countryFlag = (code: string): string =>
  FLAG_MAP[code.toUpperCase()] ?? '🌍';

export const countryName: Record<string, string> = {
  CO: 'Colombia',
  PE: 'Perú',
  PL: 'Polonia',
  GB: 'Reino Unido',
  US: 'Estados Unidos',
  CL: 'Chile',
  PA: 'Panamá',
};
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/flags.ts
git commit -m "feat: add country flag emoji helper"
```

---

## Task 3: Rewrite ApartmentCard with city-first layout

**Files:**
- Rewrite: `src/components/ApartmentCard.tsx`

- [ ] **Step 1: Rewrite `src/components/ApartmentCard.tsx`**

```tsx
// src/components/ApartmentCard.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { apartments } from '@/data/apartments';
import { Users, BedDouble, Bath, ChevronLeft, ChevronRight, Star, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';

// ── Image Carousel (unchanged from original) ──────────────────────────────
const ImageCarousel = ({ images, name }: { images: string[]; name: string }) => {
  const [current, setCurrent] = useState(0);
  const prev = (e: React.MouseEvent) => { e.stopPropagation(); setCurrent(c => (c - 1 + images.length) % images.length); };
  const next = (e: React.MouseEvent) => { e.stopPropagation(); setCurrent(c => (c + 1) % images.length); };
  return (
    <div className="relative overflow-hidden aspect-[4/3] bg-gray-100 group/carousel">
      {images.map((src, i) => (
        <img key={src} src={src} alt={`${name} - foto ${i + 1}`}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${i === current ? 'opacity-100' : 'opacity-0'}`}
          loading={i === 0 ? 'eager' : 'lazy'} />
      ))}
      {images.length > 1 && (
        <>
          <button onClick={prev} className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/40 hover:bg-black/60 rounded-full flex items-center justify-center text-white opacity-0 group-hover/carousel:opacity-100 transition-all duration-200 backdrop-blur-sm" aria-label="Previous photo"><ChevronLeft className="w-4 h-4" /></button>
          <button onClick={next} className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/40 hover:bg-black/60 rounded-full flex items-center justify-center text-white opacity-0 group-hover/carousel:opacity-100 transition-all duration-200 backdrop-blur-sm" aria-label="Next photo"><ChevronRight className="w-4 h-4" /></button>
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {images.map((_, i) => (
              <button key={i} onClick={e => { e.stopPropagation(); setCurrent(i); }}
                className={`h-1.5 rounded-full transition-all duration-200 ${i === current ? 'bg-white w-4' : 'bg-white/50 hover:bg-white/80 w-1.5'}`}
                aria-label={`Photo ${i + 1}`} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

// ── City tile images ───────────────────────────────────────────────────────
const CITY_IMAGES = {
  'Santa Marta': 'https://images.unsplash.com/photo-1586077427416-c4e1d65a06a7?w=600&q=70',
  'Cartagena': 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=600&q=70',
  'Medellín': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=70',
};

type CityFilter = 'Todas' | 'Cartagena' | 'Santa Marta' | 'Medellín';

// ── Main component ─────────────────────────────────────────────────────────
const ApartmentCard = () => {
  const { lang, t } = useLanguage();
  const navigate = useNavigate();
  const [activeCity, setActiveCity] = useState<CityFilter>('Todas');

  const cityCounts = {
    Cartagena: apartments.filter(a => a.city === 'Cartagena').length,
    'Santa Marta': apartments.filter(a => a.city === 'Santa Marta').length,
    Medellín: apartments.filter(a => a.city === 'Medellín').length,
  };

  const filtered = activeCity === 'Todas'
    ? apartments
    : apartments.filter(a => a.city === activeCity);

  const handleReserve = (e: React.MouseEvent, name: string, city: string) => {
    e.stopPropagation();
    const msg = encodeURIComponent(`Hola 77Rentals, me interesa "${name}" en ${city}, ¿está disponible?`);
    window.open(`https://wa.me/573046736241?text=${msg}`, '_blank');
  };

  return (
    <section id="apartments" className="py-24 bg-white">
      <div className="container mx-auto px-4 max-w-6xl">

        {/* Section header */}
        <div className="flex flex-col items-center mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px w-8 bg-[#D4A843]" />
            <span className="text-[#D4A843] text-xs font-semibold uppercase tracking-[0.2em]">DESTINOS</span>
            <div className="h-px w-8 bg-[#D4A843]" />
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-[#2D1B69] text-center">
            {t('apartments.title')}
          </h2>
        </div>

        {/* City tiles — Santa Marta featured */}
        <div className="grid grid-cols-[1.6fr_1fr] gap-3 mb-6 max-w-4xl mx-auto">
          {/* Santa Marta — big */}
          <button
            onClick={() => setActiveCity(activeCity === 'Santa Marta' ? 'Todas' : 'Santa Marta')}
            className={`relative rounded-2xl overflow-hidden h-44 group transition-all duration-200 ${activeCity === 'Santa Marta' ? 'ring-2 ring-[#D4A843]' : ''}`}
          >
            <img src={CITY_IMAGES['Santa Marta']} alt="Santa Marta" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            <div className="absolute inset-0 bg-gradient-to-b from-[#2D1B69]/15 to-[#2D1B69]/80" />
            <div className="absolute top-3 left-3 bg-[#D4A843] text-[#2D1B69] text-xs font-bold px-3 py-1 rounded-full">DESTACADO</div>
            <div className="absolute bottom-0 left-0 right-0 p-4 text-left">
              <div className="font-serif text-xl font-bold text-white leading-tight">Santa Marta</div>
              <div className="text-white/80 text-sm mt-0.5">{cityCounts['Santa Marta']} propiedades · Pozos Colorados y más</div>
            </div>
          </button>

          {/* Cartagena + Medellín stacked */}
          <div className="flex flex-col gap-3">
            {(['Cartagena', 'Medellín'] as const).map(city => (
              <button
                key={city}
                onClick={() => setActiveCity(activeCity === city ? 'Todas' : city)}
                className={`relative rounded-2xl overflow-hidden flex-1 group transition-all duration-200 ${activeCity === city ? 'ring-2 ring-[#D4A843]' : ''}`}
              >
                <img src={CITY_IMAGES[city]} alt={city} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-b from-[#2D1B69]/15 to-[#2D1B69]/80" />
                <div className="absolute bottom-0 left-0 right-0 p-3 text-left">
                  <div className="font-serif text-base font-bold text-white">{city}</div>
                  <div className="text-white/80 text-xs">{cityCounts[city] ?? 0} propiedades</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Filter pills */}
        <div className="flex gap-2 justify-center flex-wrap mb-10">
          {(['Todas', 'Cartagena', 'Santa Marta', 'Medellín'] as CityFilter[]).map(city => (
            <button
              key={city}
              onClick={() => setActiveCity(city)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                activeCity === city
                  ? 'bg-[#2D1B69] text-white shadow-sm'
                  : 'bg-white border border-gray-200 text-[#2D1B69] hover:border-[#2D1B69]/40'
              }`}
            >
              {city}{city === 'Todas' ? ` (${apartments.length})` : city === 'Medellín' ? '' : ` (${cityCounts[city as keyof typeof cityCounts] ?? 0})`}
            </button>
          ))}
        </div>

        {/* Property cards grid */}
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filtered.map(apt => {
            const name = lang === 'es' ? apt.name : apt.nameEn;
            const city = lang === 'es' ? apt.city : apt.cityEn;
            const neighborhood = lang === 'es' ? apt.neighborhood : apt.neighborhoodEn;
            const highlightReview = apt.reviews && apt.highlightReviewIndex !== undefined
              ? apt.reviews[apt.highlightReviewIndex]
              : undefined;

            if (apt.isComingSoon) {
              return (
                <div key={apt.id} className="rounded-2xl overflow-hidden bg-white border border-dashed border-gray-200 opacity-75">
                  <div className="aspect-[4/3] bg-gradient-to-br from-[#ede9f8] to-[#d8d1f0] flex flex-col items-center justify-center gap-2">
                    <span className="text-3xl">📸</span>
                    <span className="text-sm text-[#7c6faa] font-medium">Fotos próximamente</span>
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#D4A843]" />
                      <span className="text-[#D4A843] text-xs font-semibold uppercase tracking-wider">{neighborhood} · {city}</span>
                    </div>
                    <h3 className="text-lg font-serif font-bold text-[#2D1B69] mb-2">{name}</h3>
                    <p className="text-gray-400 text-sm italic mb-4">Información completa muy pronto</p>
                    <div className="flex gap-2">
                      <div className="flex-1 bg-gray-100 text-gray-400 text-sm font-semibold text-center py-2.5 rounded-xl">Próximamente</div>
                      <button
                        onClick={e => handleReserve(e, name, city)}
                        className="bg-[#25D366] hover:bg-[#1ebe5d] text-white px-3 py-2.5 rounded-xl transition-colors"
                        aria-label="WhatsApp"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                      </button>
                    </div>
                  </div>
                </div>
              );
            }

            return (
              <div
                key={apt.id}
                onClick={() => apt.slug && navigate(`/propiedades/${apt.slug}`)}
                className="group rounded-2xl overflow-hidden bg-white border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
              >
                <div className="relative">
                  <ImageCarousel images={apt.images} name={name} />
                  {/* Cabin tag */}
                  {apt.tag === 'beach cabin' && (
                    <div className="absolute top-3 left-3 bg-[#2D1B69]/85 backdrop-blur-sm text-white text-xs font-semibold px-2.5 py-1 rounded-full">🌊 Cabaña de playa</div>
                  )}
                  {/* Rating badge */}
                  {apt.scores && !apt.tag && (
                    <div className="absolute top-3 left-3 flex items-center gap-1 bg-[#2D1B69]/85 backdrop-blur-sm rounded-full px-2.5 py-1.5">
                      <Star className="w-3 h-3 fill-[#D4A843] text-[#D4A843]" />
                      <span className="text-white font-semibold text-xs">{apt.scores.overall}</span>
                      <span className="text-white/60 text-xs">({apt.scores.totalReviews})</span>
                    </div>
                  )}
                  {/* Price badge */}
                  <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm rounded-full px-3 py-1.5 shadow-md">
                    {apt.priceFrom > 0
                      ? <span className="text-[#2D1B69] font-bold text-sm">Desde ${apt.priceFrom}<span className="text-gray-400 font-normal text-xs">/noche</span></span>
                      : <span className="text-[#2D1B69] font-bold text-sm">Consultar</span>
                    }
                  </div>
                </div>

                <div className="p-5">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#D4A843]" />
                    <span className="text-[#D4A843] text-xs font-semibold uppercase tracking-wider">{neighborhood} · {city}</span>
                  </div>
                  <h3 className="text-lg font-serif font-bold text-[#2D1B69] mb-2 leading-snug">{name}</h3>

                  {/* Review quote */}
                  {highlightReview && highlightReview.comment && (
                    <div className="border-l-2 border-[#D4A843] pl-3 mb-3 bg-[#faf9ff] rounded-r-lg py-2 pr-2">
                      <p className="text-gray-500 text-xs italic leading-relaxed line-clamp-2">"{highlightReview.comment}"</p>
                      <p className="text-gray-400 text-xs mt-1">{highlightReview.name} · Booking.com ✓</p>
                    </div>
                  )}

                  {/* Specs */}
                  <div className="flex items-center gap-4 text-gray-400 text-xs mb-4 pb-4 border-b border-gray-100">
                    <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" />{apt.guests} {t('apartments.guests')}</span>
                    <span className="flex items-center gap-1"><BedDouble className="w-3.5 h-3.5" />{apt.rooms} {t('apartments.rooms')}</span>
                    <span className="flex items-center gap-1"><Bath className="w-3.5 h-3.5" />{apt.bathrooms} {t('apartments.bathrooms')}</span>
                  </div>

                  {/* CTAs */}
                  <div className="flex gap-2">
                    <Button
                      onClick={e => { e.stopPropagation(); apt.slug && navigate(`/propiedades/${apt.slug}`); }}
                      className="flex-1 bg-[#2D1B69] hover:bg-[#3D1F5C] text-white font-semibold rounded-xl h-11 text-sm transition-all duration-300"
                    >
                      Ver detalles →
                    </Button>
                    <button
                      onClick={e => handleReserve(e, name, city)}
                      className="bg-[#25D366] hover:bg-[#1ebe5d] text-white px-3 rounded-xl transition-colors h-11"
                      aria-label="WhatsApp"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer count */}
        <p className="text-center text-[#7c6faa] text-sm mt-8">
          Mostrando {filtered.length} de 27 propiedades
        </p>
      </div>
    </section>
  );
};

export default ApartmentCard;
```

- [ ] **Step 2: Check dev server for errors**

```bash
# Check browser console at http://localhost:8080 — should be no errors
# Cards should show city tiles, filter pills, and property cards with review quotes
```

- [ ] **Step 3: Commit**

```bash
git add src/components/ApartmentCard.tsx
git commit -m "feat: rewrite ApartmentCard with city-first layout, filters, and enhanced cards"
```

---

## Task 4: Create PropertyDetail page

**Files:**
- Create: `src/pages/PropertyDetail.tsx`

- [ ] **Step 1: Create `src/pages/PropertyDetail.tsx`**

```tsx
// src/pages/PropertyDetail.tsx
import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { apartments } from '@/data/apartments';
import { countryFlag } from '@/lib/flags';
import { Users, BedDouble, Bath, MapPin, ChevronLeft, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

const AMENITY_ICONS: Record<string, string> = {
  wifi: '📶', pool: '🏊', oceanView: '🌊', beach: '🏖', kitchen: '🍳',
  ac: '❄️', parking: '🚗', balcony: '🌅', streaming: '📺', pets: '🐾',
  elevator: '🛗', bbq: '🔥', gym: '💪', washer: '👕', security: '🔒',
  starlink: '🛰', 'Vista parcial al mar': '🌊', 'Vista al mar': '🌊',
  'WiFi gratis': '📶', 'Aire acondicionado': '❄️', 'Parking privado gratis': '🚗',
  'Netflix': '📺', 'Mascotas permitidas': '🐾', 'Ascensor': '🛗',
  'Cocina equipada': '🍳', 'Balcón': '🌅', 'BBQ': '🔥',
};

const getIcon = (amenity: string) => AMENITY_ICONS[amenity] ?? '✓';

const ScoreChip = ({ label, value }: { label: string; value?: number }) =>
  value ? (
    <div className="flex items-center gap-1.5 bg-white border border-gray-100 rounded-lg px-3 py-1.5 shadow-sm">
      <span className="text-xs text-gray-500">{label}</span>
      <span className="text-sm font-bold text-[#2D1B69]">{value}</span>
    </div>
  ) : null;

const PropertyDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [showAllReviews, setShowAllReviews] = useState(false);

  const apt = apartments.find(a => a.slug === slug);

  if (!apt) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f7ff]">
        <div className="text-center">
          <p className="text-[#2D1B69] text-xl font-serif mb-4">Propiedad no encontrada</p>
          <Button onClick={() => navigate('/')} className="bg-[#2D1B69] text-white rounded-full px-6">← Volver al inicio</Button>
        </div>
      </div>
    );
  }

  const name = apt.name;
  const city = apt.city;
  const waMsg = encodeURIComponent(`Hola 77Rentals, me interesa reservar "${name}" en ${city}. ¿Está disponible?`);
  const waUrl = `https://wa.me/573046736241?text=${waMsg}`;

  const reviews = apt.reviews ?? [];
  const visibleReviews = showAllReviews ? reviews : reviews.slice(0, 5);

  // Cross-sell: same building
  const sameBuilding = apt.buildingName
    ? apartments.filter(a => a.buildingName === apt.buildingName && a.id !== apt.id)
    : [];

  // All amenities for grid
  const allAmenities: string[] = apt.amenitiesDetail
    ? Object.values(apt.amenitiesDetail).flat()
    : apt.amenities;

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="sticky top-0 z-40 bg-[#2D1B69]/98 backdrop-blur-sm shadow-lg">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="text-[#D4A843] font-serif font-bold text-lg">77 Rentals</Link>
          <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-white/70 hover:text-white text-sm transition-colors">
            <ChevronLeft className="w-4 h-4" />
            Volver
          </button>
        </div>
      </nav>

      {/* Hero image */}
      <div className="relative h-72 md:h-96 overflow-hidden">
        <img src={apt.images[0]} alt={name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/40" />
        {apt.stars && (
          <div className="absolute top-4 left-4 bg-[#D4A843] text-[#2D1B69] text-xs font-bold px-3 py-1 rounded-full">
            {'⭐'.repeat(apt.stars)} {apt.stars} estrellas
          </div>
        )}
        <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-black/50 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full">
          <MapPin className="w-3 h-3 text-[#D4A843]" />
          {apt.neighborhood} · {apt.city}
        </div>
        {/* Image strip */}
        {apt.images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
            {apt.images.slice(1, 4).map((src, i) => (
              <img key={i} src={src} alt="" className="w-16 h-12 object-cover rounded-lg border-2 border-white/60 opacity-80 hover:opacity-100 transition-opacity cursor-pointer" />
            ))}
          </div>
        )}
      </div>

      {/* Main content */}
      <div className="container mx-auto px-4 max-w-5xl py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">

          {/* ── LEFT COLUMN ─────────────────────────── */}
          <div className="space-y-8">

            {/* Title block */}
            <div>
              {apt.buildingName && (
                <p className="text-[#D4A843] text-xs font-bold uppercase tracking-widest mb-1">{apt.buildingName}</p>
              )}
              <h1 className="text-2xl md:text-3xl font-serif font-bold text-[#2D1B69] mb-3">{name}</h1>
              <div className="flex flex-wrap gap-4 text-gray-500 text-sm">
                <span className="flex items-center gap-1"><Users className="w-4 h-4 text-[#D4A843]" />{apt.guests} huéspedes</span>
                <span className="flex items-center gap-1"><BedDouble className="w-4 h-4 text-[#D4A843]" />{apt.rooms} habitación{apt.rooms > 1 ? 'es' : ''}</span>
                <span className="flex items-center gap-1"><Bath className="w-4 h-4 text-[#D4A843]" />{apt.bathrooms} baño{apt.bathrooms > 1 ? 's' : ''}</span>
                {apt.sizeM2 && <span>📐 {apt.sizeM2} m²</span>}
                {apt.floor && <span>🏢 Piso {apt.floor}</span>}
              </div>
              {apt.bedConfiguration && (
                <p className="text-gray-400 text-sm mt-2">🛏 {apt.bedConfiguration}</p>
              )}
            </div>

            {/* Score bar */}
            {apt.scores && (
              <div className="bg-[#f0edf8] rounded-2xl p-4">
                <div className="flex items-center gap-4 mb-3">
                  <div className="bg-[#2D1B69] text-white rounded-xl px-4 py-2 text-center min-w-[64px]">
                    <div className="text-2xl font-bold leading-none">{apt.scores.overall}</div>
                    <div className="text-xs opacity-70 mt-0.5">/ 10</div>
                  </div>
                  <div>
                    <div className="font-bold text-[#2D1B69] text-lg">{apt.scores.label}</div>
                    <div className="text-gray-500 text-sm">{apt.scores.totalReviews} reseñas verificadas en Booking.com</div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <ScoreChip label="Personal" value={apt.scores.staff} />
                  <ScoreChip label="Limpieza" value={apt.scores.cleanliness} />
                  <ScoreChip label="Comodidad" value={apt.scores.comfort} />
                  <ScoreChip label="Ubicación" value={apt.scores.location} />
                  <ScoreChip label="Calidad-precio" value={apt.scores.value} />
                  <ScoreChip label="WiFi" value={apt.scores.wifi} />
                </div>
              </div>
            )}

            {/* Description */}
            <div>
              <h2 className="text-lg font-serif font-bold text-[#2D1B69] mb-3">Sobre este alojamiento</h2>
              <p className="text-gray-600 leading-relaxed">
                {apt.descriptionLong ?? apt.description}
              </p>
              {apt.neighborhoodDesc && (
                <div className="mt-4 p-4 bg-[#faf9ff] rounded-xl border border-[#e8e4f5]">
                  <p className="text-sm text-gray-500 font-medium mb-1">📍 Sobre el barrio</p>
                  <p className="text-gray-600 text-sm leading-relaxed">{apt.neighborhoodDesc}</p>
                </div>
              )}
            </div>

            {/* Amenities */}
            <div>
              <h2 className="text-lg font-serif font-bold text-[#2D1B69] mb-3">Comodidades</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {allAmenities.slice(0, 18).map((a, i) => (
                  <div key={i} className="flex items-center gap-2 bg-[#f8f7ff] rounded-lg px-3 py-2 text-sm text-gray-600">
                    <span>{getIcon(a)}</span>
                    <span className="truncate">{a}</span>
                  </div>
                ))}
              </div>
              {allAmenities.length > 18 && (
                <p className="text-[#7c6faa] text-sm mt-2">+ {allAmenities.length - 18} comodidades más</p>
              )}
            </div>

            {/* Reviews */}
            <div>
              <h2 className="text-lg font-serif font-bold text-[#2D1B69] mb-1">Reseñas de huéspedes</h2>
              <p className="text-gray-400 text-xs mb-4 flex items-center gap-1">
                <span className="bg-[#003580] text-white text-xs px-1.5 py-0.5 rounded font-bold">booking</span>
                Reseñas verificadas de Booking.com
              </p>

              {apt.isNewListing || reviews.length === 0 ? (
                <div className="bg-[#f8f7ff] rounded-2xl p-6 text-center border border-dashed border-[#d8d1f0]">
                  <p className="text-2xl mb-2">🌟</p>
                  <p className="font-serif text-[#2D1B69] font-semibold mb-1">¡Nueva propiedad!</p>
                  <p className="text-gray-500 text-sm">Sé el primero en dejar una reseña.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {visibleReviews.filter(r => r.comment).map((review, i) => (
                    <div key={i} className="bg-[#faf9ff] rounded-xl p-4 border border-[#e8e4f5]">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-9 h-9 rounded-full bg-[#2D1B69] text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                            {review.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-semibold text-[#2D1B69] text-sm">{review.name} {countryFlag(review.country)}</p>
                            <p className="text-gray-400 text-xs">
                              {[review.stayType, review.nights ? `${review.nights} noches` : null, review.date].filter(Boolean).join(' · ')}
                            </p>
                          </div>
                        </div>
                        <div className="bg-[#2D1B69] text-white text-xs font-bold px-2 py-1 rounded-lg flex-shrink-0">
                          {review.rating}/10
                        </div>
                      </div>
                      {review.title && <p className="font-semibold text-[#2D1B69] text-sm mb-1">{review.title}</p>}
                      <p className="text-gray-600 text-sm leading-relaxed">{review.comment}</p>
                      {review.hostResponse && (
                        <div className="mt-3 pl-3 border-l-2 border-[#D4A843] bg-white rounded-r-lg p-2">
                          <p className="text-xs text-[#D4A843] font-semibold mb-0.5">Respuesta del anfitrión:</p>
                          <p className="text-gray-500 text-xs">{review.hostResponse}</p>
                        </div>
                      )}
                    </div>
                  ))}
                  {reviews.filter(r => r.comment).length > 5 && (
                    <button
                      onClick={() => setShowAllReviews(!showAllReviews)}
                      className="flex items-center gap-1.5 text-[#2D1B69] text-sm font-medium hover:underline"
                    >
                      {showAllReviews ? <><ChevronUp className="w-4 h-4" /> Mostrar menos</> : <><ChevronDown className="w-4 h-4" /> Ver {reviews.filter(r => r.comment).length - 5} reseñas más</>}
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* House rules */}
            {apt.houseRules && (
              <div>
                <h2 className="text-lg font-serif font-bold text-[#2D1B69] mb-3">Normas de la casa</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { label: 'Check-in', value: apt.houseRules.checkIn, icon: '🕐' },
                    { label: 'Check-out', value: apt.houseRules.checkOut, icon: '🕐' },
                    { label: 'Mascotas', value: apt.houseRules.pets, icon: '🐾' },
                    { label: 'Fumar', value: apt.houseRules.smoking, icon: '🚭' },
                    { label: 'Fiestas', value: apt.houseRules.parties, icon: '🎉' },
                    { label: 'Niños', value: apt.houseRules.children, icon: '👶' },
                  ].filter(r => r.value).map(rule => (
                    <div key={rule.label} className="flex items-start gap-2 bg-[#f8f7ff] rounded-lg px-3 py-2.5">
                      <span className="text-base">{rule.icon}</span>
                      <div>
                        <p className="text-xs text-gray-400 font-medium">{rule.label}</p>
                        <p className="text-sm text-gray-700">{rule.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
                {apt.houseRules.specialNote && (
                  <p className="text-gray-400 text-xs mt-2 italic">ℹ️ {apt.houseRules.specialNote}</p>
                )}
              </div>
            )}

            {/* Location */}
            {apt.locationDetail && (
              <div>
                <h2 className="text-lg font-serif font-bold text-[#2D1B69] mb-3">Ubicación</h2>
                <div className="bg-[#e8e4f5] rounded-xl p-3 mb-3 flex items-center justify-center h-24 text-[#7c6faa] text-sm">
                  <a
                    href={`https://www.google.com/maps/search/${encodeURIComponent(apt.locationDetail.address ?? `${apt.neighborhood}, ${apt.city}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 hover:text-[#2D1B69] transition-colors"
                  >
                    🗺 Ver en Google Maps <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {apt.locationDetail.beaches && apt.locationDetail.beaches.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-[#2D1B69] uppercase tracking-wide mb-2">🏖 Playas</p>
                      {apt.locationDetail.beaches.map(p => (
                        <p key={p.name} className="text-sm text-gray-600 mb-1"><span className="font-medium">{p.name}</span> — {p.distance}</p>
                      ))}
                    </div>
                  )}
                  {apt.locationDetail.attractions && apt.locationDetail.attractions.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-[#2D1B69] uppercase tracking-wide mb-2">🗺 Atracciones</p>
                      {apt.locationDetail.attractions.map(p => (
                        <p key={p.name} className="text-sm text-gray-600 mb-1"><span className="font-medium">{p.name}</span> — {p.distance}</p>
                      ))}
                    </div>
                  )}
                  {apt.locationDetail.restaurants && apt.locationDetail.restaurants.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-[#2D1B69] uppercase tracking-wide mb-2">🍽 Restaurantes</p>
                      {apt.locationDetail.restaurants.map(p => (
                        <p key={p.name} className="text-sm text-gray-600 mb-1"><span className="font-medium">{p.name}</span> — {p.distance}</p>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex flex-wrap gap-3 mt-3 text-sm text-gray-500">
                  {apt.locationDetail.distanceToCenter && <span>🏙 Centro: {apt.locationDetail.distanceToCenter}</span>}
                  {apt.locationDetail.distanceToAirport && <span>✈️ {apt.locationDetail.distanceToAirport}</span>}
                </div>
                {apt.locationDetail.accessNote && (
                  <p className="text-gray-400 text-xs mt-2 italic">ℹ️ {apt.locationDetail.accessNote}</p>
                )}
              </div>
            )}

            {/* Same building cross-sell */}
            {sameBuilding.length > 0 && (
              <div>
                <h2 className="text-lg font-serif font-bold text-[#2D1B69] mb-3">También en {apt.buildingName}</h2>
                <div className="flex gap-3 flex-wrap">
                  {sameBuilding.map(sibling => (
                    <Link
                      key={sibling.id}
                      to={`/propiedades/${sibling.slug}`}
                      className="flex items-center gap-3 bg-[#f8f7ff] border border-[#e8e4f5] rounded-xl p-3 hover:border-[#2D1B69]/30 transition-colors"
                    >
                      <img src={sibling.images[0]} alt={sibling.name} className="w-14 h-14 object-cover rounded-lg" />
                      <div>
                        <p className="font-serif font-bold text-[#2D1B69] text-sm">{sibling.name}</p>
                        <p className="text-gray-400 text-xs">${sibling.priceFrom}/noche</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* ── RIGHT COLUMN — Booking sidebar ──────── */}
          <div className="lg:block">
            <div className="bg-[#2D1B69] rounded-2xl p-6 sticky top-20 shadow-xl">
              {/* Price */}
              <p className="text-[#D4A843] text-xs font-bold uppercase tracking-widest mb-1">Desde</p>
              {apt.priceFrom > 0 ? (
                <>
                  <p className="text-white font-serif text-3xl font-bold leading-none mb-0.5">
                    ${apt.priceFrom} <span className="text-base font-normal opacity-60">/ noche</span>
                  </p>
                  {apt.priceFromCOP && (
                    <p className="text-white/50 text-xs mb-4">COP {apt.priceFromCOP.toLocaleString('es-CO')} / noche</p>
                  )}
                </>
              ) : (
                <p className="text-white font-serif text-xl font-bold mb-4">Consultar disponibilidad</p>
              )}

              {/* Check-in/out */}
              {apt.houseRules && (
                <div className="bg-white/10 rounded-xl p-3 mb-4 text-white text-sm">
                  <div className="flex justify-between">
                    <div>
                      <p className="text-white/50 text-xs">Check-in</p>
                      <p className="font-medium">{apt.houseRules.checkIn.split('–')[0].trim()}</p>
                    </div>
                    <div className="w-px bg-white/20" />
                    <div className="text-right">
                      <p className="text-white/50 text-xs">Check-out</p>
                      <p className="font-medium">{apt.houseRules.checkOut.split('–').pop()?.trim()}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* CTAs */}
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full bg-[#25D366] hover:bg-[#1ebe5d] text-white font-bold py-3 rounded-full mb-3 transition-colors text-sm"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                Reservar por WhatsApp
              </a>
              {apt.bookingUrl && (
                <a
                  href={apt.bookingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 w-full border border-white/25 text-white/80 hover:bg-white/10 py-2.5 rounded-full text-sm transition-colors"
                >
                  Ver en Booking.com <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}

              {/* Quick rules */}
              <div className="mt-4 pt-4 border-t border-white/15 space-y-2 text-white/60 text-xs">
                {apt.houseRules?.pets && <div className="flex items-center gap-1.5">🐾 {apt.houseRules.pets}</div>}
                {apt.houseRules?.smoking && <div className="flex items-center gap-1.5">🚭 {apt.houseRules.smoking}</div>}
                {apt.licenseNumber && <div className="flex items-center gap-1.5">📋 Lic. {apt.licenseNumber}</div>}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile sticky bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3 flex items-center gap-3 z-40">
        <div className="flex-1">
          {apt.priceFrom > 0
            ? <p className="font-bold text-[#2D1B69]">Desde ${apt.priceFrom}<span className="text-gray-400 font-normal text-sm">/noche</span></p>
            : <p className="font-bold text-[#2D1B69]">Consultar precio</p>
          }
        </div>
        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 bg-[#25D366] text-white font-bold px-5 py-2.5 rounded-full text-sm"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
          Reservar
        </a>
      </div>
    </div>
  );
};

export default PropertyDetail;
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/PropertyDetail.tsx
git commit -m "feat: add PropertyDetail page with full info, reviews, location and booking sidebar"
```

---

## Task 5: Register route in App.tsx

**Files:**
- Modify: `src/App.tsx`

- [ ] **Step 1: Update `src/App.tsx`**

```tsx
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/contexts/LanguageContext";
import MagicCursor from "@/components/MagicCursor";
import Index from "./pages/Index.tsx";
import Gracias from "./pages/Gracias.tsx";
import PropertyDetail from "./pages/PropertyDetail.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <TooltipProvider>
        <MagicCursor />
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/gracias" element={<Gracias />} />
            <Route path="/propiedades/:slug" element={<PropertyDetail />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
```

- [ ] **Step 2: Verify build passes**

```bash
npm run build 2>&1 | tail -10
```
Expected: `✓ built in` with no TypeScript or import errors.

- [ ] **Step 3: Verify routes work**

Open browser at `http://localhost:8080`:
- `/` — home page with new city-first properties section
- `/propiedades/macondo-77rentals` — full Macondo detail page
- `/propiedades/fragata-style` — Fragata Style detail page
- `/propiedades/perla-suite` — Perla Suite detail page
- `/propiedades/boho-1108` — Boho 1108 detail page
- `/propiedades/cabana-salinas` — Cabaña with "new listing" reviews placeholder

- [ ] **Step 4: Final commit**

```bash
git add src/App.tsx
git commit -m "feat: register /propiedades/:slug route — properties redesign complete"
```

---

## Self-Review

**Spec coverage:**
- ✅ Extended interface with all new types (PropertyReview, PropertyScores, etc.)
- ✅ All 5 properties fully populated: Macondo, Fragata Style, Boho 1108, Perla Suite, Cabaña Salinas
- ✅ VillaBaru: `isComingSoon: true` — coming soon card with WhatsApp still active
- ✅ City-first layout: Santa Marta featured, Cartagena + Medellín stacked
- ✅ Filter pills with live city counts
- ✅ Cards: review quote + "Ver detalles" + WhatsApp button
- ✅ Beach cabin tag on Cabaña Salinas
- ✅ "Consultar precio" when priceFrom = 0
- ✅ PropertyDetail: hero, score bar, description, amenities, reviews (expand/collapse), house rules, location, cross-sell same building
- ✅ Mobile sticky CTA bar
- ✅ Host response shown on Carlos review (Perla Suite)
- ✅ New listing placeholder for Cabaña Salinas
- ✅ Edificio DelVentto cross-sell between Macondo + Perla Suite
- ✅ `flags.ts` utility covering all review countries (CO, PE, PL, GB, US, CL, PA)
- ✅ `/propiedades/:slug` route registered in App.tsx

**Placeholder scan:** None found — all code complete.

**Type consistency:** `slug`, `scores`, `reviews`, `houseRules`, `locationDetail`, `amenitiesDetail`, `highlightReviewIndex`, `isComingSoon`, `isNewListing` used consistently across Tasks 1, 3, 4.
