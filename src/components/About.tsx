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
              src="/images/about-tayrona-800.webp"
              alt="Playa con palmeras en el Parque Tayrona, cerca de Santa Marta"
              className="rounded-xl shadow-2xl w-full object-cover h-80 md:h-96"
              loading="lazy"
              width={800}
              height={533}
            />
            {/* Logo badge at the logo's own proportions (661×475), so nothing is cropped */}
            <div className="absolute bottom-3 left-3 md:-bottom-5 md:-left-5 w-28 md:w-36 rounded-xl overflow-hidden border-4 border-white shadow-lg bg-[#3B2055]">
              <img src={logo} alt="77 Rentals" className="block w-full h-auto" loading="lazy" width={661} height={475} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
