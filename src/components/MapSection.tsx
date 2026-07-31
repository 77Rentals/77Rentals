import { useLanguage } from '@/contexts/LanguageContext';
import SectionHeading from '@/components/SectionHeading';

const MapSection = () => {
  const { lang, t } = useLanguage();

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <SectionHeading
          variant="left"
          eyebrow={lang === 'es' ? 'UBICACIÓN' : 'LOCATION'}
          heading={t('map.title')}
          supporting={t('map.subtitle')}
          className="mb-12"
        />

        <div className="max-w-4xl mx-auto rounded-xl overflow-hidden shadow-lg">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3924.123456789!2d-75.5143!3d10.3910!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTDCsDIzJzI3LjYiTiA3NcKwMzAnNTEuNSJX!5e0!3m2!1ses!2sco!4v1234567890"
            width="100%"
            height="400"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="77 Rentals Locations"
          />
        </div>
      </div>
    </section>
  );
};

export default MapSection;
