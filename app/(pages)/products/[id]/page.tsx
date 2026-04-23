"use client";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import {
	Edit,
	Trash2,
	ChevronLeft,
	Package,
	Tag,
	BarChart3,
	ArrowUpRight,
	ShoppingBag,
	Activity,
	Settings2,
	Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/ui/PageHeader";
import { ErrorComponent } from "@/components/ui/ErrorComponent";
import { FullPageLoader } from "@/components/common/FullPageLoader";
import { useToast } from "@/lib/context/ToastContext";
import * as productsService from "@/lib/api/services/products";
import { ProductResponseDTO } from "@/lib/api/types/products.types";
import { getErrorMessage } from "@/lib/utils/errors";
import { useAuth } from "@/lib/context/AuthContext";
import { ProductDeleteModal } from "@/components/products/ProductDeleteModal";

export default function SingleProductPage() {
	const params = useParams();
	const router = useRouter();
	const productId = params.id as string;
	const { toast } = useToast();
	const { user } = useAuth();

	const [product, setProduct] = useState<ProductResponseDTO | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [activeImage, setActiveImage] = useState<string | null>(null);
	const [isDeleting, setIsDeleting] = useState(false);
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

	const fetchProduct = useCallback(async () => {
		try {
			setLoading(true);
			setError(null);
			const data = await productsService.getProductById(productId);
			setProduct(data);
			if (data.images && data.images.length > 0) {
				const primary =
					data.images.find((img) => img.isPrimary) || data.images[0];
				setActiveImage(primary.imageUrl);
			}
		} catch (err) {
			setError(getErrorMessage(err));
		} finally {
			setLoading(false);
		}
	}, [productId]);

	useEffect(() => {
		fetchProduct();
	}, [fetchProduct]);

	const handleDelete = async () => {
		try {
			setIsDeleting(true);
			await productsService.deleteProduct(productId);
			toast("Success", "Product deleted successfully", "success");
			router.push("/products");
		} catch (err) {
			toast("Error", getErrorMessage(err), "error");
		} finally {
			setIsDeleting(false);
			setIsDeleteModalOpen(false);
		}
	};

	const currencySymbol = useMemo(() => {
		const code = user?.countryCode?.toUpperCase();
		if (code === "NG") return "₦";
		if (code === "ZA") return "R";
		return "$";
	}, [user?.countryCode]);

	if (loading) {
		return (
			<FullPageLoader
				label="Retrieving Product Information..."
				icon={Package}
			/>
		);
	}

	if (error || !product) {
		return (
			<ErrorComponent
				title="Product Not Found"
				message={error || "The requested product could not be located."}
				onRetry={fetchProduct}
			/>
		);
	}

	const isVariable = product.variations && product.variations.length > 0;

	return (
		<div className="max-w-6xl mx-auto space-y-12 pb-24">
			{/* Back Button & Header */}
			<div className="flex flex-col gap-6">
				<button
					onClick={() => router.push("/products")}
					className="flex items-center gap-2 text-gray-400 hover:text-black transition-colors group w-fit"
				>
					<ChevronLeft
						size={16}
						className="transition-transform group-hover:-translate-x-1"
					/>
					<span className="text-[10px] font-black uppercase tracking-[0.2em]">
						Back to Inventory
					</span>
				</button>

				<PageHeader
					title={product.name || "Untitled Product"}
					description={`Last updated on ${new Date(product.updatedAt || product.createdAt).toLocaleDateString()}`}
					actions={
						<div className="flex items-center gap-3">
							<Button
								variant="outline"
								rounded="full"
								size="sm"
								className="px-6 border-gray-100"
								onClick={() => router.push(`/products/edit/${product.id}`)}
							>
								<Edit size={14} className="mr-2" />
								Edit Product
							</Button>
							<Button
								variant="black"
								rounded="full"
								size="sm"
								className="px-6 bg-red-600 text-white hover:bg-black border-red-600 hover:border-black transition-all"
								onClick={() => setIsDeleteModalOpen(true)}
								loading={isDeleting}
							>
								<Trash2 size={14} className="mr-2" />
								Delete Product
							</Button>
						</div>
					}
				/>
			</div>
			{/* Delete Confirmation Modal */}
			<ProductDeleteModal
				isOpen={isDeleteModalOpen}
				onClose={() => setIsDeleteModalOpen(false)}
				onConfirm={handleDelete}
				productName={product.name ?? undefined}
				loading={isDeleting}
			/>

			{/* Main Content Grid */}
			<div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
				{/* Left Column: Visuals */}
				<div className="lg:col-span-5 space-y-6">
					<div className="relative aspect-square bg-gray-50 border border-gray-100 rounded overflow-hidden">
						{activeImage ? (
							<Image
								src={activeImage}
								alt={product.name || "Product"}
								fill
								className="object-cover"
								unoptimized
							/>
						) : (
							<div className="absolute inset-0 flex flex-col items-center justify-center text-gray-200">
								<ShoppingBag size={64} strokeWidth={1} />
								<span className="text-[10px] font-bold mt-4 uppercase tracking-widest">
									No Image Available
								</span>
							</div>
						)}
						{/* Status Badge Over Image */}
						<div className="absolute top-6 left-6">
							<span
								className={`px-4 py-2 rounded text-[10px] font-black uppercase tracking-widest ${
									product.status === "Active"
										? "bg-green-500 text-white"
										: product.status === "Draft"
											? "bg-black text-white"
											: "bg-amber-500 text-white"
								}`}
							>
								{product.status || "Pending"}
							</span>
						</div>
					</div>

					{/* Thumbnail Gallery */}
					{product.images && product.images.length > 1 && (
						<div className="grid grid-cols-5 gap-3">
							{product.images.map((img, idx) => (
								<button
									key={idx}
									onClick={() => setActiveImage(img.imageUrl)}
									className={`relative aspect-square rounded border-2 transition-all overflow-hidden ${
										activeImage === img.imageUrl
											? "border-gold scale-105"
											: "border-transparent opacity-60 hover:opacity-100"
									}`}
								>
									<Image
										src={img.imageUrl || ""}
										alt={`Thumbnail ${idx}`}
										fill
										className="object-cover"
										unoptimized
									/>
								</button>
							))}
						</div>
					)}
				</div>

				{/* Right Column: Key Details & Stats */}
				<div className="lg:col-span-7 space-y-10">
					{/* Essential Stats Card */}
					<div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-gray-100 border border-gray-100 rounded overflow-hidden">
						<div className="bg-white p-6 space-y-2">
							<span className="text-[10px] font-black text-gray-500 uppercase tracking-widest block">
								Price
							</span>
							<div className="flex flex-col">
								<p className="text-xl font-black text-gold">
									{currencySymbol}
									{product.effectivePrice.toLocaleString()}
								</p>
								{product.effectivePrice < product.basePrice && (
									<span className="text-xs text-gray-400 line-through font-bold">
										{currencySymbol}{product.basePrice.toLocaleString()}
									</span>
								)}
							</div>
						</div>
						<div className="bg-white p-6 space-y-2">
							<span className="text-[10px] font-black text-gray-500 uppercase tracking-widest block">
								Inventory
							</span>
							<p
								className={`text-xl font-black ${product.stockQuantity === 0 ? "text-red-500" : "text-black"}`}
							>
								{product.stockQuantity}
							</p>
						</div>
						<div className="bg-white p-6 space-y-2">
							<span className="text-[10px] font-black text-gray-500 uppercase tracking-widest block">
								SKU
							</span>
							<p className="text-sm font-black text-black truncate">
								{product.sku || "N/A"}
							</p>
						</div>
						<div className="bg-white p-6 space-y-2">
							<span className="text-[10px] font-black text-gray-500 uppercase tracking-widest block">
								Views
							</span>
							<p className="text-xl font-black text-black">
								{product.viewCount || 0}
							</p>
						</div>
					</div>

					{/* Category & Logistics */}
					<div className="bg-white border border-gray-50 rounded p-8 space-y-8">
						<div className="flex flex-wrap gap-12">
							<div className="space-y-4">
								<h5 className="flex items-center gap-2 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">
									<Tag size={12} /> Category
								</h5>
								<p className="text-sm font-bold text-black border-l-2 border-gold pl-4">
									{product.categoryName || "Uncategorized"}
								</p>
							</div>
							<div className="space-y-4">
								<h5 className="flex items-center gap-2 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">
									<Package size={12} /> Dimensions
								</h5>
								<p className="text-sm font-bold text-black">
									{product.dimensionLength || 0} x {product.dimensionWidth || 0}{" "}
									x {product.dimensionHeight || 0} cm
								</p>
							</div>
							<div className="space-y-4">
								<h5 className="flex items-center gap-2 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">
									<Activity size={12} /> Weight
								</h5>
								<p className="text-sm font-bold text-black">
									{product.weight} kg
								</p>
							</div>
						</div>
						{(product.salePriceStartDate || product.salePriceEndDate) && (
							<div className="pt-8 border-t border-gray-50 space-y-4">
								<h5 className="flex items-center gap-2 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">
									<Calendar size={12} /> Sale Period
								</h5>
								<p className="text-xs font-bold text-black">
									{product.salePriceStartDate ? new Date(product.salePriceStartDate).toLocaleDateString() : "Immediate"} 
									{" — "} 
									{product.salePriceEndDate ? new Date(product.salePriceEndDate).toLocaleDateString() : "Until canceled"}
								</p>
							</div>
						)}
					</div>

					{/* Description */}
					<div className="space-y-4">
						<h5 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">
							Description
						</h5>
						<div className="bg-gray-50/50 rounded p-8 border border-gray-100">
							<p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap font-medium">
								{product.description ||
									"No description provided for this product."}
							</p>
						</div>
					</div>
				</div>
			</div>

			{/* Secondary Content Sections */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
				{/* Attributes Section */}
				{product.attributes && product.attributes.length > 0 && (
					<div className="bg-white border border-gray-100 rounded p-10 space-y-8">
						<div className="flex items-center justify-between border-b border-gray-50 pb-6">
							<h4 className="text-sm font-black text-black uppercase tracking-widest">
								Product Attributes
							</h4>
							<span className="text-[10px] font-black text-gold bg-gold/5 px-4 py-2 rounded uppercase tracking-widest">
								{product.attributes.length} Total
							</span>
						</div>
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
							{/* Group attributes by name */}
							{Object.entries(
								product.attributes.reduce(
									(acc, curr) => {
										if (!curr.name) return acc;
										if (!acc[curr.name]) acc[curr.name] = [];
										acc[curr.name].push(curr.value || "");
										return acc;
									},
									{} as Record<string, string[]>,
								),
							).map(([name, values]) => (
								<div
									key={name}
									className="p-5 bg-gray-50/50 rounded border border-gray-50 space-y-2"
								>
									<span className="text-[10px] font-black text-gray-500 uppercase tracking-widest block">
										{name}
									</span>
									<div className="flex flex-wrap gap-2">
										{values.map((val) => (
											<span
												key={val}
												className="text-xs font-bold text-black bg-white border border-gray-100 px-3 py-1.5 rounded"
											>
												{val}
											</span>
										))}
									</div>
								</div>
							))}
						</div>
					</div>
				)}

				{/* Quick Metrics / Small Analytics */}
				<div className="bg-black text-white rounded p-10 space-y-8 flex flex-col justify-between">
					<div className="space-y-6">
						<div className="flex items-center justify-between">
							<h4 className="text-sm font-black uppercase tracking-widest text-gold/80">
								Performance Preview
							</h4>
							<BarChart3 size={20} className="text-gold" />
						</div>
						<div className="space-y-4">
							<div className="flex items-center justify-between py-4 border-b border-white/5">
								<span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
									Conversion Rate
								</span>
								<span className="text-xs font-black">
									2.4%{" "}
									<ArrowUpRight
										size={10}
										className="inline ml-1 text-green-500"
									/>
								</span>
							</div>
							<div className="flex items-center justify-between py-4 border-b border-white/5">
								<span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
									Favorites
								</span>
								<span className="text-xs font-black">
									{product.favoriteCount || 0}
								</span>
							</div>
							<div className="flex items-center justify-between py-4 border-b border-white/5">
								<span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
									Total Sales
								</span>
								<span className="text-xs font-black">---</span>
							</div>
						</div>
					</div>
					<Button
						variant="outline"
						fullWidth
						className="border-white/10 text-white hover:bg-white hover:text-black transition-all rounded py-6"
					>
						<span className="text-[10px] font-black uppercase tracking-[0.2em]">
							See Full Analytics
						</span>
					</Button>
				</div>
			</div>

			{/* Variations Table */}
			{isVariable && (
				<div className="bg-white border border-gray-100 rounded overflow-hidden">
					<div className="p-10 border-b border-gray-50 flex items-center justify-between bg-white">
						<div>
							<h4 className="text-sm font-black text-black uppercase tracking-widest">
								Product Variations
							</h4>
							<p className="text-[10px] font-medium text-gray-500 uppercase tracking-widest mt-2 px-1">
								Specific Inventory for Configurable Options
							</p>
						</div>
						<div className="flex items-center gap-4">
							<span className="text-[10px] font-black text-gray-500 bg-gray-50 border border-gray-100 px-6 py-3 rounded uppercase tracking-widest flex items-center gap-2">
								<Settings2 size={12} className="text-gold" />{" "}
								{product.variations?.length} SKUs Identified
							</span>
						</div>
					</div>
					<div className="overflow-x-auto">
						<table className="w-full text-left">
							<thead>
								<tr className="bg-gray-50/50">
									<th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-gray-500 border-b border-gray-100">
										Variation (SKU)
									</th>
									<th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-gray-500 border-b border-gray-100">
										Price Override
									</th>
									<th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-gray-500 border-b border-gray-100">
										Stock Status
									</th>
									<th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-gray-500 border-b border-gray-100">
										Attributes
									</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-gray-50">
								{product.variations?.map((v) => (
									<tr
										key={v.id}
										className="hover:bg-gray-50/30 transition-colors group"
									>
										<td className="px-10 py-8">
											<div className="flex flex-col gap-1">
												<span className="text-xs font-black text-black group-hover:text-gold transition-colors">
													{v.sku || "VAR-" + v.id.substring(0, 4)}
												</span>
												<span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
													Unique Item ID: {v.id}
												</span>
											</div>
										</td>
										<td className="px-10 py-8">
											<span className="text-sm font-black text-black">
												{currencySymbol}
												{v.price.toLocaleString()}
											</span>
										</td>
										<td className="px-10 py-8">
											<div className="flex items-center gap-3">
												<div
													className={`w-2 h-2 rounded ${v.stockQuantity > 0 ? "bg-green-500" : "bg-red-500"}`}
												/>
												<span
													className={`text-[10px] font-black uppercase tracking-widest ${v.stockQuantity > 0 ? "text-black" : "text-red-500"}`}
												>
													{v.stockQuantity} in stock
												</span>
											</div>
										</td>
										<td className="px-10 py-8">
											<div className="flex flex-wrap gap-2">
												{v.attributes &&
													Object.entries(v.attributes).map(([key, val]) => (
														<span
															key={key}
															className="text-[10px] font-bold text-gray-500 bg-gray-100 px-3 py-1 rounded"
														>
															<span className="text-gray-500 font-black mr-1">
																{key}:
															</span>{" "}
															{val}
														</span>
													))}
											</div>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
			)}
		</div>
	);
}
