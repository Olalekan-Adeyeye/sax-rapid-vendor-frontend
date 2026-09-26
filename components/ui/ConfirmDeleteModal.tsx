"use client";
import React from "react";
import { AlertTriangle } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
  title: string;
  itemName: string | null | undefined;
  itemFallback?: string;
  keepLabel?: string;
  description: string;
}

export function ConfirmDeleteModal({
  isOpen,
  onClose,
  onConfirm,
  loading,
  title,
  itemName,
  itemFallback = "this item",
  keepLabel = "Keep",
  description,
}: ConfirmDeleteModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      subtitle="Permanent Action Warning"
      icon={AlertTriangle}
    >
      <div className="space-y-8">
        <div className="bg-red-50/50 border border-red-100/50 p-6 space-y-3">
          <p className="text-xs font-bold text-black uppercase tracking-widest leading-relaxed">
            Are you sure you want to delete{" "}
            <span className="text-red-600">
              &ldquo;{itemName || itemFallback}&rdquo;
            </span>
            ?
          </p>
          <p className="text-[10px] font-medium text-gray-500 uppercase tracking-widest leading-loose">
            {description}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="flex-1 border-gray-100 text-black hover:border-black transition-all font-black uppercase tracking-widest text-[9px]"
            onClick={onClose}
          >
            {keepLabel}
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
