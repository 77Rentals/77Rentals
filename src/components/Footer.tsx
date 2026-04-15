import { useLanguage } from '@/contexts/LanguageContext';
import { Mail, Phone, MapPin, Instagram, Facebook } from 'lucide-react';
import logo from '@/assets/logo77.jpeg';

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer id="contact" className="bg-primary pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div>
            <img src={logo} alt="77 Rentals" className="h-16 w-auto mb-4" />
            <p className="text-primary-foreground/60 text-sm leading-relaxed">
              Luxury vacation rentals in Colombia's most beautiful cities.
            </p>
          </div>

          <div>
            <h4 className="text-secondary font-semibold uppercase tracking-widest text-sm mb-4">{t('footer.destinations')}</h4>
            <ul className="space-y-2 text-primary-foreground/60 text-sm">
              <li className="flex items-center gap-2"><MapPin className="w-4 h-4 shrink-0" /> Cartagena</li>
              <li className="flex items-center gap-2"><MapPin className="w-4 h-4 shrink-0" /> Santa Marta</li>
              <li className="flex items-center gap-2"><MapPin className="w-4 h-4 shrink-0" /> Bogotá</li>
            </ul>
          </div>

          <div>
            <h4 className="text-secondary font-semibold uppercase tracking-widest text-sm mb-4">{t('footer.contact')}</h4>
            <ul className="space-y-2 text-primary-foreground/60 text-sm">
              <li className="flex items-center gap-2"><Mail className="w-4 h-4 shrink-0" /> team@77rentals.com</li>
              <li className="flex items-center gap-2"><Phone className="w-4 h-4 shrink-0" /> +57 304 673 6241</li>
            </ul>
          </div>

          <div>
            <h4 className="text-secondary font-semibold uppercase tracking-widest text-sm mb-4">{t('footer.links')}</h4>
            <div className="flex gap-3">
              <a href="https://www.instagram.com/co77rentals/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-secondary/20 transition-colors">
                <Instagram className="w-5 h-5 text-primary-foreground" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-secondary/20 transition-colors">
                <Facebook className="w-5 h-5 text-primary-foreground" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/10 pt-6 text-center">
          <p className="text-primary-foreground/40 text-sm">{t('footer.rights')}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
