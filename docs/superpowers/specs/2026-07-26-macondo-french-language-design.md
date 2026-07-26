# Macondo guide: add French as a third toggleable language

## Context

The Macondo 717 welcome guide (`public/macondo/index.html`) and the new guest
experiences board (`public/macondo/experiencias.html`) currently support
Spanish and English via a `data-es`/`data-en` toggle pattern. The host wants
French added as a third language, since French-speaking guests are a
meaningful share of visitors.

## Scope

1. **`public/macondo/index.html`** — full French parity across all existing
   translated content, including the gate/passcode screen, and a working
   ES/EN/FR toggle visible both pre-unlock (gate) and post-unlock (topbar).
2. **`public/macondo/experiencias.html` + `public/shared/guest-experiences.js`**
   — introduce the same ES/EN/FR toggle pattern (currently Spanish-only, no
   toggle at all) across form labels, board card copy, confirmation/error
   messages, and month names used in date display.
3. **`macondo-private/system-prompt.json`** (local, gitignored, not committed
   to the repo but present on this machine) — add an instruction so the AI
   chat assistant replies in `vous`-register French when a guest writes in
   French.
4. **Out of scope**: `admin-experiencias.html` (host-only tool, stays
   Spanish-only) and the sister Conquistador guide (follows later as its own
   pass).

## Toggle mechanism refactor

The current implementation hard-codes a single button pair by ID
(`#btn-es`, `#btn-en`) inside `setLang()`:

```js
document.getElementById('btn-es').classList.toggle('active', l==='es');
document.getElementById('btn-en').classList.toggle('active', l==='en');
```

This breaks once a second toggle instance is needed on the gate screen
(IDs must be unique, and `setLang()` only updates one pair). Replace with a
`data-lang="es|en|fr"` attribute on every toggle button and update
`setLang()` to loop over *all* `.lang-toggle button` elements on the page:

```js
document.querySelectorAll('.lang-toggle button').forEach(btn=>{
  btn.classList.toggle('active', btn.dataset.lang === l);
});
```

This lets the same 3-button component appear both in `.gate-card` (visible
before the passcode is entered) and in `.topbar` (visible after), and keeps
them in sync regardless of which one the guest clicks. `setLang()` already
generically re-renders `[data-es]`/`[data-en]` content via
`el.dataset[l]` — extending to `l==='fr'` requires no change to that part
beyond adding `data-fr` attributes.

The AI chat widget's `currentLang()` currently returns `'en'` for anything
that isn't `'es'`, silently mapping `fr → en`. Fix it to recognize `'fr'`
directly and add a `fr` entry to its `STRINGS` object (sub, placeholder,
greeting, error).

## Content inventory (`index.html`)

- Gate screen: eyebrow, subtitle, name-field placeholder, submit button,
  error message (5 items, already have `data-es`/`data-en` — just need
  `data-fr` and the new visible toggle).
- 198 `data-es`/`data-en` element pairs across all sections (welcome,
  check-in, tour, 3D suite, gallery, amenities, map, places/recommendations,
  guest experiences link, house rules, hosts, emergency contacts) → add
  `data-fr` to each.
- 1 `data-es-placeholder`/`data-en-placeholder` pair (gate name field) → add
  `data-fr-placeholder`.
- Gallery photo label objects (`propPhotos`, `amenPhotos`, ~18 entries with
  `{src, es, en}`) → add `fr` field; `renderGal()` already reads
  `photo[lang]` generically.
- Map POI popup blurbs (`pois` object, 9 entries with `{es, en}` HTML
  strings) → add `fr` field; `popInfo()` already reads generically.
- AI chat widget `STRINGS` object (`sub`, `placeholder`, `greeting`,
  `error`) → add `fr` entry.

## Content inventory (`experiencias.html` / `guest-experiences.js`)

- Page currently has zero `data-es`/`data-en` infrastructure — introduce it
  fresh, matching the `index.html` pattern (same CSS class names,
  `data-lang` toggle buttons, `setLang()`-equivalent).
- Form field labels, placeholders, and the submit/status/confirmation copy.
- Public board card labels (guest name, "📍 Recomienda:" style label).
- `GE_MONTHS_ES`/`GE_MONTHS_EN` arrays in `guest-experiences.js` → add
  `GE_MONTHS_FR`, and thread the active language through
  `geFormatMonthYear()` (currently reads `document.documentElement.lang`,
  which will already reflect `'fr'` once the toggle is wired up — no logic
  change needed there beyond the new month array and a French label for
  "Recomienda:").

## Translation approach and style rules

French copy is written directly (not machine-translated), applying guidance
from a native-French-register review:

- **Register: `vous` throughout**, no mixing with `tu`, including the AI
  chat's replies (enforced via the system-prompt instruction) and its UI
  strings. Warmth comes from word choice (`n'hésitez pas à…`,
  `bon séjour !`), not pronoun switching.
- **Typography**: narrow space before `! ? : ;`; `« guillemets »` instead of
  `"straight quotes"`; sentence case in headings (never Title Case); accents
  kept on capital letters (`À`, not `A`); comma as decimal separator; no
  Oxford/serial comma before `et`/`ou`.
- **Glossary, frozen across all strings**: `Wi-Fi` (not `wifi`), `arrivée`/
  `départ` (not "check-in"/"check-out"), `séjour`, `appartement` (not
  `logement`/`studio`), `climatisation`. Colombian proper nouns
  (`Santa Marta`, `Tayrona`, `Minca`, `Rodadero`) stay unaltered.
- **European French vocabulary** (not Québécois): `petit-déjeuner`,
  `week-end`, `e-mail`, etc.
- Avoid literal calques from Spanish/English (`s'il vous plaît` as a
  sentence-opener, stacked `de… de… de…` chains, `éventuellement`/
  `actuellement` false friends) — see full guidance already captured in this
  conversation; applied string-by-string during implementation, not
  re-derived here.
- French text runs longer than English/Spanish (~15–25%); pill/chip/button
  labels are checked at mobile width (375px) after implementation and
  adjusted (font-size or wrapping) if anything visibly breaks.

Not a certified-translator deliverable — flagged for an eventual native
proofread, but functionally complete and consistent for launch.

## Verification

- Load the guide fresh (gate screen showing) → confirm the ES/EN/FR toggle
  is visible and functional *before* entering the passcode, and that gate
  copy (eyebrow, subtitle, placeholder, button, error) switches correctly.
- Unlock and confirm the topbar toggle stays in sync with whatever language
  was selected on the gate screen, and vice versa switching post-unlock.
- Click through all three languages and spot-check: hero, check-in, gallery
  labels, map popups, house rules, host bio, emergency contacts, the new
  guest-experiences link section, and the AI chat widget's greeting/
  placeholder/header text.
- Open the AI chat, write a message in French, confirm the assistant
  replies in French using `vous`.
- Load `experiencias.html`, confirm the toggle works there too and the
  board's date formatting shows French month names when `fr` is active.
- Resize to 375px width and check for any visibly broken/overflowing French
  labels (pills, chips, buttons).
- `admin-experiencias.html` unchanged — confirm it still loads and functions
  in Spanish only.
