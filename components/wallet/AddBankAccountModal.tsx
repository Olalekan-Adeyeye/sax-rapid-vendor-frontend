"use client";
import React, { useState } from "react";
import { Plus, Building2, Landmark, User, BadgeCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Modal } from "@/components/ui/Modal";
import { useToast } from "@/lib/context/ToastContext";
import * as bankAccountService from "@/lib/api/services/bank-accounts";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getErrorMessage } from "@/lib/utils/errors";

interface AddBankAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddBankAccountModal({
  isOpen,
  onClose,
}: AddBankAccountModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    bankName: "",
    accountName: "",
    accountNumber: "",
    bankCode: "",
    currency: "NGN",
    isDefault: false,
  });

  const mutation = useMutation({
    mutationFn: bankAccountService.addBankAccount,
    onSuccess: () => {
      toast(
        "Bank Account Added",
        "Your bank account has been saved successfully.",
        "success",
      );
      queryClient.invalidateQueries({ queryKey: ["bank-accounts"] });
      setFormData({
        bankName: "",
        accountName: "",
        accountNumber: "",
        bankCode: "",
        currency: "NGN",
        isDefault: false,
      });
      onClose();
    },
    onError: (error) => {
      toast("Error", getErrorMessage(error), "error");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({
      bankName: formData.bankName,
      accountName: formData.accountName,
      accountNumber: formData.accountNumber,
      bankCode: formData.bankCode,
      currency: formData.currency,
      isDefault: formData.isDefault,
    });
  };

  const currencyOptions = [
    { label: "NGN (₦)", value: "NGN" },
    { label: "ZAR (R)", value: "ZAR" },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Bank Account"
      subtitle="Link a bank account for vendor payouts"
      icon={Plus}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <Input
            id="bank-name"
            label="Bank Name"
            required
            placeholder="e.g. Guaranty Trust Bank"
            value={formData.bankName}
            onChange={(e) =>
              setFormData({ ...formData, bankName: e.target.value })
            }
            leftSlot={<Building2 size={14} />}
          />
          <Select
            id="currency"
            label="Currency"
            value={formData.currency}
            onChange={(e) =>
              setFormData({ ...formData, currency: e.target.value })
            }
            options={currencyOptions}
          />
        </div>

        <Input
          id="account-name"
          label="Account Name"
          required
          placeholder="e.g. John Doe"
          value={formData.accountName}
          onChange={(e) =>
            setFormData({ ...formData, accountName: e.target.value })
          }
          leftSlot={<User size={14} />}
        />

        <div className="grid grid-cols-2 gap-6">
          <Input
            id="account-number"
            label="Account Number"
            required
            placeholder="10 digits"
            value={formData.accountNumber}
            onChange={(e) =>
              setFormData({ ...formData, accountNumber: e.target.value })
            }
            leftSlot={<Landmark size={14} />}
          />
          <Input
            id="bank-code"
            label="Bank Code"
            required
            placeholder="e.g. 058"
            value={formData.bankCode}
            onChange={(e) =>
              setFormData({ ...formData, bankCode: e.target.value })
            }
            leftSlot={<BadgeCheck size={14} />}
          />
        </div>

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.isDefault}
            onChange={(e) =>
              setFormData({ ...formData, isDefault: e.target.checked })
            }
            className="w-4 h-4 rounded border-gray-300 text-gold focus:ring-gold"
          />
          <span className="text-xs font-bold text-gray-600">
            Set as default bank account
          </span>
        </label>

        <div className="bg-amber-50 rounded p-6 flex gap-4 border border-amber-100/50">
          <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-amber-500 shrink-0">
            <span className="text-xs font-black">!</span>
          </div>
          <p className="text-[10px] font-medium text-amber-700/80 leading-relaxed italic">
            Please ensure the bank details match your vendor registration
            documents to avoid payout delays.
          </p>
        </div>

        <div className="flex gap-4 pt-4">
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            className="flex-1"
            loading={mutation.isPending}
          >
            Add Account
          </Button>
        </div>
      </form>
    </Modal>
  );
}
