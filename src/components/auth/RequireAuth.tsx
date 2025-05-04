
import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";

interface RequireAuthProps {
  children: ReactNode;
}

/**
 * Component to protect routes that require authentication
 * Redirects to the login page if the user is not authenticated
 */
export const RequireAuth = ({ children }: RequireAuthProps) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  // Show a loading state while checking authentication
  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen">กำลังตรวจสอบสถานะการเข้าสู่ระบบ...</div>;
  }

  // If not authenticated, redirect to login page
  if (!user) {
    // Show a toast notification
    toast("กรุณาเข้าสู่ระบบ", {
      description: "คุณต้องเข้าสู่ระบบก่อนเข้าถึงหน้านี้"
    });

    // Redirect to login page, but remember where the user was trying to go
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // If authenticated, render the protected component
  return <>{children}</>;
};
