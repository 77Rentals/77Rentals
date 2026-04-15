// src/components/ApartmentCard.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { apartments } from '@/data/apartments';
import { Users, BedDouble, Bath, ChevronLeft, ChevronRight, Star, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';

// ── Image Carousel ──────────────────────────────────────────────────────────
const ImageCarousel = ({ images, name }: { images: string[]; name: string }) => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent(c => (c + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [images.length]);

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
const CITY_IMAGES: Record<string, string> = {
  'Santa Marta': '/images/santa-marta.jpg',
  'Cartagena': '/images/cartagena.jpg',
  'Bogotá': '/images/bogota.jpg',
};

type CityFilter = 'Todas' | 'Cartagena' | 'Santa Marta' | 'Bogotá';

// ── WhatsApp SVG icon ──────────────────────────────────────────────────────
const WaIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="white">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

// ── Main component ─────────────────────────────────────────────────────────
const ApartmentCard = () => {
  const { lang, t } = useLanguage();
  const navigate = useNavigate();
  const [activeCity, setActiveCity] = useState<CityFilter>('Todas');

  const cityCounts = {
    Cartagena: apartments.filter(a => a.city === 'Cartagena').length,
    'Santa Marta': apartments.filter(a => a.city === 'Santa Marta').length,
    Bogotá: apartments.filter(a => a.city === 'Bogotá').length,
  };

  const filtered = activeCity === 'Todas'
    ? apartments
    : apartments.filter(a => a.city === activeCity);

  const handleReserve = (e: React.MouseEvent, name: string, city: string, customMsg?: string) => {
    e.stopPropagation();
    const msg = encodeURIComponent(customMsg || `Hola 77Rentals, me interesa "${name}" en ${city}, ¿está disponible?`);
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
          {/* Santa Marta — big featured tile */}
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

          {/* Cartagena + Bogotá stacked */}
          <div className="flex flex-col gap-3">
            {(['Cartagena', 'Bogotá'] as const).map(city => (
              <button
                key={city}
                onClick={() => setActiveCity(activeCity === city ? 'Todas' : city)}
                className={`relative rounded-2xl overflow-hidden flex-1 group transition-all duration-200 ${activeCity === city ? 'ring-2 ring-[#D4A843]' : ''}`}
              >
                <img src={CITY_IMAGES[city]} alt={city} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-b from-[#2D1B69]/15 to-[#2D1B69]/80" />
                <div className="absolute bottom-0 left-0 right-0 p-3 text-left">
                  <div className="font-serif text-base font-bold text-white">{city}</div>
                  <div className="text-white/80 text-xs">{cityCounts[city as keyof typeof cityCounts] ?? 0} propiedades</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Filter pills */}
        <div className="flex gap-2 justify-center flex-wrap mb-10">
          {(['Todas', 'Cartagena', 'Santa Marta', 'Bogotá'] as CityFilter[]).map(city => (
            <button
              key={city}
              onClick={() => setActiveCity(city)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                activeCity === city
                  ? 'bg-[#2D1B69] text-white shadow-sm'
                  : 'bg-white border border-gray-200 text-[#2D1B69] hover:border-[#2D1B69]/40'
              }`}
            >
              {city === 'Todas' ? `Todas (${apartments.length})` : city === 'Bogotá' ? city : `${city} (${cityCounts[city as keyof typeof cityCounts] ?? 0})`}
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

            // Coming-soon card
            if (apt.isComingSoon) {
              return (
                <div key={apt.id} className="rounded-2xl overflow-hidden bg-white border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                  <div className="aspect-[4/3] bg-gradient-to-br from-[#ede9f8] to-[#d8d1f0] flex flex-col items-center justify-center gap-3">
                    <span className="text-4xl">✨</span>
                    <div className="text-center">
                      <div className="text-sm text-[#7c6faa] font-semibold">Más propiedades próximamente</div>
                      <div className="text-xs text-[#a89fbb] mt-1">Portafolio completo disponible</div>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-serif font-bold text-[#2D1B69] mb-3">{name}</h3>
                    <p className="text-gray-600 text-sm mb-4 leading-relaxed">{apt.description}</p>
                    <div className="flex gap-2">
                      <div className="flex-1 bg-[#f5f3f9] text-[#7c6faa] text-sm font-semibold text-center py-2.5 rounded-xl">Ver portafolio</div>
                      <button
                        onClick={e => handleReserve(e, name, city, apt.whatsappContactMessage)}
                        className="bg-[#25D366] hover:bg-[#1ebe5d] text-white px-3 py-2.5 rounded-xl transition-colors"
                        aria-label="WhatsApp"
                      >
                        <WaIcon size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            }

            // Regular card
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
                  {apt.scores && apt.tag !== 'beach cabin' && (
                    <div className="absolute top-3 left-3 flex items-center gap-1 bg-[#2D1B69]/85 backdrop-blur-sm rounded-full px-2.5 py-1.5">
                      <Star className="w-3 h-3 fill-[#D4A843] text-[#D4A843]" />
                      <span className="text-white font-semibold text-xs">{apt.scores.overall}</span>
                      <span className="text-white/60 text-xs">({apt.scores.totalReviews})</span>
                    </div>
                  )}
                  {/* More photos coming soon badge */}
                  {apt.showMorePhotosComingSoon && (
                    <div className="absolute bottom-3 left-3 bg-[#D4A843]/90 backdrop-blur-sm text-[#2D1B69] text-xs font-semibold px-2.5 py-1 rounded-full">
                      📸 Más fotos próximamente
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
                      <WaIcon size={18} />
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
