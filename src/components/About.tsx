import { useLanguage } from '@/contexts/LanguageContext';
import logo from '@/assets/logo77.jpeg';

const About = () => {
  const { t } = useLanguage();

  return (
    <section id="about" className="py-20 bg-background">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-secondary font-semibold uppercase tracking-widest text-sm mb-2">{t('about.subtitle')}</p>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-6">{t('about.title')}</h2>
            <div className="w-16 h-1 bg-secondary mb-6 rounded-full" />
            <p className="text-muted-foreground leading-relaxed mb-4">{t('about.text1')}</p>
            <p className="text-muted-foreground leading-relaxed">{t('about.text2')}</p>
          </div>
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600"
              alt="77 Rentals Experience"
              className="rounded-xl shadow-2xl w-full object-cover h-80 md:h-96"
            />
            <div className="absolute -bottom-4 -left-4 w-24 h-24 rounded-xl overflow-hidden shadow-lg">
              <img src={logo} alt="77 Rentals" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
