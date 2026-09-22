import { useState } from 'react';
import { Loader2, CheckCircle2 } from 'lucide-react';
import { aiWhatsAppUrl, type AiContent, type AiLang } from './content';

// Same Web3Forms inbox as the rentals ContactForm; the subject line keeps AI
// leads separate from booking inquiries.
const WEB3FORMS_KEY = '6979f913-1573-41ce-bbdd-1df63fa27f73';

const fieldClass =
  'w-full rounded-xl bg-white/10 border border-white/20 px-4 py-3 text-sm text-white placeholder:text-white/50 hover:border-white/40 focus:outline-none focus:border-[#D4A843]/70 transition-colors';

const AiLeadForm = ({ lang, c }: { lang: AiLang; c: AiContent['form'] }) => {
  const [values, setValues] = useState({
    name: '',
    company: '',
    role: '',
    size: '',
    track: '',
    problem: '',
    phone: '',
    email: '',
  });
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  const set = (key: keyof typeof values) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setValues((v) => ({ ...v, [key]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          subject: `Nuevo lead de consultoría IA: ${values.company}`,
          from_name: '77Rentals.com/ai',
          name: values.name,
          email: values.email,
          phone: values.phone,
          company: values.company,
          role: values.role,
          company_size: values.size,
          track: values.track,
          problem: values.problem,
          language: lang,
          data_consent: 'Sí (Ley 1581 de 2012)',
        }),
      });
      const data = await res.json();
      if (data.success) setSent(true);
      else setError(c.error);
    } catch {
      setError(c.error);
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="bg-white/10 backdrop-blur-xl border border-white/15 rounded-2xl p-8 md:p-10 text-center">
        <CheckCircle2 className="w-12 h-12 text-[#D4A843] mx-auto mb-4" />
        <h3 className="font-serif text-2xl text-white mb-2">{c.successTitle}</h3>
        <p className="text-white/70 mb-6">{c.successBody}</p>
        <a
          href={aiWhatsAppUrl(lang)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center rounded-full bg-[#25D366] hover:bg-[#1ebe5d] px-6 py-3 text-sm font-bold text-white transition-colors"
        >
          {c.orWhatsApp} WhatsApp
        </a>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white/10 backdrop-blur-xl border border-white/15 rounded-2xl p-6 md:p-10 shadow-[0_8px_32px_rgba(0,0,0,0.3)] space-y-4"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <input className={fieldClass} placeholder={c.name} aria-label={c.name} value={values.name} onChange={set('name')} required />
        <input className={fieldClass} placeholder={c.company} aria-label={c.company} value={values.company} onChange={set('company')} required />
        <input className={fieldClass} placeholder={c.role} aria-label={c.role} value={values.role} onChange={set('role')} />
        <select className={`${fieldClass} [color-scheme:dark]`} aria-label={c.size} value={values.size} onChange={set('size')} required>
          <option value="" disabled>{c.size}</option>
          {c.sizeOptions.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
      </div>
      <select className={`${fieldClass} [color-scheme:dark]`} aria-label={c.track} value={values.track} onChange={set('track')} required>
        <option value="" disabled>{c.track}</option>
        {c.trackOptions.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
      <textarea
        className={`${fieldClass} min-h-[110px] resize-y`}
        placeholder={c.problem}
        aria-label={c.problem}
        value={values.problem}
        onChange={set('problem')}
        required
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <input type="tel" className={fieldClass} placeholder={c.phone} aria-label={c.phone} value={values.phone} onChange={set('phone')} required />
        <input type="email" className={fieldClass} placeholder={c.email} aria-label={c.email} value={values.email} onChange={set('email')} required />
      </div>
      <label className="flex items-start gap-3 text-xs text-white/70 leading-relaxed cursor-pointer">
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          required
          className="mt-0.5 h-4 w-4 shrink-0 accent-[#D4A843]"
        />
        {c.consent}
      </label>

      {error && <p className="text-red-300 text-sm text-center">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full inline-flex items-center justify-center rounded-full bg-[#D4A843] hover:bg-[#c49a3a] py-3.5 text-base font-bold text-[#2D1B69] shadow-lg transition-colors disabled:opacity-60"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            {c.sending}
          </>
        ) : (
          `${c.submit} →`
        )}
      </button>
    </form>
  );
};

export default AiLeadForm;
