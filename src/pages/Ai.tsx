import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Briefcase,
  Code2,
  FileSignature,
  ScrollText,
  ShieldCheck,
  Receipt,
  PenLine,
  Check,
  MessageCircle,
} from 'lucide-react';
import logo from '@/assets/logo77.jpeg';
import WhatsAppButton from '@/components/WhatsAppButton';
import AiLeadForm from '@/components/ai/AiLeadForm';
import { aiContent, aiPath, aiWhatsAppUrl, type ProblemCard, type AiLang } from '@/components/ai/content';
import { useBlogLang } from '@/hooks/useBlogLang';

const caseIcons = [FileSignature, ScrollText, ShieldCheck, Receipt, PenLine];

const Eyebrow = ({ children, light = false }: { children: React.ReactNode; light?: boolean }) => (
  <div className="flex items-center gap-3 mb-4">
    <div className="h-px w-8 bg-[#D4A843]" />
    <span className={`text-xs font-semibold uppercase tracking-[0.2em] ${light ? 'text-[#D4A843]' : 'text-[#b8902f]'}`}>
      {children}
    </span>
  </div>
);

const ProblemGrid = ({
  cards,
  lang,
  labels,
}: {
  cards: ProblemCard[];
  lang: AiLang;
  labels: { solution: string; talk: string };
}) => (
  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
    {cards.map((card) => (
      <article
        key={card.problem}
        className="flex flex-col bg-white rounded-2xl p-6 shadow-sm border border-[#2D1B69]/5 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
      >
        <span className="self-start text-[11px] font-semibold uppercase tracking-wider text-[#b8902f] bg-[#D4A843]/10 rounded-full px-3 py-1 mb-4">
          {card.offer}
        </span>
        <h3 className="font-serif text-xl text-[#2D1B69] leading-snug">“{card.problem}”</h3>
        <p className="mt-2 text-sm text-[#2D1B69]/60">{card.detail}</p>
        <div className="mt-5 pt-5 border-t border-[#2D1B69]/10 flex-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#2D1B69]/50 mb-1">{labels.solution}</p>
          <p className="text-sm text-[#2D1B69]/85 leading-relaxed">{card.solution}</p>
        </div>
        <a
          href={aiWhatsAppUrl(lang, card.problem)}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#128C4A] hover:text-[#0d6b38] transition-colors"
        >
          <MessageCircle className="w-4 h-4" />
          {labels.talk}
          <ArrowRight className="w-4 h-4" />
        </a>
      </article>
    ))}
  </div>
);

