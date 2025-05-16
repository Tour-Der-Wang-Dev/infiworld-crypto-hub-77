
export enum PaymentType {
  MARKETPLACE = 'marketplace',
  FREELANCE = 'freelance',
  RESERVATION = 'reservation',
}

export const PAYMENT_TYPE_LABELS: Record<PaymentType, string> = {
  [PaymentType.MARKETPLACE]: 'สินค้า Marketplace',
  [PaymentType.FREELANCE]: 'บริการฟรีแลนซ์',
  [PaymentType.RESERVATION]: 'การจอง',
};
