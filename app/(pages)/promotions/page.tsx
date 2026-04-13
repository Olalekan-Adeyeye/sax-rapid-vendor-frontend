"use client";
import React, { useState, useEffect, useCallback } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import {
	Plus,
	Tag,
	Rocket,
	Star,
	Zap,
	Trash2,
	Edit3,
	BarChart3,
	Clock,
	AlertCircle,
	FileText,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { SearchInput } from "@/components/ui/SearchInput";
import { CreateCouponModal } from "@/components/promotions/CreateCouponModal";
import { CreateCampaignModal } from "@/components/promotions/CreateCampaignModal";
import { ConfigureFeaturedModal } from "@/components/promotions/ConfigureFeaturedModal";
import {
	getCoupons,
	getCouponStats,
	deleteCoupon,
} from "@/lib/api/services/coupons";
import type {
	CouponListItemDTO,
	CouponStatsDTO,
} from "@/lib/api/types/coupons.types";
import { useToast } from "@/lib/context/ToastContext";
import { formatDate } from "@/lib/utils/date";
import { FullPageLoader } from "@/components/common/FullPageLoader";

export default function PromotionsPage() {
	const { toast } = useToast();
	const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
	const [isCampaignModalOpen, setIsCampaignModalOpen] = useState(false);
	const [isFeaturedModalOpen, setIsFeaturedModalOpen] = useState(false);

	const [coupons, setCoupons] = useState<CouponListItemDTO[]>([]);
	const [stats, setStats] = useState<CouponStatsDTO | null>(null);
	const [loading, setLoading] = useState(true);
	const [editingCoupon, setEditingCoupon] = useState<CouponListItemDTO | null>(
		null,
	);

	const fetchData = useCallback(async () => {
		try {
			setLoading(true);
			const [couponsData, statsData] = await Promise.all([
				getCoupons(),
				getCouponStats(),
			]);
			setCoupons(couponsData);
			setStats(statsData);
		} catch (err) {
			console.error("Failed to fetch promotions data:", err);
			toast("Error", "Failed to load promotions data", "error");
		} finally {
			setLoading(false);
		}
	}, [toast]);

	useEffect(() => {
		fetchData();
	}, [fetchData]);

	const handleDeleteCoupon = async (id: string) => {
		if (!confirm("Are you sure you want to delete this coupon?")) return;
		try {
			await deleteCoupon(id);
			toast("Success", "Coupon deleted successfully", "success");
			fetchData();
		} catch {
			toast("Error", "Failed to delete coupon", "error");
		}
	};

	const handleEditCoupon = (coupon: CouponListItemDTO) => {
		setEditingCoupon(coupon);
		setIsCouponModalOpen(true);
	};

	const promoCards = [
		{
			title: "Discount Coupons",
			desc: "Create percentage or fixed amount discounts for your customers.",
			icon: Tag,
			color: "bg-gold/20",
			action: "New Coupon",
			onClick: () => {
				setEditingCoupon(null);
				setIsCouponModalOpen(true);
			},
		},
		{
			title: "Promotional Campaigns",
			desc: "Launch time-limited store wide sales or seasonal events.",
			icon: Rocket,
			color: "bg-black text-white",
			action: "Start Campaign",
			onClick: () => setIsCampaignModalOpen(true),
		},
		{
			title: "Featured Products",
			desc: "Organize products manually for your store home page.",
			icon: Star,
			color: "bg-gray-50",
			action: "Configure",
			onClick: () => setIsFeaturedModalOpen(true),
		},
	];

	if (loading && !coupons.length && !stats) {
		return <FullPageLoader />;
	}

	return (
		<div className="space-y-12">
			<PageHeader
				title="Promotions"
				description="Create discount coupons and marketing campaigns"
				actions={
					<Button
						onClick={() => {
							setEditingCoupon(null);
							setIsCouponModalOpen(true);
						}}
						rounded="full"
						variant="black"
						size="sm"
						className="px-8 flex items-center gap-3"
					>
						<Plus size={16} />
						Create Promotion
					</Button>
				}
			/>

			{/* Stats Section */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
				{[
					{
						label: "Total Coupons",
						value: stats?.totalCoupons || 0,
						icon: FileText,
						color: "text-blue-600",
						bg: "bg-blue-50",
					},
					{
						label: "Active Now",
						value: stats?.activeNow || 0,
						icon: Zap,
						color: "text-green-600",
						bg: "bg-green-50",
					},
					{
						label: "Expired",
						value: stats?.expired || 0,
						icon: Clock,
						color: "text-red-600",
						bg: "bg-red-50",
					},
					{
						label: "Drafts",
						value: stats?.drafts || 0,
						icon: AlertCircle,
						color: "text-gray-600",
						bg: "bg-gray-100",
					},
				].map((stat, i) => (
					<div
						key={i}
						className="bg-white p-6 rounded border border-gray-100 flex items-center justify-between"
					>
						<div>
							<p className="text-xs font-medium text-gray-400 mb-1">
								{stat.label}
							</p>
							<h4 className="text-2xl font-black text-black">{stat.value}</h4>
						</div>
						<div
							className={`w-12 h-12 rounded flex items-center justify-center ${stat.bg} ${stat.color}`}
						>
							<stat.icon size={20} />
						</div>
					</div>
				))}
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
				{promoCards.map((promo, i) => (
					<div
						key={i}
						className={`p-8 lg:p-10 rounded border border-gray-100 flex flex-col justify-between group hover:border-gold transition-all ${
							promo.color === "bg-black text-white"
								? "bg-black text-white"
								: "bg-white text-black"
						}`}
					>
						<div className="mb-10">
							<div
								className={`w-14 h-14 rounded flex items-center justify-center mb-6 group-hover:scale-110 transition-transform ${
									promo.color === "bg-black text-white"
										? "bg-white/10 text-gold"
										: "bg-gold/20 text-gold"
								}`}
							>
								<promo.icon size={24} />
							</div>
							<h3 className="text-base font-bold mb-4">{promo.title}</h3>
							<p className="text-xs font-medium leading-relaxed opacity-60">
								{promo.desc}
							</p>
						</div>
						<Button
							onClick={promo.onClick}
							rounded="full"
							variant={
								promo.color === "bg-black text-white" ? "outline" : "outline"
							}
							className={`w-full py-3.5 border-none h-auto ${
								promo.color === "bg-black text-white"
									? "bg-white text-black hover:bg-gold"
									: "bg-transparent border border-gray-100 hover:border-black hover:text-black"
							}`}
						>
							{promo.action}
						</Button>
					</div>
				))}
			</div>

			<div className="bg-white border border-gray-100 rounded overflow-hidden">
				<div className="p-8 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-6">
					<h4 className="text-sm font-bold text-black flex items-center gap-3">
						<BarChart3 size={14} className="text-gold" />
						Coupon History & Campaigns
					</h4>
					<div className="flex flex-wrap items-center gap-3">
						<SearchInput placeholder="Search promotions..." variant="muted" />
					</div>
				</div>
				<div className="overflow-x-auto text-black">
					<table className="w-full text-left min-w-250">
						<thead className="bg-gray-50 border-b border-gray-100">
							<tr>
								{[
									"Promotion Code",
									"Type",
									"Value",
									"Usage",
									"Status",
									"Expiry Date",
									"Actions",
								].map((th) => (
									<th
										key={th}
										className="px-8 py-5 text-[9px] font-black uppercase tracking-[0.2em] text-gray-400"
									>
										{th}
									</th>
								))}
							</tr>
						</thead>
						<tbody className="divide-y divide-gray-50">
							{coupons.length > 0 ? (
								coupons.map((coupon) => (
									<tr
										key={coupon.id}
										className="hover:bg-gray-50/50 transition-colors group"
									>
										<td className="px-8 py-5 text-xs font-bold text-black">
											{coupon.code}
										</td>
										<td className="px-8 py-5 text-xs font-bold text-gray-400 capitalize">
											{coupon.discountType}
										</td>
										<td className="px-8 py-5 text-xs font-bold text-gold">
											{coupon.discountType === "percentage"
												? `${coupon.value}%`
												: `₦${coupon.value.toLocaleString()}`}
										</td>
										<td className="px-8 py-5 text-xs font-bold text-gray-500">
											{coupon.usedCount} / {coupon.usageLimit || "∞"}
										</td>
										<td className="px-8 py-5">
											<span
												className={`text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded ${
													coupon.status === "Active"
														? "bg-green-50 text-green-600"
														: coupon.status === "Expired"
															? "bg-red-50 text-red-600"
															: "bg-gray-100 text-gray-400"
												}`}
											>
												{coupon.status}
											</span>
										</td>
										<td className="px-8 py-5 text-xs font-bold text-gray-400">
											{coupon.expiryDate
												? formatDate(new Date(coupon.expiryDate))
												: "No Expiry"}
										</td>
										<td className="px-8 py-5">
											<div className="flex items-center gap-2">
												<button
													onClick={() => handleEditCoupon(coupon)}
													className="p-2 hover:bg-gray-100 rounded text-gray-400 hover:text-black transition-colors"
													title="Edit Coupon"
												>
													<Edit3 size={14} />
												</button>
												<button
													onClick={() => handleDeleteCoupon(coupon.id)}
													className="p-2 hover:bg-red-50 rounded text-gray-400 hover:text-red-600 transition-colors"
													title="Delete Coupon"
												>
													<Trash2 size={14} />
												</button>
											</div>
										</td>
									</tr>
								))
							) : (
								<tr>
									<td colSpan={7} className="px-8 py-20 text-center">
										<div className="flex flex-col items-center gap-3">
											<Tag size={32} className="text-gray-100" />
											<p className="text-xs font-bold text-gray-300">
												No promotion history found
											</p>
										</div>
									</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>
			</div>

			{/* Modals */}
			<CreateCouponModal
				isOpen={isCouponModalOpen}
				onClose={() => {
					setIsCouponModalOpen(false);
					setEditingCoupon(null);
				}}
				onSuccess={fetchData}
				initialData={editingCoupon}
			/>
			<CreateCampaignModal
				isOpen={isCampaignModalOpen}
				onClose={() => setIsCampaignModalOpen(false)}
			/>
			<ConfigureFeaturedModal
				isOpen={isFeaturedModalOpen}
				onClose={() => setIsFeaturedModalOpen(false)}
			/>
		</div>
	);
}
