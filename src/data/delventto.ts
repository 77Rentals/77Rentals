// Content for the Edificio Delventto landing page (/delventto/, /en/delventto/).
// The page is prerendered (see src/entry-server.tsx), so everything here ends up
// in the static HTML that search engines read. Keep claims to verified facts:
// building details come from the developer's spec sheet and our welcome guides
// (Macondo 717, Apartasuite 613T2); Macondo's score is its Booking.com rating.

export type Lang = 'es' | 'en';

export const delventtoPath = (lang: Lang) => `${lang === 'en' ? '/en' : ''}/delventto/`;

export const DELVENTTO_GEO = { lat: 11.1752557, lng: -74.2335392 };

export const DELVENTTO_ADDRESS = {
  street: 'Carrera 4C #70-75',
  neighborhood: 'Pozos Colorados',
  city: 'Santa Marta',
  region: 'Magdalena',
  postalCode: '470001',
  country: 'CO',
};

export const MACONDO = {
  slug: 'macondo-77rentals',
  guests: 4,
  sizeM2: 40,
  score: 10,
  reviewCount: 11,
  priceFromUSD: 75,
  bookingUrl: 'https://www.booking.com/hotel/co/77-rentals-717-vela-mare.es.html',
};

const WHATSAPP_NUMBER = '573046736241';
export const whatsappUrl = (message: string) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

export type AmenityIcon =
  | 'pool' | 'infinity' | 'kids' | 'indoor' | 'jacuzzi' | 'sauna' | 'gym' | 'squash'
  | 'coworking' | 'bbq' | 'rooftop' | 'security' | 'wifi' | 'parking' | 'reception';

type AltKey =
  | 'infinityPool' | 'facade' | 'jacuzzi' | 'indoorPool' | 'mainPool' | 'gym' | 'lobby'
  | 'bbq' | 'rooftopTerrace' | 'socialArea' | 'sauna'
  | 'macondoBalcony' | 'macondoBedroom' | 'macondoLiving';

export const delventtoGallery: { src: string; alt: AltKey; width: number; height: number }[] = [
  { src: '/images/delventto/rooftop-terrace.jpg', alt: 'rooftopTerrace', width: 1600, height: 1073 },
  { src: '/images/delventto/main-pool.jpg', alt: 'mainPool', width: 1600, height: 1200 },
  { src: '/images/delventto/rooftop-pool.jpg', alt: 'indoorPool', width: 1600, height: 1067 },
  { src: '/images/delventto/gym.jpg', alt: 'gym', width: 1600, height: 1067 },
  { src: '/images/delventto/bbq.jpg', alt: 'bbq', width: 1600, height: 1222 },
  { src: '/images/delventto/lobby.jpg', alt: 'lobby', width: 1600, height: 1067 },
  { src: '/images/delventto/social-area.jpg', alt: 'socialArea', width: 1600, height: 1067 },
  { src: '/images/delventto/jacuzzi.jpg', alt: 'jacuzzi', width: 1600, height: 1067 },
  { src: '/images/delventto/sauna.jpg', alt: 'sauna', width: 1600, height: 1067 },
];

export interface DelventtoCopy {
  metaTitle: string;
  metaDescription: string;
  breadcrumb: { home: string };
  hero: {
    eyebrow: string;
    h1: string;
    subtitle: string;
    primaryCta: string;
    secondaryCta: string;
    facts: { label: string; value: string }[];
  };
  intro: { eyebrow: string; h2: string; paragraphs: string[] };
  featured: {
    eyebrow: string;
    h2: string;
    ratingLabel: string;
    pitch: string;
    highlights: string[];
    quote?: { text: string; author: string };
    primaryCta: string;
    secondaryCta: string;
    priceFrom: string;
    perNight: string;
  };
  units: { guests: string; bedroom: string; bathroom: string };
  options: {
    eyebrow: string;
    h2: string;
    intro: string;
    units: {
      id: 'tipo-c' | 'tipo-d';
      letter: string;
      label: string;
      name: string;
      tagline: string;
      guests: string;
      bedrooms: string;
      bathrooms: string;
      size: string;
      bullets: string[];
      cta: string;
      whatsapp: string;
    }[];
  };
  amenities: {
    eyebrow: string;
    h2: string;
    intro: string;
    items: { icon: AmenityIcon; label: string; description: string }[];
    braceletNote: string;
  };
  location: {
    eyebrow: string;
    h2: string;
    intro: string;
    address: string;
    mapTitle: string;
    places: { name: string; distance: string; description: string }[];
  };
  faq: { eyebrow: string; h2: string; items: { q: string; a: string }[] };
  finalCta: { h2: string; text: string; primaryCta: string; secondaryCta: string };
  alts: Record<AltKey, string>;
  whatsapp: { macondo: string; general: string };
}

