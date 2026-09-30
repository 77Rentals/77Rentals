import { useEffect, useState } from 'react';
import { Check, Loader2, Plus, Trash2 } from 'lucide-react';
import { Card } from '@/components/ui/card';

const WEB3FORMS_KEY = '6979f913-1573-41ce-bbdd-1df63fa27f73';
const DRAFT_KEY = 'murano-guia-draft-v2';
const UNITS = ['1204', '3504'] as const;

type Palette = { id: string; name: string; desc: string; colors: string[]; header: string; text: string; accent: string; page: string };

const PALETTES: Palette[] = [
  { id: 'atardecer', name: 'Atardecer Caribe', desc: 'Naranjas y dorados, como el atardecer desde el 3504.', colors: ['#1F3A5F', '#E0624A', '#F28C38', '#F6C667', '#FDF3E1'], header: '#1F3A5F', text: '#FDF3E1', accent: '#F28C38', page: '#FDF3E1' },
  { id: 'surf', name: 'Surf azul', desc: 'Azules de mar y madera, como las tablas de surf.', colors: ['#0B3C5D', '#1D70A2', '#7EC8E3', '#D9A441', '#F4EBD9'], header: '#0B3C5D', text: '#F4EBD9', accent: '#D9A441', page: '#F4EBD9' },
  { id: 'murano', name: 'Vidrio de Murano', desc: 'Turquesa y ámbar, en honor al nombre del edificio.', colors: ['#0F4C5C', '#2A9D8F', '#E9C46A', '#F4A261', '#FAF6EE'], header: '#0F4C5C', text: '#FAF6EE', accent: '#E9C46A', page: '#FAF6EE' },
  { id: 'arena', name: 'Arena y coral', desc: 'Cálida y luminosa, de playa.', colors: ['#2E4756', '#C8553D', '#E9967A', '#F5E6D3', '#FFFFFF'], header: '#2E4756', text: '#F5E6D3', accent: '#E9967A', page: '#FFFBF6' },
  { id: 'colonial', name: 'Colonial Cartagena', desc: 'Las fachadas de colores del centro histórico.', colors: ['#4D9078', '#B4436C', '#F78154', '#F2C14E', '#FFF8E7'], header: '#4D9078', text: '#FFF8E7', accent: '#F2C14E', page: '#FFF8E7' },
  { id: 'bahia', name: 'Bahía de noche', desc: 'Azul profundo con detalles dorados. Elegante.', colors: ['#0D1B2A', '#1B263B', '#415A77', '#C9A227', '#E0E1DD'], header: '#0D1B2A', text: '#E0E1DD', accent: '#C9A227', page: '#EEF0F2' },
  { id: 'marmol', name: 'Mármol y oro', desc: 'Blanco, crema y dorado. Lujo sobrio.', colors: ['#2B2B2B', '#8C7B6B', '#D4A843', '#F1EDE6', '#FFFFFF'], header: '#F1EDE6', text: '#2B2B2B', accent: '#D4A843', page: '#FFFFFF' },
  { id: 'selva', name: 'Selva tropical', desc: 'Verdes profundos y hojas de palma.', colors: ['#1B4332', '#2D6A4F', '#95D5B2', '#E9C46A', '#F1FAEE'], header: '#1B4332', text: '#F1FAEE', accent: '#E9C46A', page: '#F1FAEE' },
  { id: 'buganvilia', name: 'Buganvilia', desc: 'Fucsias y rosados de las flores de Cartagena.', colors: ['#3C3C3C', '#8E2C5E', '#D65A9E', '#F7C5DD', '#FFF5F9'], header: '#8E2C5E', text: '#FFF5F9', accent: '#F7C5DD', page: '#FFF5F9' },
  { id: 'menta', name: 'Menta y blanco', desc: 'Fresca y limpia, estilo apartamento de playa.', colors: ['#1D3557', '#457B9D', '#A8DADC', '#E8F6F3', '#FFFFFF'], header: '#A8DADC', text: '#1D3557', accent: '#457B9D', page: '#F4FBFA' },
  { id: 'minimal', name: 'Minimal negro', desc: 'Negro, grises y un toque dorado. Moderna.', colors: ['#111111', '#3A3A3A', '#BDBDBD', '#D4A843', '#F5F5F5'], header: '#111111', text: '#F5F5F5', accent: '#D4A843', page: '#F5F5F5' },
  { id: '77rentals', name: 'Colores 77Rentals', desc: 'Morado y dorado, como el resto de nuestras guías.', colors: ['#1a0f40', '#2D1B69', '#4B0082', '#D4A843', '#f8f7ff'], header: '#2D1B69', text: '#f8f7ff', accent: '#D4A843', page: '#f8f7ff' },
];

