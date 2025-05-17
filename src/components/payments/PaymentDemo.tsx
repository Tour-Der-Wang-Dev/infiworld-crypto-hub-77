
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { PaymentForm } from "./PaymentForm";
import { EscrowInfoCard } from "./EscrowInfoCard";
import { Switch } from "@/components/ui/switch";
import { PaymentType } from "@/constants/paymentTypes";

interface PaymentDemoProps {
  paymentAmount: number;
  setPaymentAmount: React.Dispatch<React.SetStateAction<number>>;
  paymentType: PaymentType;
  setPaymentType: React.Dispatch<React.SetStateAction<PaymentType>>;
  showPaymentForm: boolean;
  setShowPaymentForm: React.Dispatch<React.SetStateAction<boolean>>;
  paymentComplete: boolean;
  setPaymentComplete: React.Dispatch<React.SetStateAction<boolean>>;
  handleStartPayment: () => void;
  handlePaymentSubmit: (method: string, useEscrow: boolean) => Promise<void>;
  isProcessing: boolean;
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
}

export const PaymentDemo = ({
  paymentAmount,
  setPaymentAmount,
  paymentType,
  setPaymentType,
  showPaymentForm,
  setShowPaymentForm,
  paymentComplete,
  setPaymentComplete,
  handleStartPayment,
  handlePaymentSubmit,
  isProcessing,
  setActiveTab
}: PaymentDemoProps) => {
  const [useEscrow, setUseEscrow] = useState(false);
  const [sellerInfo, setSellerInfo] = useState({
    id: "seller-123",
    name: "ผู้ขายตัวอย่าง",
    rating: 4.8
  });

  // Reset escrow option when payment type changes
  useEffect(() => {
    if (paymentType !== PaymentType.MARKETPLACE) {
      setUseEscrow(false);
    }
  }, [paymentType]);

  if (paymentComplete) {
    return (
      <div className="mt-4 p-6 border rounded-lg bg-green-50 text-center">
        <h3 className="text-xl font-bold text-green-800 mb-4">การชำระเงินสำเร็จ</h3>
        <p className="mb-4">ขอบคุณสำหรับการชำระเงิน คุณสามารถดูรายละเอียดธุรกรรมได้ในประวัติ</p>
        <Button 
          onClick={() => {
            setPaymentComplete(false);
            setActiveTab("history");
          }}
          className="bg-green-600 hover:bg-green-700"
        >
          ดูประวัติธุรกรรม
        </Button>
      </div>
    );
  }
  
  if (showPaymentForm) {
    return (
      <div className="mt-4">
        <PaymentForm 
          amount={paymentAmount}
          paymentType={paymentType}
          relatedId={`demo-${Date.now()}`}
          useEscrow={useEscrow}
          sellerId={useEscrow ? sellerInfo.id : undefined}
          onSuccess={() => {
            setShowPaymentForm(false);
            setPaymentComplete(true);
          }}
          buttonText="ชำระเงินตัวอย่าง"
        />
        
        <div className="mt-4 text-center">
          <Button variant="outline" onClick={() => setShowPaymentForm(false)}>
            ยกเลิก
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="amount">จำนวนเงิน (THB)</Label>
              <Input
                id="amount"
                type="number"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(Number(e.target.value))}
                min={1}
              />
            </div>
            
            <div>
              <Label className="mb-2 block">ประเภทการชำระเงิน</Label>
              <RadioGroup defaultValue={paymentType} onValueChange={(v) => setPaymentType(v as PaymentType)}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value={PaymentType.MARKETPLACE} id="marketplace" />
                  <Label htmlFor="marketplace">สินค้าจากตลาดซื้อขาย</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value={PaymentType.FREELANCE} id="freelance" />
                  <Label htmlFor="freelance">บริการฟรีแลนซ์</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value={PaymentType.RESERVATION} id="reservation" />
                  <Label htmlFor="reservation">การจองและท่องเที่ยว</Label>
                </div>
              </RadioGroup>
            </div>
            
            {paymentType === PaymentType.MARKETPLACE && (
              <div className="flex items-center space-x-2">
                <Switch
                  id="escrow"
                  checked={useEscrow}
                  onCheckedChange={setUseEscrow}
                />
                <Label htmlFor="escrow">ใช้บริการ Escrow (ระบบพักเงิน)</Label>
              </div>
            )}
            
            <Button 
              onClick={handleStartPayment}
              className="w-full mt-4"
              disabled={paymentAmount <= 0 || isProcessing}
            >
              ดำเนินการชำระเงินตัวอย่าง
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {useEscrow && <EscrowInfoCard />}
    </div>
  );
};
