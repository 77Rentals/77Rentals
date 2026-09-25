# Blog topic backlog

Queue for the scheduled blog agent (a cloud routine that publishes one post every
3 days, alternating travel and AI). Take the **first topic whose status is `todo`**
for the blog you are writing for, write that post, then set its status to
`published YYYY-MM-DD` in the same commit.

Timing matters: the Colombian Caribbean high season runs mid-December to April and
most of the research and booking happens October–November, so the seasonal Cartagena
topics are first. A new page usually takes 4–10 weeks to settle in Google.

Every post: verify facts against official sources (colombia.travel, Parques
Nacionales, IDEAM, MinCIT, Migración Colombia, Cancillería, Banco de la República,
city tourism offices, operator sites for fares). Drop or hedge anything you cannot
confirm. Never invent prices, dates or rules.

## Travel blog (`src/data/blog.ts`, /blog and /en/blog)

| # | Topic | Primary search phrase (EN / ES) | Status |
|---|-------|-------------------------------|--------|
| 1 | Best time to visit Cartagena: month by month (weather, seasons, prices) | best time to visit Cartagena / mejor época para viajar a Cartagena | todo |
| 2 | Where to stay in Cartagena: neighbourhood guide (Centro, Getsemaní, Bocagrande, El Laguito, Castillogrande, Manga) | where to stay in Cartagena / dónde alojarse en Cartagena | todo |
| 3 | Christmas and New Year in Cartagena (novenas, alumbrados, NYE, minimum stays) | Cartagena at Christmas / Navidad en Cartagena | todo |
| 4 | Barranquilla Carnival 2027, based in Cartagena or Santa Marta (confirm 2027 dates with carnavaldebarranquilla.org) | Barranquilla Carnival 2027 / Carnaval de Barranquilla 2027 | todo |
| 5 | Semana Santa 2027 in Colombia, 21–28 March: what's open, what's booked | Semana Santa 2027 Colombia | todo |
| 6 | Bocagrande vs El Laguito: which end of the beach suits you | Bocagrande vs El Laguito | todo |
| 7 | Minca: the two-day escape above Santa Marta | Minca Colombia / qué hacer en Minca | todo |
| 8 | Tayrona National Park: honest day-trip guide (fees, mandatory insurance, annual closures — verify yearly at Parques Nacionales) | Tayrona National Park guide / Parque Tayrona cómo visitar | todo |
| 9 | Bogotá neighbourhoods: La Candelaria, Chapinero, Usaquén | where to stay in Bogotá / dónde alojarse en Bogotá | todo |
| 10 | Rosario Islands and Playa Blanca: how not to get scammed (port tax, park fees, licensed boats) | Rosario Islands day trip / Islas del Rosario desde Cartagena | todo |
| 11 | How much a week in Colombia costs (re-price every 6 months or drop it) | Colombia trip cost / cuánto cuesta viajar a Colombia | todo |
| 12 | Staying a month: Colombia for remote workers (visa facts only from cancilleria.gov.co / migracioncolombia.gov.co) | Colombia digital nomad / nómada digital Colombia | todo |

### Not to be written as standalone travel posts
- **"Is Colombia safe?"** — saturated and sensitive; deepen the safety section of the
  existing `colombia-travel-tips` post instead, with city-specific detail and an FAQ.
- **Check-MIG / entry requirements** — already covered in `colombia-travel-tips`;
  keep that section current (re-verify every 6 months) rather than adding a page.
- **Bogotá altitude** and **Ciudad Perdida** — already in
  `surprising-facts-about-colombia`; link to it instead of repeating.

## AI consulting blog (`src/data/aiBlog.ts`, /ai/blog and /en/ai/blog)

Audience: Colombian SMB owners (pymes) and small dev teams. Practical, no hype, with
a concrete example or workflow in each. Written by the `ai-consulting-writer` agent.

| # | Topic | Status |
|---|-------|--------|
| 1 | Atención al cliente por WhatsApp con IA: qué se puede automatizar y qué no | todo |
| 2 | Facturas, remisiones y PDFs: automatizar la entrada de datos en una pyme | todo |
| 3 | Habeas data y Ley 1581: qué revisar antes de meter datos de clientes en una IA | todo |
| 4 | Cómo escribir un buen prompt de trabajo (plantillas para ventas, soporte y operaciones) | todo |
| 5 | Claude Code / Cursor para un equipo pequeño de desarrollo: cómo empezar sin romper nada | todo |
| 6 | Qué cuesta realmente automatizar un proceso con IA en Colombia (y cómo calcular el retorno) | todo |

## Rules for updates vs new posts
- Facts that go stale fast (Tayrona fees, trip costs, visa income thresholds,
  exchange rates) carry a "last verified" date and get reviewed on the schedule noted
  in the topic row.
- If a topic turns out to be better as an update to an existing post, make the update
  instead and record that in this file rather than publishing a thin new page.
