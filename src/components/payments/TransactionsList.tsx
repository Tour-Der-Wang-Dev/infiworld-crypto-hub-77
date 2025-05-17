
import { useState } from "react";
import { usePaymentData } from "@/hooks/use-payment-data";
import { TransactionCard } from "./TransactionCard";
import { TransactionsListProps } from "./types";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";

export const TransactionsList = ({
  limit = 10,
  showRefreshButton = true,
  className = "",
  filterType,
  showEscrowOnly = false
}: TransactionsListProps) => {
  const {
    transactions,
    isLoading,
    fetchTransactions,
    handleRequestRefund,
    handleReleaseEscrow,
    canRequestRefund,
    canReleaseEscrow
  } = usePaymentData({
    initialLimit: limit,
    filterType,
    showEscrowOnly
  });
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchTransactions();
    setIsRefreshing(false);
  };

  // Auto-refresh when component mounts
  useEffect(() => {
    fetchTransactions();
    // We could add an interval here for periodic refreshes
    // const interval = setInterval(fetchTransactions, 60000);
    // return () => clearInterval(interval);
  }, [filterType, showEscrowOnly]);

  if (isLoading && transactions.length === 0) {
    return (
      <div className="py-8 text-center">
        <div className="animate-spin h-8 w-8 border-t-2 border-primary border-r-2 rounded-full mx-auto mb-4"></div>
        <p className="text-muted-foreground">กำลังโหลดข้อมูลธุรกรรม...</p>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="py-8 text-center border rounded-lg">
        <p className="text-muted-foreground mb-4">ไม่พบข้อมูลธุรกรรม</p>
        {showRefreshButton && (
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
            รีเฟรช
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className={className}>
      {showRefreshButton && (
        <div className="flex justify-end mb-4">
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
            รีเฟรช
          </Button>
        </div>
      )}

      <div className="space-y-4">
        {transactions.map((transaction) => (
          <TransactionCard
            key={transaction.id}
            transaction={transaction}
            onRequestRefund={() => handleRequestRefund(transaction.id)}
            onReleaseEscrow={() => handleReleaseEscrow(transaction.id)}
            canRequestRefund={canRequestRefund(transaction)}
            canReleaseEscrow={canReleaseEscrow(transaction)}
          />
        ))}
      </div>
    </div>
  );
};
