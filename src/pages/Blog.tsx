import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Clock, ArrowRight } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import { useLanguage } from '@/contexts/LanguageContext';
import { blogPath, blogPosts, formatPostDate } from '@/data/blog';
import { useBlogLang } from '@/hooks/useBlogLang';

const Blog = () => {
  const lang = useBlogLang();
  const { t } = useLanguage();

  useEffect(() => {
    const previousTitle = document.title;
    document.title = `${t('blog.title')} | 77 Rentals`;
    return () => {
      document.title = previousTitle;
    };
  }, [t]);

  return (
    <div className="min-h-screen bg-[#f8f7ff]">
      <Navbar langSwitchHref={{ es: blogPath('es'), en: blogPath('en') }} />

      <header className="bg-[#2D1B69] pt-32 pb-16 md:pt-40 md:pb-20">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-8 bg-[#D4A843]" />
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#D4A843]">{t('blog.eyebrow')}</span>
            <div className="h-px w-8 bg-[#D4A843]" />
          </div>
          <h1 className="font-serif heading-fluid-2 text-white">{t('blog.title')}</h1>
          <p className="mt-5 text-white/70 leading-relaxed">{t('blog.subtitle')}</p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-14 md:py-20">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {blogPosts.map((post) => {
            const c = post[lang];
            return (
              <Link
                key={post.slug}
                to={blogPath(lang, post.slug)}
                className="group flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm border border-[#2D1B69]/5 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="aspect-[16/10] overflow-hidden">
                  <img
                    src={post.cover}
                    alt=""
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-col flex-1 p-6">
                  <div className="flex flex-wrap gap-2 mb-3">
                    {c.tags.map((tag) => (
                      <span key={tag} className="text-[11px] font-semibold uppercase tracking-wider text-[#D4A843]">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h2 className="font-serif text-xl text-[#2D1B69] leading-snug mb-3">{c.title}</h2>
                  <p className="text-gray-600 text-sm leading-relaxed flex-1">{c.excerpt}</p>
                  <div className="mt-5 flex items-center justify-between text-xs text-gray-500">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      {post.readingMinutes} {t('blog.minRead')} · {formatPostDate(post.date, lang)}
                    </span>
                    <span className="flex items-center gap-1 font-semibold text-[#2D1B69] group-hover:text-[#D4A843] transition-colors">
                      {t('blog.readMore')} <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Blog;