export const delventtoContent: Record<Lang, DelventtoCopy> = {
  es: {
    metaTitle: 'Apartamentos en Delventto, Santa Marta | 77Rentals',
    metaDescription: 'Hospédate en Delventto, Pozos Colorados: a 200 m de Playa Cabo Tortuga, 4 piscinas y rooftop con vista al mar. Macondo, 10/10 en Booking. Reserva hoy.',
    breadcrumb: { home: 'Inicio' },
    hero: {
      eyebrow: 'Edificio Delventto · Pozos Colorados, Santa Marta',
      h1: 'Apartamentos en Delventto, Santa Marta',
      subtitle: 'A 200 metros de Playa Cabo Tortuga, con piscina infinita en la terraza y vista al mar y a la Sierra Nevada. Empieza por Macondo, nuestro apartamento 10/10, o escoge entre más de 20 opciones en el mismo edificio.',
      primaryCta: 'Reservar Macondo',
      secondaryCta: 'Ver más apartamentos',
      facts: [
        { label: 'A la playa', value: '200 m' },
        { label: 'Piscinas', value: '4' },
        { label: 'Del aeropuerto', value: '10–15 min' },
        { label: 'Macondo en Booking', value: '10/10' },
      ],
    },
    intro: {
      eyebrow: 'El edificio',
      h2: 'Delventto: tu base en Pozos Colorados, a pasos del mar',
      paragraphs: [
        'Delventto es un edificio nuevo de dos torres de 16 pisos en Pozos Colorados, en el sector de Cabo Tortuga, al sur de Santa Marta. Está a unos 200 metros de Playa Cabo Tortuga, a 10–15 minutos del aeropuerto Simón Bolívar y a unos 10 minutos en carro de El Rodadero. El edificio cuenta con licencia para alquiler turístico.',
        'Aquí tienes cuatro piscinas, entre ellas una infinita en el piso 16 con vista al mar y a la Sierra Nevada, además de jacuzzi, sauna, gimnasio, cancha de squash y coworking. Si buscas un apartamento con piscina en Santa Marta, cerca de la playa y con parqueadero gratis, en 77Rentals te ayudamos a escoger el que mejor se acomoda a tu plan, por noches o por días.',
      ],
    },
    featured: {
      eyebrow: 'Nuestra #1',
      h2: 'Macondo: el apartamento 10/10 de Delventto',
      ratingLabel: '«Excepcional» en Booking.com · 11 reseñas',
      pitch: 'Macondo es el apartamento 717 de la Torre 1, en el piso 7: 40 m² con balcón, vista parcial al mar y cocina completa. Los huéspedes le dan 10/10 en Booking.com en todas las categorías, desde limpieza hasta ubicación. Ideal para parejas y para familias pequeñas de hasta 4 personas.',
      highlights: [
        'Hasta 4 huéspedes: cama doble + sofá cama doble',
        'Balcón con vista parcial al mar',
        'Cocina equipada con cafetera, tostadora y lavaplatos',
        'Aire acondicionado, WiFi rápido y Netflix',
        'Parqueadero privado gratis',
        'Se admiten mascotas (puede aplicar un recargo)',
      ],
      quote: {
        text: 'El alojamiento es exactamente como se ve en las fotos.',
        author: 'Juan, Colombia · Booking.com',
      },
      primaryCta: 'Ver fotos y detalles',
      secondaryCta: 'Reservar por WhatsApp',
      priceFrom: 'Desde',
      perNight: 'por noche',
    },
    units: { guests: 'huéspedes', bedroom: 'habitación', bathroom: 'baño' },
    options: {
      eyebrow: 'Más opciones en Delventto',
      h2: '¿Vienen en grupo? Tenemos más de 20 apartamentos en el edificio',
      intro: 'Además de Macondo, en 77Rentals manejamos más de 20 apartamentos en Delventto. Cuéntanos tus fechas y cuántos son, y te mandamos por WhatsApp las opciones disponibles.',
      units: [
        {
          id: 'tipo-c',
          letter: 'C',
          label: 'Tipo C',
          name: 'Apartamento de 1 habitación',
          guests: 'Hasta 6',
          bedrooms: '1 habitación',
          bathrooms: '2 baños',
          size: '~66–70 m²',
          tagline: 'Amplio y cómodo para familias o grupos medianos.',
          bullets: [
            '66–70 m² con sala y balcón',
            '1 habitación, la mayoría con 2 camas dobles',
            '2 baños y cocina equipada',
            'Hasta ~6 huéspedes',
          ],
          cta: 'Consultar Tipo C por WhatsApp',
          whatsapp: 'Hola 77Rentals, me interesa un apartamento Tipo C (1 habitación) en Delventto, Santa Marta. Fechas: ___ al ___. Somos ___ personas. ¿Qué opciones tienen?',
        },
        {
          id: 'tipo-d',
          letter: 'D',
          label: 'Tipo D',
          name: 'Apartamento de 2 habitaciones',
          guests: 'Hasta 8',
          bedrooms: '2 habitaciones',
          bathrooms: '2 baños',
          size: '~84–90 m²',
          tagline: 'El más espacioso del edificio, con un baño por habitación.',
          bullets: [
            '84–90 m², la opción más grande',
            '2 habitaciones, normalmente 3 camas dobles',
            '2 baños independientes, uno por habitación',
            'Hasta 8 huéspedes',
          ],
          cta: 'Consultar Tipo D por WhatsApp',
          whatsapp: 'Hola 77Rentals, me interesa un apartamento Tipo D (2 habitaciones) en Delventto, Santa Marta. Fechas: ___ al ___. Somos ___ personas. ¿Qué opciones tienen?',
        },
      ],
    },
    amenities: {
      eyebrow: 'Amenidades',
      h2: 'Cuatro piscinas, rooftop y todo para descansar sin salir del edificio',
      intro: 'Con tu manilla tienes acceso a todas las zonas comunes de Delventto.',
      items: [
        {
          icon: 'infinity',
          label: 'Piscina infinita en el rooftop',
          description: 'Piso 16, con vista al mar y a la Sierra Nevada.',
        },
        {
          icon: 'indoor',
          label: 'Piscina cubierta',
          description: 'También en el rooftop, para nadar con sol o con lluvia.',
        },
        {
          icon: 'pool',
          label: 'Piscina principal',
          description: 'En el primer piso, a pocos pasos del lobby.',
        },
        {
          icon: 'kids',
          label: 'Piscina para niños',
          description: 'Un espacio aparte para que los más pequeños jueguen.',
        },
        { icon: 'jacuzzi', label: 'Jacuzzi', description: 'Para relajarte después de un día de playa.' },
        { icon: 'sauna', label: 'Sauna', description: 'Un rato de calor seco para cerrar el día.' },
        {
          icon: 'gym',
          label: 'Gimnasio',
          description: 'Completamente equipado, para no perder la rutina en vacaciones.',
        },
        {
          icon: 'rooftop',
          label: 'Terraza rooftop',
          description: 'Vista al mar desde lo más alto del edificio.',
        },
        { icon: 'bbq', label: 'Zona BBQ', description: 'Para asados en familia o con amigos.' },
        { icon: 'squash', label: 'Cancha de squash', description: 'Cancha profesional dentro del edificio.' },
        { icon: 'coworking', label: 'Coworking', description: 'Sala de trabajo con sala de reuniones.' },
        { icon: 'security', label: 'Seguridad 24/7', description: 'Acceso controlado las 24 horas.' },
        {
          icon: 'wifi',
          label: 'WiFi de fibra óptica',
          description: 'Conexión rápida para trabajar o ver series.',
        },
        {
          icon: 'parking',
          label: 'Parqueadero gratis',
          description: 'Parqueadero seguro sin costo adicional.',
        },
        { icon: 'reception', label: 'Recepción 24 horas', description: 'Recepción abierta día y noche.' },
      ],
      braceletNote: 'El acceso a las amenidades se hace con manilla: $25.000 COP por persona; los niños menores de 5 años no pagan. Por norma del edificio, no se puede andar mojado por ascensores ni zonas comunes.',
    },
    location: {
      eyebrow: 'Ubicación',
      h2: 'Cerca de la playa, del aeropuerto y de lo mejor de Santa Marta',
      intro: 'Delventto queda en la Carrera 4C #70-75, Pozos Colorados, sector Cabo Tortuga. Caminas a la playa y en pocos minutos en carro llegas al aeropuerto, a El Rodadero o al Centro Histórico.',
      address: 'Carrera 4C #70-75, Pozos Colorados, Santa Marta, Magdalena',
      mapTitle: 'Mapa del Edificio Delventto en Pozos Colorados, Santa Marta',
      places: [
        {
          name: 'Playa Cabo Tortuga',
          distance: '~200 m · 3–4 min a pie',
          description: 'La playa más cercana, a una caminata corta.',
        },
        {
          name: 'Playa del Ritmo',
          distance: '4 min a pie',
          description: 'Restaurante de playa con duchas; platos desde ~$17.000 COP.',
        },
        {
          name: 'Playa Pozos Colorados',
          distance: '~200 m',
          description: 'Otra playa a pocos pasos del edificio.',
        },
        {
          name: 'Aeropuerto Simón Bolívar',
          distance: '10–15 min en carro',
          description: 'Taxi aproximado de $20.000 a $25.000 COP.',
        },
        {
          name: 'C.C. Zazué',
          distance: '5 min en carro',
          description: 'Centro comercial para compras y mercado.',
        },
        {
          name: 'El Rodadero',
          distance: '~10 min en carro · 3,6 km',
          description: 'Playa, restaurantes y vida nocturna.',
        },
        {
          name: 'Centro Histórico',
          distance: '15–20 min en carro',
          description: 'El corazón colonial de Santa Marta.',
        },
        {
          name: 'Playa Blanca y Bahía Concha',
          distance: '15–25 min en carro o lancha',
          description: 'Playas para pasar el día.',
        },
        {
          name: 'Parque Nacional Tayrona',
          distance: '30–45 min en carro',
          description: 'Playas y selva del parque más famoso del Caribe colombiano.',
        },
        {
          name: 'Minca',
          distance: '40–50 min en carro',
          description: 'Pueblo en la Sierra: cascadas, fincas cafeteras y aves.',
        },
        {
          name: 'Quinta de San Pedro Alejandrino',
          distance: '~11 km',
          description: 'Hacienda histórica donde murió Simón Bolívar.',
        },
        {
          name: 'Acuario y Museo del Mar del Rodadero',
          distance: '~6 km',
          description: 'Plan con niños para conocer la vida marina.',
        },
      ],
    },
    faq: {
      eyebrow: 'Preguntas frecuentes',
      h2: 'Preguntas frecuentes sobre Delventto',
      items: [
        {
          q: '¿Dónde queda el edificio Delventto en Santa Marta?',
          a: 'Delventto está en la Carrera 4C #70-75, en Pozos Colorados (sector Cabo Tortuga), Santa Marta. Queda a 10–15 minutos en carro del aeropuerto Simón Bolívar.',
        },
        {
          q: '¿Qué tan lejos está Delventto de la playa?',
          a: 'Playa Cabo Tortuga está a unos 200 metros, es decir, 3 a 4 minutos caminando. Playa Pozos Colorados también queda a unos 200 metros.',
        },
        {
          q: '¿Qué amenidades tiene Delventto?',
          a: 'Tiene cuatro piscinas (principal, para niños, infinita en el rooftop y una cubierta), jacuzzi, sauna, gimnasio, cancha de squash, zona BBQ, terraza con vista al mar y coworking. También cuenta con seguridad 24/7 y recepción 24 horas.',
        },
        {
          q: '¿Cuánto cuesta la manilla para usar las piscinas?',
          a: 'La manilla cuesta $25.000 COP por persona y da acceso a todas las amenidades del edificio. Los niños menores de 5 años no pagan.',
        },
        {
          q: '¿Delventto tiene parqueadero?',
          a: 'Sí, el edificio tiene parqueadero seguro y gratis. Macondo incluye parqueadero privado sin costo.',
        },
        {
          q: '¿Puedo reservar directamente con 77Rentals?',
          a: 'Sí. Escríbenos por WhatsApp con tus fechas y el número de huéspedes, y te confirmamos disponibilidad. Macondo también se puede reservar en Booking.com.',
        },
        {
          q: '¿Qué apartamento es mejor para parejas y cuál para familias?',
          a: 'Para parejas o familias pequeñas de hasta 4 personas, Macondo (40 m², 1 habitación). Para grupos más grandes, el Tipo C recibe hasta ~6 huéspedes y el Tipo D, con 2 habitaciones y 2 baños, hasta 8.',
        },
        {
          q: '¿Se admiten mascotas?',
          a: 'Sí, Macondo admite mascotas; puede aplicar un recargo. Pregúntanos por WhatsApp antes de reservar.',
        },
        {
          q: '¿A cuánto queda Delventto del Parque Tayrona y del aeropuerto?',
          a: 'El aeropuerto Simón Bolívar queda a 10–15 minutos en carro y el Parque Nacional Tayrona a unos 30–45 minutos. Minca está a unos 40–50 minutos.',
        },
      ],
    },
    finalCta: {
      h2: 'Tu próximo viaje a Santa Marta empieza en Delventto',
      text: 'Reserva Macondo o escríbenos por WhatsApp y te ayudamos a encontrar el apartamento ideal para tu grupo.',
      primaryCta: 'Reservar Macondo',
      secondaryCta: 'Escribir por WhatsApp',
    },
    alts: {
      infinityPool: 'Piscina infinita en el rooftop de Delventto con vista al mar Caribe',
      facade: 'Fachada del edificio Delventto, dos torres de 16 pisos en Santa Marta',
      jacuzzi: 'Jacuzzis en la terraza de la azotea de Delventto con vista al mar',
      indoorPool: 'Piscina cubierta en el rooftop del edificio Delventto',
      mainPool: 'Piscina principal del primer piso en el edificio Delventto, Santa Marta',
      gym: 'Gimnasio equipado del edificio Delventto',
      lobby: 'Lobby y recepción 24 horas del edificio Delventto',
      bbq: 'Zona BBQ del edificio Delventto en Pozos Colorados',
      rooftopTerrace: 'Vista aérea de la azotea de Delventto con la piscina infinita y las montañas',
      socialArea: 'Zona social del edificio Delventto en Santa Marta',
      sauna: 'Sauna del edificio Delventto en Santa Marta',
      macondoBalcony: 'Balcón del apartamento Macondo con mesa para dos y vista parcial al mar',
      macondoBedroom: 'Habitación del apartamento Macondo en Delventto con cama doble y ventanal',
      macondoLiving: 'Sala del apartamento Macondo con sofá cama y decoración caribeña',
    },
    whatsapp: {
      macondo: 'Hola 77Rentals, quiero reservar Macondo (apto 717) en Delventto, Santa Marta. Fechas: ___ al ___. Somos ___ personas. ¿Está disponible?',
      general: 'Hola 77Rentals, quiero información sobre apartamentos en el edificio Delventto, Santa Marta. Fechas: ___ al ___. Somos ___ personas.',
    },
  },

  en: {
    metaTitle: 'Delventto Apartments in Santa Marta, Colombia | 77Rentals',
    metaDescription: 'Stay at Delventto in Pozos Colorados: 200 m from Cabo Tortuga beach, 4 pools and a rooftop infinity pool. Book Macondo, rated 10/10 on Booking.com.',
    breadcrumb: { home: 'Home' },
    hero: {
      eyebrow: 'Delventto · Pozos Colorados, Santa Marta',
      h1: 'Delventto Apartments in Santa Marta, Colombia',
      subtitle: 'A short walk from Cabo Tortuga beach, with a rooftop infinity pool looking out over the Caribbean and the Sierra Nevada. Start with Macondo, our 10/10 apartment, or choose from 20+ units in the same building.',
      primaryCta: 'Book Macondo',
      secondaryCta: 'See more apartments',
      facts: [
        { label: 'To the beach', value: '200 m' },
        { label: 'Pools', value: '4' },
        { label: 'From the airport', value: '10–15 min' },
        { label: 'Macondo on Booking', value: '10/10' },
      ],
    },
    intro: {
      eyebrow: 'The building',
      h2: 'Delventto: your beach base in Pozos Colorados',
      paragraphs: [
        'Delventto is a new two-tower, 16-floor building in Pozos Colorados, in the Cabo Tortuga area on the south side of Santa Marta. Cabo Tortuga beach is about 200 m away, Simón Bolívar airport is 10–15 minutes by car, and El Rodadero is roughly 10 minutes by car. The building is licensed for tourist rental.',
        'The building has four pools, including an infinity pool on the 16th floor with views of the sea and the Sierra Nevada mountains, plus a jacuzzi, sauna, gym, squash court and coworking space. If you\'re looking for a Santa Marta vacation rental with a pool, close to the beach and with free parking, 77Rentals will help you pick the right apartment for your trip.',
      ],
    },
    featured: {
      eyebrow: 'Our #1 pick',
      h2: 'Macondo: Delventto\'s 10/10 apartment',
      ratingLabel: '"Exceptional" on Booking.com · 11 reviews',
      pitch: 'Macondo is apartment 717 in Tower 1, on the 7th floor: 40 m² with a balcony, a partial sea view and a full kitchen. Guests rate it 10/10 on Booking.com in every category, from cleanliness to location. It\'s a great fit for couples and small families of up to 4.',
      highlights: [
        'Sleeps 4: double bed + double sofa bed',
        'Balcony with a partial sea view',
        'Kitchen with coffee maker, toaster and dishwasher',
        'Air conditioning, fast WiFi and Netflix',
        'Free private parking',
        'Pets allowed (a fee may apply)',
      ],
      quote: { text: 'The best place to stay in Santa Marta.', author: 'Santiago, United States · Booking.com' },
      primaryCta: 'See photos and details',
      secondaryCta: 'Book on WhatsApp',
      priceFrom: 'From',
      perNight: 'per night',
    },
    units: { guests: 'guests', bedroom: 'bedroom', bathroom: 'bathroom' },
    options: {
      eyebrow: 'More in Delventto',
      h2: 'Traveling as a group? We have 20+ apartments in the building',
      intro: 'Besides Macondo, 77Rentals manages more than 20 apartments at Delventto. Send us your dates and group size on WhatsApp and we\'ll reply with what\'s available.',
      units: [
        {
          id: 'tipo-c',
          letter: 'C',
          label: 'Type C',
          name: 'One-bedroom apartment',
          guests: 'Up to 6',
          bedrooms: '1 bedroom',
          bathrooms: '2 bathrooms',
          size: '~66–70 m²',
          tagline: 'Roomy and comfortable for families and mid-size groups.',
          bullets: [
            '66–70 m² with living area and balcony',
            '1 bedroom, most with 2 double beds',
            '2 bathrooms and an equipped kitchen',
            'Sleeps up to ~6',
          ],
          cta: 'Ask about Type C on WhatsApp',
          whatsapp: 'Hi 77Rentals, I\'m interested in a Type C (1-bedroom) apartment at Delventto, Santa Marta. Dates: ___ to ___. Guests: ___. What do you have available?',
        },
        {
          id: 'tipo-d',
          letter: 'D',
          label: 'Type D',
          name: 'Two-bedroom apartment',
          guests: 'Up to 8',
          bedrooms: '2 bedrooms',
          bathrooms: '2 bathrooms',
          size: '~84–90 m²',
          tagline: 'The most spacious layout, with a bathroom for each bedroom.',
          bullets: [
            '84–90 m², the largest option',
            '2 bedrooms, usually 3 double beds',
            '2 separate bathrooms, one per bedroom',
            'Sleeps up to 8',
          ],
          cta: 'Ask about Type D on WhatsApp',
          whatsapp: 'Hi 77Rentals, I\'m interested in a Type D (2-bedroom) apartment at Delventto, Santa Marta. Dates: ___ to ___. Guests: ___. What do you have available?',
        },
      ],
    },
    amenities: {
      eyebrow: 'Amenities',
      h2: 'Four pools, a rooftop and plenty to do without leaving the building',
      intro: 'An amenity wristband gives you access to every shared area at Delventto.',
      items: [
        {
          icon: 'infinity',
          label: 'Rooftop infinity pool',
          description: '16th floor, with sea and Sierra Nevada views.',
        },
        { icon: 'indoor', label: 'Indoor pool', description: 'Covered pool on the rooftop, rain or shine.' },
        { icon: 'pool', label: 'Main pool', description: 'On the ground floor, steps from the lobby.' },
        { icon: 'kids', label: 'Kids\' pool', description: 'A separate pool for the little ones.' },
        { icon: 'jacuzzi', label: 'Jacuzzi', description: 'Unwind after a day at the beach.' },
        { icon: 'sauna', label: 'Sauna', description: 'Dry heat to round off the day.' },
        { icon: 'gym', label: 'Gym', description: 'Fully equipped, so you can keep your routine.' },
        { icon: 'rooftop', label: 'Rooftop terrace', description: 'Sea views from the top of the building.' },
        { icon: 'bbq', label: 'BBQ area', description: 'Grill out with family or friends.' },
        { icon: 'squash', label: 'Squash court', description: 'A professional court inside the building.' },
        { icon: 'coworking', label: 'Coworking', description: 'Work lounge with a meeting room.' },
        { icon: 'security', label: '24/7 security', description: 'Controlled access around the clock.' },
        {
          icon: 'wifi',
          label: 'Fiber-optic WiFi',
          description: 'Fast connection for remote work or streaming.',
        },
        { icon: 'parking', label: 'Free parking', description: 'Secure parking at no extra cost.' },
        { icon: 'reception', label: '24-hour reception', description: 'The front desk is open day and night.' },
      ],
      braceletNote: 'Amenity access is by wristband: COP 25,000 per person, free for children under 5. Building rules don\'t allow walking through elevators or common areas while wet.',
    },
    location: {
      eyebrow: 'Location',
      h2: 'Close to the beach, the airport and the best of Santa Marta',
      intro: 'Delventto sits at Carrera 4C #70-75, Pozos Colorados, in the Cabo Tortuga area. The beach is a short walk away, and the airport, El Rodadero and the historic center are a quick drive.',
      address: 'Carrera 4C #70-75, Pozos Colorados, Santa Marta, Magdalena, Colombia',
      mapTitle: 'Map of Edificio Delventto in Pozos Colorados, Santa Marta',
      places: [
        {
          name: 'Cabo Tortuga beach',
          distance: '~200 m · 3–4 min walk',
          description: 'The closest beach, a short stroll away.',
        },
        {
          name: 'Playa del Ritmo',
          distance: '4 min walk',
          description: 'Beach restaurant with showers; dishes from ~COP 17,000.',
        },
        {
          name: 'Pozos Colorados beach',
          distance: '~200 m',
          description: 'Another beach just steps from the building.',
        },
        {
          name: 'Simón Bolívar Airport',
          distance: '10–15 min by car',
          description: 'Taxi runs about COP 20,000–25,000.',
        },
        { name: 'Zazué mall', distance: '5 min by car', description: 'Shopping and groceries nearby.' },
        {
          name: 'El Rodadero',
          distance: '~10 min by car · 3.6 km',
          description: 'Beach, restaurants and nightlife.',
        },
        {
          name: 'Historic Center',
          distance: '15–20 min by car',
          description: 'Santa Marta\'s colonial heart.',
        },
        {
          name: 'Playa Blanca & Bahía Concha',
          distance: '15–25 min by car or boat',
          description: 'Beaches for a full day out.',
        },
        {
          name: 'Tayrona National Park',
          distance: '30–45 min by car',
          description: 'Jungle and beaches in Colombia\'s most famous Caribbean park.',
        },
        {
          name: 'Minca',
          distance: '40–50 min by car',
          description: 'Mountain village with waterfalls, coffee farms and birdwatching.',
        },
        {
          name: 'Quinta de San Pedro Alejandrino',
          distance: '~11 km',
          description: 'Historic estate where Simón Bolívar died.',
        },
        {
          name: 'Rodadero Aquarium & Sea Museum',
          distance: '~6 km',
          description: 'A good outing with kids to see marine life.',
        },
      ],
    },
    faq: {
      eyebrow: 'FAQ',
      h2: 'Frequently asked questions about Delventto',
      items: [
        {
          q: 'Where is the Delventto building in Santa Marta?',
          a: 'Delventto is at Carrera 4C #70-75 in Pozos Colorados (Cabo Tortuga area), Santa Marta, Colombia. It\'s 10–15 minutes by car from Simón Bolívar airport.',
        },
        {
          q: 'How far is Delventto from the beach?',
          a: 'Cabo Tortuga beach is about 200 m away, a 3–4 minute walk. Pozos Colorados beach is also about 200 m away.',
        },
        {
          q: 'What amenities does Delventto have?',
          a: 'Four pools (main, kids\', rooftop infinity and a covered rooftop pool), a jacuzzi, sauna, gym, squash court, BBQ area, sea-view rooftop terrace and coworking space. There\'s also 24/7 security and a 24-hour reception.',
        },
        {
          q: 'How much is the pool and amenity wristband?',
          a: 'The wristband costs COP 25,000 per person and covers all building amenities. Children under 5 are free.',
        },
        {
          q: 'Is there parking at Delventto?',
          a: 'Yes, the building has free, secure parking. Macondo includes a free private parking space.',
        },
        {
          q: 'Can I book directly with 77Rentals?',
          a: 'Yes. Message us on WhatsApp with your dates and group size and we\'ll confirm availability. Macondo can also be booked on Booking.com.',
        },
        {
          q: 'Which apartment is best for couples, and which for families?',
          a: 'Macondo (40 m², 1 bedroom) suits couples and small families of up to 4. For larger groups, Type C sleeps up to ~6 and Type D, with 2 bedrooms and 2 bathrooms, sleeps up to 8.',
        },
        {
          q: 'Is Delventto pet friendly?',
          a: 'Macondo allows pets; a fee may apply. Message us on WhatsApp before you book.',
        },
        {
          q: 'How far is Delventto from Tayrona National Park and the airport?',
          a: 'Simón Bolívar airport is 10–15 minutes by car and Tayrona National Park is about 30–45 minutes. Minca is roughly 40–50 minutes away.',
        },
      ],
    },
    finalCta: {
      h2: 'Your Santa Marta trip starts at Delventto',
      text: 'Book Macondo or message us on WhatsApp and we\'ll help you find the right apartment for your group.',
      primaryCta: 'Book Macondo',
      secondaryCta: 'Message us on WhatsApp',
    },
    alts: {
      infinityPool: 'Rooftop infinity pool at Delventto overlooking the Caribbean Sea',
      facade: 'Facade of Delventto, two 16-floor towers in Santa Marta, Colombia',
      jacuzzi: 'Rooftop hot tubs at Delventto with sea views',
      indoorPool: 'Covered rooftop pool at the Delventto building',
      mainPool: 'Ground-floor main pool at Delventto, Santa Marta',
      gym: 'Fully equipped gym at Delventto',
      lobby: 'Lobby and 24-hour reception at Delventto',
      bbq: 'BBQ area at Delventto in Pozos Colorados',
      rooftopTerrace: 'Aerial view of the Delventto rooftop with the infinity pool and mountains',
      socialArea: 'Social lounge area at the Delventto building in Santa Marta',
      sauna: 'Sauna at the Delventto building in Santa Marta',
      macondoBalcony: 'Macondo apartment balcony with a table for two and a partial sea view',
      macondoBedroom: 'Bedroom in the Macondo apartment at Delventto with a double bed and large window',
      macondoLiving: 'Macondo living area with a sofa bed and Caribbean decor',
    },
    whatsapp: {
      macondo: 'Hi 77Rentals, I\'d like to book Macondo (apt 717) at Delventto, Santa Marta. Dates: ___ to ___. Guests: ___. Is it available?',
      general: 'Hi 77Rentals, I\'d like information about apartments at the Delventto building in Santa Marta. Dates: ___ to ___. Guests: ___.',
    },
  },
};

