import { useEffect } from 'react';
import { ArrowRight, Check, Info } from 'lucide-react';

type Step = {
  title: string;
  where: string;
  why: string;
  how: string[];
  check: string;
};

type Phase = { label: string; when: string; steps: Step[] };

const confirmed = [
  ['Mascotas', 'Se admiten, con cargo por estadía. Abajo explicamos por qué y cómo configurarlo.'],
  ['Piscina del piso 40', 'Funcionando. Es el gancho principal de los dos apartamentos.'],
  ['Piscina del piso 3', 'Abierta todos los días. Los horarios van en la guía de bienvenida.'],
  ['Parqueadero', 'Disponible, COP 50.000 por estadía.'],
  ['Calendarios', 'Los dos apartamentos están en Airbnb y en Booking. Se van a conectar con iCal (paso 8).'],
];

const building = [
  'Torre frente al mar sobre la Carrera 1 (Av. del Malecón), en primera línea de playa. Promovida por Las Olas, los mismos de los edificios Palmetto.',
  'Piscina panorámica con jacuzzi en la azotea del piso 40, más piscinas y jacuzzi en el piso 3.',
  'Gimnasio, baño turco, billar, solárium, lobby de doble altura, 3 ascensores y portería 24 horas.',
  'Reglas del edificio: registro previo de todos los huéspedes con documento, manilla de acceso y no se permiten visitas.',
];

const names = [
  {
    unit: '3504',
    subtitle: 'Piso 35 · balcón con atardecer',
    booking: [
      { n: 'Murano Elite Sunset Balcony & Rooftop Pool', c: 42, pick: true, why: 'El atardecer desde el balcón es algo que ningún competidor del Murano usa, y la piscina de la azotea queda nombrada como del edificio.' },
      { n: 'Murano Elite Surf Apartment with Sunset Balcony', c: 47, why: 'Suma el estilo surf de la decoración. Pierde la piscina en el nombre.' },
      { n: 'Apartamento Surf Murano Elite con Piscina Rooftop', c: 49, why: 'Versión en español para el público colombiano.' },
    ],
    airbnb: [
      { n: 'Sunset Balcony + Rooftop Pool · Murano Elite', c: 44, pick: true, why: 'Lo que se ve primero en el celular es el atardecer y la piscina.' },
      { n: 'Atardeceres piso 35 + piscina rooftop piso 40', c: 45, why: 'Deja claro que el apartamento es el 35 y la piscina el 40.' },
      { n: 'Surf suite frente al mar + piscina piso 40', c: 42, why: 'Más búsqueda por "frente al mar", con el tema surf.' },
    ],
  },
  {
    unit: '1204',
    subtitle: 'Piso 12 · vista a la bahía y al mar',
    booking: [
      { n: 'Murano Elite Bay View Apartment & Rooftop Pool', c: 46, pick: true, why: 'La vista a la bahía es lo que lo distingue, y dice la verdad: evita la reseña de "no era vista al mar de frente".' },
      { n: 'Murano Elite Surf Apartment with Bay View', c: 41, why: 'Más corto, con el estilo surf. Sin la piscina.' },
      { n: 'Apartamento Vista a la Bahía Murano Elite', c: 41, why: 'Versión en español.' },
    ],
    airbnb: [
      { n: 'Bay View + 40th-Floor Rooftop Pool · Murano', c: 43, pick: true, why: 'Nombra la piscina con su piso, así nadie cree que el apartamento está en el 40.' },
      { n: 'Vista a la bahía + piscina rooftop piso 40', c: 42, why: 'Versión en español.' },
      { n: 'A pasos de la playa + piscina rooftop piso 40', c: 45, why: 'Vende la cercanía a la playa, que desde el piso 12 es real.' },
    ],
  },
];

