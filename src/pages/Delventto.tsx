import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight, Baby, Bath, BedDouble, Briefcase, Car, ChevronDown, CircleDot, ConciergeBell, Dumbbell, Flame,
  MapPin, Maximize, ShieldCheck, Star, Sun, Users, Waves, Wifi,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import SectionHeading from '@/components/SectionHeading';
import { thumb } from '@/lib/image';
import { useBlogLang } from '@/hooks/useBlogLang';
import {
  DELVENTTO_GEO, MACONDO, delventtoContent, delventtoGallery, delventtoPath, whatsappUrl,
  type AmenityIcon,
} from '@/data/delventto';

const AMENITY_ICONS: Record<AmenityIcon, typeof Waves> = {
  pool: Waves, infinity: Waves, kids: Baby, indoor: Waves, jacuzzi: Bath, sauna: Flame,
  gym: Dumbbell, squash: CircleDot, coworking: Briefcase, bbq: Flame, rooftop: Sun,
  security: ShieldCheck, wifi: Wifi, parking: Car, reception: ConciergeBell,
};

const Delventto = () => {
  const lang = useBlogLang();
  const c = delventtoContent[lang];

  useEffect(() => {
    const previousTitle = document.title;
    document.title = c.metaTitle;
    return () => {
      document.title = previousTitle;
    };
  }, [c.metaTitle]);

  const macondoHref = '/propiedades/macondo-77rentals';

  return (
    <div className="min-h-screen bg-white">
      <Navbar langSwitchHref={{ es: delventtoPath('es'), en: delventtoPath('en') }} />

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <header className="relative min-h-[88vh] flex items-end overflow-hidden">
        <img
          src="/images/delventto/rooftop-infinity-pool.jpg"
          alt={c.alts.infinityPool}
          className="absolute inset-0 w-full h-full object-cover"
          width={1600}
          height={1087}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a0e3d]/90 via-[#1a0e3d]/40 to-[#1a0e3d]/20" />

        <div className="relative z-10 container mx-auto px-4 pb-16 md:pb-20 pt-32">
          <nav aria-label="Breadcrumb" className="mb-6 text-xs text-white/60">
            <ol className="flex flex-wrap items-center gap-1.5">
              <li><a href="/" className="hover:text-white transition-colors">{c.breadcrumb.home}</a></li>
              <li aria-hidden>/</li>
              <li aria-current="page" className="text-white/90">Delventto</li>
            </ol>
          </nav>

          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-5">
              <div className="h-px w-8 bg-[#D4A843]" />
              <span className="text-[#D4A843] text-xs font-semibold uppercase tracking-[0.2em]">{c.hero.eyebrow}</span>
            </div>
            <h1 className="font-serif text-white heading-fluid-1 mb-6">{c.hero.h1}</h1>
            <p className="text-white/80 text-base md:text-lg leading-relaxed max-w-2xl mb-9">{c.hero.subtitle}</p>
            <div className="flex flex-wrap items-center gap-4">
              <a
                href="#macondo"
                className="inline-flex items-center gap-2 bg-[#D4A843] hover:bg-[#c49a3a] text-[#2D1B69] font-semibold px-7 h-12 rounded-full transition-colors"
              >
                {c.hero.primaryCta} <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="#opciones"
                className="inline-flex items-center gap-2 text-white/85 hover:text-white text-sm font-medium transition-colors"
              >
                {c.hero.secondaryCta} <ChevronDown className="w-4 h-4" />
              </a>
            </div>
          </div>

          <dl className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-px bg-white/10 rounded-xl overflow-hidden max-w-4xl">
            {c.hero.facts.map((f) => (
              <div key={f.label} className="bg-[#1a0e3d]/60 backdrop-blur-sm px-5 py-4">
                <dt className="text-white/55 text-xs">{f.label}</dt>
                <dd className="text-white font-serif text-xl mt-0.5">{f.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </header>

      <main>
        {/* ── The building ───────────────────────────────────────────────── */}
        <section id="edificio" className="py-20 md:py-28">
          <div className="container mx-auto px-4 max-w-6xl grid md:grid-cols-[1.15fr_1fr] gap-12 lg:gap-16 items-center">
            <div>
              <SectionHeading variant="left" eyebrow={c.intro.eyebrow} heading={c.intro.h2} className="mb-6" />
              {c.intro.paragraphs.map((p) => (
                <p key={p.slice(0, 32)} className="text-muted-foreground leading-relaxed mb-4 max-w-prose">{p}</p>
              ))}
            </div>
            <div className="relative">
              <img
                src="/images/delventto/building-facade.jpg"
                alt={c.alts.facade}
                loading="lazy"
                width={1080}
                height={1440}
                className="w-full aspect-[4/5] object-cover rounded-2xl"
              />
              <img
                src="/images/delventto/jacuzzi-800.webp"
                alt={c.alts.jacuzzi}
                loading="lazy"
                width={1600}
                height={1067}
                className="hidden md:block absolute -bottom-8 -left-10 w-56 aspect-[4/3] object-cover rounded-xl border-4 border-white shadow-xl"
              />
            </div>
          </div>
        </section>

        {/* ── Macondo, the #1 ────────────────────────────────────────────── */}
        <section id="macondo" className="py-20 md:py-28 bg-[#2D1B69] text-white scroll-mt-20">
          <div className="container mx-auto px-4 max-w-6xl grid lg:grid-cols-2 gap-12 items-center">
            <div className="grid grid-cols-2 gap-3">
              <img
                src="/images/delventto/macondo-balcony.jpg"
                alt={c.alts.macondoBalcony}
                loading="lazy"
                width={1400}
                height={933}
                className="col-span-2 w-full aspect-[16/10] object-cover rounded-2xl"
              />
              <img
                src="/images/delventto/macondo-bedroom-800.webp"
                alt={c.alts.macondoBedroom}
                loading="lazy"
                width={1400}
                height={933}
                className="w-full aspect-[4/3] object-cover rounded-xl"
              />
              <img
                src="/images/delventto/macondo-living-800.webp"
                alt={c.alts.macondoLiving}
                loading="lazy"
                width={1400}
                height={933}
                className="w-full aspect-[4/3] object-cover rounded-xl"
              />
            </div>

            <div>
              <SectionHeading
                variant="left"
                eyebrow={c.featured.eyebrow}
                heading={c.featured.h2}
                eyebrowClassName="text-[#D4A843]"
                headingClassName="text-white"
                ruleClassName="bg-[#D4A843]"
                className="mb-5"
              />

              <div className="flex flex-wrap items-center gap-3 mb-6">
                <span className="inline-flex items-center gap-1.5 bg-[#D4A843] text-[#2D1B69] text-sm font-bold px-3 py-1 rounded-full">
                  <Star className="w-3.5 h-3.5 fill-current" /> {MACONDO.score}/10
                </span>
                <span className="text-white/75 text-sm">{c.featured.ratingLabel}</span>
              </div>

              <p className="text-white/80 leading-relaxed mb-6">{c.featured.pitch}</p>

              <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-2.5 mb-7">
                {c.featured.highlights.map((h) => (
                  <li key={h} className="flex gap-2 text-sm text-white/85">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#D4A843] shrink-0" />
                    {h}
                  </li>
                ))}
              </ul>

              <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-white/70 mb-8">
                <span className="flex items-center gap-1.5"><Users className="w-4 h-4" />{MACONDO.guests} {c.units.guests}</span>
                <span className="flex items-center gap-1.5"><BedDouble className="w-4 h-4" />1 {c.units.bedroom}</span>
                <span className="flex items-center gap-1.5"><Bath className="w-4 h-4" />1 {c.units.bathroom}</span>
                <span className="flex items-center gap-1.5"><Maximize className="w-4 h-4" />{MACONDO.sizeM2} m²</span>
              </div>

              {c.featured.quote && (
                <blockquote className="border-l-2 border-[#D4A843] pl-4 mb-8">
                  <p className="font-serif italic text-lg text-white/90">“{c.featured.quote.text}”</p>
                  <footer className="text-xs text-white/55 mt-1.5">{c.featured.quote.author}</footer>
                </blockquote>
              )}

              <div className="flex flex-wrap items-center gap-3">
                <Link
                  to={macondoHref}
                  className="inline-flex items-center gap-2 bg-[#D4A843] hover:bg-[#c49a3a] text-[#2D1B69] font-semibold px-6 h-12 rounded-full transition-colors"
                >
                  {c.featured.primaryCta} <ArrowRight className="w-4 h-4" />
                </Link>
                <a
                  href={whatsappUrl(c.whatsapp.macondo)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 border border-white/30 hover:border-white/70 text-white font-medium px-6 h-12 rounded-full transition-colors"
                >
                  {c.featured.secondaryCta}
                </a>
                <span className="text-white/60 text-sm">
                  {c.featured.priceFrom} <strong className="text-white">${MACONDO.priceFromUSD} USD</strong> {c.featured.perNight}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ── More options in the building ──────────────────────────────── */}
        <section id="opciones" className="py-20 md:py-28 bg-[#F8F6FF] scroll-mt-20">
          <div className="container mx-auto px-4 max-w-6xl">
            <SectionHeading
              variant="split"
              eyebrow={c.options.eyebrow}
              heading={c.options.h2}
              supporting={c.options.intro}
              eyebrowClassName="text-[#D4A843]"
              headingClassName="text-[#2D1B69]"
              ruleClassName="bg-[#D4A843]"
              className="mb-12"
            />

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {c.options.units.map((u) => (
                <article key={u.id} className="flex flex-col bg-white rounded-2xl border border-[#2D1B69]/10 p-7 md:p-8">
                  <div className="flex items-start justify-between gap-4 mb-5">
                    <div>
                      <p className="text-[#D4A843] text-xs font-semibold uppercase tracking-[0.15em] mb-1.5">{u.label}</p>
                      <h3 className="font-serif text-2xl text-[#2D1B69]">{u.name}</h3>
                    </div>
                    <span aria-hidden className="font-serif text-6xl leading-none text-[#2D1B69]/10">{u.letter}</span>
                  </div>
                  <p className="text-gray-600 leading-relaxed mb-5">{u.tagline}</p>
                  <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-[#2D1B69] mb-5 pb-5 border-b border-[#2D1B69]/10">
                    <span className="flex items-center gap-1.5"><Users className="w-4 h-4 text-[#D4A843]" />{u.guests}</span>
                    <span className="flex items-center gap-1.5"><BedDouble className="w-4 h-4 text-[#D4A843]" />{u.bedrooms}</span>
                    <span className="flex items-center gap-1.5"><Bath className="w-4 h-4 text-[#D4A843]" />{u.bathrooms}</span>
                    <span className="flex items-center gap-1.5"><Maximize className="w-4 h-4 text-[#D4A843]" />{u.size}</span>
                  </div>
                  <ul className="space-y-2 mb-7 flex-1">
                    {u.bullets.map((b) => (
                      <li key={b} className="flex gap-2 text-sm text-gray-700">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#D4A843] shrink-0" />
                        {b}
                      </li>
                    ))}
                  </ul>
                  <a
                    href={whatsappUrl(u.whatsapp)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 bg-[#2D1B69] hover:bg-[#3D1F5C] text-white font-semibold h-12 rounded-full transition-colors"
                  >
                    {u.cta} <ArrowRight className="w-4 h-4" />
                  </a>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ── Amenities + gallery ────────────────────────────────────────── */}
        <section id="amenidades" className="py-20 md:py-28">
          <div className="container mx-auto px-4 max-w-6xl">
            <SectionHeading
              variant="center"
              eyebrow={c.amenities.eyebrow}
              heading={c.amenities.h2}
              eyebrowClassName="text-[#D4A843]"
              headingClassName="text-[#2D1B69]"
              ruleClassName="bg-[#D4A843]"
              className="mb-6"
            />
            <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-14">{c.amenities.intro}</p>

            <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-7 mb-10">
              {c.amenities.items.map((a) => {
                const Icon = AMENITY_ICONS[a.icon];
                return (
                  <li key={a.label} className="flex gap-4">
                    <span className="w-10 h-10 rounded-full bg-[#F8F6FF] flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5 text-[#D4A843]" />
                    </span>
                    <div>
                      <h3 className="font-semibold text-[#2D1B69]">{a.label}</h3>
                      <p className="text-sm text-gray-600 leading-relaxed">{a.description}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
            <p className="text-sm text-gray-600 bg-[#F8F6FF] rounded-xl px-5 py-4 max-w-3xl mx-auto text-center mb-16">
              {c.amenities.braceletNote}
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {delventtoGallery.map((g, i) => (
                <figure
                  key={g.src}
                  className={`relative overflow-hidden rounded-xl ${i === 0 ? 'col-span-2 row-span-2' : ''}`}
                >
                  <img
                    src={i === 0 ? g.src : thumb(g.src)}
                    alt={c.alts[g.alt]}
                    loading="lazy"
                    width={g.width}
                    height={g.height}
                    className="w-full h-full object-cover aspect-[4/3] transition-transform duration-700 hover:scale-105"
                  />
                </figure>
              ))}
            </div>
          </div>
        </section>

        {/* ── Location ───────────────────────────────────────────────────── */}
        <section id="ubicacion" className="py-20 md:py-28 bg-[#F8F6FF]">
          <div className="container mx-auto px-4 max-w-6xl grid lg:grid-cols-2 gap-12">
            <div>
              <SectionHeading
                variant="left"
                eyebrow={c.location.eyebrow}
                heading={c.location.h2}
                supporting={c.location.intro}
                eyebrowClassName="text-[#D4A843]"
                headingClassName="text-[#2D1B69]"
                ruleClassName="bg-[#D4A843]"
                className="mb-8"
              />
              <p className="flex items-start gap-2 text-sm text-[#2D1B69] mb-8">
                <MapPin className="w-4 h-4 text-[#D4A843] mt-0.5 shrink-0" />
                {c.location.address}
              </p>
              <ul className="divide-y divide-[#2D1B69]/10 border-y border-[#2D1B69]/10">
                {c.location.places.map((p) => (
                  <li key={p.name} className="py-3.5 flex gap-4 justify-between">
                    <div>
                      <p className="font-semibold text-[#2D1B69] text-sm">{p.name}</p>
                      <p className="text-sm text-gray-600">{p.description}</p>
                    </div>
                    <span className="text-sm text-[#D4A843] font-semibold whitespace-nowrap">{p.distance}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl overflow-hidden min-h-[360px] lg:min-h-0 border border-[#2D1B69]/10">
              <iframe
                title={c.location.mapTitle}
                src={`https://www.google.com/maps?q=${DELVENTTO_GEO.lat},${DELVENTTO_GEO.lng}&z=15&output=embed`}
                className="w-full h-full min-h-[360px]"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </section>

        {/* ── FAQ ─────────────────────────────────────────────────────────
            Native <details> so every answer is in the prerendered HTML. */}
        <section id="preguntas" className="py-20 md:py-28">
          <div className="container mx-auto px-4 max-w-3xl">
            <SectionHeading
              variant="center"
              eyebrow={c.faq.eyebrow}
              heading={c.faq.h2}
              eyebrowClassName="text-[#D4A843]"
              headingClassName="text-[#2D1B69]"
              ruleClassName="bg-[#D4A843]"
              className="mb-12"
            />
            <div className="space-y-3">
              {c.faq.items.map((f) => (
                <details key={f.q} className="group bg-white rounded-xl border border-[#2D1B69]/10 px-6 open:shadow-sm">
                  <summary className="flex items-center justify-between gap-4 py-5 cursor-pointer list-none font-semibold text-[#2D1B69] [&::-webkit-details-marker]:hidden">
                    <h3 className="text-base">{f.q}</h3>
                    <ChevronDown className="w-4 h-4 shrink-0 transition-transform group-open:rotate-180" />
                  </summary>
                  <p className="pb-5 -mt-1 text-gray-600 leading-relaxed">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ── Final CTA ─────────────────────────────────────────────────── */}
        <section className="relative py-20 md:py-24 overflow-hidden">
          <img
            src="/images/delventto/rooftop-terrace.jpg"
            alt=""
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-[#1a0e3d]/80" />
          <div className="relative container mx-auto px-4 max-w-2xl text-center">
            <h2 className="font-serif heading-fluid-2 text-white mb-4">{c.finalCta.h2}</h2>
            <p className="text-white/75 leading-relaxed mb-9">{c.finalCta.text}</p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link
                to={macondoHref}
                className="inline-flex items-center gap-2 bg-[#D4A843] hover:bg-[#c49a3a] text-[#2D1B69] font-semibold px-7 h-12 rounded-full transition-colors"
              >
                {c.finalCta.primaryCta} <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href={whatsappUrl(c.whatsapp.general)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 border border-white/30 hover:border-white/70 text-white font-medium px-7 h-12 rounded-full transition-colors"
              >
                {c.finalCta.secondaryCta}
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Delventto;