// ── <head> tags + JSON-LD for the prerendered page ─────────────────────────
// Macondo's Booking.com score is shown as text on the page but deliberately
// NOT marked up as aggregateRating: Google doesn't allow ratings collected on
// another site, and self-served ratings aren't eligible for stars.
const SITE = 'https://77rentals.com';

export const delventtoHeadTags = (lang: Lang, esc: (s: string) => string) => {
  const c = delventtoContent[lang];
  const url = SITE + delventtoPath(lang);
  const image = SITE + '/images/delventto/rooftop-infinity-pool.jpg';
  const address = {
    '@type': 'PostalAddress',
    streetAddress: `${DELVENTTO_ADDRESS.street}, ${DELVENTTO_ADDRESS.neighborhood}`,
    addressLocality: DELVENTTO_ADDRESS.city,
    addressRegion: DELVENTTO_ADDRESS.region,
    postalCode: DELVENTTO_ADDRESS.postalCode,
    addressCountry: DELVENTTO_ADDRESS.country,
  };
  const buildingId = `${SITE}/delventto/#building`;
  const macondoId = `${SITE}/propiedades/${MACONDO.slug}#rental`;
  const orgId = `${SITE}/#organization`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'Organization', '@id': orgId, name: '77 Rentals', url: SITE, logo: `${SITE}/apple-touch-icon.png` },
      {
        '@type': 'WebPage',
        '@id': `${url}#webpage`,
        url,
        name: c.metaTitle,
        description: c.metaDescription,
        inLanguage: lang === 'es' ? 'es-CO' : 'en',
        about: { '@id': buildingId },
        mainEntity: { '@id': macondoId },
        breadcrumb: { '@id': `${url}#breadcrumb` },
        primaryImageOfPage: { '@type': 'ImageObject', url: image },
        publisher: { '@id': orgId },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${url}#breadcrumb`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: c.breadcrumb.home, item: SITE + (lang === 'en' ? '/en/' : '/') },
          { '@type': 'ListItem', position: 2, name: 'Delventto', item: url },
        ],
      },
      {
        '@type': 'ApartmentComplex',
        '@id': buildingId,
        name: 'Edificio Delventto',
        description: c.intro.paragraphs[0],
        address,
        geo: { '@type': 'GeoCoordinates', latitude: DELVENTTO_GEO.lat, longitude: DELVENTTO_GEO.lng },
        hasMap: `https://www.google.com/maps?q=${DELVENTTO_GEO.lat},${DELVENTTO_GEO.lng}`,
        image: [image, SITE + '/images/delventto/building-facade.jpg', SITE + '/images/delventto/main-pool.jpg'],
        amenityFeature: c.amenities.items.map((a) => ({
          '@type': 'LocationFeatureSpecification', name: a.label, value: true,
        })),
        containsPlace: { '@id': macondoId },
      },
      {
        '@type': 'VacationRental',
        '@id': macondoId,
        name: 'Macondo · Apto 717, Delventto',
        alternateName: '77 Rentals 717 Vela Mare',
        identifier: MACONDO.slug,
        url: `${SITE}/propiedades/${MACONDO.slug}`,
        description: c.featured.pitch,
        brand: { '@id': orgId },
        containedInPlace: { '@id': buildingId },
        address,
        latitude: DELVENTTO_GEO.lat,
        longitude: DELVENTTO_GEO.lng,
        checkinTime: '15:00:00-05:00',
        checkoutTime: '11:00:00-05:00',
        knowsLanguage: ['es', 'en'],
        petsAllowed: true,
        image: [1, 2, 3, 4, 5, 6, 7, 8].map((i) => `${SITE}/images/macondo-77rentals/${i}.jpg`),
        containsPlace: {
          '@type': 'Accommodation',
          additionalType: 'EntireHomeOrApartment',
          floorLevel: '7',
          floorSize: { '@type': 'QuantitativeValue', value: MACONDO.sizeM2, unitCode: 'MTK' },
          numberOfBedrooms: 1,
          numberOfBathroomsTotal: 1,
          occupancy: { '@type': 'QuantitativeValue', maxValue: MACONDO.guests },
          bed: [
            { '@type': 'BedDetails', numberOfBeds: 1, typeOfBed: 'Double' },
            { '@type': 'BedDetails', numberOfBeds: 1, typeOfBed: 'Sofa bed' },
          ],
          smokingAllowed: false,
          amenityFeature: ['ac', 'wifi', 'kitchen', 'dishwasher', 'tv', 'balcony', 'freeParking', 'elevator',
            'wheelchairAccessible', 'petsAllowed', 'pool', 'hotTub', 'fitnessCenter'].map((name) => ({
            '@type': 'LocationFeatureSpecification', name, value: true,
          })),
        },
      },
      {
        '@type': 'FAQPage',
        '@id': `${url}#faq`,
        mainEntity: c.faq.items.map((f) => ({
          '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      },
    ],
  };

  return [
    `<title>${esc(c.metaTitle)}</title>`,
    `<meta name="description" content="${esc(c.metaDescription)}">`,
    `<link rel="canonical" href="${url}">`,
    `<link rel="alternate" hreflang="es" href="${SITE + delventtoPath('es')}">`,
    `<link rel="alternate" hreflang="en" href="${SITE + delventtoPath('en')}">`,
    `<link rel="alternate" hreflang="x-default" href="${SITE + delventtoPath('es')}">`,
    `<link rel="preload" as="image" href="/images/delventto/rooftop-infinity-pool.jpg">`,
    `<meta property="og:type" content="website">`,
    `<meta property="og:site_name" content="77 Rentals">`,
    `<meta property="og:locale" content="${lang === 'es' ? 'es_CO' : 'en_US'}">`,
    `<meta property="og:url" content="${url}">`,
    `<meta property="og:title" content="${esc(c.metaTitle)}">`,
    `<meta property="og:description" content="${esc(c.metaDescription)}">`,
    `<meta property="og:image" content="${image}">`,
    `<meta name="twitter:card" content="summary_large_image">`,
    `<meta name="twitter:title" content="${esc(c.metaTitle)}">`,
    `<meta name="twitter:description" content="${esc(c.metaDescription)}">`,
    `<meta name="twitter:image" content="${image}">`,
    // Escape "<" so no string can close the script tag early.
    `<script type="application/ld+json">${JSON.stringify(jsonLd).replace(/</g, '\u003c')}</script>`,
  ].join('\n    ');
};
