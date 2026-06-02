import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Menu, X, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import logo from '@/assets/logo77.jpeg';

const Navbar = () => {
  const { lang, setLang, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '#apartments', label: t('nav.apartments') },
    { href: '#about', label: t('nav.about') },
    { href: '#management', label: t('nav.management') },
    { href: '#contact', label: t('nav.contact') },
    { href: '/partner-hub', label: 'Partner Hub' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-[#2D1B69]/98 backdrop-blur-xl shadow-lg shadow-black/20 border-b border-white/10'
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between h-18 py-3">
        <a href="#" className="flex items-center group">
          <img
            src={logo}
            alt="77 Rentals"
            className="h-12 w-auto transition-transform duration-300 group-hover:scale-105"
          />
        </a>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-7">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-white/75 hover:text-[#D4A843] transition-colors duration-200 text-sm font-medium tracking-wide"
            >
              {link.label}
            </a>
          ))}
          <button
            onClick={() => setLang(lang === 'es' ? 'en' : 'es')}
            className="flex items-center gap-1.5 text-white/75 hover:text-[#D4A843] transition-colors duration-200 text-sm font-medium"
          >
            <Globe className="w-4 h-4" />
            {lang === 'es' ? 'EN' : 'ES'}
          </button>
          <Button
            asChild
            className="bg-[#D4A843] text-white hover:bg-[#D4A843]/90 font-semibold text-sm px-5 h-9 rounded-full shadow-md shadow-[#D4A843]/20 transition-all duration-300 hover:shadow-lg hover:shadow-[#D4A843]/30"
          >
            <a href="#reservation">{t('nav.reserve')}</a>
          </Button>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-white p-2 -mr-2"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-[#2D1B69]/98 backdrop-blur-xl border-t border-white/10 px-4 pb-5 pt-2">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="flex py-3 text-white/80 hover:text-[#D4A843] transition-colors text-sm font-medium border-b border-white/5 last:border-0"
              onClick={() => setIsOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <button
            onClick={() => { setLang(lang === 'es' ? 'en' : 'es'); setIsOpen(false); }}
            className="flex items-center gap-1.5 py-3 text-white/80 hover:text-[#D4A843] transition-colors text-sm font-medium w-full border-b border-white/5"
          >
            <Globe className="w-4 h-4" />
            {lang === 'es' ? 'English' : 'Español'}
          </button>
          <Button
            asChild
            className="w-full mt-4 bg-[#D4A843] text-white hover:bg-[#D4A843]/90 font-semibold rounded-full"
          >
            <a href="#reservation" onClick={() => setIsOpen(false)}>{t('nav.reserve')}</a>
          </Button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
