
import { renderHook, act } from '@testing-library/react-hooks';
import { usePaymentData } from '../usePaymentData';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Mock dependencies
jest.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    order: jest.fn().mockReturnThis(),
    not: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
  }
}));

jest.mock('sonner', () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn(),
    loading: jest.fn(),
    dismiss: jest.fn()
  }
}));

jest.mock('@/hooks/use-auth', () => ({
  useAuth: () => ({
    user: { id: 'test-user-id' }
  })
}));

describe('usePaymentData hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch transactions on mount', async () => {
    const mockData = [
      { 
        id: 'test-1', 
        amount: 100, 
        payment_status: 'completed',
        escrow_transactions: []
      }
    ];
    
    // Mock the Supabase response
    (supabase.from as jest.Mock).mockImplementation(() => ({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
      not: jest.fn().mockReturnThis(),
      limit: jest.fn().mockResolvedValue({ data: mockData, error: null })
    }));

    const { result, waitForNextUpdate } = renderHook(() => usePaymentData());
    
    // Initial state should be loading with empty transactions
    expect(result.current.isLoading).toBe(true);
    expect(result.current.transactions).toEqual([]);
    
    await waitForNextUpdate();
    
    // After loading, should have transactions and not be loading
    expect(result.current.isLoading).toBe(false);
    expect(result.current.transactions.length).toBeGreaterThan(0);
    expect(supabase.from).toHaveBeenCalledWith('payments');
  });

  it('should handle refund requests correctly', async () => {
    // Mock Supabase responses
    (supabase.from as jest.Mock).mockImplementation((table) => {
      if (table === 'payments') {
        return {
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          order: jest.fn().mockReturnThis(),
          not: jest.fn().mockReturnThis(),
          limit: jest.fn().mockResolvedValue({ data: [], error: null }),
          update: jest.fn().mockReturnThis()
        };
      }
      return {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockResolvedValue({ error: null }),
        update: jest.fn().mockReturnThis()
      };
    });

    const { result, waitForNextUpdate } = renderHook(() => usePaymentData());
    await waitForNextUpdate();

    // Test refund request
    act(() => {
      result.current.handleRequestRefund('test-transaction-id');
    });

    // Should show loading toast
    expect(toast.loading).toHaveBeenCalled();
  });

  it('should handle errors when fetching transactions', async () => {
    // Mock Supabase error response
    (supabase.from as jest.Mock).mockImplementation(() => ({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
      not: jest.fn().mockReturnThis(),
      limit: jest.fn().mockResolvedValue({ data: null, error: new Error('Failed to fetch') })
    }));

    const { result, waitForNextUpdate } = renderHook(() => usePaymentData());
    
    await waitForNextUpdate();
    
    // Should show error toast
    expect(toast.error).toHaveBeenCalled();
    expect(result.current.isLoading).toBe(false);
  });
});
