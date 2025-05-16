
import { useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PaymentForm } from "@/components/payments/PaymentForm";
import { AlertCircle, CreditCard, Wallet, QrCode } from "lucide-react";
import { PaymentType } from "@/constants/paymentTypes";

interface PaymentDemoProps {
  paymentAmount: number;
  setPaymentAmount: (amount: number) => void;
  paymentType: PaymentType;
  setPaymentType: (type: PaymentType) => void;
  showPaymentForm: boolean;
  setShowPaymentForm: (show: boolean) => void;
  paymentComplete: boolean;
  setPaymentComplete: (complete: boolean) => void;
  handleStartPayment: () => void;
  handlePaymentSubmit: (method: string, useEscrow: boolean) => Promise<void>;
  isProcessing: boolean;
  setActiveTab: (tab: string) => void;
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
  return (
    <>
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
                      {type}
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
    </>
  );
};
