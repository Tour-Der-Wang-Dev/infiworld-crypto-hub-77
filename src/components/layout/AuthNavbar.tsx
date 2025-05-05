
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import Navbar from "./Navbar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { User, LogOut, Settings, UserCircle, CreditCard } from "lucide-react";
import { toast } from "sonner";

export function AuthNavbar() {
  const { user, signOut } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignOut = async () => {
    try {
      setIsLoading(true);
      const { error } = await signOut();
      
      if (error) {
        throw error;
      }

      toast("ออกจากระบบสำเร็จ", {
        description: "คุณได้ออกจากระบบเรียบร้อยแล้ว"
      });
      
    } catch (error: any) {
      console.error("Error signing out:", error);
      toast("เกิดข้อผิดพลาด", {
        description: "ไม่สามารถออกจากระบบได้ กรุณาลองใหม่อีกครั้ง"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Extract email username part for the avatar
  const getInitials = () => {
    if (!user?.email) return "U";
    return user.email.substring(0, 2).toUpperCase();
  };
  
  return (
    <div className="relative">
      <Navbar />
      
      {/* Authentication overlay - positioned absolute to avoid modifying the original Navbar */}
      <div className="absolute top-0 right-0 h-16 flex items-center pr-4">
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.user_metadata?.avatar_url || ""} alt="Profile" />
                  <AvatarFallback className="bg-infi-green text-white">
                    {getInitials()}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {user.user_metadata?.name || "ผู้ใช้"}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/user-profile" className="cursor-pointer flex items-center">
                  <UserCircle className="mr-2 h-4 w-4" />
                  <span>โปรไฟล์</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/my-transactions" className="cursor-pointer flex items-center">
                  <CreditCard className="mr-2 h-4 w-4" />
                  <span>ธุรกรรมของฉัน</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/identity-verification" className="cursor-pointer flex items-center">
                  <User className="mr-2 h-4 w-4" />
                  <span>ยืนยันตัวตน</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/settings" className="cursor-pointer flex items-center">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>ตั้งค่า</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="cursor-pointer flex items-center text-red-600" 
                onClick={handleSignOut}
                disabled={isLoading}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>{isLoading ? "กำลังออกจากระบบ..." : "ออกจากระบบ"}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Link to="/auth">
            <Button variant="default" className="bg-infi-green hover:bg-infi-green-hover">
              เข้าสู่ระบบ
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}
