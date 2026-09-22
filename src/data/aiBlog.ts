// Posts for the AI consulting blog (/ai/blog/). Written by the
// ai-consulting-writer agent (.claude/agents/ai-consulting-writer.md) around
// real problems Colombian SMBs have with AI. Same block model as the travel
// blog; the `cta` block renders the consulting WhatsApp box instead.
// Newest post first.
import type { BlogPost } from './blog';

export const aiBlogPosts: BlogPost[] = [
  {
    slug: 'ia-para-pymes-colombia-por-donde-empezar',
    date: '2026-09-22',
    readingMinutes: 6,
    cover: '/images/bogota.jpg',
    es: {
      title: 'IA para pymes en Colombia: por dónde empezar',
      metaDescription:
        'IA para pymes en Colombia sin perder plata: cómo escoger el primer proceso, medir el ahorro y cuidar los datos de tus clientes bajo la Ley 1581.',
      excerpt:
        'Tu equipo ya usa ChatGPT, cada quien a su manera. Así pasas de ese uso suelto a un primer flujo con IA que ahorra horas y que puedes medir.',
      tags: ['IA para pymes', 'Guía práctica'],
      body: [
        { type: 'h2', text: '¿Cuántas empresas en Colombia ya usan IA?' },
        { type: 'p', text: 'Según Cintel, cerca del 40 % de las empresas colombianas ya usa alguna herramienta de IA. Pero usar no es lo mismo que aprovechar: solo alrededor de una de cada diez la tiene metida en procesos del negocio, y otro 40 % dice que no tiene planes de adoptarla.' },
        { type: 'p', text: 'En la práctica, eso se ve así: el gerente usa ChatGPT para redactar correos, alguien en ventas lo usa para cotizaciones y nadie sabe qué datos de clientes se están pegando ahí. Hay uso, pero no hay método.' },

        { type: 'h2', text: '¿Qué proceso conviene automatizar primero?' },
        { type: 'p', text: 'El primer proyecto no debería ser el más ambicioso, sino el más aburrido. Busca una tarea que cumpla tres condiciones:' },
        { type: 'ul', items: [
          '**Se repite todas las semanas**, idealmente todos los días.',
          '**Sigue reglas claras** que alguien podría escribir en una hoja.',
          '**Se puede medir**: horas invertidas, errores, tiempo de respuesta.',
        ] },
        { type: 'p', text: 'Ejemplos típicos en una pyme: responder las mismas preguntas por WhatsApp, pasar datos de facturas o PDFs a una hoja de cálculo, redactar contratos a partir de una plantilla o resumir reuniones y dejar las tareas asignadas.' },
        { type: 'tip', title: 'La prueba de la hoja de papel', text: 'Si no puedes explicar el proceso en una hoja, la IA tampoco lo va a entender. Primero escribe los pasos; después decides qué parte se automatiza.' },

        { type: 'h2', text: '¿Cómo saber si la IA sí está ahorrando tiempo?' },
        { type: 'p', text: 'Mide antes de empezar. Durante una semana, anota cuánto tarda la tarea y cuántos errores o reprocesos genera. Con ese número de base, cualquier mejora se puede comprobar en vez de suponerla.' },
        { type: 'p', text: 'En 77Rentals lo hicimos así con los contratos de arrendamiento: medimos cuánto tomaba armar cada uno a mano y lo comparamos con el flujo nuevo, que genera el documento y lo envía a firma electrónica. La diferencia se ve en la agenda, no en una presentación.' },

        { type: 'h2', text: '¿Qué dice la ley sobre usar IA con datos de clientes?' },
        { type: 'p', text: 'En Colombia, los datos personales se rigen por la Ley 1581 de 2012. Además, la Superintendencia de Industria y Comercio publicó la Circular Externa 002 de 2024 con lineamientos para tratar datos personales en sistemas de inteligencia artificial.' },
        { type: 'p', text: 'Traducido a la operación: define qué información puede entrar a una herramienta de IA y cuál no, usa cuentas empresariales en vez de cuentas personales y deja por escrito para qué usas los datos. No es burocracia; es lo que te protege si un cliente pregunta.' },
        { type: 'tip', title: 'Una regla simple para el equipo', text: 'Nada con cédula, número de cuenta o datos de salud va a un chat de IA gratuito. Si el proceso lo necesita, se hace con una herramienta configurada para eso.' },

        { type: 'h2', text: '¿Hay que contratar un desarrollador?' },
        { type: 'p', text: 'No siempre. Muchos flujos se arman con las herramientas que ya pagas, como Google Workspace o Microsoft 365, más un asistente de IA bien configurado. Cuando sí hace falta código, herramientas como Claude Code o Cursor permiten que un equipo pequeño construya en semanas lo que antes tomaba meses.' },
        { type: 'p', text: 'Lo que sí necesitas es a alguien que entienda el proceso y la tecnología al mismo tiempo. Esa es la parte que suele faltar.' },

        { type: 'h2', text: 'Un plan de 30 días para empezar' },
        { type: 'ul', items: [
          '**Semana 1:** lista las tareas repetitivas y mide las tres que más tiempo consumen.',
          '**Semana 2:** escoge una, escribe el proceso y define qué datos puede tocar la IA.',
          '**Semana 3:** arma un piloto con dos o tres personas del equipo.',
          '**Semana 4:** compara contra la medición inicial y decide si se escala o se ajusta.',
        ] },
        { type: 'cta' },
      ],
    },
    en: {
      title: 'AI for small businesses in Colombia: where to start',
      metaDescription:
        'AI for Colombian small businesses without wasting money: pick the first process, measure the savings and protect customer data under Law 1581.',
      excerpt:
        'Your team already uses ChatGPT, each person in their own way. Here is how to go from scattered use to a first AI workflow that saves hours you can measure.',
      tags: ['AI for SMBs', 'Practical guide'],
      body: [
        { type: 'h2', text: 'How many Colombian companies already use AI?' },
        { type: 'p', text: 'According to Cintel, about 40% of Colombian companies already use some AI tool. Using it is not the same as getting value from it: only around one in ten has AI built into business processes, and another 40% say they have no plans to adopt it.' },
        { type: 'p', text: 'In practice it looks like this: the manager uses ChatGPT for emails, someone in sales uses it for quotes, and nobody knows which customer data is being pasted in. There is usage, but no method.' },

        { type: 'h2', text: 'Which process should you automate first?' },
        { type: 'p', text: 'Your first project should not be the most ambitious one. It should be the most boring. Look for a task that meets three conditions:' },
        { type: 'ul', items: [
          '**It repeats every week**, ideally every day.',
          '**It follows clear rules** someone could write on one page.',
          '**It can be measured**: hours spent, errors, response time.',
        ] },
        { type: 'p', text: 'Typical examples in a small business: answering the same WhatsApp questions, moving data from invoices or PDFs into a spreadsheet, drafting contracts from a template, or summarizing meetings and assigning the follow-ups.' },
        { type: 'tip', title: 'The one-page test', text: 'If you cannot explain the process on one page, AI will not understand it either. Write the steps first, then decide which part to automate.' },

        { type: 'h2', text: 'How do you know AI is actually saving time?' },
        { type: 'p', text: 'Measure before you start. For one week, log how long the task takes and how many errors or redos it causes. With that baseline, any improvement can be checked instead of assumed.' },
        { type: 'p', text: 'At 77Rentals we did exactly this with lease contracts: we timed how long each one took by hand and compared it with the new flow, which generates the document and sends it for e-signature. The difference shows up in the calendar, not in a slide deck.' },

        { type: 'h2', text: 'What does Colombian law say about AI and customer data?' },
        { type: 'p', text: 'In Colombia, personal data is governed by Law 1581 of 2012. On top of that, the Superintendence of Industry and Commerce (SIC) issued External Circular 002 of 2024 with guidelines for handling personal data in AI systems.' },
        { type: 'p', text: 'In day-to-day terms: decide which information may go into an AI tool and which may not, use business accounts instead of personal ones, and write down what you use the data for. That is not red tape; it is what protects you when a customer asks.' },
        { type: 'tip', title: 'One simple rule for the team', text: 'Nothing with ID numbers, bank accounts or health data goes into a free AI chat. If the process needs it, it runs on a tool configured for that.' },

        { type: 'h2', text: 'Do you need to hire a developer?' },
        { type: 'p', text: 'Not always. Many workflows can be built with tools you already pay for, like Google Workspace or Microsoft 365, plus a well-configured AI assistant. When code is needed, tools like Claude Code or Cursor let a small team build in weeks what used to take months.' },
        { type: 'p', text: 'What you do need is someone who understands both the process and the technology. That is usually the missing piece.' },

        { type: 'h2', text: 'A 30-day plan to get started' },
        { type: 'ul', items: [
          '**Week 1:** list the repetitive tasks and measure the three that take the most time.',
          '**Week 2:** pick one, write down the process and define which data AI may touch.',
          '**Week 3:** run a pilot with two or three people on the team.',
          '**Week 4:** compare against the baseline and decide whether to scale or adjust.',
        ] },
        { type: 'cta' },
      ],
    },
    sources: [
      { title: 'Cintel vía Impacto TIC: adopción de IA en empresas de Colombia', url: 'https://impactotic.co/inteligencia-artificial/adopcion-de-ia-en-empresas-colombia-andicom/' },
      { title: 'El País: estudio de AWS sobre adopción de IA en empresas colombianas', url: 'https://www.elpais.com.co/colombia/cada-5-minutos-una-empresa-colombiana-adopta-ia-asi-lo-revela-el-nuevo-estudio-de-aws-esto-es-lo-que-hay-detras-de-la-cifra-3048.html' },
      { title: 'Función Pública: Ley 1581 de 2012', url: 'https://www.funcionpublica.gov.co/eva/gestornormativo/norma.php?i=49981' },
      { title: 'SIC: Circular Externa 002 de 2024 (datos personales e IA)', url: 'https://sedeelectronica.sic.gov.co/transparencia/normativa/circular-externa-2-de-2024-de-la-superintendencia-de-industria-y-comercio-lineamientos-sobre-el-tratamiento-de-datos' },
    ],
  },
];

