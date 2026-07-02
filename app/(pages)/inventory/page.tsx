"use client";
import React from "react";
import {
	Database,
	AlertCircle,
	TrendingDown,
	PackageOpen,
	ArrowUpRight,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getProductStats, getProducts } from "@/lib/api/services/products";
import { getMyVendorProfile } from "@/lib/api/services/vendor";
import { Button } from "@/components/ui/Button";
import { SearchInput } from "@/components/ui/SearchInput";
import { PageHeader } from "@/components/ui/PageHeader";
import { Loader2 } from "lucide-react";
import Link from "next/link";

export default function InventoryManagementPage() {
	const [searchInput, setSearchInput] = React.useState("");
	const [searchQuery, setSearchQuery] = React.useState("");

	const { data: vendor } = useQuery({
		queryKey: ["vendor-profile"],
		queryFn: getMyVendorProfile,
	});

	const { data: stats, isLoading: loadingStats } = useQuery({
		queryKey: ["product-stats"],
		queryFn: getProductStats,
	});

	const { data: productsData, isLoading: loadingProducts } = useQuery({
		queryKey: ["vendor-inventory", vendor?.userId],
		queryFn: () => (vendor?.userId ? getProducts({ VendorId: vendor.userId, PageIndex: 1, PageSize: 50 }) : null),
		enabled: !!vendor?.userId,
	});

	const products = productsData?.items || [];

	const filteredProducts = products.filter((p) =>
		p.name?.toLowerCase().includes(searchQuery.toLowerCase()),
	);

	const getStockStatus = (stock: number) => {
		if (stock === 0) return "Out of Stock";
		if (stock <= 5) return "Low Stock";
		return "Healthy";
	};

	const getStatusStyle = (stock: number) => {
		if (stock === 0) return "bg-red-50 text-red-600";
		if (stock <= 5) return "bg-gold/10 text-gold";
		return "bg-green-50 text-green-600";
	};

	return (
		<div className="space-y-10">
			<PageHeader
				title="Stock Management"
				description="Track inventory levels and low stock alerts"
				actions={
					<Button rounded="full" className="py-3.5" size="sm">
						<Database size={16} />
						Stock Update
					</Button>
				}
			/>

			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				<div className="bg-white border border-gray-100 rounded p-6 lg:p-8 hover:border-gold transition-all group">
					<p className="text-xs font-bold text-gray-500 mb-4 transition-colors">
						Total Items in Stock
					</p>
					<h3 className="text-3xl font-black text-black tracking-tighter mb-2">
						{loadingStats ? "..." : (stats?.totalProducts || 0).toLocaleString()}
					</h3>
					<div className="flex items-center gap-2">
						<div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
						<p className="text-[10px] font-bold text-gray-400">Listed Products</p>
					</div>
				</div>
				<div className="bg-white border border-gray-100 rounded p-6 lg:p-8 hover:border-red-500 transition-all group">
					<p className="text-xs font-bold text-gray-500 mb-4 transition-colors">
						Low Stock Items
					</p>
					<h3 className="text-3xl font-black text-gold tracking-tighter mb-2">
						{loadingStats ? "..." : (stats?.pendingApproval || 0).toLocaleString()}
					</h3>
					<p className="text-[9px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
						<AlertCircle size={12} className="text-gold" />
						Awaiting review
					</p>
				</div>
				<div className="bg-white border border-gray-100 rounded p-6 lg:p-8 hover:border-black transition-all group">
					<p className="text-xs font-bold text-gray-500 mb-4 transition-colors">
						Out of Stock
					</p>
					<h3 className="text-3xl font-black text-red-500 tracking-tighter mb-2">
						{loadingStats ? "..." : (stats?.outOfStock || 0).toLocaleString()}
					</h3>
					<p className="text-[9px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
						<TrendingDown size={12} className="text-red-500" />
						Needs restock
					</p>
				</div>
			</div>

			<div className="bg-white border border-gray-100 rounded overflow-hidden">
				<div className="p-6 border-b border-gray-50 bg-gray-50/10">
				<SearchInput
					placeholder="Search inventory..."
					variant="white"
					focusColor="gold"
					fullWidth
					className="max-w-md"
					value={searchInput}
					onChange={setSearchInput}
					onSearch={setSearchQuery}
					disabled={loadingStats || loadingProducts}
					/>
				</div>

				<div className="divide-y divide-gray-50">
					{loadingProducts ? (
						<div className="p-20 text-center">
							<Loader2 className="animate-spin text-gold mx-auto mb-4" size={40} />
							<p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
								Loading Inventory...
							</p>
						</div>
					) : filteredProducts.length > 0 ? (
						filteredProducts.map((item) => (
							<div
								key={item.id}
								className="p-6 lg:p-8 hover:bg-gray-50/50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-6 group"
							>
								<div className="flex items-center gap-6 flex-1">
									<div
										className={`w-12 h-12 rounded bg-gray-50 flex items-center justify-center ${item.stockQuantity === 0 ? "text-red-500 bg-red-50" : item.stockQuantity <= 5 ? "text-gold bg-gold/5" : "text-gray-300"}`}
									>
										<PackageOpen size={20} />
									</div>
									<div>
										<h4 className="text-sm font-bold text-black">{item.name}</h4>
										<p className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-widest">
											SKU: {item.sku || "NO-SKU"}
										</p>
									</div>
								</div>
								<div className="flex items-center gap-10 md:gap-14 shrink-0">
									<div className="w-32">
										<div className="flex items-center justify-between text-[10px] font-bold mb-1.5">
											<span
												className={
													item.stockQuantity <= 5 ? "text-red-500" : "text-black"
												}
											>
												{item.stockQuantity} units
											</span>
											<span className="text-gray-300">Stock Level</span>
										</div>
										<div className="h-1 bg-gray-100 rounded-full overflow-hidden">
											<div
												className={`h-full transition-all duration-1000 ${
													item.stockQuantity === 0
														? "w-0"
														: item.stockQuantity <= 5
															? "bg-red-500"
															: "bg-gold"
												}`}
												style={{
													width: `${Math.min((item.stockQuantity / 20) * 100, 100)}%`,
												}}
											/>
										</div>
									</div>
									<div className="flex items-center gap-4">
										<span
											className={`text-[8px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full ${getStatusStyle(
												item.stockQuantity,
											)}`}
										>
											{getStockStatus(item.stockQuantity)}
										</span>
										<Button
											asChild
											variant="ghost"
											size="sm"
											className="text-gray-300 hover:text-black p-0"
										>
											<Link href={`/products/edit/${item.id}`}>
												<ArrowUpRight size={18} />
											</Link>
										</Button>
									</div>
								</div>
							</div>
						))
					) : (
						<div className="p-20 text-center">
							<div className="w-16 h-16 rounded bg-gray-50 flex items-center justify-center text-gray-200 border border-gray-100 mx-auto mb-4">
								<PackageOpen size={32} />
							</div>
							<p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
								No inventory records found
							</p>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
