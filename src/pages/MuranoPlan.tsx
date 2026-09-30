import { useEffect } from 'react';
import { AlertTriangle, ArrowRight, Check } from 'lucide-react';

const checks = [
  ['Mascotas', '¿el reglamento del edificio las permite? Si no, desmarca "Admite mascotas" en Booking y Airbnb.'],
  ['Piscina del piso 40', '¿está funcionando? Un anuncio reciente la reportó en reparación. Es el gancho principal, así que hay que saberlo antes de usarla en el nombre.'],
  ['Piscina del piso 3', 'otros anuncios dicen que martes, jueves y sábado es solo para propietarios. Si es cierto, hay que avisarlo al huésped.'],
  ['Parqueadero', '¿tus apartamentos tienen celda? ¿Tiene costo para el huésped?'],
  ['Piso del segundo apartamento', 'la carpeta de fotos y la dirección de Booking dicen 3504, o sea piso 35. Todo debe decir lo mismo en Booking y Airbnb.'],
];

const building = [
  'Torre frente al mar sobre la Carrera 1 (Av. del Malecón), en primera línea de playa. Promovida por Las Olas, los mismos de los edificios Palmetto.',
  'Piscina panorámica con jacuzzi en la azotea del piso 40, más 2 piscinas y jacuzzi en el piso 3.',
  'Gimnasio, baño turco, zona de billar, solárium, lobby de doble altura, 3 ascensores y portería 24 horas.',
  'Reglas típicas: registro previo de todos los huéspedes con documento, manilla de acceso (multa por pérdida cercana a COP 30.000), no se permiten visitas, horarios de piscina y gimnasio.',
];

const names = {
  '3504': [
    { name: 'Murano Elite 3504 · Atardeceres frente al mar', why: 'Piso alto y atardecer, que es lo que muestran tus mejores fotos.', pick: true },
    { name: 'Frente al mar piso 35 · Murano Elite Bocagrande', why: 'Más búsqueda por "frente al mar"; menos emocional.' },
    { name: 'Murano Elite piso 35 · Vista mar y bahía', why: 'Destaca la vista doble. Seguro y claro.' },
    { name: 'Surf Sunset Suite · Murano Elite piso 35', why: 'Crea marca propia que el huésped recuerda. Tiene menos palabras de búsqueda.' },
  ],
  '1204': [
    { name: 'Murano Elite 1204 · Frente al mar, 2 baños', why: 'Frente al mar y 2 baños completos, que pocos apartamentos de 1 alcoba tienen.', pick: true },
    { name: 'Murano Elite piso 12 · Vista a la bahía y playa', why: 'Desde el piso 12 se ve la bahía con la base naval. Es real y distinto.' },
    { name: 'Surf Bay Apartment · Murano Elite Bocagrande', why: 'Pareja de marca con "Surf Sunset Suite".' },
  ],
};

const fixes = [
  ['Camas', '1 cama doble + sofá cama para 5', '2 camas dobles + 1 sofá cama (las fotos lo confirman)'],
  ['Habitación duplicada', '2 filas iguales', '1 sola fila por apartamento'],
  ['Esquí', '"practicar esquí"', 'Desmarcar. En Cartagena no hay esquí.'],
  ['Piscina cubierta', 'Marcada', 'Piscina al aire libre (piso 40 y piso 3)'],
  ['Sauna', 'Marcada', 'Baño turco, si lo confirmas; si no, desmarcar'],
  ['Jardín, bar, recepción 24 h', 'Marcados', 'Solo si existen. Mejor "seguridad 24 h" que "recepción 24 h".'],
  ['Mascotas', 'Se admiten', 'Según lo que diga la administración'],
  ['Nombre', '"panoramica" sin tilde, "piso 40"', 'Uno de los nombres de la sección 3'],
  ['Datos en ambas plataformas', 'Airbnb y Booking no coinciden', 'Mismo piso, registro RNT y hora de salida'],
];

