
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ListingCard from "@/components/marketplace/ListingCard";
import FilterSidebar from "@/components/marketplace/FilterSidebar";
import { supabase } from "@/integrations/supabase/client";
import { Json } from "@/integrations/supabase/types";

type ListingType = "all" | "car" | "property";
type PriceRange = "all" | "low" | "medium" | "high";

interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  type: "car" | "property";
  images: string[];
  is_rental: boolean;
  location: string;
  features: string[];
  status: string;
}

type ErrorWithMessage = {
  message: string;
}

function isErrorWithMessage(error: unknown): error is ErrorWithMessage {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as Record<string, unknown>).message === 'string'
  );
}

function toErrorWithMessage(error: unknown): ErrorWithMessage {
  if (isErrorWithMessage(error)) return error;
  
  try {
    return new Error(
      error instanceof Error 
        ? error.message 
        : JSON.stringify(error)
    );
  } catch {
    // Fallback in case JSON.stringify fails
    return new Error('Unknown error occurred');
  }
}

// Mock data as there's no listings table in the schema
const mockListings: Listing[] = [
  {
    id: "car-1",
    title: "Tesla Model 3 2022",
    description: "Electric car in excellent condition",
    price: 1800000,
    type: "car",
    images: ["/assets/marketplace/car-1.jpg"],
    is_rental: false,
    location: "Bangkok",
    features: ["Electric", "Autopilot", "Premium Sound"],
    status: "active"
  },
  {
    id: "property-1",
    title: "Luxury Condo Sukhumvit",
    description: "2 bedroom condo near BTS",
    price: 6500000,
    type: "property",
    images: ["/assets/marketplace/property-1.jpg"],
    is_rental: false,
    location: "Sukhumvit, Bangkok",
    features: ["Pool", "Gym", "Security"],
    status: "active"
  },
  {
    id: "car-2",
    title: "Honda Civic 2021",
    description: "Well maintained sedan",
    price: 850000,
    type: "car",
    images: ["/assets/marketplace/car-2.jpg"],
    is_rental: true,
    location: "Chiang Mai",
    features: ["Automatic", "Fuel Efficient"],
    status: "active"
  },
  {
    id: "property-2",
    title: "Beach Villa Phuket",
    description: "3 bedroom villa with sea view",
    price: 12500000,
    type: "property",
    images: ["/assets/marketplace/property-2.jpg"],
    is_rental: false,
    location: "Phuket",
    features: ["Beach Access", "Private Pool", "Garden"],
    status: "active"
  }
];

const Marketplace = () => {
  const [listingType, setListingType] = useState<ListingType>("all");
  const [priceRange, setPriceRange] = useState<PriceRange>("all");
  const [isRental, setIsRental] = useState<boolean | null>(null);
  const [filteredListings, setFilteredListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast } = useToast();

  // Fetch listings - simulated with mock data since there's no listings table
  const fetchListings = async () => {
    setIsLoading(true);
    try {
      console.log("Fetching listings with filters:", { listingType, priceRange, isRental });
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Filter the mock data based on the filters
      let filtered = [...mockListings];
      
      if (listingType !== "all") {
        filtered = filtered.filter(listing => listing.type === listingType);
      }
      
      if (priceRange !== "all") {
        if (priceRange === "low") filtered = filtered.filter(listing => listing.price < 500000);
        else if (priceRange === "medium") filtered = filtered.filter(listing => listing.price >= 500000 && listing.price < 2000000);
        else if (priceRange === "high") filtered = filtered.filter(listing => listing.price >= 2000000);
      }
      
      if (isRental !== null) {
        filtered = filtered.filter(listing => listing.is_rental === isRental);
      }
      
      setFilteredListings(filtered);
    } catch (error: unknown) {
      const errorWithMessage = toErrorWithMessage(error);
      console.error('Error fetching listings:', errorWithMessage);
      
      toast({
        title: "ไม่สามารถดึงข้อมูลรายการได้",
        description: errorWithMessage.message || "กรุณาลองอีกครั้งในภายหลัง",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Track listing view (simulated)
  const trackListingView = async (listingId: string) => {
    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData?.session?.user?.id;
    
    if (userId && listingId) {
      console.log(`Tracking view for listing ${listingId} by user ${userId}`);
      // In a real implementation, we would insert a record to listing_views table
    }
  };

  // Add to favorites (simulated)
  const toggleFavorite = async (listingId: string) => {
    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData?.session?.user?.id;
    
    if (!userId) {
      toast({
        title: "Authentication required",
        description: "Please sign in to save listings to favorites",
        variant: "default",
      });
      return;
    }
    
    try {
      console.log(`Toggling favorite for listing ${listingId} by user ${userId}`);
      // This is a simulation - in a real implementation we would check and toggle a record in favorites table
      
      toast({
        title: "Favorite toggled",
        description: "Your favorites have been updated",
        variant: "default",
      });
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast({
        title: "Error updating favorites",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchListings();
  }, [listingType, priceRange, isRental]);

  return (
    <>
      <Navbar />
      <div className="bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-semibold mb-6 text-infi-dark">INFIWORLD Marketplace</h1>
          <p className="text-infi-gray mb-8">
            ซื้อ ขาย เช่า รถยนต์และอสังหาริมทรัพย์ด้วยสกุลเงินดิจิทัลหรือบัตรเครดิต
          </p>

          <div className="flex flex-col md:flex-row gap-6">
            {/* Filter Sidebar */}
            <div className="w-full md:w-1/4">
              <FilterSidebar
                listingType={listingType}
                setListingType={setListingType}
                priceRange={priceRange}
                setPriceRange={setPriceRange}
                isRental={isRental}
                setIsRental={setIsRental}
              />
            </div>

            {/* Listings Grid */}
            <div className="w-full md:w-3/4">
              {isLoading ? (
                <div className="flex justify-center items-center h-60">
                  <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-infi-green"></div>
                </div>
              ) : filteredListings.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredListings.map((listing) => (
                    <ListingCard 
                      key={listing.id} 
                      listing={listing} 
                      onView={() => trackListingView(listing.id)}
                      onFavoriteToggle={() => toggleFavorite(listing.id)}
                    />
                  ))}
                </div>
              ) : (
                <div className="bg-white p-8 rounded-lg shadow-sm text-center">
                  <p className="text-infi-gray text-lg">
                    ไม่พบรายการที่ตรงกับการค้นหา กรุณาลองเปลี่ยนตัวกรอง
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Marketplace;
