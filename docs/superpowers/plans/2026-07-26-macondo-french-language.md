# Macondo French Language Support Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add French as a third toggleable language (ES/EN/FR) across the Macondo welcome guide and the guest experiences board, including on the gate/passcode screen which currently has no visible toggle at all.

**Architecture:** Extend the existing `data-es`/`data-en` content-toggle pattern with a `data-fr` attribute on every translatable element, refactor `setLang()` to support an arbitrary number of synced toggle-button instances (via `data-lang` attributes instead of hard-coded IDs), and add a matching toggle + French content to the new `experiencias.html` board (which has no i18n infrastructure yet).

**Tech Stack:** Static HTML/vanilla JS (no build step, no framework) for `public/macondo/index.html` and `public/macondo/experiencias.html`; shared logic in `public/shared/guest-experiences.js`.

**Translation register (frozen for all tasks):** `vous`, never `tu`. Glossary: `Wi-Fi` (not `wifi`), `arrivée`/`départ` (not "check-in"/"check-out" — except where "Check-in"/"Check-out" appear as literal brand-style headings today with no `data-es`, see Task 3), `séjour`, `appartement`, `climatisation`. Typography: narrow space before `! ? : ;`, `« guillemets »`, sentence case in headings, accented capitals (`À`), no serial comma before `et`/`ou`. European French vocabulary (not Québécois). Full rationale already captured in `docs/superpowers/specs/2026-07-26-macondo-french-language-design.md`.

---

### Task 1: Refactor the language-toggle mechanism

**Files:**
- Modify: `public/macondo/index.html:494-497` (topbar toggle)
- Modify: `public/macondo/index.html:897-903` (`setLang()`)

The current toggle is hard-coded to a single button pair by ID, which breaks once a second toggle instance (on the gate screen, added in Task 2) exists on the same page:

```js
document.getElementById('btn-es').classList.toggle('active',l==='es');
document.getElementById('btn-en').classList.toggle('active',l==='en');
```

- [ ] **Step 1: Replace the topbar toggle markup with `data-lang` buttons**

Replace:
```html
  <div class="lang-toggle">
    <button id="btn-es" class="active" onclick="setLang('es')">ES</button>
    <button id="btn-en" onclick="setLang('en')">EN</button>
  </div>
```
With:
```html
  <div class="lang-toggle">
    <button data-lang="es" class="active" onclick="setLang('es')">ES</button>
    <button data-lang="en" onclick="setLang('en')">EN</button>
    <button data-lang="fr" onclick="setLang('fr')">FR</button>
  </div>
```

- [ ] **Step 2: Update `setLang()` to loop over every toggle instance on the page**

Find (inside `function setLang(l){...}`):
```js
  document.getElementById('btn-es').classList.toggle('active',l==='es');
  document.getElementById('btn-en').classList.toggle('active',l==='en');
```
Replace with:
```js
  document.querySelectorAll('.lang-toggle button').forEach(btn=>{
    btn.classList.toggle('active', btn.dataset.lang===l);
  });
```

- [ ] **Step 3: Verify manually**

