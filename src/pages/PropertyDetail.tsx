// src/pages/PropertyDetail.tsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { apartments } from '@/data/apartments';
import { countryFlag } from '@/lib/flags';
import { Users, BedDouble, Bath, MapPin, ChevronLeft, ChevronRight, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

const AMENITY_ICONS: Record<string, string> = {
  wifi: '📶', pool: '🏊', oceanView: '🌊', beach: '🏖', kitchen: '🍳',
  ac: '❄️', parking: '🚗', balcony: '🌅', streaming: '📺', pets: '🐾',
  elevator: '🛗', bbq: '🔥', gym: '💪', washer: '👕', security: '🔒',
  starlink: '🛰',
  'WiFi gratis': '📶', 'Aire acondicionado': '❄️', 'Parking privado gratis': '🚗',
  'Netflix': '📺', 'Mascotas permitidas': '🐾', 'Ascensor': '🛗',
  'Cocina': '🍳', 'Balcón': '🌅', 'BBQ': '🔥', 'Piscina privada': '🏊',
  'Ropa de cama': '🛏', 'Toallas': '🪣', 'Ducha': '🚿',
};

const getIcon = (amenity: string) => AMENITY_ICONS[amenity] ?? '✓';

const ScoreChip = ({ label, value }: { label: string; value?: number }) =>
  value ? (
    <div className="flex items-center gap-1.5 bg-white border border-gray-100 rounded-lg px-3 py-1.5 shadow-sm">
      <span className="text-xs text-gray-500">{label}</span>
      <span className="text-sm font-bold text-[#2D1B69]">{value}</span>
    </div>
  ) : null;

// WhatsApp SVG
const WaIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

const PropertyDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const apt = apartments.find(a => a.slug === slug);

  // Auto-rotate hero images
  useEffect(() => {
    if (!apt || apt.images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentImageIndex(prev => (prev + 1) % apt.images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [apt]);

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
  const reviewsWithComment = reviews.filter(r => r.comment);
  const visibleReviews = showAllReviews ? reviewsWithComment : reviewsWithComment.slice(0, 5);

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

      {/* Hero image carousel */}
      <div className="relative h-72 md:h-96 overflow-hidden group">
        <img src={apt.images[currentImageIndex]} alt={name} className="w-full h-full object-cover transition-opacity duration-500" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/40" />

        {/* Navigation arrows */}
        {apt.images.length > 1 && (
          <>
            <button
              onClick={() => setCurrentImageIndex(prev => (prev - 1 + apt.images.length) % apt.images.length)}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/40 hover:bg-black/60 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-200 z-10"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => setCurrentImageIndex(prev => (prev + 1) % apt.images.length)}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/40 hover:bg-black/60 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-200 z-10"
              aria-label="Next image"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {apt.stars && (
          <div className="absolute top-4 left-4 bg-[#D4A843] text-[#2D1B69] text-xs font-bold px-3 py-1 rounded-full">
            {'⭐'.repeat(Math.min(apt.stars, 5))} {apt.stars} estrellas
          </div>
        )}
        <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-black/50 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full">
          <MapPin className="w-3 h-3 text-[#D4A843]" />
          {apt.neighborhood} · {apt.city}
        </div>

        {/* Thumbnail strip - clickable */}
        {apt.images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {apt.images.map((src, i) => (
              <button
                key={i}
                onClick={() => setCurrentImageIndex(i)}
                className={`w-16 h-12 rounded-lg border-2 transition-all ${i === currentImageIndex ? 'border-white scale-110' : 'border-white/60 opacity-70 hover:opacity-100'}`}
              >
                <img src={src} alt="" className="w-full h-full object-cover rounded-lg" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main content */}
      <div className="container mx-auto px-4 max-w-5xl py-8 pb-24 lg:pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">

          {/* ── LEFT COLUMN ──────────────────────────── */}
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
              <p className="text-gray-600 leading-relaxed whitespace-pre-line">
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

              {apt.isNewListing || reviewsWithComment.length === 0 ? (
                <div className="bg-[#f8f7ff] rounded-2xl p-6 text-center border border-dashed border-[#d8d1f0]">
                  <p className="text-2xl mb-2">🌟</p>
                  <p className="font-serif text-[#2D1B69] font-semibold mb-1">¡Nueva propiedad!</p>
                  <p className="text-gray-500 text-sm">Sé el primero en dejar una reseña.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {visibleReviews.map((review, i) => (
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
                  {reviewsWithComment.length > 5 && (
                    <button
                      onClick={() => setShowAllReviews(!showAllReviews)}
                      className="flex items-center gap-1.5 text-[#2D1B69] text-sm font-medium hover:underline"
                    >
                      {showAllReviews
                        ? <><ChevronUp className="w-4 h-4" /> Mostrar menos</>
                        : <><ChevronDown className="w-4 h-4" /> Ver {reviewsWithComment.length - 5} reseñas más</>
                      }
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
                        <p className="text-gray-400 text-xs">{sibling.priceFrom > 0 ? `$${sibling.priceFrom}/noche` : 'Consultar precio'}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* ── RIGHT COLUMN — Booking sidebar ──────── */}
          <div className="hidden lg:block">
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
                  {!apt.priceFromCOP && <div className="mb-4" />}
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
                <WaIcon />
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
          <WaIcon />
          Reservar
        </a>
      </div>
    </div>
  );
};

export default PropertyDetail;
