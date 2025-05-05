
import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatCurrency, formatDate } from "@/components/payments/utils/formatUtils";
import { Transaction } from "@/components/payments/types";
import { canRequestRefund, canReleaseEscrow } from "@/utils/payment-utils";

interface TransactionCardProps {
  transaction: Transaction;
  onRequestRefund: (transactionId: string) => void;
  onReleaseEscrow?: (transactionId: string) => void;
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
  const canRelease = userId && canReleaseEscrow(transaction, userId);

  return (
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
        <div className="bg-blue-50 p-2 rounded-md text-sm mb-3">
          <p className="font-medium text-blue-800">Escrow</p>
          <p className="text-blue-600">สถานะ: {transaction.escrow.status}</p>
          <p className="text-blue-600 text-xs">{transaction.escrow.releaseConditions}</p>
        </div>
      )}
      
      <div className="flex justify-end space-x-2">
        {transaction.receipt_url && (
          <Button variant="outline" size="sm" asChild>
            <a href={transaction.receipt_url} target="_blank" rel="noopener noreferrer">
              ใบเสร็จ
            </a>
          </Button>
        )}
        
        {isRefundable && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onRequestRefund(transaction.id)}
          >
            ขอคืนเงิน
          </Button>
        )}
        
        {canRelease && onReleaseEscrow && (
          <Button 
            variant="default" 
            size="sm" 
            className="bg-infi-green hover:bg-infi-green-hover"
            onClick={() => onReleaseEscrow(transaction.id)}
          >
            ปล่อยเงิน Escrow
          </Button>
        )}
      </div>
    </Card>
  );
};
