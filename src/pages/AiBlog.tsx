import { Fragment, useEffect, type ReactNode } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Clock, Lightbulb } from 'lucide-react';
import WhatsAppButton from '@/components/WhatsAppButton';
import { aiPath, aiWhatsAppUrl, type AiLang } from '@/components/ai/content';
import { formatPostDate, type BlogBlock } from '@/data/blog';
import { aiBlogCopy, aiBlogPath, aiBlogPosts, getAiPostBySlug } from '@/data/aiBlog';
import { useBlogLang } from '@/hooks/useBlogLang';

// Blog for the /ai consulting page, in the same light editorial style.
const INK = 'text-[#1B1235]';
const GRADIENT_TEXT = 'bg-gradient-to-r from-[#5B2D9E] via-[#8E44C9] to-[#D4A843] bg-clip-text text-transparent';
const PILL_DARK =
  'inline-flex items-center justify-center rounded-full bg-[#1B1235] px-6 py-3 text-sm font-bold text-white hover:bg-[#2D1B69] transition-colors';

const renderInline = (text: string): ReactNode =>
  text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith('**') && part.endsWith('**') ? (
      <strong key={i} className="font-bold text-[#1B1235]">{part.slice(2, -2)}</strong>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    ),
  );

const Shell = ({ lang, switchHref, children }: { lang: AiLang; switchHref: string; children: ReactNode }) => {
  const c = aiBlogCopy[lang];
  return (
    <div className={`ai-page min-h-screen bg-[#FAF9F5] ${INK}`}>
      <header className="sticky top-0 z-40 bg-[#FAF9F5]/85 backdrop-blur border-b border-[#1B1235]/[0.06]">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to={aiPath(lang)} className="text-lg font-extrabold tracking-tight">
            77<span className={GRADIENT_TEXT}> IA</span>
          </Link>
          <nav className="flex items-center gap-5 text-sm font-semibold">
            <Link to={aiPath(lang)} className="hidden sm:inline text-[#1B1235]/70 hover:text-[#1B1235]">{c.backToAi}</Link>
            <Link to={switchHref} className="text-[#1B1235]/70 hover:text-[#1B1235]">{lang === 'es' ? 'EN' : 'ES'}</Link>
            <a href={aiWhatsAppUrl(lang)} target="_blank" rel="noopener noreferrer" className={PILL_DARK + ' !px-5 !py-2'}>
              WhatsApp
            </a>
          </nav>
        </div>
      </header>
      {children}
      <footer className="bg-[#140d28] py-8 text-center text-xs text-white/50">
        <Link to={aiPath(lang)} className="hover:text-white">77 Rentals · {c.backToAi}</Link> · © {new Date().getFullYear()}
      </footer>
      <WhatsAppButton href={aiWhatsAppUrl(lang)} />
    </div>
  );
};

