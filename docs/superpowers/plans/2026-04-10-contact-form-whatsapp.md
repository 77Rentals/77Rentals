# Contact Form + WhatsApp Button Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the existing ReservationForm with a new ContactForm (position 2 on page, right after Hero), add a /gracias thank-you page, and update the floating WhatsApp button.

**Architecture:** New `ContactForm` component submits JSON to Web3Forms API (no backend needed) and redirects to `/gracias` on success. The `/gracias` page is a new React Router route. `ReservationForm.tsx` is deleted. `WhatsAppButton.tsx` gets an updated message and real WhatsApp SVG icon.

**Tech Stack:** React 18 + TypeScript + Vite + Tailwind CSS + shadcn/ui + react-router-dom v6 + Web3Forms REST API

---

## File Map

| Action | File | Responsibility |
|---|---|---|
| Create | `src/components/ContactForm.tsx` | Form UI + Web3Forms submission + navigation |
| Create | `src/pages/Gracias.tsx` | Thank-you page with back + WhatsApp CTAs |
| Modify | `src/App.tsx` | Add `/gracias` route |
| Modify | `src/pages/Index.tsx` | Add ContactForm after Hero, remove ReservationForm |
| Delete | `src/components/ReservationForm.tsx` | Removed entirely |
| Modify | `src/components/WhatsAppButton.tsx` | Updated message + WhatsApp SVG icon |

---

## Task 1: Create ContactForm component

**Files:**
- Create: `src/components/ContactForm.tsx`

- [ ] **Step 1: Create `src/components/ContactForm.tsx`**

```tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

const WEB3FORMS_KEY = '6979f913-1573-41ce-bbdd-1df63fa27f73';

const fieldClass =
  'bg-white/10 border-white/20 text-white placeholder:text-white/50 hover:border-white/40 focus-visible:border-[#D4A843]/60 transition-all duration-300';

const ContactForm = () => {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [destination, setDestination] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          subject: 'Nueva consulta desde 77Rentals.com',
          from_name: '77Rentals Website',
          name: `${firstName} ${lastName}`,
          email,
          phone,
          destination,
          check_in: checkIn,
          check_out: checkOut,
        }),
      });

      const data = await res.json();
      if (data.success) {
        navigate('/gracias');
      } else {
        setError('Hubo un error. Por favor intenta de nuevo.');
      }
    } catch {
      setError('Hubo un error. Por favor intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contacto" className="relative py-20 bg-gradient-to-br from-[#2D1B69] to-[#4B0082] overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-[#D4A843]/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-white/3 blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 max-w-2xl relative z-10">
        {/* Header */}
        <p className="text-center text-[#D4A843] text-xs font-semibold tracking-widest uppercase mb-2">
          ¿Listo para tu próxima aventura?
        </p>
        <h2 className="text-3xl md:text-4xl font-serif font-bold text-center text-white mb-2">
          Contáctanos
        </h2>
        <div className="w-16 h-1 bg-[#D4A843] mx-auto mb-10 rounded-full" />

        {/* Form card */}
        <form
          onSubmit={handleSubmit}
          className="bg-white/10 backdrop-blur-xl border border-white/15 rounded-2xl p-6 md:p-10 shadow-[0_8px_32px_rgba(0,0,0,0.3)] space-y-4"
        >
          {/* Name row */}
          <div className="flex gap-4">
            <Input
              placeholder="Nombre"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              className={`${fieldClass} flex-1`}
            />
            <Input
              placeholder="Apellido"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              className={`${fieldClass} flex-1`}
            />
          </div>

          {/* Phone */}
          <Input
            type="tel"
            placeholder="WhatsApp / Teléfono"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            className={fieldClass}
          />

          {/* Email */}
          <Input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={fieldClass}
          />

          {/* Destination — free text */}
          <Input
            placeholder="¿A dónde quieres viajar?"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            required
            className={fieldClass}
          />

          {/* Dates row */}
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-white/50 text-xs mb-1 pl-1">Fecha llegada</label>
              <Input
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                required
                className={`${fieldClass} [color-scheme:dark]`}
              />
            </div>
            <div className="flex-1">
              <label className="block text-white/50 text-xs mb-1 pl-1">Fecha salida</label>
              <Input
                type="date"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                required
                className={`${fieldClass} [color-scheme:dark]`}
              />
            </div>
          </div>

          {/* Error message */}
          {error && (
            <p className="text-red-400 text-sm text-center">{error}</p>
          )}

          {/* Submit */}
          <Button
            type="submit"
            disabled={loading}
            size="lg"
            className="w-full bg-[#D4A843] hover:bg-[#c49a3a] text-[#2D1B69] font-bold text-base rounded-full shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Enviando...
              </>
            ) : (
              'Enviar consulta →'
            )}
          </Button>
        </form>
      </div>
    </section>
  );
};

export default ContactForm;
```

- [ ] **Step 2: Commit**

```bash
git add src/components/ContactForm.tsx
git commit -m "feat: add ContactForm component with Web3Forms submission"
```

---

## Task 2: Create /gracias thank-you page

**Files:**
- Create: `src/pages/Gracias.tsx`

- [ ] **Step 1: Create `src/pages/Gracias.tsx`**

