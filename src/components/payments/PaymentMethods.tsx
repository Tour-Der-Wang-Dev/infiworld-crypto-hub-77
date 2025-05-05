
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PaymentConsent } from "@/components/payments/PaymentConsent";
import { CreditCard, Bitcoin, QrCode } from "lucide-react";
import { formatAmount, getPaymentTitle } from "@/components/payments/utils/formatUtils";
import { PaymentMethodsProps } from "@/components/payments/types";

export function PaymentMethods({
  amount,
  currency = "THB",
  onPaymentSubmit,
  onCancel,
  isProcessing,
  paymentType
}: PaymentMethodsProps) {
  const [selectedMethod, setSelectedMethod] = useState<string>("card");
  const [hasConsent, setHasConsent] = useState(false);
  const [cardDetails, setCardDetails] = useState({
    number: "",
    expiry: "",
    cvc: "",
    name: ""
  });

  const handleCardInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCardDetails(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasConsent) {
      return;
    }
    await onPaymentSubmit(selectedMethod);
  };

  return (
    <Card className="w-[400px] max-w-full mx-auto">
      <CardHeader>
        <CardTitle>{getPaymentTitle(paymentType)}</CardTitle>
        <CardDescription>
          เลือกวิธีการชำระเงินที่คุณต้องการ
        </CardDescription>
        <div className="mt-2 text-xl font-bold">{formatAmount(amount, currency)}</div>
      </CardHeader>
      <CardContent>
        <PaymentConsent onConsentChange={setHasConsent} />
        
        <Tabs defaultValue="card" value={selectedMethod} onValueChange={setSelectedMethod}>
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="card" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              <span>บัตร</span>
            </TabsTrigger>
            <TabsTrigger value="crypto" className="flex items-center gap-2">
              <Bitcoin className="h-4 w-4" />
              <span>คริปโต</span>
            </TabsTrigger>
            <TabsTrigger value="promptpay" className="flex items-center gap-2">
              <QrCode className="h-4 w-4" />
              <span>พร้อมเพย์</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="card">
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">ชื่อบนบัตร</Label>
                  <Input 
                    id="name" 
                    name="name"
                    placeholder="ชื่อบนบัตร" 
                    value={cardDetails.name} 
                    onChange={handleCardInputChange} 
                    required 
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="number">หมายเลขบัตร</Label>
                  <Input 
                    id="number" 
                    name="number" 
                    placeholder="0000 0000 0000 0000" 
                    value={cardDetails.number} 
                    onChange={handleCardInputChange} 
                    required 
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="expiry">วันหมดอายุ</Label>
                    <Input 
                      id="expiry" 
                      name="expiry" 
                      placeholder="MM/YY" 
                      value={cardDetails.expiry} 
                      onChange={handleCardInputChange} 
                      required 
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="cvc">CVC</Label>
                    <Input 
                      id="cvc" 
                      name="cvc" 
                      placeholder="123" 
                      value={cardDetails.cvc} 
                      onChange={handleCardInputChange} 
                      required 
                    />
                  </div>
                </div>
              </div>
            </form>
          </TabsContent>

          <TabsContent value="crypto">
            <div className="text-center p-4">
              <div className="max-w-[200px] h-[200px] mx-auto bg-gray-200 flex items-center justify-center mb-4">
                <Bitcoin className="h-16 w-16 text-gray-500" />
              </div>
              <p className="text-sm text-muted-foreground">
                สแกน QR Code ด้วยแอพคริปโตของคุณเพื่อชำระเงิน {formatAmount(amount, currency)}
              </p>
            </div>
          </TabsContent>

          <TabsContent value="promptpay">
            <div className="text-center p-4">
              <div className="max-w-[200px] h-[200px] mx-auto bg-gray-200 flex items-center justify-center mb-4">
                <QrCode className="h-16 w-16 text-gray-500" />
              </div>
              <p className="text-sm text-muted-foreground">
                สแกน QR Code ด้วยแอพธนาคารหรือแอพมือถือเพื่อชำระเงิน {formatAmount(amount, currency)}
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onCancel} disabled={isProcessing}>
          ยกเลิก
        </Button>
        <Button 
          onClick={handleSubmit} 
          disabled={!hasConsent || isProcessing}
          className="bg-infi-green hover:bg-infi-green-hover"
        >
          {isProcessing ? 'กำลังดำเนินการ...' : 'ชำระเงิน'}
        </Button>
      </CardFooter>
    </Card>
  );
}
