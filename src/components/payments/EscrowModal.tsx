
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import { LoaderCircle, ShieldAlert } from "lucide-react";

interface EscrowModalProps {
  open: boolean;
  onClose: () => void;
  escrowId: string;
  paymentId: string;
  sellerName: string;
  itemName: string;
  amount: number;
  currency?: string;
  onSuccess?: () => void;
}

export function EscrowModal({
  open,
  onClose,
  escrowId,
  paymentId,
  sellerName,
  itemName,
  amount,
  currency = "THB",
  onSuccess
}: EscrowModalProps) {
  const [isReleasing, setIsReleasing] = useState(false);
  const [confirmRelease, setConfirmRelease] = useState(false);
  const { user } = useAuth();

  const handleReleaseEscrow = async () => {
    if (!user || !confirmRelease) return;
    
    setIsReleasing(true);
    
    try {
      // Update escrow status
      const { error: escrowError } = await supabase
        .from("escrow_transactions")
        .update({
          escrow_status: "released",
          release_date: new Date().toISOString()
        })
        .eq("id", escrowId);
        
      if (escrowError) throw escrowError;
      
      // Update payment status
      const { error: paymentError } = await supabase
        .from("payments")
        .update({ payment_status: "completed" })
        .eq("id", paymentId);
        
      if (paymentError) throw paymentError;
      
      toast.success("ปล่อยเงินจากบัญชี Escrow สำเร็จ", {
        description: `เงินจำนวน ${amount.toLocaleString()} ${currency} ได้ถูกโอนให้กับผู้ขายเรียบร้อยแล้ว`
      });
      
      if (onSuccess) {
        onSuccess();
      }
      
      onClose();
    } catch (error: any) {
      console.error("Escrow release error:", error);
      toast.error("เกิดข้อผิดพลาดในการปล่อยเงิน", {
        description: error.message || "กรุณาลองใหม่อีกครั้ง"
      });
    } finally {
      setIsReleasing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-amber-500" />
            ยืนยันการปล่อยเงินจาก Escrow
          </DialogTitle>
          <DialogDescription>
            เมื่อคุณปล่อยเงินจากบัญชี Escrow เงินจะถูกโอนให้กับผู้ขายทันที
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4 space-y-4">
          <div className="rounded-md bg-amber-50 p-4 border border-amber-200">
            <h3 className="font-semibold text-amber-800 mb-2">ข้อมูลธุรกรรม Escrow</h3>
            <ul className="space-y-2 text-sm text-amber-700">
              <li><span className="font-medium">รายการ:</span> {itemName}</li>
              <li><span className="font-medium">ผู้ขาย:</span> {sellerName}</li>
              <li><span className="font-medium">จำนวนเงิน:</span> {amount.toLocaleString()} {currency}</li>
            </ul>
          </div>
          
          <div className="flex items-start space-x-2 pt-2">
            <Checkbox 
              id="confirm-release" 
              checked={confirmRelease}
              onCheckedChange={(checked) => setConfirmRelease(checked as boolean)}
            />
            <div className="grid gap-1.5 leading-none">
              <Label 
                htmlFor="confirm-release"
                className="text-sm font-medium leading-none"
              >
                ฉันยืนยันว่าได้รับสินค้าหรือบริการเรียบร้อยแล้ว
              </Label>
              <p className="text-xs text-muted-foreground">
                และยอมรับว่าเมื่อปล่อยเงินแล้วจะไม่สามารถย้อนกลับหรือขอคืนเงินได้
              </p>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isReleasing}>
            ยกเลิก
          </Button>
          <Button 
            onClick={handleReleaseEscrow} 
            disabled={!confirmRelease || isReleasing}
            className="bg-amber-600 hover:bg-amber-700"
          >
            {isReleasing ? (
              <>
                <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                กำลังดำเนินการ...
              </>
            ) : (
              'ปล่อยเงินให้ผู้ขาย'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
