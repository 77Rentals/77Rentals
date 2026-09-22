// Copy for the /ai consulting page (Spanish at /ai/, English at /en/ai/).
// Kept separate from src/data/translations.ts so the whole service can move
// to its own brand later by copying src/components/ai + src/pages/Ai.tsx.

export type AiLang = 'es' | 'en';

// Sebastian's own number, not the 77Rentals rentals line.
export const AI_WHATSAPP_NUMBER = '573502053147';

export const aiPath = (lang: AiLang) => (lang === 'en' ? '/en/ai/' : '/ai/');

export const aiWhatsAppUrl = (lang: AiLang, topic?: string) => {
  const base =
    lang === 'en'
      ? 'Hi Sebastian, I saw your AI consulting page (77rentals.com/ai).'
      : 'Hola Sebastian, vi tu página de consultoría en IA (77rentals.com/ai).';
  const tail = topic
    ? lang === 'en'
      ? ` I'm interested in: ${topic}`
      : ` Me interesa: ${topic}`
    : lang === 'en'
      ? " I'd like to talk about AI for my company."
      : ' Quisiera hablar sobre IA para mi empresa.';
  return `https://wa.me/${AI_WHATSAPP_NUMBER}?text=${encodeURIComponent(base + tail)}`;
};

// Shown in the scrolling strip under the hero. Names only, no logos.
export const AI_TOOLS = [
  'Claude',
  'Claude Code',
  'ChatGPT',
  'Gemini',
  'Grok (xAI)',
  'Cursor',
  'Microsoft Copilot',
  'n8n',
  'Make',
  'Zapier',
  'Supabase',
  'WhatsApp Business',
];

export interface ProblemCard {
  problem: string;
  detail: string;
  solution: string;
  offer: string;
}

export interface AiContent {
  meta: { title: string; description: string };
  nav: { services: string; work: string; howWeWork: string; cta: string; switchLang: string };
  hero: { eyebrow: string; titleA: string; titleB: string; subtitle: string; cta: string; ctaSecondary: string; location: string };
  toolsLabel: string;
  cases: {
    eyebrow: string;
    title: string;
    subtitle: string;
    items: { tag: string; title: string; result: string; body: string }[];
  };
  blueprint: {
    eyebrow: string;
    title: string;
    subtitle: string;
    label: string;
    industry: string;
    name: string;
    problem: string;
    flowTitle: string;
    flow: { step: string; detail: string }[];
    modules: { title: string; body: string }[];
    measureTitle: string;
    measures: string[];
    disclaimer: string;
    cta: string;
    ctaTopic: string;
  };
  pillars: {
    eyebrow: string;
    title: string;
    subtitle: string;
    packageLabel: string;
    items: { title: string; proof: string; body: string; stack: string; packageName: string; packageDetail: string }[];
    cta: string;
  };
  problems: {
    eyebrow: string;
    title: string;
    subtitle: string;
    tabs: { business: string; dev: string };
    business: ProblemCard[];
    dev: ProblemCard[];
    labels: { solution: string; talk: string };
    stats: { value: string; label: string }[];
    sourcesLabel: string;
    sources: { title: string; url: string }[];
  };
  numbers: { title: string; items: { value: string; label: string }[] };
  founders: { eyebrow: string; title: string; body: string; points: string[]; cta: string };
  process: { eyebrow: string; title: string; subtitle: string; steps: { title: string; duration: string; body: string }[] };
  responsible: { eyebrow: string; title: string; body: string; points: string[] };
  faq: { eyebrow: string; title: string; items: { q: string; a: string }[] };
  form: {
    eyebrow: string;
    title: string;
    subtitle: string;
    name: string;
    company: string;
    role: string;
    size: string;
    sizeOptions: string[];
    track: string;
    trackOptions: string[];
    problem: string;
    phone: string;
    email: string;
    consent: string;
    submit: string;
    sending: string;
    error: string;
    successTitle: string;
    successBody: string;
    orWhatsApp: string;
  };
  footer: { by: string; rentals: string; disclaimer: string };
}