const CHECKOUT_TASKS = ['Dejar las llaves en recepción', 'Devolver las manillas', 'Sacar la basura', 'Lavar la loza', 'Apagar el aire y las luces', 'Cerrar el balcón'];

type Host = { name: string; role: string; whatsapp: string };
type State = {
  hosts: Host[];
  firstContact: string;
  about: string;
  palette: string;
  paletteOther: string;
  names: Record<string, string>;
  checkin: string;
  checkout: string;
  registro: string;
  manillas: string;
  maletas: string;
  parking: string;
  parkingDetail: string;
  hours: Record<string, string>;
  mascotas: string;
  basura: string;
  reglasExtra: string;
  units: Record<string, { wifi: string; wifiPass: string; acceso: string; notas: string }>;
  checkoutTasks: string[];
  checkoutExtra: string;
  restaurantes: string;
  tours: string;
  traslado: string;
  telAdmin: string;
  clinica: string;
  drogueria: string;
  comentarios: string;
};

const HOUR_ROWS = ['Piscina piso 40', 'Piscina piso 3', 'Gimnasio', 'Baño turco', 'Billar'];

const initialState: State = {
  hosts: [
    { name: 'Lina', role: 'Anfitriona', whatsapp: '' },
    { name: 'Nico', role: 'Co-anfitrión', whatsapp: '' },
  ],
  firstContact: '',
  about: '',
  palette: '',
  paletteOther: '',
  names: { '1204': '', '3504': '' },
  checkin: '3:00 p.m.',
  checkout: '',
  registro: '',
  manillas: '',
  maletas: '',
  parking: '',
  parkingDetail: '',
  hours: Object.fromEntries(HOUR_ROWS.map((r) => [r, ''])),
  mascotas: '',
  basura: '',
  reglasExtra: '',
  units: Object.fromEntries(UNITS.map((u) => [u, { wifi: '', wifiPass: '', acceso: '', notas: '' }])),
  checkoutTasks: [],
  checkoutExtra: '',
  restaurantes: '',
  tours: '',
  traslado: '',
  telAdmin: '',
  clinica: '',
  drogueria: '',
  comentarios: '',
};

const inputCls = 'w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#2D1B69]/30 focus:border-[#2D1B69]';

function Field({ label, hint, children, group = false }: { label: string; hint?: string; children: React.ReactNode; group?: boolean }) {
  const Tag = group ? 'div' : 'label';
  return (
    <Tag className="block" {...(group ? { role: 'group', 'aria-label': label } : {})}>
      <span className="block text-sm text-gray-700 mb-1">{label}</span>
      {hint && <span className="block text-xs text-gray-500 -mt-0.5 mb-1.5">{hint}</span>}
      {children}
    </Tag>
  );
}

function Chips({ options, value, onChange, multi = false }: { options: string[]; value: string | string[]; onChange: (v: string) => void; multi?: boolean }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => {
        const on = multi ? (value as string[]).includes(o) : value === o;
        return (
          <button
            key={o}
            type="button"
            aria-pressed={on}
            onClick={() => onChange(o)}
            className={`px-3.5 py-1.5 rounded-full text-sm border transition-colors ${on ? 'bg-[#2D1B69] border-[#2D1B69] text-white' : 'bg-white border-gray-300 text-gray-700 hover:border-[#2D1B69]'}`}
          >
            {o}
          </button>
        );
      })}
    </div>
  );
}

