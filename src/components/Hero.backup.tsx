import { useState, useEffect, useCallback } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';

const slides = [
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920',
  'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1920',
  'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1920',
  'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=1920',
  'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1920',
];

const Hero = () => {
  const { t } = useLanguage();
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => setCurrent((p) => (p + 1) % slides.length), []);
  const prev = useCallback(() => setCurrent((p) => (p - 1 + slides.length) % slides.length), []);

  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Slideshow backgrounds */}
      {slides.map((src, i) => (
        <div
          key={i}
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000"
          style={{
            backgroundImage: `url(${src})`,
            opacity: i === current ? 1 : 0,
          }}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/70 via-primary/50 to-primary/80" />

      {/* Slide nav arrows */}
      <button
        onClick={prev}
        className="absolute left-3 md:left-6 z-20 text-primary-foreground/60 hover:text-primary-foreground transition-colors"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-8 h-8 md:w-10 md:h-10" />
      </button>
      <button
        onClick={next}
        className="absolute right-3 md:right-6 z-20 text-primary-foreground/60 hover:text-primary-foreground transition-colors"
        aria-label="Next slide"
      >
        <ChevronRight className="w-8 h-8 md:w-10 md:h-10" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-20 md:bottom-16 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-2.5 h-2.5 rounded-full transition-all ${i === current ? 'bg-secondary w-6' : 'bg-primary-foreground/40'}`}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>

      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto animate-fade-in">
        <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-serif font-bold text-primary-foreground mb-4 md:mb-6 leading-tight">
          {t('hero.title')}
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-primary-foreground/80 mb-8 md:mb-10 max-w-2xl mx-auto leading-relaxed">
          {t('hero.subtitle')}
        </p>
        <Button
          asChild
          size="lg"
          className="bg-secondary text-secondary-foreground hover:bg-secondary/80 text-base md:text-lg px-8 md:px-10 py-5 md:py-6 font-semibold shadow-lg"
        >
          <a href="#reservation">{t('hero.cta')}</a>
        </Button>
      </div>

      <a
        href="#reservation"
        className="absolute bottom-6 left-1/2 -translate-x-1/2 text-primary-foreground/60 animate-bounce z-20"
      >
        <ChevronDown className="w-8 h-8" />
      </a>
    </section>
  );
};

export default Hero;
