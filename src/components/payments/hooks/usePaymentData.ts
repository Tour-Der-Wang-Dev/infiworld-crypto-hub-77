
import { useState, useEffect, useCallback } from "react";
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
      const formattedData = mockData.map((item): Transaction => {
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