```tsx
import { useNavigate } from 'react-router-dom';

const WA_URL =
  'https://wa.me/573046736241?text=Hola%2077Rentals%2C%20te%20vi%20en%20la%20p%C3%A1gina%20y%20quisiera%20saber%20qu%C3%A9%20hospedajes%20tienes';

const Gracias = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a0f40] via-[#2D1B69] to-[#4B0082] flex items-center justify-center px-4">
      {/* Decorative blobs */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full bg-[#D4A843]/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-80 h-80 rounded-full bg-white/3 blur-3xl pointer-events-none" />

      <div className="relative z-10 text-center max-w-md mx-auto">
        {/* Checkmark circle */}
        <div className="w-20 h-20 rounded-full border-2 border-[#D4A843] bg-[#D4A843]/10 flex items-center justify-center mx-auto mb-6">
          <svg
            className="w-9 h-9 text-[#D4A843]"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="text-3xl md:text-4xl font-serif font-bold text-[#D4A843] mb-3">
          ¡Gracias por contactarnos!
        </h1>
        <p className="text-white/85 text-lg mb-2">Hemos recibido tu mensaje.</p>
        <p className="text-white/50 text-sm mb-10">
          Nuestro equipo te contactará en las próximas 24 horas.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 rounded-full border border-white/25 text-white/85 hover:bg-white/10 transition-all duration-300 text-sm font-medium"
          >
            ← Volver al inicio
          </button>
          <a
            href={WA_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 rounded-full bg-[#25D366] hover:bg-[#1ebe5d] text-white font-bold text-sm transition-all duration-300 flex items-center justify-center gap-2 shadow-lg"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
};

export default Gracias;
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/Gracias.tsx
git commit -m "feat: add /gracias thank-you page"
```

---

## Task 3: Register /gracias route in App.tsx

**Files:**
- Modify: `src/App.tsx`

- [ ] **Step 1: Update `src/App.tsx`**

Add the import and route. Final file:

```tsx
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/contexts/LanguageContext";
import MagicCursor from "@/components/MagicCursor";
import Index from "./pages/Index.tsx";
import Gracias from "./pages/Gracias.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <TooltipProvider>
        <MagicCursor />
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/gracias" element={<Gracias />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
```

- [ ] **Step 2: Commit**

```bash
git add src/App.tsx
git commit -m "feat: register /gracias route"
```

---

## Task 4: Update Index.tsx — swap ReservationForm for ContactForm

**Files:**
- Modify: `src/pages/Index.tsx`

- [ ] **Step 1: Update `src/pages/Index.tsx`**

```tsx
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import ContactForm from '@/components/ContactForm';
import ApartmentCard from '@/components/ApartmentCard';
import About from '@/components/About';
import ValueProps from '@/components/ValueProps';
import Amenities from '@/components/Amenities';
import Testimonials from '@/components/Testimonials';
import FAQ from '@/components/FAQ';
import LocalAttractions from '@/components/LocalAttractions';
import MapSection from '@/components/MapSection';
import InstagramFeed from '@/components/InstagramFeed';
import PropertyManagement from '@/components/PropertyManagement';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <ContactForm />
      <ApartmentCard />
      <About />
      <ValueProps />
      <Amenities />
      <Testimonials />
      <FAQ />
      <LocalAttractions />
      <MapSection />
      <InstagramFeed />
      <PropertyManagement />
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Index;
```

- [ ] **Step 2: Delete `src/components/ReservationForm.tsx`**

```bash
rm src/components/ReservationForm.tsx
```

- [ ] **Step 3: Commit**

```bash
git add src/pages/Index.tsx
git rm src/components/ReservationForm.tsx
git commit -m "feat: replace ReservationForm with ContactForm in page layout"
```

---

## Task 5: Update WhatsAppButton with new message and WhatsApp SVG

**Files:**
- Modify: `src/components/WhatsAppButton.tsx`

- [ ] **Step 1: Rewrite `src/components/WhatsAppButton.tsx`**

```tsx
const WA_URL =
  'https://wa.me/573046736241?text=Hola%2077Rentals%2C%20te%20vi%20en%20la%20p%C3%A1gina%20y%20quisiera%20saber%20qu%C3%A9%20hospedajes%20tienes';

const WhatsAppButton = () => {
  return (
    <a
      href={WA_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contactar por WhatsApp"
      className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#25D366] hover:bg-[#1ebe5d] rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
    >
      <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
    </a>
  );
};

export default WhatsAppButton;
```

- [ ] **Step 2: Commit**

```bash
git add src/components/WhatsAppButton.tsx
git commit -m "feat: update WhatsApp button with correct message and official SVG icon"
```

---

## Self-Review

**Spec coverage:**
- ✅ ContactForm with all 7 fields (firstName, lastName, phone, email, destination free-text, checkIn, checkOut)
- ✅ Web3Forms submission to team@77rentals.com
- ✅ On success → navigate to /gracias
- ✅ /gracias page with "← Volver al inicio" + WhatsApp CTA
- ✅ /gracias registered in App.tsx
- ✅ ContactForm positioned after Hero in Index.tsx
- ✅ ReservationForm deleted
- ✅ WhatsAppButton updated with new message + WhatsApp SVG

**Placeholder scan:** None found — all steps contain complete code.

**Type consistency:** `navigate`, `useState`, field names consistent across all tasks.
