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
| 4 | Barranquilla Carnival 2027 (**6-9 February 2027** - Easter 2027 is 28 March, so Ash Wednesday is 10 Feb; re-confirm at carnavaldebarranquilla.org), based in Cartagena or Santa Marta | Barranquilla Carnival 2027 / Carnaval de Barranquilla 2027 | todo |
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

## Verified dates and figures (reuse these; do not re-derive)

- **Carnaval de Barranquilla 2027: 6-9 February 2027.** Several sites still say mid-February; they are wrong.
- **Semana Santa 2027: 21-28 March 2027.** Easter Sunday 28 March.
- **Hay Festival Cartagena 2027: 28-31 January 2027** (hayfestival.com/cartagena), tickets from November 2026.
- **FICCI 66 (Cartagena film festival): 6-11 April 2027** - not its historic March slot.
- **Fiestas de Independencia de Cartagena: around 8-15 November**, 11 November is the independence date.
- **TransCaribe fare: COP $3,900** since 23 January 2026 (Decreto 017 of 2026).
- **Cartagena taxis have no meters** - zonal fares agreed before boarding; a 2026 decree set a minimum around COP $12,250. The "COP 7,000-10,000 to the centre" figure copied across the web is stale.
- **Corales del Rosario park: mandatory accident insurance COP $8,800 per visitor** (Resolución 273 de 2024). Do not conflate it with entry fees.
- **Cartagena climate**: highs 31-32C and lows 24-26C year-round, humidity 78-83%; driest January-March, wettest October (publish a 230-270 mm range, sources differ). Attribute to Climates to Travel by name - IDEAM's normals sit behind the DHIME portal and were not reachable.
- **Hurricanes**: Cartagena is at ~10N on the southern rim of the Caribbean, far from the main track, with no modern mainland landfall. Colombia's exposed territory is San Andrés and Providencia. Never write "outside the hurricane belt" or imply zero risk.
- **Bocagrande and El Laguito beaches are grey-brown sand with murky water.** The white sand is at Playa Blanca and the Rosario Islands. Never describe the city beaches as white-sand Caribbean.

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
