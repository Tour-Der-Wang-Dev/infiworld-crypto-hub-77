
import { useState } from "react";
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePayment } from "@/hooks/usePayment";
import { useAuth } from "@/hooks/use-auth";
import { PaymentType } from "@/constants/paymentTypes";
import { PaymentDemo } from "@/components/payments/PaymentDemo";
import { PaymentHistory } from "@/components/payments/PaymentHistory";
import { PaymentInfo } from "@/components/payments/PaymentInfo";

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
                  <PaymentDemo 
                    paymentAmount={paymentAmount}
                    setPaymentAmount={setPaymentAmount}
                    paymentType={paymentType}
                    setPaymentType={setPaymentType}
                    showPaymentForm={showPaymentForm}
                    setShowPaymentForm={setShowPaymentForm}
                    paymentComplete={paymentComplete}
                    setPaymentComplete={setPaymentComplete}
                    handleStartPayment={handleStartPayment}
                    handlePaymentSubmit={handlePaymentSubmit}
                    isProcessing={isProcessing}
                    setActiveTab={setActiveTab}
                  />
                </TabsContent>
                
                <TabsContent value="history">
                  <PaymentHistory />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <PaymentInfo />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Payment;
