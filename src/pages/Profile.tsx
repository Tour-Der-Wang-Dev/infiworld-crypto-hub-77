
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { AuthNavbar } from "@/components/layout/AuthNavbar";
import { UserProfile } from "@/components/auth/UserProfile";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const Profile = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // If not loading and no user, redirect to auth page
    if (!isLoading && !user) {
      navigate("/auth", { replace: true });
    }
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <AuthNavbar />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-lg">กำลังโหลด...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <AuthNavbar />
      <div className="container mx-auto px-4 py-8 flex-grow">
        <h1 className="text-2xl font-bold mb-6">บัญชีของฉัน</h1>
        
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="profile">โปรไฟล์</TabsTrigger>
            <TabsTrigger value="security">ความปลอดภัย</TabsTrigger>
            <TabsTrigger value="verification">การยืนยันตัวตน</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile" className="space-y-6">
            <UserProfile />
          </TabsContent>
          
          <TabsContent value="security" className="space-y-6">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">การรักษาความปลอดภัย</h2>
              <Separator className="my-4" />
              <p className="text-gray-500">ตั้งค่ารหัสผ่านและการยืนยันตัวตนสองชั้น</p>
              <p className="text-sm text-muted-foreground mt-4">คุณสมบัตินี้จะเปิดให้ใช้งานเร็วๆ นี้</p>
            </Card>
          </TabsContent>
          
          <TabsContent value="verification" className="space-y-6">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">การยืนยันตัวตน</h2>
              <Separator className="my-4" />
              <p className="text-gray-500">ส่งเอกสารเพื่อยืนยันตัวตนของคุณ</p>
              <p className="text-sm text-muted-foreground mt-2">
                การยืนยันตัวตนจะทำให้คุณสามารถใช้งานฟีเจอร์ต่างๆ ได้ครบถ้วน 
                <br />
                เช่น การซื้อขาย, การลงประกาศ, และการใช้บริการต่างๆ
              </p>
              <div className="mt-4">
                <a href="/verify" className="text-infi-green hover:underline">
                  ไปยังหน้ายืนยันตัวตน
                </a>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <footer className="bg-white border-t py-4">
        <div className="container mx-auto px-4 text-center text-sm text-infi-gray">
          <p>© {new Date().getFullYear()} INFIWORLD.COM - แพลตฟอร์มที่รวมบริการซื้อ-ขาย-เช่า, งานฟรีแลนซ์, การจอง, และแผนที่ร้านค้าที่รับคริปโต</p>
        </div>
      </footer>
    </div>
  );
};

export default Profile;