const Ai = () => {
  const lang = useBlogLang();
  const c = aiContent[lang];
  const other: AiLang = lang === 'es' ? 'en' : 'es';

  useEffect(() => {
    const previousTitle = document.title;
    document.title = c.meta.title;
    return () => {
      document.title = previousTitle;
    };
  }, [c.meta.title]);

  return (
    <div className="min-h-screen bg-[#f8f7ff]">
      {/* Header */}
      <header className="absolute top-0 inset-x-0 z-40">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          <Link to={aiPath(lang)} className="flex items-center gap-3">
            <img src={logo} alt="77 Rentals" className="h-10 w-10 rounded-full object-cover" />
            <span className="text-white font-semibold tracking-wide">
              77 <span className="text-[#D4A843]">IA</span>
            </span>
          </Link>
          <nav className="flex items-center gap-5 text-sm text-white/80">
            <a href="#servicios" className="hidden md:inline hover:text-white transition-colors">{c.nav.services}</a>
            <a href="#proceso" className="hidden md:inline hover:text-white transition-colors">{c.nav.howWeWork}</a>
            <a href="#contacto" className="hidden sm:inline hover:text-white transition-colors">{c.nav.contact}</a>
            <Link
              to={aiPath(other)}
              className="rounded-full border border-white/30 px-3 py-1 text-xs font-semibold text-white hover:bg-white/10 transition-colors"
              aria-label={other === 'en' ? 'English' : 'Español'}
            >
              {c.nav.switchLang}
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#1a0f40] via-[#2D1B69] to-[#4B0082] pt-36 pb-24 md:pt-44 md:pb-32">
        <div className="absolute top-10 right-0 w-[28rem] h-[28rem] rounded-full bg-[#D4A843]/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-white/5 blur-3xl pointer-events-none" />
        <div className="container mx-auto px-4 max-w-4xl relative z-10">
          <Eyebrow light>{c.hero.eyebrow}</Eyebrow>
          <h1 className="font-serif heading-fluid-1 text-white leading-tight">{c.hero.title}</h1>
          <p className="mt-6 text-lg text-white/75 leading-relaxed max-w-2xl">{c.hero.subtitle}</p>
          <div className="mt-10 flex flex-col sm:flex-row gap-3">
            <a
              href={aiWhatsAppUrl(lang)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] hover:bg-[#1ebe5d] px-7 py-3.5 font-bold text-white shadow-lg transition-colors"
            >
              <MessageCircle className="w-5 h-5" />
              {c.hero.ctaWhatsApp}
            </a>
            <a
              href="#servicios"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/30 px-7 py-3.5 font-semibold text-white hover:bg-white/10 transition-colors"
            >
              {c.hero.ctaServices}
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
          <p className="mt-8 text-sm text-white/50">{c.hero.location}</p>
        </div>
      </section>

      {/* The gap */}
      <section className="py-20 md:py-24">
        <div className="container mx-auto px-4 max-w-5xl">
          <Eyebrow>{c.gap.eyebrow}</Eyebrow>
          <h2 className="font-serif heading-fluid-2 text-[#2D1B69] max-w-3xl">{c.gap.title}</h2>
          <p className="mt-4 text-[#2D1B69]/70 max-w-2xl">{c.gap.subtitle}</p>
          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            {c.gap.stats.map((s) => (
              <div key={s.label} className="bg-white rounded-2xl p-7 border border-[#2D1B69]/5 shadow-sm">
                <p className="font-serif text-5xl text-[#D4A843]">{s.value}</p>
                <p className="mt-3 text-sm text-[#2D1B69]/75 leading-relaxed">{s.label}</p>
              </div>
            ))}
          </div>
          <p className="mt-6 text-xs text-[#2D1B69]/50">
            {c.gap.sourcesLabel}:{' '}
            {c.gap.sources.map((src, i) => (
              <span key={src.url}>
                {i > 0 && ' · '}
                <a href={src.url} target="_blank" rel="noopener noreferrer" className="underline hover:text-[#2D1B69]">
                  {src.title}
                </a>
              </span>
            ))}
          </p>
        </div>
      </section>

      {/* Tracks */}
      <section id="servicios" className="pb-20 md:pb-24 scroll-mt-8">
        <div className="container mx-auto px-4 max-w-5xl">
          <Eyebrow>{c.tracks.eyebrow}</Eyebrow>
          <h2 className="font-serif heading-fluid-2 text-[#2D1B69]">{c.tracks.title}</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {[
              { href: '#negocio', icon: Briefcase, t: c.tracks.business },
              { href: '#desarrollo', icon: Code2, t: c.tracks.dev },
            ].map(({ href, icon: Icon, t }) => (
              <a
                key={href}
                href={href}
                className="group rounded-2xl bg-[#2D1B69] p-8 text-white shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
              >
                <Icon className="w-9 h-9 text-[#D4A843]" />
                <h3 className="mt-5 font-serif text-2xl">{t.title}</h3>
                <p className="mt-1 text-sm text-[#D4A843]/90">{t.audience}</p>
                <p className="mt-4 text-white/75 leading-relaxed">{t.body}</p>
                <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-white group-hover:gap-3 transition-all">
                  {c.tracks.cta} <ArrowRight className="w-4 h-4" />
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Business track */}
      <section id="negocio" className="py-20 md:py-24 bg-white/60 scroll-mt-8">
        <div className="container mx-auto px-4">
          <Eyebrow>{c.business.eyebrow}</Eyebrow>
          <h2 className="font-serif heading-fluid-2 text-[#2D1B69]">{c.business.title}</h2>
          <p className="mt-4 mb-12 text-[#2D1B69]/70">{c.business.subtitle}</p>
          <ProblemGrid cards={c.business.cards} lang={lang} labels={c.cardLabels} />
        </div>
      </section>

      {/* Dev track */}
      <section id="desarrollo" className="py-20 md:py-24 scroll-mt-8">
        <div className="container mx-auto px-4">
          <Eyebrow>{c.dev.eyebrow}</Eyebrow>
          <h2 className="font-serif heading-fluid-2 text-[#2D1B69]">{c.dev.title}</h2>
          <p className="mt-4 mb-12 text-[#2D1B69]/70 max-w-2xl">{c.dev.subtitle}</p>
          <ProblemGrid cards={c.dev.cards} lang={lang} labels={c.cardLabels} />
        </div>
      </section>

      {/* Case study */}
      <section className="py-20 md:py-24 bg-gradient-to-br from-[#1a0f40] to-[#2D1B69] text-white">
        <div className="container mx-auto px-4 max-w-5xl">
          <Eyebrow light>{c.caseStudy.eyebrow}</Eyebrow>
          <h2 className="font-serif heading-fluid-2 max-w-3xl">{c.caseStudy.title}</h2>
          <p className="mt-4 text-white/70 max-w-2xl">{c.caseStudy.subtitle}</p>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {c.caseStudy.items.map((item, i) => {
              const Icon = caseIcons[i % caseIcons.length];
              return (
                <div key={item.title} className="rounded-2xl bg-white/5 border border-white/10 p-6">
                  <Icon className="w-7 h-7 text-[#D4A843]" />
                  <h3 className="mt-4 font-semibold text-lg">{item.title}</h3>
                  <p className="mt-2 text-sm text-white/65 leading-relaxed">{item.body}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Process */}
      <section id="proceso" className="py-20 md:py-24 scroll-mt-8">
        <div className="container mx-auto px-4 max-w-5xl">
          <Eyebrow>{c.process.eyebrow}</Eyebrow>
          <h2 className="font-serif heading-fluid-2 text-[#2D1B69]">{c.process.title}</h2>
          <p className="mt-4 text-[#2D1B69]/70">{c.process.subtitle}</p>
          <ol className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {c.process.steps.map((step, i) => (
              <li key={step.title} className="relative bg-white rounded-2xl p-6 border border-[#2D1B69]/5 shadow-sm">
                <span className="font-serif text-4xl text-[#D4A843]/80">0{i + 1}</span>
                <h3 className="mt-3 font-semibold text-lg text-[#2D1B69]">{step.title}</h3>
                <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-[#b8902f]">{step.duration}</p>
                <p className="mt-3 text-sm text-[#2D1B69]/75 leading-relaxed">{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Tools + responsible AI */}
      <section className="pb-20 md:pb-24">
        <div className="container mx-auto px-4 max-w-5xl grid gap-6 lg:grid-cols-2">
          <div className="bg-white rounded-2xl p-8 border border-[#2D1B69]/5 shadow-sm">
            <Eyebrow>{c.tools.eyebrow}</Eyebrow>
            <h2 className="font-serif text-2xl md:text-3xl text-[#2D1B69]">{c.tools.title}</h2>
            <p className="mt-3 text-sm text-[#2D1B69]/70 leading-relaxed">{c.tools.subtitle}</p>
            <ul className="mt-6 flex flex-wrap gap-2">
              {c.tools.list.map((tool) => (
                <li key={tool} className="rounded-full bg-[#2D1B69]/5 px-4 py-1.5 text-sm font-medium text-[#2D1B69]">
                  {tool}
                </li>
              ))}
            </ul>
            <p className="mt-5 text-[11px] text-[#2D1B69]/45">{c.tools.disclaimer}</p>
          </div>
          <div className="bg-white rounded-2xl p-8 border border-[#2D1B69]/5 shadow-sm">
            <Eyebrow>{c.responsible.eyebrow}</Eyebrow>
            <h2 className="font-serif text-2xl md:text-3xl text-[#2D1B69]">{c.responsible.title}</h2>
            <p className="mt-3 text-sm text-[#2D1B69]/70 leading-relaxed">{c.responsible.body}</p>
            <ul className="mt-6 space-y-3">
              {c.responsible.points.map((point) => (
                <li key={point} className="flex items-start gap-3 text-sm text-[#2D1B69]/85">
                  <Check className="w-4 h-4 mt-0.5 shrink-0 text-[#D4A843]" />
                  {point}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 md:py-24 bg-white/60">
        <div className="container mx-auto px-4 max-w-3xl">
          <Eyebrow>{c.faq.eyebrow}</Eyebrow>
          <h2 className="font-serif heading-fluid-2 text-[#2D1B69]">{c.faq.title}</h2>
          <div className="mt-10 divide-y divide-[#2D1B69]/10 border-y border-[#2D1B69]/10">
            {c.faq.items.map((item) => (
              <details key={item.q} className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-[#2D1B69]">
                  {item.q}
                  <span className="text-[#D4A843] text-xl transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 text-sm text-[#2D1B69]/75 leading-relaxed">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contacto" className="relative py-20 md:py-24 bg-gradient-to-br from-[#2D1B69] to-[#4B0082] overflow-hidden scroll-mt-8">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-[#D4A843]/5 blur-3xl pointer-events-none" />
        <div className="container mx-auto px-4 max-w-2xl relative z-10">
          <Eyebrow light>{c.form.eyebrow}</Eyebrow>
          <h2 className="font-serif heading-fluid-2 text-white">{c.form.title}</h2>
          <p className="mt-4 mb-10 text-white/70">{c.form.subtitle}</p>
          <AiLeadForm lang={lang} c={c.form} />
          <div className="mt-8 text-center">
            <a
              href={aiWhatsAppUrl(lang)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-semibold text-white/80 hover:text-white transition-colors"
            >
              <MessageCircle className="w-4 h-4 text-[#25D366]" />
              {c.form.orWhatsApp} +57 350 205 3147
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1a0f40] py-8">
        <div className="container mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/50">
          <p>
            {c.footer.by} <span className="text-white/80">77 Rentals</span> · © {new Date().getFullYear()}
          </p>
          <Link to="/" className="hover:text-white transition-colors">
            {c.footer.rentals} →
          </Link>
        </div>
      </footer>

      <WhatsAppButton href={aiWhatsAppUrl(lang)} />
    </div>
  );
};

export default Ai;
