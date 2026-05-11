import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/contexts/LanguageContext";
import MagicCursor from "@/components/MagicCursor";
import Index from "./pages/Index.tsx";
import Gracias from "./pages/Gracias.tsx";
import PropertyDetail from "./pages/PropertyDetail.tsx";
import PartnerHub from "./pages/PartnerHub";
import NotFound from "./pages/NotFound.tsx";

// Partner Hub route enabled
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
            <Route path="/partner-hub" element={<PartnerHub />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
