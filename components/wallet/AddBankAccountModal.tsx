"use client";
import React, { useState, useMemo } from "react";
import { Plus, Building2, Landmark, User, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Modal } from "@/components/ui/Modal";
import { useToast } from "@/lib/context/ToastContext";
import * as bankAccountService from "@/lib/api/services/bank-accounts";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getErrorMessage } from "@/lib/utils/errors";
import { useCurrency } from "@/lib/hooks/useCurrency";

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
  const { currency: defaultCurrency, currencySymbol } = useCurrency();

  const [formData, setFormData] = useState({
    bankName: "",
    accountName: "",
    accountNumber: "",
    bankCode: "",
    currency: defaultCurrency,
  });

  const [resolving, setResolving] = useState(false);
  const [resolved, setResolved] = useState<string | null>(null);

  const { data: supportedBanks = [], isLoading: loadingBanks } = useQuery({
    queryKey: ["supported-banks", formData.currency],
    queryFn: () => bankAccountService.getSupportedBanks(formData.currency),
    enabled: isOpen,
  });

  const handleResolveAccount = async (accountNumber: string) => {
    const acct = accountNumber.trim();
    if (!formData.bankCode || acct.length !== 10) return;
    setResolving(true);
    setResolved(null);
    try {
      const result = await bankAccountService.resolveBankAccount(
        acct,
        formData.bankCode,
        formData.currency,
      );
      if (result.accountName) {
        setFormData((prev) => ({ ...prev, accountName: result.accountName! }));
        setResolved(result.accountName);
      } else {
        toast("Resolution Failed", "Could not verify account details.", "error");
      }
    } catch (err) {
      toast("Error", getErrorMessage(err), "error");
    } finally {
      setResolving(false);
    }
  };

  const handleBankSelect = (bankId: string) => {
    const bank = supportedBanks.find((b) => b.code === bankId);
    if (bank) {
      setFormData((prev) => ({
        ...prev,
        bankName: bank.name || "",
        bankCode: bank.code || "",
      }));
      setResolved(null);
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
        currency: defaultCurrency,
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

  const currencyOptions = useMemo(() => {
    return [
      { label: `${defaultCurrency} (${currencySymbol})`, value: defaultCurrency },
    ];
  }, [defaultCurrency, currencySymbol]);

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
          id="account-number"
          label="Account Number"
          required
          placeholder="10 digits"
          value={formData.accountNumber}
          onChange={(e) => {
            const val = e.target.value;
            setFormData({ ...formData, accountNumber: val, ...(val.length !== 10 && { accountName: "" }) });
            setResolved(null);
          }}
          onBlur={(e) => handleResolveAccount(e.target.value)}
          leftSlot={
            resolving ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Landmark size={14} />
            )
          }
          rightSlot={resolved ? <CheckCircle2 size={14} className="text-green-500" /> : undefined}
        />

        <Input
          id="account-name"
          label="Account Name"
          disabled
          required
          placeholder="Auto-filled on verification"
          value={formData.accountName}
          onChange={(e) =>
            setFormData({ ...formData, accountName: e.target.value })
          }
          leftSlot={
            resolving ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <User size={14} />
            )
          }
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