export const aiContent: Record<AiLang, AiContent> = {
  es: {
    meta: {
      title: 'Consultoría en IA para empresas en Colombia | 77 Rentals',
      description:
        'Llevamos la IA de tu empresa del chat a la operación: diagnóstico, agentes de WhatsApp, automatización, capacitación y equipos de desarrollo con Claude Code y Cursor. Desde Bogotá para toda Colombia.',
    },
    nav: { services: 'Servicios', work: 'Casos', howWeWork: 'Proceso', cta: 'Hablemos', switchLang: 'EN' },
    hero: {
      eyebrow: 'Consultoría en IA · Bogotá, Colombia',
      titleA: 'Llevamos la IA de tu empresa',
      titleB: 'del chat a la operación.',
      subtitle:
        'Tu equipo ya usa ChatGPT, cada quien a su manera. Diseñamos, construimos y dejamos funcionando flujos de trabajo con IA que ahorran horas, reducen errores y cuidan los datos de tus clientes.',
      cta: 'Escríbeme por WhatsApp',
      ctaSecondary: 'Ver casos reales',
      location: 'Desde Bogotá para toda Colombia · Remoto y presencial',
    },
    toolsLabel: 'Trabajamos con las principales plataformas de IA',
    cases: {
      eyebrow: 'Casos reales',
      title: 'No lo aprendí en un curso. Lo construí para mi propia empresa.',
      subtitle:
        '77Rentals opera alquileres en Cartagena, Santa Marta y Bogotá. Estos sistemas los construimos con IA y los usamos todos los días.',
      items: [
        {
          tag: 'Documentos · Firma electrónica',
          title: 'Contratos que se firman desde el celular',
          result: 'De días de ida y vuelta a un enlace de firma.',
          body: 'Contratos y otrosíes generados automáticamente con los datos del cliente, enviados por enlace y firmados en línea con aviso de habeas data.',
        },
        {
          tag: 'Propiedad horizontal · Legal',
          title: 'Peticiones de copropiedad con coeficientes',
          result: 'Firmas de múltiples propietarios, con trazabilidad pública.',
          body: 'Peticiones para asambleas con cálculo de coeficientes, validación de datos y una lista pública de firmantes para transparencia.',
        },
        {
          tag: 'Contenido · Agentes de IA',
          title: 'Un blog bilingüe escrito con agentes',
          result: 'Artículos investigados, con fuentes y listos para Google.',
          body: 'Agentes especializados investigan, redactan en español e inglés y publican páginas pre-renderizadas con SEO técnico completo.',
        },
      ],
    },
    blueprint: {
      eyebrow: 'Soluciones por industria',
      title: 'Así se ve la IA en una empresa de logística y comercio exterior',
      subtitle: 'Un diseño de referencia para agencias de carga, operadores logísticos e importadores/exportadores. Lo adaptamos a tus procesos, tu agencia de aduanas y tus sistemas.',
      label: 'Solución tipo',
      industry: 'Logística · Comercio exterior',
      name: 'Operación documental y Plan Vallejo con agentes de IA',
      problem: 'Cada embarque trae facturas, listas de empaque, BL/AWB, certificados de origen y registros que alguien revisa a mano contra la DIAN y los programas especiales. Un dato cruzado significa retrasos, sanciones o insumos que pierden el beneficio.',
      flowTitle: 'Flujo',
      flow: [
        { step: 'Recepción', detail: 'Correo, WhatsApp o portal: los documentos del embarque llegan a una sola bandeja.' },
        { step: 'Lectura con IA', detail: 'Extrae partidas, valores, pesos, Incoterms y proveedor de PDFs y fotos.' },
        { step: 'Revisión cruzada', detail: 'Compara factura, lista de empaque, BL y orden de compra, y marca diferencias.' },
        { step: 'Control Plan Vallejo', detail: 'Cruza insumos importados con exportaciones y plazos del programa.' },
        { step: 'Aprobación humana', detail: 'El analista revisa alertas, corrige y aprueba. Nada sale sin su visto bueno.' },
      ],
      modules: [
        { title: 'Revisor documental', body: 'Detecta inconsistencias entre los documentos del embarque antes de que lleguen a la agencia de aduanas.' },
        { title: 'Agente experto en Plan Vallejo', body: 'Responde al equipo con base en la normativa y en los datos del programa: saldos de insumos, cuadros insumo-producto y vencimientos.' },
        { title: 'Tablero de embarques', body: 'Estado de cada operación, documentos faltantes y alertas de plazos en un solo lugar.' },
        { title: 'Asistente por WhatsApp', body: 'Clientes y proveedores preguntan por su carga y reciben respuesta con datos reales.' },
      ],
      measureTitle: 'Qué medimos desde el primer día',
      measures: ['Horas de revisión por embarque', 'Errores detectados antes de aduana', 'Días de anticipación en alertas', 'Tiempo de respuesta a clientes'],
      disclaimer: 'Caso ilustrativo basado en procesos típicos del sector; no corresponde a un cliente específico. La IA apoya al equipo y no reemplaza la asesoría aduanera ni tributaria.',
      cta: 'Quiero algo así para mi empresa',
      ctaTopic: 'Solución para logística / comercio exterior',
    },
    pillars: {
      eyebrow: 'Servicios',
      title: 'IA aplicada, de la estrategia a la operación',
      subtitle: 'Paquetes con alcance claro y precio fijo. Empiezas pequeño y creces con resultados.',
      packageLabel: 'Paquete',
      items: [
        {
          title: 'Diagnóstico de IA',
          proof: 'Hoja de ruta lista en 2 semanas',
          body: 'Entrevistamos a tu equipo, mapeamos procesos y priorizamos qué automatizar según el retorno.',
          stack: 'Mapa de procesos · Casos de uso · ROI · Riesgos y Ley 1581',
          packageName: 'Sprint de Diagnóstico',
          packageDetail: '2 semanas · precio fijo',
        },
        {
          title: 'Automatización y agentes',
          proof: 'Del flujo manual a un sistema que corre solo',
          body: 'Asistentes de WhatsApp, flujos de documentos y agentes que consultan la información de tu empresa.',
          stack: 'n8n · Make · Claude y OpenAI API · RAG · WhatsApp Business · Supabase',
          packageName: 'Agente de WhatsApp en 30 días',
          packageDetail: 'Diseño, construcción y puesta en marcha',
        },
        {
          title: 'IA para equipos de desarrollo',
          proof: 'El mismo flujo con el que construimos este sitio',
          body: 'Configuramos Claude Code y Cursor en tus repositorios, con agentes, reglas y revisión de código con IA.',
          stack: 'Claude Code · Cursor · MCP · Subagentes · CLAUDE.md · Revisión en pull requests',
          packageName: 'Bootcamp Claude Code / Cursor',
          packageDetail: '2 días con tu equipo, sobre tu código',
        },
        {
          title: 'Capacitación',
          proof: 'Tu equipo usándola bien desde la semana siguiente',
          body: 'Talleres prácticos con los casos reales de cada área: ventas, operaciones, administración.',
          stack: 'ChatGPT · Claude · Gemini · Copilot · Guías internas · Políticas de uso',
          packageName: 'Taller IA para tu equipo',
          packageDetail: '4 horas · hasta 15 personas',
        },
        {
          title: 'Líder de IA fraccional',
          proof: 'Un responsable de IA sin contratar uno de tiempo completo',
          body: 'Acompañamiento mensual: nuevas automatizaciones, soporte, métricas y seguimiento de herramientas.',
          stack: 'Roadmap trimestral · Métricas · Soporte · Nuevos casos de uso',
          packageName: 'Acompañamiento mensual',
          packageDetail: 'Plan mensual, sin permanencia larga',
        },
      ],
      cta: 'Preguntar por este paquete',
    },
    problems: {
      eyebrow: '¿Te suena conocido?',
      title: 'El problema no es el acceso a la IA. Es cómo se usa.',
      subtitle: 'Las pymes colombianas adoptan IA rápido, pero muy pocas la integran a su operación.',
      tabs: { business: 'Para tu negocio', dev: 'Para tu equipo de desarrollo' },
      business: [
        {
          problem: 'Mi equipo usa ChatGPT, pero cada quien a su manera.',
          detail: 'Uso informal, sin estándares, resultados desiguales.',
          solution: 'Capacitación práctica, guías internas y herramientas aprobadas para cada área.',
          offer: 'Capacitación',
        },
        {
          problem: 'Perdemos horas en tareas repetitivas.',
          detail: 'Cotizaciones, reportes, copiar y pegar entre Excel, correo y el CRM.',
          solution: 'Mapeamos tus procesos y automatizamos los 2 o 3 que más horas consumen.',
          offer: 'Diagnóstico + Automatización',
        },
        {
          problem: 'Los clientes escriben por WhatsApp y nadie responde a tiempo.',
          detail: 'Leads perdidos de noche y los fines de semana.',
          solution: 'Un asistente con IA que responde, califica y pasa el cliente a una persona.',
          offer: 'Automatización',
        },
        {
          problem: 'Contratos y documentos nos toman días.',
          detail: 'Redactar, revisar y perseguir firmas.',
          solution: 'Generación de documentos y firma electrónica, como lo hicimos en 77Rentals.',
          offer: 'Automatización',
        },
        {
          problem: 'Nos da miedo meter datos de clientes en la IA.',
          detail: 'Ley 1581 de 2012 y la Circular 002 de 2024 de la SIC.',
          solution: 'Adopción segura: qué datos van a qué herramienta, autorizaciones y políticas internas.',
          offer: 'Diagnóstico',
        },
        {
          problem: 'No sé por dónde empezar ni si vale la pena.',
          detail: 'Muchas herramientas, poca claridad sobre el retorno.',
          solution: 'Un diagnóstico a precio fijo con una hoja de ruta priorizada por retorno.',
          offer: 'Diagnóstico',
        },
      ],
      dev: [
        {
          problem: 'No sabemos cómo arrancar con Claude Code o Cursor.',
          detail: 'Licencias compradas, poco uso real.',
          solution: 'Configuración por repositorio: CLAUDE.md y reglas del proyecto, permisos, MCP e integraciones.',
          offer: 'Bootcamp',
        },
        {
          problem: 'La IA escribe código que rompe producción.',
          detail: '"Vibe coding" sin pruebas ni revisión.',
          solution: 'Flujo plan → pruebas → revisión, con revisión de código asistida por IA en cada pull request.',
          offer: 'Bootcamp',
        },
        {
          problem: 'Cada desarrollador usa la IA distinto.',
          detail: 'Nada se comparte, nada se reutiliza.',
          solution: 'Agentes, subagentes y skills compartidos en el repositorio, más un playbook del equipo.',
          offer: 'Implementación',
        },
        {
          problem: 'No sabemos si la IA realmente nos ahorra tiempo.',
          detail: 'Costos de tokens y licencias sin medir.',
          solution: 'Piloto con un equipo, métricas de entrega y control de costos antes de escalar.',
          offer: 'Diagnóstico',
        },
      ],
      labels: { solution: 'Solución', talk: 'Hablemos de esto' },
      stats: [
        { value: '40%', label: 'de las pymes en Colombia ya usa IA' },
        { value: '~10%', label: 'alcanza un nivel de madurez avanzado' },
        { value: '40%', label: 'de las mipymes no tiene planes de adoptarla' },
      ],
      sourcesLabel: 'Fuentes',
      sources: [
        { title: 'Cintel (Impacto TIC)', url: 'https://impactotic.co/inteligencia-artificial/adopcion-de-ia-en-empresas-colombia-andicom/' },
        { title: 'AWS / MinTIC (El País)', url: 'https://www.elpais.com.co/colombia/cada-5-minutos-una-empresa-colombiana-adopta-ia-asi-lo-revela-el-nuevo-estudio-de-aws-esto-es-lo-que-hay-detras-de-la-cifra-3048.html' },
      ],
    },
    numbers: {
      title: 'La mayoría de proyectos de IA mueren después del demo. Nosotros los dejamos en operación.',
      items: [
        { value: '5', label: 'sistemas con IA en operación en 77Rentals' },
        { value: '3', label: 'ciudades donde operamos' },
        { value: '2', label: 'idiomas en todo lo que construimos' },
        { value: '1581', label: 'Ley de datos que cumplimos desde el diseño' },
      ],
    },
    founders: {
      eyebrow: 'Programa Fundadores',
      title: 'Buscamos las primeras 3 empresas.',
      body:
        'Estamos abriendo la consultoría a empresas fuera de 77Rentals. Las primeras 3 reciben condiciones preferenciales a cambio de algo simple: contar su caso.',
      points: [
        'Condiciones preferenciales en el primer proyecto',
        'Acompañamiento directo de Sebastian',
        'A cambio: un testimonio y un caso publicado',
      ],
      cta: 'Quiero ser uno de los 3',
    },
    process: {
      eyebrow: 'Cómo trabajamos',
      title: 'De la idea a la operación, en 4 pasos',
      subtitle: 'Empiezas con poco riesgo y creces según los resultados.',
      steps: [
        { title: 'Diagnóstico', duration: '1–2 semanas · precio fijo', body: 'Entrevistas con tu equipo, mapa de procesos y una hoja de ruta de IA priorizada por retorno.' },
        { title: 'Implementación', duration: '2–6 semanas por proyecto', body: 'Construimos las 1 a 3 automatizaciones con mayor impacto y las dejamos funcionando.' },
        { title: 'Capacitación', duration: 'Presencial o virtual', body: 'Tu equipo aprende a usar la IA en su trabajo diario, con sus propios casos.' },
        { title: 'Acompañamiento', duration: 'Mensual', body: 'Un líder de IA fraccional: mejora continua, nuevas automatizaciones y soporte.' },
      ],
    },
    responsible: {
      eyebrow: 'IA responsable',
      title: 'Adopción de IA que cumple la ley',
      body:
        'Usar IA con datos de clientes exige autorizaciones específicas bajo la Ley 1581 de 2012, y la SIC ya publicó lineamientos sobre IA (Circular 002 de 2024). Lo incluimos desde el primer día.',
      points: [
        'Clasificamos qué datos pueden ir a qué herramienta',
        'Textos de autorización y avisos de privacidad',
        'Políticas internas de uso de IA para tu equipo',
      ],
    },
    faq: {
      eyebrow: 'Preguntas frecuentes',
      title: 'Lo que suelen preguntarme',
      items: [
        { q: '¿Necesito saber programar?', a: 'No. Los servicios para negocio están pensados para dueños y equipos sin conocimientos técnicos. El bootcamp de desarrollo sí es para equipos que escriben código.' },
        { q: '¿Trabajas remoto o presencial?', a: 'Ambos. Estoy en Bogotá y atiendo empresas en toda Colombia de forma remota; los talleres pueden ser presenciales.' },
        { q: '¿Cuánto cuesta?', a: 'Cada paquete tiene alcance y precio fijo según el tamaño de tu empresa. Tras una primera conversación te envío una propuesta clara, sin sorpresas.' },
        { q: '¿Cuánto tarda en verse un resultado?', a: 'El diagnóstico toma 1 a 2 semanas. Una primera automatización suele quedar funcionando en 2 a 6 semanas.' },
        { q: '¿Qué herramientas usan?', a: 'Las que mejor sirvan a tu caso: Claude, ChatGPT, Gemini, Cursor, n8n y otras. No vendemos una herramienta; la elegimos según tu presupuesto y tus datos.' },
        { q: '¿Qué pasa con los datos de mi empresa?', a: 'Definimos desde el inicio qué información puede usarse con cada herramienta, conforme a la Ley 1581 de 2012.' },
      ],
    },
    form: {
      eyebrow: 'Contacto',
      title: 'Cuéntame sobre tu empresa',
      subtitle: 'Te respondo por WhatsApp o correo en menos de 24 horas hábiles.',
      name: 'Nombre completo',
      company: 'Empresa',
      role: 'Cargo',
      size: 'Tamaño de la empresa',
      sizeOptions: ['1–10 personas', '11–50 personas', '51–200 personas', 'Más de 200 personas'],
      track: '¿Qué te interesa?',
      trackOptions: ['IA para mi negocio', 'IA para mi equipo de desarrollo', 'Ambas', 'Programa Fundadores'],
      problem: '¿Cuál es el principal problema que quieres resolver?',
      phone: 'WhatsApp',
      email: 'Correo electrónico',
      consent: 'Autorizo el tratamiento de mis datos personales para ser contactado sobre este servicio, conforme a la Ley 1581 de 2012.',
      submit: 'Enviar',
      sending: 'Enviando...',
      error: 'Hubo un error. Intenta de nuevo o escríbeme por WhatsApp.',
      successTitle: '¡Gracias! Recibí tu mensaje.',
      successBody: 'Te contactaré en menos de 24 horas hábiles.',
      orWhatsApp: '¿Prefieres WhatsApp?',
    },
    footer: {
      by: 'Consultoría en IA por',
      rentals: 'Alquileres 77Rentals',
      disclaimer: 'Las marcas mencionadas pertenecen a sus dueños. No estamos afiliados a ellas.',
    },
  },
  en: {
    meta: {
      title: 'AI Consulting for Companies in Colombia | 77 Rentals',
      description:
        'We take your company’s AI from chat to operations: assessments, WhatsApp agents, automation, team training and developer teams on Claude Code and Cursor. Based in Bogotá, serving all of Colombia.',
    },
    nav: { services: 'Services', work: 'Work', howWeWork: 'Process', cta: 'Let’s talk', switchLang: 'ES' },
    hero: {
      eyebrow: 'AI Consulting · Bogotá, Colombia',
      titleA: 'We take your company’s AI',
      titleB: 'from chat to operations.',
      subtitle:
        'Your team already uses ChatGPT, each person in their own way. We design, build and run AI workflows that save hours, cut errors and protect your customers’ data.',
      cta: 'Message me on WhatsApp',
      ctaSecondary: 'See real cases',
      location: 'Based in Bogotá, serving all of Colombia · Remote and on-site',
    },
    toolsLabel: 'We work across the major AI platforms',
    cases: {
      eyebrow: 'Real cases',
      title: 'I didn’t learn this in a course. I built it for my own company.',
      subtitle:
        '77Rentals runs rentals in Cartagena, Santa Marta and Bogotá. We built these systems with AI and use them every day.',
      items: [
        {
          tag: 'Documents · E-signature',
          title: 'Contracts signed from a phone',
          result: 'From days of back-and-forth to one signing link.',
          body: 'Contracts and amendments generated automatically from client data, sent by link and signed online with a data-protection notice.',
        },
        {
          tag: 'HOA · Legal',
          title: 'HOA petitions with ownership coefficients',
          result: 'Multi-owner signatures with public traceability.',
          body: 'Petitions for owners’ assemblies with coefficient math, data validation and a public signer roster for transparency.',
        },
        {
          tag: 'Content · AI agents',
          title: 'A bilingual blog written with agents',
          result: 'Researched, sourced articles, ready for Google.',
          body: 'Specialized agents research, write in Spanish and English, and publish prerendered pages with full technical SEO.',
        },
      ],
    },
    blueprint: {
      eyebrow: 'Solutions by industry',
      title: 'What AI looks like in a logistics and foreign-trade company',
      subtitle: 'A reference design for freight forwarders, logistics operators and importers/exporters. We adapt it to your processes, customs broker and systems.',
      label: 'Reference solution',
      industry: 'Logistics · Foreign trade',
      name: 'Document operations and Plan Vallejo with AI agents',
      problem: 'Every shipment brings invoices, packing lists, BL/AWB, certificates of origin and records that someone checks by hand against DIAN and special programs. One mismatched field means delays, penalties or inputs losing their benefit.',
      flowTitle: 'Flow',
      flow: [
        { step: 'Intake', detail: 'Email, WhatsApp or portal: shipment documents land in one inbox.' },
        { step: 'AI reading', detail: 'Extracts tariff lines, values, weights, Incoterms and supplier from PDFs and photos.' },
        { step: 'Cross-check', detail: 'Compares invoice, packing list, BL and purchase order, and flags differences.' },
        { step: 'Plan Vallejo control', detail: 'Matches imported inputs against exports and program deadlines.' },
        { step: 'Human approval', detail: 'The analyst reviews alerts, corrects and approves. Nothing goes out without sign-off.' },
      ],
      modules: [
        { title: 'Document reviewer', body: 'Catches inconsistencies between shipment documents before they reach the customs broker.' },
        { title: 'Plan Vallejo expert agent', body: 'Answers the team from the regulations and the program data: input balances, input-output tables and deadlines.' },
        { title: 'Shipment dashboard', body: 'Status of every operation, missing documents and deadline alerts in one place.' },
        { title: 'WhatsApp assistant', body: 'Customers and suppliers ask about their cargo and get answers from real data.' },
      ],
      measureTitle: 'What we measure from day one',
      measures: ['Review hours per shipment', 'Errors caught before customs', 'Days of warning on deadlines', 'Customer response time'],
      disclaimer: 'Illustrative case based on typical industry processes; it does not describe a specific client. AI supports the team and does not replace customs or tax advice.',
      cta: 'I want this for my company',
      ctaTopic: 'Logistics / foreign trade solution',
    },
    pillars: {
      eyebrow: 'Services',
      title: 'Applied AI, from strategy to operations',
      subtitle: 'Packages with clear scope and a fixed price. Start small and grow with results.',
      packageLabel: 'Package',
      items: [
        {
          title: 'AI Assessment',
          proof: 'A roadmap in 2 weeks',
          body: 'We interview your team, map processes and rank what to automate by return.',
          stack: 'Process map · Use cases · ROI · Risk and data-protection law',
          packageName: 'Assessment Sprint',
          packageDetail: '2 weeks · fixed price',
        },
        {
          title: 'Automation and agents',
          proof: 'From a manual flow to a system that runs itself',
          body: 'WhatsApp assistants, document flows and agents that query your company’s own information.',
          stack: 'n8n · Make · Claude and OpenAI APIs · RAG · WhatsApp Business · Supabase',
          packageName: 'WhatsApp agent in 30 days',
          packageDetail: 'Design, build and launch',
        },
        {
          title: 'AI for dev teams',
          proof: 'The same workflow we built this site with',
          body: 'We set up Claude Code and Cursor in your repos, with agents, rules and AI code review.',
          stack: 'Claude Code · Cursor · MCP · Subagents · CLAUDE.md · Pull request review',
          packageName: 'Claude Code / Cursor Bootcamp',
          packageDetail: '2 days with your team, on your code',
        },
        {
          title: 'Training',
          proof: 'Your team using it well by next week',
          body: 'Hands-on workshops built on each area’s real cases: sales, operations, admin.',
          stack: 'ChatGPT · Claude · Gemini · Copilot · Internal playbooks · Usage policies',
          packageName: 'AI Workshop for your team',
          packageDetail: '4 hours · up to 15 people',
        },
        {
          title: 'Fractional AI lead',
          proof: 'An AI owner without a full-time hire',
          body: 'Monthly support: new automations, metrics, help and tool tracking.',
          stack: 'Quarterly roadmap · Metrics · Support · New use cases',
          packageName: 'Monthly support',
          packageDetail: 'Month-to-month plan',
        },
      ],
      cta: 'Ask about this package',
    },
    problems: {
      eyebrow: 'Sound familiar?',
      title: 'The problem isn’t access to AI. It’s how it’s used.',
      subtitle: 'Colombian SMBs are adopting AI fast, but very few build it into how they operate.',
      tabs: { business: 'For your business', dev: 'For your dev team' },
      business: [
        { problem: 'My team uses ChatGPT, but everyone does it differently.', detail: 'Informal use, no standards, uneven results.', solution: 'Hands-on training, internal playbooks and approved tools for each area.', offer: 'Training' },
        { problem: 'We lose hours on repetitive work.', detail: 'Quotes, reports, copy-pasting between Excel, email and the CRM.', solution: 'We map your processes and automate the 2 or 3 that eat the most hours.', offer: 'Assessment + Automation' },
        { problem: 'Customers message on WhatsApp and nobody answers in time.', detail: 'Leads lost at night and on weekends.', solution: 'An AI assistant that answers, qualifies and hands the customer to a person.', offer: 'Automation' },
        { problem: 'Contracts and documents take us days.', detail: 'Drafting, reviewing and chasing signatures.', solution: 'Document generation and e-signature, the way we did it at 77Rentals.', offer: 'Automation' },
        { problem: 'We’re afraid to put customer data into AI.', detail: 'Colombia’s Law 1581 of 2012 and SIC Circular 002 of 2024.', solution: 'Safe adoption: which data goes to which tool, consent language and internal policies.', offer: 'Assessment' },
        { problem: 'I don’t know where to start or if it’s worth it.', detail: 'Lots of tools, little clarity on return.', solution: 'A fixed-price assessment with a roadmap ranked by return.', offer: 'Assessment' },
      ],
      dev: [
        { problem: 'We don’t know how to get started with Claude Code or Cursor.', detail: 'Licenses bought, little real use.', solution: 'Per-repo setup: CLAUDE.md and project rules, permissions, MCP and integrations.', offer: 'Bootcamp' },
        { problem: 'AI writes code that breaks production.', detail: '“Vibe coding” with no tests or review.', solution: 'A plan → test → review workflow, with AI-assisted code review on every pull request.', offer: 'Bootcamp' },
        { problem: 'Every developer uses AI differently.', detail: 'Nothing is shared, nothing is reused.', solution: 'Shared agents, subagents and skills in the repo, plus a team playbook.', offer: 'Build' },
        { problem: 'We can’t tell if AI actually saves us time.', detail: 'Token and license costs go unmeasured.', solution: 'A pilot with one team, delivery metrics and cost control before scaling.', offer: 'Assessment' },
      ],
      labels: { solution: 'Solution', talk: 'Let’s talk about this' },
      stats: [
        { value: '40%', label: 'of Colombian SMBs already use AI' },
        { value: '~10%', label: 'reach an advanced maturity level' },
        { value: '40%', label: 'of micro and small firms have no plans to adopt it' },
      ],
      sourcesLabel: 'Sources',
      sources: [
        { title: 'Cintel (Impacto TIC)', url: 'https://impactotic.co/inteligencia-artificial/adopcion-de-ia-en-empresas-colombia-andicom/' },
        { title: 'AWS / MinTIC (El País)', url: 'https://www.elpais.com.co/colombia/cada-5-minutos-una-empresa-colombiana-adopta-ia-asi-lo-revela-el-nuevo-estudio-de-aws-esto-es-lo-que-hay-detras-de-la-cifra-3048.html' },
      ],
    },
    numbers: {
      title: 'Most AI projects die after the demo. We leave ours running.',
      items: [
        { value: '5', label: 'AI systems running at 77Rentals' },
        { value: '3', label: 'cities we operate in' },
        { value: '2', label: 'languages in everything we build' },
        { value: '1581', label: 'Colombia’s data law, built in by design' },
      ],
    },
    founders: {
      eyebrow: 'Founders Program',
      title: 'We’re looking for the first 3 companies.',
      body:
        'We’re opening this consulting to companies beyond 77Rentals. The first 3 get preferential terms in exchange for something simple: telling their story.',
      points: [
        'Preferential terms on the first project',
        'Direct work with Sebastian',
        'In return: a testimonial and a published case',
      ],
      cta: 'I want to be one of the 3',
    },
    process: {
      eyebrow: 'How we work',
      title: 'From idea to operations, in 4 steps',
      subtitle: 'Start with low risk and grow based on results.',
      steps: [
        { title: 'Assessment', duration: '1–2 weeks · fixed price', body: 'Team interviews, a process map and an AI roadmap ranked by return.' },
        { title: 'Build', duration: '2–6 weeks per project', body: 'We build the 1 to 3 highest-impact automations and leave them running.' },
        { title: 'Training', duration: 'On-site or virtual', body: 'Your team learns to use AI in their daily work, on their own cases.' },
        { title: 'Ongoing support', duration: 'Monthly', body: 'A fractional AI lead: continuous improvement, new automations and support.' },
      ],
    },
    responsible: {
      eyebrow: 'Responsible AI',
      title: 'AI adoption that follows the law',
      body:
        'Using AI with customer data in Colombia requires specific consent under Law 1581 of 2012, and the SIC has published AI guidance (Circular 002 of 2024). We build that in from day one.',
      points: [
        'We classify which data can go to which tool',
        'Consent language and privacy notices',
        'Internal AI-use policies for your team',
      ],
    },
    faq: {
      eyebrow: 'FAQ',
      title: 'What people usually ask',
      items: [
        { q: 'Do I need to know how to code?', a: 'No. The business services are built for owners and non-technical teams. The dev bootcamp is for teams that write code.' },
        { q: 'Do you work remotely or on-site?', a: 'Both. I’m based in Bogotá and work with companies across Colombia remotely; workshops can be on-site.' },
        { q: 'How much does it cost?', a: 'Each package has a fixed scope and price based on company size. After a first conversation I send a clear proposal, no surprises.' },
        { q: 'How soon will we see results?', a: 'The assessment takes 1 to 2 weeks. A first automation is usually running within 2 to 6 weeks.' },
        { q: 'Which tools do you use?', a: 'Whatever fits your case best: Claude, ChatGPT, Gemini, Cursor, n8n and others. We don’t sell one tool; we pick based on your budget and data.' },
        { q: 'What happens to my company’s data?', a: 'From the start we define which information can be used with each tool, in line with Law 1581 of 2012.' },
      ],
    },
    form: {
      eyebrow: 'Contact',
      title: 'Tell me about your company',
      subtitle: 'I’ll reply by WhatsApp or email within 24 business hours.',
      name: 'Full name',
      company: 'Company',
      role: 'Role',
      size: 'Company size',
      sizeOptions: ['1–10 people', '11–50 people', '51–200 people', '200+ people'],
      track: 'What are you interested in?',
      trackOptions: ['AI for my business', 'AI for my dev team', 'Both', 'Founders Program'],
      problem: 'What’s the main problem you want to solve?',
      phone: 'WhatsApp',
      email: 'Email',
      consent: 'I authorize the processing of my personal data to be contacted about this service, under Colombian Law 1581 of 2012.',
      submit: 'Send',
      sending: 'Sending...',
      error: 'Something went wrong. Try again or message me on WhatsApp.',
      successTitle: 'Thanks! I got your message.',
      successBody: 'I’ll get back to you within 24 business hours.',
      orWhatsApp: 'Prefer WhatsApp?',
    },
    footer: {
      by: 'AI consulting by',
      rentals: '77Rentals stays',
      disclaimer: 'Trademarks mentioned belong to their owners. We are not affiliated with them.',
    },
  },
};
