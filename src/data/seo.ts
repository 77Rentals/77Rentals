// <head> tags for the prerendered homepage, property pages and catalog
// (see src/entry-server.tsx). Blog, /ai and /delventto build their own.
import { apartments, type Apartment } from '@/data/apartments';

const SITE = 'https://77rentals.com';
const ORG_ID = `${SITE}/#organization`;

type HeadInput = {
  url: string;
  title: string;
  description: string;
  image: string;
  jsonLd?: object;
};

const pageHead = ({ url, title, description, image, jsonLd }: HeadInput, esc: (s: string) => string) => {
  const abs = (p: string) => (p.startsWith('http') ? p : SITE + p);
  const tags = [
    `<title>${esc(title)}</title>`,
    `<meta name="description" content="${esc(description)}">`,
    `<link rel="canonical" href="${SITE + url}">`,
    `<meta property="og:type" content="website">`,
    `<meta property="og:site_name" content="77 Rentals">`,
    `<meta property="og:locale" content="es_CO">`,
    `<meta property="og:url" content="${SITE + url}">`,
    `<meta property="og:title" content="${esc(title)}">`,
    `<meta property="og:description" content="${esc(description)}">`,
    `<meta property="og:image" content="${abs(image)}">`,
    `<meta name="twitter:card" content="summary_large_image">`,
    `<meta name="twitter:title" content="${esc(title)}">`,
    `<meta name="twitter:description" content="${esc(description)}">`,
    `<meta name="twitter:image" content="${abs(image)}">`,
  ];
  if (jsonLd) {
    // Escape "<" so no string can close the script tag early.
    tags.push(`<script type="application/ld+json">${JSON.stringify(jsonLd).replace(/</g, '\\u003c')}</script>`);
  }
  return tags.join('\n    ');
};

const organization = {
  '@type': 'Organization',
  '@id': ORG_ID,
  name: '77 Rentals',
  url: SITE,
  logo: `${SITE}/apple-touch-icon.png`,
  email: 'team@77rentals.com',
  telephone: '+57 304 673 6241',
  sameAs: ['https://www.instagram.com/co77rentals/'],
  areaServed: ['Cartagena', 'Santa Marta', 'Bogotá'].map((name) => ({ '@type': 'City', name })),
};

// Property pages that exist as real listings (not the "coming soon" card).
export const listedApartments = apartments.filter(
  (a): a is Apartment & { slug: string } => Boolean(a.slug) && !a.isComingSoon,
);

export const propertyPath = (slug: string) => `/propiedades/${slug}/`;

export const homeHead = (esc: (s: string) => string) =>
  pageHead(
    {
      url: '/',
      title: 'Apartamentos en Cartagena, Santa Marta y Bogotá | 77Rentals',
      description:
        'Apartamentos amoblados para alquilar por noches o por meses en Cartagena, Santa Marta y Bogotá. Atención personalizada y reserva directa por WhatsApp.',
      image: '/images/delventto/rooftop-infinity-pool.jpg',
      jsonLd: {
        '@context': 'https://schema.org',
        '@graph': [
          organization,
          { '@type': 'WebSite', '@id': `${SITE}/#website`, url: SITE, name: '77 Rentals', inLanguage: 'es-CO', publisher: { '@id': ORG_ID } },
        ],
      },
    },
    esc,
  );

export const catalogHead = (esc: (s: string) => string) =>
  pageHead(
    {
      url: '/catalogo/',
      title: 'Catálogo de apartamentos para agencias | 77Rentals',
      description:
        'Catálogo de apartamentos de 77Rentals en Santa Marta, Cartagena, Bogotá y Barranquilla para agencias y partners: capacidad, espacios y comodidades.',
      image: '/images/delventto/building-facade.jpg',
    },
    esc,
  );

export const propertyHead = (apt: Apartment & { slug: string }, esc: (s: string) => string) => {
  const place = [apt.neighborhood, apt.city].filter((p, i, all) => p && all.indexOf(p) === i).join(', ');
  const title = `${apt.name} · ${apt.city} | 77Rentals`;
  const description = `${apt.description} ${apt.guests} huéspedes, ${apt.rooms} ${apt.rooms === 1 ? 'habitación' : 'habitaciones'}. Reserva directa con 77Rentals.`;
  const url = propertyPath(apt.slug);
  const images = apt.images.slice(0, 8).map((i) => (i.startsWith('http') ? i : SITE + i));

  return pageHead(
    {
      url,
      title,
      description: description.length > 160 ? apt.description : description,
      image: apt.images[0],
      jsonLd: {
        '@context': 'https://schema.org',
        '@graph': [
          organization,
          {
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Inicio', item: `${SITE}/` },
              { '@type': 'ListItem', position: 2, name: apt.name, item: SITE + url },
            ],
          },
          {
            // Ratings come from Booking.com, so they're shown on the page but
            // not marked up (Google doesn't allow third-party review markup).
            '@type': 'VacationRental',
            '@id': `${SITE}/propiedades/${apt.slug}#rental`,
            name: apt.name,
            url: SITE + url,
            description: apt.descriptionLong ?? apt.description,
            image: images,
            brand: { '@id': ORG_ID },
            address: {
              '@type': 'PostalAddress',
              addressLocality: apt.city,
              addressCountry: 'CO',
              ...(apt.neighborhood ? { streetAddress: place } : {}),
            },
            containsPlace: {
              '@type': 'Accommodation',
              additionalType: 'EntireHomeOrApartment',
              numberOfBedrooms: apt.rooms,
              numberOfBathroomsTotal: apt.bathrooms,
              occupancy: { '@type': 'QuantitativeValue', maxValue: apt.guests },
              ...(apt.sizeM2 ? { floorSize: { '@type': 'QuantitativeValue', value: apt.sizeM2, unitCode: 'MTK' } } : {}),
            },
          },
        ],
      },
    },
    esc,
  );
};
