import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PaymentConsent } from "@/components/payments/PaymentConsent";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { formatCurrency } from "./utils/formatUtils";
import { PaymentType } from "./types";
import { CreditCard, Wallet, QrCode, AlertCircle, Check } from "lucide-react";

interface PaymentFormProps {
  amount: number;
  currency?: string;
  onPaymentSubmit: (method: string, useEscrow: boolean) => Promise<void>;
  onCancel: () => void;
  paymentType: PaymentType;
  sellerInfo?: { id: string; name: string };
  isProcessing?: boolean;
  className?: string;
}

const formSchema = z.object({
  cardName: z.string().min(2, { message: "กรุณากรอกชื่อบนบัตร" }),
  cardNumber: z.string().min(16, { message: "กรุณากรอกเลขบัตรที่ถูกต้อง" }),
  cardExpiry: z.string().min(4, { message: "กรุณากรอกวันหมดอายุที่ถูกต้อง" }),
  cardCvc: z.string().min(3, { message: "กรุณากรอก CVC ที่ถูกต้อง" }),
});

export function PaymentForm({
  amount,
  currency = "THB",
  onPaymentSubmit,
  onCancel,
  paymentType,
  sellerInfo,
  isProcessing = false,
  className
}: PaymentFormProps) {
  const [paymentMethod, setPaymentMethod] = useState<string>("card");
  const [useEscrow, setUseEscrow] = useState<boolean>(false);
  const [hasConsent, setHasConsent] = useState<boolean>(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cardName: "",
      cardNumber: "",
      cardExpiry: "",
      cardCvc: "",
    },
  });

  const handleSubmit = async () => {
    if (!hasConsent) {
      return;
    }
    
    if (paymentMethod === "card") {
      const isValid = await form.trigger();
      if (!isValid) return;
    }
    
    await onPaymentSubmit(paymentMethod, useEscrow);
  };

  const getPaymentTitle = () => {
    switch (paymentType) {
      case "marketplace":
        return "ชำระเงินสำหรับสินค้า";
      case "freelance":
        return "ชำระเงินสำหรับบริการฟรีแลนซ์";
      case "reservation":
        return "ชำระเงินสำหรับการจอง";
      default:
        return "ชำระเงิน";
    }
  };

  return (
    <Card className={`w-full max-w-md mx-auto ${className}`}>
      <CardHeader>
        <CardTitle>{getPaymentTitle()}</CardTitle>
        <CardDescription>
          เลือกวิธีการชำระเงินที่คุณต้องการ
        </CardDescription>
        <div className="mt-2 text-xl font-bold">{formatCurrency(amount, currency)}</div>
      </CardHeader>
      
      <CardContent>
        <PaymentConsent onConsentChange={setHasConsent} />
        
        {sellerInfo && (
          <div className="mb-4">
            <div className="flex items-start space-x-2">
              <Checkbox 
                id="use-escrow" 
                checked={useEscrow}
                onCheckedChange={(checked) => setUseEscrow(checked as boolean)}
                disabled={isProcessing}
              />
              <div>
                <Label 
                  htmlFor="use-escrow"
                  className="text-sm font-medium"
                >
                  ใช้บริการ Escrow (ค่าธรรมเนียม 2%)
                </Label>
                <p className="text-xs text-muted-foreground">
                  บริการพักเงินจนกว่าคุณจะได้รับสินค้าหรือบริการเรียบร้อยแล้ว
                </p>
              </div>
            </div>
            
            {useEscrow && (
              <Alert className="mt-2 bg-blue-50 border-blue-200 text-blue-800">
                <AlertCircle className="h-4 w-4 text-blue-600" />
                <AlertDescription>
                  เงินของคุณจะถูกพักไว้จนกว่าจะกดปล่อยเงินให้กับผู้ขาย
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}
        
        <Tabs defaultValue="card" value={paymentMethod} onValueChange={setPaymentMethod}>
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="card" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              <span>บัตร</span>
            </TabsTrigger>
            <TabsTrigger value="crypto" className="flex items-center gap-2">
              <Wallet className="h-4 w-4" />
              <span>คริปโต</span>
            </TabsTrigger>
            <TabsTrigger value="promptpay" className="flex items-center gap-2">
              <QrCode className="h-4 w-4" />
              <span>พร้อมเพย์</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="card">
            <Form {...form}>
              <form className="space-y-4">
                <FormField
                  control={form.control}
                  name="cardName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ชื่อบนบัตร</FormLabel>
                      <FormControl>
                        <Input placeholder="ชื่อผู้ถือบัตร" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="cardNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>หมายเลขบัตร</FormLabel>
                      <FormControl>
                        <Input placeholder="0000 0000 0000 0000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="cardExpiry"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>วันหมดอายุ</FormLabel>
                        <FormControl>
                          <Input placeholder="MM/YY" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="cardCvc"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>CVC</FormLabel>
                        <FormControl>
                          <Input placeholder="123" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div>
                  <p className="text-xs text-gray-500 mt-2 flex items-center">
                    <Check className="h-3 w-3 mr-1 text-green-600" />
                    ข้อมูลบัตรของคุณได้รับการเข้ารหัสและปลอดภัย
                  </p>
                </div>
              </form>
            </Form>
          </TabsContent>

          <TabsContent value="crypto">
            <div className="text-center p-4">
              <div className="max-w-[200px] h-[200px] mx-auto bg-gray-100 border flex items-center justify-center mb-4 relative rounded-lg">
                <Wallet className="h-16 w-16 text-gray-400" />
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-80 rounded-lg">
                  <p className="text-sm font-medium">QR Code จะปรากฏที่นี่</p>
                </div>
              </div>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="เลือกสกุลเงิน" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="btc">Bitcoin (BTC)</SelectItem>
                  <SelectItem value="eth">Ethereum (ETH)</SelectItem>
                  <SelectItem value="usdt">USDT</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground mt-4">
                สแกน QR Code ด้วยแอพคริปโตของคุณเพื่อชำระเงิน {formatCurrency(amount, currency)}
              </p>
            </div>
          </TabsContent>

          <TabsContent value="promptpay">
            <div className="text-center p-4">
              <div className="max-w-[200px] h-[200px] mx-auto bg-gray-100 border flex items-center justify-center mb-4 relative rounded-lg">
                <QrCode className="h-16 w-16 text-gray-400" />
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-80 rounded-lg">
                  <p className="text-sm font-medium">QR Code จะปรากฏที่นี่</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                สแกน QR Code ด้วยแอพธนาคารหรือแอพมือถือเพื่อชำระเงิน {formatCurrency(amount, currency)}
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
          className="bg-green-600 hover:bg-green-700 text-white"
        >
          {isProcessing ? 'กำลังดำเนินการ...' : 'ชำระเงิน'}
        </Button>
      </CardFooter>
    </Card>
  );
}
