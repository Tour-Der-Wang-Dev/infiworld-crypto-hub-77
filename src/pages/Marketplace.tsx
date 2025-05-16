
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

const Marketplace = () => {
  const [listingType, setListingType] = useState<ListingType>("all");
  const [priceRange, setPriceRange] = useState<PriceRange>("all");
  const [isRental, setIsRental] = useState<boolean | null>(null);
  const [filteredListings, setFilteredListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast } = useToast();

  // Fetch listings from Supabase
  const fetchListings = async () => {
    setIsLoading(true);
    try {
      let query = supabase
        .from('listings')
        .select('*')
        .eq('status', 'active');
      
      // Apply filters
      if (listingType !== "all") {
        query = query.eq('type', listingType);
      }
      
      if (priceRange !== "all") {
        if (priceRange === "low") query = query.lt('price', 500000);
        else if (priceRange === "medium") query = query.gte('price', 500000).lt('price', 2000000);
        else if (priceRange === "high") query = query.gte('price', 2000000);
      }
      
      if (isRental !== null) {
        query = query.eq('is_rental', isRental);
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      if (data) {
        // Transform features from JSONB to string array and ensure type safety
        const formattedListings = data.map((listing) => ({
          ...listing,
          // Ensure type is either "car" or "property"
          type: (listing.type === "car" || listing.type === "property") ? listing.type : "property" as const,
          // Convert features to string array
          features: Array.isArray(listing.features) 
            ? listing.features as string[] 
            : (typeof listing.features === 'object' && listing.features !== null) 
              ? Object.keys(listing.features as Record<string, unknown>) 
              : [],
          // Ensure images is an array
          images: Array.isArray(listing.images) ? listing.images : [],
          // Ensure is_rental is boolean
          is_rental: Boolean(listing.is_rental)
        })) as Listing[];
        
        setFilteredListings(formattedListings);
      }
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

  // Track listing view
  const trackListingView = async (listingId: string) => {
    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData?.session?.user?.id;
    
    if (userId && listingId) {
      await supabase.from('listing_views').insert({
        listing_id: listingId,
        viewer_id: userId
      }).select();
    }
  };

  // Add to favorites
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
      // Check if listing is already in favorites
      const { data: existingFavorite } = await supabase
        .from('favorites')
        .select('id')
        .eq('user_id', userId)
        .eq('listing_id', listingId)
        .single();
        
      if (existingFavorite) {
        // Remove from favorites
        await supabase
          .from('favorites')
          .delete()
          .eq('id', existingFavorite.id);
          
        toast({
          title: "Removed from favorites",
          description: "The listing has been removed from your favorites",
          variant: "default",
        });
      } else {
        // Add to favorites
        await supabase
          .from('favorites')
          .insert({
            user_id: userId,
            listing_id: listingId
          });
          
        toast({
          title: "Added to favorites",
          description: "The listing has been added to your favorites",
          variant: "default",
        });
      }
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
