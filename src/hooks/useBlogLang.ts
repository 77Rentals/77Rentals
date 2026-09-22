import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { langFromPath } from '@/data/blog';

// On blog pages the URL decides the language (/blog/ vs /en/blog/) so each
// language has its own indexable address; the context just follows along.
export const useBlogLang = () => {
  const { pathname } = useLocation();
  const urlLang = langFromPath(pathname);
  const { lang, setLang } = useLanguage();

  useEffect(() => {
    if (lang !== urlLang) setLang(urlLang);
    document.documentElement.lang = urlLang;
  }, [lang, urlLang, setLang]);

  return urlLang;
};
