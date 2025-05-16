
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { UserProfile } from '../UserProfile';
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";

// Mock dependencies
jest.mock('@/hooks/use-auth', () => ({
  useAuth: jest.fn(),
}));

jest.mock('sonner', () => ({
  toast: jest.fn(),
}));

describe('UserProfile Component', () => {
  // Setup common test data
  const mockUser = {
    id: 'user-123',
    email: 'test@example.com',
    email_confirmed_at: '2023-01-01T12:00:00Z',
    created_at: '2023-01-01T12:00:00Z',
    last_sign_in_at: '2023-02-01T12:00:00Z',
    user_metadata: {
      avatar_url: 'https://example.com/avatar.png'
    }
  };

  const mockSignOut = jest.fn().mockResolvedValue({ error: null });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders user information correctly when user is logged in', () => {
    // Setup
    (useAuth as jest.Mock).mockReturnValue({
      user: mockUser,
      signOut: mockSignOut,
    });

    // Render component
    render(<UserProfile />);
    
    // Assertions
    expect(screen.getByText('โปรไฟล์ผู้ใช้')).toBeInTheDocument();
    expect(screen.getByText('test@example.com')).toBeInTheDocument();
    expect(screen.getByText('ยืนยันแล้ว')).toBeInTheDocument();
    
    // Check if dates are properly formatted
    const createdDate = new Date(mockUser.created_at).toLocaleDateString('th-TH');
    const lastSignInDate = new Date(mockUser.last_sign_in_at).toLocaleDateString('th-TH');
    
    expect(screen.getByText(createdDate)).toBeInTheDocument();
    expect(screen.getByText(lastSignInDate)).toBeInTheDocument();
  });

  test('shows "ออกจากระบบ" button and calls signOut when clicked', async () => {
    // Setup
    (useAuth as jest.Mock).mockReturnValue({
      user: mockUser,
      signOut: mockSignOut,
    });

    // Render component
    render(<UserProfile />);
    
    // Get the button and click it
    const signOutButton = screen.getByText('ออกจากระบบ');
    expect(signOutButton).toBeInTheDocument();
    
    fireEvent.click(signOutButton);
    
    // Check if signOut was called and button shows loading state
    expect(mockSignOut).toHaveBeenCalled();
    expect(screen.getByText('กำลังออกจากระบบ...')).toBeInTheDocument();
    
    // Wait for the async operation to complete
    await waitFor(() => {
      expect(toast).toHaveBeenCalledWith("ออกจากระบบสำเร็จ", {
        description: "คุณได้ออกจากระบบเรียบร้อยแล้ว"
      });
    });
  });

  test('displays user initials in the avatar fallback when no avatar URL', () => {
    // Setup user without avatar URL
    const userWithoutAvatar = { 
      ...mockUser, 
      user_metadata: { }  // No avatar_url
    };
    
    (useAuth as jest.Mock).mockReturnValue({
      user: userWithoutAvatar,
      signOut: mockSignOut,
    });

    // Render component
    render(<UserProfile />);
    
    // Check if the avatar fallback contains the expected initials
    const avatarFallback = screen.getByText('TE');
    expect(avatarFallback).toBeInTheDocument();
  });

  test('handles sign out error correctly', async () => {
    // Setup sign out to return an error
    const mockSignOutWithError = jest.fn().mockResolvedValue({ 
      error: new Error('Sign out failed') 
    });
    
    (useAuth as jest.Mock).mockReturnValue({
      user: mockUser,
      signOut: mockSignOutWithError,
    });

    // Render component
    render(<UserProfile />);
    
    // Get the button and click it
    const signOutButton = screen.getByText('ออกจากระบบ');
    fireEvent.click(signOutButton);
    
    // Wait for the async operation to complete and check for error toast
    await waitFor(() => {
      expect(toast).toHaveBeenCalledWith("เกิดข้อผิดพลาด", {
        description: "ไม่สามารถออกจากระบบได้ กรุณาลองใหม่อีกครั้ง"
      });
    });
  });
});
