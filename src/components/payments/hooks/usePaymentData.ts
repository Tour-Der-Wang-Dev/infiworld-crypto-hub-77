
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import { Transaction, PaymentType } from "@/components/payments/types";
import { formatTransactionData } from "@/utils/payment-utils";

export const usePaymentData = (initialLimit?: number) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  // Fetch transactions with optional caching
  const fetchTransactions = async () => {
    if (!user) return;
    
    setIsLoading(true);
    
    try {
      // In real implementation, we'd fetch from Supabase
      // For now, we'll use mock data since the table schema doesn't match exactly
      const mockData = [
        {
          id: `pay-${Date.now()}-1`,
          amount: 1000,
          currency: "THB",
          payment_method: "card",
          payment_status: "completed",
          related_type: "marketplace" as PaymentType,
          related_id: "mock-item-1",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          receipt_url: null,
          refund_status: null,
          refunded_amount: null,
          escrow_transactions: [
            {
              id: `escrow-${Date.now()}-1`,
              payment_id: `pay-${Date.now()}-1`,
              buyer_id: user.id,
              seller_id: "seller-1",
              escrow_status: "initiated",
              contract_details: { item: "Product 1" },
              release_conditions: "Product delivery",
              release_date: null
            }
          ]
        }
      ];
      
      // Transform the mock data to match our Transaction type
      const formattedData = formatTransactionData(mockData);
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

  // Handle requesting a refund
  const handleRequestRefund = async (transactionId: string) => {
    if (!user) return;
    
    try {
      toast.loading("กำลังดำเนินการขอคืนเงิน...");
      
      // In a real implementation, we'd update Supabase
      // For now, we'll just simulate success
      await new Promise(resolve => setTimeout(resolve, 1000));
      
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
  
  // Helper functions
  const canRequestRefund = (transaction: Transaction) => {
    return transaction.payment_status === 'completed' && 
      !transaction.refund_status &&
      !transaction.escrow;
  };

  const canReleaseEscrow = (transaction: Transaction) => {
    if (!user) return false;
    return !!transaction.escrow && 
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
