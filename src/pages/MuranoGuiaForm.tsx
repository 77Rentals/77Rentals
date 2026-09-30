import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

const WEB3FORMS_KEY = '6979f913-1573-41ce-bbdd-1df63fa27f73';
const DRAFT_KEY = 'murano-guia-draft';

type Field =
  | { id: string; label: string; hint?: string; kind: 'text' | 'textarea'; placeholder?: string; half?: boolean }
  | { id: string; label: string; hint?: string; kind: 'select'; options: string[]; half?: boolean }
  | { kind: 'subtitle'; id: string; label: string };

const sections: { title: string; intro?: string; fields: Field[] }[] = [
  {
    title: 'Tú y el contacto',
    fields: [
      { id: 'nombre', label: 'Nombre que verá el huésped', kind: 'text', placeholder: 'Lina', half: true },
      { id: 'whatsapp', label: 'WhatsApp para huéspedes', kind: 'text', placeholder: '+57 300 000 0000', half: true },
      { id: 'horario_contacto', label: 'Horario en que respondes', hint: 'Y qué hacer si es una emergencia fuera de ese horario', kind: 'textarea' },
      { id: 'idiomas', label: 'Idiomas de la guía', kind: 'select', options: ['Español e inglés', 'Solo español', 'Solo inglés'], half: true },
      { id: 'tono', label: '¿Cómo quieres que suene la guía?', kind: 'select', options: ['Cálida y cercana', 'Elegante y breve', 'Divertida, estilo surf'], half: true },
    ],
  },
  {
    title: 'Llegada y registro en el edificio',
    fields: [
      { id: 'registro', label: '¿Qué pide la administración antes de llegar?', hint: 'Documentos, con cuántas horas de anticipación, a quién se envían', kind: 'textarea' },
      { id: 'entrega_llaves', label: '¿Cómo recibe el huésped las llaves?', hint: 'Recepción, caja de seguridad, persona que lo recibe, código', kind: 'textarea' },
      { id: 'manillas', label: 'Manillas o tarjetas de acceso', hint: '¿Cuántas se entregan? ¿Cuánto cuesta perderlas?', kind: 'textarea' },
      { id: 'checkin', label: 'Hora de check-in', kind: 'text', placeholder: '3:00 p.m.', half: true },
      { id: 'checkout', label: 'Hora de check-out', kind: 'text', placeholder: '11:00 a.m.', half: true },
      { id: 'early_late', label: 'Llegada temprana, salida tarde y guarda de maletas', kind: 'textarea' },
      { id: 'parqueadero', label: 'Parqueadero', hint: '¿Tienen celda? ¿Número? ¿Costo?', kind: 'textarea' },
    ],
  },
  {
    title: 'Reglas del Murano Elite',
    intro: 'Otros anfitriones del edificio publican estas reglas. Confírmalas o corrígelas.',
    fields: [
      { id: 'mascotas', label: '¿El edificio permite mascotas?', kind: 'select', options: ['', 'Sí', 'No', 'Sí, con condiciones (explico abajo)', 'No sé, voy a preguntar'], half: true },
      { id: 'visitas', label: '¿Se permiten visitas que no estén en la lista?', kind: 'select', options: ['', 'No', 'Sí', 'Sí, con registro', 'No sé, voy a preguntar'], half: true },
      { id: 'piscina40', label: 'Piscina del piso 40: horario y estado actual', hint: '¿Está funcionando? ¿Días de mantenimiento?', kind: 'textarea' },
      { id: 'piscina3', label: 'Piscina del piso 3: horario', hint: '¿Es cierto que martes, jueves y sábado es solo para propietarios?', kind: 'textarea' },
      { id: 'gimnasio', label: 'Gimnasio, billar, baño turco: horarios y reservas', kind: 'textarea' },
      { id: 'reglas_extra', label: 'Otras reglas', hint: 'Ruido, fumar, basuras, toallas de piscina', kind: 'textarea' },
    ],
  },
  {
    title: 'Cada apartamento',
    fields: [
      { kind: 'subtitle', id: 's1204', label: 'Apto 1204' },
      { id: 'wifi_1204', label: 'Red WiFi', kind: 'text', half: true },
      { id: 'wifi_pass_1204', label: 'Clave WiFi', kind: 'text', half: true },
      { id: 'notas_1204', label: 'Cómo usar: aire, TV, estufa, calentador, lavadora', kind: 'textarea' },
      { kind: 'subtitle', id: 's3504', label: 'Apto 3504' },
      { id: 'wifi_3504', label: 'Red WiFi', kind: 'text', half: true },
      { id: 'wifi_pass_3504', label: 'Clave WiFi', kind: 'text', half: true },
      { id: 'notas_3504', label: 'Cómo usar: aire, TV, estufa, calentador, lavadora, luces LED', kind: 'textarea' },
      { id: 'incluido', label: '¿Qué dejas para el huésped?', hint: 'Toallas de playa, café, agua, sombrilla, kit de bienvenida', kind: 'textarea' },
    ],
  },
  {
    title: 'Salida',
    fields: [
      { id: 'salida', label: '¿Qué debe hacer el huésped al salir?', hint: 'Llaves, manillas, basura, loza, aire apagado', kind: 'textarea' },
    ],
  },
  {
    title: 'Tus recomendaciones de Cartagena',
    fields: [
      { id: 'restaurantes', label: 'Restaurantes y cafés favoritos cerca', kind: 'textarea' },
      { id: 'tours', label: 'Tours, islas y pasadías que recomiendas', hint: 'Si tienes aliados, pon nombre y contacto', kind: 'textarea' },
      { id: 'servicios', label: 'Mercado, droguería y cajero cercanos', kind: 'textarea' },
      { id: 'traslados', label: 'Traslado del aeropuerto y limpieza extra', hint: 'Precio y cómo pedirlos', kind: 'textarea' },
    ],
  },
  {
    title: 'Emergencias',
    fields: [
      { id: 'emergencias', label: 'Contactos de emergencia', hint: 'Administración, portería, técnico, clínica cercana', kind: 'textarea' },
      { id: 'comentarios', label: '¿Algo más que quieras que esté en la guía?', kind: 'textarea' },
    ],
  },
];

