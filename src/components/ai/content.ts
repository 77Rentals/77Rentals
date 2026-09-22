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

export interface ProblemCard {
  problem: string;
  detail: string;
  solution: string;
  offer: string;
}

export interface AiContent {
  meta: { title: string; description: string };
  nav: { services: string; howWeWork: string; contact: string; switchLang: string };
  hero: { eyebrow: string; title: string; subtitle: string; ctaWhatsApp: string; ctaServices: string; location: string };
  gap: { eyebrow: string; title: string; subtitle: string; stats: { value: string; label: string }[]; sourcesLabel: string; sources: { title: string; url: string }[] };
  tracks: { eyebrow: string; title: string; business: { title: string; audience: string; body: string }; dev: { title: string; audience: string; body: string }; cta: string };
  business: { eyebrow: string; title: string; subtitle: string; cards: ProblemCard[] };
  dev: { eyebrow: string; title: string; subtitle: string; cards: ProblemCard[] };
  cardLabels: { solution: string; talk: string };
  caseStudy: { eyebrow: string; title: string; subtitle: string; items: { title: string; body: string }[] };
  process: { eyebrow: string; title: string; subtitle: string; steps: { title: string; duration: string; body: string }[] };
  tools: { eyebrow: string; title: string; subtitle: string; list: string[]; disclaimer: string };
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
  footer: { by: string; rentals: string };
}

