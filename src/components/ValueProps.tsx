import { useLanguage } from '@/contexts/LanguageContext';
import { ShieldCheck, Sofa, HeadphonesIcon, Star } from 'lucide-react';

const ValueProps = () => {
  const { t } = useLanguage();

  const values = [
    {
      icon: ShieldCheck,
      title: t('value.reliability'),
      desc: t('value.reliabilityDesc'),
      stat: '100%',
      statLabel: 'Propiedades verificadas',
    },
    {
      icon: Sofa,
      title: t('value.comfort'),
      desc: t('value.comfortDesc'),
      stat: '5★',
      statLabel: 'Equipamiento completo',
    },
    {
      icon: HeadphonesIcon,
      title: t('value.personalized'),
      desc: t('value.personalizedDesc'),
      stat: '24/7',
      statLabel: 'Atención al huésped',
    },
  ];

  return (
    <section className="py-24 bg-[#2D1B69] relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#D4A843] rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#D4A843] rounded-full translate-y-1/2 -translate-x-1/3 blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-8 bg-[#D4A843]" />
            <span className="text-[#D4A843] text-xs font-semibold uppercase tracking-[0.2em]">
              {t('value.title')}
            </span>
            <div className="h-px w-8 bg-[#D4A843]" />
          </div>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-white">
            La diferencia 77 Rentals
          </h2>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {values.map((v) => (
            <div
              key={v.title}
              className="group relative rounded-2xl bg-white/5 border border-white/10 p-8 hover:bg-white/10 hover:border-[#D4A843]/30 transition-all duration-300"
            >
              {/* Stat */}
              <div className="text-[#D4A843] font-serif font-bold text-4xl mb-1">{v.stat}</div>
              <div className="text-white/40 text-xs uppercase tracking-widest mb-6">{v.statLabel}</div>

              {/* Icon */}
              <div className="w-10 h-10 rounded-xl bg-[#D4A843]/10 border border-[#D4A843]/20 flex items-center justify-center mb-4 group-hover:bg-[#D4A843]/20 transition-colors">
                <v.icon className="w-5 h-5 text-[#D4A843]" />
              </div>

              <h3 className="text-lg font-serif font-bold text-white mb-2">{v.title}</h3>
              <p className="text-white/55 text-sm leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>

        {/* Trust bar */}
        <div className="mt-14 pt-10 border-t border-white/10 flex flex-wrap justify-center items-center gap-8 md:gap-14">
          {[
            { label: 'Airbnb', value: '★ 4.9' },
            { label: 'Booking.com', value: '9.6 / 10' },
            { label: 'Huéspedes', value: '+200' },
            { label: 'Años de experiencia', value: '10+' },
          ].map(item => (
            <div key={item.label} className="text-center">
              <div className="text-[#D4A843] font-serif font-bold text-xl">{item.value}</div>
              <div className="text-white/40 text-xs uppercase tracking-wider mt-0.5">{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ValueProps;
