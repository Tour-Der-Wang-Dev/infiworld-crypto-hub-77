
import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";

export function UserProfile() {
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
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle>โปรไฟล์ผู้ใช้</CardTitle>
        <CardDescription>รายละเอียดบัญชีของคุณ</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-center mb-6">
          <Avatar className="h-24 w-24">
            <AvatarImage src={user?.user_metadata?.avatar_url || ""} />
            <AvatarFallback className="text-lg bg-infi-green text-white">
              {getInitials()}
            </AvatarFallback>
          </Avatar>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm font-medium text-gray-500">อีเมล:</span>
            <span className="text-sm font-medium">{user?.email}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-sm font-medium text-gray-500">สถานะอีเมล:</span>
            <span className="text-sm font-medium">
              {user?.email_confirmed_at 
                ? <span className="text-green-600">ยืนยันแล้ว</span> 
                : <span className="text-amber-600">ยังไม่ได้ยืนยัน</span>}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-sm font-medium text-gray-500">วันที่สมัคร:</span>
            <span className="text-sm font-medium">
              {user?.created_at 
                ? new Date(user.created_at).toLocaleDateString('th-TH') 
                : '-'}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-sm font-medium text-gray-500">เข้าสู่ระบบล่าสุด:</span>
            <span className="text-sm font-medium">
              {user?.last_sign_in_at 
                ? new Date(user.last_sign_in_at).toLocaleDateString('th-TH') 
                : '-'}
            </span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          variant="destructive" 
          className="w-full" 
          onClick={handleSignOut}
          disabled={isLoading}
        >
          {isLoading ? 'กำลังออกจากระบบ...' : 'ออกจากระบบ'}
        </Button>
      </CardFooter>
    </Card>
  );
}
