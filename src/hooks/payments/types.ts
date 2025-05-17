
import { Transaction, PaymentType } from "@/components/payments/types";

export interface UsePaymentDataProps {
  initialLimit?: number;
  filterType?: PaymentType;
  showEscrowOnly?: boolean;
}

export interface PaymentDataState {
  transactions: Transaction[];
  isLoading: boolean;
  error: Error | null;
}
