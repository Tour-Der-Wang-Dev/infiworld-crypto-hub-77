import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { PaymentModal } from "@/components/payments/PaymentModal";
import { useAuth } from "@/hooks/use-auth";

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

  const handleBuyClick = () => {
    if (!user) {
      window.location.href = "/auth";
      return;
    }
    
    setIsPaymentModalOpen(true);
  };

  return (
    <Card className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="relative">
        <img
          src={listing.images[0] || "https://placehold.co/600x400"}
          alt={listing.title}
          className="w-full h-48 object-cover"
        />
        <Badge className="absolute top-2 right-2">
          {listing.is_rental ? "ให้เช่า" : "ขาย"}
        </Badge>
      </div>
      <CardHeader>
        <CardTitle>{listing.title}</CardTitle>
        <CardDescription>{listing.location}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <p className="text-sm text-gray-600">{listing.description}</p>
        <div className="flex space-x-2">
          {listing.features.map((feature) => (
            <Badge key={feature} variant="secondary">
              {feature}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" onClick={onFavoriteToggle}>
            <Heart className="h-5 w-5" />
          </Button>
          <Button variant="outline" size="sm" onClick={onView}>
            ดูรายละเอียด
          </Button>
        </div>
        <Button 
          className="w-full bg-infi-green hover:bg-infi-green-hover"
          onClick={handleBuyClick}
        >
          {listing.is_rental ? "เช่า" : "ซื้อ"} - ฿{listing.price.toLocaleString()}
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
