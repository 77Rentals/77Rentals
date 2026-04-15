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
  showMorePhotosComingSoon?: boolean;
  whatsappContactMessage?: string;
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
    nameBooking: 'Villa Puerta - Luxury Whitesand Beach Villa in Baru',
    city: 'Cartagena',
    cityEn: 'Cartagena',
    neighborhood: 'Baru',
    neighborhoodEn: 'Baru',
    description: 'Villa de lujo de 4 habitaciones con acceso directo a la playa. Perfecta para familias o grupos que buscan privacidad absoluta con comodidad y diseño premium en Baru.',
    descriptionEn: 'Luxury 4-bedroom beachfront villa with direct beach access. Perfect for families or groups seeking absolute privacy with comfort and premium design in Baru.',
    descriptionLong: 'Bienvenido a tu retiro perfecto de vacaciones en familia. Nuestra espaciosa casa de playa de 4 habitaciones en hermoso Baru, Colombia, está a solo unos pasos de las playas vírgenes del Caribe. Ideal para familias o grupos que buscan relajarse, esta tranquila casa ofrece la combinación perfecta de comodidad, conveniencia y belleza natural impresionante.\n\nRecámara Principal: 1 cama king *Opcional 1 cama twin con baño privado y vistas impresionantes al océano.\nRecámara 2: 2 camas queen con una vista pacífica al jardín.\nRecámara 3: 2 camas queen, perfecta para niños o amigos.\nRecámara 4: 1 cama queen con un ambiente relajante.\n\nTodas las recámaras están climatizadas y amuebladas con ropa de cama de alta calidad para garantizar un descanso reconfortante.\n\nVida al Aire Libre: Sal a nuestra amplia terraza y jardín, donde puedes disfrutar del café matutino con vistas al océano o cenar al aire libre bajo las estrellas. Disfruta del teatro del hogar al aire libre para películas bajo las estrellas. El patio privado da acceso directo a la playa, para que estés en la arena en segundos. La casa está equipada con sillas de playa, sombrillas y juguetes.',
    guests: 12,
    rooms: 4,
    bathrooms: 6,
    beds: 6,
    priceFrom: 750,
    priceFromCOP: 2950000,
    rating: 4.5,
    reviewCount: 10,
    images: [
      '/images/villabaru/1.jpg',
      '/images/villabaru/2.jpg',
      '/images/villabaru/3.jpg',
      '/images/villabaru/4.jpg',
      '/images/villabaru/5.jpg',
      '/images/villabaru/6.jpg',
      '/images/villabaru/7.jpg',
      '/images/villabaru/8.jpg',
    ],
    amenities: ['beach', 'oceanView', 'wifi', 'kitchen', 'ac', 'parking', 'streaming', 'pets', 'pool'],
    amenitiesDetail: {
      kitchen: ['Cocina equipada', 'Mesa de comedor', 'Cafetera', 'Tostadora', 'Utensilios de cocina', 'Nevera', 'Lavavajillas'],
      bathroom: ['Papel higiénico', 'Toallas', 'Duchas', 'Artículos de aseo gratis'],
      bedroom: ['Ropa de cama de alta calidad', 'Armario', 'Ventilador'],
      outdoor: ['Área de playa apta para niños', 'Aguas poco profundas ideales para nadar', 'Sillas de playa', 'Sombrillas', 'Juguetes de playa', 'Teatro de cine al aire libre'],
      general: ['WiFi gratis', 'Aire acondicionado', 'Estacionamiento', 'Acceso directo a la playa', 'Terraza y jardín amplios', 'Vistas al océano'],
    },
    reviews: [
      {
        name: 'Luis Ernesto Mario',
        country: 'MX',
        rating: 5,
        comment: 'Excelente lugar para pasar tiempo con familia. Dinah, Germán y Milena muy atentos y amables. La casa es hermosa, limpia y perfecta para grupos. Recomendado 100%.',
        stayType: 'Grupo',
      },
      {
        name: 'Juliana',
        country: 'MX',
        rating: 5,
        comment: 'Hotel fantástico muy bonito, very comfortable, clean, and perfect for a family getaway. Very close to the private beach. The views are stunning and the staff is amazing.',
        stayType: 'Familia',
      },
      {
        name: 'Carlos M.',
        country: 'CO',
        rating: 5,
        comment: 'Alojamiento de 10 estrellas. La ubicación es privilegiada, el acceso a la playa es directo y los detalles de la casa son impecables. Todo el equipo fue muy responsable.',
        stayType: 'Familia',
      },
      {
        name: 'Bernarda',
        country: 'MX',
        rating: 5,
        comment: 'The place is so pretty, close to the private beach, and absolutely stunning. Everything is well-maintained and the team is very responsive. Perfect for a family vacation!',
        stayType: 'Familia',
      },
    ],
    featured: true,
    isComingSoon: false,
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
    descriptionLongEn: "Our accommodation stands out for its nautical style, carefully designed to convey a sense of warmth and comfort from the very first moment. Every detail has been thoughtfully considered to make guests feel at home—from the cozy décor to the high-quality mattresses that ensure a restful night's sleep. The combination of comfort, tranquility, and a relaxed atmosphere creates a truly unique experience.",
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
      '/images/fragata-style/1.jpg',
      '/images/fragata-style/2.jpg',
      '/images/fragata-style/3.jpg',
      '/images/fragata-style/4.jpg',
      '/images/fragata-style/5.jpg',
      '/images/fragata-style/6.jpg',
      '/images/fragata-style/7.jpg',
      '/images/fragata-style/8.jpg',
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
      '/images/boho-1108/1.jpg',
      '/images/boho-1108/2.jpg',
      '/images/boho-1108/3.jpg',
      '/images/boho-1108/4.jpg',
      '/images/boho-1108/5.jpg',
      '/images/boho-1108/6.jpg',
      '/images/boho-1108/7.jpg',
      '/images/boho-1108/8.jpg',
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
    buildingName: 'Edificio DelVentto',
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
      '/images/macondo-77rentals/1.jpg',
      '/images/macondo-77rentals/2.jpg',
      '/images/macondo-77rentals/3.jpg',
      '/images/macondo-77rentals/4.jpg',
      '/images/macondo-77rentals/5.jpg',
      '/images/macondo-77rentals/6.jpg',
      '/images/macondo-77rentals/7.jpg',
      '/images/macondo-77rentals/8.jpg',
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
      { name: 'Camilo', country: 'GB', rating: 10, title: 'We had such a fantastic time, we loved It!', comment: "The flat was spotless and very well-maintained, which is something that's really important to us when we travel. We flew all the way from the UK and found Colombia and Santa Marta to be an amazing city! A huge thank you to Claudia and Juan Sebastian.", stayType: 'Solo', nights: 1, date: 'Agosto 2025' },
      { name: 'Santiago', country: 'US', rating: 10, title: 'The best place to stay in Santa Marta', comment: "The place was beautiful, clean, and well-located. The hosts' hospitality was outstanding — I really enjoyed the experience. I would have loved to have even more days to enjoy this amazing place.", stayType: 'Solo', nights: 1, date: 'Julio 2025' },
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
      '/images/perla-suite/placeholder.jpg',
    ],
    showMorePhotosComingSoon: true,
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
    reviewCount: 0,
    propertyType: 'cabin',
    tag: 'beach cabin',
    views: ['Vista al mar', 'Vista a la montaña'],
    bedConfiguration: '1 cama queen (hab 1) + 2 camas dobles (hab 2) + 1 sofá cama + 2 mezanines',
    hostName: 'Judith',
    isNewListing: true,
    showMorePhotosComingSoon: true,
    images: [
      '/images/cabana-salinas/placeholder.avif',
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
    reviews: [],
  },

  // ─────────────────────────────────────────
  // 7. Coming Soon - Full Portfolio Available
  // ─────────────────────────────────────────
  {
    id: 'coming-soon',
    slug: 'coming-soon',
    name: 'Más Propiedades Próximamente',
    nameEn: 'More Properties Coming Soon',
    city: 'Colombia',
    cityEn: 'Colombia',
    neighborhood: 'Cartagena, Santa Marta & más',
    neighborhoodEn: 'Cartagena, Santa Marta & more',
    description: 'Estamos expandiendo nuestro portafolio. Contáctanos por WhatsApp para ver nuestras propiedades completas y opciones personalizadas.',
    descriptionEn: 'We are expanding our portfolio. Contact us via WhatsApp to see our full properties and personalized options.',
    guests: 0,
    rooms: 0,
    bathrooms: 0,
    priceFrom: 0,
    images: [
      'https://images.unsplash.com/photo-1551874645-70f2baaade4d?w=800&q=80',
    ],
    amenities: [],
    isComingSoon: true,
    whatsappContactMessage: 'Hola 77Rentals! Me gustaría ver el portafolio completo de propiedades disponibles.',
  },
];
