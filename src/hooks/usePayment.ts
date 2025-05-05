
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import { PaymentType } from "@/components/payments/types";

interface UsePaymentProps {
  onSuccess?: (paymentId: string) => void;
  onError?: (error: any) => void;
}

interface ProcessPaymentProps {
  amount: number;
  currency?: string;
  method: "card" | "crypto" | "promptpay";
  paymentType: PaymentType;
  relatedId: string;
  useEscrow?: boolean;
  sellerId?: string;
}

export const usePayment = ({ onSuccess, onError }: UsePaymentProps = {}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { user } = useAuth();

  const processPayment = async ({
    amount,
    currency = "THB",
    method,
    paymentType,
    relatedId,
    useEscrow = false,
    sellerId
  }: ProcessPaymentProps) => {
    if (!user) {
      toast.error("กรุณาเข้าสู่ระบบ", {
        description: "คุณต้องเข้าสู่ระบบก่อนทำการชำระเงิน"
      });
      return { success: false };
    }

    if (useEscrow && !sellerId) {
      toast.error("ข้อมูลไม่ครบถ้วน", {
        description: "ต้องระบุข้อมูลผู้ขายสำหรับการใช้งาน Escrow"
      });
      return { success: false };
    }

    setIsProcessing(true);
    
    try {
      toast.loading("กำลังดำเนินการชำระเงิน...");

      // Call the payment processing function
      const { data, error } = await supabase.functions.invoke("process-payment", {
        body: {
          amount,
          currency,
          method,
          paymentType,
          relatedId,
          useEscrow,
          sellerId
        }
      });

      if (error) throw error;
      
      if (!data.success) {
        throw new Error(data.error || "การชำระเงินไม่สำเร็จ");
      }

      toast.dismiss();
      toast.success("การชำระเงินสำเร็จ", {
        description: `ชำระเงินจำนวน ${amount.toLocaleString()} ${currency} เรียบร้อยแล้ว`
      });
      
      if (data.paymentId && onSuccess) {
        onSuccess(data.paymentId);
      }
      
      return { success: true, paymentId: data.paymentId, receiptUrl: data.receiptUrl };
    } catch (error: any) {
      toast.dismiss();
      console.error("Payment error:", error);
      
      const errorMessage = error.message || "กรุณาลองใหม่อีกครั้ง";
      toast.error("เกิดข้อผิดพลาดในการชำระเงิน", { description: errorMessage });
      
      if (onError) {
        onError(error);
      }
      
      return { success: false, error };
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    processPayment,
    isProcessing
  };
};
