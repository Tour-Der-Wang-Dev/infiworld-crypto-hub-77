
import { AuthNavbar } from "@/components/layout/AuthNavbar";
import { TransactionsList } from "@/components/payments/TransactionsList";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Helmet } from "react-helmet-async";

const Transactions = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>My Transactions | INFIWORLD</title>
        <link rel="canonical" href="/my-transactions" />
      </Helmet>
      <AuthNavbar />
      
      <main className="container mx-auto p-4 py-8">
        <h1 className="text-3xl font-bold mb-6">บัญชีและธุรกรรมของฉัน</h1>
        
        <Tabs defaultValue="transactions">
          <TabsList className="mb-6">
            <TabsTrigger value="transactions">ธุรกรรมทั้งหมด</TabsTrigger>
            <TabsTrigger value="escrow">Escrow</TabsTrigger>
            <TabsTrigger value="refunds">การคืนเงิน</TabsTrigger>
          </TabsList>
          
          <TabsContent value="transactions">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">ยอดชำระเงินทั้งหมด</CardTitle>
                  <CardDescription>รวมทุกประเภทธุรกรรม</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">฿0</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">ธุรกรรมที่รอดำเนินการ</CardTitle>
                  <CardDescription>รอการยืนยันหรือดำเนินการ</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">0</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">การคืนเงิน</CardTitle>
                  <CardDescription>ยอดรวมการคืนเงิน</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">฿0</p>
                </CardContent>
              </Card>
            </div>
            
            <TransactionsList />
          </TabsContent>
          
          <TabsContent value="escrow">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>บัญชี Escrow</CardTitle>
                <CardDescription>
                  บัญชี Escrow ช่วยปกป้องทั้งผู้ซื้อและผู้ขายในธุรกรรมมูลค่าสูง เช่น อสังหาริมทรัพย์และรถยนต์
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-4">
                  เมื่อคุณทำธุรกรรม Escrow ผู้ซื้อจะโอนเงินให้ INFIWORLD เพื่อเก็บไว้ในบัญชี Escrow 
                  เมื่อผู้ซื้อได้รับสินค้าและยืนยันว่าถูกต้อง เงินจะถูกโอนให้ผู้ขาย ช่วยปกป้องทั้งสองฝ่าย
                </p>
                <div className="flex items-center gap-4 mt-4">
                  <div className="text-center flex-1 p-4 border rounded-md bg-gray-50">
                    <h3 className="font-medium text-lg">Escrow ที่รอดำเนินการ</h3>
                    <p className="text-3xl font-bold mt-1">0</p>
                  </div>
                  
                  <div className="text-center flex-1 p-4 border rounded-md bg-gray-50">
                    <h3 className="font-medium text-lg">Escrow ที่สำเร็จแล้ว</h3>
                    <p className="text-3xl font-bold mt-1">0</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <TransactionsList />
          </TabsContent>
          
          <TabsContent value="refunds">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>การขอคืนเงิน</CardTitle>
                <CardDescription>
                  กรณีเกิดปัญหากับธุรกรรม คุณสามารถขอคืนเงินได้ภายใน 7 วันหลังชำระเงิน
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p>
                    นโยบายการคืนเงินของ INFIWORLD:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>การชำระเงินด้วยบัตรเครดิตหรือเดบิต จะคืนเงินกลับไปยังบัตรเดิม</li>
                    <li>การชำระเงินด้วยพร้อมเพย์หรือคริปโต อาจใช้เวลาดำเนินการ 3-5 วันทำการ</li>
                    <li>การซื้อขายที่ใช้บัญชี Escrow ต้องได้รับการยินยอมจากทั้งสองฝ่าย</li>
                  </ul>
                  <p>
                    หากมีข้อสงสัยเกี่ยวกับการขอคืนเงิน กรุณาติดต่อเจ้าหน้าที่ฝ่ายบริการลูกค้า
                  </p>
                  <Button variant="outline">ติดต่อฝ่ายสนับสนุน</Button>
                </div>
              </CardContent>
            </Card>
            
            <TransactionsList />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Transactions;
