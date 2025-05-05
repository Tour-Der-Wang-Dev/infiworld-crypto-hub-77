
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import Profile from "./pages/Profile";
import Map from "./pages/Map";
import Marketplace from "./pages/Marketplace";
import Freelance from "./pages/Freelance";
import Reservations from "./pages/Reservations";
import Transactions from "./pages/Transactions";
import Verification from "./pages/Verification";
import { AuthProvider } from "./hooks/use-auth";
import { ThemeProvider } from "next-themes";
import "./App.css";
import { Toaster } from "sonner";

function App() {
  return (
    <ThemeProvider defaultTheme="light">
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/map" element={<Map />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/freelance" element={<Freelance />} />
            <Route path="/reservations" element={<Reservations />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/verification" element={<Verification />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
        <Toaster position="top-right" />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
