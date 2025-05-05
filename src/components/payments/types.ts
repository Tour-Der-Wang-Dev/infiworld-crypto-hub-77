
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
  related_type: PaymentType; // Fixed type here
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

export interface PaymentMethodsProps {
  amount: number;
  currency?: string;
  onPaymentSubmit: (method: string) => Promise<void>;
  onCancel: () => void;
  isProcessing: boolean;
  paymentType: PaymentType;
}

export interface EscrowModalProps {
  open: boolean;
  onClose: () => void;
  escrowId: string;
  paymentId: string;
  sellerName: string;
  itemName: string;
  amount: number;
  currency?: string;
  onSuccess?: () => void;
}

export interface TransactionsListProps {
  limit?: number;
  showRefreshButton?: boolean;
  className?: string;
}
