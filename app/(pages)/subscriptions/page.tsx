"use client";

import React, { useState } from "react";
import {
  CalendarDays,
  Check,
  History,
  Rocket,
  Shield,
  Star,
  XCircle,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  cancelSubscription,
  getMySubscription,
  getSubscriptionHistory,
  getSubscriptionPlans,
  subscribeToPlan,
} from "@/lib/api/services/subscriptions";
import { SubscriptionPlanResponse } from "@/lib/api/types/subscriptions.types";
import { useToast } from "@/lib/context/ToastContext";
import axios from "axios";
import { ApiError } from "@/lib/api/types/auth.types";
import { PageHeader } from "@/components/ui/PageHeader";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { FullPageLoader } from "@/components/common/FullPageLoader";
import { formatCurrency } from "@/lib/utils/currency";

type TabType = "plans" | "history";

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString("en-NG", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

export default function SubscriptionPlansPage() {
  const [activeTab, setActiveTab] = useState<TabType>("plans");
  const [isYearly, setIsYearly] = useState(false);
  const [confirmPlan, setConfirmPlan] =
    useState<SubscriptionPlanResponse | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: plansData, isLoading: loadingPlans } = useQuery({
    queryKey: ["subscription-plans"],
    queryFn: () => getSubscriptionPlans(),
  });

  const { data: mySub, isLoading: loadingSub } = useQuery({
    queryKey: ["my-subscription"],
    queryFn: getMySubscription,
  });

  const { data: historyData } = useQuery({
    queryKey: ["subscription-history"],
    queryFn: getSubscriptionHistory,
  });

  const subscribeMutation = useMutation({
    mutationFn: subscribeToPlan,
    onSuccess: () => {
      toast("Success", "Successfully subscribed!", "success");
      setConfirmPlan(null);
      queryClient.invalidateQueries({ queryKey: ["my-subscription"] });
      queryClient.invalidateQueries({ queryKey: ["subscription-history"] });
    },
    onError: (error: unknown) => {
      let errorMessage = "Something went wrong";
      if (axios.isAxiosError<ApiError>(error)) {
        errorMessage = error.response?.data?.message || errorMessage;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      toast("Subscription Failed", errorMessage, "error");
    },
  });

  const cancelMutation = useMutation({
    mutationFn: cancelSubscription,
    onSuccess: () => {
      toast("Success", "Subscription cancelled successfully", "success");
      setShowCancelModal(false);
      queryClient.invalidateQueries({ queryKey: ["my-subscription"] });
      queryClient.invalidateQueries({ queryKey: ["subscription-history"] });
    },
    onError: (error: unknown) => {
      let errorMessage = "Failed to cancel subscription";
      if (axios.isAxiosError<ApiError>(error)) {
        errorMessage = error.response?.data?.message || errorMessage;
      }
      toast("Action Failed", errorMessage, "error");
    },
  });

  const plans = (plansData || []).sort(
    (a, b) => (a.displayOrder || 0) - (b.displayOrder || 0),
  );
  const history = historyData || [];
  const loading = loadingPlans || loadingSub;

  const handleSubscribe = () => {
    if (!confirmPlan) return;
    subscribeMutation.mutate({
      planId: confirmPlan.id,
      billingCycle: isYearly ? "Yearly" : "Monthly",
    });
  };

  const handleCancel = () => {
    cancelMutation.mutate();
  };

  const getPlanIcon = (name: string) => {
    const normalizedName = name.toLowerCase();
    if (normalizedName.includes("premium")) return Rocket;
    if (normalizedName.includes("free") || normalizedName.includes("basic")) {
      return Shield;
    }
    return Star;
  };

  const getPlanFeatures = (plan: SubscriptionPlanResponse) => [
    {
      label: `${plan.maxProducts >= 1000000 ? "Unlimited" : plan.maxProducts.toLocaleString()} products`,
      enabled: true,
    },
    { label: "Sales analytics", enabled: plan.hasAnalytics },
    { label: "Priority support", enabled: plan.hasPrioritySupport },
    { label: "Product boosting", enabled: plan.canBoostProducts },
  ];

  if (loading) {
    return <FullPageLoader label="Loading plans..." icon={Zap} />;
  }

  return (
    <div className="space-y-10 pb-16">
      <Modal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        title="Cancel Subscription"
        subtitle="Are you sure you want to end your current plan?"
        icon={XCircle}
      >
        <div className="space-y-6">
          <div className="bg-red-50/50 border border-red-100 rounded p-5">
            <p className="text-xs text-red-500 leading-relaxed font-bold">
              Your plan benefits remain active until the current billing cycle
              ends, but renewals will stop after cancellation.
            </p>
          </div>
          <div className="flex gap-4">
            <Button
              variant="outline"
              fullWidth
              onClick={() => setShowCancelModal(false)}
              disabled={cancelMutation.isPending}
            >
              Keep Plan
            </Button>
            <Button
              variant="black"
              fullWidth
              onClick={handleCancel}
              loading={cancelMutation.isPending}
              className="bg-red-500! text-white! border-red-500! hover:bg-black! hover:border-black!"
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={!!confirmPlan}
        onClose={() => setConfirmPlan(null)}
        title="Confirm Subscription"
        subtitle="Review your selection before continuing"
        icon={Zap}
      >
        {confirmPlan && (
          <div className="space-y-6">
            <div className="bg-gray-50 border border-gray-100 rounded p-6 space-y-5">
              <div className="flex items-center justify-between gap-4">
                <span className="text-xs font-bold text-gray-400">Plan</span>
                <span className="text-xs font-black text-black">
                  {confirmPlan.name}
                </span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-xs font-bold text-gray-400">Cycle</span>
                <span className="text-xs font-black text-black">
                  {isYearly ? "Yearly" : "Monthly"}
                </span>
              </div>
              <div className="border-t border-gray-100 pt-5 flex items-center justify-between gap-4">
                <span className="text-xs font-black text-black">Total</span>
                <span className="text-2xl font-black tracking-tighter text-black">
                  {formatCurrency(
                    isYearly
                      ? confirmPlan.yearlyPrice
                      : confirmPlan.monthlyPrice,
                  )}
                </span>
              </div>
            </div>
            <div className="flex gap-4">
              <Button
                variant="outline"
                fullWidth
                onClick={() => setConfirmPlan(null)}
                disabled={subscribeMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                fullWidth
                onClick={handleSubscribe}
                loading={subscribeMutation.isPending}
                disabled={subscribeMutation.isPending}
              >
                Confirm
              </Button>
            </div>
          </div>
        )}
      </Modal>

      <PageHeader
        title="Subscription"
        description="Choose a plan that fits your store growth"
        actions={
          <div className="flex items-center gap-2 bg-gray-50 p-1 rounded-full border border-gray-100">
            {(["plans", "history"] as const).map((tab) => (
              <Button
                key={tab}
                onClick={() => setActiveTab(tab)}
                variant={activeTab === tab ? "black" : "ghost"}
                rounded="full"
                size="sm"
                className={`px-5 py-2 border-none h-auto capitalize ${
                  activeTab === tab
                    ? "bg-black text-gold"
                    : "bg-transparent text-gray-400 hover:text-black"
                }`}
              >
                {tab === "plans" ? "Plans" : "History"}
              </Button>
            ))}
          </div>
        }
      />

      <AnimatePresence mode="wait">
        {activeTab === "plans" ? (
          <motion.div
            key="plans-tab"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="space-y-10"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-7 bg-black text-white rounded p-8 lg:p-10 overflow-hidden">
                <div className="flex flex-col h-full justify-between gap-10">
                  <div className="space-y-4">
                    <div className="w-12 h-12 rounded bg-white/10 text-gold flex items-center justify-center">
                      <Zap size={22} fill="currentColor" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-2xl lg:text-3xl font-black tracking-tighter">
                        Grow your marketplace presence without the clutter.
                      </h3>
                      <p className="text-sm font-medium text-gray-400 max-w-xl leading-relaxed">
                        Upgrade when you need more listings, analytics, product
                        boosts, or priority support.
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {["Simple pricing", "Flat cards", "Flexible billing"].map(
                      (label) => (
                        <div
                          key={label}
                          className="bg-white/5 border border-white/10 rounded p-4"
                        >
                          <p className="text-[10px] font-black uppercase tracking-widest text-gold">
                            {label}
                          </p>
                        </div>
                      ),
                    )}
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5 bg-white border border-gray-100 rounded p-8 flex flex-col justify-between gap-8">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-bold text-gray-400 mb-2">
                      Current Plan
                    </p>
                    <h4 className="text-2xl font-black tracking-tighter text-black">
                      {mySub?.planName || "No active plan"}
                    </h4>
                  </div>
                  <span
                    className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      mySub?.isActive
                        ? "bg-green-50 text-green-600"
                        : "bg-gray-50 text-gray-400"
                    }`}
                  >
                    {mySub?.isActive ? "Active" : "Inactive"}
                  </span>
                </div>

                {mySub ? (
                  <div className="space-y-4">
                    <div className="bg-gray-50 rounded p-5 flex items-center gap-4">
                      <CalendarDays size={18} className="text-gold" />
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                          Expires
                        </p>
                        <p className="text-sm font-black text-black">
                          {formatDate(mySub.expiryDate)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs font-bold text-gray-500">
                      <span>Billing cycle</span>
                      <span className="text-black">{mySub.billingCycle}</span>
                    </div>
                    <Button
                      onClick={() => setShowCancelModal(true)}
                      variant="outline"
                      size="sm"
                      rounded="full"
                      className="w-fit text-red-500 border-red-100 hover:bg-red-50 hover:border-red-100"
                    >
                      <XCircle size={14} /> Cancel Subscription
                    </Button>
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded p-5">
                    <p className="text-xs font-bold text-gray-500 leading-relaxed">
                      Select one of the plans below to activate premium store
                      tools.
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h3 className="text-xl font-black tracking-tighter text-black">
                  Plans & Pricing
                </h3>
                <p className="text-sm font-medium text-gray-500 mt-1">
                  Less noise, clearer choices.
                </p>
              </div>
              <div className="bg-gray-50 p-1 rounded-full flex items-center border border-gray-100 self-start">
                <Button
                  onClick={() => setIsYearly(false)}
                  variant={!isYearly ? "black" : "ghost"}
                  rounded="full"
                  size="sm"
                  className={`px-6 py-2 border-none h-auto ${
                    !isYearly
                      ? "bg-black text-gold"
                      : "bg-transparent text-gray-400 hover:text-black"
                  }`}
                >
                  Monthly
                </Button>
                <Button
                  onClick={() => setIsYearly(true)}
                  variant={isYearly ? "black" : "ghost"}
                  rounded="full"
                  size="sm"
                  className={`px-6 py-2 border-none h-auto ${
                    isYearly
                      ? "bg-black text-gold"
                      : "bg-transparent text-gray-400 hover:text-black"
                  }`}
                >
                  Yearly
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {plans.length > 0 ? (
                plans.map((plan, index) => {
                  const Icon = getPlanIcon(plan.name);
                  const isCurrentPlan = mySub?.planId === plan.id;
                  const isPremium = plan.name.toLowerCase().includes("premium");
                  const price = isYearly ? plan.yearlyPrice : plan.monthlyPrice;
                  const features = getPlanFeatures(plan);

                  return (
                    <motion.div
                      key={plan.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.06 }}
                      className={`relative rounded border p-6 flex flex-col gap-7 ${
                        isPremium
                          ? "bg-black text-white border-black"
                          : "bg-white text-black border-gray-100"
                      }`}
                    >
                      {isCurrentPlan && (
                        <span className="absolute top-5 right-5 bg-green-50 text-green-600 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest">
                          Active
                        </span>
                      )}

                      <div className="space-y-5">
                        <div
                          className={`w-12 h-12 rounded flex items-center justify-center ${
                            isPremium
                              ? "bg-white/10 text-gold"
                              : "bg-gray-50 text-gold"
                          }`}
                        >
                          <Icon size={20} />
                        </div>
                        <div className="space-y-2 pr-16">
                          <h4
                            className={`text-lg font-black tracking-tighter ${
                              isPremium ? "text-white" : "text-black"
                            }`}
                          >
                            {plan.name}
                          </h4>
                          <p
                            className={`text-xs font-medium leading-relaxed line-clamp-2 ${
                              isPremium ? "text-gray-400" : "text-gray-500"
                            }`}
                          >
                            {plan.description || "Everything you need to grow."}
                          </p>
                        </div>
                      </div>

                      <div>
                        <p
                          className={`text-3xl font-black tracking-tighter ${
                            isPremium ? "text-gold" : "text-black"
                          }`}
                        >
                          {formatCurrency(price || 0)}
                        </p>
                        <p
                          className={`text-xs font-bold mt-1 ${
                            isPremium ? "text-gray-500" : "text-gray-400"
                          }`}
                        >
                          per {isYearly ? "year" : "month"}
                        </p>
                      </div>

                      <div className="grid grid-cols-1 gap-3 flex-1">
                        {features.map((feature) => (
                          <div
                            key={feature.label}
                            className={`flex items-center gap-3 rounded p-3 ${
                              isPremium ? "bg-white/5" : "bg-gray-50"
                            } ${!feature.enabled ? "opacity-45" : ""}`}
                          >
                            <div
                              className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                                feature.enabled
                                  ? "bg-gold/10 text-gold"
                                  : isPremium
                                    ? "bg-white/5 text-gray-500"
                                    : "bg-white text-gray-300"
                              }`}
                            >
                              <Check size={12} strokeWidth={4} />
                            </div>
                            <span
                              className={`text-xs font-bold ${
                                isPremium ? "text-gray-300" : "text-black"
                              }`}
                            >
                              {feature.label}
                            </span>
                          </div>
                        ))}
                      </div>

                      <Button
                        disabled={isCurrentPlan || subscribeMutation.isPending}
                        onClick={() => setConfirmPlan(plan)}
                        rounded="full"
                        size="sm"
                        loading={
                          subscribeMutation.isPending &&
                          confirmPlan?.id === plan.id
                        }
                        variant={isPremium ? "outline" : "black"}
                        className={`w-full py-4 ${
                          isCurrentPlan
                            ? "bg-gray-100 text-gray-400 border-gray-100 cursor-not-allowed"
                            : isPremium
                              ? "bg-white text-black border-white hover:bg-gold hover:border-gold"
                              : ""
                        }`}
                      >
                        {isCurrentPlan ? (
                          <>
                            <Check className="w-4 h-4" /> Current Plan
                          </>
                        ) : (
                          <>
                            <Zap className="w-4 h-4" /> Choose Plan
                          </>
                        )}
                      </Button>
                    </motion.div>
                  );
                })
              ) : (
                <div className="col-span-full py-20 text-center border border-dashed border-gray-100 rounded bg-white">
                  <p className="text-xs font-bold text-gray-500">
                    No subscription plans are available yet.
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="history-tab"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="bg-white border border-gray-100 rounded overflow-hidden"
          >
            <div className="p-8 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-black tracking-tighter text-black">
                  Billing History
                </h3>
                <p className="text-sm font-medium text-gray-500 mt-1">
                  A clean record of your subscription activity.
                </p>
              </div>
              <span className="bg-gray-50 text-gray-500 px-4 py-2 rounded-full text-xs font-bold">
                {history.length} records
              </span>
            </div>

            {history.length > 0 ? (
              <div className="divide-y divide-gray-50">
                {history.map((item) => {
                  const isSuccessful =
                    item.status.toLowerCase() === "active" ||
                    item.status.toLowerCase() === "completed";

                  return (
                    <div
                      key={item.id}
                      className="p-6 lg:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-gray-50/50 transition-colors"
                    >
                      <div className="flex items-center gap-5">
                        <div className="w-12 h-12 rounded bg-gray-50 text-gold flex items-center justify-center">
                          <History size={18} />
                        </div>
                        <div>
                          <h4 className="text-sm font-black text-black">
                            {item.planName}
                          </h4>
                          <p className="text-xs font-bold text-gray-400 mt-1">
                            {item.billingCycle} · {formatDate(item.startDate)}{" "}
                            - {formatDate(item.endDate)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 md:justify-end">
                        <p className="text-sm font-black text-black">
                          {formatCurrency(item.amount)}
                        </p>
                        <span
                          className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest ${
                            isSuccessful
                              ? "bg-green-50 text-green-600"
                              : "bg-red-50 text-red-500"
                          }`}
                        >
                          {item.status}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-20 text-center flex flex-col items-center">
                <div className="w-16 h-16 rounded bg-gray-50 text-gray-300 flex items-center justify-center mb-6">
                  <History size={28} />
                </div>
                <h4 className="font-black tracking-tight text-black">
                  No billing history yet
                </h4>
                <p className="text-sm font-medium text-gray-400 mt-2">
                  Your subscription payments will appear here.
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
