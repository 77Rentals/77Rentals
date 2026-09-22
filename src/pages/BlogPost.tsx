import { Fragment, useEffect, type ReactNode } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Clock, Lightbulb } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { blogPath, blogPosts, formatPostDate, getPostBySlug, type BlogBlock } from '@/data/blog';
import { useBlogLang } from '@/hooks/useBlogLang';

const WHATSAPP_URL =
  'https://wa.me/573046736241?text=Hola%2077Rentals%2C%20le%C3%AD%20su%20blog%20y%20quisiera%20informaci%C3%B3n%20sobre%20hospedaje';

// Supports **bold** and *italic* only — that's all the copywriter agent emits.
const renderInline = (text: string): ReactNode =>
  text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g).map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="font-semibold text-[#2D1B69]">{part.slice(2, -2)}</strong>;
    }
    if (part.length > 2 && part.startsWith('*') && part.endsWith('*')) {
      return <em key={i}>{part.slice(1, -1)}</em>;
    }
    return <Fragment key={i}>{part}</Fragment>;
  });

const setMeta = (name: string, content: string) => {
  const el = document.querySelector<HTMLMetaElement>(`meta[name="${name}"]`);
  const previous = el?.content;
  if (el) el.content = content;
  return () => {
    if (el && previous !== undefined) el.content = previous;
  };
};

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const lang = useBlogLang();
  const { t } = useLanguage();
  const post = getPostBySlug(slug);
  const c = post?.[lang];

  useEffect(() => {
    if (!c) return;
    const previousTitle = document.title;
    document.title = `${c.title} | 77 Rentals`;
    const restoreMeta = setMeta('description', c.metaDescription);
    window.scrollTo(0, 0);
    return () => {
      document.title = previousTitle;
      restoreMeta();
    };
  }, [c]);

  if (!post || !c) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f7ff]">
        <div className="text-center">
          <p className="text-[#2D1B69] text-xl font-serif mb-4">{t('blog.notFound')}</p>
          <Button asChild className="bg-[#2D1B69] text-white rounded-full px-6">
            <Link to={blogPath(lang)}>← {t('blog.back')}</Link>
          </Button>
        </div>
      </div>
    );
  }

  const renderBlock = (block: BlogBlock, i: number) => {
    switch (block.type) {
      case 'h2':
        return <h2 key={i} className="font-serif text-2xl md:text-3xl text-[#2D1B69] mt-12 mb-4">{block.text}</h2>;
      case 'h3':
        return <h3 key={i} className="font-semibold text-lg text-[#2D1B69] mt-8 mb-3">{block.text}</h3>;
      case 'p':
        return <p key={i} className="text-gray-700 leading-relaxed mb-5">{renderInline(block.text)}</p>;
      case 'ul':
        return (
          <ul key={i} className="mb-6 space-y-2.5">
            {block.items.map((item, j) => (
              <li key={j} className="flex gap-3 text-gray-700 leading-relaxed">
                <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#D4A843]" />
                <span>{renderInline(item)}</span>
              </li>
            ))}
          </ul>
        );
      case 'tip':
        return (
          <aside key={i} className="my-8 rounded-2xl border border-[#D4A843]/30 bg-[#D4A843]/10 p-6">
            <p className="flex items-center gap-2 font-semibold text-[#2D1B69] mb-2">
              <Lightbulb className="w-5 h-5 text-[#D4A843]" /> {block.title}
            </p>
            <p className="text-gray-700 leading-relaxed">{renderInline(block.text)}</p>
          </aside>
        );
      case 'cta':
        return (
          <aside key={i} className="my-12 rounded-2xl bg-[#2D1B69] p-8 text-center">
            <h2 className="font-serif text-2xl text-white mb-3">{t('blog.ctaTitle')}</h2>
            <p className="text-white/70 leading-relaxed mb-6 max-w-xl mx-auto">{t('blog.ctaText')}</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild className="bg-[#D4A843] text-white hover:bg-[#D4A843]/90 rounded-full font-semibold px-6">
                <a href="/#apartments">{t('blog.ctaApartments')}</a>
              </Button>
              <Button asChild variant="outline" className="rounded-full border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white px-6">
                <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">{t('blog.ctaWhatsapp')}</a>
              </Button>
            </div>
          </aside>
        );
    }
  };

  const others = blogPosts.filter((p) => p.slug !== post.slug).slice(0, 2);

  return (
    <div className="min-h-screen bg-[#f8f7ff]">
      <Navbar langSwitchHref={{ es: blogPath('es', post.slug), en: blogPath('en', post.slug) }} />

      <header className="relative pt-32 pb-14 md:pt-44 md:pb-20">
        <img src={post.cover} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#2D1B69]/85 via-[#2D1B69]/75 to-[#2D1B69]/95" />
        <div className="relative container mx-auto px-4 max-w-3xl">
          <Link to={blogPath(lang)} className="inline-flex items-center gap-1.5 text-sm text-white/70 hover:text-[#D4A843] transition-colors mb-6">
            <ArrowLeft className="w-4 h-4" /> {t('blog.back')}
          </Link>
          <div className="flex flex-wrap gap-3 mb-4">
            {c.tags.map((tag) => (
              <span key={tag} className="text-xs font-semibold uppercase tracking-wider text-[#D4A843]">{tag}</span>
            ))}
          </div>
          <h1 className="font-serif text-3xl md:text-5xl text-white leading-tight">{c.title}</h1>
          <p className="mt-5 flex items-center gap-1.5 text-sm text-white/60">
            <Clock className="w-4 h-4" /> {post.readingMinutes} {t('blog.minRead')} · {formatPostDate(post.date, lang)}
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 max-w-3xl py-12 md:py-16">
        <article className="bg-white rounded-2xl shadow-sm border border-[#2D1B69]/5 px-5 py-8 sm:px-10 sm:py-12 text-[17px]">
          <p className="text-lg text-gray-600 leading-relaxed mb-8 border-l-4 border-[#D4A843] pl-4">{c.excerpt}</p>
          {c.body.map(renderBlock)}

          {post.sources.length > 0 && (
            <footer className="mt-12 pt-6 border-t border-gray-100">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">{t('blog.sources')}</h2>
              <ol className="space-y-1.5 text-sm list-decimal pl-5 text-gray-500">
                {post.sources.map((s) => (
                  <li key={s.url}>
                    <a href={s.url} target="_blank" rel="noopener noreferrer" className="hover:text-[#2D1B69] underline underline-offset-2 break-words">
                      {s.title}
                    </a>
                  </li>
                ))}
              </ol>
            </footer>
          )}
        </article>

        {others.length > 0 && (
          <section className="mt-14">
            <h2 className="font-serif text-2xl text-[#2D1B69] mb-6">{t('blog.more')}</h2>
            <div className="grid gap-6 sm:grid-cols-2">
              {others.map((p) => (
                <Link key={p.slug} to={blogPath(lang, p.slug)} className="group flex gap-4 bg-white rounded-xl p-4 shadow-sm border border-[#2D1B69]/5 hover:shadow-md transition-shadow">
                  <img src={p.cover} alt="" loading="lazy" className="w-24 h-24 rounded-lg object-cover shrink-0" />
                  <div>
                    <p className="font-serif text-[#2D1B69] leading-snug group-hover:text-[#D4A843] transition-colors">{p[lang].title}</p>
                    <p className="mt-1 text-xs text-gray-500">{p.readingMinutes} {t('blog.minRead')}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default BlogPost;
