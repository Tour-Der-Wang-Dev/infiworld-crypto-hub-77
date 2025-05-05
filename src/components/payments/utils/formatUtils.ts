
import { format } from "date-fns";
import { th } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { PaymentType } from "@/components/payments/types";
import * as React from "react";

export const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return format(date, "dd MMM yyyy, HH:mm", { locale: th });
  } catch (error) {
    return dateString;
  }
};

export const formatCurrency = (amount: number, currency: string = "THB"): string => {
  return new Intl.NumberFormat('th-TH', { 
    style: 'currency', 
    currency: currency,
    minimumFractionDigits: 2
  }).format(amount);
};

export const formatAmount = (amount: number, currency: string = "THB"): string => {
  return new Intl.NumberFormat('th-TH', { 
    style: 'currency', 
    currency: currency,
    minimumFractionDigits: 2
  }).format(amount);
};

// Create Badge elements without JSX to avoid syntax errors
export const getPaymentStatusBadge = (status: string): React.ReactElement => {
  switch (status) {
    case 'completed':
      return React.createElement(Badge, { className: "bg-green-500" }, "สำเร็จ");
    case 'pending':
      return React.createElement(Badge, { variant: "outline", className: "text-amber-600 border-amber-600" }, "รอดำเนินการ");
    case 'failed':
      return React.createElement(Badge, { variant: "destructive" }, "ล้มเหลว");
    default:
      return React.createElement(Badge, { variant: "secondary" }, status);
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
