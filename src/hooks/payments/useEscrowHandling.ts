
import { useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Transaction } from "@/components/payments/types";

export const useEscrowHandling = (onEscrowComplete: () => Promise<void>) => {
  const handleReleaseEscrow = useCallback(async (transactionId: string, userId: string | undefined) => {
    if (!userId) return;
    
    try {
      toast.loading("กำลังดำเนินการปล่อยเงิน Escrow...");
      
      // Find the escrow record related to this transaction
      const { data: escrowData, error: escrowFetchError } = await supabase
        .from("escrow_transactions")
        .select("id")
        .eq("payment_id", transactionId)
        .eq("buyer_id", userId)
        .single();
      
      if (escrowFetchError) throw escrowFetchError;
      
      if (!escrowData) {
        throw new Error("ไม่พบข้อมูล Escrow ที่เกี่ยวข้อง");
      }
      
      // Update the escrow record
      const { error: updateError } = await supabase
        .from("escrow_transactions")
        .update({ 
          escrow_status: "released",
          release_date: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq("id", escrowData.id);
      
      if (updateError) throw updateError;
      
      toast.dismiss();
      toast.success("ปล่อยเงิน Escrow เรียบร้อยแล้ว", {
        description: "เงินได้ถูกโอนให้ผู้ขายเรียบร้อยแล้ว"
      });
      
      // Refresh transactions list
      await onEscrowComplete();
    } catch (error: any) {
      toast.dismiss();
      console.error("Error releasing escrow:", error);
      toast.error("ไม่สามารถปล่อยเงิน Escrow ได้", {
        description: error.message || "กรุณาลองใหม่อีกครั้ง"
      });
    }
  }, [onEscrowComplete]);
  
  const canReleaseEscrow = useCallback((transaction: Transaction, userId: string | undefined) => {
    if (!userId) return false;
    return !!transaction.escrow && 
      transaction.escrow.status === 'initiated' &&
      transaction.escrow.buyerId === userId;
  }, []);

  return {
    handleReleaseEscrow,
    canReleaseEscrow
  };
};
