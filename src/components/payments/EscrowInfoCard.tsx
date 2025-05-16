
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const EscrowInfoCard = () => {
  return (
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
  );
};
