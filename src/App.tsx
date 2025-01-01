import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Boilerplate from "./pages/tools/Boilerplate";
import Headline from "./pages/tools/Headline";
import Quote from "./pages/tools/Quote";
import CTA from "./pages/tools/CTA";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/tools/boilerplate" element={<Boilerplate />} />
          <Route path="/tools/headline" element={<Headline />} />
          <Route path="/tools/quote" element={<Quote />} />
          <Route path="/tools/cta" element={<CTA />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;