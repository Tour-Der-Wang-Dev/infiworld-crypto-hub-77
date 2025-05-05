
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { formatCurrency } from "@/components/payments/utils/formatUtils";
import { AlertCircle, CheckCircle, Wallet } from "lucide-react";

interface EscrowReleaseModalProps {
  open: boolean;
  onClose: () => void;
  transactionId: string;
  sellerName?: string;
  itemDetails?: string;
  amount: number;
  currency?: string;
  onConfirm: (transactionId: string) => Promise<void>;
}

export const EscrowReleaseModal = ({
  open,
  onClose,
  transactionId,
  sellerName = "ผู้ขาย",
  itemDetails = "สินค้า/บริการ",
  amount,
  currency = "THB",
  onConfirm
}: EscrowReleaseModalProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [confirmRelease, setConfirmRelease] = useState(false);

  const handleRelease = async () => {
    if (!confirmRelease) return;
    
    setIsProcessing(true);
    try {
      await onConfirm(transactionId);
      onClose();
    } catch (error) {
      console.error("Error in escrow release:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5 text-green-600" />
            ยืนยันการปล่อยเงินจาก Escrow
          </DialogTitle>
          <DialogDescription>
            เมื่อคุณปล่อยเงินจากบัญชี Escrow เงินจะถูกโอนให้กับผู้ขายทันที
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4 space-y-4">
          <div className="rounded-md bg-blue-50 p-4 border border-blue-200">
            <h3 className="font-semibold text-blue-800 mb-2">ข้อมูลธุรกรรม Escrow</h3>
            <ul className="space-y-2 text-sm text-blue-700">
              <li><span className="font-medium">รายการ:</span> {itemDetails}</li>
              <li><span className="font-medium">ผู้ขาย:</span> {sellerName}</li>
              <li><span className="font-medium">จำนวนเงิน:</span> {formatCurrency(amount, currency)}</li>
              <li><span className="font-medium">รหัสธุรกรรม:</span> {transactionId.substring(0, 8)}...</li>
            </ul>
          </div>
          
          <div className="flex items-center p-3 bg-amber-50 border border-amber-200 rounded-md">
            <AlertCircle className="h-5 w-5 text-amber-600 mr-2" />
            <p className="text-sm text-amber-700">เมื่อปล่อยเงิน Escrow แล้วจะไม่สามารถเรียกคืนได้</p>
          </div>
          
          <div className="flex items-start space-x-2 pt-2">
            <Checkbox 
              id="confirm-release" 
              checked={confirmRelease}
              onCheckedChange={(checked) => setConfirmRelease(checked as boolean)}
              disabled={isProcessing}
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
          <Button variant="outline" onClick={onClose} disabled={isProcessing}>
            ยกเลิก
          </Button>
          <Button 
            onClick={handleRelease} 
            disabled={!confirmRelease || isProcessing}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            {isProcessing ? (
              <>กำลังดำเนินการ...</>
            ) : (
              <>
                <CheckCircle className="mr-2 h-4 w-4" />
                ปล่อยเงินให้ผู้ขาย
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
