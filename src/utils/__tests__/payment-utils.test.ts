
import { formatTransactionData, canRequestRefund, canReleaseEscrow } from '../payment-utils';
import { Transaction } from '@/components/payments/types';

// Mock transaction data
const mockTransactionData = [
  {
    id: 'test-id-1',
    amount: 100,
    currency: 'USD',
    payment_method: 'credit_card',
    payment_status: 'completed',
    related_type: 'marketplace',
    related_id: 'related-1',
    created_at: '2025-01-01T12:00:00Z',
    updated_at: '2025-01-01T12:00:00Z',
    receipt_url: 'https://example.com/receipt',
    refund_status: null,
    refunded_amount: null,
    escrow_transactions: []
  },
  {
    id: 'test-id-2',
    amount: 200,
    currency: 'THB',
    payment_method: 'crypto',
    payment_status: 'completed',
    related_type: 'freelance',
    related_id: 'related-2',
    created_at: '2025-01-02T12:00:00Z',
    updated_at: '2025-01-02T12:00:00Z',
    receipt_url: null,
    refund_status: 'requested',
    refunded_amount: null,
    escrow_transactions: []
  },
  {
    id: 'test-id-3',
    amount: 300,
    currency: 'USD',
    payment_method: 'bank_transfer',
    payment_status: 'completed',
    related_type: 'reservation',
    related_id: 'related-3',
    created_at: '2025-01-03T12:00:00Z',
    updated_at: '2025-01-03T12:00:00Z',
    receipt_url: null,
    refund_status: null,
    refunded_amount: null,
    escrow_transactions: [
      {
        id: 'escrow-1',
        payment_id: 'test-id-3',
        buyer_id: 'buyer-1',
        seller_id: 'seller-1',
        escrow_status: 'initiated',
        contract_details: { details: 'test' },
        release_conditions: 'Product delivery',
        release_date: null
      }
    ]
  }
];

describe('Payment Utilities', () => {
  describe('formatTransactionData', () => {
    it('should correctly format transaction data', () => {
      const formatted = formatTransactionData(mockTransactionData);
      
      expect(formatted).toHaveLength(3);
      expect(formatted[0].id).toBe('test-id-1');
      expect(formatted[0].amount).toBe(100);
      expect(formatted[0].escrow).toBeUndefined();
      
      expect(formatted[2].escrow).toBeDefined();
      expect(formatted[2].escrow?.status).toBe('initiated');
      expect(formatted[2].escrow?.buyerId).toBe('buyer-1');
    });
    
    it('should handle empty data', () => {
      const formatted = formatTransactionData([]);
      expect(formatted).toHaveLength(0);
    });
    
    it('should handle null data', () => {
      const formatted = formatTransactionData(null as any);
      expect(formatted).toHaveLength(0);
    });
  });
  
  describe('canRequestRefund', () => {
    it('should return true for eligible transactions', () => {
      const transaction = {
        payment_status: 'completed',
        refund_status: null,
        escrow: undefined
      } as Transaction;
      
      expect(canRequestRefund(transaction)).toBe(true);
    });
    
    it('should return false for transactions with existing refund status', () => {
      const transaction = {
        payment_status: 'completed',
        refund_status: 'requested',
        escrow: undefined
      } as Transaction;
      
      expect(canRequestRefund(transaction)).toBe(false);
    });
    
    it('should return false for transactions with escrow', () => {
      const transaction = {
        payment_status: 'completed',
        refund_status: null,
        escrow: { id: 'test' } as any
      } as Transaction;
      
      expect(canRequestRefund(transaction)).toBe(false);
    });
  });
  
  describe('canReleaseEscrow', () => {
    it('should return true for eligible escrow transactions', () => {
      const transaction = {
        escrow: {
          status: 'initiated',
          buyerId: 'user-123',
        }
      } as Transaction;
      
      expect(canReleaseEscrow(transaction, 'user-123')).toBe(true);
    });
    
    it('should return false if user is not the buyer', () => {
      const transaction = {
        escrow: {
          status: 'initiated',
          buyerId: 'user-123',
        }
      } as Transaction;
      
      expect(canReleaseEscrow(transaction, 'different-user')).toBe(false);
    });
    
    it('should return false if escrow status is not initiated', () => {
      const transaction = {
        escrow: {
          status: 'released',
          buyerId: 'user-123',
        }
      } as Transaction;
      
      expect(canReleaseEscrow(transaction, 'user-123')).toBe(false);
    });
    
    it('should return false if no user id provided', () => {
      const transaction = {
        escrow: {
          status: 'initiated',
          buyerId: 'user-123',
        }
      } as Transaction;
      
      expect(canReleaseEscrow(transaction, undefined)).toBe(false);
    });
  });
});
