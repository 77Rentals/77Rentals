# Design Spec: Contact Form + WhatsApp Button
**Date:** 2026-04-10
**Status:** Approved

---

## Overview

Replace the existing `ReservationForm` (WhatsApp-submit) with a new `ContactForm` positioned immediately after the Hero section. Add a `/gracias` thank-you page. Update the floating WhatsApp button with the correct pre-filled message and real WhatsApp icon.

---

## 1. Page Structure

`src/pages/Index.tsx` section order:
```
Navbar → Hero → ContactForm → ApartmentCard → About → ValueProps
→ Amenities → Testimonials → FAQ → LocalAttractions → MapSection
→ InstagramFeed → PropertyManagement → Footer → WhatsAppButton
```

- `ReservationForm` is **removed** from Index.tsx and deleted.
- `ContactForm` is a new component at position 2 (right after Hero).

---

## 2. ContactForm Component

**File:** `src/components/ContactForm.tsx`

### Fields (in order)
| Field | Type | Placeholder | Required |
|---|---|---|---|
| firstName | text input | "Nombre" | yes |
| lastName | text input | "Apellido" | yes |
| phone | tel input | "WhatsApp / Teléfono" | yes |
| email | email input | "Correo electrónico" | yes |
| destination | text input | "¿A dónde quieres viajar?" | yes |
| checkIn | date input | "Fecha llegada" | yes |
| checkOut | date input | "Fecha salida" | yes |

### Layout
- Name row: `firstName` + `lastName` side by side (flex row, each `flex:1`)
- `phone` — full width
- `email` — full width
- `destination` — full width (free text, NOT a dropdown)
- Dates row: `checkIn` + `checkOut` side by side (flex row, each `flex:1`)
- Submit button: full width, gold `#D4A843`, pill-shaped, "Enviar consulta →"

### Styling
- Section background: `bg-gradient-to-br from-[#2D1B69] to-[#4B0082]` (matches existing brand)
- Inputs: `bg-white/10 border-white/20 text-white placeholder:text-white/50`
- Section title: gold serif label + white Playfair Display heading
- Glass card: `backdrop-blur-xl bg-white/10 border border-white/15`

### Email Submission via Web3Forms
- Endpoint: `https://api.web3forms.com/submit`
- Method: POST, `Content-Type: application/json`
- Payload:
  ```json
  {
    "access_key": "<WEB3FORMS_ACCESS_KEY>",
    "to": "team@77rentals.com",
    "subject": "Nueva consulta desde 77Rentals.com",
    "from_name": "77Rentals Website",
    "name": "<firstName + lastName>",
    "email": "<email>",
    "phone": "<phone>",
    "destination": "<destination>",
    "check_in": "<checkIn>",
    "check_out": "<checkOut>"
  }
  ```
- The `access_key` is a free Web3Forms key obtained at https://web3forms.com — stored in the component (no backend needed).
- On success: navigate to `/gracias` via `react-router-dom` `useNavigate`
- On error: show inline error message "Hubo un error. Por favor intenta de nuevo."
- Loading state: disable button + show spinner while submitting

---

## 3. /gracias Thank-You Page

**File:** `src/pages/Gracias.tsx`
**Route:** `/gracias` added to `App.tsx`

### Content
- Full-page deep purple gradient background (matches brand)
- Gold checkmark circle (SVG or `✓` styled)
- Heading: "¡Gracias por contactarnos!" (Playfair Display, gold)
- Subtext: "Hemos recibido tu mensaje."
- Secondary text: "Nuestro equipo te contactará en las próximas 24 horas."
- Two buttons:
  1. "← Volver al inicio" — ghost style, navigates to `/`
  2. "WhatsApp" — green `#25D366`, opens `wa.me/573046736241?text=...` in new tab

---

## 4. WhatsApp Floating Button

**File:** `src/components/WhatsAppButton.tsx` (update existing)

### Changes
1. **Pre-filled message:** `"Hola 77Rentals, te vi en la página y quisiera saber qué hospedajes tienes"`
   - URL-encoded in the `href`
2. **Icon:** Replace `MessageCircle` (lucide) with the official WhatsApp SVG path (white fill)
3. Everything else unchanged: `fixed bottom-6 right-6 z-50`, green circle, hover scale

### WhatsApp URL
```
https://wa.me/573046736241?text=Hola%2077Rentals%2C%20te%20vi%20en%20la%20p%C3%A1gina%20y%20quisiera%20saber%20qu%C3%A9%20hospedajes%20tienes
```

---

## 5. Web3Forms Setup Note

The `access_key` must be obtained by the owner (free at https://web3forms.com — enter `team@77rentals.com`). A placeholder key will be hardcoded; the owner replaces it with the real one. No `.env` file needed for a static site deploy.

---

## Out of Scope
- Backend/serverless functions
- CAPTCHA or spam protection (Web3Forms includes basic honeypot)
- SMS notifications
- CRM integration