const inputClass =
  'w-full bg-white border border-[#ddd6f3] rounded-lg px-3 py-2.5 text-[#1f1640] placeholder:text-[#9a93b5] focus:outline-none focus:ring-2 focus:ring-[#2D1B69]/40 focus:border-[#2D1B69]';

export default function MuranoGuiaForm() {
  const [values, setValues] = useState<Record<string, string>>(() => {
    try {
      return JSON.parse(localStorage.getItem(DRAFT_KEY) || '{}');
    } catch {
      return {};
    }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const meta = document.createElement('meta');
    meta.name = 'robots';
    meta.content = 'noindex, nofollow';
    document.head.appendChild(meta);
    const previousTitle = document.title;
    document.title = 'Guía de bienvenida Murano Elite — 77Rentals';
    return () => {
      document.head.removeChild(meta);
      document.title = previousTitle;
    };
  }, []);

  useEffect(() => {
    const t = setTimeout(() => {
      try {
        localStorage.setItem(DRAFT_KEY, JSON.stringify(values));
      } catch {
        /* storage unavailable */
      }
    }, 400);
    return () => clearTimeout(t);
  }, [values]);

  const set = (id: string, v: string) => setValues((s) => ({ ...s, [id]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const filled = Object.values(values).filter((v) => v.trim()).length;
    if (filled < 3) {
      setError('Llena al menos algunas preguntas antes de enviar.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('access_key', WEB3FORMS_KEY);
      formData.append('subject', `Guía de bienvenida Murano Elite — ${values.nombre || 'Lina'}`);
      formData.append('from_name', '77Rentals — Guía de bienvenida');
      for (const s of sections) {
        for (const f of s.fields) {
          if (f.kind === 'subtitle') continue;
          const v = values[f.id]?.trim();
          if (v) formData.append(`${s.title} · ${f.label}${f.id.endsWith('1204') ? ' (1204)' : f.id.endsWith('3504') ? ' (3504)' : ''}`, v);
        }
      }
      const res = await fetch('https://api.web3forms.com/submit', { method: 'POST', body: formData });
      const data = await res.json();
      if (data.success) {
        setSuccess(true);
        try {
          localStorage.removeItem(DRAFT_KEY);
        } catch {
          /* storage unavailable */
        }
      } else {
        setError('No se pudo enviar. Intenta de nuevo en un momento; tus respuestas siguen guardadas aquí.');
      }
    } catch {
      setError('No se pudo enviar. Revisa tu conexión e intenta de nuevo; tus respuestas siguen guardadas aquí.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1a0f40] via-[#2D1B69] to-[#4B0082] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <h1 className="text-3xl font-serif font-bold text-[#D4A843] mb-3">¡Gracias, Lina!</h1>
          <p className="text-white/85">Recibimos tus respuestas. Te escribimos cuando las guías de bienvenida del 1204 y el 3504 estén listas.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f7ff] text-[#1f1640]">
      <header className="bg-gradient-to-br from-[#1a0f40] via-[#2D1B69] to-[#4B0082] text-white">
        <div className="container mx-auto max-w-2xl px-4 py-12 md:py-16">
          <a href="/" className="font-serif text-xl text-[#D4A843]">77Rentals</a>
          <div className="flex items-center gap-2 mt-8 mb-4">
            <div className="h-px w-8 bg-[#D4A843]" />
            <span className="text-[#D4A843] text-xs font-semibold uppercase tracking-[0.2em]">Guía de bienvenida</span>
          </div>
          <h1 className="font-serif text-3xl md:text-4xl leading-tight mb-4">Hola Lina, armemos la guía de tus apartamentos</h1>
          <p className="text-white/80 leading-relaxed">
            Con estas respuestas hacemos una guía de bienvenida para el 1204 y otra para el 3504. Tarda unos 15 minutos. Si algo no aplica o no lo sabes, déjalo en blanco. Lo que escribes se guarda en este navegador mientras llenas.
          </p>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="container mx-auto max-w-2xl px-4 py-10 space-y-6">
        {sections.map((s) => (
          <fieldset key={s.title} className="bg-white border border-[#e4dff5] rounded-2xl p-5 md:p-7">
            <legend className="font-serif text-xl text-[#2D1B69] px-2">{s.title}</legend>
            {s.intro && <p className="text-sm text-[#5b5478] mb-4">{s.intro}</p>}
            <div className="grid sm:grid-cols-2 gap-4">
              {s.fields.map((f) =>
                f.kind === 'subtitle' ? (
                  <p key={f.id} className="sm:col-span-2 text-xs font-bold uppercase tracking-wider text-[#b08a2e] mt-2">{f.label}</p>
                ) : (
                  <label key={f.id} htmlFor={f.id} className={`flex flex-col gap-1.5 ${f.half ? '' : 'sm:col-span-2'}`}>
                    <span className="font-semibold text-sm">{f.label}</span>
                    {f.hint && <span className="text-xs text-[#5b5478] -mt-1">{f.hint}</span>}
                    {f.kind === 'textarea' ? (
                      <textarea id={f.id} rows={3} value={values[f.id] || ''} onChange={(e) => set(f.id, e.target.value)} className={inputClass} />
                    ) : f.kind === 'select' ? (
                      <select id={f.id} value={values[f.id] || f.options[0]} onChange={(e) => set(f.id, e.target.value)} className={inputClass}>
                        {f.options.map((o) => <option key={o} value={o}>{o || 'Elige una opción'}</option>)}
                      </select>
                    ) : (
                      <input id={f.id} value={values[f.id] || ''} placeholder={f.placeholder} onChange={(e) => set(f.id, e.target.value)} className={inputClass} />
                    )}
                  </label>
                ),
              )}
            </div>
          </fieldset>
        ))}

        {error && <p className="text-[#c2410c] text-sm text-center">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full h-13 py-3.5 bg-[#D4A843] hover:bg-[#c49a3a] text-[#2D1B69] font-bold rounded-full shadow-lg transition-colors disabled:opacity-60 flex items-center justify-center"
        >
          {loading ? (<><Loader2 className="w-4 h-4 mr-2 animate-spin" />Enviando...</>) : 'Enviar a 77Rentals →'}
        </button>
        <p className="text-center text-xs text-[#5b5478]">Tus respuestas solo se usan para armar las guías de bienvenida de tus apartamentos.</p>
      </form>
    </div>
  );
}