const fixes = [
  ['Camas', '1 cama doble + sofá cama para 5', '2 camas dobles + 1 sofá cama (las fotos lo confirman)'],
  ['Habitación duplicada', '2 filas iguales', '1 sola fila por apartamento'],
  ['Esquí', '"practicar esquí"', 'Desmarcar. En Cartagena no hay esquí.'],
  ['Piscina cubierta', 'Marcada', 'Piscina al aire libre (piso 40 y piso 3)'],
  ['Sauna', 'Marcada', 'Baño turco'],
  ['Jardín, bar, recepción 24 h', 'Marcados', 'Desmarcar. Marcar "seguridad 24 horas".'],
  ['Mascotas', 'Se admiten', 'Se admiten bajo petición, con cargo por estadía'],
  ['Parqueadero', 'Parking privado', 'Parking privado con cargo de COP 50.000 por estadía'],
  ['Nombre', '"panoramica" sin tilde, "piso 40"', 'Uno de los nombres de la sección 3'],
];

const phases: Phase[] = [
  {
    label: 'Semana 1',
    when: 'Arreglar el anuncio',
    steps: [
      {
        title: 'Corregir los servicios',
        where: 'Propiedad → Servicios y equipamiento',
        why: 'Booking escribe la descripción del anuncio con lo que marques aquí. Si está marcado "esquí", la descripción dice que se puede esquiar.',
        how: [
          'Desmarca esquí, sauna, piscina cubierta, jardín, bar y recepción 24 horas.',
          'Marca: piscina al aire libre, piscina en la azotea, jacuzzi, gimnasio, baño turco, billar, seguridad 24 horas, ascensor, aire acondicionado, WiFi gratis, cocina, lavadora (3504), balcón, vista al mar, frente a la playa.',
          'Guarda y repite en el otro apartamento.',
        ],
        check: 'Abre el anuncio como huésped. En la descripción ya no deben salir el esquí, la sauna ni la piscina cubierta. Puede tardar unas horas en actualizarse.',
      },
      {
        title: 'Corregir camas y borrar la habitación duplicada',
        where: 'Propiedad → Distribución y precios (o Tarifas y disponibilidad → Tipos de habitación)',
        why: 'Hoy dice 1 cama doble para 5 personas. Un huésped ve que no caben y no reserva, o reserva y deja mala nota.',
        how: [
          'Abre el tipo de habitación y pon: 1 dormitorio con 2 camas dobles, y sala con 1 sofá cama. Capacidad: 5.',
          'Pon 63 m² y 2 baños.',
          'Si hay dos filas iguales, borra una. Si esa fila tiene reservas futuras, ciérrala en vez de borrarla y escríbenos.',
        ],
        check: 'En el anuncio debe aparecer una sola fila: "Apartamento de 1 dormitorio · 2 camas dobles · 1 sofá cama".',
      },
      {
        title: 'Cambiar el nombre',
        where: 'Propiedad → nombre de la propiedad → Cambiar nombre',
        why: 'El nombre es lo primero que se lee en los resultados. Hoy no dice nada que el competidor no diga.',
        how: [
          'Copia el nombre recomendado de la sección 3.',
          'Booking revisa el cambio antes de publicarlo. No uses mayúsculas sostenidas, emojis, signos de exclamación ni abreviaturas ("Apt", "P40").',
        ],
        check: 'En unos días el nombre nuevo aparece en el anuncio. Si Booking lo rechaza, usa la segunda opción.',
      },
      {
        title: 'Subir y ordenar las fotos',
        where: 'Propiedad → Fotos',
        why: 'La foto principal decide si alguien abre tu anuncio. Booking pide mínimo 10 fotos, de al menos 2048 × 1080 px, y la principal horizontal.',
        how: [
          'Sube entre 25 y 40 fotos, en horizontal, de la carpeta de Drive.',
          'Arrastra para ordenar. Foto principal del 3504: el atardecer desde el balcón con la tabla de surf. Del 1204: el balcón con la playa.',
          'Sigue con: sala con vista → balcón → dormitorio con las 2 camas → baños → cocina → piscina del piso 40 → piscina del piso 3 → gimnasio.',
          'Etiqueta cada foto (sala, dormitorio, vista, piscina). Booking usa esas etiquetas para mostrarlas donde corresponde.',
          'No subas las imágenes hechas con ChatGPT.',
        ],
        check: 'En el celular, la primera foto del anuncio es la del atardecer (3504) o la del balcón (1204).',
      },
      {
        title: 'Configurar mascotas, parqueadero y horarios',
        where: 'Propiedad → Políticas → Internet, parking y mascotas',
        why: 'Solo lo que se configura aquí aparece en los filtros de búsqueda y en el precio. Si se escribe en otro lado, el huésped no lo ve a tiempo.',
        how: [
          'Mascotas: "Sí, bajo petición" y "con cargo". Pon el cargo por estadía (ver sección 5).',
          'Parqueadero: "Sí, privado, en el edificio", con cargo de COP 50.000 por estadía. Si no aparece la opción de cobrar por estadía, pídelo por el buzón de la extranet.',
          'Check-in desde las 3:00 p.m.; check-out hasta las 11:00 a.m. (o la hora que definan, igual en Airbnb).',
          'Niños: sí. Cunas: pon lo que tengan; si no hay, déjalo en no.',
        ],
        check: 'En el anuncio, en "Normas de la casa", salen mascotas bajo petición con cargo y el parqueadero con su precio.',
      },
      {
        title: 'Revisar el pin del mapa',
        where: 'Propiedad → Información general → Dirección y ubicación',
        why: 'Las distancias a la playa y al centro salen del pin. Hoy la descripción dice "a 5 minutos a pie de la playa" y el edificio está en primera línea.',
        how: [
          'Arrastra el pin rojo hasta el edificio Murano Elite, sobre la Carrera 1 #11-80.',
          'Confirma que la dirección diga Cra. 1 #11-80, Bocagrande.',
        ],
        check: 'En el anuncio, "Playa de Bocagrande" sale a pocos metros.',
      },
      {
        title: 'Escribir el perfil',
        where: 'Propiedad → Tu perfil',
        why: 'Es el único texto libre de Booking. La descripción principal no se puede escribir: Booking la arma con los servicios. Aquí es donde se nota que hay personas detrás.',
        how: [
          'Sobre el anfitrión: pega el texto "Sobre nosotros" de la sección 6.',
          'Sobre el alojamiento: pega el texto del apartamento de la sección 6.',
          'Sobre el barrio: pega el texto de Bocagrande de la sección 6.',
          'Si algo de la descripción automática sigue mal después del paso 1, usa "Ver tus descripciones → Solicitar una corrección".',
        ],
        check: 'Los tres textos aparecen en la parte de "Anfitrión" del anuncio.',
      },
      {
        title: 'Conectar los calendarios de Airbnb y Booking',
        where: 'Airbnb: Calendario · Booking: Tarifas y disponibilidad → Sincronizar calendarios',
        why: 'Sin esto, alguien puede reservar las mismas fechas en las dos plataformas. Hay que hacerlo en los dos sentidos y en los dos apartamentos: son 4 conexiones.',
        how: [
          'En Airbnb (computador): entra a Calendario, elige el apartamento, abre "Disponibilidad" y busca "Conectar calendarios" (o "Sincronizar calendarios").',
          'Toca "Exportar calendario" y copia el enlace que termina en .ics.',
          'En Booking: Tarifas y disponibilidad → Sincronizar calendarios → "Importar calendario". Pega el enlace de Airbnb, ponle nombre "Airbnb 3504" y guarda.',
          'En esa misma pantalla de Booking copia el enlace de exportación de Booking.',
          'Vuelve a Airbnb → "Conectar calendarios" → "Importar calendario". Pega el enlace de Booking, nómbralo "Booking 3504" y guarda.',
          'Repite todo con el 1204, cuidando de no cruzar los enlaces entre apartamentos.',
        ],
        check: 'Bloquea una fecha de prueba en Airbnb. En unas horas debe aparecer bloqueada en Booking. Luego desbloquéala. Importante: iCal se actualiza cada varias horas, así que cuando entre una reserva de último minuto, bloquea las fechas a mano en la otra plataforma.',
      },
    ],
  },
  {
    label: 'Semana 2',
    when: 'Precios y reservas',
    steps: [
      {
        title: 'Crear dos tarifas: flexible y no reembolsable',
        where: 'Tarifas y disponibilidad → Planes de tarifa',
        why: '"Cancelación gratis" es uno de los filtros más usados. La no reembolsable atrae al que busca el precio más bajo y te asegura el pago.',
        how: [
          'Tarifa estándar: cancelación gratis hasta 7 días antes de la llegada.',
          'Tarifa no reembolsable: entre 10% y 15% más barata que la estándar.',
          'Precio: igual o un poco por debajo del que tengas en Airbnb para el mismo apartamento.',
        ],
        check: 'Al buscar fechas en tu anuncio aparecen dos precios, uno con "Cancelación gratis".',
      },
      {
        title: 'Activar la oferta de nueva propiedad',
        where: 'Promociones → New Property Deal (oferta para nuevas propiedades)',
        why: 'Da 20% de descuento durante los primeros 90 días o hasta 3 reservas, lo que llegue primero, y te ayuda a conseguir las primeras reseñas. Se apaga sola.',
        how: [
          'Si no la activaste al registrarte, entra a Promociones y actívala en los dos apartamentos.',
          'Si ya pasaron 90 días desde que publicaste, ya no aparece. En ese caso crea una promoción básica de 15% por 60 días.',
        ],
        check: 'En el anuncio aparece la etiqueta de oferta junto al precio.',
      },
      {
        title: 'Entrar a Genius',
        where: 'Oportunidades → Programa Genius',
        why: 'Genius muestra tu anuncio a los viajeros frecuentes de Booking con una insignia y 10% de descuento. Estos viajeros reservan más y cancelan menos.',
        how: [
          'Actívalo en el nivel 1 (10%).',
          'Booking pide nota de reseñas de 7,5 o más, pero deja entrar a propiedades nuevas sin reseñas. Si te lo niega, vuelve a intentar después de las primeras 3 reservas.',
        ],
        check: 'Aparece la insignia azul "Genius" en tu anuncio.',
      },
      {
        title: 'Confirmar el número de licencia (RNT)',
        where: 'Propiedad → Información general (licencia)',
        why: 'En Colombia el RNT es obligatorio y se renueva cada año antes del 31 de marzo. Booking lo muestra en el anuncio.',
        how: ['Revisa que cada apartamento tenga su propio RNT y que sea el mismo número que tiene en Airbnb.'],
        check: 'Al final del anuncio sale "Número de licencia" con el RNT correcto.',
      },
    ],
  },
  {
    label: 'Semanas 3 a 8',
    when: 'Atender y conseguir reseñas',
    steps: [
      {
        title: 'Programar mensajes automáticos',
        where: 'Propiedad → Preferencias de mensajería → Plantillas',
        why: 'Pedir los documentos para el registro del edificio y mandar la guía a tiempo evita las quejas de la llegada.',
        how: [
          'Plantilla 1, al reservar: gracias por reservar, y pedido de nombre completo y documento de cada huésped para el registro del edificio.',
          'Plantilla 2, 2 días antes: enlace a la guía de bienvenida, hora de llegada y recordatorio de que no se permiten visitas.',
          'Plantilla 3, el día de salida: gracias, y pedido de reseña con un mensaje corto y personal.',
          'Usa el programador de plantillas para que salgan solas. Instala la app Pulse para responder desde el celular.',
        ],
        check: 'Haz una reserva de prueba con un familiar o revisa la vista previa: los tres mensajes salen en su momento.',
      },
      {
        title: 'Responder en menos de 1 hora',
        where: 'App Pulse',
        why: 'La rapidez de respuesta cuenta para el lugar en los resultados y para que el huésped reserve.',
        how: ['Activa las notificaciones de Pulse en el celular de Lina y en el de Nico.'],
        check: 'Ningún mensaje queda más de 1 hora sin respuesta.',
      },
      {
        title: 'Responder cada reseña',
        where: 'Reseñas de huéspedes → Responder',
        why: 'La nota aparece desde la primera reseña. Las respuestas quedan públicas y ayudan al siguiente huésped a decidir.',
        how: ['Agradece siempre. Si hay una queja, responde con calma y di qué se arregló.'],
        check: 'Todas las reseñas tienen respuesta.',
      },
      {
        title: 'Subir precios en la semana 8',
        where: 'Tarifas y disponibilidad → Calendario',
        why: 'Con 5 o más reseñas buenas, ya no hace falta vender por precio.',
        how: [
          'Si la oferta de nueva propiedad sigue activa, apágala.',
          'Sube el precio entre 5% y 10% y mira las reservas de las siguientes 2 semanas antes de volver a subir.',
          'Escríbenos para revisar juntos la nota y los precios.',
        ],
        check: 'La ocupación se mantiene después de subir el precio.',
      },
    ],
  },
];

