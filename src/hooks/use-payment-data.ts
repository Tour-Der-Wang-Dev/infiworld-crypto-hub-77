
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import { Transaction, PaymentType } from "@/components/payments/types";

interface UsePaymentDataProps {
  initialLimit?: number;
  filterType?: PaymentType;
  showEscrowOnly?: boolean;
}

export const usePaymentData = ({ 
  initialLimit = 100,
  filterType,
  showEscrowOnly = false 
}: UsePaymentDataProps = {}) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuth();

  const fetchTransactions = useCallback(async () => {
    if (!user) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Base query
      let query = supabase
        .from("transactions")
        .select(`
          *,
          escrow_transactions(*)
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(initialLimit);
      
      // Apply filters
      if (filterType) {
        query = query.eq("related_type", filterType);
      }
      
      if (showEscrowOnly) {
        // This requires a join, but we're already getting escrow data
        query = query.not("escrow_transactions", "is", null);
      }
      
      const { data, error: fetchError } = await query;
      
      if (fetchError) throw fetchError;
      
      // Transform the data to match our Transaction interface
      const formattedTransactions: Transaction[] = data.map((item: any): Transaction => {
        const escrow = item.escrow_transactions && item.escrow_transactions.length > 0 
          ? item.escrow_transactions[0] 
          : undefined;
          
        return {
          id: item.id,
          amount: item.amount,
          currency: item.currency,
          payment_method: item.payment_method,
          payment_status: item.payment_status,
          related_type: item.related_type,
          related_id: item.related_id,
          created_at: item.created_at,
          updated_at: item.updated_at,
          receipt_url: item.receipt_url,
          refund_status: item.refund_status,
          refunded_amount: item.refunded_amount,
          escrow: escrow ? {
            id: escrow.id,
            paymentId: escrow.payment_id,
            buyerId: escrow.buyer_id,
            sellerId: escrow.seller_id,
            status: escrow.escrow_status,
            contractDetails: escrow.contract_details,
            releaseConditions: escrow.release_conditions,
            releaseDate: escrow.release_date ? new Date(escrow.release_date) : undefined
          } : undefined
        };
      });
      
      setTransactions(formattedTransactions);
    } catch (error: any) {
      console.error("Error fetching transactions:", error);
      setError(error instanceof Error ? error : new Error("Failed to fetch transactions"));
      toast.error("ไม่สามารถดึงข้อมูลธุรกรรมได้", {
        description: "กรุณาลองใหม่อีกครั้ง"
      });
    } finally {
      setIsLoading(false);
    }
  }, [user, filterType, showEscrowOnly, initialLimit]);
  
  const handleRequestRefund = useCallback(async (transactionId: string) => {
    if (!user) return;
    
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
        .eq("user_id", user.id);
      
      if (error) throw error;
      
      toast.dismiss();
      toast.success("ส่งคำขอคืนเงินเรียบร้อยแล้ว", {
        description: "เจ้าหน้าที่จะตรวจสอบคำขอและดำเนินการต่อไป"
      });
      
      // Refresh transactions list
      await fetchTransactions();
    } catch (error: any) {
      toast.dismiss();
      console.error("Error requesting refund:", error);
      toast.error("ไม่สามารถส่งคำขอคืนเงินได้", {
        description: "กรุณาลองใหม่อีกครั้ง"
      });
    }
  }, [user, fetchTransactions]);
  
  const handleReleaseEscrow = useCallback(async (transactionId: string) => {
    if (!user) return;
    
    try {
      toast.loading("กำลังดำเนินการปล่อยเงิน Escrow...");
      
      // Find the escrow record related to this transaction
      const { data: escrowData, error: escrowFetchError } = await supabase
        .from("escrow_transactions")
        .select("id")
        .eq("payment_id", transactionId)
        .eq("buyer_id", user.id)
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
      await fetchTransactions();
    } catch (error: any) {
      toast.dismiss();
      console.error("Error releasing escrow:", error);
      toast.error("ไม่สามารถปล่อยเงิน Escrow ได้", {
        description: error.message || "กรุณาลองใหม่อีกครั้ง"
      });
    }
  }, [user, fetchTransactions]);
  
  // Helper functions
  const canRequestRefund = useCallback((transaction: Transaction) => {
    return transaction.payment_status === 'completed' && 
      !transaction.refund_status &&
      !transaction.escrow;
  }, []);

  const canReleaseEscrow = useCallback((transaction: Transaction) => {
    if (!user) return false;
    return !!transaction.escrow && 
      transaction.escrow.status === 'initiated' &&
      transaction.escrow.buyerId === user.id;
  }, [user]);
  
  // Load transactions on first render
  useEffect(() => {
    if (user) {
      fetchTransactions();
    }
  }, [user, fetchTransactions]);

  return {
    transactions,
    isLoading,
    error,
    fetchTransactions,
    handleRequestRefund,
    handleReleaseEscrow,
    canRequestRefund,
    canReleaseEscrow,
  };
};
