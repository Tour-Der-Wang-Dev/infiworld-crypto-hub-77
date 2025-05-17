
import { useState } from "react";
import { usePayment } from "@/hooks/use-payment";
import { PaymentFormProps, PaymentMethod } from "./types";
import { PaymentConsent } from "./PaymentConsent";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { AlertCircle, CreditCard, Bitcoin, QrCode } from "lucide-react";
import { formatCurrency } from "./utils/formatUtils";

export function PaymentForm({
  amount,
  currency = "THB",
  paymentType,
  relatedId,
  onSuccess,
  onError,
  useEscrow = false,
  sellerId,
  buttonText = "ชำระเงิน"
}: PaymentFormProps) {
  const { processPayment, isProcessing } = usePayment({ onSuccess, onError });
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>("card");
  const [hasConsent, setHasConsent] = useState(false);

  const handlePaymentSubmit = async () => {
    if (!hasConsent) {
      return;
    }
    
    await processPayment({
      amount,
      currency,
      method: selectedMethod,
      paymentType,
      relatedId,
      useEscrow,
      sellerId
    });
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>การชำระเงิน</CardTitle>
        <CardDescription>
          กรุณาเลือกวิธีการชำระเงินที่คุณต้องการ
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center mb-4">
          <p className="text-sm text-muted-foreground">จำนวนเงินที่ต้องชำระ</p>
          <p className="text-3xl font-bold">{formatCurrency(amount, currency)}</p>
          {useEscrow && (
            <div className="mt-2 text-xs px-3 py-1 bg-amber-100 text-amber-800 rounded-full inline-flex items-center">
              <AlertCircle className="h-3 w-3 mr-1" />
              บริการ Escrow (ระบบพักเงิน)
            </div>
          )}
        </div>

        <Tabs defaultValue="card" onValueChange={(value) => setSelectedMethod(value as PaymentMethod)}>
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="card">
              <CreditCard className="h-4 w-4 mr-2" />
              บัตร
            </TabsTrigger>
            <TabsTrigger value="crypto">
              <Bitcoin className="h-4 w-4 mr-2" />
              คริปโต
            </TabsTrigger>
            <TabsTrigger value="promptpay">
              <QrCode className="h-4 w-4 mr-2" />
              พร้อมเพย์
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="card" className="space-y-4">
            <div className="p-4 border rounded-md bg-gray-50">
              <p className="text-sm text-muted-foreground mb-2">ในสถานการณ์จริง นี่คือที่ที่เราจะแสดง Stripe Elements สำหรับข้อมูลบัตร</p>
              <p className="text-xs text-muted-foreground">ค่าธรรมเนียม: 3%</p>
            </div>
          </TabsContent>
          
          <TabsContent value="crypto" className="space-y-4">
            <div className="p-4 border rounded-md bg-gray-50">
              <p className="text-sm text-muted-foreground mb-2">ในสถานการณ์จริง นี่คือที่ที่เราจะแสดงตัวเลือกสกุลเงินคริปโต</p>
              <p className="text-xs text-muted-foreground">รองรับ: BTC, ETH, USDT</p>
              <p className="text-xs text-muted-foreground">ค่าธรรมเนียม: 1%</p>
            </div>
          </TabsContent>
          
          <TabsContent value="promptpay" className="space-y-4">
            <div className="p-4 border rounded-md bg-gray-50 flex flex-col items-center">
              <div className="w-48 h-48 bg-gray-200 mb-2 flex items-center justify-center">
                <p className="text-sm text-gray-500">QR Code</p>
              </div>
              <p className="text-sm text-muted-foreground">สแกน QR Code เพื่อชำระเงินผ่าน PromptPay</p>
              <p className="text-xs text-muted-foreground">ค่าธรรมเนียม: ฟรี</p>
            </div>
          </TabsContent>
        </Tabs>
        
        <Separator />
        
        <PaymentConsent onConsentChange={setHasConsent} />
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handlePaymentSubmit} 
          disabled={!hasConsent || isProcessing} 
          className="w-full"
        >
          {isProcessing ? "กำลังดำเนินการ..." : buttonText}
        </Button>
      </CardFooter>
    </Card>
  );
}
