import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Loader2, Plus, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

const WEB3FORMS_KEY = '6979f913-1573-41ce-bbdd-1df63fa27f73';
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB soft warning threshold

interface GuestRow {
  fullName: string;
  idNumber: string;
  idFile: File | null;
}

const emptyRow = (): GuestRow => ({ fullName: '', idNumber: '', idFile: null });

export default function CompletarDatos() {
  const [searchParams] = useSearchParams();
  const reservationCode = searchParams.get('res') || '';

  useEffect(() => {
    const metaRobots = document.createElement('meta');
    metaRobots.name = 'robots';
    metaRobots.content = 'noindex, nofollow';
    document.head.appendChild(metaRobots);
    const previousTitle = document.title;
    document.title = 'Completa tus datos — 77Rentals';
    return () => {
      document.head.removeChild(metaRobots);
      document.title = previousTitle;
    };
  }, []);

  const [guests, setGuests] = useState<GuestRow[]>([emptyRow()]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const addGuest = () => setGuests((g) => [...g, emptyRow()]);
  const removeGuest = (index: number) => setGuests((g) => g.filter((_, i) => i !== index));
  const updateGuest = (index: number, patch: Partial<GuestRow>) =>
    setGuests((g) => g.map((row, i) => (i === index ? { ...row, ...patch } : row)));

  const oversizedFile = guests.some((g) => g.idFile && g.idFile.size > MAX_FILE_SIZE);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('access_key', WEB3FORMS_KEY);
      formData.append('subject', `Datos de huéspedes — Reserva ${reservationCode || 'sin código'}`);
      formData.append('from_name', '77Rentals — Registro de huéspedes');
      formData.append('reservation_code', reservationCode);

      guests.forEach((g, i) => {
        formData.append(`guest_${i + 1}_name`, g.fullName);
        formData.append(`guest_${i + 1}_id`, g.idNumber);
        if (g.idFile) formData.append(`guest_${i + 1}_document`, g.idFile);
      });

      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        setSuccess(true);
      } else {
        setError('Hubo un error al enviar tus datos. Por favor intenta de nuevo.');
      }
    } catch {
      setError('Hubo un error al enviar tus datos. Por favor intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1a0f40] via-[#2D1B69] to-[#4B0082] flex items-center justify-center px-4">
        <div className="text-center max-w-md mx-auto">
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-[#D4A843] mb-3">¡Datos recibidos!</h1>
          <p className="text-white/85">Gracias por completar la información. Nos pondremos en contacto antes de tu llegada.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a0f40] via-[#2D1B69] to-[#4B0082] py-16 px-4">
      <div className="container mx-auto max-w-2xl">
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-center text-white mb-2">
          Completa tus datos
        </h1>
        <p className="text-center text-white/60 text-sm mb-8">
          Necesitamos el nombre y número de identificación de cada huésped para el registro de tu reserva. La foto del documento es opcional.
        </p>

        <form
          onSubmit={handleSubmit}
          className="bg-white/10 backdrop-blur-xl border border-white/15 rounded-2xl p-6 md:p-10 shadow-[0_8px_32px_rgba(0,0,0,0.3)] space-y-6"
        >
          {reservationCode && (
            <div className="text-center text-sm text-[#D4A843] font-medium">
              Reserva: {reservationCode}
            </div>
          )}

          <div className="space-y-4">
            {guests.map((g, i) => (
              <div key={i} className="border border-white/15 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-white/70">Huésped {i + 1}</Label>
                  {guests.length > 1 && (
                    <Button type="button" variant="ghost" size="icon" onClick={() => removeGuest(i)}>
                      <Trash2 className="h-4 w-4 text-white/60" />
                    </Button>
                  )}
                </div>
                <Input
                  placeholder="Nombre completo"
                  value={g.fullName}
                  onChange={(e) => updateGuest(i, { fullName: e.target.value })}
                  required
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                />
                <Input
                  placeholder="Número de identificación (C.C. / Pasaporte)"
                  value={g.idNumber}
                  onChange={(e) => updateGuest(i, { idNumber: e.target.value })}
                  required
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                />
                <div>
                  <Label className="block text-white/50 text-xs mb-1">Foto del documento (opcional)</Label>
                  <Input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={(e) => updateGuest(i, { idFile: e.target.files?.[0] || null })}
                    className="bg-white/10 border-white/20 text-white file:text-white"
                  />
                  {g.idFile && g.idFile.size > MAX_FILE_SIZE && (
                    <p className="text-amber-300 text-xs mt-1">
                      Este archivo es grande y podría fallar al enviarse — si es posible, usa una imagen más liviana.
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full border-white/25 text-white/85 hover:bg-white/10"
            onClick={addGuest}
          >
            <Plus className="h-4 w-4 mr-2" /> Agregar otro huésped
          </Button>

          {error && <p className="text-red-400 text-sm text-center">{error}</p>}

          <Button
            type="submit"
            disabled={loading || oversizedFile}
            size="lg"
            className="w-full bg-[#D4A843] hover:bg-[#c49a3a] text-[#2D1B69] font-bold text-base rounded-full shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Enviando...
              </>
            ) : (
              'Enviar datos →'
            )}
          </Button>

          <p className="text-center text-white/40 text-xs">
            Tu documento será usado únicamente para el registro de tu reserva.
          </p>
        </form>
      </div>
    </div>
  );
}