const profile = {
  host: 'Somos Lina y Nico. Nos encanta viajar y recibir a personas de todo el mundo en Cartagena. Cuidamos cada detalle de nuestros apartamentos en el Murano Elite y estamos pendientes por WhatsApp antes y durante tu estadía, con recomendaciones de restaurantes, tours e islas.',
  property: {
    '3504': 'Apartamento en el piso 35 del Murano Elite, con balcón para ver el atardecer sobre el Caribe y vista a la bahía de Cartagena. Decoración surf, 2 camas dobles, sofá cama y 2 baños completos. En el edificio tienes piscina con jacuzzi en la azotea del piso 40, piscinas en el piso 3, gimnasio y baño turco.',
    '1204': 'Apartamento en el piso 12 del Murano Elite, con balcón y vista al mar y a la bahía de Cartagena. Decoración surf, 2 camas dobles, sofá cama y 2 baños completos. En el edificio tienes piscina con jacuzzi en la azotea del piso 40, piscinas en el piso 3, gimnasio y baño turco.',
  },
  neighborhood: 'Bocagrande es la zona de playa de Cartagena. El Murano Elite está frente al mar, con restaurantes, supermercados y droguerías a una o dos cuadras. La Ciudad Amurallada queda a unos 10 minutos en carro y el aeropuerto a unos 20.',
};

