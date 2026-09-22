// Runs after `vite build` + the SSR build of src/entry-server.tsx.
// Writes a static HTML file per blog URL (dist/blog/<slug>/index.html, etc.)
// with the article already in the markup, plus dist/sitemap.xml. Apache serves
// these files directly; every other URL still falls back to the SPA.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const ssrDir = path.join(root, 'dist-ssr');

const { render, routes, sitemapEntries } = await import(
  pathToFileURL(path.join(ssrDir, 'entry-server.js')).href
);

const template = fs.readFileSync(path.join(dist, 'index.html'), 'utf8');

// Drop the generic SPA tags that each page replaces with its own.
const baseHead = template
  .replace(/\s*<!--\s*TODO[^>]*-->/g, '')
  .replace(/\s*<title>[\s\S]*?<\/title>/, '')
  .replace(/\s*<meta\s+name="description"[^>]*>/g, '')
  .replace(/\s*<meta\s+(property="og:[^"]+"|name="twitter:[^"]+")[^>]*>/g, '');

for (const url of routes) {
  const { html, head, lang } = render(url);
  const page = baseHead
    .replace(/<html lang="[^"]*">/, `<html lang="${lang}">`)
    .replace('</head>', `    ${head}\n  </head>`)
    .replace('<div id="root"></div>', `<div id="root">${html}</div>`);

  const outFile = path.join(dist, url, 'index.html');
  fs.mkdirSync(path.dirname(outFile), { recursive: true });
  fs.writeFileSync(outFile, page);
  console.log(`prerendered ${url}`);
}

const today = new Date().toISOString().slice(0, 10);
const staticPages = ['/'];
const urlXml = [
  ...staticPages.map((p) => `  <url><loc>https://77rentals.com${p}</loc><lastmod>${today}</lastmod></url>`),
  ...sitemapEntries().map(
    (e) =>
      `  <url>\n    <loc>${e.loc}</loc>\n    <lastmod>${e.lastmod}</lastmod>\n` +
      Object.entries(e.alternates)
        .map(([hl, href]) => `    <xhtml:link rel="alternate" hreflang="${hl}" href="${href}"/>`)
        .join('\n') +
      '\n  </url>',
  ),
];
fs.writeFileSync(
  path.join(dist, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urlXml.join('\n')}\n</urlset>\n`,
);
console.log('wrote sitemap.xml');

fs.rmSync(ssrDir, { recursive: true, force: true });
