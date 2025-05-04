
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/use-auth";

// Pages
import Index from "./pages/Index";
import Freelance from "./pages/Freelance";
import Marketplace from "./pages/Marketplace";
import Reservations from "./pages/Reservations";
import Map from "./pages/Map";
import Verification from "./pages/Verification";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Improve performance by not refetching on window focus
      retry: 1, // Limit retries for improved performance
      staleTime: 5 * 60 * 1000, // 5 minutes stale time for better caching
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AuthProvider>
        <TooltipProvider>
          <div className="flex flex-col min-h-screen">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/freelance" element={<Freelance />} />
              <Route path="/marketplace" element={<Marketplace />} />
              <Route path="/reservations" element={<Reservations />} />
              <Route path="/map" element={<Map />} />
              <Route path="/verify" element={<Verification />} />
              <Route path="/auth" element={<Auth />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
          <Toaster />
          <Sonner />
        </TooltipProvider>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