export const AiBlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const lang = useBlogLang();
  const t = aiBlogCopy[lang];
  const post = getAiPostBySlug(slug);
  const c = post?.[lang];

  useEffect(() => {
    if (!c) return;
    const previousTitle = document.title;
    document.title = `${c.title} | 77 Rentals IA`;
    window.scrollTo(0, 0);
    return () => {
      document.title = previousTitle;
    };
  }, [c]);

  if (!post || !c) {
    return (
      <Shell lang={lang} switchHref={aiBlogPath(lang === 'es' ? 'en' : 'es')}>
        <main className="container mx-auto px-4 py-32 text-center">
          <p className="text-xl font-bold mb-6">{t.notFound}</p>
          <Link to={aiBlogPath(lang)} className={PILL_DARK}>← {t.back}</Link>
        </main>
      </Shell>
    );
  }

  const renderBlock = (block: BlogBlock, i: number) => {
    switch (block.type) {
      case 'h2':
        return <h2 key={i} className="text-2xl md:text-3xl font-extrabold tracking-[-0.02em] mt-12 mb-4">{block.text}</h2>;
      case 'h3':
        return <h3 key={i} className="text-lg font-bold mt-8 mb-3">{block.text}</h3>;
      case 'p':
        return <p key={i} className="text-[#1B1235]/75 leading-relaxed mb-5">{renderInline(block.text)}</p>;
      case 'ul':
        return (
          <ul key={i} className="mb-6 space-y-2.5">
            {block.items.map((item, j) => (
              <li key={j} className="flex gap-3 text-[#1B1235]/75 leading-relaxed">
                <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#8E44C9]" />
                <span>{renderInline(item)}</span>
              </li>
            ))}
          </ul>
        );
      case 'tip':
        return (
          <aside key={i} className="my-8 rounded-2xl bg-[#F3F0E8] p-6">
            <p className="flex items-center gap-2 font-bold mb-2">
              <Lightbulb className="w-5 h-5 text-[#D4A843]" /> {block.title}
            </p>
            <p className="text-[#1B1235]/75 leading-relaxed">{renderInline(block.text)}</p>
          </aside>
        );
      case 'cta':
        return (
          <aside key={i} className="my-12 rounded-3xl bg-[#1B1235] p-8 text-center">
            <h2 className="text-2xl font-extrabold text-white mb-3">{t.ctaTitle}</h2>
            <p className="text-white/70 leading-relaxed mb-6 max-w-xl mx-auto">{t.ctaText}</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href={aiWhatsAppUrl(lang, c.title)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-full bg-[#25D366] hover:bg-[#1ebe5d] px-6 py-3 text-sm font-bold text-white transition-colors"
              >
                {t.ctaButton}
              </a>
              <Link to={`${aiPath(lang)}#servicios`} className="inline-flex items-center justify-center rounded-full border border-white/30 px-6 py-3 text-sm font-bold text-white hover:bg-white/10">
                {t.ctaSecondary}
              </Link>
            </div>
          </aside>
        );
    }
  };

  const others = aiBlogPosts.filter((p) => p.slug !== post.slug).slice(0, 2);

  return (
    <Shell lang={lang} switchHref={aiBlogPath(lang === 'es' ? 'en' : 'es', post.slug)}>
      <main className="container mx-auto px-4 max-w-3xl py-14 md:py-20">
        <Link to={aiBlogPath(lang)} className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#1B1235]/60 hover:text-[#1B1235] mb-8">
          <ArrowLeft className="w-4 h-4" /> {t.back}
        </Link>
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#8E44C9] mb-4">{c.tags.join(' · ')}</p>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-[-0.03em] leading-[1.08]">{c.title}</h1>
        <p className="mt-5 flex items-center gap-1.5 text-sm text-[#1B1235]/50">
          <Clock className="w-4 h-4" /> {post.readingMinutes} {t.minRead} · {formatPostDate(post.date, lang)}
        </p>

        <article className="mt-10 text-[17px]">
          <p className="text-xl text-[#1B1235]/70 leading-relaxed mb-8">{c.excerpt}</p>
          {c.body.map(renderBlock)}

          {post.sources.length > 0 && (
            <footer className="mt-12 pt-6 border-t border-[#1B1235]/10">
              <h2 className="text-xs font-bold uppercase tracking-widest text-[#1B1235]/40 mb-3">{t.sources}</h2>
              <ol className="space-y-1.5 text-sm list-decimal pl-5 text-[#1B1235]/55">
                {post.sources.map((s) => (
                  <li key={s.url}>
                    <a href={s.url} target="_blank" rel="noopener noreferrer" className="hover:text-[#1B1235] underline underline-offset-2 break-words">
                      {s.title}
                    </a>
                  </li>
                ))}
              </ol>
            </footer>
          )}
        </article>

        {others.length > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl font-extrabold mb-6">{t.more}</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {others.map((p) => (
                <Link key={p.slug} to={aiBlogPath(lang, p.slug)} className="rounded-2xl bg-white border border-[#1B1235]/[0.07] p-5 hover:shadow-lg transition-shadow">
                  <p className="font-bold leading-snug">{p[lang].title}</p>
                  <p className="mt-2 text-xs text-[#1B1235]/50">{p.readingMinutes} {t.minRead}</p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
    </Shell>
  );
};

const AiBlog = () => {
  const lang = useBlogLang();
  const t = aiBlogCopy[lang];

  useEffect(() => {
    const previousTitle = document.title;
    document.title = `${t.title} | 77 Rentals IA`;
    return () => {
      document.title = previousTitle;
    };
  }, [t]);

  return (
    <Shell lang={lang} switchHref={aiBlogPath(lang === 'es' ? 'en' : 'es')}>
      <main className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#8E44C9] mb-4">{t.eyebrow}</p>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-[-0.035em] leading-[1.05]">
            <span className={GRADIENT_TEXT}>{t.title}</span>
          </h1>
          <p className="mt-5 text-lg text-[#1B1235]/65 leading-relaxed">{t.subtitle}</p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {aiBlogPosts.map((post) => {
            const c = post[lang];
            return (
              <Link
                key={post.slug}
                to={aiBlogPath(lang, post.slug)}
                className="group flex flex-col rounded-3xl bg-white border border-[#1B1235]/[0.07] p-7 hover:shadow-xl hover:-translate-y-1 transition-all"
              >
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#8E44C9] mb-3">{c.tags.join(' · ')}</p>
                <h2 className="text-xl font-extrabold leading-snug mb-3">{c.title}</h2>
                <p className="text-sm text-[#1B1235]/65 leading-relaxed flex-1">{c.excerpt}</p>
                <div className="mt-6 flex items-center justify-between text-xs text-[#1B1235]/50">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" /> {post.readingMinutes} {t.minRead}
                  </span>
                  <span className="flex items-center gap-1 font-bold text-[#1B1235] group-hover:text-[#8E44C9]">
                    {t.readMore} <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </main>
    </Shell>
  );
};

export default AiBlog;
