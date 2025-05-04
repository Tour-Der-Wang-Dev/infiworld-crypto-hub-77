
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  // Check if user is logged in
  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user || null);
      }
    );

    // THEN check for existing session
    const getUser = async () => {
      const { data } = await supabase.auth.getSession();
      setUser(data.session?.user || null);
    };

    getUser();

    // Clean up subscription
    return () => subscription.unsubscribe();
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      await supabase.auth.signOut();
      toast("ออกจากระบบสำเร็จ", {
        description: "คุณได้ออกจากระบบแล้ว",
      });
      navigate('/');
    } catch (error) {
      console.error("Logout error:", error);
      toast("เกิดข้อผิดพลาด", {
        description: "ไม่สามารถออกจากระบบได้ กรุณาลองใหม่อีกครั้ง",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <span className="text-xl md:text-2xl font-bold text-infi-dark">INFIWORLD</span>
          <span className="ml-1 text-xs bg-infi-green text-white px-1.5 py-0.5 rounded">CRYPTO</span>
        </Link>

        {/* Mobile menu button */}
        <button 
          className="md:hidden flex items-center"
          onClick={toggleMenu}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-6 w-6" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} 
            />
          </svg>
        </button>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <Link to="/freelance-services" className="text-infi-dark hover:text-infi-green transition-colors">Freelance</Link>
          <Link to="/buy-sell-marketplace" className="text-infi-dark hover:text-infi-green transition-colors">Marketplace</Link>
          <Link to="/travel-reservations" className="text-infi-dark hover:text-infi-green transition-colors">Reservations</Link>
          <Link to="/crypto-store-map" className="text-infi-dark hover:text-infi-green transition-colors">Map</Link>
          <Link to="/identity-verification" className="text-infi-dark hover:text-infi-green transition-colors">Verify</Link>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">EN | TH</Button>
            {user ? (
              <Button 
                onClick={handleLogout} 
                className="bg-infi-green hover:bg-infi-green-hover"
                disabled={isLoading}
              >
                {isLoading ? "กำลังออกจากระบบ..." : "ออกจากระบบ"}
              </Button>
            ) : (
              <Button 
                onClick={() => navigate('/auth')} 
                className="bg-infi-green hover:bg-infi-green-hover"
              >
                เข้าสู่ระบบ
              </Button>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 py-2">
          <div className="container mx-auto px-4 flex flex-col space-y-3">
            <Link to="/freelance-services" className="py-2 text-infi-dark hover:text-infi-green transition-colors">Freelance</Link>
            <Link to="/buy-sell-marketplace" className="py-2 text-infi-dark hover:text-infi-green transition-colors">Marketplace</Link>
            <Link to="/travel-reservations" className="py-2 text-infi-dark hover:text-infi-green transition-colors">Reservations</Link>
            <Link to="/crypto-store-map" className="py-2 text-infi-dark hover:text-infi-green transition-colors">Map</Link>
            <Link to="/identity-verification" className="py-2 text-infi-dark hover:text-infi-green transition-colors">Verify</Link>
            <div className="flex flex-col space-y-2 pt-2">
              <Button variant="outline" size="sm" className="w-full justify-center">EN | TH</Button>
              {user ? (
                <Button 
                  onClick={handleLogout} 
                  className="w-full bg-infi-green hover:bg-infi-green-hover"
                  disabled={isLoading}
                >
                  {isLoading ? "กำลังออกจากระบบ..." : "ออกจากระบบ"}
                </Button>
              ) : (
                <Button 
                  onClick={() => navigate('/auth')} 
                  className="w-full bg-infi-green hover:bg-infi-green-hover"
                >
                  เข้าสู่ระบบ
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
