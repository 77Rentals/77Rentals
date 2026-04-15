import { useLanguage } from '@/contexts/LanguageContext';
import { MapPin, UtensilsCrossed, Waves, PartyPopper } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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
        <h2 className="text-3xl md:text-4xl font-serif font-bold text-center text-foreground mb-2">{t('attractions.title')}</h2>
        <p className="text-center text-muted-foreground mb-2">{t('attractions.subtitle')}</p>
        <div className="w-16 h-1 bg-secondary mx-auto mb-12 rounded-full" />

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
