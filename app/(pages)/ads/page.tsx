"use client";
import React, { useState, useEffect } from "react";
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
import {
	getBoostPricing,
	getMyBoosts,
	boostProduct,
} from "@/lib/api/services/boost";
import { getMyWallet } from "@/lib/api/services/wallet";
import { getMyVendorProfile } from "@/lib/api/services/vendor";
import { getProductsByVendor } from "@/lib/api/services/products";
import type {
	BoostPricingResponseDTO,
	BoostRecordResponseDTO,
	BoostType,
} from "@/lib/api/types/boost.types";
import type { WalletResponseDTO } from "@/lib/api/types/wallet.types";
import type { ProductResponseDTO } from "@/lib/api/types/products.types";
import { formatCurrency } from "@/lib/utils/currency";
import { useToast } from "@/lib/context/ToastContext";
import { ErrorComponent } from "@/components/ui/ErrorComponent";
import { Modal } from "@/components/ui/Modal";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { FullPageLoader } from "@/components/common/FullPageLoader";
import { PageHeader } from "@/components/ui/PageHeader";

export default function BoostAdsPage() {
	const [selectedDays, setSelectedDays] = useState(7);
	const [pricing, setPricing] = useState<BoostPricingResponseDTO[]>([]);
	const [activeBoosts, setActiveBoosts] = useState<BoostRecordResponseDTO[]>(
		[],
	);
	const [wallet, setWallet] = useState<WalletResponseDTO | null>(null);
	const [products, setProducts] = useState<ProductResponseDTO[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	// Modal states
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedBoost, setSelectedBoost] =
		useState<BoostPricingResponseDTO | null>(null);
	const [selectedProductId, setSelectedProductId] = useState<string>("");
	const [isSubmitting, setIsSubmitting] = useState(false);

	const { toast } = useToast();

	const fetchInitialData = async () => {
		try {
			setLoading(true);
			setError(null);

			const profile = await getMyVendorProfile();
			const [pricingData, boostsData, walletData, productsData] =
				await Promise.all([
					getBoostPricing(),
					getMyBoosts(),
					getMyWallet(),
					getProductsByVendor(profile.id, 1, 100),
				]);

			setPricing(pricingData || []);
			setActiveBoosts(boostsData || []);
			setWallet(walletData);
			// Handle paged response
			const items = Array.isArray(productsData)
				? productsData
				: productsData?.items;
			setProducts(items || []);
		} catch {
			console.error("Failed to fetch boost data:");
			setError("Failed to load boost information. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchInitialData();
	}, []);

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
			toast(
				"Selection Required",
				"Please select a product to boost",
				"warning",
			);
			return;
		}

		if (!selectedBoost) return;

		const totalCost = calculateCost();

		if (wallet && wallet.balance < totalCost) {
			toast(
				"Insufficient Funds",
				"Please fund your wallet to continue",
				"error",
			);
			return;
		}

		try {
			setIsSubmitting(true);
			await boostProduct({
				productId: selectedProductId,
				boostType: selectedBoost.boostType,
				durationDays: selectedDays,
			});

			toast("Success", "Product boost activated successfully!", "success");
			setIsModalOpen(false);
			fetchInitialData(); // Refresh data
		} catch {
			toast("Error", "Failed to activate boost. Please try again.", "error");
		} finally {
			setIsSubmitting(false);
		}
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
				onRetry={fetchInitialData}
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
						onClick={() =>
							toast(
								"Boost Ads",
								"Select a promotion type below to get started",
								"info",
							)
						}
						className="rounded-full"
					>
						<Plus size={16} />
						New Promotion
					</Button>
				}
			/>

			{/* Promotion Types */}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
				{displayPricing.map((ad) => {
					const Icon = getBoostIcon(ad.boostType);
					const isBlack = ad.boostType === "Featured";
					// Starting price is usually the first key (3 days)
					const startingPrice = ad.pricingByDays["3"] || 0;

					return (
						<div
							key={ad.boostType}
							onClick={() => handleOpenBoostModal(ad)}
							className={`p-8 lg:p-10 rounded border border-gray-100 flex flex-col justify-between group hover:-translate-y-1 transition-all cursor-pointer ${isBlack ? "bg-black text-white shadow-black/10" : "bg-white text-black"}`}
						>
							<div className="mb-10">
								<div
									className={`w-14 h-14 rounded flex items-center justify-center mb-6 group-hover:scale-110 transition-transform ${isBlack ? "bg-white/10 text-gold" : "bg-gold/20 text-gold"}`}
								>
									<Icon size={24} />
								</div>
								<h3 className="text-base font-bold mb-4">
									{getBoostTitle(ad.boostType)}
								</h3>
								<p className="text-xs font-medium leading-relaxed opacity-60 mb-6">
									{getBoostDescription(ad.boostType)}
								</p>
								<div className="flex items-center justify-between py-4 border-y border-gray-100/10">
									<span className="text-[10px] font-bold text-gray-500">
										Duration
									</span>
									<span className="text-[10px] font-bold text-gold text-right">
										3 - 30 Days Available
									</span>
								</div>
							</div>

							<div className="flex items-center justify-between mb-8">
								<p className="text-2xl font-black tracking-tight">
									<span className="text-[10px] font-black uppercase tracking-widest text-gray-500 mr-2">
										From
									</span>
									{formatCurrency(startingPrice)}
								</p>
							</div>

							<Button
								variant={isBlack ? "primary" : "black"}
								className={`w-full rounded-full py-3.5 text-xs font-bold ${isBlack ? "hover:bg-white" : ""}`}
							>
								Configure
							</Button>
						</div>
					);
				})}
			</div>

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
						<div className="p-20 flex flex-col items-center justify-center text-center space-y-4">
							<AlertCircle className="w-8 h-8 text-gray-200" />
							<p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
								No active promotions found
							</p>
						</div>
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
							loading={isSubmitting}
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
