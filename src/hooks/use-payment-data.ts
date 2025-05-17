
import { useEffect, useCallback } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Transaction, PaymentType } from "@/components/payments/types";
import { useTransactionFetching } from "./payments/useTransactionFetching";
import { useRefundHandling } from "./payments/useRefundHandling";
import { useEscrowHandling } from "./payments/useEscrowHandling";

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
  const { user } = useAuth();
  const { transactions, isLoading, error, fetchTransactions } = useTransactionFetching({
    initialLimit,
    filterType,
    showEscrowOnly
  });
  
  const refreshTransactions = useCallback(async () => {
    return fetchTransactions(user?.id);
  }, [fetchTransactions, user?.id]);
  
  const { handleRequestRefund, canRequestRefund } = useRefundHandling(refreshTransactions);
  const { handleReleaseEscrow, canReleaseEscrow } = useEscrowHandling(refreshTransactions);

  // Load transactions on first render
  useEffect(() => {
    if (user) {
      fetchTransactions(user.id);
    }
  }, [user, fetchTransactions]);

  return {
    transactions,
    isLoading,
    error,
    fetchTransactions: refreshTransactions,
    handleRequestRefund: (transactionId: string) => handleRequestRefund(transactionId, user?.id),
    handleReleaseEscrow: (transactionId: string) => handleReleaseEscrow(transactionId, user?.id),
    canRequestRefund,
    canReleaseEscrow: (transaction: Transaction) => canReleaseEscrow(transaction, user?.id),
  };
};
