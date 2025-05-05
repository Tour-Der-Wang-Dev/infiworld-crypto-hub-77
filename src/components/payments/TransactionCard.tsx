
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatCurrency, formatDate } from "@/components/payments/utils/formatUtils";
import { Transaction } from "@/components/payments/types";
import { canRequestRefund, canReleaseEscrow } from "@/utils/payment-utils";
import { EscrowReleaseModal } from "./EscrowReleaseModal";
import { Eye, Receipt, RefreshCcw, Wallet } from "lucide-react";

interface TransactionCardProps {
  transaction: Transaction;
  onRequestRefund: (transactionId: string) => void;
  onReleaseEscrow?: (transactionId: string) => Promise<void>;
  userId?: string;
}

/**
 * Displays a single transaction as a card with actions
 */
export const TransactionCard: React.FC<TransactionCardProps> = ({
  transaction,
  onRequestRefund,
  onReleaseEscrow,
  userId
}) => {
  const [showEscrowModal, setShowEscrowModal] = useState(false);

  // Determine status color based on payment status
  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-green-600";
      case "pending":
        return "text-amber-600";
      case "failed":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  // Determine refund status color
  const getRefundStatusColor = (status?: string) => {
    if (!status) return "";
    
    switch (status) {
      case "requested":
        return "text-amber-600";
      case "approved":
        return "text-green-600";
      case "rejected":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const isRefundable = canRequestRefund(transaction);
  const canRelease = userId && onReleaseEscrow && canReleaseEscrow(transaction, userId);
  
  const sellerName = transaction.escrow?.sellerId.substring(0, 8) || "ผู้ขาย";
  const itemDetails = `${transaction.related_type} #${transaction.related_id.substring(0, 8)}`;

  return (
    <>
      <Card className="p-4 mb-4 hover:shadow-md transition-shadow">
        <div className="flex justify-between mb-2">
          <div>
            <span className="font-semibold">{transaction.related_type}</span>
            <span className={`ml-2 ${getStatusColor(transaction.payment_status)}`}>
              • {transaction.payment_status}
            </span>
            {transaction.refund_status && (
              <span className={`ml-2 ${getRefundStatusColor(transaction.refund_status)}`}>
                • คำขอคืนเงิน: {transaction.refund_status}
              </span>
            )}
          </div>
          <div className="font-bold">
            {formatCurrency(transaction.amount, transaction.currency)}
          </div>
        </div>
        
        <div className="flex justify-between text-sm text-gray-500 mb-3">
          <div>
            {formatDate(transaction.created_at)} • {transaction.payment_method}
          </div>
          <div>
            ID: {transaction.id.substring(0, 8)}...
          </div>
        </div>
        
        {transaction.escrow && (
          <div className="bg-blue-50 p-2 rounded-md text-sm mb-3 border border-blue-100">
            <div className="flex items-center">
              <Wallet className="h-4 w-4 text-blue-600 mr-1" />
              <p className="font-medium text-blue-800">Escrow</p>
            </div>
            <p className="text-blue-600">สถานะ: {transaction.escrow.status}</p>
            <p className="text-blue-600 text-xs">{transaction.escrow.releaseConditions}</p>
          </div>
        )}
        
        <div className="flex flex-wrap gap-2 justify-end">
          {transaction.receipt_url && (
            <Button variant="outline" size="sm" asChild>
              <a href={transaction.receipt_url} target="_blank" rel="noopener noreferrer">
                <Receipt className="mr-1 h-4 w-4" /> ใบเสร็จ
              </a>
            </Button>
          )}
          
          <Button
            variant="outline"
            size="sm"
          >
            <Eye className="mr-1 h-4 w-4" /> รายละเอียด
          </Button>
          
          {isRefundable && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onRequestRefund(transaction.id)}
            >
              <RefreshCcw className="mr-1 h-4 w-4" /> ขอคืนเงิน
            </Button>
          )}
          
          {canRelease && (
            <Button 
              variant="default" 
              size="sm" 
              className="bg-green-600 hover:bg-green-700 text-white"
              onClick={() => setShowEscrowModal(true)}
            >
              <Wallet className="mr-1 h-4 w-4" /> ปล่อยเงิน Escrow
            </Button>
          )}
        </div>
      </Card>

      {canRelease && onReleaseEscrow && (
        <EscrowReleaseModal
          open={showEscrowModal}
          onClose={() => setShowEscrowModal(false)}
          transactionId={transaction.id}
          sellerName={sellerName}
          itemDetails={itemDetails}
          amount={transaction.amount}
          currency={transaction.currency}
          onConfirm={onReleaseEscrow}
        />
      )}
    </>
  );
};