const H2 = ({ n, children }: { n: number; children: React.ReactNode }) => (
  <h2 className="font-serif text-2xl md:text-3xl text-[#2D1B69] mb-5 flex items-baseline gap-3">
    <span className="text-[#D4A843] text-lg font-sans font-bold">{n}.</span>
    {children}
  </h2>
);

const Note = ({ children }: { children: React.ReactNode }) => (
  <p className="bg-[#f3f0ff] border-l-4 border-[#2D1B69] rounded-r-lg px-4 py-3 text-[#2D1B69]/90 text-sm leading-relaxed">{children}</p>
);

const Copy = ({ label, text }: { label: string; text: string }) => (
  <div>
    <p className="text-xs font-bold uppercase tracking-wider text-[#b08a2e] mb-1.5">{label}</p>
    <p className="bg-white border border-[#e4dff5] rounded-xl p-4 leading-relaxed text-[15px] select-all">{text}</p>
  </div>
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

  let stepNo = 0;

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
            Lina y Nico, esta es la guía paso a paso para dejar sus dos apartamentos bien publicados en Booking y conseguir las primeras reservas y reseñas. Cada paso dice dónde está en la extranet, qué hacer y cómo comprobar que quedó bien.
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
          <H2 n={1}>Lo que ya confirmamos</H2>
          <ul className="space-y-3">
            {confirmed.map(([t, d]) => (
              <li key={t} className="flex gap-3 leading-relaxed">
                <Check className="w-5 h-5 text-green-700 shrink-0 mt-0.5" />
                <p><strong>{t}:</strong> {d}</p>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <H2 n={2}>El edificio Murano Elite</H2>
          <ul className="space-y-2.5 mb-6">
            {building.map((b) => (
              <li key={b.slice(0, 20)} className="flex gap-3 leading-relaxed"><Check className="w-5 h-5 text-[#D4A843] shrink-0 mt-0.5" />{b}</li>
            ))}
          </ul>
          <Note>
            Los competidores del mismo edificio se llaman casi igual: "Murano Elite" y "frente al mar". El mejor tiene 4,92 con 323 reseñas. Ninguno menciona la piscina de la azotea ni el atardecer, y ahí es donde sus apartamentos pueden destacar.
          </Note>
        </section>

        <section>
          <H2 n={3}>Nombres para cada apartamento</H2>
          <p className="leading-relaxed mb-6">
            Cada apartamento lleva un nombre distinto, para que Booking y los huéspedes no los confundan. Todos nombran la piscina de la azotea sin dar a entender que el apartamento está en el piso 40. Recomendamos el nombre en inglés en Booking, porque lo leen bien los huéspedes colombianos y los extranjeros.
          </p>
          {names.map((u) => (
            <div key={u.unit} className="mb-10">
              <h3 className="font-serif text-xl text-[#2D1B69]">Apto {u.unit}</h3>
              <p className="text-sm text-[#5b5478] mb-4">{u.subtitle}</p>
              {(['booking', 'airbnb'] as const).map((platform) => (
                <div key={platform} className="mb-5">
                  <p className="text-xs font-bold uppercase tracking-wider text-[#5b5478] mb-2">{platform === 'booking' ? 'Booking.com · nombre de la propiedad' : 'Airbnb · título (máx. 50 caracteres)'}</p>
                  <div className="grid gap-2.5">
                    {u[platform].map((o) => (
                      <div key={o.n} className={`bg-white rounded-xl px-4 py-3 border ${o.pick ? 'border-[#D4A843] ring-1 ring-[#D4A843]' : 'border-[#e4dff5]'}`}>
                        <div className="flex items-start justify-between gap-3">
                          <p className="font-semibold text-[#1f1640]">{o.n}</p>
                          <span className="text-xs text-[#5b5478] tabular-nums shrink-0 mt-1">{o.c} car.</span>
                        </div>
                        <p className="text-sm text-[#5b5478]">{o.pick && <span className="text-[#b08a2e] font-bold">Recomendado · </span>}{o.why}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ))}
          <Note>Booking revisa cada cambio de nombre y rechaza mayúsculas sostenidas, emojis, signos de exclamación, abreviaturas y palabras como "hermoso" o "el mejor". Todos estos nombres cumplen esas reglas.</Note>
        </section>

        <section>
          <H2 n={4}>Lo que hay que corregir hoy en Booking</H2>
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
          <p className="text-sm text-[#5b5478] mt-3">Cómo hacer cada corrección está en la sección 7, pasos 1 a 5.</p>
        </section>

        <section>
          <H2 n={5}>Mascotas: por qué sí, con cargo</H2>
          <ul className="space-y-3 leading-relaxed">
            <li className="flex gap-3"><Check className="w-5 h-5 text-[#D4A843] shrink-0 mt-0.5" /><p><strong>Más visibilidad.</strong> "Se admiten mascotas" es un filtro de Booking y de Airbnb. Quien viaja con su perro filtra primero, y solo ve los anuncios que lo aceptan.</p></li>
            <li className="flex gap-3"><Check className="w-5 h-5 text-[#D4A843] shrink-0 mt-0.5" /><p><strong>Poca competencia.</strong> Varios anfitriones del Murano dicen que no aceptan mascotas. Ustedes pueden quedarse con esos huéspedes.</p></li>
            <li className="flex gap-3"><Check className="w-5 h-5 text-[#D4A843] shrink-0 mt-0.5" /><p><strong>El cargo cubre la limpieza extra</strong> (pelos, sofá, balcón) y filtra a quien no cuida el espacio.</p></li>
            <li className="flex gap-3"><Check className="w-5 h-5 text-[#D4A843] shrink-0 mt-0.5" /><p><strong>"Bajo petición" les da el control:</strong> el huésped avisa qué mascota trae y ustedes aceptan o no.</p></li>
          </ul>
          <div className="mt-5">
            <Note>
              Sugerimos COP 80.000 por estadía, máximo 1 mascota de hasta 15 kg, y que no se suba a camas ni sofá. Pongan el cargo en la configuración de Booking (paso 5) y las condiciones en la guía de bienvenida.
            </Note>
          </div>
        </section>

        <section>
          <H2 n={6}>Textos para su perfil en Booking</H2>
          <p className="leading-relaxed mb-5">
            En Booking la descripción principal no se escribe a mano: Booking la arma con los servicios que marcan. El único lugar con texto propio es <strong>Tu perfil</strong>. Estos textos están listos para copiar y pegar (paso 7).
          </p>
          <div className="space-y-5">
            <Copy label="Sobre el anfitrión" text={profile.host} />
            <Copy label="Sobre el alojamiento · 3504" text={profile.property['3504']} />
            <Copy label="Sobre el alojamiento · 1204" text={profile.property['1204']} />
            <Copy label="Sobre el barrio" text={profile.neighborhood} />
          </div>
        </section>

        <section>
          <H2 n={7}>Guía paso a paso</H2>
          <p className="leading-relaxed mb-3">
            Hagan cada paso en los dos apartamentos. Los nombres de los menús pueden cambiar un poco según el idioma de la extranet; si no encuentran algo, mándennos una captura de pantalla.
          </p>
          <p className="text-sm text-[#5b5478] mb-8 flex gap-2"><Info className="w-4 h-4 shrink-0 mt-0.5" />Todo se puede hacer desde el computador en admin.booking.com. Las respuestas a huéspedes, mejor desde la app Pulse.</p>

          <div className="space-y-12">
            {phases.map((ph) => (
              <div key={ph.label}>
                <div className="flex items-baseline gap-3 mb-5 border-b border-[#e4dff5] pb-2">
                  <span className="font-bold text-[#2D1B69] tabular-nums">{ph.label}</span>
                  <span className="text-[#5b5478]">{ph.when}</span>
                </div>
                <div className="space-y-6">
                  {ph.steps.map((st) => {
                    stepNo += 1;
                    return (
                      <article key={st.title} className="bg-white border border-[#e4dff5] rounded-2xl p-5 md:p-6">
                        <div className="flex gap-3 items-start mb-3">
                          <span className="w-8 h-8 shrink-0 rounded-full bg-[#2D1B69] text-white text-sm font-bold flex items-center justify-center tabular-nums">{stepNo}</span>
                          <div className="min-w-0">
                            <h3 className="font-serif text-xl text-[#2D1B69] leading-snug">{st.title}</h3>
                            <p className="text-sm text-[#b08a2e] font-medium mt-0.5">{st.where}</p>
                          </div>
                        </div>
                        <p className="text-[15px] leading-relaxed text-[#3b3357] mb-3"><strong>Por qué:</strong> {st.why}</p>
                        <ol className="list-decimal pl-5 space-y-1.5 leading-relaxed text-[15px] mb-4">
                          {st.how.map((h) => <li key={h.slice(0, 30)}>{h}</li>)}
                        </ol>
                        <p className="text-sm bg-green-50 border border-green-200 text-green-900 rounded-lg px-3 py-2 leading-relaxed"><strong>Cómo saber que quedó bien:</strong> {st.check}</p>
                      </article>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-gradient-to-br from-[#2D1B69] to-[#4B0082] text-white rounded-2xl p-7 md:p-10">
          <h2 className="font-serif text-2xl md:text-3xl mb-3">8. Su guía de bienvenida</h2>
          <p className="text-white/80 leading-relaxed mb-6">
            Vamos a hacer una guía de bienvenida en español e inglés para cada apartamento, que el huésped recibe antes de llegar (plantilla 2 del paso 13). Para armarla necesitamos unos datos suyos: son unos 15 minutos.
          </p>
          <a href="/murano-elite/guia" className="inline-flex items-center gap-2 bg-[#D4A843] hover:bg-[#c49a3a] text-[#2D1B69] font-semibold px-7 h-12 rounded-full transition-colors">
            Llenar el formulario <ArrowRight className="w-4 h-4" />
          </a>
        </section>

        <p className="text-xs text-[#5b5478] border-t border-[#e4dff5] pt-5">
          Preparado por 77Rentals · Septiembre 2026. Los pasos siguen el centro de ayuda para socios de Booking.com; los nombres de los menús pueden variar un poco.
        </p>
      </main>
    </div>
  );
}
