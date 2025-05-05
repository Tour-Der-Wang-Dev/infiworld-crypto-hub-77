
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PaymentMethods } from "@/components/payments/PaymentMethods";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import { PaymentModalProps } from "@/components/payments/types";

export function PaymentModal({
  open,
  onClose,
  amount,
  currency = "THB",
  paymentType,
  relatedId,
  onSuccess,
  useEscrow = false,
  sellerId
}: PaymentModalProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const { user } = useAuth();

  const handlePaymentSubmit = async (method: string) => {
    if (!user) {
      toast.error("กรุณาเข้าสู่ระบบ", {
        description: "คุณต้องเข้าสู่ระบบก่อนทำการชำระเงิน"
      });
      return;
    }

    setIsProcessing(true);
    
    try {
      // Create payment record in database
      const { data: paymentData, error: paymentError } = await supabase
        .from("payments")
        .insert({
          user_id: user.id,
          amount,
          currency,
          payment_method: method,
          related_type: paymentType,
          related_id: relatedId,
          payment_details: { timestamp: new Date().toISOString() }
        })
        .select("id")
        .single();

      if (paymentError) throw paymentError;
      
      // If escrow is needed, create escrow transaction
      if (useEscrow && sellerId && paymentData?.id) {
        const { error: escrowError } = await supabase
          .from("escrow_transactions")
          .insert({
            payment_id: paymentData.id,
            buyer_id: user.id,
            seller_id: sellerId,
            release_conditions: "ส่งมอบสินค้าเรียบร้อย",
            contract_details: {
              item_id: relatedId,
              item_type: paymentType,
              created_at: new Date().toISOString()
            }
          });
          
        if (escrowError) throw escrowError;
      }

      // Simulate payment processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update payment status to success
      const { error: updateError } = await supabase
        .from("payments")
        .update({ payment_status: "completed" })
        .eq("id", paymentData?.id);
        
      if (updateError) throw updateError;
      
      toast.success("การชำระเงินสำเร็จ", {
        description: `ชำระเงินจำนวน ${amount.toLocaleString()} ${currency} เรียบร้อยแล้ว`
      });
      
      if (paymentData?.id && onSuccess) {
        onSuccess(paymentData.id);
      }
      
      onClose();
    } catch (error: any) {
      console.error("Payment error:", error);
      toast.error("เกิดข้อผิดพลาดในการชำระเงิน", {
        description: error.message || "กรุณาลองใหม่อีกครั้ง"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle>ชำระเงิน</DialogTitle>
          <DialogDescription>
            กรุณาเลือกวิธีการชำระเงินที่ต้องการ
          </DialogDescription>
        </DialogHeader>
        
        <PaymentMethods
          amount={amount}
          currency={currency}
          onPaymentSubmit={handlePaymentSubmit}
          onCancel={onClose}
          isProcessing={isProcessing}
          paymentType={paymentType}
        />
      </DialogContent>
    </Dialog>
  );
}
