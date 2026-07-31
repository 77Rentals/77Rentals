import { useLanguage } from '@/contexts/LanguageContext';
import { MapPin, UtensilsCrossed, Waves, PartyPopper } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SectionHeading from '@/components/SectionHeading';

const cities = {
  Cartagena: {
    attractions: [
      { icon: MapPin, es: 'Ciudad Amurallada', en: 'Walled City' },
      { icon: Waves, es: 'Playa Bocagrande', en: 'Bocagrande Beach' },
      { icon: UtensilsCrossed, es: 'Restaurantes en Getsemaní', en: 'Getsemaní Restaurants' },
      { icon: PartyPopper, es: 'Islas del Rosario', en: 'Rosario Islands' },
    ],
  },
  'Santa Marta': {
    attractions: [
      { icon: Waves, es: 'Parque Tayrona', en: 'Tayrona Park' },
      { icon: MapPin, es: 'Centro Histórico', en: 'Historic Center' },
      { icon: UtensilsCrossed, es: 'Restaurantes en el Rodadero', en: 'Rodadero Restaurants' },
      { icon: PartyPopper, es: 'Ciudad Perdida', en: 'Lost City Trek' },
    ],
  },
  Bogotá: {
    attractions: [
      { icon: MapPin, es: 'La Candelaria', en: 'La Candelaria' },
      { icon: PartyPopper, es: 'Museo del Oro', en: 'Gold Museum' },
      { icon: UtensilsCrossed, es: 'Restaurantes en la Zona Rosa', en: 'Zona Rosa Restaurants' },
      { icon: Waves, es: 'Monserrate', en: 'Monserrate' },
    ],
  },
};

const LocalAttractions = () => {
  const { lang, t } = useLanguage();

  return (
    <section className="py-20 bg-muted">
      <div className="container mx-auto px-4 max-w-4xl">
        <SectionHeading
          variant="split"
          eyebrow={lang === 'es' ? 'EXPLORA' : 'EXPLORE'}
          heading={t('attractions.title')}
          supporting={t('attractions.subtitle')}
          className="mb-12"
        />

        <Tabs defaultValue="Cartagena" className="w-full">
          <TabsList className="w-full grid grid-cols-3 mb-8">
            {Object.keys(cities).map((city) => (
              <TabsTrigger key={city} value={city} className="font-semibold">{city}</TabsTrigger>
            ))}
          </TabsList>

          {Object.entries(cities).map(([city, data]) => (
            <TabsContent key={city} value={city}>
              <div className="grid sm:grid-cols-2 gap-4">
                {data.attractions.map((a, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 bg-card rounded-lg border">
                    <a.icon className="w-8 h-8 text-secondary shrink-0" />
                    <span className="font-medium text-foreground">{lang === 'es' ? a.es : a.en}</span>
                  </div>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
};

export default LocalAttractions;
