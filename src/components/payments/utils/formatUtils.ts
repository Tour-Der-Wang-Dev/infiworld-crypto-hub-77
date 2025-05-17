
export const formatCurrency = (amount: number, currency: string = 'THB'): string => {
  // Format the amount according to the specified currency
  return new Intl.NumberFormat('th-TH', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

export const formatAmount = (amount: number, currency: string = 'THB'): string => {
  return formatCurrency(amount, currency);
};

export const getPaymentTitle = (paymentType: string): string => {
  switch (paymentType) {
    case 'marketplace':
      return 'ชำระเงินสำหรับสินค้า';
    case 'freelance':
      return 'ชำระเงินสำหรับบริการ';
    case 'reservation':
      return 'ชำระเงินสำหรับการจอง';
    default:
      return 'ชำระเงิน';
  }
};