// Spanish at /ai/blog/, English at /en/ai/blog/ (trailing slash matches the
// prerendered directory layout).
export const aiBlogPath = (lang: 'es' | 'en', slug?: string) =>
  `${lang === 'en' ? '/en' : ''}/ai/blog/${slug ? `${slug}/` : ''}`;

export const getAiPostBySlug = (slug: string | undefined) =>
  aiBlogPosts.find((p) => p.slug === slug);

export const aiBlogCopy = {
  es: {
    eyebrow: 'Blog · IA para empresas',
    title: 'Problemas reales, soluciones con IA',
    subtitle: 'Guías prácticas para pymes colombianas que quieren usar IA con método, sin humo.',
    minRead: 'min de lectura',
    readMore: 'Leer',
    back: 'Volver al blog',
    backToAi: 'Consultoría IA',
    sources: 'Fuentes',
    more: 'Más artículos',
    notFound: 'No encontramos este artículo.',
    ctaTitle: '¿Quieres aplicarlo en tu empresa?',
    ctaText: 'Cuéntame qué proceso te quita más tiempo y te digo por dónde empezaría.',
    ctaButton: 'Escríbeme por WhatsApp',
    ctaSecondary: 'Ver servicios',
  },
  en: {
    eyebrow: 'Blog · AI for business',
    title: 'Real problems, AI solutions',
    subtitle: 'Practical guides for Colombian companies that want to use AI with a method, not hype.',
    minRead: 'min read',
    readMore: 'Read',
    back: 'Back to blog',
    backToAi: 'AI consulting',
    sources: 'Sources',
    more: 'More articles',
    notFound: 'We could not find this article.',
    ctaTitle: 'Want to apply this in your company?',
    ctaText: 'Tell me which process eats the most time and I will tell you where I would start.',
    ctaButton: 'Message me on WhatsApp',
    ctaSecondary: 'See services',
  },
} as const;
