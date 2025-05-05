
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { PaymentModal } from "@/components/payments/PaymentModal";
import { useAuth } from "@/hooks/use-auth";
import { useIsMobile } from "@/hooks/use-mobile";

interface ListingProps {
  listing: {
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
  };
  onView: () => void;
  onFavoriteToggle: () => void;
}

export default function ListingCard({ listing, onView, onFavoriteToggle }: ListingProps) {
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const { user } = useAuth();
  const isMobile = useIsMobile();

  const handleBuyClick = () => {
    if (!user) {
      window.location.href = "/auth";
      return;
    }
    
    setIsPaymentModalOpen(true);
  };

  // Truncate description for smaller screens
  const truncateDescription = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + "...";
  };

  return (
    <Card className="bg-white rounded-lg shadow-md overflow-hidden h-full flex flex-col">
      <div className="relative">
        <img
          src={listing.images[0] || "https://placehold.co/600x400"}
          alt={listing.title}
          className="w-full h-36 sm:h-48 object-cover"
          loading="lazy"
        />
        <Badge className="absolute top-2 right-2">
          {listing.is_rental ? "ให้เช่า" : "ขาย"}
        </Badge>
      </div>
      <CardHeader className="pb-2">
        <CardTitle className="text-base sm:text-lg line-clamp-1">{listing.title}</CardTitle>
        <CardDescription className="text-xs sm:text-sm">{listing.location}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3 pb-2 flex-grow">
        <p className="text-xs sm:text-sm text-gray-600">
          {isMobile ? truncateDescription(listing.description, 60) : listing.description}
        </p>
        <div className="flex flex-wrap gap-1">
          {listing.features.slice(0, isMobile ? 2 : 3).map((feature) => (
            <Badge key={feature} variant="secondary" className="text-xs">
              {feature}
            </Badge>
          ))}
          {listing.features.length > (isMobile ? 2 : 3) && (
            <Badge variant="outline" className="text-xs">+{listing.features.length - (isMobile ? 2 : 3)}</Badge>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between pt-0">
        <div className="flex items-center space-x-1">
          <Button variant="ghost" size="icon" onClick={onFavoriteToggle} className="h-8 w-8">
            <Heart className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={onView} className="text-xs h-8">
            ดูรายละเอียด
          </Button>
        </div>
        <Button 
          className="bg-infi-green hover:bg-infi-green-hover text-xs sm:text-sm h-8"
          onClick={handleBuyClick}
        >
          {isMobile ? `฿${listing.price.toLocaleString()}` : 
            `${listing.is_rental ? "เช่า" : "ซื้อ"} - ฿${listing.price.toLocaleString()}`}
        </Button>
      </CardFooter>
      <PaymentModal 
        open={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        amount={listing.price}
        paymentType="marketplace"
        relatedId={listing.id}
        useEscrow={listing.type === "property" || listing.price > 1000000}
        sellerId="00000000-0000-0000-0000-000000000000" // Replace with actual seller ID in real implementation
      />
    </Card>
  );
}
