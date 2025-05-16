
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const PaymentSecurityCard = () => {
  return (
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
  );
};

function Check(props: any) {
  return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M20 6 9 17l-5-5"/></svg>
}
