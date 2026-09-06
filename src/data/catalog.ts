export interface CatalogListing {
  id: string;
  name: string;
  tagline: string;
  capacity: number;
  capacityLabel: string;
  bathrooms: string;
  size?: string;
  features: string[];
  notes?: string;
  badge?: string;
  longStay?: boolean;
}

export interface CatalogDestination {
  id: string;
  name: string;
  emoji: string;
  intro: string;
  listings: CatalogListing[];
}

export const catalogDestinations: CatalogDestination[] = [
  {
    id: "santa-marta",
    name: "Santa Marta",
    emoji: "🌴",
    intro:
      "Un mismo edificio, cuatro formas de alojar a tu cliente. Tipos A, B, C y D pensados para parejas, familias y grupos grandes — todos con cocina equipada, balcón y espacios amoblados.",
    listings: [
      {
        id: "sm-tipo-a",
        name: "Tipo A · Suite para 2",
        tagline: "La opción íntima, perfecta para parejas.",
        capacity: 2,
        capacityLabel: "2 personas",
        bathrooms: "1 baño",
        size: "~30 m²",
        features: ["Cocina equipada", "Balcón", "Espacios amoblados"],
        notes: "Ideal para parejas o estadías cortas para dos personas.",
      },
      {
        id: "sm-tipo-b",
        name: "Tipo B · Hasta 4 personas",
        tagline: "El equilibrio entre espacio y precio.",
        capacity: 4,
        capacityLabel: "Hasta 4 personas",
        bathrooms: "1 baño",
        size: "~36–40 m²",
        features: [
          "Cocina equipada",
          "Balcón",
          "1 cama doble + 1 sofá cama doble (la mayoría)",
          "Algunas unidades con 2 camas dobles",
        ],
      },
      {
        id: "sm-tipo-c",
        name: "Tipo C · Para grupos",
        tagline: "Área social propia, ideal para amigos que viajan juntos.",
        capacity: 6,
        capacityLabel: "Grupos medianos",
        bathrooms: "2 baños",
        features: [
          "Habitación con 2 camas dobles (la mayoría)",
          "Área social",
          "Cocina equipada",
          "Balcón",
        ],
      },
      {
        id: "sm-tipo-d",
        name: "Tipo D · La más amplia",
        tagline: "Dos habitaciones, dos baños, cero compromisos.",
        capacity: 8,
        capacityLabel: "Hasta 8 personas",
        bathrooms: "2 baños independientes (uno por habitación)",
        features: [
          "2 habitaciones",
          "Generalmente 3 camas dobles",
          "Algunas unidades: 1 cama king + 2 camas dobles",
          "Sala con sofá cama para 2 personas adicionales",
          "Cocina completamente equipada",
          "Balcón con vista al aeropuerto, o a la montaña y piscina",
        ],
        badge: "Más espacio",
      },
    ],
  },
  {
    id: "cartagena",
    name: "Cartagena",
    emoji: "🌊",
    intro:
      "Las zonas que tu cliente ya conoce por nombre — El Laguito, Bocagrande, el Centro Histórico cerca — con opciones para cada presupuesto y cada tipo de grupo.",
    listings: [
      {
        id: "ctg-laguito",
        name: "El Laguito",
        tagline: "Ubicación y variedad para grupos.",
        capacity: 6,
        capacityLabel: "Hasta 6 personas",
        bathrooms: "Según unidad",
        features: [
          "Principalmente apartamentos de 1 habitación",
          "También hay estudios (máx. 4 personas)",
          "Excelente ubicación para moverse por la ciudad",
        ],
        notes: "Una excelente alternativa para grupos que buscan ubicación y flexibilidad de acomodación.",
      },
      {
        id: "ctg-conquistador",
        name: "Edificio Conquistador",
        tagline: "Sencillo, cómodo y funcional.",
        capacity: 4,
        capacityLabel: "Estilo práctico",
        bathrooms: "Según unidad",
        features: ["Estilo sencillo y cómodo", "Buena relación costo-beneficio"],
        notes: "Para el cliente que busca una alternativa práctica para disfrutar Cartagena.",
      },
      {
        id: "ctg-tocagua",
        name: "Edificio Tocagua",
        tagline: "Dos apartamentos con personalidad propia.",
        capacity: 4,
        capacityLabel: "Diseño temático",
        bathrooms: "Según unidad",
        features: [
          "Vista directa hacia la ciudad y el mar",
          "Diseño temático y con carácter",
          "Excelente ubicación",
        ],
        notes: "No cuenta con piscina. Ideal para quien busca algo diferente a lo estándar.",
        badge: "Diseño único",
      },
      {
        id: "ctg-bocagrande",
        name: "Bocagrande",
        tagline: "Torre con amenities de primer nivel, a un cruce de la playa.",
        capacity: 5,
        capacityLabel: "5 personas · pisos 12 y 35",
        bathrooms: "2 baños independientes",
        features: [
          "Acceso a la playa cruzando la calle",
          "Piscina infinity en el piso 40",
          "Piscina de propulsión y coworking",
          "Helipuerto del edificio",
        ],
        badge: "Premium",
      },
      {
        id: "ctg-morros3",
        name: "Morros 3",
        tagline: "Salida directa al mar, solo por reserva directa.",
        capacity: 4,
        capacityLabel: "4 personas · piso 2",
        bathrooms: "2 baños",
        size: "76 m²",
        features: [
          "Balcón y espacios amplios",
          "Cocina equipada",
          "Salida directamente al mar",
        ],
        notes: "No está publicada en plataformas — se maneja exclusivamente mediante reservas directas con 77Rentals.",
        badge: "Exclusiva",
      },
    ],
  },
  {
    id: "bogota",
    name: "Bogotá",
    emoji: "🏙️",
    intro:
      "Ubicación central para el viajero de negocios o el cliente que quiere ciudad, con amenities de edificio que suman al cierre de venta.",
    listings: [
      {
        id: "bog-calle32",
        name: "Calle 32",
        tagline: "Zona central, piso alto, amenities de edificio.",
        capacity: 3,
        capacityLabel: "3 personas · piso 9",
        bathrooms: "2 baños (uno completo)",
        features: [
          "1 cama doble + 1 sofá cama",
          "Cocina equipada",
          "Amenities en el piso 28: piscina, jacuzzi y sauna",
        ],
        notes: "Ubicado sobre la Calle 32, arriba de la Séptima — zona central de Bogotá.",
      },
      {
        id: "bog-cedritos",
        name: "Cedritos",
        tagline: "Apartamento temático, próxima apertura.",
        capacity: 4,
        capacityLabel: "Preventa disponible",
        bathrooms: "Por confirmar",
        features: ["Apartamento temático", "Ya en preventa"],
        notes: "Apertura a mediados de diciembre. Ideal para asegurar disponibilidad con anticipación.",
        badge: "Próxima apertura",
      },
    ],
  },
  {
    id: "barranquilla",
    name: "Barranquilla",
    emoji: "🏡",
    intro:
      "Para el cliente que necesita quedarse un mes o más — vivienda amoblada y lista, sin la fricción de un contrato tradicional.",
    listings: [
      {
        id: "baq-villa-carolina-1",
        name: "Villa Carolina · Opción 1",
        tagline: "Estadía larga, lista para vivir.",
        capacity: 4,
        capacityLabel: "Alquiler mínimo: 1 mes",
        bathrooms: "Según unidad",
        features: ["Propiedad horizontal", "Totalmente amoblada", "Apartamento temático"],
        longStay: true,
      },
      {
        id: "baq-villa-carolina-2",
        name: "Villa Carolina · Opción 2",
        tagline: "Estadía larga, espacios cómodos y funcionales.",
        capacity: 4,
        capacityLabel: "Alquiler mínimo: 1 mes",
        bathrooms: "Según unidad",
        features: ["Propiedad horizontal", "Totalmente amoblada", "Apartamento temático"],
        longStay: true,
      },
    ],
  },
];

export const catalogStats = {
  totalListings: "30+",
  destinations: catalogDestinations.length,
};
