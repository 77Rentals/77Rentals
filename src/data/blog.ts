// Blog posts for /blog. Content is written by the travel-blog-copywriter agent
// (.claude/agents/travel-blog-copywriter.md) from sourced research briefs.
// Newest post first.

export type BlogBlock =
  | { type: 'p'; text: string }
  | { type: 'h2'; text: string }
  | { type: 'h3'; text: string }
  | { type: 'ul'; items: string[] }
  | { type: 'tip'; title: string; text: string }
  | { type: 'cta' };

export interface BlogPostContent {
  title: string;
  metaDescription: string;
  excerpt: string;
  tags: string[];
  body: BlogBlock[];
}

export interface BlogPost {
  slug: string;
  date: string; // ISO date
  readingMinutes: number;
  cover: string;
  es: BlogPostContent;
  en: BlogPostContent;
  sources: { title: string; url: string }[];
}

export const blogPosts: BlogPost[] = [
  {
    slug: 'colombia-travel-tips',
    date: '2026-09-22',
    readingMinutes: 8,
    cover: '/images/bogota.jpg',
    es: {
      title: 'Consejos para viajar a Colombia: lo que debes saber',
      metaDescription: 'Consejos para viajar a Colombia: visa y Check-MIG, plata y propinas, seguridad, clima, agua y SIM. Lo que debes saber antes de tu primer viaje.',
      excerpt: 'Visa, Check-MIG, plata, seguridad y clima en Cartagena, Santa Marta y Bogotá: lo práctico que nos gustaría que supiera todo el que llega a Colombia por primera vez.',
      tags: ['Consejos de viaje', 'Colombia'],
      body: [
        { type: 'h2', text: '¿Necesito visa para viajar a Colombia?' },
        { type: 'p', text: 'Si tienes pasaporte de España o de otro país de la Unión Europea, de Estados Unidos, del Reino Unido o de Canadá, no necesitas visa de turista. En migración normalmente te sellan hasta 90 días, aunque el número exacto queda a criterio del oficial. El máximo es de 180 días en un periodo de 12 meses, y se puede pedir prórroga.' },
        { type: 'p', text: 'Te pueden pedir el tiquete de salida o de regreso dentro de esos 90 días, y el pasaporte debe estar vigente durante toda tu estadía. Lo más seguro es que tenga seis meses de vigencia, porque algunas aerolíneas lo revisan al abordar.' },
        { type: 'p', text: '**Si viajas con pasaporte canadiense**, pagas una tarifa de reciprocidad al entrar, vigente desde noviembre de 2023. El valor se actualiza cada año, así que revísalo antes de viajar. Están exentos los menores de 14 años, los mayores de 79 y quienes van solo a San Andrés.' },
        { type: 'p', text: '¿Tienes otra nacionalidad? Consulta la página de la Cancillería, porque los requisitos cambian según el país.' },

        { type: 'h2', text: '¿Qué es Check-MIG y es obligatorio?' },
        { type: 'p', text: 'Check-MIG es el prerregistro en línea de Migración Colombia. Llénalo: es gratis, toma unos minutos y algunas aerolíneas lo piden antes de dejarte abordar. Se hace entre 72 horas y 1 hora antes del vuelo, tanto para entrar como para salir del país.' },
        { type: 'p', text: 'Usa solo la página oficial, apps.migracioncolombia.gov.co/pre-registro. En Google aparecen sitios copiados que cobran por “tramitar” un formulario que es gratuito. Si te piden la tarjeta de crédito, cierra la página.' },
        { type: 'p', text: 'El impuesto de salida suele venir incluido en el tiquete, así que normalmente no pagas nada extra en el aeropuerto.' },

        { type: 'h2', text: '¿Cuánta plata llevar y se puede pagar con tarjeta?' },
        { type: 'p', text: 'La moneda es el peso colombiano (COP). A septiembre de 2026, un dólar estadounidense está en algo más de 3.000 pesos, después de un año en que el peso se revaluó con fuerza. La tasa cambia a diario: consulta la TRM oficial en la página del Banco de la República antes de cambiar.' },
        { type: 'p', text: 'Con tarjeta pagas en casi todos los restaurantes, supermercados y tiendas de Cartagena, Santa Marta y Bogotá. Lleva efectivo para comida callejera, taxis, vendedores de playa, mercados y pueblos pequeños, donde muchas veces no hay datáfono.' },
        { type: 'ul', items: [
          '**Saca plata en cajeros dentro de centros comerciales o bancos**, no en los que están solos en la calle.',
          '**Cuenta con una comisión por retiro** si tu tarjeta es extranjera. Mejor pocos retiros grandes que muchos pequeños.',
          '**Elige que te cobren en pesos.** Cuando el cajero o el datáfono te ofrezca convertir a tu moneda, rechaza. Esa conversión casi siempre sale más cara.',
          '**Guarda billetes pequeños.** Un billete de 100.000 es difícil de cambiar en un puesto de frutas.',
        ] },

        { type: 'h2', text: '¿Cuánta propina se deja en Colombia?' },
        { type: 'p', text: 'En restaurantes, la Ley 1935 de 2018 permite sugerir una propina voluntaria de hasta el 10 %, que aparece en la cuenta como “servicio” o “propina voluntaria”. Es opcional, y el personal debe preguntarte si la quieres incluir. Fuera de eso, redondear el taxi o dejarle unos miles de pesos al guía se agradece, pero no se espera.' },
        { type: 'tip', title: 'La pregunta que vas a oír en cada restaurante', text: 'Cuando pidas la cuenta, casi siempre te van a decir: “¿Desea incluir el servicio?”. Si dices que sí, se suma la propina sugerida, de hasta el 10 %. Si te atendieron bien, es lo normal. Si no, un “no, gracias” es perfectamente válido.' },
        { type: 'p', text: 'Otro dato útil: los turistas extranjeros pueden pedir la devolución del IVA en compras de bienes como ropa, artesanías, joyas, esmeraldas y electrónicos. Guarda las facturas y haz el trámite ante la DIAN antes de salir del país. En su página están las reglas y los montos mínimos vigentes.' },

        { type: 'h2', text: '¿Cómo moverse por Colombia?' },
        { type: 'p', text: 'Entre regiones, vuela. En el mapa las distancias parecen cortas, pero las montañas hacen lentas las carreteras: de Bogotá a la costa en bus son de 18 a 20 horas, o más. En avión, de Bogotá a Cartagena o a Santa Marta es más o menos una hora y media.' },
        { type: 'p', text: 'Avianca es la aerolínea más grande, y LATAM, JetSMART y Wingo también cubren las rutas principales. Si ves guías viejas que mencionan Viva Air o Ultra Air, ignóralas: ninguna de las dos vuela ya.' },
        { type: 'p', text: 'Entre Cartagena y Santa Marta sí conviene ir por tierra. Son unas 4 horas, más si hay trancón en Barranquilla o en Ciénaga. Empresas como Marsol (puerta a puerta en algunas zonas) y Berlinastur hacen el trayecto.' },
        { type: 'p', text: 'En la ciudad, no pares taxis en la calle. Pide uno por app, que te lo llame el hotel o tu anfitrión, o toma la fila de taxis oficial del aeropuerto. Uber, DiDi e InDrive se usan muchísimo, pero no están formalmente regulados.' },

        { type: 'h2', text: '¿Cuál es la mejor época para viajar a Colombia?' },
        { type: 'p', text: 'Colombia está cerca de la línea del ecuador, así que el clima depende más de la altura que de la época del año. En general, lo más seco va de diciembre a marzo, con otro periodo seco más corto a mitad de año. Abril y mayo, y octubre y noviembre, son los meses más lluviosos, y se nota sobre todo en la zona andina. Los años de El Niño o La Niña cambian estos patrones.' },
        { type: 'p', text: '**Cartagena y Santa Marta** son calientes todo el año, entre 28 y 32 °C, con mucha humedad. De diciembre a marzo están los días más secos y con más brisa. Deja las caminatas para temprano o para el final de la tarde, y el mediodía para la piscina o la playa.' },
        { type: 'p', text: '**Bogotá** está a unos 2.600 metros y es fría, entre 7 y 19 °C, con un clima que cambia varias veces al día. Empaca ropa por capas y una chaqueta impermeable, aunque después sigas para la costa.' },
        { type: 'tip', title: 'El primer día en Bogotá, con calma', text: 'A algunos visitantes la altura les pega al llegar: dolor de cabeza, ahogo en las escaleras, mal sueño. Haz un primer día suave, toma mucha agua y bájale al trago. La subida a Monserrate, mejor el segundo día.' },
        { type: 'p', text: 'La temporada alta, con precios más altos y vuelos llenos, va de mediados de diciembre a mediados de enero, Semana Santa, de mediados de junio a mediados de julio por las vacaciones escolares, y los puentes festivos.' },
        { type: 'tip', title: 'Semana Santa 2027: reserva con tiempo', text: 'En 2027 la Semana Santa va del 21 al 28 de marzo. Esa semana, y en cada puente, medio país se va para la costa, así que los vuelos y los apartamentos en Cartagena y Santa Marta se llenan con anticipación. Si tus fechas coinciden, reserva cuanto antes.' },

        { type: 'h2', text: '¿Es seguro viajar a Colombia?' },
        { type: 'p', text: 'Los problemas que tienen los viajeros suelen repetirse en las mismas situaciones, y casi todos se evitan con sentido común. Revisa la alerta de viaje de tu gobierno antes de salir y aplica la regla que todo colombiano conoce: **no dar papaya**. Es decir, no ponérsela fácil a nadie.' },
        { type: 'ul', items: [
          '**El celular, guardado cerca del andén.** Los robos desde moto pasan en calles concurridas. Si vas a mirar el mapa, métete a un local o aléjate de la calle.',
          '**Lleva una copia del pasaporte**, no el original. Deja el original donde te estás quedando.',
          '**No descuides tu trago** ni aceptes bebidas ni nada de desconocidos. La escopolamina, una droga que usan para dejar a la gente sin voluntad y robarla, es un riesgo real en zonas de rumba.',
          '**Cuidado con las apps de citas.** El gobierno de Canadá advierte específicamente sobre citas que terminan en drogas y robo. Encuéntrate en lugares públicos y concurridos, y no lleves a la persona a donde te estás quedando.',
          '**Muévete en taxi por app o reservado**, sobre todo de noche.',
        ] },
        { type: 'p', text: 'En el centro histórico de Cartagena y en las playas los vendedores pueden ser insistentes. Con un “no, gracias” firme y amable, y seguir caminando, es suficiente.' },

        { type: 'h2', text: '¿Se puede tomar agua de la llave en Colombia?' },
        { type: 'p', text: 'En Bogotá, sí: el agua de la llave cumple los estándares de agua potable. En la costa Caribe, mejor toma agua embotellada o filtrada.' },
        { type: 'h3', text: '¿Necesito la vacuna de la fiebre amarilla?' },
        { type: 'p', text: 'Para entrar a Colombia, no. Pero desde abril de 2025 Parques Nacionales está pidiendo el carné de vacunación contra la fiebre amarilla en algunos parques, entre ellos Tayrona y la Sierra Nevada de Santa Marta. Si vas a visitar alguno, confirma la regla vigente con Parques Nacionales y vacúnate por lo menos 10 días antes.' },
        { type: 'h3', text: 'Enchufes y voltaje' },
        { type: 'p', text: 'En Colombia los enchufes son tipo A y B, a 110 V y 60 Hz, igual que en Estados Unidos y Canadá. Si en tu país se usa otro tipo, como en España, necesitas adaptador. La mayoría de cargadores de celular y portátil aceptan de 100 a 240 V, así que no suele hacer falta convertidor.' },
        { type: 'h3', text: 'SIM, eSIM y WhatsApp' },
        { type: 'p', text: 'Lo más fácil es una eSIM de viaje que actives antes de salir. Si prefieres una SIM local, Claro tiene la mejor cobertura, y también están Movistar, Tigo y WOM. Se consiguen en los puestos del aeropuerto El Dorado, en Bogotá. Lleva el pasaporte, porque lo piden.' },
        { type: 'p', text: 'Y ten WhatsApp a la mano: aquí todo se habla por ahí. Tu anfitrión, los restaurantes y los tours te van a escribir por WhatsApp.' },

        { type: 'h2', text: 'Expresiones colombianas que vas a oír' },
        { type: 'p', text: 'Aunque hables español, el de Colombia tiene lo suyo. Estas son las expresiones que más vas a escuchar:' },
        { type: 'ul', items: [
          '**¿Me regala…?** No te están pidiendo un regalo: es la forma cortés de pedir algo. “¿Me regala un tinto?” es “¿me da un café?”.',
          '**Tinto.** Café negro, en taza pequeña. No tiene nada que ver con el vino.',
          '**Con gusto.** La respuesta a “gracias”. La vas a oír todo el tiempo.',
          '**A la orden.** Lo dicen los vendedores para ofrecerte algo, y también equivale a “para servirle”.',
          '**Parce o parcero.** Amigo, compañero. Se usa en confianza.',
          '**Plata.** Así se le dice al dinero.',
          '**Trancón.** Embotellamiento. En Bogotá y Barranquilla lo vas a vivir.',
        ] },

        { type: 'h2', text: '¿Por qué el anfitrión me pide el pasaporte?' },
        { type: 'p', text: 'Todo alojamiento turístico legal en Colombia debe tener **RNT** (Registro Nacional de Turismo), y las plataformas de reservas están obligadas a mostrarlo. Busca el número en el anuncio: es una forma rápida de saber si el arriendo es legal.' },
        { type: 'p', text: 'Además, si eres extranjero, todo prestador de alojamiento, desde hoteles hasta anfitriones de Airbnb, debe reportar tu entrada y salida a Migración Colombia a través del sistema **SIRE**, y quien no lo hace se expone a multas. Por eso anfitriones como 77Rentals te piden los datos del pasaporte y una foto del sello de entrada. Es una obligación legal, no papeleo de más.' },
        { type: 'p', text: 'Si un anfitrión nunca te lo pide, fíjate bien: puede ser señal de que el alojamiento no está registrado.' },
        { type: 'p', text: '¿Te quedó alguna duda para tu viaje? Mira nuestros apartamentos en Cartagena, Santa Marta y Bogotá, o escríbenos por WhatsApp. Con gusto te ayudamos, así todavía estés decidiendo dónde quedarte.' },
        { type: 'cta' },
      ],
    },
    en: {
      title: 'Colombia Travel Tips: What to Know Before Your First Trip',
      metaDescription: 'Colombia travel tips for your first trip: visa and Check-MIG, money and tipping, safety, weather, water and SIM cards, all explained by locals.',
      excerpt: 'Visa rules, the Check-MIG form, money, safety and weather in Cartagena, Santa Marta and Bogotá: the practical things we wish every first-time visitor knew before landing in Colombia.',
      tags: ['Travel tips', 'Colombia'],
      body: [
        { type: 'h2', text: 'Do I need a visa for Colombia?' },
        { type: 'p', text: 'If you hold a passport from the US, Canada, the UK or any EU/Schengen country, you don\'t need a tourist visa. The immigration officer usually stamps you in for up to 90 days, although the exact number is at their discretion. You can stay a maximum of 180 days in any 12-month period, and extensions are possible.' },
        { type: 'p', text: 'Officers can ask for two things: proof of an onward or return ticket within those 90 days, and a passport valid for your whole stay. Six months of validity is the safe bet, since some airlines check it at boarding.' },
        { type: 'p', text: '**Canadians** pay a reciprocity entry fee on arrival, in place since November 2023. The amount is updated every year, so check Travel.gc.ca before you fly. Children under 14, travelers over 79 and visitors going only to San Andrés are exempt.' },
        { type: 'p', text: 'Travelling on another passport? Check Colombia\'s foreign ministry (Cancillería) site, because requirements vary by nationality.' },

        { type: 'h2', text: 'What is Check-MIG and do I have to fill it in?' },
        { type: 'p', text: 'Check-MIG is Migración Colombia\'s online pre-registration form. Fill it in: it\'s free, takes a few minutes, and some airlines ask for it before letting you board. You submit it between 72 hours and 1 hour before your flight, once when you arrive and again when you leave.' },
        { type: 'p', text: 'Use only the official site, apps.migracioncolombia.gov.co/pre-registro. Search results are full of look-alike pages that charge a “processing fee” for the same free form. If a site asks for your card number, close it.' },
        { type: 'p', text: 'Colombia\'s departure tax is usually included in your airfare, so you normally won\'t pay anything extra at the airport.' },

        { type: 'h2', text: 'What money should I bring, and are cards accepted?' },
        { type: 'p', text: 'The currency is the Colombian peso (COP). As of September 2026, one US dollar buys a little over 3,000 pesos, after a strong year for the peso. Rates move daily, so check the official rate (the TRM) on the Banco de la República site before you exchange.' },
        { type: 'p', text: 'Cards work in most restaurants, supermarkets and shops in Cartagena, Santa Marta and Bogotá. Carry cash for street food, taxis, beach vendors, markets and small towns, where card machines are often missing.' },
        { type: 'ul', items: [
          '**Use ATMs inside malls or bank branches**, not standalone machines on the street.',
          '**Expect a per-withdrawal fee** on foreign cards, so take out larger amounts less often.',
          '**Choose to be charged in pesos.** When the ATM or card machine offers to convert to your home currency, decline. That conversion rate is almost always worse.',
          '**Keep small bills.** A 100,000-peso note is hard to break at a fruit stand.',
        ] },

        { type: 'h2', text: 'Do you tip in Colombia?' },
        { type: 'p', text: 'In restaurants, a 2018 law (Ley 1935) lets places suggest a voluntary tip of up to 10%, listed on the bill as “servicio” or “propina voluntaria”. It is optional, and staff must ask whether you want it included. Beyond that, rounding up a taxi fare or leaving a few thousand pesos for a tour guide is appreciated, not expected.' },
        { type: 'tip', title: 'The question you\'ll hear at every restaurant', text: 'When you ask for the bill, the server will usually say “¿Desea incluir el servicio?” (Would you like to include the service charge?). Saying yes adds the suggested tip of up to 10%. If service was good, that\'s the normal thing to do. If not, “no, gracias” is perfectly fine.' },
        { type: 'p', text: 'One more money tip: foreign tourists can claim back VAT (IVA) on qualifying purchases of goods such as clothing, crafts, jewelry, emeralds and electronics. Keep your invoices and file with DIAN, the tax authority, before you leave the country. Its website lists the current rules and minimums.' },

        { type: 'h2', text: 'What is the best way to get around Colombia?' },
        { type: 'p', text: 'Fly between regions. Distances look short on the map, but the Andes make roads slow: Bogotá to the Caribbean coast by bus takes 18 to 20 hours or more. A flight from Bogotá to Cartagena or Santa Marta takes about an hour and a half.' },
        { type: 'p', text: 'Avianca is the largest domestic airline, and LATAM, JetSMART and Wingo also fly the main routes. If an older guide mentions Viva Air or Ultra Air, ignore it: neither flies anymore.' },
        { type: 'p', text: 'Between Cartagena and Santa Marta, go by road. The drive takes about 4 hours, longer with traffic around Barranquilla and Ciénaga. Shuttle companies such as Marsol (door-to-door in some areas) and Berlinastur make it easy.' },
        { type: 'p', text: 'In cities, don\'t hail taxis on the street. Use an app, a taxi booked by your hotel or host, or the official taxi line at the airport. Uber, DiDi and InDrive are widely used, but not formally regulated.' },

        { type: 'h2', text: 'When is the best time to visit Colombia?' },
        { type: 'p', text: 'Colombia sits close to the equator, so the weather depends more on altitude than on the season. Broadly, the driest months are December to March, with a shorter dry spell in the middle of the year. April and May, and October and November, are the rainiest, which you\'ll notice most in the Andes. El Niño and La Niña years can shift these patterns.' },
        { type: 'p', text: '**Cartagena and Santa Marta** are hot all year, around 28–32 °C, and humid. December to March brings the driest, breeziest days. Plan sightseeing on foot for early morning and late afternoon, and keep midday for the pool or the beach.' },
        { type: 'p', text: '**Bogotá** sits at about 2,600 m and runs cool, around 7–19 °C, with weather that changes several times a day. Pack layers and a rain jacket, even if you\'re heading to the coast afterwards.' },
        { type: 'tip', title: 'Take day one slow in Bogotá', text: 'The altitude hits some visitors on arrival: headaches, shortness of breath on stairs, poor sleep. Keep your first day light, drink plenty of water and go easy on alcohol. Save the trip up Monserrate for day two.' },
        { type: 'p', text: 'High season means higher prices and fuller flights: mid-December to mid-January, Semana Santa (Holy Week), mid-June to mid-July when Colombian schools are out, and the long weekends Colombians call “puentes festivos”.' },
        { type: 'tip', title: 'Book Semana Santa 2027 early', text: 'Holy Week 2027 runs from 21 to 28 March. Colombians head to the coast in huge numbers that week and on every puente (a long weekend with a Monday holiday), so flights and apartments in Cartagena and Santa Marta fill up early. If your dates overlap, book as soon as you can.' },

        { type: 'h2', text: 'Is Colombia safe for tourists?' },
        { type: 'p', text: 'The trouble travelers run into tends to follow the same few patterns, and nearly all of it is avoidable. Check your government\'s travel advisory before you go, then follow the rule Colombians repeat to each other: **no dar papaya**. Literally “don\'t give papaya”, it means don\'t make yourself an easy target.' },
        { type: 'ul', items: [
          '**Keep your phone out of sight near the curb.** Snatch thefts from motorbikes happen on busy streets. Step into a shop or away from the road to check your map.',
          '**Carry a copy of your passport**, not the original. Leave the original where you\'re staying.',
          '**Never leave a drink unattended**, and don\'t accept drinks or anything else from strangers. Scopolamine, a drug used to sedate and rob people, is a real risk in nightlife areas.',
          '**Be careful with dating apps.** Canada\'s travel advice specifically warns about dates that end in drugging and robbery. Meet in busy public places and don\'t bring a date back to where you\'re staying.',
          '**Use app or pre-booked taxis**, especially at night.',
        ] },
        { type: 'p', text: 'Vendors in Cartagena\'s walled city and on the beaches can be persistent. A firm, friendly “no, gracias” and walking on is enough.' },

        { type: 'h2', text: 'Can you drink the tap water in Colombia?' },
        { type: 'p', text: 'In Bogotá, yes: the city\'s tap water meets drinking-water standards. On the Caribbean coast, stick to bottled or filtered water.' },
        { type: 'h3', text: 'Do I need a yellow fever vaccine for Colombia?' },
        { type: 'p', text: 'Not to enter the country. But since April 2025, Parques Nacionales has been asking visitors for a yellow fever vaccination card at some national parks, including Tayrona and the Sierra Nevada de Santa Marta. If a park is on your list, check the current rule with Parques Nacionales before you go, and get the vaccine at least 10 days before your visit.' },
        { type: 'h3', text: 'What plugs does Colombia use?' },
        { type: 'p', text: 'Type A and B plugs at 110 V, 60 Hz, the same as the US and Canada. Travelers from the UK and Europe need an adapter. Most phone and laptop chargers handle 100–240 V, so a voltage converter usually isn\'t necessary.' },
        { type: 'h3', text: 'SIM cards, eSIM and WhatsApp' },
        { type: 'p', text: 'The easiest option is a travel eSIM set up before you fly. If you prefer a local SIM, Claro has the best coverage, with Movistar, Tigo and WOM as alternatives. You can buy one at kiosks in Bogotá\'s El Dorado airport. Bring your passport, because it\'s required.' },
        { type: 'p', text: 'Install WhatsApp if you don\'t have it. It\'s how Colombia communicates: your host, restaurants and tour operators will all message you there.' },

        { type: 'h2', text: 'Useful Spanish phrases for Colombia' },
        { type: 'p', text: 'Outside tourist areas, less English is spoken. A handful of phrases goes a long way, and a “buenos días” before any question is always well received.' },
        { type: 'ul', items: [
          '**¿Cuánto cuesta?** How much is it?',
          '**La cuenta, por favor.** The bill, please.',
          '**¿Me regala…?** Literally “will you gift me…?”, it\'s the everyday Colombian way to ask for something politely: “¿Me regala un tinto?” means “Could I have a small black coffee?”',
          '**¿Dónde queda…?** Where is…?',
          '**Con gusto.** “With pleasure”, the standard reply to “gracias”.',
        ] },

        { type: 'h2', text: 'Why does my host in Colombia ask for my passport?' },
        { type: 'p', text: 'Every legal tourist rental in Colombia must hold an **RNT** (Registro Nacional de Turismo), and booking platforms have to display it. Look for the number in the listing: it\'s a quick way to tell a legal rental from an informal one.' },
        { type: 'p', text: 'All lodging providers, from hotels to Airbnb hosts, must also report foreign guests\' check-in and check-out to Migración Colombia through a system called **SIRE**, and hosts who don\'t can be fined. That\'s why hosts like 77Rentals ask for your passport details and a photo of your entry stamp. It\'s a legal requirement, not extra paperwork.' },
        { type: 'p', text: 'If a host never asks, take note: it may be a sign the rental isn\'t registered.' },
        { type: 'p', text: 'Still have questions about your trip? Browse our apartments in Cartagena, Santa Marta and Bogotá, or message our team on WhatsApp. We\'re happy to help, even if you\'re still deciding where to stay.' },
        { type: 'cta' },
      ],
    },
    sources: [
      { title: 'GOV.UK: Colombia travel advice, entry requirements', url: 'https://www.gov.uk/foreign-travel-advice/colombia/entry-requirements' },
      { title: 'Government of Canada: Travel advice and advisories for Colombia', url: 'https://travel.gc.ca/destinations/colombia' },
      { title: 'Cancillería de Colombia: Exención de visado para la Unión Europea', url: 'https://www.cancilleria.gov.co/especiales/visado-union-europea/' },
      { title: 'Migración Colombia: Check-MIG pre-registration (official)', url: 'https://apps.migracioncolombia.gov.co/pre-registro/' },
      { title: 'Banco de la República: Tasa de cambio representativa del mercado (TRM)', url: 'https://suameca.banrep.gov.co/estadisticas-economicas/informacionSerie/1/tasa_cambio_peso_colombiano_trm_dolar_usd' },
      { title: 'Función Pública: Ley 1935 de 2018 (propina voluntaria)', url: 'https://www.funcionpublica.gov.co/eva/gestornormativo/norma.php?i=87873' },
      { title: 'DIAN: Devolución de IVA a turistas extranjeros', url: 'https://www.dian.gov.co/Viajeros-y-Servicios-aduaneros/Paginas/Devolucion-IVA-a-Turistas-Extranjeros-Esp.aspx' },
      { title: 'Colombia Travel: Health and vaccines', url: 'https://colombia.travel/en/practical-information/health-and-vaccines' },
      { title: 'Migración Colombia: Resolución 714 de 2015 (SIRE)', url: 'https://www.cancilleria.gov.co/sites/default/files/Normograma/docs/resolucion_uaemc_0714_2015.htm' },
    ],
  },
  {
    slug: 'surprising-facts-about-colombia',
    date: '2026-09-22',
    readingMinutes: 7,
    cover: '/images/cartagena.jpg',
    es: {
      title: "Datos curiosos de Colombia y dónde vivirlos",
      metaDescription: "Datos curiosos de Colombia, de los 11 km de murallas de Cartagena a la Ciclovía dominical de Bogotá, y dónde vivir cada uno en tu próximo viaje.",
      excerpt: "Colombia tiene más especies de aves y mariposas que cualquier otro país, una sierra nevada a 42 km del Caribe y una capital que cierra sus calles a los carros cada domingo. Estos son los datos que más sorprenden a quien viene por primera vez, y dónde vivir cada uno.",
      tags: ['Datos curiosos', 'Colombia'],
      body: [
        { type: 'p', text: "Cada vez más gente lo está descubriendo. En 2025 Colombia recibió **4.677.267 visitantes extranjeros**, un récord, y en el primer trimestre de 2026 la cifra siguió subiendo un 4,4 %, con Bogotá, Medellín y Cartagena como los destinos más visitados. Esto es lo que muchos de ellos no se esperaban." },

        { type: 'h2', text: "¿Por qué es famosa Cartagena?" },
        { type: 'h3', text: "Sus murallas miden unos 11 km" },
        { type: 'p', text: "Cartagena es Patrimonio de la Humanidad de la UNESCO desde 1984, y la propia UNESCO describe sus fortificaciones como las más extensas de Suramérica. Las murallas de piedra coralina recorren unos **11 km** y se terminaron en 1796." },
        { type: 'p', text: "El Castillo San Felipe de Barajas suele describirse como la fortaleza más grande que España construyó en sus colonias. Ve temprano: al mediodía el sol sobre la piedra no perdona. Para caminar la muralla, el mejor momento es el atardecer, cuando baja el calor y entra la brisa del mar." },
        { type: 'h3', text: "Gabo descansa dentro de la ciudad amurallada" },
        { type: 'p', text: "Desde 2016, parte de las cenizas de Gabriel García Márquez reposan en el **Claustro de La Merced**, de la Universidad de Cartagena, en pleno centro histórico. Y si leíste *El amor en los tiempos del cólera*, ya conoces la ciudad: la novela ocurre en una ciudad inspirada principalmente en Cartagena." },
        { type: 'h3', text: "El primer pueblo libre de América queda a una hora" },
        { type: 'p', text: "San Basilio de Palenque, a más o menos una hora de Cartagena, es conocido como el primer pueblo libre de América: un decreto real reconoció su libertad en 1691. La UNESCO lo declaró Obra Maestra del Patrimonio Inmaterial en 2005." },
        { type: 'p', text: "Allí se habla palenquero, la única lengua criolla de base española con raíces bantúes. Su música influyó muchísimo en la champeta, ese ritmo que vas a oír saliendo de cualquier picó en Cartagena. Si te quedas en Bocagrande o El Laguito, donde están nuestros apartamentos, tienes la ciudad amurallada a un trayecto corto en taxi y una buena base para salir temprano hacia Palenque." },

        { type: 'h2', text: "¿Qué tiene de especial Santa Marta?" },
        { type: 'h3', text: "Es la ciudad española más antigua que sigue en pie en Colombia" },
        { type: 'p', text: "Rodrigo de Bastidas fundó Santa Marta el **29 de julio de 1525**, así que la ciudad cumplió 500 años en 2025. Muy cerca queda Aracataca, el pueblo donde nació García Márquez y que inspiró Macondo." },
        { type: 'h3', text: "Picos nevados a 42 km del mar" },
        { type: 'p', text: "La Sierra Nevada de Santa Marta es la montaña costera más alta del mundo: llega a unos **5.700 m** a solo 42 km del Caribe. Es Reserva de la Biosfera de la UNESCO desde 1979. En un mismo día puedes pasar de la playa al bosque de niebla subiendo hacia Minca." },
        { type: 'h3', text: "Ciudad Perdida es más antigua que Machu Picchu" },
        { type: 'p', text: "Los tayrona construyeron Ciudad Perdida (Teyuna) hacia el año 800, unos 650 años antes que Machu Picchu. Tiene 169 terrazas y solo se llega caminando, en una travesía de varios días por la Sierra. Es exigente, con calor, barro y ríos por cruzar, pero pocos la terminan arrepentidos." },
        { type: 'h3', text: "Colombia es el país con más especies de aves" },
        { type: 'p', text: "Colombia es el número uno del mundo en aves, con más de **1.900 especies** y unas 79 endémicas. Minca, en las faldas de la Sierra arriba de Santa Marta, es uno de los mejores lugares para empezar. Si vas a Tayrona, ten en cuenta que Parques Nacionales lo cierra algunas temporadas cada año para que la naturaleza descanse, así que revisa las fechas antes de ir." },

        { type: 'h2', text: "¿Afecta la altura de Bogotá?" },
        { type: 'h3', text: "Vas a dormir a 2.640 metros" },
        { type: 'p', text: "Bogotá está a **2.640 m** sobre el nivel del mar, y Monserrate llega a 3.152 m. Puedes subir en teleférico, en funicular o a pie. La mayoría de la gente se adapta rápido, pero el primer día se nota: te cansas antes y el trago pega más." },
        { type: 'tip', title: "Monserrate, mejor el segundo día", text: "Si llegas de la costa, deja Monserrate para el segundo o tercer día. El primer día toma mucha agua, camina suave y bájale al alcohol. Sube temprano, que en la tarde la montaña suele nublarse." },
        { type: 'h3', text: "Cada domingo cierran 127 km de vías a los carros" },
        { type: 'p', text: "La Ciclovía de Bogotá existe desde el 15 de diciembre de 1974. Todos los domingos y festivos, de 7 a.m. a 2 p.m., cierra unos **127,7 km** de vías a los carros, y la usan alrededor de 1,5 millones de personas." },
        { type: 'tip', title: "Haz la Ciclovía como un rolo", text: "Alquila una bici o simplemente sal a caminar por la carrera Séptima un domingo en la mañana. Para en un puesto por un jugo o un tinto y vuelve antes de las 2 p.m., cuando reabren las vías." },
        { type: 'h3', text: "El Museo del Oro guarda más de 34.000 piezas" },
        { type: 'p', text: "El Museo del Oro del Banco de la República tiene la colección de orfebrería prehispánica más grande del mundo, con **más de 34.000 piezas de oro**. Resérvale al menos dos horas y no te pierdas la sala de la ofrenda." },

        { type: 'h2', text: "¿Qué datos curiosos tiene Colombia en general?" },
        { type: 'h3', text: "Una de cada cinco especies de mariposa del mundo" },
        { type: 'p', text: "Colombia también lidera en mariposas: tiene **3.642 especies**, cerca del 20 % del total mundial, y más de 200 son endémicas. Minca y los cafetales de la zona son buenos lugares para verlas." },
        { type: 'h3', text: "Un río que se pone rojo" },
        { type: 'p', text: "Caño Cristales, en La Macarena (Meta), es conocido como el río de los cinco colores. El rojo no viene de algas sino de una planta acuática endémica de Colombia, la *Macarenia clavigera*. Suele estar abierto de junio a noviembre, y hay que llegar en avión desde Bogotá." },
        { type: 'h3', text: "La zona cafetera es patrimonio de la UNESCO" },
        { type: 'p', text: "El Paisaje Cultural Cafetero entró en la lista de la UNESCO el 25 de junio de 2011. Abarca zonas de Caldas, Quindío, Risaralda y el Valle del Cauca, con fincas donde puedes ver todo el proceso, desde la mata hasta la taza." },
        { type: 'h3', text: "La mayoría de las mejores esmeraldas del mundo" },
        { type: 'p', text: "De Colombia sale la mayoría de las esmeraldas más finas del mundo, y Muzo, en Boyacá, es el nombre más famoso. En Bogotá hay joyerías especializadas. Si vas a gastar plata en serio, compra solo en tiendas establecidas que entreguen certificado." },
        { type: 'h3', text: "Dos tradiciones musicales reconocidas por la UNESCO" },
        { type: 'p', text: "El Carnaval de Barranquilla fue proclamado Obra Maestra de la UNESCO en 2003 y entró a la Lista Representativa en 2008. La cumbia es su ritmo insignia. El vallenato entró en 2015 a la lista de patrimonio que requiere medidas urgentes de salvaguardia." },
        { type: 'h3', text: "Colombia tiene 18 festivos en 2026" },
        { type: 'p', text: "Por la Ley Emiliani, muchos festivos se corren al lunes, y eso deja unos **15 puentes** en 2026. En esos fines de semana largos medio país se va para la costa: las playas se llenan y los precios suben." },
        { type: 'tip', title: "Revisa el calendario de puentes", text: "Antes de reservar en Cartagena o Santa Marta, mira si tus fechas caen en un puente. Si es así, reserva con tiempo. Si puedes moverte, llegar un martes después del puente suele significar playas más tranquilas y mejores precios." },

        { type: 'p', text: "¿Ya sabes cuál quieres vivir primero? Mira nuestros apartamentos en Cartagena, Santa Marta y Bogotá, o escríbenos por WhatsApp y te ayudamos a armar el viaje." },
        { type: 'cta' },
      ],
    },
    en: {
      title: "Surprising Facts About Colombia and Where to See Them",
      metaDescription: "Surprising facts about Colombia, from Cartagena's 11 km of walls to Bogotá's Sunday Ciclovía, plus exactly where to experience each one on your trip.",
      excerpt: "Colombia has more bird and butterfly species than any other country, a snowcapped range 42 km from the Caribbean, and a capital that closes its roads to cars every Sunday. Here are the facts that surprise first-time visitors most, and where to see each one for yourself.",
      tags: ['Fun facts', 'Colombia'],
      body: [
        { type: 'p', text: "More people are finding out. Colombia welcomed a record **4,677,267 foreign visitors** in 2025, and foreign arrivals rose another 4.4% in the first quarter of 2026, with Bogotá, Medellín and Cartagena the top destinations. Here is what many of them didn't expect." },

        { type: 'h2', text: "What is Cartagena famous for?" },
        { type: 'h3', text: "Its walls run for about 11 km" },
        { type: 'p', text: "Cartagena has been a UNESCO World Heritage Site since 1984, and UNESCO describes its fortifications as the most extensive in South America. The coral-stone walls stretch for about **11 km** and were completed in 1796." },
        { type: 'p', text: "Castillo San Felipe de Barajas is often described as the largest fortress Spain built in its colonies. Go early, because the midday sun on that stone is brutal. The best time to walk the ramparts is sunset, when the heat eases and the sea breeze picks up." },
        { type: 'h3', text: "García Márquez rests inside the walled city" },
        { type: 'p', text: "Since 2016, part of Gabriel García Márquez's ashes have rested in the **Claustro de La Merced**, part of the Universidad de Cartagena, right in the historic center. If you've read *Love in the Time of Cholera*, you already know the place: the novel is set in a city modeled mainly on Cartagena." },
        { type: 'h3', text: "The first free town in the Americas is an hour away" },
        { type: 'p', text: "San Basilio de Palenque, about an hour from Cartagena, is widely called the first free town in the Americas: a royal decree recognized its freedom in 1691. UNESCO proclaimed it a Masterpiece of Intangible Heritage in 2005." },
        { type: 'p', text: "People there speak Palenquero, the only Spanish-based creole language with a Bantu base. Its music shaped champeta, the sound you'll hear booming from speakers all over Cartagena. If you stay in Bocagrande or El Laguito, where our apartments are, the walled city is a short taxi ride away and you're well placed for an early start to Palenque." },

        { type: 'h2', text: "What makes Santa Marta special?" },
        { type: 'h3', text: "It's Colombia's oldest surviving Spanish-founded city" },
        { type: 'p', text: "Rodrigo de Bastidas founded Santa Marta on **29 July 1525**, so the city turned 500 in 2025. Nearby Aracataca is García Márquez's birthplace and the inspiration for Macondo." },
        { type: 'h3', text: "Snowcapped peaks 42 km from the sea" },
        { type: 'p', text: "The Sierra Nevada de Santa Marta is the world's highest coastal mountain range, rising to about **5,700 m** just 42 km from the Caribbean. It has been a UNESCO Biosphere Reserve since 1979. In one day you can go from the beach to cloud forest by heading up to Minca." },
        { type: 'h3', text: "Ciudad Perdida is older than Machu Picchu" },
        { type: 'p', text: "The Tairona built Ciudad Perdida (Teyuna) around 800 AD, roughly 650 years before Machu Picchu. It has 169 terraces and the only way in is on foot, on a multi-day trek through the Sierra. Expect heat, mud and river crossings. Few people finish it with regrets." },
        { type: 'h3', text: "Colombia has more bird species than any other country" },
        { type: 'p', text: "Colombia ranks first in the world for birds, with more than **1,900 species** and about 79 found nowhere else. Minca, in the foothills above Santa Marta, is a great place to start. If Tayrona is on your list, note that Parques Nacionales closes it for set periods each year to let nature rest, so check the dates before you go." },

        { type: 'h2', text: "Does Bogotá's altitude affect you?" },
        { type: 'h3', text: "You'll be sleeping at 2,640 meters" },
        { type: 'p', text: "Bogotá sits at **2,640 m** above sea level, and Monserrate reaches 3,152 m. You can go up by cable car, funicular or on foot. Most people adjust quickly, but you'll notice it on day one: you tire faster and drinks hit harder." },
        { type: 'tip', title: "Save Monserrate for day two", text: "If you're flying in from the coast, leave Monserrate for your second or third day. On day one, drink plenty of water, walk slowly and go easy on alcohol. Head up in the morning, because clouds often roll in by afternoon." },
        { type: 'h3', text: "127 km of streets go car-free every Sunday" },
        { type: 'p', text: "Bogotá's Ciclovía started on 15 December 1974. Every Sunday and public holiday from 7am to 2pm, about **127.7 km** of roads close to cars, and around 1.5 million people come out to use them." },
        { type: 'tip', title: "Do the Ciclovía like a local", text: "Rent a bike or just walk down Carrera Séptima on a Sunday morning. Stop at a street stand for fresh juice or a tinto (small black coffee) and be done before 2pm, when the roads reopen." },
        { type: 'h3', text: "The Gold Museum holds more than 34,000 gold pieces" },
        { type: 'p', text: "Bogotá's Gold Museum has the world's largest collection of pre-Hispanic goldwork, with **more than 34,000 gold pieces**. Give it at least two hours and don't skip the offering room." },

        { type: 'h2', text: "What is Colombia known for?" },
        { type: 'h3', text: "One in five of the world's butterfly species" },
        { type: 'p', text: "Colombia also leads the world in butterflies, with **3,642 species**. That's about 20% of the global total, and more than 200 are endemic. Minca and the coffee farms around it are good places to spot them." },
        { type: 'h3', text: "A river that turns red" },
        { type: 'p', text: "Caño Cristales, in La Macarena (Meta), is known as the river of five colors. The red doesn't come from algae but from an aquatic plant found only in Colombia, *Macarenia clavigera*. It's usually open from June to November, and you'll need to fly in from Bogotá." },
        { type: 'h3', text: "Coffee country is a UNESCO site" },
        { type: 'p', text: "The Coffee Cultural Landscape was added to UNESCO's list on 25 June 2011. It covers parts of Caldas, Quindío, Risaralda and Valle del Cauca, where farms show you the whole process, from plant to cup." },
        { type: 'h3', text: "Most of the world's finest emeralds" },
        { type: 'p', text: "Colombia produces most of the world's finest emeralds, and Muzo in Boyacá is the most famous name. Bogotá has specialist jewelers. If you're spending serious money, buy only from established shops that give you a certificate." },
        { type: 'h3', text: "Two music traditions recognized by UNESCO" },
        { type: 'p', text: "UNESCO proclaimed the Barranquilla Carnival a Masterpiece in 2003 and added it to its Representative List in 2008. Cumbia is its signature rhythm. In 2015, vallenato music was added to UNESCO's list of heritage in need of urgent safeguarding." },
        { type: 'h3', text: "Colombia has 18 public holidays in 2026" },
        { type: 'p', text: "Under the Ley Emiliani, many holidays move to Monday, which gives Colombia about **15 long weekends** (puentes) in 2026. On those weekends half the country heads for the coast, so beaches fill up and prices go up." },
        { type: 'tip', title: "Check the puente calendar", text: "Before you book Cartagena or Santa Marta, see whether your dates fall on a puente. If they do, book early. If you can be flexible, arriving on the Tuesday after a long weekend usually means quieter beaches and better rates." },

        { type: 'p', text: "Know which one you want to see first? Browse our apartments in Cartagena, Santa Marta and Bogotá, or message our team on WhatsApp and we'll help you plan the trip." },
        { type: 'cta' },
      ],
    },
    sources: [
      { title: "Infobae: Colombia registró menor llegada de visitantes no residentes durante 2025", url: 'https://www.infobae.com/colombia/2026/02/19/colombia-registro-menor-llegada-de-visitantes-no-residentes-durante-2025-hay-cifras-alentadoras-pese-a-mala-noticia/' },
      { title: "Semana: Perfil de los extranjeros que visitaron Colombia en el primer trimestre de 2026", url: 'https://www.semana.com/turismo/articulo/este-es-el-perfil-de-los-extranjeros-que-visitaron-colombia-en-el-primer-trimestre-de-2026/202626/' },
      { title: "UNESCO: Port, Fortresses and Group of Monuments, Cartagena", url: 'https://whc.unesco.org/en/list/285/' },
      { title: "Colombia Travel: The walls of Cartagena", url: 'https://colombia.travel/en/cartagena-de-indias-colombia/walls-cartagena' },
      { title: "El Universal: Una universidad de Cartagena custodia las cenizas de Gabriel García Márquez", url: 'https://portales.eluniversal.com.co/especiales/especial-gabo-eterno-10-anos/una-universidad-cartagena-custodia-cenizas-gabriel-garcia-marquez' },
      { title: "Colombia Travel: San Basilio de Palenque cultural space", url: 'https://colombia.travel/en/cartagena-de-indias/san-basilio-de-palenque-cultural-space' },
      { title: "Britannica: San Basilio de Palenque", url: 'https://www.britannica.com/place/San-Basilio-de-Palenque' },
      { title: "Colombia One: Santa Marta celebrates 500 years", url: 'https://colombiaone.com/2025/07/29/colombia-santa-marta-history-500-years-anniversary/' },
      { title: "Smithsonian: Earth's highest coastal mountain on the move", url: 'https://www.si.edu/newsdesk/releases/earth-s-highest-coastal-mountain-move' },
      { title: "Colombia Travel: Sierra Nevada de Santa Marta", url: 'https://colombia.travel/en/santa-marta/sierra-nevada' },
      { title: "CNN Travel: Ciudad Perdida, Colombia's Lost City", url: 'https://edition.cnn.com/travel/article/lost-city-ciudad-perdida-colombia/index.html' },
      { title: "Audubon: Colombia", url: 'https://www.audubon.org/our-work/americas/colombia/international-colombia' },
      { title: "Visit Bogotá: Monserrate hill", url: 'https://visitbogota.co/en/what-to-do-in-bogota/nature/monserrate-hill' },
      { title: "IDRD: Ciclovía Bogotá", url: 'https://www.idrd.gov.co/ciclovia' },
      { title: "Visit Bogotá: Gold Museum", url: 'https://visitbogota.co/en/what-to-do-in-bogota/culture/gold-museum' },
      { title: "Natural History Museum: Colombia has the most butterflies in the world", url: 'https://www.nhm.ac.uk/discover/news/2021/june/colombia-has-the-most-butterflies-in-the-world.html' },
      { title: "Colombia Travel: Caño Cristales", url: 'https://colombia.travel/en/la-macarena/be-amazed-cano-cristales' },
      { title: "UNESCO: Coffee Cultural Landscape of Colombia", url: 'https://whc.unesco.org/en/list/1121/' },
      { title: "GIA: The Colombian emerald industry", url: 'https://www.gia.edu/gems-gemology/fall-2017-colombian-emerald-industry' },
      { title: "UNESCO: Carnival of Barranquilla", url: 'https://ich.unesco.org/en/RL/carnival-of-barranquilla-00051' },
      { title: "UNESCO: Vallenato, traditional music of the Greater Magdalena region", url: 'https://ich.unesco.org/en/USL/vallenato-traditional-music-of-the-greater-magdalena-region-01095' },
      { title: "El País: Calendario de festivos en Colombia 2026", url: 'https://www.elpais.com.co/colombia/calendario-de-festivos-en-colombia-2026-lista-oficial-de-los-puentes-largos-y-dias-que-seran-feriados-2826.html' },
    ],
  },
];

export const SITE_URL = 'https://77rentals.com';

// Spanish lives at /blog/, English at /en/blog/. Trailing slashes match the
// prerendered directory layout (dist/blog/<slug>/index.html) so Apache serves
// them without a redirect.
export const blogPath = (lang: 'es' | 'en', slug?: string) =>
  `${lang === 'en' ? '/en' : ''}/blog/${slug ? `${slug}/` : ''}`;

export const langFromPath = (pathname: string): 'es' | 'en' =>
  pathname === '/en' || pathname.startsWith('/en/') ? 'en' : 'es';

export const getPostBySlug = (slug: string | undefined) =>
  blogPosts.find((p) => p.slug === slug);

export const formatPostDate = (iso: string, lang: 'es' | 'en') =>
  new Date(`${iso}T12:00:00`).toLocaleDateString(lang === 'es' ? 'es-CO' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
