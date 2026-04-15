import { useLanguage } from '@/contexts/LanguageContext';
import { Waves, Droplets, Dumbbell, Wifi, UtensilsCrossed, Sun, Tv, Umbrella, Car, Wind, WashingMachine, ShieldCheck } from 'lucide-react';

const amenityIcons = [
  { key: 'oceanView', icon: Waves },
  { key: 'pool', icon: Droplets },
  { key: 'gym', icon: Dumbbell },
  { key: 'wifi', icon: Wifi },
  { key: 'kitchen', icon: UtensilsCrossed },
  { key: 'balcony', icon: Sun },
  { key: 'streaming', icon: Tv },
  { key: 'beach', icon: Umbrella },
  { key: 'parking', icon: Car },
  { key: 'ac', icon: Wind },
  { key: 'washer', icon: WashingMachine },
  { key: 'security', icon: ShieldCheck },
];

const Amenities = () => {
  const { t } = useLanguage();

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-serif font-bold text-center text-foreground mb-2">{t('amenities.title')}</h2>
        <p className="text-center text-muted-foreground mb-2">{t('amenities.subtitle')}</p>
        <div className="w-16 h-1 bg-secondary mx-auto mb-12 rounded-full" />

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 max-w-5xl mx-auto">
          {amenityIcons.map(({ key, icon: Icon }) => (
            <div key={key} className="flex flex-col items-center gap-3 p-4 rounded-xl bg-muted hover:bg-secondary/10 transition-colors">
              <Icon className="w-8 h-8 text-secondary" />
              <span className="text-sm text-foreground font-medium text-center">{t(`amenity.${key}` as any)}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Amenities;
