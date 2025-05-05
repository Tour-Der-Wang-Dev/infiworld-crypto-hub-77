
import React, { useState } from "react";
import { usePaymentData } from "@/hooks/usePaymentData";
import { TransactionCard } from "@/components/payments/TransactionCard";
import { PaymentType } from "@/components/payments/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { RefreshCcw, Search, Calendar } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState<string>("all");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  
  const {
    transactions,
    isLoading,
    fetchTransactions,
    handleRequestRefund,
    handleReleaseEscrow,
    user
  } = usePaymentData({
    initialLimit: limit,
    filterType,
    showEscrowOnly
  });

  // Filter and sort transactions based on user selections
  const filteredTransactions = transactions
    .filter(tx => {
      // Apply search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          tx.payment_method.toLowerCase().includes(query) ||
          tx.related_type.toLowerCase().includes(query) ||
          tx.id.toLowerCase().includes(query)
        );
      }
      return true;
    })
    .filter(tx => {
      // Apply date filter
      if (dateFilter === "today") {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const txDate = new Date(tx.created_at);
        return txDate >= today;
      } else if (dateFilter === "week") {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        const txDate = new Date(tx.created_at);
        return txDate >= weekAgo;
      } else if (dateFilter === "month") {
        const monthAgo = new Date();
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        const txDate = new Date(tx.created_at);
        return txDate >= monthAgo;
      }
      return true;
    })
    .sort((a, b) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
    });

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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
        <h3 className="text-lg font-semibold">ธุรกรรมทั้งหมด {filteredTransactions.length} รายการ</h3>
        <div className="flex w-full md:w-auto flex-wrap gap-2">
          <div className="relative w-full md:w-auto">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="ค้นหาธุรกรรม..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 w-full md:w-[200px]"
            />
          </div>
          
          <Select value={dateFilter} onValueChange={setDateFilter}>
            <SelectTrigger className="w-[140px]">
              <Calendar className="mr-2 h-4 w-4" />
              <SelectValue placeholder="ช่วงเวลา" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">ทั้งหมด</SelectItem>
              <SelectItem value="today">วันนี้</SelectItem>
              <SelectItem value="week">7 วันล่าสุด</SelectItem>
              <SelectItem value="month">เดือนนี้</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={sortOrder} onValueChange={(value) => setSortOrder(value as "asc" | "desc")}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="เรียงลำดับ" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="desc">ล่าสุดก่อน</SelectItem>
              <SelectItem value="asc">เก่าที่สุดก่อน</SelectItem>
            </SelectContent>
          </Select>
          
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => fetchTransactions()}
          >
            <RefreshCcw className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="space-y-4">
        {filteredTransactions.map((transaction) => (
          <TransactionCard
            key={transaction.id}
            transaction={transaction}
            onRequestRefund={handleRequestRefund}
            onReleaseEscrow={handleReleaseEscrow}
            userId={user?.id}
          />
        ))}
      </div>
    </div>
  );
};
