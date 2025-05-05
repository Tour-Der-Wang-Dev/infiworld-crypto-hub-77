
import React from "react";
import { usePaymentData } from "@/hooks/usePaymentData";
import { TransactionCard } from "@/components/payments/TransactionCard";
import { PaymentType } from "@/components/payments/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";

interface TransactionsListProps {
  filterType?: PaymentType;
  showEscrowOnly?: boolean;
  limit?: number;
}

/**
 * Displays a list of transactions with optional filtering
 */
export const TransactionsList: React.FC<TransactionsListProps> = ({
  filterType,
  showEscrowOnly = false,
  limit = 100
}) => {
  const {
    transactions,
    isLoading,
    fetchTransactions,
    handleRequestRefund,
    user
  } = usePaymentData({
    initialLimit: limit,
    filterType,
    showEscrowOnly
  });

  // Handle escrow release - this would be implemented in a real application
  const handleReleaseEscrow = (transactionId: string) => {
    console.log("Releasing escrow for transaction:", transactionId);
    // Implementation would go here
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-32 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="text-center py-8 bg-gray-50 rounded-lg">
        <p className="text-infi-gray mb-2">ไม่พบข้อมูลธุรกรรม</p>
        <Button 
          variant="outline" 
          size="sm" 
          className="mt-2"
          onClick={() => fetchTransactions()}
        >
          <RefreshCcw className="mr-2 h-4 w-4" /> รีเฟรช
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">ธุรกรรมทั้งหมด {transactions.length} รายการ</h3>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => fetchTransactions()}
        >
          <RefreshCcw className="mr-2 h-4 w-4" /> รีเฟรช
        </Button>
      </div>
      
      <div className="space-y-4">
        {transactions.map((transaction) => (
          <TransactionCard
            key={transaction.id}
            transaction={transaction}
            onRequestRefund={handleRequestRefund}
            onReleaseEscrow={showEscrowOnly ? handleReleaseEscrow : undefined}
            userId={user?.id}
          />
        ))}
      </div>
    </div>
  );
};
