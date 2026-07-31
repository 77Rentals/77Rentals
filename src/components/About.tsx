import { useLanguage } from '@/contexts/LanguageContext';
import logo from '@/assets/logo77.jpeg';
import SectionHeading from '@/components/SectionHeading';

const About = () => {
  const { t } = useLanguage();

  return (
    <section id="about" className="py-20 bg-background">
      <div className="container mx-auto px-4 max-w-5xl">
        <SectionHeading
          variant="split"
          eyebrow={t('about.subtitle')}
          heading={t('about.title')}
          supporting={t('about.text1')}
          className="mb-12"
        />
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-muted-foreground leading-relaxed">{t('about.text2')}</p>
          </div>
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600"
              alt="77 Rentals Experience"
              className="rounded-xl shadow-2xl w-full object-cover h-80 md:h-96"
              loading="lazy"
              width={600}
              height={400}
            />
            <div className="absolute -bottom-4 -left-4 w-24 h-24 rounded-xl overflow-hidden shadow-lg">
              <img src={logo} alt="77 Rentals" className="w-full h-full object-cover" loading="lazy" width={96} height={96} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
