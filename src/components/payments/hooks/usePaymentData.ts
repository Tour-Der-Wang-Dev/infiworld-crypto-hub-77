
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import { Transaction, PaymentType } from "@/components/payments/types";

export const usePaymentData = (initialLimit?: number) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  // Fetch transactions with optional caching
  const fetchTransactions = async () => {
    if (!user) return;
    
    setIsLoading(true);
    
    try {
      // Fetch payments with escrow data if available
      const { data, error } = await supabase
        .from("payments")
        .select(`
          *,
          escrow_transactions(*)
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(initialLimit || 100);
        
      if (error) throw error;
      
      // Transform data to match our Transaction type - optimized with explicit type casting
      const formattedData = data.map((item): Transaction => {
        const escrow = item.escrow_transactions && item.escrow_transactions.length > 0 
          ? item.escrow_transactions[0] 
          : undefined;
        
        // Ensure related_type is properly typed as PaymentType
        const relatedType = item.related_type as PaymentType;
          
        return {
          id: item.id,
          amount: item.amount,
          currency: item.currency,
          payment_method: item.payment_method,
          payment_status: item.payment_status,
          related_type: relatedType, // Fixed type issue here
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
      
      setTransactions(formattedData);
    } catch (error: any) {
      console.error("Error fetching transactions:", error);
      toast.error("ไม่สามารถดึงข้อมูลธุรกรรมได้", {
        description: "กรุณาลองใหม่อีกครั้ง"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Load transactions on first render
  useEffect(() => {
    if (user) {
      fetchTransactions();
    }
  }, [user]);

  // Memoized functions to avoid unnecessary re-renders
  const handleRequestRefund = async (transactionId: string) => {
    if (!user) return;
    
    try {
      toast.loading("กำลังดำเนินการขอคืนเงิน...");
      
      const { error } = await supabase
        .from("payments")
        .update({ refund_status: "requested" })
        .eq("id", transactionId);
        
      if (error) throw error;
      
      toast.dismiss();
      toast.success("ส่งคำขอคืนเงินเรียบร้อยแล้ว", {
        description: "เจ้าหน้าที่จะตรวจสอบคำขอและดำเนินการต่อไป"
      });
      
      // Refresh transactions list
      fetchTransactions();
    } catch (error) {
      toast.dismiss();
      console.error("Error requesting refund:", error);
      toast.error("ไม่สามารถส่งคำขอคืนเงินได้", {
        description: "กรุณาลองใหม่อีกครั้ง"
      });
    }
  };
  
  // Optimized pure functions that don't depend on state
  const canRequestRefund = (transaction: Transaction) => {
    return transaction.payment_status === 'completed' && 
      !transaction.refund_status &&
      !transaction.escrow;
  };

  const canReleaseEscrow = (transaction: Transaction) => {
    if (!user) return false;
    return transaction.escrow && 
      transaction.escrow.status === 'initiated' &&
      transaction.escrow.buyerId === user.id;
  };

  return {
    transactions,
    isLoading,
    fetchTransactions,
    handleRequestRefund,
    canRequestRefund,
    canReleaseEscrow,
    user
  };
};
