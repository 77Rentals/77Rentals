import { useLanguage } from '@/contexts/LanguageContext';
import { Globe } from 'lucide-react';

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-2 p-2 border border-white/20 rounded-lg">
      <Globe size={16} className="text-white/60" />
      <button
        onClick={() => setLanguage('es')}
        className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
          language === 'es'
            ? 'bg-white/20 text-white'
            : 'text-white/60 hover:text-white'
        }`}
      >
        ES
      </button>
      <button
        onClick={() => setLanguage('en')}
        className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
          language === 'en'
            ? 'bg-white/20 text-white'
            : 'text-white/60 hover:text-white'
        }`}
      >
        EN
      </button>
    </div>
  );
}
