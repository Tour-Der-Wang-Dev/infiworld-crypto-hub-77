
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { useIsMobile } from "@/hooks/use-mobile";
import { Heart } from "lucide-react";

interface ListingCardProps {
  listing: {
    id: string;
    title: string;
    description: string;
    price: number;
    type: "car" | "property";
    image?: string;
    images?: string[];
    is_rental: boolean;
    location: string;
    features: string[];
  };
  onView?: () => void;
  onFavoriteToggle?: () => void;
}

const ListingCard = ({ listing, onView, onFavoriteToggle }: ListingCardProps) => {
  const [showDetails, setShowDetails] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const isMobile = useIsMobile();

  // Format price based on rental or sale
  const formattedPrice = new Intl.NumberFormat("th-TH").format(listing.price);
  const priceDisplay = listing.is_rental ? 
    `฿${formattedPrice}/เดือน` : 
    `฿${formattedPrice}`;

  const handleShowDetails = () => {
    setShowDetails(!showDetails);
    if (!showDetails && onView) {
      onView();
    }
  };

  const handleFavoriteToggle = () => {
    if (onFavoriteToggle) {
      setIsFavorite(!isFavorite);
      onFavoriteToggle();
    }
  };

  // Get image from listing - support both legacy and new data structure
  const imageUrl = listing.image || 
    (listing.images && listing.images.length > 0 ? listing.images[0] : "/placeholder.svg");

  return (
    <Card className="overflow-hidden h-full flex flex-col transition-shadow hover:shadow-md">
      <div className="relative">
        <AspectRatio ratio={16 / 9}>
          <img 
            src={imageUrl} 
            alt={listing.title}
            className="w-full h-full object-cover"
          />
        </AspectRatio>
        <div className="absolute top-2 left-2 flex gap-1 sm:gap-2">
          <Badge variant="default" className="bg-infi-green text-xs">
            {listing.type === "car" ? "รถยนต์" : "อสังหาริมทรัพย์"}
          </Badge>
          {listing.is_rental ? (
            <Badge variant="outline" className="bg-white text-xs">เช่า</Badge>
          ) : (
            <Badge variant="outline" className="bg-white text-xs">ขาย</Badge>
          )}
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute top-2 right-2 h-8 w-8 rounded-full bg-white/80 hover:bg-white"
          onClick={handleFavoriteToggle}
        >
          <Heart 
            className={`h-4 w-4 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-500'}`} 
          />
        </Button>
      </div>

      <CardHeader className="pb-1 sm:pb-2 px-3 sm:px-4 pt-2 sm:pt-3">
        <div className="text-base sm:text-lg font-semibold line-clamp-1">{listing.title}</div>
        <div className="text-xs sm:text-sm text-infi-gray">{listing.location}</div>
      </CardHeader>
      
      <CardContent className="flex-grow px-3 sm:px-4 py-1 sm:py-2">
        <div className="text-lg sm:text-xl font-bold text-infi-green mb-1 sm:mb-2">
          {priceDisplay}
        </div>
        <p className={`text-infi-gray text-xs sm:text-sm ${showDetails ? '' : 'line-clamp-2'}`}>
          {listing.description}
        </p>
        
        {showDetails && (
          <div className="mt-3 sm:mt-4">
            <div className="text-xs sm:text-sm font-semibold mb-1">คุณสมบัติ:</div>
            <div className="flex flex-wrap gap-1">
              {listing.features.map((feature, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {feature}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex justify-between pt-0 px-3 sm:px-4 pb-3 sm:pb-4">
        <Button 
          variant="outline"
          className="text-xs h-8 sm:h-9" 
          onClick={handleShowDetails}
        >
          {showDetails ? "แสดงน้อยลง" : "ดูเพิ่มเติม"}
        </Button>
        <Button className="text-xs h-8 sm:h-9 bg-infi-green hover:bg-infi-green-hover">
          {listing.is_rental ? "จองเช่า" : "ซื้อเลย"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ListingCard;
