// Build-time renderer for the blog (see scripts/prerender.mjs). Produces the
// HTML and <head> tags for each blog URL so crawlers get the full article
// without running JavaScript. The browser still boots the normal SPA on top.
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import { Route, Routes } from 'react-router-dom';
import { LanguageProvider } from '@/contexts/LanguageContext';
import Blog from '@/pages/Blog';
import BlogPost from '@/pages/BlogPost';
import Ai from '@/pages/Ai';
import { aiContent, aiPath } from '@/components/ai/content';
import { translations } from '@/data/translations';
import { SITE_URL, blogPath, blogPosts, langFromPath, type BlogPost as Post } from '@/data/blog';

type Lang = 'es' | 'en';

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const blogRoutes: string[] = (['es', 'en'] as Lang[]).flatMap((lang) => [
  blogPath(lang),
  ...blogPosts.map((p) => blogPath(lang, p.slug)),
]);

// The AI consulting landing page (/ai/, /en/ai/).
const aiRoutes: string[] = (['es', 'en'] as Lang[]).map((lang) => aiPath(lang));
const isAiRoute = (url: string) => aiRoutes.includes(url);

export const routes: string[] = [...blogRoutes, ...aiRoutes];

// Every page in both languages, with the date it last changed, for sitemap.xml.
export const sitemapEntries = () =>
  routes.map((url) => {
    const lang = langFromPath(url);
    if (isAiRoute(url)) {
      return {
        loc: SITE_URL + url,
        lastmod: new Date().toISOString().slice(0, 10),
        alternates: { es: SITE_URL + aiPath('es'), en: SITE_URL + aiPath('en'), 'x-default': SITE_URL + aiPath('es') },
      };
    }
    const slug = url.split('/').filter(Boolean).pop();
    const post = blogPosts.find((p) => p.slug === slug);
    const other: Lang = lang === 'es' ? 'en' : 'es';
    return {
      loc: SITE_URL + url,
      lastmod: post?.date ?? blogPosts[0]?.date,
      alternates: {
        [lang]: SITE_URL + url,
        [other]: SITE_URL + blogPath(other, post?.slug),
        'x-default': SITE_URL + blogPath('es', post?.slug),
      },
    };
  });

const aiHeadTags = (url: string, lang: Lang) => {
  const { title, description } = aiContent[lang].meta;
  const image = SITE_URL + '/images/bogota.jpg';
  return [
    `<title>${esc(title)}</title>`,
    `<meta name="description" content="${esc(description)}">`,
    `<link rel="canonical" href="${SITE_URL + url}">`,
    `<link rel="alternate" hreflang="es" href="${SITE_URL + aiPath('es')}">`,
    `<link rel="alternate" hreflang="en" href="${SITE_URL + aiPath('en')}">`,
    `<link rel="alternate" hreflang="x-default" href="${SITE_URL + aiPath('es')}">`,
    `<meta property="og:type" content="website">`,
    `<meta property="og:site_name" content="77 Rentals">`,
    `<meta property="og:locale" content="${lang === 'es' ? 'es_CO' : 'en_US'}">`,
    `<meta property="og:url" content="${SITE_URL + url}">`,
    `<meta property="og:title" content="${esc(title)}">`,
    `<meta property="og:description" content="${esc(description)}">`,
    `<meta property="og:image" content="${image}">`,
    `<meta name="twitter:card" content="summary_large_image">`,
    `<meta name="twitter:title" content="${esc(title)}">`,
    `<meta name="twitter:description" content="${esc(description)}">`,
    `<meta name="twitter:image" content="${image}">`,
  ].join('\n    ');
};

const headTags = (url: string, lang: Lang, post?: Post) => {
  const t = translations[lang] as Record<string, string>;
  const title = post ? `${post[lang].title} | 77 Rentals` : `${t['blog.title']} | 77 Rentals`;
  const description = post ? post[lang].metaDescription : t['blog.subtitle'];
  const image = SITE_URL + (post?.cover ?? '/images/cartagena.jpg');
  const alt = (l: Lang) => SITE_URL + blogPath(l, post?.slug);

  const tags = [
    `<title>${esc(title)}</title>`,
    `<meta name="description" content="${esc(description)}">`,
    `<link rel="canonical" href="${SITE_URL + url}">`,
    `<link rel="alternate" hreflang="es" href="${alt('es')}">`,
    `<link rel="alternate" hreflang="en" href="${alt('en')}">`,
    `<link rel="alternate" hreflang="x-default" href="${alt('es')}">`,
    `<meta property="og:type" content="${post ? 'article' : 'website'}">`,
    `<meta property="og:site_name" content="77 Rentals">`,
    `<meta property="og:locale" content="${lang === 'es' ? 'es_CO' : 'en_US'}">`,
    `<meta property="og:url" content="${SITE_URL + url}">`,
    `<meta property="og:title" content="${esc(title)}">`,
    `<meta property="og:description" content="${esc(description)}">`,
    `<meta property="og:image" content="${image}">`,
    `<meta name="twitter:card" content="summary_large_image">`,
    `<meta name="twitter:title" content="${esc(title)}">`,
    `<meta name="twitter:description" content="${esc(description)}">`,
    `<meta name="twitter:image" content="${image}">`,
  ];

  if (post) {
    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: post[lang].title,
      description,
      image,
      datePublished: post.date,
      dateModified: post.date,
      inLanguage: lang,
      mainEntityOfPage: SITE_URL + url,
      author: { '@type': 'Organization', name: '77 Rentals', url: SITE_URL },
      publisher: { '@type': 'Organization', name: '77 Rentals', url: SITE_URL },
    };
    // Escape "<" so article text can never close the script tag early.
    tags.push(
      `<script type="application/ld+json">${JSON.stringify(jsonLd).replace(/</g, '\\u003c')}</script>`,
    );
  }

  return tags.join('\n    ');
};

export const render = (url: string) => {
  const lang = langFromPath(url);
  const slug = url.split('/').filter(Boolean).pop();
  const post = blogPosts.find((p) => p.slug === slug);

  const html = renderToString(
    <LanguageProvider initialLang={lang}>
      <StaticRouter location={url}>
        <Routes>
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/en/blog" element={<Blog />} />
          <Route path="/en/blog/:slug" element={<BlogPost />} />
          <Route path="/ai" element={<Ai />} />
          <Route path="/en/ai" element={<Ai />} />
        </Routes>
      </StaticRouter>
    </LanguageProvider>,
  );

  return { html, head: isAiRoute(url) ? aiHeadTags(url, lang) : headTags(url, lang, post), lang };
};
