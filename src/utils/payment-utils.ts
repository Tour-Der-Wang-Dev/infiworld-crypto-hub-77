
import { Transaction } from "@/components/payments/types";

export const formatTransactionData = (data: any[]): Transaction[] => {
  if (!data || !Array.isArray(data)) return [];
  
  try {
    return data.map((item): Transaction => {
      const escrowData = item.escrow_transactions && item.escrow_transactions.length > 0 
        ? item.escrow_transactions[0] 
        : undefined;
      
      return {
        id: item.id,
        amount: item.amount,
        currency: item.currency || 'THB',
        payment_method: item.payment_method,
        payment_status: item.payment_status,
        related_type: item.related_type,
        related_id: item.related_id,
        created_at: item.created_at,
        updated_at: item.updated_at,
        receipt_url: item.receipt_url,
        refund_status: item.refund_status,
        refunded_amount: item.refunded_amount,
        escrow: escrowData ? {
          id: escrowData.id,
          paymentId: escrowData.payment_id,
          buyerId: escrowData.buyer_id,
          sellerId: escrowData.seller_id,
          status: escrowData.escrow_status,
          contractDetails: escrowData.contract_details,
          releaseConditions: escrowData.release_conditions,
          releaseDate: escrowData.release_date ? new Date(escrowData.release_date) : undefined
        } : undefined
      };
    });
  } catch (error) {
    console.error("Error formatting transaction data:", error);
    return [];
  }
};

// Can the user request a refund for this transaction?
export const canRequestRefund = (transaction: Transaction): boolean => {
  return transaction.payment_status === 'completed' && 
    !transaction.refund_status &&
    !transaction.escrow;
};

// Can the user release escrow funds for this transaction?
export const canReleaseEscrow = (transaction: Transaction, userId?: string): boolean => {
  if (!userId) return false;
  return !!transaction.escrow && 
    transaction.escrow.status === 'initiated' &&
    transaction.escrow.buyerId === userId;
};

// Utility to request a refund - useful for testing
export const requestRefund = async (
  transactionId: string, 
  userId: string,
  supabaseClient: any
): Promise<{success: boolean, error?: any}> => {
  try {
    const { error } = await supabaseClient
      .from("transactions")
      .update({ 
        refund_status: "requested",
        updated_at: new Date().toISOString()
      })
      .eq("id", transactionId)
      .eq("user_id", userId);
    
    if (error) throw error;
    return { success: true };
  } catch (error) {
    return { success: false, error };
  }
};
