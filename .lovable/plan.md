

## Booking Form: Brand-Cohesive Interactive Background Redesign

### What Changes

**1. LiquidGoldCanvas.tsx — Complete shader rewrite**
- Base color changes from light purple (`0.92, 0.90, 0.96`) to deep purple (`#4B0082` / `rgb(0.29, 0.0, 0.51)`)
- Add a dark-on-dark geometric grid pattern drawn in the shader (repeating diamond/mesh lines in slightly lighter purple, echoing the Hero wireframe)
- Replace the sprinkle effect with a "Localized Gold Reveal": within a tight ~80px radius around the cursor, the grid lines transition from dark purple to glowing metallic gold
- Add smooth cursor interpolation: pass a `u_cursor` uniform (current smoothed position) instead of discrete touch events. JS-side, lerp the cursor position each frame (`cursor += (target - cursor) * 0.08`) for organic inertia/lag
- Gold glow uses a soft radial gradient falloff with the brand gold color (`#D4A843`)
- Canvas uses `alpha: true` so the deep purple base can show through properly
- Keep `pointerEvents: 'none'` on canvas (currently `auto` — fix this so form interaction isn't blocked)

**2. ReservationForm.tsx — Glassmorphism card + gold pulse on focus**
- Section background: solid `bg-[#4B0082]` instead of current class
- Section title/divider: change text to `text-white` / `text-primary-foreground` since background is now dark
- Form card: glassmorphism style — `bg-white/10 backdrop-blur-xl border border-white/15 shadow-[0_8px_32px_rgba(0,0,0,0.3)]` so gold glow bleeds through edges
- Form field text colors adjusted for dark glass card (white text, lighter placeholders)
- Add a gold pulse animation on input focus: a CSS `@keyframes gold-pulse` that briefly expands a gold box-shadow ring outward, applied via `focus-visible:animate-gold-pulse`

**3. index.css — New keyframe**
- Add `@keyframes gold-pulse` — a 0.6s ease-out animation: `0% { box-shadow: 0 0 0 0 rgba(212,168,67,0.4) }` → `100% { box-shadow: 0 0 0 12px rgba(212,168,67,0) }`
- Remove `.reservation-bg` class (no longer needed)

**4. tailwind.config.ts — Register animation**
- Add `'gold-pulse': 'gold-pulse 0.6s ease-out'` to the animation config

### Technical Approach
- The geometric grid is drawn entirely in the fragment shader using `fract()` and `step()` on UV coordinates — no SVG or image needed
- Cursor smoothing happens in the JS `render` loop via linear interpolation, passed as a single `u_cursor` vec2 uniform
- The reveal radius is calculated in pixel space (~80px) converted to UV space using resolution uniforms
- The form card's `backdrop-blur` + semi-transparent bg creates the glassmorphism depth effect, letting the canvas gold glow show through the card edges

