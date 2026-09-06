import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Bath,
  Bed,
  Check,
  ChevronRight,
  Copy,
  MapPin,
  Maximize,
  MessageCircle,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { toast } from "@/hooks/use-toast";
import {
  catalogDestinations,
  catalogStats,
  type CatalogDestination,
  type CatalogListing,
} from "@/data/catalog";
import logo from "@/assets/logo77.jpeg";

const WA_PARTNER_URL =
  "https://wa.me/573046736241?text=Hola%2077Rentals%2C%20vi%20el%20cat%C3%A1logo%20de%20partners%20y%20quiero%20m%C3%A1s%20informaci%C3%B3n";

const DESTINATION_TILE_BG = [
  "bg-gradient-to-br from-[#3a2680] to-[#241454]",
  "bg-gradient-to-br from-[#1f6f6f] to-[#123c3c]",
  "bg-gradient-to-br from-[#7a4a1e] to-[#3d2510]",
  "bg-gradient-to-br from-[#5c2d5c] to-[#2e1730]",
];

const CAPACITY_FILTERS = [
  { id: "all", label: "Todas", test: () => true },
  { id: "2-4", label: "2–4 personas", test: (n: number) => n >= 2 && n <= 4 },
  { id: "5-8", label: "5–8 personas", test: (n: number) => n >= 5 && n <= 8 },
  { id: "9+", label: "9+ personas", test: (n: number) => n >= 9 },
];

const buildShareText = (destination: CatalogDestination, listing: CatalogListing) => {
  const lines = [
    `${listing.name} · ${destination.name}`,
    listing.tagline,
    `Capacidad: ${listing.capacityLabel}`,
    listing.size ? `Área: ${listing.size}` : null,
    listing.bathrooms,
    "",
    "Incluye:",
    ...listing.features.map((f) => `• ${f}`),
    listing.notes ? `\n${listing.notes}` : null,
    "\nTarifa a coordinar según fechas, noches y huéspedes — 77Rentals.",
  ].filter(Boolean);
  return lines.join("\n");
};

