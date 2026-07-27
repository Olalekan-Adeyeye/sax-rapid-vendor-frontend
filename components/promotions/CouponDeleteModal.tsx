import React from "react";
import { AlertTriangle } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";

interface CouponDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  couponCode: string | null | undefined;
  loading: boolean;
}

export function CouponDeleteModal({
  isOpen,
  onClose,
  onConfirm,
  couponCode,
  loading,
}: CouponDeleteModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Delete Coupon"
      subtitle="Permanent Action Warning"
      icon={AlertTriangle}
    >
      <div className="space-y-8">
        <div className="bg-red-50/50 border border-red-100/50 p-6 space-y-3">
          <p className="text-xs font-bold text-black uppercase tracking-widest leading-relaxed">
            Are you sure you want to delete{" "}
            <span className="text-red-600">
              &ldquo;{couponCode || "this coupon"}&rdquo;
            </span>
            ?
          </p>
          <p className="text-[10px] font-medium text-gray-500 uppercase tracking-widest leading-loose">
            This action cannot be undone. The coupon will be permanently removed.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="flex-1 border-gray-100 text-black hover:border-black transition-all font-black uppercase tracking-widest text-[9px]"
            onClick={onClose}
          >
            Keep Coupon
          </Button>
          <Button
            variant="black"
            className="flex-1 bg-red-600! border-red-600! text-white! hover:bg-black! hover:border-black! transition-all font-black uppercase tracking-widest text-[9px]"
            onClick={onConfirm}
            loading={loading}
          >
            Delete
          </Button>
        </div>
      </div>
    </Modal>
  );
}
