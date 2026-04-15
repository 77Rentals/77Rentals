import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Building2 } from 'lucide-react';

const PropertyManagement = () => {
  const { t } = useLanguage();

  return (
    <section id="management" className="py-20 bg-primary">
      <div className="container mx-auto px-4 max-w-4xl text-center">
        <Building2 className="w-16 h-16 text-secondary mx-auto mb-6" />
        <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary-foreground mb-2">{t('management.title')}</h2>
        <p className="text-xl text-secondary font-serif mb-6">{t('management.subtitle')}</p>
        <p className="text-primary-foreground/70 max-w-2xl mx-auto mb-8 leading-relaxed">{t('management.text')}</p>
        <Button
          asChild
          size="lg"
          className="bg-secondary text-secondary-foreground hover:bg-secondary/80 text-lg px-10 font-semibold"
        >
          <a href="https://wa.me/573046736241?text=Hola%2C%20me%20interesa%20el%20servicio%20de%20administraci%C3%B3n%20de%20propiedades" target="_blank" rel="noopener noreferrer">
            {t('management.cta')}
          </a>
        </Button>
      </div>
    </section>
  );
};

export default PropertyManagement;