Load `public/macondo/index.html` in a browser (or `npm run dev` and navigate to `/macondo/index.html`), unlock the gate, click FR in the topbar. Expect: the FR button highlights gold, ES/EN de-highlight, no console errors (French content itself doesn't exist yet — that's fine, `dataset.fr` will just be `undefined` until later tasks, so text will go blank for untranslated elements; that's expected at this checkpoint).

- [ ] **Step 4: Commit**

```bash
git add public/macondo/index.html
git commit -m "Refactor language toggle to support multiple synced instances"
```

---

### Task 2: Add the toggle to the gate screen + translate gate content

**Files:**
- Modify: `public/macondo/index.html:472-485`

The gate screen (shown before the passcode is entered) already has `data-es`/`data-en` on its text, but no toggle buttons exist there today — they only live in the topbar, which is hidden (`.site{display:none}`) until after unlock. Add a toggle to `.gate-card` and the French translations for all 5 gate strings + 1 placeholder.

- [ ] **Step 1: Replace the gate card markup**

Replace:
```html
  <div class="gate-card">
    <div class="gate-eyebrow" data-es="Bienvenido a" data-en="Welcome to">Bienvenido a</div>
    <h1 class="gate-title">Macondo <em>717</em></h1>
    <p class="gate-sub" data-es="Ingresa el código que te enviamos para ver tu guía de bienvenida." data-en="Enter the code we sent you to view your welcome guide.">Ingresa el código que te enviamos para ver tu guía de bienvenida.</p>
    <input type="text" id="gate-name" class="gate-input" autocomplete="off" spellcheck="false" data-es-placeholder="Tu nombre" data-en-placeholder="Your name" placeholder="Tu nombre">
    <input type="text" id="gate-input" class="gate-input" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="••••••">
    <button class="gate-btn" onclick="checkGate()" data-es="Ingresar" data-en="Enter">Ingresar</button>
    <p class="gate-error" id="gate-error" data-es="Código incorrecto, intenta de nuevo." data-en="Incorrect code, please try again.">Código incorrecto, intenta de nuevo.</p>
  </div>
```
With:
```html
  <div class="gate-card">
    <div class="lang-toggle" style="justify-content:center;margin-bottom:18px;">
      <button data-lang="es" class="active" onclick="setLang('es')">ES</button>
      <button data-lang="en" onclick="setLang('en')">EN</button>
      <button data-lang="fr" onclick="setLang('fr')">FR</button>
    </div>
    <div class="gate-eyebrow" data-es="Bienvenido a" data-en="Welcome to" data-fr="Bienvenue à">Bienvenido a</div>
    <h1 class="gate-title">Macondo <em>717</em></h1>
    <p class="gate-sub" data-es="Ingresa el código que te enviamos para ver tu guía de bienvenida." data-en="Enter the code we sent you to view your welcome guide." data-fr="Entrez le code que nous vous avons envoyé pour consulter votre guide de bienvenue.">Ingresa el código que te enviamos para ver tu guía de bienvenida.</p>
    <input type="text" id="gate-name" class="gate-input" autocomplete="off" spellcheck="false" data-es-placeholder="Tu nombre" data-en-placeholder="Your name" data-fr-placeholder="Votre nom" placeholder="Tu nombre">
    <input type="text" id="gate-input" class="gate-input" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="••••••">
    <button class="gate-btn" onclick="checkGate()" data-es="Ingresar" data-en="Enter" data-fr="Entrer">Ingresar</button>
    <p class="gate-error" id="gate-error" data-es="Código incorrecto, intenta de nuevo." data-en="Incorrect code, please try again." data-fr="Code incorrect, veuillez réessayer.">Código incorrecto, intenta de nuevo.</p>
  </div>
```

- [ ] **Step 2: Handle the `data-XX-placeholder` loop for `fr`**

`setLang()` already generically loops `[data-es-placeholder]` elements and reads `el.dataset[l+'Placeholder']` — since `l` will be `'fr'` and the attribute is `data-fr-placeholder` (camelCased by the browser to `frPlaceholder`), no code change is needed here beyond the markup in Step 1. Confirm this by reading `public/macondo/index.html:904-906` and checking the loop body matches:
```js
  document.querySelectorAll('[data-es-placeholder]').forEach(el=>{
    el.placeholder=el.dataset[l+'Placeholder'];
  });
```

- [ ] **Step 3: Verify manually**

Reload the guide with a fresh session (clear `sessionStorage` or use a private window) so the gate screen shows. Click FR on the gate toggle. Expect: eyebrow, subtitle, name placeholder, button, and (after typing a wrong code) the error message all switch to French. Click ES/EN and confirm they still work too.

- [ ] **Step 4: Commit**

```bash
git add public/macondo/index.html
git commit -m "Add language toggle and French translations to the gate screen"
```

---

### Task 3: Translate hero + description sections

**Files:**
- Modify: `public/macondo/index.html:509-531`

- [ ] **Step 1: Add `data-fr` to the hero section**

At line 512, add `data-fr="Pozos Colorados · Santa Marta · Colombia"` (proper nouns, unchanged).
At line 513, add `data-fr="Bienvenue à"` to the `<span>`.
At line 514, add `data-fr="Un refuge de réalisme magique face à la mer des Caraïbes, où chaque coucher de soleil écrit une nouvelle page de votre histoire."`.
At line 516, add `data-fr="Suite avec vue sur la mer"`.
At line 518, add `data-fr="Immeuble Delventto · Appt 717"`.
At line 520, add `data-fr="Faites défiler pour explorer"`.

(Line 517's `<span class="badge">Superhost · 500+ ⭐</span>` has no `data-es` today — it's identical across all languages by design. Leave it untouched.)

- [ ] **Step 2: Add `data-fr` to the description section**

Line 525: `data-fr="Bienvenue"`.
Line 526: `data-fr="Votre refuge à"`.
Line 527: `data-fr="Bienvenue à Macondo, un refuge conçu pour ceux qui cherchent à se déconnecter du monde et à s'immerger dans la mystique et l'exubérance de notre terre. Inspiré du réalisme magique, cet espace allie le confort moderne à des détails qui célèbrent l'esprit des Caraïbes, créant le cadre parfait pour que vous écriviez votre propre histoire face à la mer."`.
Line 528: `data-fr="Un coin de réalisme magique"`.
Line 529: `data-fr="Situé dans l'exclusif immeuble Delventto, Macondo n'est pas seulement un endroit où dormir ; c'est une expérience pour les sens. De la douceur de la brise à la chaleur de sa décoration, chaque détail a été pensé pour vous offrir un repos profond et réparateur. Admirez le coucher de soleil sur l'horizon de Santa Marta."`.
Line 530: `data-fr="Nous espérons que votre séjour sera aussi inoubliable que les levers de soleil que nous sommes sur le point de vous offrir. Installez-vous confortablement et laissez la magie commencer."`.

- [ ] **Step 3: Verify and commit**

Reload, switch to FR, confirm hero and description text render in French with no leftover Spanish/English and no `undefined` text.

```bash
git add public/macondo/index.html
git commit -m "Add French translations for hero and description sections"
```

---

### Task 4: Translate check-in section (including the "Arrivée/Départ" retrofit)

**Files:**
- Modify: `public/macondo/index.html:534-566`

This section has two elements that show literal "Check-in"/"Check-out" text **without** a `data-es` attribute (lines 541, 546) — meaning they're identical across all languages today. Per the glossary decision, French uses "Arrivée"/"Départ" instead of the English loanword, so these two need `data-es`/`data-en` retrofitted (mirroring their current text) *and* a `data-fr`, so they participate in the `[data-es]` toggle loop at all — an element with only `data-fr` and no `data-es` is invisible to `setLang()`.

- [ ] **Step 1: Add `data-fr` to already-tagged elements**

Line 535: `data-fr="Votre arrivée"`.
Line 536: on the `<span>`, `data-fr="Arrivée et"`; on the trailing `<em>check-out</em>`, add `data-es="check-out" data-en="check-out" data-fr="départ"` (retrofit — it currently has no data attributes at all).
Line 537: `data-fr="L'aéroport est à seulement 10-12 minutes en voiture. Un taxi vous coûtera entre 20 000 et 25 000 COP jusqu'à Delventto."`.

- [ ] **Step 2: Retrofit the two bare "Check-in"/"Check-out" headings**

Replace line 541:
```html
      <h3>Check-in</h3>
```
With:
```html
      <h3 data-es="Check-in" data-en="Check-in" data-fr="Arrivée">Check-in</h3>
```
Replace line 546:
```html
      <h3>Check-out</h3>
```
With:
```html
      <h3 data-es="Check-out" data-en="Check-out" data-fr="Départ">Check-out</h3>
```

- [ ] **Step 3: Continue with the rest of the section**

Line 543: `data-fr="Disponible à partir de 15 h"`.
Line 548: `data-fr="Passez votre paume sur le clavier numérique pour verrouiller la porte et prévenez la réception."`.
Line 551: `data-fr="Heure locale"`.
Line 558 (Registro): `data-fr="Inscription"` on the `<strong>`; `data-fr="À votre arrivée à l'immeuble Delventto, dirigez-vous vers la réception."` on the `<p>`.
Line 559 (Identificación): `data-fr="Pièce d'identité"` on the `<strong>`; `data-fr="Présentez une pièce d'identité pour tous les invités ainsi que votre confirmation de réservation pour l'Appt 1-717."` on the `<p>`.
Line 560 (Acceso): `data-fr="Accès"` on the `<strong>`; `data-fr="Nous vous enverrons le code numérique de la serrure par WhatsApp. Il vous suffit de le saisir pour entrer dans votre refuge à Macondo."` on the `<p>`.
Line 561 (WiFi): `data-fr="Wi-Fi"` on the `<strong>`; `data-fr="Connectez-vous en scannant le code QR ou en saisissant le réseau et le mot de passe manuellement."` on the first `<p>`; `data-fr="Réseau Wi-Fi"` on the first `<small>`; `data-fr="Mot de passe"` on the second `<small>`.
Line 564: `data-fr="Chargement de la météo de Santa Marta..."`.

- [ ] **Step 4: Verify and commit**

Reload, switch to FR, confirm the check-in section (including the two retrofitted headings) shows "Arrivée"/"Départ" and no English leaks through.

```bash
git add public/macondo/index.html
git commit -m "Add French translations for check-in section, retrofit Check-in/Check-out headings"
```

---

### Task 5: Translate tour, 3D suite, gallery sections (+ photo label arrays)

**Files:**
- Modify: `public/macondo/index.html:569-611`
- Modify: `public/macondo/index.html:934-955` (`propPhotos`/`amenPhotos` arrays)

- [ ] **Step 1: Tour section (lines 570-576)**

Line 570: `data-fr="Visite vidéo"`.
Line 571: `data-fr="Visitez"` on the span (keeps `<em>Macondo</em>` unchanged).
Line 572: `data-fr="Une visite réelle de votre suite : la cuisine complète, l'espace de travail, le lit près de la fenêtre et le balcon avec vue sur la Sierra."`.
Line 576: `data-fr="Placez macondo-tour.mp4 dans le même dossier que ce fichier."`.

- [ ] **Step 2: 3D suite section (lines 583-594)**

Line 583: `data-fr="Explorez avant votre arrivée"`.
Line 584: `data-fr="Votre suite en"` (keeps `<em>3D</em>`).
Line 585: `data-fr="Basé sur l'espace réel : cuisine complète avec lave-vaisselle, bureau de travail, lit près de la fenêtre, fauteuil bleu sarcelle et balcon avec table pour deux face à la Sierra."`.
Line 588: `data-fr="Glissez pour faire pivoter · Pincez ou utilisez la molette pour zoomer"`.
Line 591: `data-fr="Lit queen et salle de bain"`.
Line 592: `data-fr="Canapé et fauteuil bleu sarcelle"`.
Line 593: `data-fr="Cuisine, bureau, TV"`.
Line 594: `data-fr="Balcon avec vue"`.

- [ ] **Step 3: Gallery section (lines 600-606)**

Line 600: `data-fr="Galerie"`.
Line 601: on the span `data-fr="Images de votre"`; on the `<em>` `data-fr="séjour"`.
Line 606: `data-fr="Cliquez pour voir toutes les photos"`.

- [ ] **Step 4: `propPhotos` / `amenPhotos` arrays**

Read `public/macondo/index.html:934-955`. Add an `fr` field to each object, e.g.:
```js
const propPhotos=[
  {src:'img_details_sm.jpg',   es:'Detalles Macondo',      en:'Macondo Details',        fr:'Détails Macondo'},
  {src:'img_kitchen_sm.jpg',   es:'Cocina',                en:'Kitchen',                fr:'Cuisine'},
  {src:'img_bedroom_sm.jpg',   es:'Habitación principal',  en:'Main Bedroom',           fr:'Chambre principale'},
  {src:'img_bathroom_sm.jpg',  es:'Baño',                  en:'Bathroom',               fr:'Salle de bain'},
  {src:'img_balcony_sm.jpg',   es:'Balcón',                en:'Balcony',                fr:'Balcon'},
  {src:'img_living_sm.jpg',    es:'Sala',                  en:'Living Room',            fr:'Salon'},
  {src:'img_balcony2_sm.jpg',  es:'Desayuno en el balcón', en:'Breakfast on the balcony',fr:'Petit-déjeuner sur le balcon'},
];
const amenPhotos=[
  {src:'amen_lobby.jpg',   es:'Recepción',         en:'Lobby & Reception', fr:'Réception'},
  {src:'amen_gym.jpg',     es:'Gimnasio',          en:'Gym',                fr:'Salle de sport'},
  {src:'amen_pool.jpg',    es:'Piscina',           en:'Pool',               fr:'Piscine'},
  {src:'amen_dining.jpg',  es:'Zona social',       en:'Social Area',        fr:'Espace commun'},
  {src:'amen_terrace.jpg', es:'Terraza',           en:'Rooftop Terrace',    fr:'Terrasse'},
  {src:'amen_pool2.jpg',   es:'Piscina infinita',  en:'Infinity Pool',      fr:'Piscine à débordement'},
  {src:'amen_pool3.jpg',   es:'Piscina y vista',   en:'Pool & Views',       fr:'Piscine et vue'},
  {src:'amen_terrace2.jpg',es:'Zona BBQ',          en:'BBQ Area',           fr:'Espace barbecue'},
  {src:'amen_pool4.jpg',   es:'',                  en:'',                   fr:''},
  {src:'amen_pool5.jpg',   es:'',                  en:'',                   fr:''},
  {src:'amen_pool6.jpg',   es:'',                  en:'',                   fr:''},
  {src:'amen_pool7.jpg',   es:'',                  en:'',                   fr:''},
];
```

- [ ] **Step 5: Confirm `renderGal()` reads the new field generically**

Read `public/macondo/index.html:980` onward and confirm it accesses `photo[lang]` (or equivalent) rather than hard-coding `.es`/`.en` — if it hard-codes, generalize it to use the active language variable already in scope. No other change should be needed since `renderGal()` is already called from inside `setLang()`.

- [ ] **Step 6: Verify and commit**

Reload, switch to FR, confirm tour/3D/gallery section text and photo captions (hover/lightbox labels) show French.

```bash
git add public/macondo/index.html
git commit -m "Add French translations for tour, 3D suite, and gallery sections"
```

---

### Task 6: Translate amenities (building), map sections (+ POI popup object)

**Files:**
- Modify: `public/macondo/index.html:612-656`
- Modify: `public/macondo/index.html:1020-1029` (`pois` object)

- [ ] **Step 1: Amenities (building) section (lines 613-639)**

Line 613: `data-fr="Équipements"`.
Line 614: on span `data-fr="Équipements de"`; on em `data-fr="l'immeuble"`.
Amenity chips (line 616-625): `Gimnasio→Salle de sport`, `Piscina para niños→Piscine pour enfants`, `Piscina→Piscine`, `Piscina infinita→Piscine à débordement`, `Piscina interior→Piscine intérieure`, `Squash→Squash`, `Sauna→Sauna`, `Zona BBQ→Espace barbecue`, `Terraza→Terrasse`, `Sala de reuniones→Salle de réunion`.
Line 629: `data-fr="Frais de bracelet : 25 000 COP par personne — comprend l'accès à tous les équipements de l'immeuble. Gratuit pour les enfants de moins de 5 ans."`.
Hours (lines 637-639): `Piscina piso 1→Piscine, 1er étage`, `Piscina infinita→Piscine à débordement`, `Gimnasio→Salle de sport`.

- [ ] **Step 2: Map section (lines 646-653)**

Line 646: `data-fr="Votre carte de Macondo"`.
Line 647: on span `data-fr="Tout est"`; on em `data-fr="à proximité"`.
Line 651: `data-fr="Playa del Ritmo"` (proper noun, unchanged).
Line 652: `data-fr="Aéroport de Santa Marta"`.
Line 653: `data-fr="Macondo 717 · Immeuble Delventto"`.

- [ ] **Step 3: `pois` object**

Add an `fr` field to each entry at `public/macondo/index.html:1020-1029`, e.g.:
```js
  home:{es:'...',en:'...',fr:'<strong>Macondo 717 · Immeuble Delventto</strong>Votre refuge. Carrera 4C #70-75, Appt 717, Pozos Colorados.'},
  ritmo:{es:'...',en:'...',fr:'<strong>Playa del Ritmo 🍽</strong>À 4 minutes à pied. Plats du jour à partir de 17 000 COP, avec plage et douches.'},
  zazue:{es:'...',en:'...',fr:'<strong>Centre commercial Zazué 🛍</strong>À 5 minutes à pied. Restaurants, boutiques et pharmacie.'},
  vomito:{es:'...',en:'...',fr:'<strong>Pizza El Vómito 🍕</strong>Institution locale à El Rodadero/Gaira. Parts géantes avec fromage à volonté.'},
  clinica:{es:'...',en:'...',fr:'<strong>Clinique Avidanti 🏥</strong>Vía Alterna al Puerto, Bello Horizonte. Tél : (605) 421 9999.'},
  drog:{es:'...',en:'...',fr:'<strong>Pharmacie Andina 💊</strong>À Zazué Plaza, tout près. Mobile : 316 744 9954.'},
  centro:{es:'...',en:'...',fr:'<strong>Centre historique et Parque de los Novios 🏛</strong>15-20 min en voiture. Maisons coloniales, art urbain et musique live.'},
  quinta:{es:'...',en:'...',fr:'<strong>Quinta de San Pedro Alejandrino 🌳</strong>Hacienda du XVIIe siècle où mourut Simón Bolívar. Jardins et musées.'},
  aero:{es:'...',en:'...',fr:'<strong>Aéroport Simón Bolívar ✈️</strong>10-12 minutes en voiture. Taxi : 20 000-25 000 COP jusqu'à Delventto.'}
```
(Keep the existing `es:`/`en:` values untouched — only add the `fr:` field to each object literal. Watch the apostrophe in `jusqu'à` inside a single-quoted JS string — either escape it (`jusqu\'à`) or switch that literal to double quotes.)

- [ ] **Step 4: Confirm `popInfo()` reads the field generically**

Read `public/macondo/index.html:1031` onward and confirm it does `pois[key][lang]` (or equivalent) rather than a hard-coded `.es`/`.en` ternary. Generalize if needed.

- [ ] **Step 5: Verify and commit**

Reload, switch to FR, confirm amenity chips, hours, map buttons, and clicking each map pin's popup all show French.

```bash
git add public/macondo/index.html
git commit -m "Add French translations for amenities and map sections"
```

---

### Task 7: Translate places/recommendations section

**Files:**
- Modify: `public/macondo/index.html:660-729`

This is the largest content block (restaurant/excursion cards). Translate every `data-es`/`data-en` pair in this range into `data-fr`, following the frozen register/glossary/typography rules from the plan header. Card-by-card source content (tag, name, meta line, description, link labels) is already fully visible in the file at these lines — read them directly rather than relying on a secondhand copy, since the exact HTML structure (nested spans/strong/small) must be preserved per card.

- [ ] **Step 1: Section heading**

Line 660: `data-fr="Recommandations de vos hôtes"`.
Line 661: on span `data-fr="Choses à"`; on em `data-fr="faire et voir"`.

- [ ] **Step 2: "Cerca de ti" cards (Playa del Ritmo, C.C. Zazué, Pizza El Vómito, Centro Histórico, Quinta de San Pedro Alejandrino, Harry's Steakhouse, Cambiante, Burukuka, Brot, Holguer Pizza)**

For each `.place-photo` card in this block, add `data-fr` to: the `.place-tag` span, the `.place-meta` div, the description `<p>`, and each `.place-link` (where translatable — "📍 Cómo llegar" → `data-fr="📍 Itinéraire"`, keep "📸 Instagram" and "🍽 Ver menú"/"View menu" → `data-fr="🍽 Voir le menu"`).

Apply the false-friend/glossary rules while translating — e.g. `estadía→séjour`, `cerca→proche`, no "check-in" wording appears in this section.

- [ ] **Step 3: "Excursiones de un día" cards (Tayrona, Playa Blanca/Bahía Concha, Minca, Marina de Santa Marta, Museo del Oro Tairona)**

Same treatment: `data-fr` on tag, meta, description, and directions link for each card. Line 705's `<h3 class="places-subtitle" data-es="Excursiones de un día" data-en="Full day trips">` needs `data-fr="Excursions d'une journée"`.

- [ ] **Step 4: Verify and commit**

Reload, switch to FR, scroll through every card in both subsections and confirm no Spanish/English text remains, and that "📍 Cómo llegar" links now read "📍 Itinéraire".

```bash
git add public/macondo/index.html
git commit -m "Add French translations for places/recommendations section"
```

---

### Task 8: Translate suite amenities (2nd "amenities" block) + house rules

**Files:**
- Modify: `public/macondo/index.html:731-768`

- [ ] **Step 1: Suite amenities (lines 732-745)**

Line 732: `data-fr="Votre suite"`.
Line 733: on span `data-fr="Tout ce dont"`; on em `data-fr="vous avez besoin"`.
Chips (735-740): `Cama queen→Lit queen`, `Sofá cama→Canapé-lit`, `Aire acondicionado→Climatisation`, `Ducha caliente→Douche chaude`, `WiFi` (bare, no data-es today — leave as-is, universal), `Atardeceres→Couchers de soleil`.
Line 743: `data-fr="Réseau Wi-Fi"`.
Line 744: `data-fr="Mot de passe"`.
Line 745: on small `data-fr="Avant de partir"`; on b `data-fr="Éteignez la TV et la climatisation 🙏"`.

- [ ] **Step 2: House rules (lines 751-767)**

Line 751: `data-fr="Pour un séjour parfait"`.
Line 752: on span `data-fr="Règles de la"`; on em `data-fr="maison"`. (Per the design doc, the heading translation is "Règles de la maison" as a whole — split across the existing span/em structure as `"Règles de la"` + `"maison"`.)

Rule cards (line 754-762), noun-phrase style (parallel structure, per translation guidance — not full sentences):
- 🤫 `data-fr="Merci de garder le volume bas entre 22 h et 8 h"`
- 👥 `data-fr="Occupation maximale selon la réservation, sans visiteurs non enregistrés"`
- 🎉 `data-fr="Fêtes et événements interdits"`
- 🚭 `data-fr="Appartement non-fumeur"`
- 🐾 `data-fr="Animaux non admis sans autorisation préalable"`
- 🪪 `data-fr="Pièce d'identité valide requise à l'arrivée pour tous les invités"`
- 🎟 `data-fr="L'utilisation des équipements de l'immeuble nécessite le bracelet indiqué dans la section Équipements"`
- 🔑 `data-fr="En partant : éteignez les lumières et la climatisation, laissez la serrure comme indiqué"`
- 🛠 `data-fr="L'invité est responsable de tout dommage causé à l'appartement ou à ses biens pendant le séjour"`

Line 766 (long legal paragraph): `data-fr="En réservant et/ou en effectuant le check-in, vous acceptez ce règlement intérieur. 77Rentals et les hôtes ne sont pas responsables des blessures, pertes ou vols d'effets personnels, sauf négligence prouvée de l'hôte, dans la mesure permise par la loi applicable. Le non-respect de ces règles (fêtes, tabac, invités non enregistrés, dommages à la propriété) peut entraîner la résiliation immédiate du séjour sans remboursement, conformément aux conditions de la plateforme de réservation (Airbnb / Booking.com). Les frais de dommages ou de dépôt de garantie peuvent être traités via le centre de résolution de la plateforme concernée."` (Note: this legal paragraph keeps "check-in" as a recognized legal/procedural term consistent with the platforms' own French terms; the visitor-facing headings elsewhere use "arrivée" per the glossary — this is an intentional, narrow exception, not an inconsistency to fix.)

- [ ] **Step 3: Verify and commit**

Reload, switch to FR, confirm the suite amenities chips and all 9 house rules + legal paragraph show French, with the parallel noun-phrase structure preserved.

```bash
git add public/macondo/index.html
git commit -m "Add French translations for suite amenities and house rules"
```

---

### Task 9: Translate hosts, guest-experiences link, SOS, and footer

**Files:**
- Modify: `public/macondo/index.html:775-825`

- [ ] **Step 1: Hosts section (lines 775-781)**

Line 775: `data-fr="À propos de nous"`.
Line 776: `data-fr="Nous sommes Claudia et Sebastián, mère et fils, unis par une passion pour les voyages, l'hospitalité et les bonnes histoires. Après 25 ans comme enseignante, Claudia a ouvert les portes de nos maisons aux voyageurs du monde entier. Sebastián, passionné de tourisme, veille à ce que chaque expérience soit unique et mémorable."`.
Line 778: `data-fr="Avis 5 étoiles"`.
Line 779: `data-fr="Taux de réponse"`.
Line 780: `data-fr="Temps de réponse"`.
Line 781: `data-fr="Langues"`.

- [ ] **Step 2: Guest experiences link section (lines 790-793)**

Line 790: `data-fr="Voix de la communauté"`.
Line 791: on span `data-fr="Nos invités et"`; on em `data-fr="leurs expériences"`.
Line 792: `data-fr="Lisez ce que d'autres voyageurs ont vécu à Macondo, leurs recommandations pour la ville, et partagez votre propre histoire."`.
Line 793: `data-fr="✨ Voir les expériences et partager la vôtre"`.

- [ ] **Step 3: SOS/emergency section (lines 798-810)**

Line 798: `data-fr="À portée de main"`.
Line 799: on span `data-fr="Contacts"`; on em `data-fr="d'urgence"`.
Line 801: `data-fr="Vos hôtes (WhatsApp)"` on strong; `data-fr="Nous répondons en moins d'une heure"` on small.
Line 802: `data-fr="Bello Horizonte, près de Pozos Colorados"` on small.
Line 803: `data-fr="Zazué Plaza, tout près"` on small.
Line 804: `data-fr="Pour les questions non urgentes"` on small.
Line 805: `data-fr="Police nationale"` on strong; `data-fr="Urgences de sécurité"` on small.
Line 806: `data-fr="Ambulances / Urgences médicales"` on strong; `data-fr="Service national"` on small.
Line 807: `data-fr="Pompiers"` on strong; `data-fr="Incendies et sauvetage"` on small.
Line 808: `data-fr="Réception Delventto"` on strong; `data-fr="Concierge de l'immeuble"` on small.
Line 810: `data-fr="📋 Voir tous les numéros d'urgence"`.

- [ ] **Step 4: Footer (lines 817-825)**

Line 817: `data-fr="Laissez la magie commencer"`.
Line 818: `data-fr="Carrera 4C #70-75, Immeuble Delventto, Appt 717 · Santa Marta"`.
Line 823: `data-fr="Règlement intérieur"` (footer link label — matches Task 8's chosen wording for consistency).
Line 825: `data-fr="Si vous avez apprécié votre séjour, un avis 5 étoiles nous aide énormément ⭐"`.

- [ ] **Step 5: Verify and commit**

Reload, switch to FR, confirm hosts bio, the (currently hidden) guest-experiences link section, all SOS contact cards, and the footer render in French.

```bash
git add public/macondo/index.html
git commit -m "Add French translations for hosts, guest-experiences link, SOS, and footer"
```

---

### Task 10: Add French to the AI chat widget

**Files:**
- Modify: `public/macondo/index.html:1400-1425` (`STRINGS`, `currentLang()`)
- Modify: `macondo-private/system-prompt.json` (local file, not committed — see Task 12)

- [ ] **Step 1: Add a French entry to `STRINGS`**

Find (around line 1400):
```js
  var STRINGS = {
    es: {
      sub: 'ASISTENTE VIRTUAL',
      placeholder: 'Escribe tu pregunta...',
      greeting: 'Hola, soy el asistente de Macondo 717. Preguntame sobre el check-in, el wifi, o que hacer en Santa Marta.',
      error: 'No pude conectarme en este momento. Intenta de nuevo o escribe por WhatsApp a 77Rentals.'
    },
    en: {
      sub: 'VIRTUAL ASSISTANT',
      placeholder: 'Type your question...',
      greeting: "Hi, I'm the Macondo 717 assistant. Ask me about check-in, wifi, or what to do in Santa Marta.",
      error: 'I could not connect right now. Please try again or message 77Rentals on WhatsApp.'
    }
  };
```
Replace with (adds an `fr` key):
```js
  var STRINGS = {
    es: {
      sub: 'ASISTENTE VIRTUAL',
      placeholder: 'Escribe tu pregunta...',
      greeting: 'Hola, soy el asistente de Macondo 717. Preguntame sobre el check-in, el wifi, o que hacer en Santa Marta.',
      error: 'No pude conectarme en este momento. Intenta de nuevo o escribe por WhatsApp a 77Rentals.'
    },
    en: {
      sub: 'VIRTUAL ASSISTANT',
      placeholder: 'Type your question...',
      greeting: "Hi, I'm the Macondo 717 assistant. Ask me about check-in, wifi, or what to do in Santa Marta.",
      error: 'I could not connect right now. Please try again or message 77Rentals on WhatsApp.'
    },
    fr: {
      sub: 'ASSISTANT VIRTUEL',
      placeholder: 'Posez votre question…',
      greeting: "Bonjour ! Je suis l'assistant de Macondo 717. Posez-moi vos questions sur votre arrivée, le Wi-Fi, ou les activités à Santa Marta.",
      error: "Je n'ai pas pu me connecter pour le moment. Veuillez réessayer ou écrire à 77Rentals sur WhatsApp."
    }
  };
```

- [ ] **Step 2: Fix `currentLang()` to recognize `fr`**

Find:
```js
  function currentLang(){
    var l = document.documentElement.lang;
    return l === 'en' ? 'en' : 'es';
  }
```
Replace with:
```js
  function currentLang(){
    var l = document.documentElement.lang;
    return (l === 'en' || l === 'fr') ? l : 'es';
  }
```

- [ ] **Step 3: Verify and commit**

Reload, switch to FR, open the chat widget. Expect: header subtitle reads "ASSISTANT VIRTUEL", input placeholder reads "Posez votre question…", and the opening greeting message is in French. Switch back to ES/EN and confirm those still work.

```bash
git add public/macondo/index.html
git commit -m "Add French strings to the AI chat widget UI"
```

---

### Task 11: Add ES/EN/FR toggle + French to the guest experiences board

**Files:**
- Modify: `public/macondo/experiencias.html`
- Modify: `public/shared/guest-experiences.js`

`experiencias.html` currently has zero i18n — everything is hard-coded Spanish with no `data-es`/`data-en`/toggle at all. Introduce the same pattern used in `index.html`.

- [ ] **Step 1: Add a language toggle to the page header**

In `public/macondo/experiencias.html`, inside the `.topbar` div (currently just the brand name + back link), add:
```html
  <div class="lang-toggle">
    <button data-lang="es" class="active" onclick="geSetLang('es')">ES</button>
    <button data-lang="en" onclick="geSetLang('en')">EN</button>
    <button data-lang="fr" onclick="geSetLang('fr')">FR</button>
  </div>
```
Add matching `.lang-toggle` CSS to the page's `<style>` block (copy the rule from `index.html:92-100`, adjusted to the purple/gold palette already used on this page — it's the same palette, so the CSS can be copied verbatim).

- [ ] **Step 2: Tag all existing static text with `data-es`/`data-en`/`data-fr`**

Every hard-coded Spanish string in the page body (hero eyebrow/title/subtitle, "Experiencias de huéspedes" heading, empty-state message, "Comparte tu experiencia" heading, all form field labels, the submit button, and the confirmation message) needs to become a `data-es="<current Spanish text>" data-en="<English>" data-fr="<French>"` triplet, following the exact same markup pattern as `index.html`. Since this file is short (under 200 lines of body content), read it in full first, then apply the pattern to every user-facing string. Example for the hero:
```html
<h1><span data-es="Nuestros huéspedes y" data-en="Our guests and" data-fr="Nos invités et">Nuestros huéspedes y</span> <em data-es="sus experiencias" data-en="their experiences" data-fr="leurs expériences">sus experiencias</em></h1>
```

- [ ] **Step 3: Add a `geSetLang()` function to `guest-experiences.js`**

Add near the top of `public/shared/guest-experiences.js` (after the existing helper functions, before the board-rendering code):
```js
function geSetLang(l) {
  document.documentElement.lang = l;
  document.querySelectorAll('.lang-toggle button').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === l);
  });
  document.querySelectorAll('[data-es]').forEach(el => {
    el.textContent = el.dataset[l];
  });
  document.querySelectorAll('[data-es-placeholder]').forEach(el => {
    el.placeholder = el.dataset[l + 'Placeholder'];
  });
  geLoadBoard(); // re-render approved cards so month/year labels switch language too
}
```

- [ ] **Step 4: Add `GE_MONTHS_FR` and translate the "Recomienda:" card label**

Find (near the top of the file):
```js
const GE_MONTHS_ES = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
const GE_MONTHS_EN = ['January','February','March','April','May','June','July','August','September','October','November','December'];
```
Add immediately after:
```js
const GE_MONTHS_FR = ['janvier','février','mars','avril','mai','juin','juillet','août','septembre','octobre','novembre','décembre'];
```
Update `geFormatMonthYear()` to select the right array:
```js
function geFormatMonthYear(dateStr, lang) {
  const [y, m] = dateStr.split('-').map(Number);
  const months = lang === 'en' ? GE_MONTHS_EN : lang === 'fr' ? GE_MONTHS_FR : GE_MONTHS_ES;
  const month = months[m - 1] || '';
  return lang === 'en' ? `${month} ${y}` : `${month.charAt(0).toUpperCase()}${month.slice(1)} ${y}`;
}
```
Find the "📍 Recomienda:" label in `geRenderCard()`:
```js
    : `<div class="ge-reco"><span class="ge-reco-label">📍 ${lang === 'en' ? 'Recommends:' : 'Recomienda:'}</span> ${geEscapeHtml(row.recommendations_text)}</div>`
```
Replace with a 3-way lookup:
```js
    : `<div class="ge-reco"><span class="ge-reco-label">📍 ${lang === 'en' ? 'Recommends:' : lang === 'fr' ? 'Recommande :' : 'Recomienda:'}</span> ${geEscapeHtml(row.recommendations_text)}</div>`
```

- [ ] **Step 5: Verify and commit**

Reload `experiencias.html`, click FR, confirm every static string switches, the form is usable, and (if any approved test posts exist) their date labels show French month names.

```bash
git add public/macondo/experiencias.html public/shared/guest-experiences.js
git commit -m "Add ES/EN/FR language toggle to the guest experiences board"
```

---

### Task 12: Add French support to the AI chat backend (chat.php + system-prompt.json)

**Files:**
- Modify: `public/macondo/chat.php:130,141-143` (tracked in git — this file IS committed, unlike the private config)
- Modify: `macondo-private/system-prompt.json` (local file, not committed — see Step 5 for deployment)

`chat.php` currently hard-codes a binary `en`/`es` language switch — anything that isn't literally `'en'` falls back to Spanish. Once Task 10 fixes the frontend's `currentLang()` to send `lang: 'fr'`, the backend needs to actually honor it, both for which reply-language instruction it sends and for which property/tourism knowledge-base block it injects.

- [ ] **Step 1: Widen the language allow-list in `chat.php`**

Find (around line 130):
```php
$lang = (isset($data['lang']) && $data['lang'] === 'en') ? 'en' : 'es';
```
Replace with:
```php
$allowedLangs = ['en', 'es', 'fr'];
$lang = (isset($data['lang']) && in_array($data['lang'], $allowedLangs, true)) ? $data['lang'] : 'es';
```

- [ ] **Step 2: Add a French reply-language instruction with explicit vouvoiement**

Find (around lines 141-143):
```php
$languageNote = $lang === 'en'
    ? 'Always reply in English, regardless of the language used elsewhere in this prompt.'
    : 'Responde siempre en espanol, sin importar el idioma usado en el resto de este mensaje.';
```
Replace with:
```php
$languageNote = match ($lang) {
    'en' => 'Always reply in English, regardless of the language used elsewhere in this prompt.',
    'fr' => 'Repondez toujours en francais, quelle que soit la langue utilisee ailleurs dans ce message. Utilisez systematiquement le vouvoiement (vous), jamais le tutoiement (tu), y compris dans les formules de politesse.',
    default => 'Responde siempre en espanol, sin importar el idioma usado en el resto de este mensaje.',
};
```
(PHP `match` requires PHP 8.0+; the local dev PHP binary configured in `.claude/launch.json` is 8.3, and this needs to match whatever runs on the production DreamHost host — if that's older than 8.0, use an `if/elseif/else` chain instead with the same three branches.)

- [ ] **Step 3: Add a `fr` knowledge-base block to `macondo-private/system-prompt.json`**

Read the file first to confirm its current shape (a top-level `instructions` string plus `es`/`en` objects, each with `property` and `tourism` string fields — see the existing `es`/`en` blocks for exact content and formatting, including the `\n\n` section-break convention). Add a third top-level key, `fr`, with translated `property` and `tourism` fields following the same structure and register (`vous`, `Wi-Fi`, `arrivée`/`départ`, `«` `»` for the network name/password):

```json
  "fr": {
    "property": "EMPLACEMENT ET ARRIVEE : Carrera 4C #70-75, Immeuble Delventto, Appt 717, Pozos Colorados, Santa Marta. A 10-12 minutes de l'aeroport en voiture (taxi environ 20 000-25 000 COP).\n\nARRIVEE / DEPART : Arrivee a partir de 15h00 -- a votre arrivee a l'Immeuble Delventto, dirigez-vous vers la reception, presentez une piece d'identite pour tous les invites ainsi que votre confirmation de reservation pour l'Appt 1-717 ; le code numerique de la porte est envoye par WhatsApp le jour de l'arrivee. Depart a 11h30 -- avant de partir, eteignez la television et la climatisation, et verrouillez la porte en passant votre paume sur le clavier numerique.\n\nWI-FI : reseau « 717 Vela Mare », mot de passe « 77Rentals* ».\n\nLA SUITE COMPREND : lit queen, canape-lit, climatisation, douche chaude, Wi-Fi, balcon avec vue sur la Sierra Nevada et de beaux couchers de soleil.\n\nEQUIPEMENTS DE L'IMMEUBLE : salle de sport (6h-22h), piscine 1er etage (9h-18h), piscine a debordement (9h-19h), piscine pour enfants, piscine interieure, terrain de squash, sauna, espace barbecue, terrasse, salle de reunion. Frais de bracelet : 25 000 COP par personne, comprend l'acces a tous les equipements ; gratuit pour les enfants de moins de 5 ans.\n\nREGLEMENT INTERIEUR : volume bas entre 22h et 8h ; occupation maximale selon la reservation, sans visiteurs non enregistres ; fetes et evenements interdits ; appartement non-fumeur ; animaux non admis sans autorisation prealable ; piece d'identite valide requise a l'arrivee ; l'utilisation des equipements necessite le bracelet ; en partant, eteignez les lumieres et la climatisation et laissez la serrure comme indique ; l'invite est responsable des dommages causes a l'appartement pendant le sejour.\n\nCONTACTS : Hotes (WhatsApp, reponse en moins d'une heure) : +57 304 673 6241. E-mail (questions non urgentes) : team@77rentals.com. Reception / concierge de l'Immeuble Delventto : +57 311 754 8493. Clinique Avidanti (Bello Horizonte, pres de Pozos Colorados) : (605) 421 9999. Pharmacie Andina (Zazue Plaza) : 316 744 9954. Urgences nationales -- Police : 123, Ambulance : 125, Pompiers : 119.",
    "tourism": "PRES DE L'APPARTEMENT : Playa del Ritmo (4 min a pied, repas a partir de 17 000 COP, plage avec service de douche, le favori des hotes). Centre commercial C.C. Zazue (5 min a pied, restaurants et boutiques).\n\nRESTAURANTS ET VIE NOCTURNE : Pizza El Vomito (El Rodadero/Gaira) -- une institution locale pour ses genereuses garnitures. Harry's Steakhouse -- viandes premium, cadre intime, ideal pour une soiree speciale. Cambiante -- cuisine d'auteur avec vue sur la mer des Caraibes. Burukuka -- bar/restaurant, excellent spot pour le coucher de soleil au bord de l'eau. Brot -- cafe, boulangerie artisanale et librairie, parfait pour une matinee tranquille. Holguer Pizza -- pizza artisanale, bonne option decontractee.\n\nCULTURE : Centre historique et Parque de los Novios (15-20 min en voiture) -- maisons coloniales, art urbain, musique live sur les places. Quinta de San Pedro Alejandrino (hacienda du XVIIe siecle ou mourut Simon Bolivar, jardins botaniques). Museo del Oro Tairona (15-20 min en voiture, dans la Casa de la Aduana de 1751, entree gratuite, orfevrerie et ceramique precolombiennes Tairona).\n\nEXCURSIONS D'UNE JOURNEE : Parc national naturel Tayrona (~30-35 min en voiture) -- jungle tropicale, montagnes et plages de sable blanc ; mieux vaut arriver tot car le parc ouvre a 8h. Playa Blanca / Bahia Concha (~15-25 min en voiture ou en bateau) -- alternative plus calme et moins frequentee, eaux cristallines. Minca (~40-50 min en voiture) -- village de montagne dans la Sierra Nevada, cascades, fermes de cafe, excellente observation des oiseaux. Marina de Santa Marta (~20-25 min en voiture) -- promenade maritime moderne pres du port historique, tres bon endroit pour un cocktail au coucher du soleil. Palomino est plus loin (1h30-2h), connu pour le tubing sur la riviere et une plage plus sauvage -- pour organiser des excursions a Palomino ou tout detail tres precis d'horaires/tarifs, suggerez de confirmer avec les hotes par WhatsApp pour les informations les plus recentes."
  }
```
(Written without accented capitals/apostrophe-sensitive characters where JSON escaping could be error-prone in a plan document — when actually editing the file, restore proper French accents and typographic apostrophes/guillemets consistently with the rest of the implementation, since this JSON is authored directly, not passed through a lossy channel.)

- [ ] **Step 4: Verify JSON validity, then verify end-to-end with the PHP dev server**

```bash
node -e "JSON.parse(require('fs').readFileSync('macondo-private/system-prompt.json','utf8')); console.log('valid JSON')"
```
Then start the PHP preview (`.claude/launch.json` already has a `"Macondo Chat (PHP)"` config: `php -S localhost:8000 -t public`) and open `http://localhost:8000/macondo/index.html`. Switch to FR, open the chat widget, send a message in French, and confirm the assistant replies in French using `vous` and correct property/tourism facts.

- [ ] **Step 5: Commit `chat.php` only**

```bash
git add public/macondo/chat.php
git commit -m "Add French language support to the AI chat backend"
```
`macondo-private/system-prompt.json` is gitignored — do not `git add` it. Confirm with the user how this file actually reaches production (`.github/workflows/deploy.yml` only generates `config.php` from a secret today; `system-prompt.json` deployment path needs to be confirmed — it may need a manual upload alongside this change, since the existing pipeline doesn't appear to touch it).

---

### Task 13: Full manual verification pass + mobile width check

**Files:** none (verification only)

- [ ] **Step 1: Start the dev server and open the guide**

```bash
npm run dev
```
Navigate to `/macondo/index.html` in a fresh session (gate screen showing).

- [ ] **Step 2: Gate screen check**

Click FR on the gate toggle before unlocking. Confirm eyebrow, subtitle, placeholder, button, and error message (trigger by entering a wrong code) all show French.

- [ ] **Step 3: Full-page check**

Enter the correct gate code, confirm the topbar toggle shows FR as active (synced from the gate selection). Scroll through every section — hero, description, check-in, tour, 3D suite, gallery, amenities, map (click each pin), places (both subsections), suite amenities, house rules, hosts, guest-experiences link, SOS, footer — and confirm no Spanish/English text remains and no element shows blank/`undefined`.

- [ ] **Step 4: Chat widget check**

Open the chat widget while FR is active. Confirm header subtitle, placeholder, and greeting are in French. Send a message in French and confirm the assistant replies in French using `vous`.

- [ ] **Step 5: Guest experiences board check**

Navigate to `/macondo/experiencias.html`, click FR, confirm the toggle works and all form/board text is in French.

- [ ] **Step 6: Mobile width check**

Resize the viewport to 375px width. Re-check the amenity chips, house-rule cards, and any pill/button labels for visible overflow or wrapping issues caused by longer French text. Adjust font-size or padding on any broken elements if found.

- [ ] **Step 7: Regression check — ES/EN still work**

Switch back to ES, then EN, and spot-check a few sections in each to confirm the refactored toggle mechanism didn't break the existing languages.

- [ ] **Step 8: Final commit (if Step 6 required fixes)**

```bash
git add public/macondo/index.html
git commit -m "Fix mobile layout issues found during French verification pass"
```
