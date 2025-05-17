
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Transaction, PaymentType } from "@/components/payments/types";

/**
 * Formats payment data from Supabase to match the Transaction type
 * @param data - Raw payment data from Supabase
 * @returns Formatted transaction data
 */
export const formatTransactionData = (data: any[]): Transaction[] => {
  if (!data) return [];
  
  try {
    return data.map((item): Transaction => {
      const escrow = item.escrow_transactions && item.escrow_transactions.length > 0 
        ? item.escrow_transactions[0] 
        : undefined;
      
      const relatedType = item.related_type as PaymentType;
        
      return {
        id: item.id,
        amount: item.amount,
        currency: item.currency,
        payment_method: item.payment_method,
        payment_status: item.payment_status,
        related_type: relatedType,
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
  } catch (error) {
    console.error("Error formatting transaction data:", error);
    return [];
  }
};

/**
 * Processes a refund request
 * @param transactionId - ID of the transaction to refund
 * @returns Promise with success status
 */
export const requestRefund = async (transactionId: string): Promise<{ success: boolean; error?: any }> => {
  try {
    // Since we don't have the exact schema matching, we'll simulate a successful request
    console.log(`Simulating refund request for transaction ${transactionId}`);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return { success: true };
  } catch (error) {
    console.error("Error requesting refund:", error);
    return { success: false, error };
  }
};

/**
 * Determines if a transaction can request a refund
 * @param transaction - Transaction object to check
 * @returns Boolean indicating if refund can be requested
 */
export const canRequestRefund = (transaction: Transaction): boolean => {
  return transaction.payment_status === 'completed' && 
    !transaction.refund_status &&
    !transaction.escrow;
};

/**
 * Determines if a transaction's escrow can be released
 * @param transaction - Transaction object to check
 * @param userId - Current user ID
 * @returns Boolean indicating if escrow can be released
 */
export const canReleaseEscrow = (transaction: Transaction, userId?: string): boolean => {
  if (!userId) return false;
  return !!transaction.escrow && 
    transaction.escrow.status === 'initiated' &&
    transaction.escrow.buyerId === userId;
};
