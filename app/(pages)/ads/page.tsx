"use client";
import React, { useState } from "react";
import {
	Rocket,
	Star,
	Eye,
	Plus,
	Wallet as WalletIcon,
	AlertCircle,
	CheckCircle,
	ShoppingBag,
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
	getBoostPricing,
	getMyBoosts,
	boostProduct,
} from "@/lib/api/services/boost";
import * as walletService from "@/lib/api/services/wallet";
import { getMyVendorProfile } from "@/lib/api/services/vendor";
import { getProducts } from "@/lib/api/services/products";
import type {
	BoostPricingResponseDTO,
	BoostType,
} from "@/lib/api/types/boost.types";
import { formatCurrency } from "@/lib/utils/currency";
import { useToast } from "@/lib/context/ToastContext";
import { ErrorComponent } from "@/components/ui/ErrorComponent";
import { Modal } from "@/components/ui/Modal";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { FullPageLoader } from "@/components/common/FullPageLoader";
import { EmptyState } from "@/components/common/EmptyState";
import { PageHeader } from "@/components/ui/PageHeader";
import { BoostTypePickerModal } from "@/components/promotions/BoostTypePickerModal";
import { getErrorMessage } from "@/lib/utils/errors";

export default function BoostAdsPage() {
	const { toast } = useToast();
	const queryClient = useQueryClient();
	const [selectedDays, setSelectedDays] = useState(7);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isBoostTypePickerOpen, setIsBoostTypePickerOpen] = useState(false);
	const [selectedBoost, setSelectedBoost] = useState<BoostPricingResponseDTO | null>(null);
	const [selectedProductId, setSelectedProductId] = useState<string>("");

	// Queries
	const { data: vendor } = useQuery({
		queryKey: ["vendor-profile"],
		queryFn: getMyVendorProfile,
	});

	const { data: pricingData, isLoading: loadingPricing } = useQuery({
		queryKey: ["boost-pricing"],
		queryFn: getBoostPricing,
	});

	const { data: activeBoostsData, isLoading: loadingBoosts } = useQuery({
		queryKey: ["my-boosts"],
		queryFn: () => getMyBoosts(),
	});

	const { data: wallet, isLoading: loadingWallet } = useQuery({
		queryKey: ["vendor-wallet"],
		queryFn: walletService.getWalletDetails,
	});


	const { data: productsData, isLoading: loadingProducts } = useQuery({
		queryKey: ["vendor-products", vendor?.userId],
		queryFn: () => (vendor ? getProducts({ VendorId: vendor.userId, PageIndex: 1, PageSize: 100 }) : null),
		enabled: !!vendor?.userId,
	});

	const pricing = pricingData || [];
	const products = productsData?.items || [];
	const activeBoosts = activeBoostsData || [];
	
	const errors = [
		loadingPricing ? null : pricingData === undefined ? "Pricing failed" : null,
		loadingBoosts ? null : activeBoostsData === undefined ? "Boosts failed" : null,
		loadingWallet ? null : wallet === undefined ? "Wallet failed" : null,
		loadingProducts ? null : productsData === undefined ? "Products failed" : null
	].filter(Boolean);

	const error = errors.length > 0 ? "Failed to load all promotion data. Please refresh." : null;
	const loading = loadingPricing || loadingBoosts || loadingWallet || loadingProducts;

	// Mutation
	const boostMutation = useMutation({
		mutationFn: boostProduct,
		onSuccess: () => {
			toast("Success", "Product boost activated successfully!", "success");
			setIsModalOpen(false);
			queryClient.invalidateQueries({ queryKey: ["my-boosts"] });
			queryClient.invalidateQueries({ queryKey: ["vendor-wallet"] });
		},
		onError: (error) => {
			toast("Error", getErrorMessage(error), "error");
		},
	});

	const handleOpenBoostModal = (boost: BoostPricingResponseDTO) => {
		setSelectedBoost(boost);
		setIsModalOpen(true);
	};

	const calculateCost = () => {
		if (!selectedBoost) return 0;
		return selectedBoost.pricingByDays[selectedDays.toString()] || 0;
	};

	const handleConfirmBoost = async () => {
		if (!selectedProductId) {
			toast("Selection Required", "Please select a product to boost", "warning");
			return;
		}
		if (!selectedBoost) return;

		const totalCost = calculateCost();
		if (wallet && wallet.balance < totalCost) {
			toast("Insufficient Funds", "Please fund your wallet to continue", "error");
			return;
		}

		boostMutation.mutate({
			productId: selectedProductId,
			boostType: selectedBoost.boostType,
			durationDays: selectedDays,
		});
	};

	const getBoostIcon = (type: BoostType) => {
		switch (type) {
			case "TopSearch":
				return Rocket;
			case "Featured":
				return Star;
			case "CategorySpotlight":
				return Eye;
			default:
				return Rocket;
		}
	};

	const getBoostTitle = (type: BoostType) => {
		switch (type) {
			case "TopSearch":
				return "Boost Product";
			case "Featured":
				return "Featured Product";
			case "CategorySpotlight":
				return "Category Spotlight";
			default:
				return type;
		}
	};

	const getBoostDescription = (type: BoostType) => {
		switch (type) {
			case "TopSearch":
				return "Appear at the top of relevant search results.";
			case "Featured":
				return "Showcase your best product on the store homepage.";
			case "CategorySpotlight":
				return "Dominant placement in a specific category page.";
			default:
				return "";
		}
	};

	if (loading) {
		return <FullPageLoader label="Loading promotions..." icon={Rocket} />;
	}

	if (error) {
		return (
			<ErrorComponent
				title="Oops! Something went wrong"
				message={error}
				onRetry={() => queryClient.invalidateQueries()}
			/>
		);
	}

	const displayPricing =
		pricing.length > 0
			? pricing
			: [
					{
						boostType: "Featured" as BoostType,
						boostTypeName: "Featured",
						pricingByDays: { "3": 500, "7": 1000, "14": 1800, "30": 3500 },
					},
					{
						boostType: "TopSearch" as BoostType,
						boostTypeName: "TopSearch",
						pricingByDays: { "3": 800, "7": 1500, "14": 2500, "30": 4500 },
					},
					{
						boostType: "CategorySpotlight" as BoostType,
						boostTypeName: "CategorySpotlight",
						pricingByDays: { "3": 1500, "7": 3000, "14": 5000, "30": 9000 },
					},
				];

	return (
		<div className="space-y-10">
			{/* Header */}
			<PageHeader
				title="Boost My Ads"
				description="Promote your products for maximum visibility"
				actions={
					<Button
						size="sm"
						variant="primary"
						onClick={() => setIsBoostTypePickerOpen(true)}
						className="rounded-full"
					>
						<Plus size={16} />
						New Promotion
					</Button>
				}
			/>

			{/* Boost Type Picker Modal */}
			<BoostTypePickerModal
				isOpen={isBoostTypePickerOpen}
				onClose={() => setIsBoostTypePickerOpen(false)}
				onSelect={(type) => {
					setIsBoostTypePickerOpen(false);
					const boost = displayPricing.find((p) => p.boostType === type);
					if (boost) {
						setSelectedBoost(boost);
						setIsModalOpen(true);
					}
				}}
			/>

			{/* Active Promotions List */}
			<div className="bg-white border border-gray-100 rounded overflow-hidden shadow-sm shadow-gray-100/50">
				<div className="p-8 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-6">
					<h4 className="text-sm font-bold text-black">Active Promotions</h4>
					<button className="text-xs font-bold text-gold whitespace-nowrap hover:underline">
						Full History →
					</button>
				</div>

				<div className="divide-y divide-gray-50">
					{(activeBoosts || []).length > 0 ? (
						activeBoosts.map((p) => {
							const Icon = getBoostIcon(p.boostType);
							return (
								<div
									key={p.id}
									className="p-8 flex items-center justify-between group hover:bg-gray-50/50 transition-colors"
								>
									<div className="flex items-center gap-6">
										<div
											className={`w-12 h-12 rounded flex items-center justify-center shrink-0 ${p.status === "Active" ? "bg-gold/20 text-gold" : "bg-gray-50 text-gray-300"}`}
										>
											<Icon size={20} />
										</div>
										<div>
											<h5 className="text-[11px] font-black uppercase tracking-tight text-black">
												{p.productName}
											</h5>
											<p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mt-1">
												{getBoostTitle(p.boostType)} · {p.durationDays} Days
											</p>
										</div>
									</div>

									<div className="text-right flex items-center gap-8">
										<div>
											<p className="text-xs font-black text-black mb-1">
												{formatCurrency(p.totalAmount || p.amount || 0)}
											</p>
											<span
												className={`text-[8px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full ${p.status === "Active" ? "bg-green-50 text-green-600" : "bg-gray-100 text-gray-400"}`}
											>
												{p.status}
											</span>
										</div>
									</div>
								</div>
							);
						})
					) : (
						<EmptyState icon={AlertCircle} title="No active promotions found" />
					)}
				</div>
			</div>

			{/* Boost Setup Modal */}
			<Modal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				title={selectedBoost ? getBoostTitle(selectedBoost.boostType) : ""}
				subtitle="Configure your product promotion"
				icon={selectedBoost ? getBoostIcon(selectedBoost.boostType) : Rocket}
				size="lg"
			>
				<div className="space-y-8">
					{/* Duration Selector */}
					<div className="space-y-4">
						<label className="block text-[10px] font-black uppercase tracking-widest text-gray-400">
							Promotion Duration (Fixed Rates)
						</label>
						<div className="grid grid-cols-4 gap-4">
							{[3, 7, 14, 30].map((days) => {
								const price = selectedBoost?.pricingByDays[days.toString()];
								return (
									<button
										key={days}
										onClick={() => setSelectedDays(days)}
										disabled={!price}
										className={`py-6 rounded border-2 transition-all flex flex-col items-center gap-2 group ${selectedDays === days ? "bg-black text-white border-black" : "bg-white text-black border-gray-100 hover:border-gold hover:text-gold"} ${!price && "opacity-20 cursor-not-allowed"}`}
									>
										<span className="text-xl font-black tracking-tighter">
											{days}
										</span>
										<span className="text-[9px] font-black uppercase tracking-tighter opacity-60">
											DAYS
										</span>
									</button>
								);
							})}
						</div>
					</div>

					{/* Product Selector */}
					<div className="space-y-4">
						<label className="block text-[10px] font-black uppercase tracking-widest text-gray-400">
							Select Product to Boost
						</label>
						<Select
							id="product-boost-select"
							value={selectedProductId}
							onChange={(e) => setSelectedProductId(e.target.value)}
							options={products.map((p) => ({
								label: p.name || "Unnamed Product",
								value: p.id,
							}))}
							leftSlot={<ShoppingBag size={14} />}
							outerClassName="!mb-0"
						/>
					</div>

					{/* Checkout Summary */}
					<div className="bg-gray-50 p-6 rounded flex items-center justify-between border border-gray-100">
						<div className="flex items-center gap-4">
							<div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-black shadow-sm">
								<WalletIcon size={18} />
							</div>
							<div>
								<p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
									Total Deduction
								</p>
								<p className="text-sm font-black text-black">
									{formatCurrency(calculateCost())}
								</p>
							</div>
						</div>
						<div className="flex flex-col items-end gap-1">
							<span
								className={`text-[8px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full ${wallet && wallet.balance >= calculateCost() ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"}`}
							>
								{wallet && wallet.balance >= calculateCost()
									? "Wallet Sufficient"
									: "Insufficient Funds"}
							</span>
							<p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">
								Balance: {formatCurrency(wallet?.balance || 0)}
							</p>

						</div>
					</div>

					{/* Actions */}
					<div className="flex gap-4 pt-4">
						<Button
							variant="outline"
							className="flex-1"
							onClick={() => setIsModalOpen(false)}
						>
							Cancel
						</Button>
						<Button
							variant="primary"
							className="flex-1"
							onClick={handleConfirmBoost}
							loading={boostMutation.isPending}
							disabled={
								!wallet || !selectedBoost || wallet.balance < calculateCost()
							}
						>

							<CheckCircle size={16} />
							Confirm
						</Button>
					</div>

					<p className="text-[9px] font-black text-center text-gray-300 uppercase tracking-widest">
						Non-refundable once activated
					</p>
				</div>
			</Modal>
		</div>
	);
}
