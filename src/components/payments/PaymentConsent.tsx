
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";

interface PaymentConsentProps {
  onConsentChange: (consented: boolean) => void;
}

export const PaymentConsent = ({ onConsentChange }: PaymentConsentProps) => {
  const [isConsenting, setIsConsenting] = useState(false);
  const [hasConsented, setHasConsented] = useState(false);
  const { user } = useAuth();

  const handleConsentChange = async (checked: boolean) => {
    if (!user) {
      toast("กรุณาเข้าสู่ระบบก่อนทำรายการ", {
        description: "ต้องเข้าสู่ระบบเพื่อใช้งานบริการชำระเงิน"
      });
      return;
    }

    setIsConsenting(true);
    
    if (checked) {
      try {
        // Record user's PDPA consent
        const { error } = await supabase.from("payment_consents").insert({
          user_id: user.id,
          ip_address: "client-side", // Would ideally be captured server-side
        });

        if (error) throw error;

        // Update user's profile consent status
        await supabase
          .from("profiles")
          .update({ payment_consent_status: "consented" })
          .eq("id", user.id);

        setHasConsented(true);
        onConsentChange(true);
        toast.success("ขอบคุณสำหรับการยินยอม", {
          description: "เราจะเก็บรักษาข้อมูลของคุณอย่างปลอดภัย"
        });
      } catch (error) {
        console.error("Failed to record consent:", error);
        toast.error("ไม่สามารถบันทึกการยินยอมได้", {
          description: "กรุณาลองใหม่อีกครั้งในภายหลัง"
        });
      }
    } else {
      setHasConsented(false);
      onConsentChange(false);
    }
    
    setIsConsenting(false);
  };

  return (
    <div className="rounded-lg border p-4 mb-4 bg-gray-50">
      <div className="flex items-start space-x-2">
        <Checkbox 
          id="payment-consent" 
          checked={hasConsented}
          disabled={isConsenting}
          onCheckedChange={handleConsentChange}
          aria-describedby="payment-consent-description"
        />
        <div className="grid gap-1.5 leading-none">
          <Label 
            htmlFor="payment-consent"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            ยินยอมให้เก็บข้อมูลการชำระเงิน (PDPA Consent)
          </Label>
          <p className="text-sm text-muted-foreground" id="payment-consent-description">
            ฉันยินยอมให้ INFIWORLD เก็บข้อมูลการชำระเงินเพื่อวัตถุประสงค์ในการทำธุรกรรม และการรักษาความปลอดภัย 
            เราจะใช้ข้อมูลของคุณตามนโยบายความเป็นส่วนตัวเท่านั้น
          </p>
        </div>
      </div>
    </div>
  );
};