const descriptions = {
  '3504': `Mira el atardecer sobre el Caribe desde tu balcón en el piso 35 del Murano Elite, un edificio frente a la playa de Bocagrande. Vista al mar de un lado y a la bahía de Cartagena del otro.

• Hasta 5 huéspedes: habitación con 2 camas dobles y sofá cama en la sala. 2 baños completos.
• Aire acondicionado, cocina equipada, lavadora y WiFi.
• En el edificio: piscina panorámica con jacuzzi en el piso 40, piscinas y jacuzzi en el piso 3, gimnasio y billar.
• Bajas a la playa en un par de minutos. La Ciudad Amurallada queda a unos 10 minutos en carro.

Antes de llegar te pedimos el nombre y documento de cada huésped para el registro del edificio. Te acompañamos por WhatsApp con recomendaciones de restaurantes, tours e islas.

Reserva tus fechas: los atardeceres desde el piso 35 se ven mejor que en cualquier foto.`,
  '1204': `Apartamento frente a la playa de Bocagrande, en el piso 12 del Murano Elite, con vista al mar y a la bahía de Cartagena desde el balcón.

• Hasta 5 huéspedes: habitación con 2 camas dobles y sofá cama en la sala. 2 baños completos, ideal para familias o amigos.
• Aire acondicionado, cocina equipada y WiFi.
• En el edificio: piscina panorámica con jacuzzi en el piso 40, piscinas y jacuzzi en el piso 3, gimnasio y billar.
• A pasos de la playa y a unos 10 minutos en carro de la Ciudad Amurallada.

Antes de llegar te pedimos el nombre y documento de cada huésped para el registro del edificio. Te acompañamos por WhatsApp con recomendaciones de restaurantes, tours e islas.

Reserva ahora y asegura tu vista al Caribe.`,
};

const photos = {
  '3504': [
    'Portada: el atardecer desde el balcón con la tabla de surf iluminada. Es tu foto más fuerte.',
    'La sala con la vista a la bahía.',
    'El balcón mirando la playa.',
    'La habitación con las 2 camas y la luz LED del cabecero.',
    'Baño, cocina y lavadora.',
    'Piscina del piso 40, piscina del piso 3, gimnasio.',
  ],
  '1204': [
    'Portada: el balcón con la tabla de surf y el mar.',
    'La sala blanca con cocina abierta.',
    'La vista a la bahía.',
    'La habitación con las 2 camas y los cuadros de surf.',
    'Baños, cocina y detalles (cafetera, vajilla).',
    'Piscinas y gimnasio del edificio.',
  ],
};

const weeks = [
  ['Semana 1', 'Correcciones de la sección 4, nombres nuevos, descripciones y fotos reordenadas.'],
  ['Semana 1', 'Activa el descuento de nuevo alojamiento y Genius nivel 1. Crea una tarifa con cancelación gratis hasta 5–7 días antes y deja la no reembolsable como segunda opción, más barata.'],
  ['Semana 1', 'Activa los pagos gestionados por Booking o acepta débito. Pedir solo tarjeta de crédito frena reservas.'],
  ['Semana 2', 'Revisa el pin del mapa: tiene que caer sobre el edificio en la Carrera 1. Llena todos los campos del perfil (metros cuadrados, "sobre el anfitrión", servicios de cocina y baño).'],
  ['Semanas 2–4', 'Precio igual o un poco por debajo de Airbnb para la misma unidad. Responde todos los mensajes en menos de 1 hora.'],
  ['Semanas 3–8', 'Mensaje automático antes de la llegada con la guía de bienvenida. Pide la reseña el día de salida con un mensaje corto y personal.'],
  ['Semana 8', 'Con 5 o más reseñas, quita el descuento de nuevo alojamiento y sube el precio poco a poco.'],
];

const H2 = ({ n, children }: { n: number; children: React.ReactNode }) => (
  <h2 className="font-serif text-2xl md:text-3xl text-[#2D1B69] mb-5 flex items-baseline gap-3">
    <span className="text-[#D4A843] text-lg font-sans font-bold">{n}.</span>
    {children}
  </h2>
);

const Note = ({ children }: { children: React.ReactNode }) => (
  <p className="bg-[#f3f0ff] border-l-4 border-[#2D1B69] rounded-r-lg px-4 py-3 text-[#2D1B69]/90 text-sm leading-relaxed">{children}</p>
);

