import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { ChevronDown, Star, MapPin } from 'lucide-react';
import SpaceBackground from '@/components/SpaceBackground';

const Hero = () => {
  const { t } = useLanguage();

  const stats = [
    { value: '1000+', label: 'Huéspedes felices' },
    { value: '9.6', label: 'Calificación promedio' },
    { value: '27', label: 'Propiedades exclusivas' },
    { value: '5', label: 'Ciudades en Colombia' },
  ];

  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden">
      <SpaceBackground particleCount={300} particleColor="rgba(212, 168, 67, 0.4)" />
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1920&q=85"
          alt="Luxury property in Colombia"
          className="w-full h-full object-cover object-center"
          width={1920}
          height={1080}
        />
        {/* Multi-layer overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#1a0e3d]/90 via-[#2D1B69]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a0e3d]/80 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 pt-24 pb-32">
        <div className="max-w-2xl">
          {/* Label */}
          <div className="flex items-center gap-2 mb-6">
            <div className="h-px w-8 bg-[#D4A843]" />
            <span className="text-[#D4A843] text-xs font-semibold uppercase tracking-[0.2em]">
              Colombia · Cartagena · Santa Marta · Bogotá
            </span>
          </div>

          {/* Headline */}
          <h1 className="font-serif font-bold text-white leading-[1.1] mb-6 text-4xl sm:text-5xl md:text-6xl lg:text-7xl">
            {t('hero.title')}
          </h1>

          {/* Subtitle */}
          <p className="text-white/70 text-base md:text-lg leading-relaxed mb-10 max-w-lg">
            {t('hero.subtitle')}
          </p>

          {/* CTA row */}
          <div className="flex flex-wrap items-center gap-4">
            <Button
              asChild
              size="lg"
              className="bg-[#D4A843] text-white hover:bg-[#D4A843]/90 text-base font-semibold px-8 h-12 rounded-full shadow-lg shadow-[#D4A843]/30 transition-all duration-300 hover:shadow-xl hover:shadow-[#D4A843]/40 hover:-translate-y-0.5"
            >
              <a href="#reservation">{t('hero.cta')}</a>
            </Button>
            <a
              href="#apartments"
              className="text-white/80 hover:text-white text-sm font-medium flex items-center gap-2 transition-colors group"
            >
              <span>Ver apartamentos</span>
              <span className="w-6 h-6 rounded-full border border-white/30 flex items-center justify-center group-hover:border-white/60 transition-colors">
                <ChevronDown className="w-3 h-3" />
              </span>
            </a>
          </div>

          {/* Rating badge */}
          <div className="mt-10 inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2">
            <div className="flex items-center gap-0.5">
              {[1,2,3,4,5].map(i => (
                <Star key={i} className="w-3.5 h-3.5 fill-[#D4A843] text-[#D4A843]" />
              ))}
            </div>
            <span className="text-white text-xs font-semibold">9.6/10</span>
            <span className="text-white/50 text-xs">·</span>
            <span className="text-white/70 text-xs">+180 reseñas verificadas</span>
          </div>
        </div>

        {/* Stats strip */}
        <div className="absolute bottom-0 left-0 right-0 bg-black/30 backdrop-blur-md border-t border-white/10">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-white/10">
              {stats.map((stat) => (
                <div key={stat.label} className="py-5 px-6 text-center">
                  <div className="text-[#D4A843] font-serif font-bold text-2xl md:text-3xl">{stat.value}</div>
                  <div className="text-white/60 text-xs mt-0.5 tracking-wide">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-24 right-8 hidden md:flex flex-col items-center gap-2 z-10">
        <span className="text-white/40 text-[10px] uppercase tracking-[0.2em] [writing-mode:vertical-rl]">Scroll</span>
        <div className="w-px h-12 bg-gradient-to-b from-white/30 to-transparent" />
      </div>
    </section>
  );
};

export default Hero;
