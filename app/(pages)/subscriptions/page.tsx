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
import {
	SubscriptionPlanResponse,
} from "@/lib/api/types/subscriptions.types";
import { useToast } from "@/lib/context/ToastContext";
import axios from "axios";
import { ApiError } from "@/lib/api/types/auth.types";
import { PageHeader } from "@/components/ui/PageHeader";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { FullPageLoader } from "@/components/common/FullPageLoader";

type TabType = "plans" | "history";

export default function SubscriptionPlansPage() {
	const [activeTab, setActiveTab] = useState<TabType>("plans");
	const [isYearly, setIsYearly] = useState(false);
	const [confirmPlan, setConfirmPlan] = useState<SubscriptionPlanResponse | null>(null);
	const [showCancelModal, setShowCancelModal] = useState(false);
	const { toast } = useToast();
	const queryClient = useQueryClient();

	// Queries
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

	// Mutations
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

	const plans = (plansData || []).sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
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

	const getPlanColor = (name: string) => {
		const n = name.toLowerCase();
		if (n.includes("premium")) return "bg-black";
		if (n.includes("free") || n.includes("basic")) return "bg-gray-50";
		return "bg-gold/5";
	};

	if (loading) {
		return <FullPageLoader label="Loading plans..." icon={Zap} />;
	}

	return (
		<div className="space-y-10 pb-20">
			{/* Modals */}
			<Modal
				isOpen={showCancelModal}
				onClose={() => setShowCancelModal(false)}
				title="Cancel Subscription"
				subtitle="Are you sure you want to end your current plan?"
				icon={XCircle}
			>
				<div className="space-y-6 text-center">
					<p className="text-[11px] text-gray-400 leading-relaxed font-medium">
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

			{/* Header & Tabs */}
			<PageHeader
				className="border-b border-gray-100 pb-10"
				title="Subscription"
				description={
					activeTab === "plans"
						? "Manage your marketplace presence"
						: "Track your transaction record"
				}
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
						initial={{ opacity: 0, x: -10 }}
						animate={{ opacity: 1, x: 0 }}
						exit={{ opacity: 0, x: 10 }}
						className="space-y-10"
					>
						{mySub && (
							<motion.div
								initial={{ opacity: 0, y: -10 }}
								animate={{ opacity: 1, y: 0 }}
								className="bg-gray-50 border border-gray-100 p-8 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-8 group shadow-sm"
							>
								<div className="flex items-center gap-6">
									<div className="w-14 h-14 rounded bg-black flex items-center justify-center text-gold shrink-0">
										<Zap size={24} fill="currentColor" />
									</div>
									<div>
										<p className="text-xs font-bold text-gray-500 mb-1">
											Current Active Plan
										</p>
										<h4 className="text-lg font-black uppercase tracking-tighter text-black">
											{mySub.planName} <span className="text-gold mx-2">•</span>{" "}
											{mySub.billingCycle}
										</h4>
									</div>
								</div>
								<div className="flex flex-col md:items-end gap-2 text-center md:text-right">
									<p className="text-xs font-bold text-gray-500">
										Validity Period
									</p>
									<div className="flex items-center gap-4">
										<span className="block text-sm font-black text-black">
											Expires: {new Date(mySub.expiryDate).toLocaleDateString()}
										</span>
										<span className="px-4 py-1.5 bg-green-50 text-green-600 text-xs font-bold rounded border border-green-100 flex items-center gap-2">
											<div className="w-1.5 h-1.5 rounded bg-green-500 animate-pulse" />{" "}
											Active
										</span>
									</div>
									<Button
										onClick={() => setShowCancelModal(true)}
										variant="outline"
										size="sm"
										className="text-red-500/80 border-red-100 hover:bg-red-500 hover:text-white px-5 py-2.5 mt-4"
									>
										<XCircle size={14} /> Cancel Subscription
									</Button>
								</div>
							</motion.div>
						)}

						<div className="flex items-center gap-6 mb-10 border-b border-gray-50">
							<div className="flex-1 flex flex-col md:flex-row md:items-center justify-between gap-6">
								<div>
									<h3 className="text-2xl font-black uppercase tracking-tighter text-black">
										Marketplace Tier
									</h3>
									<p className="text-xs font-bold text-gray-500 mt-1">
										Upgrade your shop to unlock premium growth features
									</p>
								</div>
								<div className="bg-gray-50 p-1.5 rounded flex items-center border border-gray-100 self-start">
									<Button
										onClick={() => setIsYearly(false)}
										variant={!isYearly ? "black" : "ghost"}
										size="sm"
										className={`px-6 py-2 border-none h-auto ${!isYearly ? "bg-black text-white" : "text-gray-400 hover:text-black bg-transparent"}`}
									>
										Monthly
									</Button>
									<Button
										onClick={() => setIsYearly(true)}
										variant={isYearly ? "black" : "ghost"}
										size="sm"
										className={`px-6 py-2 border-none h-auto ${isYearly ? "bg-black text-white" : "text-gray-400 hover:text-black bg-transparent"}`}
									>
										Yearly
									</Button>
								</div>
							</div>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
							{plans.length > 0 ? (
								plans.map((plan, i) => {
									const Icon = getPlanIcon(plan.name);
									const colorClass = getPlanColor(plan.name);
									const isCurrentPlan = mySub?.planId === plan.id;
									const isBlack = colorClass === "bg-black";
									const price = isYearly ? plan.yearlyPrice : plan.monthlyPrice;

									return (
										<motion.div
											key={plan.id}
											initial={{ opacity: 0, y: 20 }}
											animate={{ opacity: 1, y: 0 }}
											transition={{ delay: i * 0.1 }}
											whileHover={{ y: -5 }}
											className={`relative flex flex-col p-10 rounded overflow-hidden transition-all border ${isBlack ? "bg-black text-white border-black" : "bg-white text-black border-gray-100 hover:border-black"} ${isCurrentPlan && !isBlack ? "ring-2 ring-gold" : ""} hover:-translate-y-2`}
										>
											{isCurrentPlan && (
												<div className="absolute top-0 right-0 bg-black text-green-500 text-[10px] font-bold px-5 py-2.5 rounded-bl border-b border-l border-green-500/20">
													CURRENT PLAN
												</div>
											)}
											<div className="mb-10 flex items-center gap-4">
												<div
													className={`w-12 h-12 rounded flex items-center justify-center transition-transform hover:scale-105 ${isBlack ? "bg-white/10 text-gold" : "bg-gold/10 text-gold"}`}
												>
													<Icon size={24} />
												</div>
												<div>
													<h3
														className={`text-base font-bold ${isBlack ? "text-gold" : "text-black"}`}
													>
														{plan.name}
													</h3>
													<p
														className={`text-xs font-medium ${isBlack ? "text-gray-400" : "text-gray-500"}`}
													>
														{plan.description || "Everything you need to grow"}
													</p>
												</div>
											</div>
											<div className="mb-10 text-4xl font-black tracking-tighter">
												₦{(price || 0).toLocaleString()}
												<span
													className={`text-xs font-bold ml-2 ${isBlack ? "text-gray-500" : "text-gray-400"}`}
												>
													{isYearly ? "/Year" : "/Month"}
												</span>
											</div>
											<div className="flex-1 space-y-5 mb-12">
												{[
													{
														label: `${plan.maxProducts >= 1000000 ? "Unlimited" : plan.maxProducts} Listings`,
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
														className="flex items-center gap-4 group"
													>
														<div
															className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${f.active ? "bg-gold/10 text-gold" : "bg-gray-50 text-gray-200"}`}
														>
															{f.active ? (
																<Check size={12} strokeWidth={4} />
															) : (
																<X size={12} strokeWidth={4} />
															)}
														</div>
														<span
															className={`text-sm font-bold ${!f.active ? "text-gray-500 opacity-30" : isBlack ? "text-gray-300" : "text-black"}`}
														>
															{f.label}
														</span>
													</div>
												))}
											</div>
											<Button
												disabled={isCurrentPlan || subscribeMutation.isPending}
												onClick={() => setConfirmPlan(plan)}
												rounded="full"
												size="sm"
												loading={subscribeMutation.isPending && confirmPlan?.id === plan.id}
												variant={isCurrentPlan ? "outline" : isBlack ? "outline" : "outline"}
												className={`w-full py-4 border-2 ${isCurrentPlan ? "bg-gray-100 text-gray-400 border-gray-100 cursor-not-allowed" : isBlack ? "bg-white text-black border-white hover:bg-gold hover:border-gold" : "bg-white text-black border-gray-100 hover:border-black hover:text-black"}`}
											>
												{isCurrentPlan ? (
													<>
														<Check className="w-4 h-4" /> Active
													</>
												) : (
													<>
														<Zap className="w-4 h-4" /> Get Started
													</>
												)}
											</Button>
										</motion.div>
									);
								})
							) : (
								<div className="col-span-full py-20 text-center border-2 border-dashed border-gray-100 rounded">
									<p className="text-xs font-bold text-gray-500">
										No Marketplace Tiers Available
									</p>
								</div>
							)}
						</div>
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							className="bg-gray-50 p-10 rounded flex flex-col lg:flex-row items-center justify-between gap-10 border border-gray-100 relative overflow-hidden group"
						>
							<div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 rounded blur-3xl -mr-32 -mt-32 transition-transform group-hover:scale-150" />
							<div className="flex items-center gap-8 relative truncate max-w-full">
								<div className="w-16 h-16 rounded bg-black flex items-center justify-center text-gold shrink-0 rotate-3 group-hover:rotate-0 transition-transform">
									<Zap size={28} fill="currentColor" />
								</div>
								<div className="text-left">
									<h4 className="text-sm font-black uppercase tracking-tighter text-black">
										Enterprise solution?
									</h4>
									<p className="text-xs font-medium text-gray-500 leading-relaxed max-w-sm mt-1">
										Talk to our accounts team for specialized volume plans and
										custom integrations.
									</p>
								</div>
							</div>
							<Button
								rounded="full"
								variant="outline"
								size="sm"
								className="px-10 bg-white text-black border-2 border-black hover:bg-black hover:text-white"
							>
								Contact Sales
							</Button>
						</motion.div>
					</motion.div>
				) : (
					<motion.div
						key="history-tab"
						initial={{ opacity: 0, x: 10 }}
						animate={{ opacity: 1, x: 0 }}
						exit={{ opacity: 0, x: -10 }}
						className="space-y-10"
					>
						<div className="bg-white border border-gray-100 rounded overflow-hidden">
							<div className="p-8 border-b border-gray-50">
								<h3 className="text-2xl font-black uppercase tracking-tighter text-black">
									Billing History
								</h3>
								<p className="text-xs font-bold text-gray-500 mt-1">
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
															className={`inline-flex px-4 py-1.5 rounded text-xs font-bold border ${item.status.toLowerCase() === "active" || item.status.toLowerCase() === "completed" ? "bg-green-50 text-green-600 border-green-100" : "bg-red-50 text-red-500 border-red-100"}`}
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
