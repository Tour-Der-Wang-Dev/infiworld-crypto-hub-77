
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/hooks/use-auth";
import { RequireAuth } from "@/components/auth/RequireAuth";

// Pages
import Index from "./pages/Index";
import Freelance from "./pages/Freelance";
import Marketplace from "./pages/Marketplace";
import Reservations from "./pages/Reservations";
import Map from "./pages/Map";
import Verification from "./pages/Verification";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import { useEffect } from "react";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Improve performance by not refetching on window focus
      retry: 1, // Limit retries for improved performance
      staleTime: 5 * 60 * 1000, // 5 minutes stale time for better caching
    },
  },
});

const CanonicalTag = ({ path }: { path: string }) => {
  useEffect(() => {
    // Set canonical URL tag
    let link: HTMLLinkElement | null = document.querySelector('link[rel="canonical"]');
    const url = window.location.origin + path;

    if (!link) {
      link = document.createElement('link');
      link.setAttribute('rel', 'canonical');
      document.head.appendChild(link);
    }
    
    link.setAttribute('href', url);
    
    return () => {
      // Clean up when route changes
      if (link && link.parentNode) {
        link.parentNode.removeChild(link);
      }
    };
  }, [path]);

  return null;
};

const RouteWithCanonical = ({ path, element }: { path: string, element: React.ReactNode }) => {
  return (
    <>
      <CanonicalTag path={path} />
      {element}
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AuthProvider>
        <TooltipProvider>
          <div className="flex flex-col min-h-screen">
            <Routes>
              {/* Home Route */}
              <Route path="/" element={<RouteWithCanonical path="/" element={<Index />} />} />
              
              {/* Main Feature Routes with SEO-friendly URLs */}
              <Route path="/freelance-services" element={
                <RouteWithCanonical path="/freelance-services" element={<RequireAuth><Freelance /></RequireAuth>} />
              } />
              <Route path="/buy-sell-marketplace" element={
                <RouteWithCanonical path="/buy-sell-marketplace" element={<Marketplace />} />
              } />
              <Route path="/travel-reservations" element={
                <RouteWithCanonical path="/travel-reservations" element={<RequireAuth><Reservations /></RequireAuth>} />
              } />
              <Route path="/crypto-store-map" element={
                <RouteWithCanonical path="/crypto-store-map" element={<Map />} />
              } />
              <Route path="/identity-verification" element={
                <RouteWithCanonical path="/identity-verification" element={<RequireAuth><Verification /></RequireAuth>} />
              } />
              
              {/* User Management Routes */}
              <Route path="/auth" element={<RouteWithCanonical path="/auth" element={<Auth />} />} />
              <Route path="/user-profile" element={
                <RouteWithCanonical path="/user-profile" element={<RequireAuth><Profile /></RequireAuth>} />
              } />
              
              {/* Legacy URL redirects */}
              <Route path="/freelance" element={<Navigate to="/freelance-services" replace />} />
              <Route path="/marketplace" element={<Navigate to="/buy-sell-marketplace" replace />} />
              <Route path="/reservations" element={<Navigate to="/travel-reservations" replace />} />
              <Route path="/map" element={<Navigate to="/crypto-store-map" replace />} />
              <Route path="/verify" element={<Navigate to="/identity-verification" replace />} />
              <Route path="/profile" element={<Navigate to="/user-profile" replace />} />
              
              {/* Catch-all route */}
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
