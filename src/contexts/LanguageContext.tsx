import React, { createContext, useContext, useState, ReactNode } from 'react';
import { translations, TranslationKey } from '@/data/translations';

type Language = 'es' | 'en';
export type { Language };

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: TranslationKey | string) => string;
  // Aliases for Partner Hub components
  language: Language;
  setLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLang] = useState<Language>('es');

  const t = (key: TranslationKey | string): string => {
    return (translations[lang] as Record<string, string>)[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, language: lang, setLanguage: setLang }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
};
