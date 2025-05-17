
export const formatCurrency = (amount: number, currency: string = 'THB'): string => {
  // Format the amount according to the specified currency
  return new Intl.NumberFormat('th-TH', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};