function Section({ n, title, intro, children }: { n: number; title: string; intro?: React.ReactNode; children: React.ReactNode }) {
  return (
    <Card className="p-6 space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">
          <span className="text-[#b08a2e] mr-1.5">{n}.</span>
          {title}
        </h2>
        {intro && <p className="text-sm text-gray-600 mt-1">{intro}</p>}
      </div>
      {children}
    </Card>
  );
}

function PalettePreview({ p, name }: { p: Palette; name: string }) {
  return (
    <div className="rounded-xl overflow-hidden border border-gray-200" style={{ background: p.page }}>
      <div className="px-5 py-6" style={{ background: p.header, color: p.text }}>
        <p className="text-[10px] uppercase tracking-[0.25em] opacity-80">Welcome · Bienvenidos</p>
        <p className="font-serif text-2xl mt-1">{name || 'Murano Elite 3504'}</p>
      </div>
      <div className="px-5 py-4 flex items-center justify-between gap-3">
        <div className="space-y-1.5 flex-1">
          <div className="h-2 rounded-full w-3/4" style={{ background: p.colors[1], opacity: 0.35 }} />
          <div className="h-2 rounded-full w-1/2" style={{ background: p.colors[1], opacity: 0.25 }} />
        </div>
        <span className="text-xs font-semibold px-3 py-1.5 rounded-full" style={{ background: p.accent, color: p.header === p.page ? p.text : p.header }}>
          WiFi
        </span>
      </div>
    </div>
  );
}

