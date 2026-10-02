"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ArrowDownCircle,
  CreditCard,
  Banknote,
  Clock,
  CheckCircle,
  Check,
  Plus,
} from "lucide-react";
import React from "react";

import { EmptyState } from "@/components/common/EmptyState";
import { FullPageLoader } from "@/components/common/FullPageLoader";
import { StatCard } from "@/components/dashboard/StatCard";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { PageHeader } from "@/components/ui/PageHeader";
import { AddBankAccountModal } from "@/components/wallet/AddBankAccountModal";
import { WithdrawModal } from "@/components/wallet/WithdrawModal";
import * as bankAccountService from "@/lib/api/services/bank-accounts";
import * as walletService from "@/lib/api/services/wallet";
import { useAuth } from "@/lib/context/AuthContext";
import { useToast } from "@/lib/context/ToastContext";
import { useCurrency } from "@/lib/hooks/useCurrency";
import { formatCurrency, resolveCurrency } from "@/lib/utils/currency";
import { getErrorMessage } from "@/lib/utils/errors";

export default function PayoutsPage() {
  const queryClient = useQueryClient();
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = React.useState(false);
  const [isAddBankModalOpen, setIsAddBankModalOpen] = React.useState(false);
  const [deleteTarget, setDeleteTarget] = React.useState<string | null>(null);

  const { toast } = useToast();
  const { isAuthenticated } = useAuth();
  const { currency: regionCurrency } = useCurrency();

  const { data: wallet, isLoading: loadingWallet } = useQuery({
    queryKey: ["vendor-wallet"],
    queryFn: walletService.getWalletDetails,
    enabled: isAuthenticated,
  });

  const activeCurrency = resolveCurrency(wallet?.currency, regionCurrency);

  const { data: bankAccounts = [], isLoading: loadingBankAccounts } = useQuery({
    queryKey: ["bank-accounts"],
    queryFn: bankAccountService.getBankAccounts,
    enabled: isAuthenticated,
  });

  const setDefaultMutation = useMutation({
    mutationFn: bankAccountService.setDefaultBankAccount,
    onSuccess: () => {
      toast(
        "Primary Updated",
        "Default payout method has been updated.",
        "success",
      );
      queryClient.invalidateQueries({ queryKey: ["bank-accounts"] });
    },
    onError: (error) => {
      toast("Error", getErrorMessage(error), "error");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: bankAccountService.deleteBankAccount,
    onSuccess: () => {
      toast("Bank Removed", "Bank account has been deleted.", "success");
      queryClient.invalidateQueries({ queryKey: ["bank-accounts"] });
      setDeleteTarget(null);
    },
    onError: (error) => {
      toast("Error", getErrorMessage(error), "error");
    },
  });

  const isInitialLoading =
    (loadingWallet && !wallet) ||
    (loadingBankAccounts && bankAccounts.length === 0);

  if (isInitialLoading) {
    return <FullPageLoader label="Loading payouts..." icon={ArrowDownCircle} />;
  }

  return (
    <div className="space-y-10">
      <PageHeader
        title="Withdrawals"
        description="Request and track your payouts to your bank account"
        actions={
          <>
            <Button
              variant="outline"
              rounded="full"
              size="sm"
              className="px-8 py-3.5 bg-gray-100!"
              onClick={() => setIsAddBankModalOpen(true)}
            >
              <Plus size={16} />
              Add Bank Account
            </Button>
            <Button
              onClick={() => setIsWithdrawModalOpen(true)}
              rounded="full"
              size="sm"
              className="px-8 py-3.5"
            >
              <ArrowDownCircle size={16} />
              Request Withdrawal
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        <StatCard
          icon={Banknote}
          title="Available Balance"
          value={formatCurrency(wallet?.balance || 0, activeCurrency)}
          detail="Ready for payout"
        />
        <StatCard
          icon={Clock}
          title="Pending Balance"
          value={formatCurrency(wallet?.pendingBalance || 0, activeCurrency)}
          detail="Awaiting settlement"
          variant="dark"
        />
        <StatCard
          icon={CheckCircle}
          title="Total Balance"
          value={formatCurrency(
            (wallet?.balance || 0) + (wallet?.pendingBalance || 0),
            activeCurrency,
          )}
          detail="Combined value"
        />
      </div>

      <div className="bg-white border border-gray-100 rounded overflow-hidden">
        <div className="p-8 border-b border-gray-50 flex items-center justify-between gap-6">
          <h4 className="text-sm font-bold text-black">Payout Methods</h4>
        </div>
        <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {bankAccounts.length > 0 ? (
            bankAccounts.map((method) => (
              <div
                key={method.id}
                className="bg-gray-50/50 border border-gray-100 rounded p-6 group hover:border-black hover:bg-white transition-all"
              >
                <div className="flex items-center gap-6">
                  <div className="w-12 h-12 rounded bg-white border border-gray-100 flex items-center justify-center text-gray-400 group-hover:bg-black group-hover:text-white transition-all">
                    <CreditCard size={20} />
                  </div>
                  <div>
                    <h5 className="text-sm font-bold text-black">
                      {method.bankName}
                    </h5>
                    <p className="text-xs font-bold text-gray-400 mt-1">
                      **** {method.accountNumber?.slice(-4) || "0000"} ·{" "}
                      {method.accountName}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-4 pl-18">
                  {!method.isDefault && (
                    <button
                      onClick={() => setDefaultMutation.mutate(method.id)}
                      disabled={setDefaultMutation.isPending}
                      className="text-[9px] font-black uppercase tracking-widest text-gray-300 hover:text-green-600 transition-colors px-2 py-1 rounded hover:bg-green-50"
                    >
                      Set as Primary
                    </button>
                  )}
                  <button
                    onClick={() => setDeleteTarget(method.id)}
                    disabled={deleteMutation.isPending}
                    className="text-[9px] font-black uppercase tracking-widest text-gray-300 hover:text-red-500 transition-colors px-2 py-1 rounded hover:bg-red-50"
                  >
                    Remove
                  </button>
                  {method.isDefault && (
                    <span className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded bg-white border border-gray-100 text-gray-400 group-hover:border-black group-hover:text-black transition-all">
                      <Check size={10} />
                      Primary
                    </span>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full">
              <EmptyState
                icon={CreditCard}
                title="No bank accounts added yet"
                className="py-12"
              />
            </div>
          )}
        </div>
      </div>

      <WithdrawModal
        isOpen={isWithdrawModalOpen}
        onClose={() => setIsWithdrawModalOpen(false)}
        onSuccess={() => {
          queryClient.invalidateQueries({ queryKey: ["vendor-wallet"] });
        }}
        availableBalance={wallet?.balance || 0}
        currency={wallet?.currency || activeCurrency}
      />

      <AddBankAccountModal
        isOpen={isAddBankModalOpen}
        onClose={() => setIsAddBankModalOpen(false)}
      />

      <Modal
        isOpen={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        title="Remove Bank Account"
        subtitle="This action cannot be undone"
      >
        <div className="space-y-6">
          <p className="text-xs font-bold text-gray-500 leading-relaxed">
            Are you sure you want to remove this bank account? You will no
            longer be able to withdraw to this account.
          </p>
          <div className="flex gap-4">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setDeleteTarget(null)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              className="flex-1 bg-red-500 hover:bg-red-600 text-white"
              loading={deleteMutation.isPending}
              onClick={() => {
                if (deleteTarget) deleteMutation.mutate(deleteTarget);
              }}
            >
              Remove
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
