
export type PaymentType = 'marketplace' | 'freelance' | 'reservation';

export interface PaymentDetails {
  id?: string;
  amount: number;
  currency?: string;
  paymentMethod?: string;
  relatedType: PaymentType;
  relatedId: string;
  status?: string;
}

export interface EscrowDetails {
  id?: string;
  paymentId: string;
  buyerId: string;
  sellerId: string;
  status?: string;
  contractDetails?: any;
  releaseConditions?: string;
  releaseDate?: Date;
}

export interface Transaction {
  id: string;
  amount: number;
  currency: string;
  payment_method: string;
  payment_status: string;
  related_type: PaymentType;
  related_id: string;
  created_at: string;
  updated_at: string;
  receipt_url?: string;
  refund_status?: string;
  refunded_amount?: number;
  escrow?: EscrowDetails;
}
