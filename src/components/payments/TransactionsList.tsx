
import { useState } from "react";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, RefreshCcw } from "lucide-react";
import { Transaction, TransactionsListProps } from "@/components/payments/types";
import { cn } from "@/lib/utils";
import { EscrowModal } from "@/components/payments/EscrowModal";
import { 
  getPaymentStatusBadge, 
  getTransactionTypeDisplay, 
  getPaymentMethodDisplay,
  formatDate
} from "@/components/payments/utils/formatUtils";
import { usePaymentData } from "@/components/payments/hooks/usePaymentData";

export function TransactionsList({ 
  limit,
  showRefreshButton = true,
  className 
}: TransactionsListProps) {
  const {
    transactions,
    isLoading,
    fetchTransactions,
    handleRequestRefund,
    canRequestRefund,
    canReleaseEscrow,
    user
  } = usePaymentData(limit);
  
  const [escrowModalData, setEscrowModalData] = useState<{
    open: boolean;
    escrowId: string;
    paymentId: string;
    sellerName: string;
    itemName: string;
    amount: number;
  }>({
    open: false,
    escrowId: "",
    paymentId: "",
    sellerName: "",
    itemName: "",
    amount: 0
  });

  const handleOpenEscrowModal = (transaction: Transaction) => {
    if (!transaction.escrow) return;
    
    // In a real app, we would fetch the seller name and item name
    // For this demo, we'll use placeholders
    const sellerName = "ผู้ขาย #" + transaction.escrow.sellerId.substring(0, 6);
    const itemName = transaction.related_type === 'marketplace' 
      ? "รายการใน Marketplace" 
      : "บริการ";
    
    setEscrowModalData({
      open: true,
      escrowId: transaction.escrow.id!,
      paymentId: transaction.id,
      sellerName,
      itemName,
      amount: transaction.amount
    });
  };

  return (
    <>
      <div className={cn("rounded-md border", className)}>
        {showRefreshButton && (
          <div className="flex justify-end p-4">
            <Button
              variant="outline"
              size="sm"
              onClick={fetchTransactions}
              disabled={isLoading}
              className="flex items-center gap-1"
            >
              <RefreshCcw className="h-4 w-4" />
              รีเฟรช
            </Button>
          </div>
        )}
        
        <Table>
          <TableCaption>รายการธุรกรรมการเงินของคุณ</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>วันที่</TableHead>
              <TableHead>ประเภท</TableHead>
              <TableHead>จำนวนเงิน</TableHead>
              <TableHead>วิธีชำระเงิน</TableHead>
              <TableHead>สถานะ</TableHead>
              <TableHead className="text-right">การดำเนินการ</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.length === 0 && !isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  ไม่พบข้อมูลธุรกรรม
                </TableCell>
              </TableRow>
            ) : isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  <div className="flex justify-center items-center">
                    <RefreshCcw className="h-6 w-6 animate-spin" />
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              transactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell className="font-medium">
                    {formatDate(transaction.created_at)}
                  </TableCell>
                  <TableCell>{getTransactionTypeDisplay(transaction.related_type)}</TableCell>
                  <TableCell>
                    {transaction.amount.toLocaleString()} {transaction.currency}
                    {transaction.escrow && (
                      <Badge variant="outline" className="ml-2 text-amber-600">
                        Escrow
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>{getPaymentMethodDisplay(transaction.payment_method)}</TableCell>
                  <TableCell>{getPaymentStatusBadge(transaction.payment_status)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {transaction.receipt_url && (
                        <Button variant="outline" size="sm" asChild>
                          <a href={transaction.receipt_url} target="_blank" rel="noopener noreferrer">
                            <Eye className="h-4 w-4 mr-1" /> ใบเสร็จ
                          </a>
                        </Button>
                      )}
                      
                      {canRequestRefund(transaction) && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleRequestRefund(transaction.id)}
                        >
                          ขอคืนเงิน
                        </Button>
                      )}
                      
                      {canReleaseEscrow(transaction) && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="border-amber-600 text-amber-600 hover:bg-amber-50"
                          onClick={() => handleOpenEscrowModal(transaction)}
                        >
                          ปล่อยเงิน Escrow
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      <EscrowModal
        open={escrowModalData.open}
        onClose={() => setEscrowModalData({...escrowModalData, open: false})}
        escrowId={escrowModalData.escrowId}
        paymentId={escrowModalData.paymentId}
        sellerName={escrowModalData.sellerName}
        itemName={escrowModalData.itemName}
        amount={escrowModalData.amount}
        onSuccess={fetchTransactions}
      />
    </>
  );
}
