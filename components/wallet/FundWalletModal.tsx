"use client";
import React, { useState } from "react";
import { ShieldCheck, CreditCard, Check } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useToast } from "@/lib/context/ToastContext";
import * as walletService from "@/lib/api/services/wallet";
import { Modal } from "@/components/ui/Modal";
import { useMutation } from "@tanstack/react-query";
import { getErrorMessage } from "@/lib/utils/errors";

interface FundWalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  currency: string;
  userEmail: string;
}

const PROVIDERS: {
  id: "Paystack" | "PayFast" | "Manual";
  name: string;
  region: string;
  logo: string;
}[] = [
  { id: "Paystack", name: "Paystack", region: "Nigeria & Africa", logo: "PS" },
  // { id: "PayFast", name: "PayFast", region: "South Africa", logo: "PF" },
];

export function FundWalletModal({
  isOpen,
  onClose,
  onSuccess,
  currency,
  userEmail,
}: FundWalletModalProps) {
  const { toast } = useToast();
  const [amount, setAmount] = useState("");
  const [provider, setProvider] = useState<"Paystack" | "PayFast" | "Manual">(
    "Paystack",
  );

  const mutation = useMutation({
    mutationFn: walletService.fundWallet,
    onSuccess: (result) => {
      if (result.authorizationUrl) {
        toast(
          "Redirecting",
          "You are being redirected to complete your payment.",
          "success",
        );
        window.location.href = result.authorizationUrl;
      } else {
        toast(
          "Payment Initialized",
          `Reference: ${result.reference}. Please complete payment manually if required.`,
          "success",
        );
        onSuccess();
        onClose();
      }
    },
    onError: (error) => {
      toast("Funding Error", getErrorMessage(error), "error");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      toast("Invalid Amount", "Please enter a valid amount to fund", "error");
      return;
    }

    mutation.mutate({
      amount: numAmount,
      email: userEmail,
      gateway: provider,
      callbackUrl: `${window.location.origin}/wallet`,
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Fund Wallet"
      subtitle="Select a secure provider to add funds"
      icon={CreditCard}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Provider Selection */}
        <div className="space-y-4">
          <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400">
            Payment Provider
          </label>
          <div className="grid grid-cols-1 gap-4">
            {PROVIDERS.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setProvider(p.id)}
                className={`relative p-5 rounded border transition-all text-left flex flex-col gap-1 ${
                  provider === p.id
                    ? "border-gold bg-gold/5 ring-1 ring-gold"
                    : "border-gray-100 bg-white hover:border-gray-200"
                }`}
              >
                <span className="text-[11px] font-black uppercase text-black">
                  {p.name}
                </span>
                <span className="text-[8px] font-black uppercase tracking-widest text-gray-400">
                  {p.region}
                </span>
                {provider === p.id && (
                  <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-gold flex items-center justify-center">
                    <Check size={10} className="text-black" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Amount Input */}
        <div className="space-y-3">
          <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400">
            Amount ({currency})
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-gray-300">
              {currency === "NGN" ? "₦" : "$"}
            </span>
            <Input
              id="fund-amount"
              name="amount"
              type="number"
              placeholder="0.00"
              className="pl-10"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="bg-gray-50 rounded p-6 flex gap-4">
          <ShieldCheck className="text-green-500 shrink-0" size={20} />
          <p className="text-[10px] font-medium text-gray-500 leading-relaxed">
            Transactions are secured by {provider}. Your payment information is
            encrypted and processed directly by the gateway.
          </p>
        </div>

        <div className="flex gap-4">
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
            Proceed
          </Button>
        </div>
      </form>
    </Modal>
  );
}
