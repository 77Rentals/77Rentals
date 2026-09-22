import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, Check, MessageCircle, Plus, Sparkles } from 'lucide-react';
import logo from '@/assets/logo77.jpeg';
import WhatsAppButton from '@/components/WhatsAppButton';
import AiLeadForm from '@/components/ai/AiLeadForm';
import { AI_TOOLS, aiContent, aiPath, aiWhatsAppUrl, type AiLang } from '@/components/ai/content';
import { useBlogLang } from '@/hooks/useBlogLang';

// Light editorial palette: warm paper background, deep purple ink in place of
// black, and a purple-to-gold gradient reserved for accents.
const INK = 'text-[#1B1235]';
const MUTED = 'text-[#1B1235]/60';
const GRADIENT_TEXT = 'bg-gradient-to-r from-[#5B2D9E] via-[#8E44C9] to-[#D4A843] bg-clip-text text-transparent';
const CARD = 'bg-white rounded-3xl border border-[#1B1235]/[0.07]';
const PILL_DARK =
  'inline-flex items-center justify-center gap-2 rounded-full bg-[#1B1235] px-6 py-3 text-sm font-bold text-white hover:bg-[#2D1B69] transition-colors';

const Eyebrow = ({ children, light = false }: { children: React.ReactNode; light?: boolean }) => (
  <p className={`text-xs font-bold uppercase tracking-[0.22em] mb-4 ${light ? 'text-[#D4A843]' : 'text-[#8E44C9]'}`}>
    {children}
  </p>
);

const SectionTitle = ({ children, light = false, className = '' }: { children: React.ReactNode; light?: boolean; className?: string }) => (
  <h2
    className={`text-3xl md:text-5xl font-extrabold tracking-[-0.03em] leading-[1.08] ${light ? 'text-white' : INK} ${className}`}
  >
    {children}
  </h2>
);

// Small drawn "screens" for the case cards until real screenshots are added.
const CaseVisual = ({ index }: { index: number }) => {
  if (index === 0) {
    return (
      <div className="rounded-2xl bg-white p-5 shadow-2xl rotate-[-2deg]">
        <div className="h-2 w-24 rounded bg-[#1B1235]/80 mb-3" />
        {[90, 100, 80, 95, 60].map((w, i) => (
          <div key={i} className="h-1.5 rounded bg-[#1B1235]/10 mb-2" style={{ width: `${w}%` }} />
        ))}
        <div className="mt-5 flex items-end justify-between">
          <div>
            <p className="font-serif italic text-2xl text-[#2D1B69] leading-none">Firmado</p>
            <div className="mt-1 h-px w-28 bg-[#1B1235]/30" />
          </div>
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-[10px] font-bold text-emerald-700">✓ OK</span>
        </div>
      </div>
    );
  }
  if (index === 1) {
    return (
      <div className="rounded-2xl bg-white p-4 shadow-2xl rotate-[1.5deg] space-y-2">
        {[
          ['Apto 1204', '0,8421%'],
          ['Apto 803', '0,6150%'],
          ['Apto 1510', '0,9034%'],
          ['Apto 402', '0,5577%'],
        ].map(([unit, coef]) => (
          <div key={unit} className="flex items-center justify-between rounded-lg bg-[#FAF9F5] px-3 py-2">
            <span className="flex items-center gap-2 text-xs font-semibold text-[#1B1235]">
              <span className="h-4 w-4 rounded-full bg-[#8E44C9]/15 text-[#8E44C9] text-[9px] flex items-center justify-center">✓</span>
              {unit}
            </span>
            <span className="text-[11px] font-mono text-[#1B1235]/60">{coef}</span>
          </div>
        ))}
      </div>
    );
  }
  return (
    <div className="rounded-2xl bg-white p-4 shadow-2xl rotate-[-1deg]">
      <div className="h-20 rounded-xl bg-gradient-to-br from-[#5B2D9E] to-[#D4A843] mb-3" />
      <div className="flex gap-1.5 mb-2">
        <span className="rounded-full bg-[#1B1235]/5 px-2 py-0.5 text-[9px] font-bold text-[#1B1235]/70">ES</span>
        <span className="rounded-full bg-[#1B1235]/5 px-2 py-0.5 text-[9px] font-bold text-[#1B1235]/70">EN</span>
        <span className="rounded-full bg-[#D4A843]/20 px-2 py-0.5 text-[9px] font-bold text-[#8a6a1f]">SEO</span>
      </div>
      <div className="h-2 w-4/5 rounded bg-[#1B1235]/80 mb-2" />
      <div className="h-1.5 w-full rounded bg-[#1B1235]/10 mb-1.5" />
      <div className="h-1.5 w-2/3 rounded bg-[#1B1235]/10" />
    </div>
  );
};