export default function MuranoPlan() {
  useEffect(() => {
    const meta = document.createElement('meta');
    meta.name = 'robots';
    meta.content = 'noindex, nofollow';
    document.head.appendChild(meta);
    const previousTitle = document.title;
    document.title = 'Plan Booking Murano Elite — 77Rentals';
    return () => {
      document.head.removeChild(meta);
      document.title = previousTitle;
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#f8f7ff] text-[#1f1640]">
      <header className="bg-gradient-to-br from-[#1a0f40] via-[#2D1B69] to-[#4B0082] text-white">
        <div className="container mx-auto max-w-3xl px-4 py-14 md:py-20">
          <a href="/" className="font-serif text-xl text-[#D4A843]">77Rentals</a>
          <div className="flex items-center gap-2 mt-10 mb-4">
            <div className="h-px w-8 bg-[#D4A843]" />
            <span className="text-[#D4A843] text-xs font-semibold uppercase tracking-[0.2em]">Plan de lanzamiento</span>
          </div>
          <h1 className="font-serif text-3xl md:text-5xl leading-tight mb-5">Plan Booking.com para Murano Elite 1204 y 3504</h1>
          <p className="text-white/80 text-base md:text-lg leading-relaxed max-w-2xl">
            Lina, este plan te dice qué corregir, cómo nombrar y describir cada apartamento, y qué hacer las primeras 8 semanas para conseguir reservas y las primeras reseñas en Booking.
          </p>
          <div className="flex flex-wrap gap-2 mt-7">
            {['Apto 1204 · piso 12', 'Apto 3504 · piso 35', 'Bocagrande, Cartagena'].map((c) => (
              <span key={c} className="bg-white/10 border border-white/15 rounded-full px-3 py-1 text-sm">{c}</span>
            ))}
          </div>
        </div>
      </header>

      <main className="container mx-auto max-w-3xl px-4 py-14 space-y-16">
        <section>
          <H2 n={1}>Antes de todo: confirma estas 5 cosas</H2>
          <div className="bg-[#fdf1ec] border-l-4 border-[#c2410c] rounded-r-lg px-4 py-4 mb-6 flex gap-3">
            <AlertTriangle className="w-5 h-5 text-[#c2410c] shrink-0 mt-0.5" />
            <p className="text-sm leading-relaxed">
              <strong className="text-[#c2410c]">Mascotas.</strong> Hoy tus anuncios dicen que se admiten mascotas. Otros anfitriones del Murano Elite publican que el edificio no las permite. Si un huésped llega con su perro y recepción no lo deja subir, la reserva termina en queja o reembolso. Confírmalo con la administración esta semana.
            </p>
          </div>
          <ol className="space-y-3">
            {checks.map(([t, d], i) => (
              <li key={t} className="flex gap-3">
                <span className="w-7 h-7 shrink-0 rounded-full bg-[#2D1B69] text-white text-sm font-bold flex items-center justify-center">{i + 1}</span>
                <p className="leading-relaxed"><strong>{t}:</strong> {d}</p>
              </li>
            ))}
          </ol>
        </section>

        <section>
          <H2 n={2}>Qué es el Murano Elite</H2>
          <ul className="space-y-2.5 mb-6">
            {building.map((b) => (
              <li key={b.slice(0, 20)} className="flex gap-3 leading-relaxed"><Check className="w-5 h-5 text-[#D4A843] shrink-0 mt-0.5" />{b}</li>
            ))}
          </ul>
          <Note>
            Por qué importa: los competidores del mismo edificio ponen "Murano Elite" y "frente al mar" al inicio del nombre, y el más fuerte tiene 4,92 con 323 reseñas. Para destacar, tus anuncios tienen que usar lo que ellos no tienen igual: el piso alto con atardecer (3504) y la decoración surf nueva de ambos.
          </Note>
        </section>

        <section>
          <H2 n={3}>Opciones de nombre</H2>
          <p className="leading-relaxed mb-6">
            En el celular Booking corta el nombre, así que lo importante va primero. Cada apartamento debe tener su propio nombre: si los dos se parecen mucho, Booking y el huésped los confunden.
          </p>
          {(['3504', '1204'] as const).map((unit) => (
            <div key={unit} className="mb-8">
              <h3 className="font-serif text-xl text-[#2D1B69] mb-3">Apto {unit}</h3>
              <div className="grid gap-3">
                {names[unit].map((o) => (
                  <div key={o.name} className={`bg-white rounded-xl px-4 py-3 border ${o.pick ? 'border-[#D4A843] ring-1 ring-[#D4A843]' : 'border-[#e4dff5]'}`}>
                    {o.pick && <span className="text-[11px] font-bold uppercase tracking-wider text-[#b08a2e]">Recomendado</span>}
                    <p className="font-semibold text-[#1f1640]">{o.name}</p>
                    <p className="text-sm text-[#5b5478]">{o.why}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
          <Note>
            Evita poner "piso 40" en el nombre. El apartamento no está en el 40, y el huésped que lo cree se siente engañado al llegar. La piscina del 40 va en la descripción y en las fotos.
          </Note>
        </section>

        <section>
          <H2 n={4}>Correcciones urgentes en Booking</H2>
          <div className="overflow-x-auto bg-white rounded-xl border border-[#e4dff5]">
            <table className="w-full text-sm min-w-[560px]">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wider text-[#5b5478] border-b border-[#e4dff5]">
                  <th className="px-4 py-3">Qué</th><th className="px-4 py-3">Hoy dice</th><th className="px-4 py-3">Debe decir</th>
                </tr>
              </thead>
              <tbody>
                {fixes.map(([a, b, c]) => (
                  <tr key={a} className="border-b border-[#f0edf9] last:border-0 align-top">
                    <td className="px-4 py-3 font-semibold">{a}</td>
                    <td className="px-4 py-3 text-[#8a4a3a]">{b}</td>
                    <td className="px-4 py-3">{c}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <H2 n={5}>Descripción lista para pegar</H2>
          {(['3504', '1204'] as const).map((unit) => (
            <div key={unit} className="mb-8">
              <h3 className="font-serif text-xl text-[#2D1B69] mb-3">Apto {unit}</h3>
              <div className="bg-white border border-[#e4dff5] rounded-xl p-5 whitespace-pre-wrap leading-relaxed text-[15px]">{descriptions[unit]}</div>
            </div>
          ))}
          <Note>
            Cambia "WiFi" por "WiFi de X Mbps" cuando midas la velocidad. Un competidor del edificio anuncia 783 Mbps, así que si la tuya es buena, dilo con el número.
          </Note>
        </section>

        <section>
          <H2 n={6}>Fotos: portada y orden</H2>
          <div className="grid md:grid-cols-2 gap-8 mb-6">
            {(['3504', '1204'] as const).map((unit) => (
              <div key={unit}>
                <h3 className="font-serif text-xl text-[#2D1B69] mb-3">Apto {unit}</h3>
                <ol className="space-y-2 list-decimal pl-5 leading-relaxed">
                  {photos[unit].map((p) => <li key={p}>{p}</li>)}
                </ol>
              </div>
            ))}
          </div>
          <p className="leading-relaxed">
            Toma las fotos de la piscina del 40 al atardecer si todavía no las tienes. Ponle etiqueta a cada foto en el extranet (sala, dormitorio, vista, piscina). No subas las imágenes hechas con ChatGPT: si el huésped nota que no son reales, baja la nota de exactitud.
          </p>
        </section>

        <section>
          <H2 n={7}>Las primeras 8 semanas</H2>
          <div className="space-y-4">
            {weeks.map(([w, t]) => (
              <div key={t.slice(0, 24)} className="grid sm:grid-cols-[120px_1fr] gap-1 sm:gap-4">
                <span className="font-bold text-[#2D1B69] tabular-nums">{w}</span>
                <p className="leading-relaxed">{t}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-gradient-to-br from-[#2D1B69] to-[#4B0082] text-white rounded-2xl p-7 md:p-10">
          <h2 className="font-serif text-2xl md:text-3xl mb-3">8. Tu guía de bienvenida</h2>
          <p className="text-white/80 leading-relaxed mb-6">
            Vamos a hacer una guía de bienvenida para cada apartamento, que el huésped recibe antes de llegar. Evita las quejas típicas del Murano (visitas no permitidas, horarios de piscina, manillas) y recibe al huésped con tu estilo. Para hacerla necesitamos unos datos tuyos: son unos 15 minutos.
          </p>
          <a href="/murano-elite/guia" className="inline-flex items-center gap-2 bg-[#D4A843] hover:bg-[#c49a3a] text-[#2D1B69] font-semibold px-7 h-12 rounded-full transition-colors">
            Llenar el formulario <ArrowRight className="w-4 h-4" />
          </a>
        </section>

        <p className="text-xs text-[#5b5478] border-t border-[#e4dff5] pt-5">
          Preparado por 77Rentals · Septiembre 2026. Los datos del edificio salen de fuentes públicas y de anuncios de otros anfitriones; confírmalos con la administración antes de publicarlos.
        </p>
      </main>
    </div>
  );
}
