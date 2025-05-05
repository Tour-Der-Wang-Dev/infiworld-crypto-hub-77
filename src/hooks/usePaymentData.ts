
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import { Transaction, PaymentType } from "@/components/payments/types";
import { formatTransactionData, requestRefund, canRequestRefund, canReleaseEscrow } from "@/utils/payment-utils";

interface UsePaymentDataProps {
  initialLimit?: number;
  filterType?: PaymentType;
  showEscrowOnly?: boolean;
}

/**
 * Custom hook to fetch and manage payment transaction data
 */
export const usePaymentData = ({ 
  initialLimit = 100,
  filterType,
  showEscrowOnly = false 
}: UsePaymentDataProps = {}) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuth();

  /**
   * Fetch transactions from Supabase with optional filtering
   */
  const fetchTransactions = useCallback(async () => {
    if (!user) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Build query with appropriate filters
      let query = supabase
        .from("payments")
        .select(`
          *,
          escrow_transactions(*)
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      
      // Apply filter by payment type if specified
      if (filterType) {
        query = query.eq("related_type", filterType);
      }
      
      // Apply escrow filter if specified
      if (showEscrowOnly) {
        query = query.not("escrow_transactions", "is", null);
      }
      
      // Apply limit
      query = query.limit(initialLimit);
      
      const { data, error } = await query;
        
      if (error) throw error;
      
      // Process and set transaction data
      const formattedData = formatTransactionData(data || []);
      setTransactions(formattedData);
    } catch (error: any) {
      console.error("Error fetching transactions:", error);
      setError(error instanceof Error ? error : new Error("Failed to fetch transactions"));
      toast.error("ไม่สามารถดึงข้อมูลธุรกรรมได้", {
        description: "กรุณาลองใหม่อีกครั้ง"
      });
    } finally {
      setIsLoading(false);
    }
  }, [user, initialLimit, filterType, showEscrowOnly]);

  /**
   * Handle requesting a refund for a transaction
   */
  const handleRequestRefund = useCallback(async (transactionId: string) => {
    if (!user) return;
    
    try {
      toast.loading("กำลังดำเนินการขอคืนเงิน...");
      
      const { success, error } = await requestRefund(transactionId);
      
      if (!success) throw error;
      
      toast.dismiss();
      toast.success("ส่งคำขอคืนเงินเรียบร้อยแล้ว", {
        description: "เจ้าหน้าที่จะตรวจสอบคำขอและดำเนินการต่อไป"
      });
      
      // Refresh transactions list
      await fetchTransactions();
    } catch (error) {
      toast.dismiss();
      console.error("Error requesting refund:", error);
      toast.error("ไม่สามารถส่งคำขอคืนเงินได้", {
        description: "กรุณาลองใหม่อีกครั้ง"
      });
    }
  }, [user, fetchTransactions]);
  
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
    canRequestRefund,
    canReleaseEscrow: (transaction: Transaction) => canReleaseEscrow(transaction, user?.id),
    user
  };
};
