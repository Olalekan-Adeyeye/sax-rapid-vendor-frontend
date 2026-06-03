"use client";
import React, { useState } from "react";
import {
  Zap,
  Check,
  X,
  Shield,
  Star,
  Rocket,
  History,
  XCircle,
  TrendingUp,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getSubscriptionPlans,
  getMySubscription,
  subscribeToPlan,
  cancelSubscription,
  getSubscriptionHistory,
} from "@/lib/api/services/subscriptions";
import { SubscriptionPlanResponse } from "@/lib/api/types/subscriptions.types";
import { useToast } from "@/lib/context/ToastContext";
import axios from "axios";
import { ApiError } from "@/lib/api/types/auth.types";
import { PageHeader } from "@/components/ui/PageHeader";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";

type TabType = "plans" | "history";

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

  const handleSubscribe = async () => {
    if (!confirmPlan) return;
    subscribeMutation.mutate({
      planId: confirmPlan.id,
      billingCycle: isYearly ? "Yearly" : "Monthly",
    });
  };

  const handleCancel = async () => {
    cancelMutation.mutate();
  };

  const getPlanIcon = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes("premium")) return Rocket;
    if (n.includes("free") || n.includes("basic")) return Shield;
    return Star;
  };

  const getPlanTier = (name: string): "premium" | "standard" | "free" => {
    const n = name.toLowerCase();
    if (n.includes("premium")) return "premium";
    if (n.includes("free") || n.includes("basic")) return "free";
    return "standard";
  };

  if (loading) {
    return (
      <div className="space-y-12 pb-20">
        <PageHeader
          title="Subscription"
          description="Manage your marketplace presence"
          actions={
            <div className="flex items-center gap-2 bg-gray-50 p-1.5 rounded-full border border-gray-100">
              <Button
                variant="black"
                rounded="full"
                size="sm"
                className="px-6 py-2 border-none h-auto bg-black text-white"
              >
                Plans & Pricing
              </Button>
              <Button
                variant="ghost"
                rounded="full"
                size="sm"
                className="px-6 py-2 border-none h-auto text-gray-400 bg-transparent"
              >
                Billing History
              </Button>
            </div>
          }
        />

        <div className="space-y-12">
          <div className="bg-white border border-gray-100 rounded p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-l-[3px] border-l-gold">
            <div className="flex items-center gap-4 min-w-0">
              <Skeleton className="w-10 h-10 bg-black shrink-0" />
              <div className="space-y-2 min-w-0">
                <div className="flex items-center gap-2">
                  <Skeleton circle className="h-3 w-24" />
                  <Skeleton circle className="h-3 w-14 bg-green-50" />
                </div>
                <Skeleton className="h-5 w-48 max-w-full" />
                <Skeleton circle className="h-3 w-32" />
              </div>
            </div>
            <Skeleton className="h-11 w-28 shrink-0" />
          </div>

          <div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
              <div>
                <h3 className="text-xl font-black uppercase tracking-tighter text-black">
                  Choose your plan
                </h3>
                <p className="text-xs font-medium text-gray-400 mt-1">
                  Upgrade anytime. No hidden fees.
                </p>
              </div>
              <div className="bg-gray-50 p-1 rounded-full flex items-center border border-gray-100 shrink-0">
                <button className="px-5 py-2 text-xs font-bold rounded-full bg-black text-white">
                  Monthly
                </button>
                <button className="px-5 py-2 text-xs font-bold rounded-full text-gray-400">
                  Yearly
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((item) => {
                const isPremium = item === 2;

                return (
                  <div
                    key={item}
                    className={`relative flex flex-col p-8 rounded transition-all duration-300 border ${
                      isPremium
                        ? "bg-black text-white border-black shadow-lg shadow-black/5"
                        : "bg-white text-black border-gray-100"
                    }`}
                  >
                    {isPremium && (
                      <Skeleton className="absolute -top-3 left-1/2 h-6 w-28 -translate-x-1/2 rounded-full bg-gold/80" />
                    )}
                    <Skeleton
                      className={`w-10 h-10 mb-5 ${
                        isPremium ? "bg-white/10" : "bg-gold/10"
                      }`}
                    />
                    <div className="space-y-3 mb-6">
                      <Skeleton
                        circle
                        className={`h-4 w-28 ${
                          isPremium ? "bg-white/15" : "bg-gray-100"
                        }`}
                      />
                      <Skeleton
                        circle
                        className={`h-3 w-full ${
                          isPremium ? "bg-white/10" : "bg-gray-50"
                        }`}
                      />
                      <Skeleton
                        circle
                        className={`h-3 w-3/4 ${
                          isPremium ? "bg-white/10" : "bg-gray-50"
                        }`}
                      />
                    </div>
                    <div className="space-y-2 mb-8">
                      <Skeleton
                        className={`h-9 w-36 ${
                          isPremium ? "bg-white/15" : "bg-gray-50"
                        }`}
                      />
                      <Skeleton
                        circle
                        className={`h-3 w-20 ${
                          isPremium ? "bg-white/10" : "bg-gray-50"
                        }`}
                      />
                    </div>
                    <div className="flex-1 space-y-3 mb-8">
                      {[1, 2, 3, 4].map((feature) => (
                        <div key={feature} className="flex items-center gap-3">
                          <Skeleton
                            circle
                            className={`w-4 h-4 ${
                              isPremium ? "bg-white/10" : "bg-gray-100"
                            }`}
                          />
                          <Skeleton
                            circle
                            className={`h-3 ${
                              feature === 1
                                ? "w-32"
                                : feature === 2
                                  ? "w-28"
                                  : "w-24"
                            } ${isPremium ? "bg-white/10" : "bg-gray-50"}`}
                          />
                        </div>
                      ))}
                    </div>
                    <Skeleton
                      className={`h-12 w-full rounded-full border-2 ${
                        isPremium
                          ? "border-white/20 bg-white/5"
                          : "border-gray-100 bg-white"
                      }`}
                    />
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-gray-50 border border-gray-100 rounded p-6 flex flex-col sm:flex-row items-center justify-between gap-5">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded bg-black flex items-center justify-center text-gold shrink-0">
                <Zap size={18} fill="currentColor" />
              </div>
              <div>
                <h4 className="text-sm font-black uppercase tracking-tighter text-black">
                  Enterprise solution?
                </h4>
                <p className="text-xs font-medium text-gray-400 mt-0.5">
                  Talk to our team for volume plans and custom integrations.
                </p>
              </div>
            </div>
            <Button
              rounded="full"
              variant="outline"
              size="sm"
              className="px-8 bg-white text-black border-2 border-black shrink-0"
            >
              Contact Sales
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-20">
      {/* Cancel Modal */}
      <Modal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        title="Cancel Subscription"
        subtitle="Are you sure you want to end your current plan?"
        icon={XCircle}
      >
        <div className="space-y-6">
          <p className="text-[12px] text-black leading-relaxed font-medium">
            Wait! Your visibility and priority support will be lost once the
            current billing cycle ends. You can still enjoy your benefits until
            the expiry date.
          </p>
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

      {/* Confirm Modal */}
      <Modal
        isOpen={!!confirmPlan}
        onClose={() => setConfirmPlan(null)}
        title="Confirm Subscription"
        subtitle="Review your plan details before proceeding"
        icon={Zap}
      >
        {confirmPlan && (
          <div className="space-y-6">
            <div className="bg-gray-50 p-6 rounded border border-gray-100">
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs font-bold text-gray-400">
                  Selected Plan
                </span>
                <span className="text-xs font-bold text-gold bg-black px-3 py-1 rounded">
                  {confirmPlan.name}
                </span>
              </div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs font-bold text-gray-400">
                  Billing Cycle
                </span>
                <span className="text-xs font-bold text-black underline decoration-gold/50">
                  {isYearly ? "Yearly (12 Months)" : "Monthly"}
                </span>
              </div>
              <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                <span className="text-xs font-bold text-black">
                  Total Price
                </span>
                <span className="text-xl font-black text-black">
                  ₦
                  {(
                    (isYearly
                      ? confirmPlan.yearlyPrice
                      : confirmPlan.monthlyPrice) || 0
                  ).toLocaleString()}
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

      {/* Page Header */}
      <PageHeader
        title="Subscription"
        description="Manage your marketplace presence"
        actions={
          <div className="flex items-center gap-2 bg-gray-50 p-1.5 rounded-full border border-gray-100">
            <Button
              onClick={() => setActiveTab("plans")}
              variant={activeTab === "plans" ? "black" : "ghost"}
              rounded="full"
              size="sm"
              className={`px-6 py-2 border-none h-auto ${activeTab === "plans" ? "bg-black text-white" : "text-gray-400 hover:text-black bg-transparent"}`}
            >
              Plans & Pricing
            </Button>
            <Button
              onClick={() => setActiveTab("history")}
              variant={activeTab === "history" ? "black" : "ghost"}
              rounded="full"
              size="sm"
              className={`px-6 py-2 border-none h-auto ${activeTab === "history" ? "bg-black text-white" : "text-gray-400 hover:text-black bg-transparent"}`}
            >
              Billing History
            </Button>
          </div>
        }
      />

      <AnimatePresence mode="wait">
        {activeTab === "plans" ? (
          <motion.div
            key="plans-tab"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="space-y-12"
          >
            {/* ── Active Subscription Banner ── */}
            {mySub && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white border border-gray-100 rounded p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-l-[3px] border-l-gold"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-10 h-10 rounded bg-black flex items-center justify-center text-gold shrink-0">
                    <Zap size={18} fill="currentColor" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                        Current Plan
                      </span>
                      <span className="flex items-center gap-1.5 text-[10px] font-bold text-green-600">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                        Active
                      </span>
                    </div>
                    <p className="text-sm font-black text-black uppercase tracking-tighter truncate">
                      {mySub.planName}
                      <span className="text-gold mx-2">•</span>
                      {mySub.billingCycle}
                    </p>
                    <p className="text-[11px] font-medium text-gray-400 mt-0.5">
                      Expires {new Date(mySub.expiryDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <Button
                  onClick={() => setShowCancelModal(true)}
                  variant="outline"
                  size="sm"
                  className="text-red-500/70 border-red-100 hover:bg-red-500 hover:text-white shrink-0"
                >
                  <XCircle size={14} /> Cancel
                </Button>
              </motion.div>
            )}

            {/* ── Plans Grid ── */}
            <div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                <div>
                  <h3 className="text-xl font-black uppercase tracking-tighter text-black">
                    Choose your plan
                  </h3>
                  <p className="text-xs font-medium text-gray-400 mt-1">
                    Upgrade anytime. No hidden fees.
                  </p>
                </div>
                <div className="bg-gray-50 p-1 rounded-full flex items-center border border-gray-100 shrink-0">
                  <button
                    onClick={() => setIsYearly(false)}
                    className={`px-5 py-2 text-xs font-bold rounded-full transition-all duration-300 ${
                      !isYearly
                        ? "bg-black text-white"
                        : "text-gray-400 hover:text-black bg-transparent"
                    }`}
                  >
                    Monthly
                  </button>
                  <button
                    onClick={() => setIsYearly(true)}
                    className={`px-5 py-2 text-xs font-bold rounded-full transition-all duration-300 ${
                      isYearly
                        ? "bg-black text-white"
                        : "text-gray-400 hover:text-black bg-transparent"
                    }`}
                  >
                    Yearly
                  </button>
                </div>
              </div>

              {plans.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {plans.map((plan, i) => {
                    const Icon = getPlanIcon(plan.name);
                    const tier = getPlanTier(plan.name);
                    const isCurrentPlan = mySub?.planId === plan.id;
                    const isPremium = tier === "premium";
                    const price = isYearly ? plan.yearlyPrice : plan.monthlyPrice;

                    return (
                      <motion.div
                        key={plan.id}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.08 }}
                        whileHover={{ y: -4 }}
                        className={`relative flex flex-col p-8 rounded transition-all duration-300 border ${isPremium ? "bg-black text-white border-black shadow-lg shadow-black/5" : "bg-white text-black border-gray-100 hover:border-black/20 hover:shadow-sm"} ${isCurrentPlan && !isPremium ? "border-t-[3px] border-t-gold" : ""}`}
                      >
                        {/* Popular badge */}
                        {isPremium && !isCurrentPlan && (
                          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gold text-black text-[9px] font-black uppercase tracking-widest px-4 py-1 rounded-full">
                            Most Popular
                          </div>
                        )}

                        {/* Current plan indicator */}
                        {isCurrentPlan && (
                          <div className="absolute top-3 right-4 text-[9px] font-black uppercase tracking-widest text-gold bg-white p-2 px-3 rounded-full">
                            Active plan
                          </div>
                        )}

                        {/* Icon */}
                        <div
                          className={`w-10 h-10 rounded flex items-center justify-center mb-5 ${
                            isPremium
                              ? "bg-white/10 text-gold"
                              : "bg-gold/10 text-gold"
                          }`}
                        >
                          <Icon size={18} />
                        </div>

                        {/* Name & desc */}
                        <h3
                          className={`text-sm font-black uppercase tracking-tighter mb-1 ${
                            isPremium ? "text-gold" : "text-black"
                          }`}
                        >
                          {plan.name}
                        </h3>
                        <p
                          className={`text-[11px] font-medium leading-relaxed mb-6 ${
                            isPremium ? "text-gray-400" : "text-gray-400"
                          }`}
                        >
                          {plan.description || "Everything you need to grow"}
                        </p>

                        {/* Price */}
                        <div className="mb-8">
                          <span className="text-3xl font-black tracking-tighter">
                            ₦{(price || 0).toLocaleString()}
                          </span>
						  <br />
                          <span
                            className={`text-xs font-bold ml-1.5 ${
                              isPremium ? "text-gray-500" : "text-gray-400"
                            }`}
                          >
                            per {isYearly ? "year" : "month"}
                          </span>
                        </div>

                        {/* Features */}
                        <div className="flex-1 space-y-3 mb-8">
                          {[
                            {
                              label: `${plan.maxProducts >= 1000000 ? "Unlimited" : plan.maxProducts.toLocaleString()} Listings`,
                              active: true,
                            },
                            {
                              label: "Sales Analytics",
                              active: plan.hasAnalytics,
                            },
                            {
                              label: "Priority Support",
                              active: plan.hasPrioritySupport,
                            },
                            {
                              label: "Product Boosting",
                              active: plan.canBoostProducts,
                            },
                          ].map((f, j) => (
                            <div
                              key={j}
                              className="flex items-center gap-3 text-xs"
                            >
                              <span
                                className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${
                                  f.active
                                    ? "bg-gold/10 text-gold"
                                    : "bg-gray-100 text-gray-300"
                                }`}
                              >
                                {f.active ? (
                                  <Check size={10} strokeWidth={4} />
                                ) : (
                                  <X size={10} strokeWidth={4} />
                                )}
                              </span>
                              <span
                                className={`font-bold ${
                                  f.active
                                    ? isPremium
                                      ? "text-gray-200"
                                      : "text-gray-700"
                                    : "text-gray-300 line-through"
                                }`}
                              >
                                {f.label}
                              </span>
                            </div>
                          ))}
                        </div>

                        {/* CTA */}
                        <Button
                          disabled={
                            isCurrentPlan || subscribeMutation.isPending
                          }
                          onClick={() => setConfirmPlan(plan)}
                          rounded="full"
                          size="sm"
                          loading={
                            subscribeMutation.isPending &&
                            confirmPlan?.id === plan.id
                          }
                          variant={
                            isCurrentPlan
                              ? "outline"
                              : isPremium
                                ? "outline"
                                : "outline"
                          }
                          className={`w-full py-3.5 text-xs font-bold border-2 transition-all duration-300 ${
                            isCurrentPlan
                              ? "bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed"
                              : isPremium
                                ? "bg-black text-white border-white/20 hover:bg-gold hover:text-black hover:border-gold"
                                : "bg-white text-black border-gray-200 hover:border-black hover:text-black"
                          }`}
                        >
                          {isCurrentPlan ? (
                            <>
                              <Check size={14} /> Current Plan
                            </>
                          ) : (
                            <>
                              <TrendingUp size={14} /> Upgrade
                            </>
                          )}
                        </Button>
                      </motion.div>
                    );
                  })}
                </div>
              ) : (
                <div className="py-20 text-center border-2 border-dashed border-gray-100 rounded">
                  <p className="text-xs font-bold text-gray-400">
                    No plans available right now
                  </p>
                </div>
              )}
            </div>

            {/* ── Enterprise CTA ── */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-gray-50 border border-gray-100 rounded p-6 flex flex-col sm:flex-row items-center justify-between gap-5"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded bg-black flex items-center justify-center text-gold shrink-0">
                  <Zap size={18} fill="currentColor" />
                </div>
                <div>
                  <h4 className="text-sm font-black uppercase tracking-tighter text-black">
                    Enterprise solution?
                  </h4>
                  <p className="text-xs font-medium text-gray-400 mt-0.5">
                    Talk to our team for volume plans and custom integrations.
                  </p>
                </div>
              </div>
              <Button
                rounded="full"
                variant="outline"
                size="sm"
                className="px-8 bg-white text-black border-2 border-black hover:bg-black hover:text-white shrink-0"
              >
                Contact Sales
              </Button>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="history-tab"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="space-y-10"
          >
            <div className="bg-white border border-gray-100 rounded overflow-hidden">
              <div className="p-8 border-b border-gray-50">
                <h3 className="text-xl font-black uppercase tracking-tighter text-black">
                  Billing History
                </h3>
                <p className="text-xs font-medium text-gray-400 mt-1">
                  Monitor your subscription cycles and payment status
                </p>
              </div>
              {history.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-100">
                        <th className="px-8 py-5 text-xs font-bold text-gray-400">
                          Plan
                        </th>
                        <th className="px-8 py-5 text-xs font-bold text-gray-400">
                          Cycle
                        </th>
                        <th className="px-8 py-5 text-xs font-bold text-gray-400 text-right">
                          Amount
                        </th>
                        <th className="px-8 py-5 text-xs font-bold text-gray-400">
                          Date Range
                        </th>
                        <th className="px-8 py-5 text-xs font-bold text-gray-400 text-center">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {history.map((item) => (
                        <tr
                          key={item.id}
                          className="hover:bg-gray-50/5 transition-colors"
                        >
                          <td className="px-8 py-6 flex items-center gap-3">
                            <Shield size={14} className="text-gold" />
                            <span className="text-sm font-black text-black uppercase">
                              {item.planName}
                            </span>
                          </td>
                          <td className="px-8 py-6 text-xs font-medium text-gray-500">
                            {item.billingCycle}
                          </td>
                          <td className="px-8 py-6 text-right font-black text-black">
                            ₦{item.amount.toLocaleString()}
                          </td>
                          <td className="px-8 py-6 text-xs font-medium text-gray-400">
                            {new Date(item.startDate).toLocaleDateString()} -{" "}
                            {new Date(item.endDate).toLocaleDateString()}
                          </td>
                          <td className="px-8 py-6 text-center">
                            <span
                              className={`inline-flex px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                                item.status.toLowerCase() === "active" ||
                                item.status.toLowerCase() === "completed"
                                  ? "bg-green-50 text-green-600 border-green-100"
                                  : "bg-red-50 text-red-500 border-red-100"
                              }`}
                            >
                              {item.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-20 text-center flex flex-col items-center">
                  <History size={48} className="text-gray-100 mb-6" />
                  <h4 className="font-black uppercase tracking-widest text-black">
                    No History
                  </h4>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
