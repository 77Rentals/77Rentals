import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Andres',
    city: 'Colombia',
    property: 'Macondo - 77Rentals — Santa Marta',
    platform: 'Booking.com',
    textEs: 'Fue especial y espectacular, el sitio es perfecto para lo que se puede necesitar en Santa Marta. Claudia fue sencillamente espectacular con su servicio, nos ayudó y todo fluyó con normalidad. Volveríamos, sí. Mil veces sí!',
    textEn: 'It was special and spectacular, the place is perfect for everything you need in Santa Marta. Claudia was simply spectacular with her service. We would return, yes. A thousand times yes!',
    rating: 5,
    date: 'Marzo 2026',
  },
  {
    name: 'Gomez',
    city: 'Colombia',
    property: 'Perla Suite — Santa Marta',
    platform: 'Booking.com',
    textEs: 'Nuestra experiencia en este alojamiento fue simplemente maravillosa. Desde el proceso de reserva, todo fue ágil y con una atención excelente. La ubicación, frente al mar, es un verdadero encanto: despertar con esa vista no tiene precio.',
    textEn: 'Our experience at this accommodation was simply wonderful. From the booking process, everything was agile with excellent attention. The location, facing the sea, is a true charm: waking up to that view is priceless.',
    rating: 5,
    date: 'Octubre 2025',
  },
  {
    name: 'Paula',
    city: 'Colombia',
    property: 'Boho 1108 — Cartagena',
    platform: 'Booking.com',
    textEs: 'La estadía fue muy agradable. La vista al mar es un regalo en cada momento del día. La cercanía a la playa es una maravilla, además sus aguas son tranquilas y el ambiente muy alegre. El apartamento es fresco, iluminado, y sus camas son cómodas.',
    textEn: 'The stay was very pleasant. The sea view is a gift at every moment of the day. The proximity to the beach is wonderful, the waters are calm and the atmosphere very lively. The apartment is fresh, bright, and the beds are comfortable.',
    rating: 5,
    date: 'Noviembre 2025',
  },
  {
    name: 'Gonzalez',
    city: 'Colombia',
    property: 'Fragata Style — Cartagena',
    platform: 'Booking.com',
    textEs: 'El apto es muy lindo y acogedor, la limpieza es impecable, todo es tal cuál se muestra en las fotos, buena ubicación, hay tiendas cerca, el mar queda a un minuto de el lugar y la encargada es amable y atenta, definitivamente lo recomiendo.',
    textEn: 'The apartment is very nice and cozy, the cleanliness is impeccable, everything is exactly as shown in the photos, great location, shops nearby, the sea is a minute away, and the host is kind and attentive. I definitely recommend it.',
    rating: 5,
    date: 'Enero 2026',
  },
  {
    name: 'Camilo',
    city: 'Reino Unido',
    property: 'Macondo - 77Rentals — Santa Marta',
    platform: 'Booking.com',
    textEs: 'El apartamento estaba impecable y muy bien mantenido. Volamos desde el Reino Unido y encontramos Colombia y Santa Marta una ciudad increíble. Un gran agradecimiento a Claudia y Juan Sebastián.',
    textEn: 'The flat was spotless and very well-maintained. We flew all the way from the UK and found Colombia and Santa Marta to be an amazing city! A huge thank you to Claudia and Juan Sebastian.',
    rating: 5,
    date: 'Agosto 2025',
  },
  {
    name: 'Martha',
    city: 'Colombia',
    property: 'Perla Suite — Santa Marta',
    platform: 'Booking.com',
    textEs: 'La atención de Claudia fue impecable, siempre atenta y amable. Los paisajes son espectaculares y el lugar transmite mucha tranquilidad. Además, es un sitio muy bien ubicado. Todo estuvo perfecto. ¡Muy recomendado y sin duda volveré!',
    textEn: 'Claudia\'s attention was impeccable, always attentive and kind. The scenery is spectacular and the place conveys great tranquility. Also very well located. Everything was perfect. Highly recommended and I will definitely return!',
    rating: 5,
    date: 'Julio 2025',
  },
];

const platformColor: Record<string, string> = {
  'Airbnb': 'text-rose-500',
  'Booking.com': 'text-blue-600',
};

const Testimonials = () => {
  const { lang, t } = useLanguage();
  const [current, setCurrent] = useState(0);

  const next = () => setCurrent(p => (p + 1) % testimonials.length);
  const prev = () => setCurrent(p => (p - 1 + testimonials.length) % testimonials.length);
  const item = testimonials[current];

  return (
    <section className="py-24 bg-[#F8F6FF]">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-8 bg-[#D4A843]" />
            <span className="text-[#D4A843] text-xs font-semibold uppercase tracking-[0.2em]">
              Reseñas verificadas
            </span>
            <div className="h-px w-8 bg-[#D4A843]" />
          </div>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#2D1B69]">
            {t('testimonials.title')}
          </h2>
        </div>

        {/* Card */}
        <div className="relative bg-white rounded-3xl shadow-lg shadow-[#2D1B69]/5 p-8 md:p-12 border border-[#2D1B69]/5">
          {/* Quote icon */}
          <Quote className="w-10 h-10 text-[#D4A843]/20 absolute top-8 right-10" />

          {/* Stars */}
          <div className="flex gap-1 mb-5">
            {Array.from({ length: item.rating }).map((_, i) => (
              <Star key={i} className="w-5 h-5 fill-[#D4A843] text-[#D4A843]" />
            ))}
          </div>

          {/* Quote */}
          <p className="text-gray-700 text-lg leading-relaxed mb-8 italic">
            "{lang === 'es' ? item.textEs : item.textEn}"
          </p>

          {/* Reviewer info */}
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <p className="font-bold text-[#2D1B69] text-base">{item.name}</p>
              <p className="text-gray-400 text-sm">{item.city} · {item.date}</p>
              <p className="text-[#D4A843] text-xs font-medium mt-0.5 uppercase tracking-wider">{item.property}</p>
            </div>
            <div className={`text-sm font-semibold ${platformColor[item.platform] || 'text-gray-500'}`}>
              {item.platform} ★
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100">
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === current ? 'bg-[#2D1B69] w-6' : 'bg-gray-200 w-1.5 hover:bg-gray-300'
                  }`}
                  aria-label={`Review ${i + 1}`}
                />
              ))}
            </div>
            <div className="flex gap-2">
              <button
                onClick={prev}
                className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:border-[#2D1B69] hover:text-[#2D1B69] transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={next}
                className="w-10 h-10 rounded-full bg-[#2D1B69] text-white flex items-center justify-center hover:bg-[#3D1F5C] transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