const Ai = () => {
  const lang = useBlogLang();
  const c = aiContent[lang];
  const other: AiLang = lang === 'es' ? 'en' : 'es';
  const [track, setTrack] = useState<'business' | 'dev'>('business');
  const problems = track === 'business' ? c.problems.business : c.problems.dev;

  useEffect(() => {
    const previousTitle = document.title;
    document.title = c.meta.title;
    return () => {
      document.title = previousTitle;
    };
  }, [c.meta.title]);

  return (
    <div className={`ai-page min-h-screen bg-[#FAF9F5] ${INK}`}>
      {/* Nav */}
      <header className="sticky top-0 z-40 bg-[#FAF9F5]/85 backdrop-blur-md border-b border-[#1B1235]/[0.06]">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to={aiPath(lang)} className="flex items-center gap-2.5">
            <img src={logo} alt="77 Rentals" className="h-9 w-9 rounded-full object-cover" />
            <span className="font-extrabold tracking-tight text-lg">
              77<span className={GRADIENT_TEXT}> IA</span>
            </span>
          </Link>
          <nav className="flex items-center gap-6 text-sm font-semibold">
            <a href="#casos" className="hidden md:inline text-[#1B1235]/70 hover:text-[#1B1235]">{c.nav.work}</a>
            <a href="#servicios" className="hidden md:inline text-[#1B1235]/70 hover:text-[#1B1235]">{c.nav.services}</a>
            <a href="#proceso" className="hidden md:inline text-[#1B1235]/70 hover:text-[#1B1235]">{c.nav.howWeWork}</a>
            <Link
              to={aiPath(other)}
              className="text-xs font-bold text-[#1B1235]/60 hover:text-[#1B1235]"
              aria-label={other === 'en' ? 'English' : 'Español'}
            >
              {c.nav.switchLang}
            </Link>
            <a href="#contacto" className={PILL_DARK + ' !px-5 !py-2'}>
              {c.nav.cta}
            </a>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute -top-40 right-[-10%] w-[40rem] h-[40rem] rounded-full bg-[#8E44C9]/10 blur-3xl pointer-events-none" />
        <div className="absolute top-40 left-[-15%] w-[30rem] h-[30rem] rounded-full bg-[#D4A843]/10 blur-3xl pointer-events-none" />
        <div className="container mx-auto px-4 pt-20 pb-16 md:pt-32 md:pb-24 relative max-w-5xl text-center">
          <p className="ai-blur-in inline-flex items-center gap-2 rounded-full border border-[#1B1235]/10 bg-white/70 px-4 py-1.5 text-xs font-bold text-[#1B1235]/70 mb-8">
            <Sparkles className="w-3.5 h-3.5 text-[#8E44C9]" />
            {c.hero.eyebrow}
          </p>
          <h1 className="ai-blur-in text-[2.6rem] leading-[1.05] sm:text-6xl md:text-7xl font-extrabold tracking-[-0.045em]">
            {c.hero.titleA}
            <br />
            <span className={GRADIENT_TEXT}>{c.hero.titleB}</span>
          </h1>
          <p className="ai-blur-in [animation-delay:150ms] mt-8 text-lg md:text-xl leading-relaxed text-[#1B1235]/65 max-w-2xl mx-auto">
            {c.hero.subtitle}
          </p>
          <div className="ai-blur-in [animation-delay:300ms] mt-10 flex flex-col sm:flex-row gap-3 justify-center">
            <a href={aiWhatsAppUrl(lang)} target="_blank" rel="noopener noreferrer" className={PILL_DARK + ' !px-7 !py-3.5 !text-base'}>
              <MessageCircle className="w-5 h-5" />
              {c.hero.cta}
            </a>
            <a
              href="#casos"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-[#1B1235]/15 bg-white px-7 py-3.5 font-bold hover:border-[#1B1235]/40 transition-colors"
            >
              {c.hero.ctaSecondary}
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
          <p className="mt-8 text-sm text-[#1B1235]/45">{c.hero.location}</p>
        </div>

        {/* Tools marquee */}
        <div className="border-y border-[#1B1235]/[0.07] bg-white/50 py-6">
          <p className="text-center text-[11px] font-bold uppercase tracking-[0.2em] text-[#1B1235]/40 mb-4">{c.toolsLabel}</p>
          <div className="overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
            <div className="ai-marquee flex w-max gap-12">
              {[...AI_TOOLS, ...AI_TOOLS].map((tool, i) => (
                <span key={i} className="text-xl md:text-2xl font-extrabold tracking-tight text-[#1B1235]/30 whitespace-nowrap">
                  {tool}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Cases (proof first) */}
      <section id="casos" className="py-20 md:py-28 scroll-mt-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="max-w-3xl">
            <Eyebrow>{c.cases.eyebrow}</Eyebrow>
            <SectionTitle>{c.cases.title}</SectionTitle>
            <p className={`mt-5 text-lg ${MUTED}`}>{c.cases.subtitle}</p>
          </div>
          <div className="mt-14 grid gap-6 lg:grid-cols-3">
            {c.cases.items.map((item, i) => (
              <article key={item.title} className="group rounded-3xl overflow-hidden bg-[#1B1235] text-white flex flex-col">
                <div className="relative h-56 bg-gradient-to-br from-[#2D1B69] via-[#4B1F7A] to-[#1B1235] px-10 pt-10 overflow-hidden">
                  <div className="absolute -bottom-10 -right-10 w-48 h-48 rounded-full bg-[#D4A843]/20 blur-3xl" />
                  <div className="relative transition-transform duration-500 group-hover:-translate-y-2">
                    <CaseVisual index={i} />
                  </div>
                </div>
                <div className="p-7 flex flex-col flex-1">
                  <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#D4A843]">{item.tag}</p>
                  <h3 className="mt-3 text-xl font-extrabold tracking-tight">{item.title}</h3>
                  <p className="mt-3 font-semibold text-white/90">{item.result}</p>
                  <p className="mt-2 text-sm text-white/55 leading-relaxed">{item.body}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Service pillars */}
      <section id="servicios" className="pb-20 md:pb-28 scroll-mt-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="max-w-3xl">
            <Eyebrow>{c.pillars.eyebrow}</Eyebrow>
            <SectionTitle>{c.pillars.title}</SectionTitle>
            <p className={`mt-5 text-lg ${MUTED}`}>{c.pillars.subtitle}</p>
          </div>
          <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-6">
            {c.pillars.items.map((p, i) => (
              <article
                key={p.title}
                className={`${CARD} p-7 md:p-8 flex flex-col hover:shadow-[0_20px_60px_-20px_rgba(27,18,53,0.25)] hover:-translate-y-1 transition-all duration-300 ${
                  i < 2 ? 'lg:col-span-3' : 'lg:col-span-2'
                }`}
              >
                <p className="text-sm font-bold text-[#1B1235]/35">0{i + 1}</p>
                <h3 className="mt-3 text-2xl font-extrabold tracking-tight">{p.title}</h3>
                <p className={`mt-1 font-bold ${GRADIENT_TEXT}`}>{p.proof}</p>
                <p className={`mt-4 leading-relaxed ${MUTED}`}>{p.body}</p>
                <p className="mt-4 text-xs leading-relaxed text-[#1B1235]/45">{p.stack}</p>
                <div className="mt-6 pt-5 border-t border-[#1B1235]/[0.07] flex items-end justify-between gap-4 flex-1">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#1B1235]/40">{c.pillars.packageLabel}</p>
                    <p className="mt-1 font-extrabold">{p.packageName}</p>
                    <p className="text-sm text-[#1B1235]/55">{p.packageDetail}</p>
                  </div>
                  <a
                    href={aiWhatsAppUrl(lang, p.packageName)}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${c.pillars.cta}: ${p.packageName}`}
                    title={c.pillars.cta}
                    className="shrink-0 h-11 w-11 rounded-full bg-[#1B1235] text-white flex items-center justify-center hover:bg-[#8E44C9] transition-colors"
                  >
                    <ArrowUpRight className="w-5 h-5" />
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Problems, tabbed by track */}
      <section className="py-20 md:py-28 bg-[#F3F0E8]">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] items-end">
            <div>
              <Eyebrow>{c.problems.eyebrow}</Eyebrow>
              <SectionTitle>{c.problems.title}</SectionTitle>
              <p className={`mt-5 text-lg ${MUTED}`}>{c.problems.subtitle}</p>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {c.problems.stats.map((s) => (
                <div key={s.label} className={`${CARD} p-4 md:p-5`}>
                  <p className={`text-3xl md:text-4xl font-extrabold tracking-tight ${GRADIENT_TEXT}`}>{s.value}</p>
                  <p className="mt-2 text-xs leading-snug text-[#1B1235]/60">{s.label}</p>
                </div>
              ))}
              <p className="col-span-3 text-[11px] text-[#1B1235]/40">
                {c.problems.sourcesLabel}:{' '}
                {c.problems.sources.map((src, i) => (
                  <span key={src.url}>
                    {i > 0 && ' · '}
                    <a href={src.url} target="_blank" rel="noopener noreferrer" className="underline hover:text-[#1B1235]">
                      {src.title}
                    </a>
                  </span>
                ))}
              </p>
            </div>
          </div>

          <div className="mt-12 inline-flex rounded-full bg-white p-1 border border-[#1B1235]/[0.08]" role="tablist">
            {(['business', 'dev'] as const).map((key) => (
              <button
                key={key}
                role="tab"
                aria-selected={track === key}
                onClick={() => setTrack(key)}
                className={`rounded-full px-5 py-2.5 text-sm font-bold transition-colors ${
                  track === key ? 'bg-[#1B1235] text-white' : 'text-[#1B1235]/60 hover:text-[#1B1235]'
                }`}
              >
                {c.problems.tabs[key]}
              </button>
            ))}
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {problems.map((card) => (
              <article key={card.problem} className={`${CARD} p-6 flex flex-col`}>
                <span className="self-start rounded-full bg-[#8E44C9]/10 px-3 py-1 text-[11px] font-bold text-[#8E44C9]">
                  {card.offer}
                </span>
                <h3 className="mt-4 text-lg font-extrabold tracking-tight leading-snug">“{card.problem}”</h3>
                <p className="mt-2 text-sm text-[#1B1235]/50">{card.detail}</p>
                <p className="mt-4 pt-4 border-t border-[#1B1235]/[0.07] text-sm leading-relaxed text-[#1B1235]/80 flex-1">
                  <span className="font-bold">{c.problems.labels.solution}: </span>
                  {card.solution}
                </p>
                <a
                  href={aiWhatsAppUrl(lang, card.problem)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#128C4A] hover:text-[#0d6b38]"
                >
                  <MessageCircle className="w-4 h-4" />
                  {c.problems.labels.talk}
                  <ArrowRight className="w-4 h-4" />
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Numbers band */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4 max-w-6xl">
          <SectionTitle className="max-w-4xl">{c.numbers.title}</SectionTitle>
          <div className="mt-14 grid grid-cols-2 lg:grid-cols-4 border-t border-[#1B1235]/10">
            {c.numbers.items.map((n) => (
              <div key={n.label} className="pt-8 pr-6 pb-2">
                <p className={`text-5xl md:text-6xl font-extrabold tracking-[-0.04em] ${GRADIENT_TEXT}`}>{n.value}</p>
                <p className="mt-3 text-sm text-[#1B1235]/60 max-w-[14rem]">{n.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Founders program */}
      <section className="pb-20 md:pb-28">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="relative overflow-hidden rounded-[2rem] bg-[#1B1235] px-7 py-12 md:px-14 md:py-16 text-white">
            <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-[#8E44C9]/30 blur-3xl" />
            <div className="absolute -bottom-24 left-1/3 w-80 h-80 rounded-full bg-[#D4A843]/20 blur-3xl" />
            <div className="relative grid gap-10 lg:grid-cols-[1.3fr_1fr] items-center">
              <div>
                <Eyebrow light>{c.founders.eyebrow}</Eyebrow>
                <SectionTitle light>{c.founders.title}</SectionTitle>
                <p className="mt-5 text-lg text-white/65 leading-relaxed">{c.founders.body}</p>
              </div>
              <div>
                <ul className="space-y-3">
                  {c.founders.points.map((pt) => (
                    <li key={pt} className="flex items-start gap-3 text-white/85">
                      <Check className="w-5 h-5 mt-0.5 shrink-0 text-[#D4A843]" />
                      {pt}
                    </li>
                  ))}
                </ul>
                <a
                  href={aiWhatsAppUrl(lang, c.founders.eyebrow)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 font-bold text-[#1B1235] hover:bg-[#D4A843] transition-colors"
                >
                  {c.founders.cta}
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Process */}
      <section id="proceso" className="pb-20 md:pb-28 scroll-mt-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="max-w-3xl">
            <Eyebrow>{c.process.eyebrow}</Eyebrow>
            <SectionTitle>{c.process.title}</SectionTitle>
            <p className={`mt-5 text-lg ${MUTED}`}>{c.process.subtitle}</p>
          </div>
          <ol className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {c.process.steps.map((step, i) => (
              <li key={step.title} className={`${CARD} p-7`}>
                <p className={`text-4xl font-extrabold tracking-tight ${GRADIENT_TEXT}`}>0{i + 1}</p>
                <h3 className="mt-4 text-lg font-extrabold">{step.title}</h3>
                <p className="mt-1 text-xs font-bold uppercase tracking-wider text-[#8E44C9]">{step.duration}</p>
                <p className={`mt-3 text-sm leading-relaxed ${MUTED}`}>{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Responsible AI + FAQ */}
      <section className="py-20 md:py-28 bg-[#F3F0E8]">
        <div className="container mx-auto px-4 max-w-6xl grid gap-12 lg:grid-cols-[1fr_1.3fr]">
          <div>
            <Eyebrow>{c.responsible.eyebrow}</Eyebrow>
            <SectionTitle>{c.responsible.title}</SectionTitle>
            <p className={`mt-5 leading-relaxed ${MUTED}`}>{c.responsible.body}</p>
            <ul className="mt-6 space-y-3">
              {c.responsible.points.map((point) => (
                <li key={point} className="flex items-start gap-3 text-sm font-semibold">
                  <Check className="w-4 h-4 mt-0.5 shrink-0 text-[#8E44C9]" />
                  {point}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <Eyebrow>{c.faq.eyebrow}</Eyebrow>
            <div className={`${CARD} divide-y divide-[#1B1235]/[0.07] px-6`}>
              {c.faq.items.map((item) => (
                <details key={item.q} className="group py-5">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-bold">
                    {item.q}
                    <Plus className="w-5 h-5 shrink-0 text-[#8E44C9] transition-transform group-open:rotate-45" />
                  </summary>
                  <p className={`mt-3 text-sm leading-relaxed ${MUTED}`}>{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contacto" className="relative py-20 md:py-28 bg-[#1B1235] overflow-hidden scroll-mt-16">
        <div className="absolute top-0 right-0 w-[32rem] h-[32rem] rounded-full bg-[#8E44C9]/20 blur-3xl pointer-events-none" />
        <div className="container mx-auto px-4 max-w-6xl relative grid gap-12 lg:grid-cols-[1fr_1.2fr] items-start">
          <div>
            <Eyebrow light>{c.form.eyebrow}</Eyebrow>
            <SectionTitle light>{c.form.title}</SectionTitle>
            <p className="mt-5 text-lg text-white/60">{c.form.subtitle}</p>
            <a
              href={aiWhatsAppUrl(lang)}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex items-center gap-3 rounded-full bg-[#25D366] hover:bg-[#1ebe5d] px-6 py-3.5 font-bold text-white transition-colors"
            >
              <MessageCircle className="w-5 h-5" />
              +57 350 205 3147
            </a>
          </div>
          <AiLeadForm lang={lang} c={c.form} />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#140d28] py-8">
        <div className="container mx-auto px-4 max-w-6xl flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-white/45">
          <p>
            {c.footer.by} <span className="text-white/80 font-semibold">77 Rentals</span> · © {new Date().getFullYear()}
          </p>
          <p className="text-center">{c.footer.disclaimer}</p>
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
