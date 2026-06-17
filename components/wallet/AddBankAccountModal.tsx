"use client";
import React, { useState } from "react";
import { Plus, Building2, Landmark, User, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Modal } from "@/components/ui/Modal";
import { useToast } from "@/lib/context/ToastContext";
import * as bankAccountService from "@/lib/api/services/bank-accounts";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
  });

  const { data: supportedBanks = [], isLoading: loadingBanks } = useQuery({
    queryKey: ["supported-banks", formData.currency],
    queryFn: () => bankAccountService.getSupportedBanks(formData.currency),
    enabled: isOpen,
  });

  const handleBankSelect = (bankId: string) => {
    const bank = supportedBanks.find((b) => b.code === bankId);
    if (bank) {
      setFormData((prev) => ({
        ...prev,
        bankName: bank.name || "",
        bankCode: bank.code || "",
      }));
    }
  };

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
          <Select
            id="bank-select"
            label="Bank"
            required
            value={formData.bankCode}
            onChange={(e) => handleBankSelect(e.target.value)}
            leftSlot={
              loadingBanks ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Building2 size={14} />
              )
            }
            options={[
              ...supportedBanks.map((b) => ({
                label: b.name || "Unknown",
                value: b.code || "",
              })),
            ]}
          />
          <Select
            id="currency"
            label="Currency"
            value={formData.currency}
            onChange={(e) => {
              setFormData({
                ...formData,
                currency: e.target.value,
                bankName: "",
                bankCode: "",
              });
            }}
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

        <div className="bg-amber-50 rounded p-6 flex gap-4 border border-amber-100/50">
          <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-amber-500 shrink-0">
            <span className="text-xs font-black">!</span>
          </div>
          <p className="text-[10px] font-medium text-amber-700/80 leading-relaxed">
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