export const aiContent: Record<AiLang, AiContent> = {
  es: {
    meta: {
      title: 'Consultoría en IA para empresas en Colombia | 77 Rentals',
      description:
        'Ayudo a pymes colombianas a pasar del uso informal de ChatGPT a flujos de trabajo con IA que ahorran horas: diagnóstico, automatización, capacitación y equipos de desarrollo con Claude Code y Cursor.',
    },
    nav: { services: 'Servicios', howWeWork: 'Cómo trabajamos', contact: 'Contacto', switchLang: 'EN' },
    hero: {
      eyebrow: 'Consultoría en Inteligencia Artificial',
      title: 'La IA ya está en tu empresa. Hagámosla trabajar bien.',
      subtitle:
        'Tu equipo ya usa ChatGPT, cada quien a su manera. Te ayudo a convertir ese uso informal en flujos de trabajo reales que ahorran horas, reducen errores y cuidan los datos de tus clientes.',
      ctaWhatsApp: 'Escríbeme por WhatsApp',
      ctaServices: 'Ver servicios',
      location: 'Desde Bogotá para toda Colombia · Remoto y presencial',
    },
    gap: {
      eyebrow: 'La brecha',
      title: 'El problema no es el acceso a la IA. Es cómo se usa.',
      subtitle:
        'Las pymes colombianas adoptan IA rápido, pero muy pocas la integran de verdad a su operación.',
      stats: [
        { value: '40%', label: 'de las pymes en Colombia ya usa IA' },
        { value: '~10%', label: 'alcanza un nivel de madurez avanzado' },
        { value: '40%', label: 'de las micro, pequeñas y medianas empresas no tiene planes de adoptarla' },
      ],
      sourcesLabel: 'Fuentes',
      sources: [
        { title: 'Estudio Cintel sobre adopción de IA (Impacto TIC)', url: 'https://impactotic.co/inteligencia-artificial/adopcion-de-ia-en-empresas-colombia-andicom/' },
        { title: 'Estudio AWS citado por MinTIC (El País)', url: 'https://www.elpais.com.co/colombia/cada-5-minutos-una-empresa-colombiana-adopta-ia-asi-lo-revela-el-nuevo-estudio-de-aws-esto-es-lo-que-hay-detras-de-la-cifra-3048.html' },
      ],
    },
    tracks: {
      eyebrow: 'Elige tu ruta',
      title: '¿Para quién es?',
      business: {
        title: 'IA para tu negocio',
        audience: 'Dueños, gerentes, operaciones, ventas y administración',
        body: 'Automatizaciones, asistentes de WhatsApp, documentos y capacitación con ChatGPT, Claude y Gemini.',
      },
      dev: {
        title: 'IA para tu equipo de desarrollo',
        audience: 'CTOs, líderes técnicos y equipos de producto',
        body: 'Claude Code, Cursor, agentes y revisión de código con IA sin romper producción.',
      },
      cta: 'Ver soluciones',
    },
    business: {
      eyebrow: 'IA para tu negocio',
      title: 'Problemas que resolvemos',
      subtitle: 'Si alguno te suena conocido, hablemos.',
      cards: [
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
          offer: 'Diagnóstico + Implementación',
        },
        {
          problem: 'Los clientes escriben por WhatsApp y nadie responde a tiempo.',
          detail: 'Leads perdidos de noche y los fines de semana.',
          solution: 'Un asistente con IA que responde, califica y pasa el cliente a una persona.',
          offer: 'Implementación',
        },
        {
          problem: 'Contratos y documentos nos toman días.',
          detail: 'Redactar, revisar y perseguir firmas.',
          solution: 'Generación de documentos y firma electrónica, como lo hicimos en 77Rentals.',
          offer: 'Implementación',
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
    },
    dev: {
      eyebrow: 'IA para tu equipo de desarrollo',
      title: 'Tu equipo técnico, más rápido y sin sustos',
      subtitle: 'Llevo tu equipo de "probamos Copilot una vez" a un flujo de trabajo con agentes que entrega.',
      cards: [
        {
          problem: 'No sabemos cómo arrancar con Claude Code o Cursor.',
          detail: 'Licencias compradas, poco uso real.',
          solution: 'Configuración por repositorio: CLAUDE.md y reglas del proyecto, permisos, MCP e integraciones.',
          offer: 'Implementación',
        },
        {
          problem: 'La IA escribe código que rompe producción.',
          detail: '"Vibe coding" sin pruebas ni revisión.',
          solution: 'Flujo plan → pruebas → revisión, con revisión de código asistida por IA en cada pull request.',
          offer: 'Capacitación',
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
    },
    cardLabels: { solution: 'Solución', talk: 'Hablemos de esto' },
    caseStudy: {
      eyebrow: 'Caso real',
      title: 'No lo aprendí en un curso. Lo apliqué en mi propia empresa.',
      subtitle:
        '77Rentals opera alquileres en Cartagena, Santa Marta y Bogotá. Estos son sistemas que construimos con IA y usamos todos los días.',
      items: [
        {
          title: 'Contratos con firma electrónica',
          body: 'Contratos y otrosíes generados automáticamente, enviados por enlace y firmados desde el celular.',
        },
        {
          title: 'Peticiones de copropiedad con coeficientes',
          body: 'Peticiones con múltiples firmantes para asambleas, cálculo de coeficientes y lista pública de transparencia.',
        },
        {
          title: 'Habeas data desde el diseño',
          body: 'Avisos de tratamiento de datos (Ley 1581) integrados en cada formulario de firma.',
        },
        {
          title: 'Cotizaciones y cuentas de cobro',
          body: 'Documentos comerciales que antes tomaban horas, ahora listos en minutos.',
        },
        {
          title: 'Blog con agentes de IA',
          body: 'Contenido bilingüe investigado y redactado con agentes especializados, optimizado para Google.',
        },
      ],
    },
    process: {
      eyebrow: 'Cómo trabajamos',
      title: 'De la idea a la operación, en 4 pasos',
      subtitle: 'Empiezas con poco riesgo y creces según los resultados.',
      steps: [
        {
          title: 'Diagnóstico',
          duration: '1–2 semanas · precio fijo',
          body: 'Entrevistas con tu equipo, mapa de procesos y una hoja de ruta de IA priorizada por retorno.',
        },
        {
          title: 'Implementación',
          duration: '2–6 semanas por proyecto',
          body: 'Construimos las 1 a 3 automatizaciones con mayor impacto y las dejamos funcionando.',
        },
        {
          title: 'Capacitación',
          duration: 'Talleres presenciales o virtuales',
          body: 'Tu equipo aprende a usar la IA en su trabajo diario, con sus propios casos.',
        },
        {
          title: 'Acompañamiento',
          duration: 'Mensual',
          body: 'Un líder de IA fraccional: mejora continua, nuevas automatizaciones y soporte.',
        },
      ],
    },
    tools: {
      eyebrow: 'Herramientas',
      title: 'No vendemos una herramienta. Elegimos la correcta.',
      subtitle: 'Trabajamos con las principales plataformas de IA y escogemos según tu caso, tu presupuesto y tus datos.',
      list: ['Claude', 'Claude Code', 'ChatGPT', 'Gemini', 'Grok (xAI)', 'Cursor', 'Microsoft Copilot', 'n8n', 'Zapier', 'Make'],
      disclaimer: 'Marcas de sus respectivos dueños. No estamos afiliados a ellas.',
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
        {
          q: '¿Necesito saber programar?',
          a: 'No. La ruta de negocio está pensada para dueños y equipos sin conocimientos técnicos. La ruta de desarrollo sí es para equipos que escriben código.',
        },
        {
          q: '¿Trabajas remoto o presencial?',
          a: 'Ambos. Estoy en Bogotá y atiendo empresas en toda Colombia de forma remota; los talleres pueden ser presenciales.',
        },
        {
          q: '¿Cuánto cuesta?',
          a: 'El diagnóstico tiene precio fijo según el tamaño de tu empresa. Tras una primera conversación te envío una propuesta clara, sin sorpresas.',
        },
        {
          q: '¿Cuánto tarda en verse un resultado?',
          a: 'El diagnóstico toma 1 a 2 semanas. Una primera automatización suele quedar funcionando en 2 a 6 semanas.',
        },
        {
          q: '¿Qué pasa con los datos de mi empresa?',
          a: 'Definimos desde el inicio qué información puede usarse con cada herramienta, conforme a la Ley 1581 de 2012.',
        },
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
      trackOptions: ['IA para mi negocio', 'IA para mi equipo de desarrollo', 'Ambas'],
      problem: '¿Cuál es el principal problema que quieres resolver?',
      phone: 'WhatsApp',
      email: 'Correo electrónico',
      consent:
        'Autorizo el tratamiento de mis datos personales para ser contactado sobre este servicio, conforme a la Ley 1581 de 2012.',
      submit: 'Enviar',
      sending: 'Enviando...',
      error: 'Hubo un error. Intenta de nuevo o escríbeme por WhatsApp.',
      successTitle: '¡Gracias! Recibí tu mensaje.',
      successBody: 'Te contactaré en menos de 24 horas hábiles.',
      orWhatsApp: '¿Prefieres WhatsApp?',
    },
    footer: { by: 'Consultoría en IA por', rentals: 'Alquileres 77Rentals' },
  },
  en: {
    meta: {
      title: 'AI Consulting for Companies in Colombia | 77 Rentals',
      description:
        'I help Colombian SMBs move from informal ChatGPT use to AI workflows that save hours: assessments, automation, team training, and developer teams on Claude Code and Cursor.',
    },
    nav: { services: 'Services', howWeWork: 'How we work', contact: 'Contact', switchLang: 'ES' },
    hero: {
      eyebrow: 'Artificial Intelligence Consulting',
      title: 'AI is already in your company. Let’s make it work.',
      subtitle:
        'Your team already uses ChatGPT, each person in their own way. I help turn that informal use into real workflows that save hours, cut errors, and protect your customers’ data.',
      ctaWhatsApp: 'Message me on WhatsApp',
      ctaServices: 'See services',
      location: 'Based in Bogotá, serving all of Colombia · Remote and on-site',
    },
    gap: {
      eyebrow: 'The gap',
      title: 'The problem isn’t access to AI. It’s how it’s used.',
      subtitle: 'Colombian SMBs are adopting AI fast, but very few actually build it into how they operate.',
      stats: [
        { value: '40%', label: 'of Colombian SMBs already use AI' },
        { value: '~10%', label: 'reach an advanced maturity level' },
        { value: '40%', label: 'of micro, small and mid-size firms have no plans to adopt it' },
      ],
      sourcesLabel: 'Sources',
      sources: [
        { title: 'Cintel AI adoption study (Impacto TIC)', url: 'https://impactotic.co/inteligencia-artificial/adopcion-de-ia-en-empresas-colombia-andicom/' },
        { title: 'AWS study cited by MinTIC (El País)', url: 'https://www.elpais.com.co/colombia/cada-5-minutos-una-empresa-colombiana-adopta-ia-asi-lo-revela-el-nuevo-estudio-de-aws-esto-es-lo-que-hay-detras-de-la-cifra-3048.html' },
      ],
    },
    tracks: {
      eyebrow: 'Choose your track',
      title: 'Who is it for?',
      business: {
        title: 'AI for your business',
        audience: 'Owners, managers, operations, sales and admin',
        body: 'Automations, WhatsApp assistants, documents and training on ChatGPT, Claude and Gemini.',
      },
      dev: {
        title: 'AI for your dev team',
        audience: 'CTOs, tech leads and product teams',
        body: 'Claude Code, Cursor, agents and AI code review without breaking production.',
      },
      cta: 'See solutions',
    },
    business: {
      eyebrow: 'AI for your business',
      title: 'Problems we solve',
      subtitle: 'If any of these sound familiar, let’s talk.',
      cards: [
        {
          problem: 'My team uses ChatGPT, but everyone does it differently.',
          detail: 'Informal use, no standards, uneven results.',
          solution: 'Hands-on training, internal playbooks and approved tools for each area.',
          offer: 'Training',
        },
        {
          problem: 'We lose hours on repetitive work.',
          detail: 'Quotes, reports, copy-pasting between Excel, email and the CRM.',
          solution: 'We map your processes and automate the 2 or 3 that eat the most hours.',
          offer: 'Assessment + Build',
        },
        {
          problem: 'Customers message on WhatsApp and nobody answers in time.',
          detail: 'Leads lost at night and on weekends.',
          solution: 'An AI assistant that answers, qualifies and hands the customer to a person.',
          offer: 'Build',
        },
        {
          problem: 'Contracts and documents take us days.',
          detail: 'Drafting, reviewing and chasing signatures.',
          solution: 'Document generation and e-signature, the way we did it at 77Rentals.',
          offer: 'Build',
        },
        {
          problem: 'We’re afraid to put customer data into AI.',
          detail: 'Colombia’s Law 1581 of 2012 and SIC Circular 002 of 2024.',
          solution: 'Safe adoption: which data goes to which tool, consent language and internal policies.',
          offer: 'Assessment',
        },
        {
          problem: 'I don’t know where to start or if it’s worth it.',
          detail: 'Lots of tools, little clarity on return.',
          solution: 'A fixed-price assessment with a roadmap ranked by return.',
          offer: 'Assessment',
        },
      ],
    },
    dev: {
      eyebrow: 'AI for your dev team',
      title: 'A faster engineering team, without the scares',
      subtitle: 'I take your team from “we tried Copilot once” to an agent-driven workflow that ships.',
      cards: [
        {
          problem: 'We don’t know how to get started with Claude Code or Cursor.',
          detail: 'Licenses bought, little real use.',
          solution: 'Per-repo setup: CLAUDE.md and project rules, permissions, MCP and integrations.',
          offer: 'Build',
        },
        {
          problem: 'AI writes code that breaks production.',
          detail: '“Vibe coding” with no tests or review.',
          solution: 'A plan → test → review workflow, with AI-assisted code review on every pull request.',
          offer: 'Training',
        },
        {
          problem: 'Every developer uses AI differently.',
          detail: 'Nothing is shared, nothing is reused.',
          solution: 'Shared agents, subagents and skills in the repo, plus a team playbook.',
          offer: 'Build',
        },
        {
          problem: 'We can’t tell if AI actually saves us time.',
          detail: 'Token and license costs go unmeasured.',
          solution: 'A pilot with one team, delivery metrics and cost control before scaling.',
          offer: 'Assessment',
        },
      ],
    },
    cardLabels: { solution: 'Solution', talk: 'Let’s talk about this' },
    caseStudy: {
      eyebrow: 'Real case',
      title: 'I didn’t learn this in a course. I built it for my own company.',
      subtitle:
        '77Rentals runs rentals in Cartagena, Santa Marta and Bogotá. These are systems we built with AI and use every day.',
      items: [
        { title: 'Contracts with e-signature', body: 'Contracts and amendments generated automatically, sent by link and signed from a phone.' },
        { title: 'HOA petitions with ownership coefficients', body: 'Multi-signer petitions for owners’ assemblies, coefficient math and a public transparency roster.' },
        { title: 'Privacy by design', body: 'Data-protection notices (Law 1581) built into every signing form.' },
        { title: 'Quotes and invoices', body: 'Business documents that used to take hours, now ready in minutes.' },
        { title: 'A blog written with AI agents', body: 'Bilingual content researched and drafted by specialized agents, optimized for Google.' },
      ],
    },
    process: {
      eyebrow: 'How we work',
      title: 'From idea to operations, in 4 steps',
      subtitle: 'Start with low risk and grow based on results.',
      steps: [
        { title: 'Assessment', duration: '1–2 weeks · fixed price', body: 'Team interviews, a process map and an AI roadmap ranked by return.' },
        { title: 'Build', duration: '2–6 weeks per project', body: 'We build the 1 to 3 highest-impact automations and leave them running.' },
        { title: 'Training', duration: 'On-site or virtual workshops', body: 'Your team learns to use AI in their daily work, on their own cases.' },
        { title: 'Ongoing support', duration: 'Monthly', body: 'A fractional AI lead: continuous improvement, new automations and support.' },
      ],
    },
    tools: {
      eyebrow: 'Tools',
      title: 'We don’t sell one tool. We pick the right one.',
      subtitle: 'We work across the major AI platforms and choose based on your case, budget and data.',
      list: ['Claude', 'Claude Code', 'ChatGPT', 'Gemini', 'Grok (xAI)', 'Cursor', 'Microsoft Copilot', 'n8n', 'Zapier', 'Make'],
      disclaimer: 'Trademarks belong to their owners. We are not affiliated with them.',
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
        { q: 'Do I need to know how to code?', a: 'No. The business track is built for owners and non-technical teams. The dev track is for teams that write code.' },
        { q: 'Do you work remotely or on-site?', a: 'Both. I’m based in Bogotá and work with companies across Colombia remotely; workshops can be on-site.' },
        { q: 'How much does it cost?', a: 'The assessment has a fixed price based on company size. After a first conversation I send a clear proposal, no surprises.' },
        { q: 'How soon will we see results?', a: 'The assessment takes 1 to 2 weeks. A first automation is usually running within 2 to 6 weeks.' },
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
      trackOptions: ['AI for my business', 'AI for my dev team', 'Both'],
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
    footer: { by: 'AI consulting by', rentals: '77Rentals stays' },
  },
};
