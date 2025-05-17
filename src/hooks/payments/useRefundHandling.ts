
import { useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Transaction } from "@/components/payments/types";

export const useRefundHandling = (onRefundComplete: () => Promise<void>) => {
  const handleRequestRefund = useCallback(async (transactionId: string, userId: string | undefined) => {
    if (!userId) return;
    
    try {
      toast.loading("กำลังดำเนินการขอคืนเงิน...");
      
      // In a real implementation, we'd call an edge function to handle this
      // and update the transaction record in the database
      const { error } = await supabase
        .from("transactions")
        .update({ 
          refund_status: "requested",
          updated_at: new Date().toISOString()
        })
        .eq("id", transactionId)
        .eq("user_id", userId);
      
      if (error) throw error;
      
      toast.dismiss();
      toast.success("ส่งคำขอคืนเงินเรียบร้อยแล้ว", {
        description: "เจ้าหน้าที่จะตรวจสอบคำขอและดำเนินการต่อไป"
      });
      
      // Refresh transactions list
      await onRefundComplete();
    } catch (error: any) {
      toast.dismiss();
      console.error("Error requesting refund:", error);
      toast.error("ไม่สามารถส่งคำขอคืนเงินได้", {
        description: "กรุณาลองใหม่อีกครั้ง"
      });
    }
  }, [onRefundComplete]);
  
  const canRequestRefund = useCallback((transaction: Transaction) => {
    return transaction.payment_status === 'completed' && 
      !transaction.refund_status &&
      !transaction.escrow;
  }, []);

  return {
    handleRequestRefund,
    canRequestRefund
  };
};
