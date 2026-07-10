"use client";
import React, { useState } from "react";
import { ArrowUpRight, Building2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { useToast } from "@/lib/context/ToastContext";
import * as walletService from "@/lib/api/services/wallet";
import * as bankAccountService from "@/lib/api/services/bank-accounts";
import { Modal } from "@/components/ui/Modal";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getErrorMessage } from "@/lib/utils/errors";
import type { BankAccountResponseDTO } from "@/lib/api/types/bank-accounts.types";

interface WithdrawModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  availableBalance: number;
  currency: string;
}

export function WithdrawModal({
  isOpen,
  onClose,
  onSuccess,
  availableBalance,
  currency,
}: WithdrawModalProps) {
  const { toast } = useToast();

  const { data: bankAccounts = [] } = useQuery<BankAccountResponseDTO[]>({
    queryKey: ["bank-accounts"],
    queryFn: bankAccountService.getBankAccounts,
    enabled: isOpen,
  });

  const [formData, setFormData] = useState({
    amount: "",
    bankAccountId: "",
  });

  const mutation = useMutation({
    mutationFn: walletService.withdraw,
    onSuccess: () => {
      toast(
        "Payout Requested",
        "Expect your funds in the secondary account within 24-48 hours",
        "success",
      );
      onSuccess();
      onClose();
    },
    onError: (error) => {
      toast("Withdrawal Failed", getErrorMessage(error), "error");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(formData.amount);

    if (isNaN(numAmount) || numAmount <= 0) {
      toast(
        "Invalid Amount",
        "Please enter a valid amount to withdraw",
        "error",
      );
      return;
    }

    if (numAmount > availableBalance) {
      toast(
        "Insufficient Funds",
        "The withdrawal amount exceeds your available balance",
        "error",
      );
      return;
    }

    if (!formData.bankAccountId) {
      toast(
        "Bank Account Required",
        "Please select a bank account to withdraw to",
        "error",
      );
      return;
    }

    mutation.mutate({
      amount: numAmount,
      bankAccountId: formData.bankAccountId,
      currency,
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Request Payout"
      subtitle="Withdraw funds to your bank account"
      icon={ArrowUpRight}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-gray-300">
                {currency === "NGN" ? "₦" : "$"}
              </span>
              <Input
                id="withdraw-amount"
                label="Amount to Withdraw"
                type="number"
                placeholder="0.00"
                className="pl-10"
                value={formData.amount}
                onChange={(e) =>
                  setFormData({ ...formData, amount: e.target.value })
                }
                required
              />
            </div>
            <p className="text-[9px] font-black uppercase text-gray-800">
              Available: {currency} {availableBalance.toLocaleString()}
            </p>
          </div>
          <div className="space-y-3">
            <Select
              id="bank-account"
              label="Bank Account"
              value={formData.bankAccountId}
              onChange={(e) =>
                setFormData({ ...formData, bankAccountId: e.target.value })
              }
              required
              leftSlot={<Building2 size={14} />}
              options={[
                ...bankAccounts.map((acc) => ({
                  label: `${acc.bankName || ""} - ${acc.accountNumber || ""}${acc.isDefault ? " (Default)" : ""}`,
                  value: acc.id,
                })),
              ]}
            />
          </div>
        </div>

        <div className="bg-amber-50 rounded p-6 flex gap-4 border border-amber-100/50">
          <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-amber-500 shrink-0">
            <span className="text-xs font-black">!</span>
          </div>
          <p className="text-[10px] font-medium text-amber-700/80 leading-relaxed">
            Withdrawals are subject to 24h verification. Ensure your bank
            details precisely match your vendor registration documents to avoid
            delays.
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
            Payout
          </Button>
        </div>
      </form>
    </Modal>
  );
}
