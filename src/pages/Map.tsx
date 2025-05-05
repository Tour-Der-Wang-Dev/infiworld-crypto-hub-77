
import { useEffect, useState } from "react";
import { Loader } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import MapComponent from "@/components/map/MapComponent";
import StoreFilters from "@/components/map/StoreFilters";
import StoreDetails from "@/components/map/StoreDetails";
import Navbar from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Tables } from "@/integrations/supabase/types";
import { useToast } from "@/components/ui/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";

type Store = Tables<"stores">;

const Map = () => {
  const [mapboxToken, setMapboxToken] = useState("");
  const [stores, setStores] = useState<Store[]>([]);
  const [filteredStores, setFilteredStores] = useState<Store[]>([]);
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [tokenInput, setTokenInput] = useState("");
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [isFilterVisible, setIsFilterVisible] = useState(!isMobile);

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const { data, error } = await supabase
          .from("stores")
          .select("*");
          
        if (error) {
          throw error;
        }

        if (data) {
          setStores(data);
          setFilteredStores(data);
        }
      } catch (error) {
        console.error("Error fetching stores:", error);
        toast({
          title: "Error",
          description: "Could not load store data. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchStores();

    // Check for saved token in localStorage
    const savedToken = localStorage.getItem("mapboxToken");
    if (savedToken) {
      setMapboxToken(savedToken);
    }
  }, [toast]);

  useEffect(() => {
    // Set filter visibility based on mobile state
    setIsFilterVisible(!isMobile);
  }, [isMobile]);

  useEffect(() => {
    if (selectedCategory) {
      setFilteredStores(stores.filter(store => store.category === selectedCategory));
    } else {
      setFilteredStores(stores);
    }
  }, [selectedCategory, stores]);

  const handleStoreClick = (store: Store) => {
    setSelectedStore(store);
  };

  const handleCloseDetails = () => {
    setSelectedStore(null);
  };

  const handleCategoryFilter = (category: string | null) => {
    setSelectedCategory(category);
  };

  const saveMapboxToken = () => {
    if (tokenInput) {
      localStorage.setItem("mapboxToken", tokenInput);
      setMapboxToken(tokenInput);
      toast({
        title: "Success",
        description: "Mapbox token saved successfully.",
      });
    }
  };

  const toggleFilters = () => {
    setIsFilterVisible(!isFilterVisible);
  };

  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <main className="flex-1 relative overflow-hidden">
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-background/50">
            <Loader className="h-8 w-8 animate-spin text-infi-green" />
            <span className="ml-2 text-lg">Loading stores...</span>
          </div>
        ) : !mapboxToken ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-background p-6">
            <div className="max-w-md w-full bg-card shadow-lg rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-4">Mapbox API Token Required</h2>
              <p className="mb-4">
                To use the map feature, you need to provide a Mapbox public token. 
                You can get one by creating an account at{" "}
                <a 
                  href="https://mapbox.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-infi-green hover:underline"
                >
                  mapbox.com
                </a>.
              </p>
              <div className="flex flex-col gap-2">
                <input
                  type="text"
                  placeholder="Enter your Mapbox public token"
                  className="border rounded p-2 w-full"
                  value={tokenInput}
                  onChange={(e) => setTokenInput(e.target.value)}
                />
                <Button 
                  onClick={saveMapboxToken} 
                  className="bg-infi-green hover:bg-infi-green-hover"
                >
                  Save Token
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <>
            {isMobile && (
              <Button
                className="absolute top-4 right-4 z-10 bg-white text-infi-dark shadow-md"
                onClick={toggleFilters}
                size="sm"
              >
                {isFilterVisible ? "Hide Filters" : "Show Filters"}
              </Button>
            )}
            
            {isFilterVisible && (
              <div className={`absolute top-4 left-4 z-10 max-w-sm transition-all duration-300 ${isMobile ? 'bg-white p-3 rounded-lg shadow-lg' : ''}`}>
                <StoreFilters onCategoryChange={handleCategoryFilter} selectedCategory={selectedCategory} />
              </div>
            )}
            
            <MapComponent 
              stores={filteredStores} 
              onStoreClick={handleStoreClick}
              mapboxToken={mapboxToken}
            />
            
            {selectedStore && (
              <StoreDetails 
                store={selectedStore} 
                onClose={handleCloseDetails} 
              />
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default Map;
