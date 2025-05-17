
import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useAuth } from "@/hooks/use-auth";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { TransactionsList } from "@/components/payments/TransactionsList";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PaymentType } from "@/components/payments/types";

const Transactions = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<string>("all");

  useEffect(() => {
    // Scroll to top when page loads
    window.scrollTo(0, 0);
  }, []);

  if (!user) {
    // Redirect to login or show message
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardContent className="pt-6">
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold">กรุณาเข้าสู่ระบบ</h2>
                <p className="text-muted-foreground">
                  คุณต้องเข้าสู่ระบบเพื่อดูประวัติธุรกรรมของคุณ
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
        <title>ประวัติธุรกรรม | INFIWORLD</title>
        <meta name="description" content="ดูประวัติธุรกรรมการเงินของคุณบน INFIWORLD" />
        <meta name="keywords" content="INFIWORLD ชำระเงิน, ประวัติธุรกรรม, คริปโต, ธุรกรรมออนไลน์" />
      </Helmet>

      <Navbar />
      <div className="flex-grow p-4 md:p-8 bg-gray-50">
        <div className="container mx-auto max-w-7xl">
          <h1 className="text-3xl font-bold mb-6">ประวัติธุรกรรม</h1>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>ธุรกรรมของฉัน</CardTitle>
              <CardDescription>
                รายละเอียดธุรกรรมการเงินทั้งหมดของบัญชีคุณ
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="mb-6">
                  <TabsTrigger value="all">ทั้งหมด</TabsTrigger>
                  <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
                  <TabsTrigger value="freelance">Freelance</TabsTrigger>
                  <TabsTrigger value="reservation">การจอง</TabsTrigger>
                  <TabsTrigger value="escrow">Escrow</TabsTrigger>
                </TabsList>

                <TabsContent value="all">
                  <TransactionsList />
                </TabsContent>
                
                <TabsContent value="marketplace">
                  <TransactionsList filterType="marketplace" />
                </TabsContent>
                
                <TabsContent value="freelance">
                  <TransactionsList filterType="freelance" />
                </TabsContent>
                
                <TabsContent value="reservation">
                  <TransactionsList filterType="reservation" />
                </TabsContent>
                
                <TabsContent value="escrow">
                  <TransactionsList showEscrowOnly={true} />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>คำถามที่พบบ่อย</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium">การขอคืนเงินทำอย่างไร?</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      คุณสามารถกดปุ่ม "ขอคืนเงิน" ในธุรกรรมที่มีสิทธิ์ขอคืนเงินได้ เราจะดำเนินการภายใน 3-5 วันทำการ
                    </p>
                  </div>
                  <div>
                    <h3 className="font-medium">Escrow คืออะไร?</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Escrow คือบริการพักเงินที่ช่วยให้การซื้อขายปลอดภัย เงินจะถูกโอนให้ผู้ขายเมื่อผู้ซื้อยืนยันว่าได้รับสินค้าหรือบริการแล้ว
                    </p>
                  </div>
                  <div>
                    <h3 className="font-medium">ทำไมไม่เห็นธุรกรรมล่าสุด?</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      ธุรกรรมใหม่อาจใช้เวลา 1-2 นาทีในการปรากฎในระบบ กรุณากดรีเฟรชหากต้องการดูข้อมูลล่าสุด
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>นโยบายการชำระเงิน</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium">วิธีการชำระเงินที่รองรับ</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      บัตรเครดิต/เดบิต, คริปโตเคอเรนซี่ (BTC, ETH, USDT), และ PromptPay
                    </p>
                  </div>
                  <div>
                    <h3 className="font-medium">ค่าธรรมเนียม</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      บัตรเครดิต/เดบิต: 3%<br />
                      คริปโต: 1%<br />
                      PromptPay: ฟรี<br />
                      Escrow: 2%
                    </p>
                  </div>
                  <div>
                    <h3 className="font-medium">ความปลอดภัย</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      ระบบการชำระเงินของเราได้รับการรับรองตามมาตรฐาน PCI DSS และเข้ารหัสข้อมูลทั้งหมด
                    </p>
                  </div>
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

export default Transactions;