export default function MuranoGuiaForm() {
  const [s, setS] = useState<State>(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(DRAFT_KEY) || 'null');
      return saved ? { ...initialState, ...saved } : initialState;
    } catch {
      return initialState;
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
        localStorage.setItem(DRAFT_KEY, JSON.stringify(s));
      } catch {
        /* storage unavailable */
      }
    }, 400);
    return () => clearTimeout(t);
  }, [s]);

  const up = <K extends keyof State>(k: K, v: State[K]) => setS((p) => ({ ...p, [k]: v }));
  const upHost = (i: number, patch: Partial<Host>) => up('hosts', s.hosts.map((h, j) => (j === i ? { ...h, ...patch } : h)));
  const upUnit = (u: string, patch: Partial<State['units'][string]>) => up('units', { ...s.units, [u]: { ...s.units[u], ...patch } });
  const toggleTask = (t: string) =>
    setS((p) => ({ ...p, checkoutTasks: p.checkoutTasks.includes(t) ? p.checkoutTasks.filter((x) => x !== t) : [...p.checkoutTasks, t] }));
  const selected = PALETTES.find((p) => p.id === s.palette);

  const summary = () => {
    const v = (x: string) => x.trim() || '—';
    const lines = [
      'GUÍA DE BIENVENIDA — MURANO ELITE 1204 Y 3504',
      '',
      '1. ANFITRIONES',
      ...s.hosts.filter((h) => h.name.trim()).map((h) => `${h.name} (${v(h.role)}) · WhatsApp: ${v(h.whatsapp)}`),
      `Quién responde primero: ${v(s.firstContact)}`,
      `Sobre nosotros: ${v(s.about)}`,
      '',
      '2. ESTILO',
      `Paleta: ${selected ? selected.name : '—'}${s.paletteOther.trim() ? ` · Nota: ${s.paletteOther.trim()}` : ''}`,
      ...UNITS.map((u) => `Nombre en la guía ${u}: ${v(s.names[u])}`),
      '',
      '3. LLEGADA',
      `Check-in: ${v(s.checkin)} · Check-out: ${v(s.checkout)}`,
      `Registro ante la administración: ${v(s.registro)}`,
      `Manillas: ${v(s.manillas)}`,
      `Guarda de maletas: ${v(s.maletas)}`,
      `Parqueadero: ${v(s.parking)} ${s.parkingDetail.trim() ? `· ${s.parkingDetail.trim()}` : ''}`,
      '',
      '4. HORARIOS',
      ...HOUR_ROWS.map((r) => `${r}: ${v(s.hours[r])}`),
      '',
      '5. REGLAS',
      `Mascotas: ${v(s.mascotas)}`,
      `Basura: ${v(s.basura)}`,
      `Otras reglas: ${v(s.reglasExtra)}`,
      '',
      '6. APARTAMENTOS',
      ...UNITS.flatMap((u) => [
        `— ${u} —`,
        `WiFi: ${v(s.units[u].wifi)} / Clave: ${v(s.units[u].wifiPass)}`,
        `Acceso al apartamento: ${v(s.units[u].acceso)}`,
        `Cómo usar: ${v(s.units[u].notas)}`,
      ]),
      '',
      '7. SALIDA',
      `Tareas: ${s.checkoutTasks.join(', ') || '—'}`,
      `Otras: ${v(s.checkoutExtra)}`,
      '',
      '8. RECOMENDACIONES',
      `Restaurantes: ${v(s.restaurantes)}`,
      `Tours y aliados: ${v(s.tours)}`,
      `Traslado aeropuerto: ${v(s.traslado)}`,
      '',
      '9. EMERGENCIAS',
      `Administración / portería: ${v(s.telAdmin)}`,
      `Clínica: ${v(s.clinica)}`,
      `Droguería: ${v(s.drogueria)}`,
      '',
      `Comentarios: ${v(s.comentarios)}`,
    ];
    return lines.join('\n');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!s.hosts.some((h) => h.whatsapp.trim())) {
      setError('Pon al menos un número de WhatsApp de los anfitriones.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('access_key', WEB3FORMS_KEY);
      formData.append('subject', 'Guía de bienvenida Murano Elite 1204 y 3504 — Lina y Nico');
      formData.append('from_name', '77Rentals — Guía de bienvenida');
      formData.append('respuestas', summary());
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
      <div className="min-h-screen bg-[#f8f7ff] flex items-center justify-center p-6">
        <Card className="max-w-md w-full p-8 text-center space-y-3">
          <p className="text-green-700 font-semibold text-lg">✓ Recibimos tus respuestas.</p>
          <p className="text-gray-600 text-sm">
            Gracias, Lina y Nico. Con esto armamos las guías de bienvenida del 1204 y el 3504 en español e inglés, y se las
            enviamos para revisión antes de compartirlas con los huéspedes.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f7ff] py-10 px-4">
      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Guía de bienvenida · Murano Elite 1204 y 3504</h1>
          <p className="text-gray-600 text-sm mt-1">77Rentals · Información para las guías de tus huéspedes</p>
        </div>

        <Card className="p-4">
          <p className="text-sm text-gray-700">
            Hola Lina y Nico. Con estas respuestas armamos una guía de bienvenida digital para cada apartamento, en español
            e inglés. Ya incluimos lo que sabemos del edificio (piscinas, gimnasio, registro con documento y que no se
            permiten visitas). Llenen lo que puedan; lo que no sepan ahora lo completamos después. Las respuestas se guardan
            en este navegador mientras escriben.
          </p>
        </Card>

        <Section n={1} title="Anfitriones" intro="Aparecen en la sección “Sobre nosotros” y en los contactos de la guía.">
          <div className="space-y-3">
            {s.hosts.map((h, i) => (
              <div key={i} className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_1fr_auto] gap-3 items-end border border-gray-200 rounded-lg p-3">
                <Field label="Nombre">
                  <input className={inputCls} value={h.name} onChange={(e) => upHost(i, { name: e.target.value })} />
                </Field>
                <Field label="Rol">
                  <select className={inputCls} value={h.role} onChange={(e) => upHost(i, { role: e.target.value })}>
                    {['Anfitriona', 'Anfitrión', 'Co-anfitriona', 'Co-anfitrión', 'Apoyo en Cartagena'].map((r) => <option key={r}>{r}</option>)}
                  </select>
                </Field>
                <Field label="WhatsApp">
                  <input className={inputCls} inputMode="tel" placeholder="+57 300 000 0000" value={h.whatsapp} onChange={(e) => upHost(i, { whatsapp: e.target.value })} />
                </Field>
                {s.hosts.length > 1 ? (
                  <button type="button" onClick={() => up('hosts', s.hosts.filter((_, j) => j !== i))} className="h-9 w-9 flex items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100" aria-label={`Quitar a ${h.name || 'este anfitrión'}`}>
                    <Trash2 className="w-4 h-4" />
                  </button>
                ) : <span />}
              </div>
            ))}
            <button type="button" onClick={() => up('hosts', [...s.hosts, { name: '', role: 'Apoyo en Cartagena', whatsapp: '' }])} className="inline-flex items-center gap-1.5 text-sm text-[#2D1B69] font-medium border border-dashed border-[#2D1B69]/50 rounded-lg px-3 py-2 hover:bg-[#2D1B69]/5">
              <Plus className="w-4 h-4" /> Agregar otra persona
            </button>
          </div>
          <Field group label="¿Quién responde primero cuando escribe un huésped?">
            <Chips options={s.hosts.map((h) => h.name).filter(Boolean).concat('Cualquiera de los dos')} value={s.firstContact} onChange={(v) => up('firstContact', v)} />
          </Field>
          <Field label="Sobre ustedes" hint="Un párrafo corto: quiénes son, por qué les gusta recibir huéspedes. Nosotros lo pulimos y traducimos.">
            <textarea className={`${inputCls} min-h-[90px]`} value={s.about} onChange={(e) => up('about', e.target.value)} />
          </Field>
        </Section>

        <Section n={2} title="Colores de la guía" intro="Elige la paleta que más te guste. La usamos en las dos guías.">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3" role="radiogroup" aria-label="Paleta de colores">
            {PALETTES.map((p) => {
              const on = s.palette === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  role="radio"
                  aria-checked={on}
                  onClick={() => up('palette', p.id)}
                  className={`text-left rounded-xl border bg-white p-3 transition-shadow ${on ? 'border-[#2D1B69] ring-2 ring-[#2D1B69]/40' : 'border-gray-200 hover:border-gray-400'}`}
                >
                  <div className="flex h-10 rounded-lg overflow-hidden mb-2.5 ring-1 ring-inset ring-black/10">
                    {p.colors.map((c) => <span key={c} className="flex-1" style={{ background: c }} />)}
                  </div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{p.name}</p>
                      <p className="text-xs text-gray-500 leading-snug">{p.desc}</p>
                    </div>
                    {on && <Check className="w-4 h-4 text-[#2D1B69] shrink-0 mt-0.5" />}
                  </div>
                </button>
              );
            })}
          </div>
          {selected && (
            <div>
              <p className="text-xs text-gray-500 mb-2">Así se vería el encabezado de la guía:</p>
              <PalettePreview p={selected} name={s.names['3504'] || s.names['1204']} />
            </div>
          )}
          <Field label="¿Algún ajuste o idea propia? (opcional)" hint="Ej. “me gusta Surf azul pero con más blanco”">
            <input className={inputCls} value={s.paletteOther} onChange={(e) => up('paletteOther', e.target.value)} />
          </Field>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {UNITS.map((u) => (
              <Field key={u} label={`Nombre del ${u} en la guía`} hint={u === '3504' ? 'Ej. Surf Sunset Suite' : 'Ej. Surf Bay Apartment'}>
                <input className={inputCls} value={s.names[u]} onChange={(e) => up('names', { ...s.names, [u]: e.target.value })} />
              </Field>
            ))}
          </div>
        </Section>

        <Section n={3} title="Llegada al edificio">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field label="Hora de check-in"><input className={inputCls} value={s.checkin} onChange={(e) => up('checkin', e.target.value)} /></Field>
            <Field label="Hora de check-out"><input className={inputCls} placeholder="Ej. 11:00 a.m." value={s.checkout} onChange={(e) => up('checkout', e.target.value)} /></Field>
          </div>
          <Field label="Registro ante la administración" hint="¿Con cuántas horas de anticipación y a quién se envían los documentos de los huéspedes? ¿Tiene algún costo?">
            <textarea className={inputCls} value={s.registro} onChange={(e) => up('registro', e.target.value)} />
          </Field>
          <Field label="Manillas de acceso" hint="¿Cuántas entregan y cuánto cuesta perder una?">
            <input className={inputCls} placeholder="Ej. 1 por huésped, COP 30.000 si se pierde" value={s.manillas} onChange={(e) => up('manillas', e.target.value)} />
          </Field>
          <Field group label="¿Recepción guarda maletas antes del check-in o después del check-out?">
            <Chips options={['Sí, gratis', 'Sí, con costo', 'No', 'No sé']} value={s.maletas} onChange={(v) => up('maletas', v)} />
          </Field>
          <Field group label="Parqueadero para huéspedes">
            <Chips options={['No hay', 'Sí, incluido', 'Sí, con costo', 'Solo con reserva']} value={s.parking} onChange={(v) => up('parking', v)} />
          </Field>
          {s.parking && s.parking !== 'No hay' && (
            <Field label="Detalle del parqueadero" hint="Número de celda, sótano, costo por noche">
              <input className={inputCls} value={s.parkingDetail} onChange={(e) => up('parkingDetail', e.target.value)} />
            </Field>
          )}
        </Section>

        <Section n={4} title="Horarios de piscinas y zonas comunes" intro="Solo el horario de apertura. Deja en blanco lo que no sepas.">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {HOUR_ROWS.map((r) => (
              <Field key={r} label={r}>
                <input className={inputCls} placeholder="Ej. 9:00 a.m. – 7:00 p.m." value={s.hours[r]} onChange={(e) => up('hours', { ...s.hours, [r]: e.target.value })} />
              </Field>
            ))}
          </div>
        </Section>

        <Section n={5} title="Reglas" intro="Ya incluimos las reglas estándar de 77Rentals (no fiestas, no fumar, silencio de noche) y que no se permiten visitas.">
          <Field group label="¿El edificio permite mascotas?" hint="Tus anuncios dicen que sí, pero otros anfitriones del Murano dicen que no. Es importante confirmarlo.">
            <Chips options={['Sí', 'Sí, con condiciones', 'No', 'Voy a preguntar']} value={s.mascotas} onChange={(v) => up('mascotas', v)} />
          </Field>
          <Field label="¿Dónde se bota la basura?">
            <input className={inputCls} placeholder="Ej. shut al lado del ascensor de cada piso" value={s.basura} onChange={(e) => up('basura', e.target.value)} />
          </Field>
          <Field label="Otras reglas del edificio que el huésped deba saber (opcional)">
            <textarea className={inputCls} value={s.reglasExtra} onChange={(e) => up('reglasExtra', e.target.value)} />
          </Field>
        </Section>

        <Section n={6} title="Cada apartamento">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {UNITS.map((u) => (
              <div key={u} className="border border-gray-200 rounded-lg p-4 space-y-3">
                <p className="text-sm font-semibold text-[#2D1B69]">Apto {u} · piso {u.slice(0, 2)}</p>
                <Field label="Red WiFi"><input className={inputCls} value={s.units[u].wifi} onChange={(e) => upUnit(u, { wifi: e.target.value })} /></Field>
                <Field label="Clave WiFi"><input className={inputCls} value={s.units[u].wifiPass} onChange={(e) => upUnit(u, { wifiPass: e.target.value })} /></Field>
                <Field label="¿Cómo entra el huésped al apartamento?" hint="Llave en recepción, cerradura con código, alguien lo recibe">
                  <textarea className={inputCls} value={s.units[u].acceso} onChange={(e) => upUnit(u, { acceso: e.target.value })} />
                </Field>
                <Field label="Instrucciones de uso" hint="Aire, calentador, TV, lavadora, luces LED, lo que suela generar preguntas">
                  <textarea className={`${inputCls} min-h-[90px]`} value={s.units[u].notas} onChange={(e) => upUnit(u, { notas: e.target.value })} />
                </Field>
              </div>
            ))}
          </div>
        </Section>

        <Section n={7} title="Salida" intro="Marca lo que le pides al huésped antes de irse.">
          <Chips multi options={CHECKOUT_TASKS} value={s.checkoutTasks} onChange={toggleTask} />
          <Field label="Algo más (opcional)">
            <input className={inputCls} value={s.checkoutExtra} onChange={(e) => up('checkoutExtra', e.target.value)} />
          </Field>
        </Section>

        <Section n={8} title="Sus recomendaciones de Cartagena" intro="Nosotros agregamos sitios investigados de Bocagrande. Aquí van sus favoritos.">
          <Field label="Restaurantes, cafés o bares de atardecer favoritos">
            <textarea className={inputCls} value={s.restaurantes} onChange={(e) => up('restaurantes', e.target.value)} />
          </Field>
          <Field label="Tours, islas o pasadías que recomiendan" hint="Si tienen aliados, pongan nombre y contacto">
            <textarea className={inputCls} value={s.tours} onChange={(e) => up('tours', e.target.value)} />
          </Field>
          <Field label="Traslado desde el aeropuerto" hint="¿Lo ofrecen? ¿Precio y cómo se pide?">
            <input className={inputCls} value={s.traslado} onChange={(e) => up('traslado', e.target.value)} />
          </Field>
        </Section>

        <Section n={9} title="Emergencias">
          <Field label="Teléfono de administración o portería del Murano">
            <input className={inputCls} inputMode="tel" value={s.telAdmin} onChange={(e) => up('telAdmin', e.target.value)} />
          </Field>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field label="Clínica recomendada (nombre y teléfono)"><input className={inputCls} value={s.clinica} onChange={(e) => up('clinica', e.target.value)} /></Field>
            <Field label="Droguería recomendada (nombre y teléfono)"><input className={inputCls} value={s.drogueria} onChange={(e) => up('drogueria', e.target.value)} /></Field>
          </div>
          <Field label="¿Algo más que quieran en la guía? (opcional)">
            <textarea className={inputCls} value={s.comentarios} onChange={(e) => up('comentarios', e.target.value)} />
          </Field>
        </Section>

        <Card className="p-6 space-y-3">
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 rounded-md bg-[#D4A843] hover:bg-[#c9963e] text-black font-bold disabled:opacity-50 flex items-center justify-center"
          >
            {loading ? (<><Loader2 className="w-4 h-4 mr-2 animate-spin" />Enviando…</>) : 'Enviar a 77Rentals'}
          </button>
          <p className="text-xs text-gray-500 text-center">Les enviamos las guías para revisión antes de compartirlas con los huéspedes.</p>
        </Card>

        <Card className="p-4 bg-blue-50 border border-blue-200">
          <p className="text-xs text-blue-900 leading-relaxed">
            <strong>🔒 Tratamiento de datos personales (Ley 1581 de 2012 y Decreto 1377 de 2013 — Habeas Data):</strong>{' '}
            los nombres, teléfonos y claves de WiFi que compartan se usan únicamente para crear las guías de bienvenida de
            sus apartamentos y atender a sus huéspedes. Pueden pedir que los actualicemos o eliminemos escribiendo a
            77Rentals.
          </p>
        </Card>
      </form>
    </div>
  );
}
