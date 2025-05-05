
import { format } from "date-fns";
import { th } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { PaymentType } from "@/components/payments/types";
import React from "react"; // Add React import for JSX

export const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return format(date, "dd MMM yyyy, HH:mm", { locale: th });
  } catch (error) {
    return dateString;
  }
};

export const formatAmount = (amount: number, currency: string = "THB"): string => {
  return new Intl.NumberFormat('th-TH', { 
    style: 'currency', 
    currency: currency,
    minimumFractionDigits: 2
  }).format(amount);
};

// Must use arrow function with JSX return type
export const getPaymentStatusBadge = (status: string): React.ReactNode => {
  switch (status) {
    case 'completed':
      return <Badge className="bg-green-500">สำเร็จ</Badge>;
    case 'pending':
      return <Badge variant="outline" className="text-amber-600 border-amber-600">รอดำเนินการ</Badge>;
    case 'failed':
      return <Badge variant="destructive">ล้มเหลว</Badge>;
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
};

export const getTransactionTypeDisplay = (type: PaymentType): string => {
  switch (type) {
    case 'marketplace':
      return 'Marketplace';
    case 'freelance':
      return 'บริการฟรีแลนซ์';
    case 'reservation':
      return 'การจอง';
    default:
      return type;
  }
};

export const getPaymentMethodDisplay = (method: string): string => {
  switch (method) {
    case 'card':
      return 'บัตรเครดิต/เดบิต';
    case 'crypto':
      return 'คริปโต';
    case 'promptpay':
      return 'พร้อมเพย์';
    default:
      return method;
  }
};

export const getPaymentTitle = (paymentType: PaymentType): string => {
  switch(paymentType) {
    case 'marketplace':
      return 'ชำระเงินสำหรับ Marketplace';
    case 'freelance':
      return 'ชำระเงินสำหรับบริการฟรีแลนซ์';
    case 'reservation':
      return 'ชำระเงินสำหรับการจอง';
    default:
      return 'ชำระเงิน';
  }
};
