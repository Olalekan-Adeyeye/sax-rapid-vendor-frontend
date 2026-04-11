"use client";
import React, { useEffect, useState, useCallback } from "react";
import {
	Plus,
	Filter,
	MoreVertical,
	Edit,
	Trash2,
	Loader2,
	ShoppingBag,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import Image from "next/image";
import * as productsService from "@/lib/api/services/products";
import { getMyVendorProfile } from "@/lib/api/services/vendor";
import { ProductResponseDTO } from "@/lib/api/types/products.types";
import { useToast } from "@/lib/context/ToastContext";
import { getErrorMessage } from "@/lib/utils/errors";
import { ErrorComponent } from "@/components/ui/ErrorComponent";
import { FullPageLoader } from "@/components/common/FullPageLoader";
import { SearchInput } from "@/components/ui/SearchInput";
import { PageHeader } from "@/components/ui/PageHeader";

export default function ProductsPage() {
	const [products, setProducts] = useState<ProductResponseDTO[]>([]);
	const [loading, setLoading] = useState(true);
	const [searchQuery, setSearchQuery] = useState("");
	const [deletingId, setDeletingId] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);
	const { toast } = useToast();

	const fetchProducts = useCallback(async () => {
		try {
			setLoading(true);
			setError(null);
			const vendorProfile = await getMyVendorProfile();
			if (vendorProfile && vendorProfile.id) {
				const data = await productsService.getProductsByVendor(
					vendorProfile.id,
				);
				setProducts(data.items || []);
			}
		} catch (error) {
			setError(getErrorMessage(error));
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchProducts();
	}, [fetchProducts]);

	const handleDelete = async (id: string) => {
		if (!confirm("Are you sure you want to delete this product?")) return;
		try {
			setDeletingId(id);
			await productsService.deleteProduct(id);
			toast("Success", "Product deleted successfully.", "success");
			fetchProducts();
		} catch (error) {
			toast("Error", getErrorMessage(error), "error");
		} finally {
			setDeletingId(null);
		}
	};

	const filteredProducts = products.filter(
		(p) =>
			p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
			p.sku?.toLowerCase().includes(searchQuery.toLowerCase()),
	);

	return (
		<div className="space-y-10">
			{loading && products.length === 0 ? (
				<FullPageLoader label="Loading products..." icon={ShoppingBag} />
			) : error && products.length === 0 ? (
				<ErrorComponent
					title="Failed to load products"
					message={error!}
					onRetry={fetchProducts}
				/>
			) : (
				<>
					<PageHeader
						title="All Products"
						description="Manage your product inventory and listings"
						actions={
							<Button asChild rounded="full" size="sm" className="">
								<Link href="/products/add" className="flex items-center gap-3">
									<Plus size={16} />
									Add New Product
								</Link>
							</Button>
						}
					/>

					<div className="bg-white border border-gray-100 rounded overflow-hidden">
						<div className="p-6 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
							<div className="relative flex-1 max-w-md">
								<SearchInput
									placeholder="Search by product name, SKU..."
									value={searchQuery}
									onChange={setSearchQuery}
									variant="muted"
									fullWidth
								/>
							</div>
							<div className="flex items-center gap-3">
								<Button
									variant="outline"
									rounded="full"
									size="sm"
									className="px-6 py-3 text-gray-400 hover:text-black border-gray-100"
								>
									<Filter size={14} />
									Filter
								</Button>
								<select className="px-6 py-3 rounded-full border border-gray-100 text-xs font-bold text-gray-400 outline-none bg-white">
									<option>All Categories</option>
								</select>
							</div>
						</div>

						<div className="overflow-x-auto">
							<table className="w-full text-left min-w-250">
								<thead className="bg-gray-50 border-b border-gray-100">
									<tr>
										{[
											"Product",
											"Category",
											"Base Price",
											"SKU",
											"Stock",
											"Status",
											"",
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
									{loading ? (
										<tr>
											<td colSpan={7} className="px-8 py-10 text-center">
												<div className="flex justify-center">
													<Loader2 className="h-6 w-6 animate-spin text-gold" />
												</div>
											</td>
										</tr>
									) : filteredProducts.length === 0 ? (
										<tr>
											<td colSpan={7} className="px-8 py-10 text-center">
												<p className="text-xs font-bold text-gray-400">
													No products found.
												</p>
											</td>
										</tr>
									) : (
										filteredProducts.map((product) => (
											<tr
												key={product.id}
												className="hover:bg-gray-50/50 transition-colors group"
											>
												<td className="px-8 py-5">
													<div className="flex items-center gap-4">
														<div className="w-12 h-12 rounded bg-gray-100 overflow-hidden shrink-0 relative flex items-center justify-center">
															{product.images && product.images.length > 0 ? (
																<Image
																	src={
																		product.images.find((img) => img.isPrimary)
																			?.imageUrl ||
																		product.images[0].imageUrl ||
																		"/assets/icons/SaxRapid-Logo.png"
																	}
																	alt={product.name || "Product"}
																	fill
																	className="object-cover relative z-10"
																/>
															) : (
																<div className="w-1/2 h-1/2 relative opacity-20 filter grayscale brightness-0">
																	<Image
																		src="/assets/icons/SaxRapid-Logo.png"
																		alt="Placeholder"
																		fill
																		className="object-contain"
																	/>
																</div>
															)}
														</div>
														<span className="text-sm font-bold text-black">
															{product.name}
														</span>
													</div>
												</td>
												<td className="px-8 py-5 text-xs font-bold text-gray-500 uppercase">
													{product.categoryName || "Uncategorized"}
												</td>
												<td className="px-8 py-5 text-sm font-bold text-black">
													₦{product.basePrice.toLocaleString()}
												</td>
												<td className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">
													{product.sku || "N/A"}
												</td>
												<td className="px-8 py-5">
													<div className="flex flex-col gap-1.5 min-w-25">
														<div className="flex items-center justify-between text-xs font-bold">
															<span
																className={
																	product.stockQuantity === 0
																		? "text-red-500"
																		: "text-black"
																}
															>
																{product.stockQuantity} left
															</span>
															<span className="text-gray-300">/ 200</span>
														</div>
														<div className="h-1.5 bg-gray-50 rounded-full overflow-hidden">
															<div
																className={`h-full rounded-full ${product.stockQuantity === 0 ? "bg-red-500" : "bg-gold"}`}
																style={{
																	width: `${Math.min((product.stockQuantity / 200) * 100, 100)}%`,
																}}
															/>
														</div>
													</div>
												</td>
												<td className="px-8 py-5">
													<span
														className={`text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full ${
															product.isActive
																? "bg-green-50 text-green-600"
																: "bg-gray-100 text-gray-400"
														}`}
													>
														{product.isActive ? "Active" : "Draft"}
													</span>
												</td>
												<td className="px-8 py-5 text-right">
													<div className="flex items-center justify-end gap-2">
														<Button
															variant="outline"
															size="sm"
															className="w-9 h-9 p-0 bg-white border-gray-100 text-gray-400 hover:text-black hover:border-black"
														>
															<Edit size={14} />
														</Button>
														<Button
															onClick={() => handleDelete(product.id)}
															disabled={deletingId === product.id}
															variant="outline"
															size="sm"
															className="w-9 h-9 p-0 bg-white border-gray-100 text-gray-400 hover:text-red-500 hover:border-red-500"
															loading={deletingId === product.id}
														>
															<Trash2 size={14} />
														</Button>
														<Button
															variant="outline"
															size="sm"
															className="w-9 h-9 p-0 bg-white border-gray-100 text-gray-400 hover:text-gold"
														>
															<MoreVertical size={14} />
														</Button>
													</div>
												</td>
											</tr>
										))
									)}
								</tbody>
							</table>
						</div>
					</div>
				</>
			)}
		</div>
	);
}
