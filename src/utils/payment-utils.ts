
import { supabase } from "@/integrations/supabase/client";
import { Transaction, PaymentStatus, EscrowStatus } from "@/components/payments/types";

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

/**
 * Requests a refund for a transaction
 * @param transactionId - ID of the transaction to refund
 * @param userId - ID of the user requesting the refund
 * @returns Promise with success status
 */
export const requestRefund = async (
  transactionId: string, 
  userId: string
): Promise<{ success: boolean; error?: any }> => {
  try {
    const { error } = await supabase
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
    console.error("Error requesting refund:", error);
    return { success: false, error };
  }
};

/**
 * Releases funds from an escrow transaction
 * @param escrowId - ID of the escrow transaction
 * @param userId - ID of the buyer releasing the funds
 * @returns Promise with success status
 */
export const releaseEscrow = async (
  escrowId: string,
  userId: string
): Promise<{ success: boolean; error?: any }> => {
  try {
    const { error } = await supabase
      .from("escrow_transactions")
      .update({ 
        escrow_status: "released" as EscrowStatus,
        release_date: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq("id", escrowId)
      .eq("buyer_id", userId);
    
    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error("Error releasing escrow:", error);
    return { success: false, error };
  }
};
