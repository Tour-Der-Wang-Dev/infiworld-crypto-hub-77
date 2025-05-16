
import { useState } from "react";
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { PaymentForm } from "@/components/payments/PaymentForm";
import { TransactionsList } from "@/components/payments/TransactionsList";
import { usePayment } from "@/hooks/usePayment";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PaymentType, PAYMENT_TYPE_LABELS } from "@/constants/paymentTypes";
import { AlertCircle, CreditCard, Wallet } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

const Payment = () => {
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [activeTab, setActiveTab] = useState("demo");
  const [paymentAmount, setPaymentAmount] = useState(1000);
  const [paymentType, setPaymentType] = useState<PaymentType>(PaymentType.MARKETPLACE);
  
  const { processPayment, isProcessing } = usePayment({
    onSuccess: () => {
      setShowPaymentForm(false);
      setPaymentComplete(true);
      setTimeout(() => setActiveTab("history"), 2000);
    }
  });
  
  const { user } = useAuth();

  const handleStartPayment = () => {
    setShowPaymentForm(true);
    setPaymentComplete(false);
  };
  
  const handlePaymentSubmit = async (method: string, useEscrow: boolean) => {
    await processPayment({
      amount: paymentAmount,
      method: method as "card" | "crypto" | "promptpay",
      paymentType,
      relatedId: `demo-${Date.now()}`,
      useEscrow,
      sellerId: useEscrow ? "demo-seller-id" : undefined
    });
  };

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardContent className="pt-6">
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold">กรุณาเข้าสู่ระบบ</h2>
                <p className="text-muted-foreground">
                  คุณต้องเข้าสู่ระบบเพื่อใช้งานระบบการชำระเงิน
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>ระบบชำระเงิน | INFIWORLD</title>
        <meta name="description" content="ระบบชำระเงินของ INFIWORLD - รองรับบัตรเครดิต, คริปโตเคอเรนซี และพร้อมเพย์" />
        <meta name="keywords" content="INFIWORLD, ชำระเงิน, บัตรเครดิต, คริปโต, พร้อมเพย์, escrow, marketplace" />
      </Helmet>

      <Navbar />
      <div className="flex-grow p-4 md:p-8 bg-gray-50">
        <div className="container mx-auto max-w-7xl">
          <h1 className="text-3xl font-bold mb-6">ระบบชำระเงิน</h1>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>ระบบชำระเงิน INFIWORLD</CardTitle>
              <CardDescription>
                ชำระเงินได้หลากหลายช่องทาง ทั้งบัตรเครดิต คริปโต และพร้อมเพย์ พร้อมระบบ Escrow ที่ปลอดภัย
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="mb-6">
                  <TabsTrigger value="demo">ทดลองชำระเงิน</TabsTrigger>
                  <TabsTrigger value="history">ประวัติธุรกรรม</TabsTrigger>
                </TabsList>

                <TabsContent value="demo">
                  {paymentComplete ? (
                    <div className="py-8">
                      <Alert className="bg-green-50 border-green-200 text-green-800 mb-4">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                            <CreditCard className="h-5 w-5 text-green-600" />
                          </div>
                          <div>
                            <AlertTitle>การชำระเงินสำเร็จ!</AlertTitle>
                            <AlertDescription>
                              ขอบคุณสำหรับการชำระเงิน คุณสามารถตรวจสอบรายละเอียดได้ที่แท็บประวัติธุรกรรม
                            </AlertDescription>
                          </div>
                        </div>
                      </Alert>
                      
                      <Button 
                        onClick={() => {
                          setShowPaymentForm(false);
                          setPaymentComplete(false);
                        }}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        ทดลองอีกครั้ง
                      </Button>
                    </div>
                  ) : showPaymentForm ? (
                    <PaymentForm 
                      amount={paymentAmount}
                      onPaymentSubmit={handlePaymentSubmit}
                      onCancel={() => setShowPaymentForm(false)}
                      isProcessing={isProcessing}
                      paymentType={paymentType}
                      sellerInfo={{
                        id: "demo-seller-id",
                        name: "ผู้ขายตัวอย่าง"
                      }}
                    />
                  ) : (
                    <div className="space-y-6">
                      <Alert className="bg-blue-50 border-blue-200">
                        <AlertCircle className="h-4 w-4 text-blue-600" />
                        <AlertDescription className="text-blue-800">
                          นี่เป็นการทดลองใช้งานระบบการชำระเงิน คุณสามารถทดลองกระบวนการชำระเงินได้โดยไม่มีการเรียกเก็บเงินจริง
                        </AlertDescription>
                      </Alert>
                      
                      <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold">ตั้งค่าการชำระเงิน</h3>
                          
                          <div>
                            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                              จำนวนเงิน (THB)
                            </label>
                            <Input 
                              id="amount" 
                              type="number" 
                              value={paymentAmount}
                              onChange={(e) => setPaymentAmount(Number(e.target.value))}
                              min={1}
                            />
                          </div>
                          
                          <div>
                            <label htmlFor="paymentType" className="block text-sm font-medium text-gray-700 mb-1">
                              ประเภทการชำระเงิน
                            </label>
                            <select 
                              id="paymentType"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md"
                              value={paymentType}
                              onChange={(e) => setPaymentType(e.target.value as PaymentType)}
                            >
                              {Object.values(PaymentType).map((type) => (
                                <option key={type} value={type}>
                                  {PAYMENT_TYPE_LABELS[type as PaymentType]}
                                </option>
                              ))}
                            </select>
                          </div>
                          
                          <Button 
                            onClick={handleStartPayment} 
                            className="mt-4 bg-green-600 hover:bg-green-700 text-white w-full"
                          >
                            <CreditCard className="mr-2 h-5 w-5" />
                            เริ่มการชำระเงิน
                          </Button>
                        </div>
                        
                        <div className="bg-white p-6 rounded-lg border">
                          <h3 className="text-lg font-semibold mb-4">วิธีการชำระเงินที่รองรับ</h3>
                          
                          <div className="space-y-4">
                            <div className="flex items-start gap-3">
                              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                                <CreditCard className="h-4 w-4 text-blue-600" />
                              </div>
                              <div>
                                <h4 className="font-medium">บัตรเครดิต/เดบิต</h4>
                                <p className="text-sm text-gray-600">Visa, Mastercard, JCB และ American Express</p>
                              </div>
                            </div>
                            
                            <div className="flex items-start gap-3">
                              <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center shrink-0">
                                <Wallet className="h-4 w-4 text-purple-600" />
                              </div>
                              <div>
                                <h4 className="font-medium">คริปโตเคอเรนซี</h4>
                                <p className="text-sm text-gray-600">Bitcoin (BTC), Ethereum (ETH), USDT และอื่นๆ</p>
                              </div>
                            </div>
                            
                            <div className="flex items-start gap-3">
                              <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                                <QrCode className="h-4 w-4 text-green-600" />
                              </div>
                              <div>
                                <h4 className="font-medium">พร้อมเพย์</h4>
                                <p className="text-sm text-gray-600">สแกน QR Code เพื่อชำระเงินผ่านแอปธนาคาร</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="history">
                  <TransactionsList />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>การชำระเงินที่ปลอดภัย</CardTitle>
                <CardDescription>ระบบชำระเงินของเราได้มาตรฐานความปลอดภัยระดับโลก</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center">
                      <Check className="h-4 w-4 text-green-600" />
                    </div>
                    <span>การเข้ารหัสข้อมูล SSL 256-bit</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center">
                      <Check className="h-4 w-4 text-green-600" />
                    </div>
                    <span>มาตรฐาน PCI-DSS Compliance</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center">
                      <Check className="h-4 w-4 text-green-600" />
                    </div>
                    <span>การยืนยันตัวตนหลายชั้น (2FA)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center">
                      <Check className="h-4 w-4 text-green-600" />
                    </div>
                    <span>ระบบตรวจจับการทุจริตอัตโนมัติ</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center">
                      <Check className="h-4 w-4 text-green-600" />
                    </div>
                    <span>การปกป้องข้อมูลส่วนบุคคลตาม PDPA</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>บริการ Escrow</CardTitle>
                <CardDescription>ระบบพักเงินเพื่อความปลอดภัยในการซื้อขาย</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p>
                    บริการ Escrow คือระบบพักเงินที่ช่วยให้การซื้อขายสินค้าและบริการมีความปลอดภัยมากขึ้น 
                    โดยเงินจะถูกพักไว้ในบัญชีกลางจนกว่าผู้ซื้อจะได้รับสินค้าหรือบริการที่ถูกต้องครบถ้วน
                  </p>
                  
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-3 border rounded-lg">
                      <div className="text-infi-green font-semibold mb-1">ขั้นตอนที่ 1</div>
                      <p className="text-sm">ผู้ซื้อชำระเงิน เข้าระบบ Escrow</p>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <div className="text-infi-green font-semibold mb-1">ขั้นตอนที่ 2</div>
                      <p className="text-sm">ผู้ขายส่งมอบสินค้าหรือบริการ</p>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <div className="text-infi-green font-semibold mb-1">ขั้นตอนที่ 3</div>
                      <p className="text-sm">ผู้ซื้อกดปล่อยเงินให้ผู้ขาย</p>
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground">
                    ค่าธรรมเนียมบริการ Escrow: 2% ของมูลค่าการซื้อขาย
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Payment;

// Add missing import
function Check(props: any) {
  return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M20 6 9 17l-5-5"/></svg>
}

function QrCode(props: any) {
  return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect width="5" height="5" x="3" y="3" rx="1"/><rect width="5" height="5" x="16" y="3" rx="1"/><rect width="5" height="5" x="3" y="16" rx="1"/><path d="M21 16h-3a2 2 0 0 0-2 2v3"/><path d="M21 21v.01"/><path d="M12 7v3a2 2 0 0 1-2 2H7"/><path d="M3 12h.01"/><path d="M12 3h.01"/><path d="M12 16v.01"/><path d="M16 12h1"/><path d="M21 12v.01"/><path d="M12 21v-1"/></svg>
}
