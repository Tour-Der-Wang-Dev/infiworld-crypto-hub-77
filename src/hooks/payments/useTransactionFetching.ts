
import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Transaction, PaymentType } from "@/components/payments/types";
import { UsePaymentDataProps, PaymentDataState } from "./types";

export const useTransactionFetching = ({ 
  initialLimit = 100,
  filterType,
  showEscrowOnly = false 
}: UsePaymentDataProps = {}) => {
  const [state, setState] = useState<PaymentDataState>({
    transactions: [],
    isLoading: false,
    error: null
  });
  
  const fetchTransactions = useCallback(async (userId: string | undefined) => {
    if (!userId) return;
    
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      // Base query
      let query = supabase
        .from("transactions")
        .select(`
          *,
          escrow_transactions(*)
        `)
        .eq("user_id", userId)
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
      
      setState({
        transactions: formattedTransactions,
        isLoading: false,
        error: null
      });
    } catch (error: any) {
      console.error("Error fetching transactions:", error);
      const errorObj = error instanceof Error ? error : new Error("Failed to fetch transactions");
      setState(prev => ({ 
        ...prev, 
        error: errorObj, 
        isLoading: false 
      }));
      
      toast.error("ไม่สามารถดึงข้อมูลธุรกรรมได้", {
        description: "กรุณาลองใหม่อีกครั้ง"
      });
    }
  }, [filterType, showEscrowOnly, initialLimit]);
  
  return {
    ...state,
    fetchTransactions
  };
};
