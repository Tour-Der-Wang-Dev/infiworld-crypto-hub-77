
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Eye, EyeOff, Mail } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/layout/Navbar';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/hooks/use-auth';

// Form schema for validation
const formSchema = z.object({
  email: z.string().email({
    message: 'กรุณาใส่อีเมลที่ถูกต้อง',
  }),
  password: z.string().min(8, {
    message: 'รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร',
  }),
  rememberMe: z.boolean().optional(),
  pdpaConsent: z.boolean().refine((val) => val === true, {
    message: 'กรุณายอมรับนโยบายความเป็นส่วนตัว',
  }),
});

type FormData = z.infer<typeof formSchema>;

const Auth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoginView, setIsLoginView] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const isMobile = useIsMobile();
  const { toast: hookToast } = useToast();
  const { user } = useAuth();

  // Get the intended destination from the location state, or default to "/"
  const from = location.state?.from?.pathname || "/";

  // Check if user is already logged in
  useEffect(() => {
    if (user) {
      toast("คุณได้เข้าสู่ระบบแล้ว", {
        description: "กำลังนำคุณไปยังหน้าหลัก"
      });
      navigate(from, { replace: true });
    }
  }, [user, navigate, from]);

  // Form setup
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
      pdpaConsent: false,
    },
  });

  // Handle form submission with proper error sanitization
  const onSubmit = async (data: FormData) => {
    try {
      setIsLoading(true);

      if (isLoginView) {
        // Login with sanitized inputs
        const { error } = await supabase.auth.signInWithPassword({
          email: data.email.trim(),
          password: data.password,
        });

        if (error) throw error;

        toast("เข้าสู่ระบบสำเร็จ", {
          description: "ยินดีต้อนรับกลับมา"
        });

        // Navigate to the intended destination after login
        navigate(from, { replace: true });

      } else {
        // Sign up with sanitized inputs
        const { error } = await supabase.auth.signUp({
          email: data.email.trim(),
          password: data.password,
          options: {
            data: {
              pdpa_accepted: data.pdpaConsent,
            }
          }
        });

        if (error) throw error;

        toast("ลงทะเบียนสำเร็จ", {
          description: "กรุณาตรวจสอบอีเมลเพื่อยืนยันตัวตน"
        });

        // Stay on login screen after signup, with a friendly message shown via toast
      }
    } catch (error: any) {
      // Handle error without exposing sensitive details
      console.error('Authentication error:', error);
      
      // Display sanitized error message
      const errorMessage = isLoginView ? 
        'เข้าสู่ระบบล้มเหลว' : 
        'การลงทะเบียนล้มเหลว';
        
      toast("เกิดข้อผิดพลาด", {
        description: errorMessage + ': กรุณาตรวจสอบข้อมูลและลองใหม่อีกครั้ง'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleView = () => {
    setIsLoginView(!isLoginView);
    form.reset();
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // If already logged in, show a different view
  if (user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">คุณได้เข้าสู่ระบบแล้ว</h1>
            <p className="mb-6">คุณเข้าสู่ระบบแล้วด้วยอีเมล {user.email}</p>
            <div className="flex flex-col space-y-4">
              <Button onClick={() => navigate('/profile')} className="bg-infi-green hover:bg-infi-green-hover">
                ไปยังโปรไฟล์ของฉัน
              </Button>
              <Button onClick={() => navigate('/')} variant="outline">
                ไปยังหน้าหลัก
              </Button>
            </div>
          </div>
        </div>
        <footer className="bg-white border-t py-4">
          <div className="container mx-auto px-4 text-center text-sm text-infi-gray">
            <p>© {new Date().getFullYear()} INFIWORLD.COM - แพลตฟอร์มที่รวมบริการซื้อ-ขาย-เช่า, งานฟรีแลนซ์, การจอง, และแผนที่ร้านค้าที่รับคริปโต</p>
          </div>
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Image Section */}
        <div className="hidden md:block md:w-1/2 bg-infi-green">
          <div className="flex h-full items-center justify-center">
            <div className="text-white p-10 max-w-lg">
              <h2 className="text-3xl font-bold mb-6">INFIWORLD</h2>
              <p className="text-xl mb-6">
                แพลตฟอร์มที่รวมบริการซื้อ-ขาย-เช่า, งานฟรีแลนซ์, การจอง, และแผนที่ร้านค้าที่รับคริปโต
              </p>
              <ul className="space-y-4">
                <li className="flex items-center">
                  <span className="mr-2 bg-white text-infi-green rounded-full p-1">✓</span>
                  <span>บริการซื้อ-ขาย-เช่า</span>
                </li>
                <li className="flex items-center">
                  <span className="mr-2 bg-white text-infi-green rounded-full p-1">✓</span>
                  <span>งานฟรีแลนซ์</span>
                </li>
                <li className="flex items-center">
                  <span className="mr-2 bg-white text-infi-green rounded-full p-1">✓</span>
                  <span>บริการจอง</span>
                </li>
                <li className="flex items-center">
                  <span className="mr-2 bg-white text-infi-green rounded-full p-1">✓</span>
                  <span>แผนที่ร้านค้าที่รับคริปโต</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-4 md:p-10">
          <div className="w-full max-w-md">
            <div className="mb-8 text-center">
              <h1 className="text-2xl font-bold">
                {isLoginView ? 'เข้าสู่ระบบ' : 'สมัครสมาชิก'}
              </h1>
              <p className="text-infi-gray mt-2">
                {isLoginView
                  ? 'เข้าสู่ระบบเพื่อเข้าถึงบริการของเรา'
                  : 'สร้างบัญชีเพื่อเริ่มใช้งาน'}
              </p>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>อีเมล</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            placeholder="example@email.com"
                            autoComplete="email"
                            type="email"
                            {...field}
                            className="pr-10"
                          />
                          <Mail className="absolute right-3 top-3 text-gray-400 h-4 w-4" />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>รหัสผ่าน</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="••••••••"
                            autoComplete={isLoginView ? "current-password" : "new-password"}
                            {...field}
                            className="pr-10"
                          />
                          <button
                            type="button"
                            onClick={togglePasswordVisibility}
                            className="absolute right-3 top-3 text-gray-400"
                            aria-label={showPassword ? 'ซ่อนรหัสผ่าน' : 'แสดงรหัสผ่าน'}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {!isLoginView && (
                  <FormField
                    control={form.control}
                    name="pdpaConsent"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            id="pdpaConsent"
                            aria-label="ยินยอมให้เก็บข้อมูลส่วนบุคคล"
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel htmlFor="pdpaConsent">
                            ฉันยินยอมให้เก็บข้อมูลส่วนบุคคลตาม{" "}
                            <Link to="/privacy-policy" className="text-infi-green underline">
                              นโยบายความเป็นส่วนตัว
                            </Link>
                          </FormLabel>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />
                )}

                {isLoginView && (
                  <div className="flex items-center justify-between">
                    <FormField
                      control={form.control}
                      name="rememberMe"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              id="rememberMe"
                              aria-label="จดจำฉัน"
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel htmlFor="rememberMe">
                              จดจำฉัน
                            </FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />
                    <Link
                      to="/forgot-password"
                      className="text-sm text-infi-green hover:underline"
                    >
                      ลืมรหัสผ่าน?
                    </Link>
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full bg-infi-green hover:bg-infi-green-hover transition-transform hover:scale-[1.02]"
                  disabled={isLoading}
                >
                  {isLoading
                    ? 'กำลังดำเนินการ...'
                    : isLoginView
                    ? 'เข้าสู่ระบบ'
                    : 'สมัครสมาชิก'}
                </Button>
              </form>
            </Form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full" />
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-background px-2 text-sm text-muted-foreground">
                    หรือ
                  </span>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <Button
                  variant="outline"
                  className="w-full"
                  type="button"
                  disabled={isLoading}
                  aria-label="เข้าสู่ระบบด้วย ThaiID"
                >
                  <img
                    src="/placeholder.svg"
                    alt="ThaiID Logo"
                    className="w-5 h-5 mr-2"
                  />
                  เข้าสู่ระบบด้วย ThaiID
                </Button>
              </div>
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-infi-gray">
                {isLoginView ? "ยังไม่มีบัญชี?" : "มีบัญชีอยู่แล้ว?"}
                <button
                  type="button"
                  onClick={toggleView}
                  className="ml-1 text-infi-green hover:underline"
                  disabled={isLoading}
                >
                  {isLoginView ? "สมัครสมาชิก" : "เข้าสู่ระบบ"}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>

      <footer className="bg-white border-t py-4">
        <div className="container mx-auto px-4 text-center text-sm text-infi-gray">
          <p>© {new Date().getFullYear()} INFIWORLD.COM - แพลตฟอร์มที่รวมบริการซื้อ-ขาย-เช่า, งานฟรีแลนซ์, การจอง, และแผนที่ร้านค้าที่รับคริปโต</p>
          <div className="mt-2 space-x-4">
            <Link to="/terms" className="hover:text-infi-green">ข้อกำหนดการใช้งาน</Link>
            <Link to="/privacy-policy" className="hover:text-infi-green">นโยบายความเป็นส่วนตัว</Link>
            <Link to="/contact" className="hover:text-infi-green">ติดต่อเรา</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Auth;
