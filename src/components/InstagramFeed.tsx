import { useLanguage } from '@/contexts/LanguageContext';
import { useEffect } from 'react';
import { Instagram } from 'lucide-react';

const InstagramFeed = () => {
  const { t } = useLanguage();

  useEffect(() => {
    // Load Elfsight platform script
    const script = document.createElement('script');
    script.src = 'https://elfsightcdn.com/platform.js';
    script.async = true;
    document.body.appendChild(script);

    // Initialize Elfsight apps after script loads
    script.onload = () => {
      if (window.elfsight) {
        window.elfsight.init();
      }
    };

    return () => {
      // Cleanup if needed
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  return (
    <section className="py-20 bg-muted">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center gap-3 mb-2">
          <Instagram className="w-8 h-8 text-secondary" />
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground">{t('instagram.title')}</h2>
        </div>
        <a
          href="https://www.instagram.com/co77rentals/"
          target="_blank"
          rel="noopener noreferrer"
          className="block text-center text-secondary font-semibold mb-12 hover:text-[#D4A843] transition-colors cursor-pointer"
        >
          {t('instagram.subtitle')}
        </a>

        {/* Elfsight Instagram Feed Widget */}
        <div className="flex justify-center max-w-6xl mx-auto">
          <div className="elfsight-app-7da1b649-7bcc-4614-a1cf-c8e8fb0b26df" data-elfsight-app-lazy></div>
        </div>
      </div>
    </section>
  );
};

export default InstagramFeed;
