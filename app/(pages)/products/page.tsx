"use client";
import React, { useEffect, useState, useCallback, Suspense } from "react";
import {
	Plus,
	MoreVertical,
	Edit,
	Trash2,
	Loader2,
	ShoppingBag,
	ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import Image from "next/image";
import * as productsService from "@/lib/api/services/products";
import { useAuth } from "@/lib/context/AuthContext";
import { ProductResponseDTO } from "@/lib/api/types/products.types";
import { useToast } from "@/lib/context/ToastContext";
import { getErrorMessage } from "@/lib/utils/errors";
import { ErrorComponent } from "@/components/ui/ErrorComponent";
import { FullPageLoader } from "@/components/common/FullPageLoader";
import { SearchInput } from "@/components/ui/SearchInput";
import { PageHeader } from "@/components/ui/PageHeader";
import { Pagination } from "@/components/ui/Pagination";
import { Select } from "@/components/ui/Select";
import { useSearchParams, useRouter } from "next/navigation";
import * as categoriesService from "@/lib/api/services/categories";
import { CategoryResponseDTO } from "@/lib/api/types/categories.types";
import {
	Dropdown,
	DropdownItem,
	DropdownDivider,
} from "@/components/ui/Dropdown";
import { ProductDeleteModal } from "@/components/products/ProductDeleteModal";

function ProductsPageContent() {
	const { user } = useAuth();
	const [products, setProducts] = useState<ProductResponseDTO[]>([]);
	const [loading, setLoading] = useState(true);
	const [searchQuery, setSearchQuery] = useState("");
	const [deletingId, setDeletingId] = useState<string | null>(null);
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [productToDelete, setProductToDelete] =
		useState<ProductResponseDTO | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [categories, setCategories] = useState<CategoryResponseDTO[]>([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const { toast } = useToast();
	const searchParams = useSearchParams();
	const router = useRouter();

	const categoryIdFilter = searchParams.get("categoryId");
	const sortFilter = searchParams.get("sort") || "newest";

	useEffect(() => {
		setCurrentPage(1);
	}, [searchQuery, categoryIdFilter, sortFilter]);

	const confirmDelete = (product: ProductResponseDTO) => {
		setProductToDelete(product);
		setIsDeleteModalOpen(true);
	};

	const fetchCategories = useCallback(async () => {
		try {
			const data = await categoriesService.getCategories();
			setCategories(data);
		} catch (error) {
			console.error("Failed to fetch categories", error);
		}
	}, []);

	const fetchProducts = useCallback(async () => {
		try {
			setLoading(true);
			setError(null);
			if (user && user.userId) {
				const response = await productsService.getProducts({
					VendorId: user.userId,
					SearchTerm: searchQuery || undefined,
					CategoryId: categoryIdFilter ? Number(categoryIdFilter) : undefined,
					PageSize: 1000, // Fetch all for manual pagination
					PageIndex: 1,
				});
				// Be resilient to different response structures
				const items = Array.isArray(response) ? response : response?.items;
				const itemsList = items || [];
				setProducts(itemsList);
				setTotalPages(Math.ceil(itemsList.length / 9) || 1);
			}
		} catch (error) {
			setError(getErrorMessage(error));
		} finally {
			setLoading(false);
		}
	}, [user, searchQuery, categoryIdFilter]);

	useEffect(() => {
		fetchCategories();
	}, [fetchCategories]);

	useEffect(() => {
		fetchProducts();
	}, [fetchProducts]);

	const handleDelete = async () => {
		if (!productToDelete) return;

		try {
			setDeletingId(productToDelete.id);
			await productsService.deleteProduct(productToDelete.id);
			toast(
				"Product Deleted",
				"The product has been permanently removed.",
				"success",
			);
			setIsDeleteModalOpen(false);
			setProductToDelete(null);
			fetchProducts(); // Refresh data from server
		} catch (error) {
			toast("Deletion Failed", getErrorMessage(error), "error");
		} finally {
			setDeletingId(null);
		}
	};

	const ITEMS_PER_PAGE = 9;

	const sortedProducts = [...products].sort((a, b) => {
		if (sortFilter === "price_asc") return a.effectivePrice - b.effectivePrice;
		if (sortFilter === "price_desc") return b.effectivePrice - a.effectivePrice;
		if (sortFilter === "name_asc")
			return (a.name || "").localeCompare(b.name || "");
		if (sortFilter === "name_desc")
			return (b.name || "").localeCompare(a.name || "");
		if (sortFilter === "oldest")
			return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
		// default newest
		return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
	});

	const filteredProducts = sortedProducts.slice(
		(currentPage - 1) * ITEMS_PER_PAGE,
		currentPage * ITEMS_PER_PAGE,
	);

	// Debugging: Log if results are empty despite having products
	useEffect(() => {
		if (products.length > 0 && filteredProducts.length === 0) {
			console.warn("Product filtering issue detected:", {
				totalProducts: products.length,
				paginatedCount: filteredProducts.length,
				activeSearch: searchQuery,
			});
		}
	}, [products, filteredProducts, categoryIdFilter, searchQuery]);

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
									focusColor="gold"
								/>
							</div>
							<div className="flex items-center gap-3">
								<Select
									id="sortFilter"
									value={sortFilter}
									onChange={(e) => {
										const val = e.target.value;
										const params = new URLSearchParams(searchParams.toString());
										if (val && val !== "newest") params.set("sort", val);
										else params.delete("sort");
										router.push(`/products?${params.toString()}`);
									}}
									options={[
										{ label: "Sort: Newest", value: "newest" },
										{ label: "Sort: Oldest", value: "oldest" },
										{ label: "Price: Low to High", value: "price_asc" },
										{ label: "Price: High to Low", value: "price_desc" },
										{ label: "Name: A to Z", value: "name_asc" },
										{ label: "Name: Z to A", value: "name_desc" },
									]}
									outerClassName="w-44 mb-0"
									className="text-xs! transition-colors py-2.5! pl-5! pr-10! rounded-full border border-gray-100 hover:border-gold shadow-none"
								/>
								<Select
									id="categoryFilter"
									value={categoryIdFilter || "all"}
									onChange={(e) => {
										const val = e.target.value;
										const params = new URLSearchParams(searchParams.toString());
										if (val && val !== "all") params.set("categoryId", val);
										else params.delete("categoryId");
										router.push(`/products?${params.toString()}`);
									}}
									options={[
										{ label: "All Categories", value: "all" },
										...categories.map((cat) => ({
											label: cat.name || "Unnamed Category",
											value: String(cat.id),
										})),
									]}
									outerClassName="w-48 mb-0"
									className="text-xs! transition-colors py-2.5! pl-5! pr-10! rounded-full border border-gray-100 hover:border-gold shadow-none"
								/>
							</div>
						</div>

						<div className="overflow-x-auto">
							<table className="w-full text-left min-w-250">
								<thead className="bg-gray-50 border-b border-gray-100">
									<tr>
										{[
											"Product",
											"Category",
											"Price",
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
														<div className="flex flex-col gap-1 items-start">
															<Link
																href={`/products/${product.id}`}
																className="text-sm font-bold text-black hover:text-gold transition-colors"
															>
																{product.name}
															</Link>
															{product.variations && product.variations.length > 0 && (
																<span className="text-[9px] font-black uppercase tracking-[0.2em] bg-black text-white px-1.5 py-0.5 rounded">
																	Variable
																</span>
															)}
														</div>
													</div>
												</td>
												<td className="px-8 py-5 text-xs font-bold text-gray-500 uppercase">
													{(() => {
														const findCategory = (
															cats: CategoryResponseDTO[],
															id: number,
														): string | null => {
															for (const cat of cats) {
																if (cat.id === id) return cat.name;
																if (cat.subCategories) {
																	const sub = findCategory(
																		cat.subCategories,
																		id,
																	);
																	if (sub) return sub;
																}
															}
															return null;
														};
														return (
															findCategory(categories, product.categoryId) ||
															product.categoryName ||
															"Uncategorized"
														);
													})()}
												</td>
												<td className="px-8 py-5">
													<div className="flex flex-col items-start gap-0.5">
														<span className="text-sm font-black text-black">
															₦{product.effectivePrice.toLocaleString()}
														</span>
														{product.effectivePrice < product.basePrice && (
															<div className="flex items-center gap-2">
																<span className="text-[10px] text-gray-400 line-through font-bold">
																	₦{product.basePrice.toLocaleString()}
																</span>
																<span className="text-[8px] font-black bg-black text-white px-1.5 py-0.5 rounded uppercase tracking-[0.2em]">
																	Sale
																</span>
															</div>
														)}
													</div>
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
																{product.stockQuantity} in stock
															</span>
														</div>
														<div className="h-1.5 bg-gray-50 rounded-full overflow-hidden">
															<div
																className={`h-full rounded-full ${
																	product.stockQuantity === 0
																		? "bg-red-500"
																		: product.stockQuantity < 10
																			? "bg-amber-400"
																			: "bg-gold"
																}`}
																style={{
																	width:
																		product.stockQuantity === 0 ? "0%" : "100%",
																}}
															/>
														</div>
													</div>
												</td>
												<td className="px-8 py-5">
													<span
														className={`text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full ${
															product.status === "Active"
																? "bg-green-50 text-green-600"
																: product.status === "Draft"
																	? "bg-black text-white"
																	: product.status === "Pending"
																		? "bg-amber-50 text-amber-600"
																		: product.status === "Rejected"
																			? "bg-red-50 text-red-600"
																			: "bg-gray-100 text-gray-400"
														}`}
													>
														{product.status || "Unknown"}
													</span>
												</td>
												<td className="px-8 py-5 text-right w-40">
													<div className="flex items-center justify-end gap-2">
														<Link
															href={`/products/edit/${product.id}`}
															passHref
														>
															<Button
																variant="outline"
																className="w-8 h-8 p-0! bg-white border-gray-100 text-black hover:border-black rounded-none flex items-center justify-center transition-all"
																title="Edit Product"
															>
																<Edit size={14} />
															</Button>
														</Link>
														<Button
															onClick={() => confirmDelete(product)}
															disabled={deletingId === product.id}
															variant="outline"
															className="w-8 h-8 p-0! bg-white border-gray-100 text-black hover:text-red-600 hover:border-red-600 rounded-none flex items-center justify-center transition-all"
															loading={deletingId === product.id}
															title="Delete Product"
														>
															<Trash2 size={14} />
														</Button>
														<Dropdown
															trigger={
																<Button
																	variant="outline"
																	className="w-8 h-8 p-0! bg-white border-gray-100 text-black hover:text-gold hover:border-gold rounded-none flex items-center justify-center transition-all"
																>
																	<MoreVertical size={14} />
																</Button>
															}
														>
															<DropdownItem
																icon={
																	<ExternalLink
																		size={14}
																		className="text-gray-400"
																	/>
																}
																onClick={() =>
																	router.push(`/products/${product.id}`)
																}
															>
																View Details
															</DropdownItem>
															<DropdownItem
																icon={
																	<Edit size={14} className="text-gray-400" />
																}
																onClick={() =>
																	router.push(`/products/edit/${product.id}`)
																}
															>
																Detailed Edit
															</DropdownItem>
															<DropdownItem
																icon={
																	<ShoppingBag
																		size={14}
																		className="text-gray-400"
																	/>
																}
																onClick={() =>
																	router.push(
																		`/reviews?productId=${product.id}`,
																	)
																}
															>
																View Reviews
															</DropdownItem>
															<DropdownDivider />
															<DropdownItem
																variant="danger"
																icon={<Trash2 size={14} />}
																onClick={() => confirmDelete(product)}
																disabled={deletingId === product.id}
															>
																Delete Product
															</DropdownItem>
														</Dropdown>
													</div>
												</td>
											</tr>
										))
									)}
								</tbody>
							</table>
						</div>
						<div className="p-6 border-t border-gray-50 flex justify-end bg-gray-50/20">
							<Pagination
								currentPage={currentPage}
								totalPages={totalPages}
								onPageChange={setCurrentPage}
							/>
						</div>
					</div>
				</>
			)}
			{/* Delete Confirmation Modal */}
			<ProductDeleteModal
				isOpen={isDeleteModalOpen}
				onClose={() => setIsDeleteModalOpen(false)}
				onConfirm={handleDelete}
				productName={productToDelete?.name}
				loading={deletingId !== null}
			/>
		</div>
	);
}

export default function ProductsPage() {
	return (
		<Suspense
			fallback={
				<FullPageLoader label="Initializing products..." icon={ShoppingBag} />
			}
		>
			<ProductsPageContent />
		</Suspense>
	);
}
