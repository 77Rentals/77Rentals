import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

const WEB3FORMS_KEY = '6979f913-1573-41ce-bbdd-1df63fa27f73';

const fieldClass =
  'bg-white/10 border-white/20 text-white placeholder:text-white/50 hover:border-white/40 focus-visible:border-[#D4A843]/60 transition-all duration-300';

const ContactForm = () => {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [destination, setDestination] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
          subject: 'Nueva consulta desde 77Rentals.com',
          from_name: '77Rentals Website',
          name: `${firstName} ${lastName}`,
          email,
          phone,
          destination,
          check_in: checkIn,
          check_out: checkOut,
        }),
      });

      const data = await res.json();
      if (data.success) {
        navigate('/gracias');
      } else {
        setError('Hubo un error. Por favor intenta de nuevo.');
      }
    } catch {
      setError('Hubo un error. Por favor intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contacto" className="relative py-20 bg-gradient-to-br from-[#2D1B69] to-[#4B0082] overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-[#D4A843]/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-white/3 blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 max-w-2xl relative z-10">
        {/* Header */}
        <p className="text-center text-[#D4A843] text-xs font-semibold tracking-widest uppercase mb-2">
          ¿Listo para tu próxima aventura?
        </p>
        <h2 className="text-3xl md:text-4xl font-serif font-bold text-center text-white mb-2">
          Contáctanos
        </h2>
        <div className="w-16 h-1 bg-[#D4A843] mx-auto mb-10 rounded-full" />

        {/* Form card */}
        <form
          onSubmit={handleSubmit}
          className="bg-white/10 backdrop-blur-xl border border-white/15 rounded-2xl p-6 md:p-10 shadow-[0_8px_32px_rgba(0,0,0,0.3)] space-y-4"
        >
          {/* Name row */}
          <div className="flex gap-4">
            <Input
              placeholder="Nombre"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              className={`${fieldClass} flex-1`}
            />
            <Input
              placeholder="Apellido"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              className={`${fieldClass} flex-1`}
            />
          </div>

          {/* Phone */}
          <Input
            type="tel"
            placeholder="WhatsApp / Teléfono"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            className={fieldClass}
          />

          {/* Email */}
          <Input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={fieldClass}
          />

          {/* Destination — free text */}
          <Input
            placeholder="¿A dónde quieres viajar?"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            required
            className={fieldClass}
          />

          {/* Dates row */}
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-white/50 text-xs mb-1 pl-1">Fecha llegada</label>
              <Input
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                required
                className={`${fieldClass} [color-scheme:dark]`}
              />
            </div>
            <div className="flex-1">
              <label className="block text-white/50 text-xs mb-1 pl-1">Fecha salida</label>
              <Input
                type="date"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                required
                className={`${fieldClass} [color-scheme:dark]`}
              />
            </div>
          </div>

          {/* Error message */}
          {error && (
            <p className="text-red-400 text-sm text-center">{error}</p>
          )}

          {/* Submit */}
          <Button
            type="submit"
            disabled={loading}
            size="lg"
            className="w-full bg-[#D4A843] hover:bg-[#c49a3a] text-[#2D1B69] font-bold text-base rounded-full shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Enviando...
              </>
            ) : (
              'Enviar consulta →'
            )}
          </Button>
        </form>
      </div>
    </section>
  );
};

export default ContactForm;
