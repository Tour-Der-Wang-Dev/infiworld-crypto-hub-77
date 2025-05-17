
import { format } from "date-fns";
import { th } from "date-fns/locale";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Transaction } from "./types";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "./utils/formatUtils";
import { useState } from "react";
import { EscrowReleaseModal } from "./EscrowReleaseModal";

interface TransactionCardProps {
  transaction: Transaction;
  onRequestRefund: () => void;
  onReleaseEscrow: () => void;
  canRequestRefund: boolean;
  canReleaseEscrow: boolean;
}

export const TransactionCard = ({ 
  transaction, 
  onRequestRefund,
  onReleaseEscrow,
  canRequestRefund,
  canReleaseEscrow
}: TransactionCardProps) => {
  const [showEscrowModal, setShowEscrowModal] = useState(false);
  
  // Format date in Thai locale
  const formattedDate = format(
    new Date(transaction.created_at), 
    "d MMM yyyy, HH:mm น.", 
    { locale: th }
  );
  
  // Determine badge color based on status
  const getBadgeVariant = () => {
    switch (transaction.payment_status) {
      case "completed":
        return "success";
      case "pending":
        return "warning";
      case "failed":
        return "destructive";
      case "refunded":
      case "partially_refunded":
        return "secondary";
      default:
        return "outline";
    }
  };
  
  // Get status text in Thai
  const getStatusText = () => {
    switch (transaction.payment_status) {
      case "completed":
        return "สำเร็จ";
      case "pending":
        return "กำลังดำเนินการ";
      case "failed":
        return "ล้มเหลว";
      case "refunded":
        return "คืนเงินแล้ว";
      case "partially_refunded":
        return "คืนเงินบางส่วน";
      default:
        return transaction.payment_status;
    }
  };
  
  // Get payment method text in Thai
  const getPaymentMethodText = () => {
    switch (transaction.payment_method) {
      case "card":
        return "บัตรเครดิต/เดบิต";
      case "crypto":
        return "คริปโต";
      case "promptpay":
        return "พร้อมเพย์";
      default:
        return transaction.payment_method;
    }
  };

  // Get transaction type text in Thai
  const getTransactionTypeText = () => {
    switch (transaction.related_type) {
      case "marketplace":
        return "ตลาดซื้อขาย";
      case "freelance":
        return "ฟรีแลนซ์";
      case "reservation":
        return "การจอง";
      default:
        return transaction.related_type;
    }
  };

  const handleReleaseEscrow = async () => {
    setShowEscrowModal(true);
  };

  return (
    <>
      <Card className="overflow-hidden">
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="font-medium">
                {getTransactionTypeText()} - {formatCurrency(transaction.amount, transaction.currency)}
              </h3>
              <p className="text-sm text-muted-foreground">{formattedDate}</p>
            </div>
            <Badge variant={getBadgeVariant()}>{getStatusText()}</Badge>
          </div>
          
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-muted-foreground">วิธีชำระเงิน:</span>
              <span className="ml-1">{getPaymentMethodText()}</span>
            </div>
            
            <div>
              <span className="text-muted-foreground">ประเภท:</span>
              <span className="ml-1">{getTransactionTypeText()}</span>
            </div>
            
            {transaction.refund_status && (
              <div className="col-span-2">
                <span className="text-muted-foreground">สถานะการคืนเงิน:</span>
                <span className="ml-1">
                  {transaction.refund_status === "requested" ? "รอการตรวจสอบ" : transaction.refund_status}
                </span>
              </div>
            )}
            
            {transaction.escrow && (
              <div className="col-span-2 mt-2 p-2 bg-blue-50 border border-blue-100 rounded-md">
                <p className="text-blue-700 font-medium text-sm mb-1">บริการ Escrow (ระบบพักเงิน)</p>
                <p className="text-xs text-blue-600">
                  สถานะ: {transaction.escrow.status === "initiated" ? "รอการปล่อยเงิน" : 
                          transaction.escrow.status === "released" ? "ปล่อยเงินแล้ว" : 
                          transaction.escrow.status === "refunded" ? "คืนเงินแล้ว" : "มีข้อพิพาท"}
                </p>
              </div>
            )}
          </div>
        </CardContent>
        
        <CardFooter className="bg-gray-50 px-4 py-3 flex justify-end space-x-2">
          {transaction.receipt_url && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => window.open(transaction.receipt_url, '_blank')}
            >
              ใบเสร็จ
            </Button>
          )}
          
          {canRequestRefund && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={onRequestRefund}
            >
              ขอคืนเงิน
            </Button>
          )}
          
          {canReleaseEscrow && (
            <Button 
              variant="default" 
              size="sm"
              onClick={handleReleaseEscrow}
            >
              ปล่อยเงิน Escrow
            </Button>
          )}
        </CardFooter>
      </Card>
      
      {transaction.escrow && (
        <EscrowReleaseModal
          open={showEscrowModal}
          onClose={() => setShowEscrowModal(false)}
          transactionId={transaction.id}
          escrowId={transaction.escrow.id}
          sellerName="ผู้ขาย" // In a real app, we would get the seller's name
          itemDetails={`รายการ ${getTransactionTypeText()}`}
          amount={transaction.amount}
          currency={transaction.currency}
          onConfirm={async () => {
            await onReleaseEscrow();
            setShowEscrowModal(false);
          }}
        />
      )}
    </>
  );
};
