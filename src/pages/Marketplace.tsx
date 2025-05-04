
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ListingCard from "@/components/marketplace/ListingCard";
import FilterSidebar from "@/components/marketplace/FilterSidebar";
import { supabase } from "@/integrations/supabase/client";

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
        // Transform features from JSONB to string array
        const formattedListings = data.map((listing) => ({
          ...listing,
          features: Array.isArray(listing.features) ? listing.features : Object.keys(listing.features || {}),
          // Use first image from array or fallback to placeholder
          image: listing.images && listing.images.length > 0 ? listing.images[0] : "/placeholder.svg"
        }));
        setFilteredListings(formattedListings);
      }
    } catch (error) {
      console.error('Error fetching listings:', error);
      toast({
        title: "Error fetching listings",
        description: "Please try again later",
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
