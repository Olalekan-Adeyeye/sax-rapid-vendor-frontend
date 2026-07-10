"use client";
import React from "react";
import {
  ArrowDownCircle,
  CreditCard,
  Banknote,
  Clock,
  CheckCircle,
  Check,
  Plus,
} from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as walletService from "@/lib/api/services/wallet";
import * as bankAccountService from "@/lib/api/services/bank-accounts";
import { formatCurrency } from "@/lib/utils/currency";
import { useCurrency } from "@/lib/hooks/useCurrency";
import { formatDate } from "@/lib/utils/date";
import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/ui/PageHeader";
import { EmptyState } from "@/components/common/EmptyState";
import { SearchInput } from "@/components/ui/SearchInput";
import { Modal } from "@/components/ui/Modal";
import { useToast } from "@/lib/context/ToastContext";
import { getErrorMessage } from "@/lib/utils/errors";
import { Loader2 } from "lucide-react";

import { WithdrawModal } from "@/components/wallet/WithdrawModal";
import { AddBankAccountModal } from "@/components/wallet/AddBankAccountModal";

export default function PayoutsPage() {
  const queryClient = useQueryClient();
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = React.useState(false);
  const [isAddBankModalOpen, setIsAddBankModalOpen] = React.useState(false);
  const [searchInput, setSearchInput] = React.useState("");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [deleteTarget, setDeleteTarget] = React.useState<string | null>(null);

  const { toast } = useToast();
  const { currency: activeCurrency } = useCurrency();

  const { data: wallet, isLoading: loadingWallet } = useQuery({
    queryKey: ["vendor-wallet"],
    queryFn: walletService.getWalletDetails,
  });

  const { data: bankAccounts = [] } = useQuery({
    queryKey: ["bank-accounts"],
    queryFn: bankAccountService.getBankAccounts,
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

  const loadingTransactions = loadingWallet;
  const transactions = wallet?.recentTransactions || [];

  const withdrawals = transactions.filter(
    (t) =>
      t.transactionType?.toLowerCase() === "withdrawal" ||
      t.transactionType?.toLowerCase() === "payout",
  );

  const filteredWithdrawals = withdrawals.filter(
    (w) =>
      w.transactionReference
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      (w.id && w.id.toLowerCase().includes(searchQuery.toLowerCase())),
  );

  return (
    <div className="space-y-10">
      <PageHeader
        title="Withdrawals"
        description="Request and track your payouts to your bank account"
        actions={
          <Button
            onClick={() => setIsWithdrawModalOpen(true)}
            rounded="full"
            size="sm"
            className="px-8 py-3.5"
          >
            <ArrowDownCircle size={16} />
            Request Withdrawal
          </Button>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        <StatCard
          icon={Banknote}
          title="Available Balance"
          value={formatCurrency(wallet?.balance || 0, activeCurrency)}
          detail="Ready for payout"
          isLoading={loadingWallet}
        />
        <StatCard
          icon={Clock}
          title="Pending Balance"
          value={formatCurrency(wallet?.pendingBalance || 0, activeCurrency)}
          detail="Awaiting settlement"
          isLoading={loadingWallet}
          variant="dark"
        />
        <StatCard
          icon={CheckCircle}
          title="Total Balance"
          value={formatCurrency((wallet?.balance || 0) + (wallet?.pendingBalance || 0), activeCurrency)}
          detail="Combined value"
          isLoading={loadingWallet}
        />
      </div>

      <div className="bg-white border border-gray-100 rounded overflow-hidden">
        <div className="p-8 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <h4 className="text-sm font-bold text-black">Payout Methods</h4>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsAddBankModalOpen(true)}
            className="text-xs font-bold text-gold hover:text-black"
          >
            <Plus size={14} />
            Add Bank Account
          </Button>
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
              <EmptyState icon={CreditCard} title="No bank accounts added yet" className="py-12" />
            </div>
          )}
        </div>
      </div>

      <div className="bg-white border border-gray-100 rounded overflow-hidden">
        <div className="p-8 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <h4 className="text-sm font-bold text-black uppercase tracking-widest">
            Payout History
          </h4>
          <div className="flex flex-wrap items-center gap-3">
            <SearchInput
              placeholder="Search payouts..."
              variant="muted"
              focusColor="gold"
              value={searchInput}
              onChange={setSearchInput}
              onSearch={setSearchQuery}
              disabled={loadingTransactions}
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-250">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {["Payout ID", "Amount", "Reference", "Status", "Date"].map(
                  (th) => (
                    <th
                      key={th}
                      className="px-8 py-5 text-[9px] font-black uppercase tracking-[0.2em] text-gray-400"
                    >
                      {th}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loadingTransactions ? (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center">
                    <Loader2
                      className="animate-spin text-gold mx-auto mb-4"
                      size={40}
                    />
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                      Loading History...
                    </p>
                  </td>
                </tr>
              ) : filteredWithdrawals.length > 0 ? (
                filteredWithdrawals.map((p, index) => (
                  <tr
                    key={p.id || `payout-${index}`}
                    className="hover:bg-gray-50/50 transition-colors group"
                  >
                    <td className="px-8 py-5 text-xs font-black text-black">
                      #{p.id ? p.id.slice(0, 8) : "N/A"}
                    </td>
                    <td className="px-8 py-5 text-xs font-black text-black">
                      {formatCurrency(p.amount, activeCurrency)}
                    </td>
                    <td className="px-8 py-5 text-xs font-bold text-gray-400">
                      {p.transactionReference || "SYSTEM-PAY"}
                    </td>
                    <td className="px-8 py-5">
                      <span
                        className={`text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded ${
                          p.status === "Completed"
                            ? "bg-green-50 text-green-600"
                            : "bg-blue-50 text-blue-600"
                        }`}
                      >
                        {p.status}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      {formatDate(p.transactionDate)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5}>
                    <EmptyState icon={Banknote} title="No payout records found" />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <WithdrawModal
        isOpen={isWithdrawModalOpen}
        onClose={() => setIsWithdrawModalOpen(false)}
        onSuccess={() => {
          queryClient.invalidateQueries({ queryKey: ["vendor-wallet"] });
        }}
        availableBalance={wallet?.balance || 0}
        currency={wallet?.currency || "NGN"}
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
