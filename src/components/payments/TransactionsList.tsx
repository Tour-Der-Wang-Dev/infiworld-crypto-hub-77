
import { useState, useEffect } from "react";
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
import { Transaction } from "@/components/payments/types";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { format } from "date-fns";
import { th } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { EscrowModal } from "@/components/payments/EscrowModal";
import { toast } from "sonner";

interface TransactionsListProps {
  limit?: number;
  showRefreshButton?: boolean;
  className?: string;
}

export function TransactionsList({ 
  limit,
  showRefreshButton = true,
  className 
}: TransactionsListProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
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
  const { user } = useAuth();

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
        .limit(limit || 100);
        
      if (error) throw error;
      
      // Transform data to match our Transaction type
      const formattedData = data.map((item): Transaction => {
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
    } catch (error) {
      console.error("Error fetching transactions:", error);
      toast.error("ไม่สามารถดึงข้อมูลธุรกรรมได้", {
        description: "กรุณาลองใหม่อีกครั้ง"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchTransactions();
    }
  }, [user]);
  
  const handleRequestRefund = async (transactionId: string) => {
    try {
      const { error } = await supabase
        .from("payments")
        .update({ refund_status: "requested" })
        .eq("id", transactionId);
        
      if (error) throw error;
      
      toast.success("ส่งคำขอคืนเงินเรียบร้อยแล้ว", {
        description: "เจ้าหน้าที่จะตรวจสอบคำขอและดำเนินการต่อไป"
      });
      
      // Refresh transactions list
      fetchTransactions();
    } catch (error) {
      console.error("Error requesting refund:", error);
      toast.error("ไม่สามารถส่งคำขอคืนเงินได้", {
        description: "กรุณาลองใหม่อีกครั้ง"
      });
    }
  };
  
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

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, "dd MMM yyyy, HH:mm", { locale: th });
    } catch (error) {
      return dateString;
    }
  };

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-500">สำเร็จ</Badge>;
      case 'pending':
        return <Badge variant="outline" className="text-amber-600 border-amber-600">รอดำเนินการ</Badge>;
      case 'failed':
        return <Badge variant="destructive">ล้มเหลว</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getTransactionTypeDisplay = (type: string) => {
    switch (type) {
      case 'marketplace':
        return 'Marketplace';
      case 'freelance':
        return 'บริการฟรีแลนซ์';
      case 'reservation':
        return 'การจอง';
      default:
        return type;
    }
  };

  const getPaymentMethodDisplay = (method: string) => {
    switch (method) {
      case 'card':
        return 'บัตรเครดิต/เดบิต';
      case 'crypto':
        return 'คริปโต';
      case 'promptpay':
        return 'พร้อมเพย์';
      default:
        return method;
    }
  };

  const canRequestRefund = (transaction: Transaction) => {
    return transaction.payment_status === 'completed' && 
      !transaction.refund_status &&
      !transaction.escrow;
  };

  const canReleaseEscrow = (transaction: Transaction) => {
    return transaction.escrow && 
      transaction.escrow.status === 'initiated' &&
      transaction.escrow.buyerId === user?.id;
  };

  const handleEscrowRelease = () => {
    fetchTransactions();
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
        onSuccess={handleEscrowRelease}
      />
    </>
  );
}