const Catalog = () => {
  const [activeDestination, setActiveDestination] = useState(catalogDestinations[0].id);
  const [capacityFilter, setCapacityFilter] = useState("all");
  const [selected, setSelected] = useState<{ destination: CatalogDestination; listing: CatalogListing } | null>(
    null,
  );

  const destination = useMemo(
    () => catalogDestinations.find((d) => d.id === activeDestination) ?? catalogDestinations[0],
    [activeDestination],
  );

  const activeFilter = CAPACITY_FILTERS.find((f) => f.id === capacityFilter) ?? CAPACITY_FILTERS[0];
  const visibleListings = destination.listings.filter((l) => activeFilter.test(l.capacity));

  const handleCopy = async (destination: CatalogDestination, listing: CatalogListing) => {
    const text = buildShareText(destination, listing);
    try {
      await navigator.clipboard.writeText(text);
      toast({ title: "Ficha copiada", description: "Pégala directo en tu chat con el cliente." });
    } catch {
      toast({ title: "No se pudo copiar", description: "Selecciona y copia el texto manualmente.", variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen bg-[#1a0f3d] text-white">
      {/* Top bar */}
      <header className="sticky top-0 z-40 bg-[#2D1B69] border-b border-white/10">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <img src={logo} alt="77 Rentals" className="h-9 w-auto rounded" />
            <span className="hidden sm:inline text-sm text-white/60 tracking-wide">Programa de Partners</span>
          </Link>
          <a
            href={WA_PARTNER_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm font-medium text-[#D4A843] hover:text-[#e6bd5c] transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            Hablar con el equipo
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#2D1B69] via-[#1a0f3d] to-[#1a0f3d]" />
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-[#D4A843]/10 blur-3xl" />
        <div className="relative container mx-auto px-4 pt-16 pb-14 md:pt-20 md:pb-20 grid lg:grid-cols-[1.1fr,0.9fr] gap-10 lg:gap-6 items-center">
          <div className="text-center lg:text-left">
            <span className="inline-block text-xs md:text-sm tracking-[0.2em] uppercase text-[#D4A843] font-semibold mb-5">
              Catálogo de hospedajes · Alianza comercial
            </span>
            <h1 className="heading-fluid-1 font-serif mb-6 max-w-xl mx-auto lg:mx-0">
              {catalogStats.totalListings} hospedajes.
              <br />
              {catalogStats.destinations} destinos.
              <br />
              <span className="text-[#D4A843]">Un solo aliado.</span>
            </h1>
            <p className="text-white/70 text-base md:text-lg max-w-xl mx-auto lg:mx-0 mb-8">
              Tú defines el precio y tu margen para tu cliente. Nosotros ponemos la propiedad, la operación y la
              experiencia — con tarifas preferenciales para tu agencia.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3">
              <a href="#destinos">
                <Button className="bg-[#D4A843] text-[#1a0f3d] hover:bg-[#e6bd5c] font-semibold rounded-full px-7 h-11">
                  Explorar catálogo
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </a>
              <a href={WA_PARTNER_URL} target="_blank" rel="noopener noreferrer">
                <Button
                  variant="outline"
                  className="border-white/25 bg-transparent text-white hover:bg-white/10 hover:text-white rounded-full px-7 h-11"
                >
                  Hablar con el equipo
                </Button>
              </a>
            </div>
          </div>

          {/* Destination collage */}
          <div className="grid grid-cols-2 gap-3 h-[320px] md:h-[380px]">
            {catalogDestinations.map((d, i) => (
              <a
                key={d.id}
                href="#destinos"
                onClick={() => setActiveDestination(d.id)}
                className={`group relative rounded-2xl overflow-hidden border border-white/10 hover:border-[#D4A843]/50 transition-all duration-300 ${DESTINATION_TILE_BG[i % DESTINATION_TILE_BG.length]} ${
                  i === 0 ? "row-span-2" : ""
                }`}
              >
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-300" />
                <span className="absolute top-3 left-3 text-2xl md:text-3xl drop-shadow">{d.emoji}</span>
                <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black/50 to-transparent">
                  <p className="font-serif text-base md:text-lg leading-tight">{d.name}</p>
                  <p className="text-[11px] text-white/70">{d.listings.length} opciones</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Destination tabs */}
      <section id="destinos" className="sticky top-16 z-30 bg-[#1a0f3d] border-b border-white/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {catalogDestinations.map((d) => (
              <button
                key={d.id}
                onClick={() => setActiveDestination(d.id)}
                className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeDestination === d.id
                    ? "bg-[#D4A843] text-[#1a0f3d]"
                    : "bg-white/5 text-white/70 hover:bg-white/10"
                }`}
              >
                <span>{d.emoji}</span>
                {d.name}
                <span
                  className={`text-xs rounded-full px-1.5 ${
                    activeDestination === d.id ? "bg-[#1a0f3d]/15" : "bg-white/10"
                  }`}
                >
                  {d.listings.length}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Capacity filter + listing grid */}
      <section className="container mx-auto px-4 py-10 md:py-14">
        <div className="mb-8">
          <h2 className="heading-fluid-2 font-serif mb-2">
            {destination.emoji} {destination.name}
          </h2>
          <p className="text-white/60 max-w-2xl">{destination.intro}</p>
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          {CAPACITY_FILTERS.map((f) => (
            <button
              key={f.id}
              onClick={() => setCapacityFilter(f.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                capacityFilter === f.id
                  ? "border-[#D4A843] bg-[#D4A843]/15 text-[#D4A843]"
                  : "border-white/15 text-white/60 hover:border-white/30"
              }`}
            >
              <Users className="w-3 h-3 inline mr-1 -mt-0.5" />
              {f.label}
            </button>
          ))}
        </div>

        {visibleListings.length === 0 ? (
          <p className="text-white/50 text-sm">No hay opciones en este rango para {destination.name} todavía.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {visibleListings.map((listing) => (
              <button
                key={listing.id}
                onClick={() => setSelected({ destination, listing })}
                className="group text-left rounded-2xl overflow-hidden border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] hover:border-[#D4A843]/40 transition-all duration-300"
              >
                <div className="relative h-36 bg-gradient-to-br from-[#3a2680] to-[#1a0f3d] flex items-center justify-center overflow-hidden">
                  <span className="text-4xl opacity-40 group-hover:scale-110 group-hover:opacity-60 transition-transform duration-300">
                    {destination.emoji}
                  </span>
                  {listing.badge && (
                    <Badge className="absolute top-3 left-3 bg-[#D4A843] text-[#1a0f3d] border-transparent">
                      {listing.badge}
                    </Badge>
                  )}
                  <span className="absolute bottom-3 right-3 flex items-center gap-1 text-xs font-semibold bg-black/40 backdrop-blur px-2 py-1 rounded-full">
                    <Users className="w-3 h-3" />
                    {listing.capacityLabel}
                  </span>
                </div>
                <div className="p-4">
                  <h3 className="font-serif text-lg mb-1">{listing.name}</h3>
                  <p className="text-white/60 text-sm mb-3 line-clamp-2">{listing.tagline}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-white/40 flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {destination.name}
                    </span>
                    <span className="text-xs font-medium text-[#D4A843] flex items-center gap-0.5 group-hover:gap-1.5 transition-all">
                      Ver ficha <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </section>

      {/* Cómo funciona */}
      <section className="border-t border-white/10 bg-white/[0.02]">
        <div className="container mx-auto px-4 py-14 md:py-20">
          <h2 className="heading-fluid-2 font-serif text-center mb-12">Cómo funciona la alianza</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                n: "1",
                title: "Cotiza en minutos",
                body: "Nos cuentas destino, fechas, noches y número de huéspedes. Te devolvemos tarifa preferencial al instante.",
              },
              {
                n: "2",
                title: "Tú defines tu precio",
                body: "Agregas tu margen comercial y le vendes a tu cliente con tu propia marca. Nosotros no aparecemos en la conversación.",
              },
              {
                n: "3",
                title: "Nosotros operamos",
                body: "Check-in, limpieza, mantenimiento y soporte al huésped corren por nuestra cuenta. Tú solo vendes y cobras.",
              },
            ].map((step) => (
              <div key={step.n} className="text-center">
                <div className="font-serif text-5xl text-[#D4A843]/80 mb-3">{step.n}</div>
                <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
                <p className="text-white/60 text-sm max-w-xs mx-auto">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="container mx-auto px-4 py-16 md:py-24 text-center">
        <h2 className="heading-fluid-2 font-serif mb-4 max-w-2xl mx-auto">
          Tu próximo cliente ya quiere Colombia.
        </h2>
        <p className="text-white/60 mb-8 max-w-lg mx-auto">
          Dale una razón para reservarte a ti. Escríbenos y activamos tu acceso a tarifas de partner hoy mismo.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 mb-10 text-sm text-white/50">
          <span className="flex items-center gap-1.5">
            <Check className="w-4 h-4 text-[#D4A843]" /> Tarifas preferenciales
          </span>
          <span className="flex items-center gap-1.5">
            <Check className="w-4 h-4 text-[#D4A843]" /> {catalogStats.totalListings} opciones
          </span>
          <span className="flex items-center gap-1.5">
            <Check className="w-4 h-4 text-[#D4A843]" /> {catalogStats.destinations} destinos
          </span>
          <span className="flex items-center gap-1.5">
            <Check className="w-4 h-4 text-[#D4A843]" /> Visitas guiadas en Cartagena
          </span>
        </div>
        <a href={WA_PARTNER_URL} target="_blank" rel="noopener noreferrer">
          <Button className="bg-[#D4A843] text-[#1a0f3d] hover:bg-[#e6bd5c] font-semibold rounded-full px-8 h-12">
            <MessageCircle className="w-4 h-4 mr-2" />
            Escribir por WhatsApp
          </Button>
        </a>
      </section>

      <footer className="border-t border-white/10 py-8 text-center text-xs text-white/40">
        77Rentals · Más de 30 opciones. 4 destinos. Una sola compañía. Hospedaje, experiencia y confianza en Colombia.
      </footer>

      {/* Detail sheet */}
      <Sheet open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <SheetContent className="bg-[#1a0f3d] text-white border-white/10 w-full sm:max-w-md overflow-y-auto">
          {selected && (
            <>
              <SheetHeader className="text-left mb-2">
                <div className="flex items-center gap-2 mb-1">
                  <Badge className="bg-white/10 text-white/70 border-transparent">
                    {selected.destination.emoji} {selected.destination.name}
                  </Badge>
                  {selected.listing.badge && (
                    <Badge className="bg-[#D4A843] text-[#1a0f3d] border-transparent">{selected.listing.badge}</Badge>
                  )}
                </div>
                <SheetTitle className="font-serif text-2xl text-white">{selected.listing.name}</SheetTitle>
                <SheetDescription className="text-white/60">{selected.listing.tagline}</SheetDescription>
              </SheetHeader>

              <div className="h-40 rounded-xl bg-gradient-to-br from-[#3a2680] to-[#1a0f3d] flex items-center justify-center mb-5">
                <span className="text-5xl opacity-40">{selected.destination.emoji}</span>
              </div>

              <div className="grid grid-cols-3 gap-2 mb-5 text-center">
                <div className="rounded-lg bg-white/5 py-3">
                  <Users className="w-4 h-4 mx-auto mb-1 text-[#D4A843]" />
                  <div className="text-xs text-white/70">{selected.listing.capacityLabel}</div>
                </div>
                <div className="rounded-lg bg-white/5 py-3">
                  <Bath className="w-4 h-4 mx-auto mb-1 text-[#D4A843]" />
                  <div className="text-xs text-white/70">{selected.listing.bathrooms}</div>
                </div>
                <div className="rounded-lg bg-white/5 py-3">
                  <Maximize className="w-4 h-4 mx-auto mb-1 text-[#D4A843]" />
                  <div className="text-xs text-white/70">{selected.listing.size ?? "Consultar"}</div>
                </div>
              </div>

              <h4 className="text-sm font-semibold text-white/80 mb-2 flex items-center gap-1.5">
                <Bed className="w-4 h-4 text-[#D4A843]" /> Incluye
              </h4>
              <ul className="space-y-1.5 mb-5">
                {selected.listing.features.map((f) => (
                  <li key={f} className="text-sm text-white/70 flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-[#D4A843] mt-0.5 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>

              {selected.listing.notes && (
                <p className="text-xs text-white/50 bg-white/5 rounded-lg p-3 mb-5">{selected.listing.notes}</p>
              )}

              <div className="flex gap-2">
                <Button
                  onClick={() => handleCopy(selected.destination, selected.listing)}
                  variant="outline"
                  className="flex-1 border-white/20 bg-transparent text-white hover:bg-white/10 hover:text-white rounded-full"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copiar ficha
                </Button>
                <a href={WA_PARTNER_URL} target="_blank" rel="noopener noreferrer" className="flex-1">
                  <Button className="w-full bg-[#D4A843] text-[#1a0f3d] hover:bg-[#e6bd5c] rounded-full">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Consultar
                  </Button>
                </a>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default Catalog;
