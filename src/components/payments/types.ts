
export type PaymentType = 'marketplace' | 'freelance' | 'reservation';
export type PaymentMethod = 'card' | 'crypto' | 'promptpay';
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded' | 'partially_refunded';
export type EscrowStatus = 'initiated' | 'released' | 'refunded' | 'disputed';

export interface PaymentDetails {
  id?: string;
  amount: number;
  currency?: string;
  method: PaymentMethod;
  paymentType: PaymentType;
  relatedId: string;
  status?: PaymentStatus;
  receiptUrl?: string;
  refundStatus?: string;
  refundedAmount?: number;
}

export interface EscrowDetails {
  id?: string;
  paymentId: string;
  buyerId: string;
  sellerId: string;
  status: EscrowStatus;
  contractDetails?: any;
  releaseConditions?: string;
  releaseDate?: Date;
}

export interface Transaction {
  id: string;
  amount: number;
  currency: string;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  related_type: PaymentType; 
  related_id: string;
  created_at: string;
  updated_at: string;
  receipt_url?: string;
  refund_status?: string;
  refunded_amount?: number;
  escrow?: EscrowDetails;
}

export interface PaymentConsentProps {
  onConsentChange: (consented: boolean) => void;
}

export interface PaymentFormProps {
  amount: number;
  currency?: string;
  paymentType: PaymentType;
  relatedId: string;
  onSuccess?: (paymentId: string) => void;
  onError?: (error: any) => void;
  useEscrow?: boolean;
  sellerId?: string;
  buttonText?: string;
}

export interface TransactionsListProps {
  limit?: number;
  showRefreshButton?: boolean;
  className?: string;
  filterType?: PaymentType;
  showEscrowOnly?: boolean;
}

export interface PaymentMethodsProps {
  amount: number;
  currency?: string;
  onPaymentSubmit: (method: string) => Promise<void>;
  onCancel: () => void;
  isProcessing: boolean;
  paymentType: PaymentType;
}

export interface PaymentModalProps {
  open: boolean;
  onClose: () => void;
  amount: number;
  currency?: string;
  paymentType: PaymentType;
  relatedId: string;
  onSuccess?: (paymentId: string) => void;
  useEscrow?: boolean;
  sellerId?: string;
}
