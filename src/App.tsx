import { Suspense, lazy } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/contexts/LanguageContext";
import MagicCursor from "@/components/MagicCursor";
import { RouteErrorBoundary } from "@/components/RouteErrorBoundary";
import Index from "./pages/Index.tsx";
import Gracias from "./pages/Gracias.tsx";
import PropertyDetail from "./pages/PropertyDetail.tsx";
import Catalog from "./pages/Catalog.tsx";
import Cotizacion from "./pages/Cotizacion.tsx";
import ReservaConfirmada from "./pages/ReservaConfirmada.tsx";
import CompletarDatos from "./pages/CompletarDatos.tsx";
import CuentaCobro from "./pages/CuentaCobro.tsx";
import NotFound from "./pages/NotFound.tsx";

// Loaded lazily because they pull in the Supabase client: if that project's
// env vars or schema are ever misconfigured, the failure stays isolated to
// these routes instead of crashing the whole site (they're imported eagerly
// otherwise, since nothing else in App.tsx is code-split).
const PartnerHub = lazy(() => import("./pages/PartnerHub"));
const OwnerSigningPage = lazy(() => import("./pages/OwnerSigningPage.tsx"));
const ClientSigningPage = lazy(() => import("./pages/ClientSigningPage.tsx"));
const PetitionSigningPage = lazy(() => import("./pages/PetitionSigningPage.tsx"));
const PetitionRosterPage = lazy(() => import("./pages/PetitionRosterPage.tsx"));

function RouteLoadingScreen() {
  return (
    <div className="min-h-screen bg-[#f8f7ff] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-[#2D1B69]/20 border-t-[#2D1B69] rounded-full animate-spin" />
    </div>
  );
}

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
            <Route path="/propiedades/:slug" element={<PropertyDetail />} />
            <Route
              path="/partner-hub/*"
              element={
                <RouteErrorBoundary>
                  <Suspense fallback={<RouteLoadingScreen />}>
                    <PartnerHub />
                  </Suspense>
                </RouteErrorBoundary>
              }
            />
            <Route path="/catalogo" element={<Catalog />} />
            <Route path="/cotizacion" element={<Cotizacion />} />
            <Route path="/reserva-confirmada" element={<ReservaConfirmada />} />
            <Route path="/completar-datos" element={<CompletarDatos />} />
            <Route path="/cuenta-cobro" element={<CuentaCobro />} />
            <Route
              path="/firmar/:linkId"
              element={
                <RouteErrorBoundary>
                  <Suspense fallback={<RouteLoadingScreen />}>
                    <OwnerSigningPage />
                  </Suspense>
                </RouteErrorBoundary>
              }
            />
            <Route
              path="/firmar-cliente/:linkId"
              element={
                <RouteErrorBoundary>
                  <Suspense fallback={<RouteLoadingScreen />}>
                    <ClientSigningPage />
                  </Suspense>
                </RouteErrorBoundary>
              }
            />
            <Route
              path="/peticion/:petitionId"
              element={
                <RouteErrorBoundary>
                  <Suspense fallback={<RouteLoadingScreen />}>
                    <PetitionSigningPage />
                  </Suspense>
                </RouteErrorBoundary>
              }
            />
            <Route
              path="/peticion/:petitionId/firmantes"
              element={
                <RouteErrorBoundary>
                  <Suspense fallback={<RouteLoadingScreen />}>
                    <PetitionRosterPage />
                  </Suspense>
                </RouteErrorBoundary>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
// Test deployment
