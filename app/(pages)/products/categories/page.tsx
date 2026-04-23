"use client";
import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
	MoreVertical,
	Layers,
	ChevronDown,
	ChevronUp,
	CornerDownRight,
	Eye,
	Copy,
} from "lucide-react";
import { useToast } from "@/lib/context/ToastContext";
import { Button } from "@/components/ui/Button";
import { SearchInput } from "@/components/ui/SearchInput";
import * as categoriesService from "@/lib/api/services/categories";
import { CategoryResponseDTO } from "@/lib/api/types/categories.types";
import { getErrorMessage } from "@/lib/utils/errors";
import { FullPageLoader } from "@/components/common/FullPageLoader";
import { ErrorComponent } from "@/components/ui/ErrorComponent";
import { PageHeader } from "@/components/ui/PageHeader";
import { Dropdown, DropdownItem } from "@/components/ui/Dropdown";

export default function ProductCategoriesPage() {
	const [categories, setCategories] = useState<CategoryResponseDTO[]>([]);
	const [loading, setLoading] = useState(true);
	const [searchQuery, setSearchQuery] = useState("");
	const [error, setError] = useState<string | null>(null);
	const { toast } = useToast();
	const router = useRouter();

	const [expandedCategories, setExpandedCategories] = useState<number[]>([]);

	const fetchCategories = useCallback(async () => {
		try {
			setLoading(true);
			setError(null);
			const data = await categoriesService.getCategoryTree();
			setCategories(data);
		} catch (err) {
			setError(getErrorMessage(err));
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchCategories();
	}, [fetchCategories]);

	useEffect(() => {
		if (searchQuery) {
			const matchIds = categories
				.filter((cat) =>
					cat.subCategories?.some((sub) =>
						sub.name?.toLowerCase().includes(searchQuery.toLowerCase()),
					),
				)
				.map((cat) => cat.id);
			if (matchIds.length > 0) {
				setExpandedCategories((prev) => [...new Set([...prev, ...matchIds])]);
			}
		}
	}, [searchQuery, categories]);

	const toggleExpand = (id: number) => {
		setExpandedCategories((prev) =>
			prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
		);
	};

	const filteredCategories = categories.filter(
		(cat) =>
			cat.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
			cat.subCategories?.some((sub) =>
				sub.name?.toLowerCase().includes(searchQuery.toLowerCase()),
			),
	);

	if (loading && categories.length === 0) {
		return <FullPageLoader label="Loading categories..." icon={Layers} />;
	}

	if (error && categories.length === 0) {
		return (
			<ErrorComponent
				title="Failed to load categories"
				message={error}
				onRetry={fetchCategories}
			/>
		);
	}

	return (
		<div className="space-y-10">
			<PageHeader
				title="Product Categories"
				description="Browse marketplace categories to organize your products"
			/>

			<div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
				<div className="lg:col-span-4 space-y-8">
					<div className="bg-white border border-gray-100 rounded overflow-hidden">
						<div className="p-6 border-b border-gray-50 bg-gray-50/30">
							<SearchInput
								placeholder="Search categories..."
								value={searchQuery}
								onChange={setSearchQuery}
								variant="white"
								focusColor="gold"
								fullWidth
							/>
						</div>
						<div className="divide-y divide-gray-50">
							{filteredCategories.length === 0 ? (
								<div className="p-8 text-center text-gray-400 text-[10px] font-black uppercase tracking-widest">
									No categories found
								</div>
							) : (
								filteredCategories.map((cat) => (
									<div
										key={cat.id}
										className="border-b border-gray-50 last:border-0"
									>
										<div
											className={`p-6 lg:p-8 hover:bg-gray-50/50 transition-colors flex items-center justify-between group cursor-pointer ${
												expandedCategories.includes(cat.id)
													? "bg-gray-50/30"
													: ""
											}`}
											onClick={() => toggleExpand(cat.id)}
										>
											<div className="flex items-center gap-6">
												<div
													className={`w-12 h-12 rounded bg-gray-50 flex items-center justify-center text-gray-300 group-hover:bg-gold group-hover:text-black transition-all ${
														expandedCategories.includes(cat.id)
															? "bg-gold text-black"
															: ""
													}`}
												>
													<Layers size={20} />
												</div>
												<div>
													<h4 className="text-sm font-black uppercase tracking-tight text-black flex items-center gap-3">
														{cat.name}
														{cat.subCategories &&
															cat.subCategories.length > 0 && (
																<span className="text-[8px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded font-black tracking-normal">
																	{cat.subCategories.length} SUBS
																</span>
															)}
													</h4>
													<p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mt-1">
														{cat.description || "Marketplace category"}
													</p>
												</div>
											</div>
											<div className="flex items-center gap-4">
												<span
													className={`text-[8px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full ${
														cat.isActive
															? "bg-green-50 text-green-600"
															: "bg-gray-100 text-gray-400"
													}`}
												>
													{cat.isActive ? "Active" : "Draft"}
												</span>
												<div className="flex items-center gap-2">
													{cat.subCategories &&
														cat.subCategories.length > 0 && (
															<div className="text-gray-300">
																{expandedCategories.includes(cat.id) ? (
																	<ChevronUp size={18} />
																) : (
																	<ChevronDown size={18} />
																)}
															</div>
														)}
													<Dropdown
														trigger={
															<Button
																variant="ghost"
																size="sm"
																className="p-0 h-auto text-gray-300 hover:text-black"
															>
																<MoreVertical size={18} />
															</Button>
														}
													>
														<DropdownItem
															icon={<Eye size={14} className="text-gray-400" />}
															onClick={() =>
																router.push(`/products?categoryId=${cat.id}`)
															}
														>
															View Products
														</DropdownItem>
														<DropdownItem
															icon={<Copy size={14} className="text-gray-400" />}
															onClick={() => {
																navigator.clipboard.writeText(
																	cat.id.toString(),
																);
																toast(
																	"Success",
																	"Category ID copied to clipboard",
																	"success",
																);
															}}
														>
															Copy Category ID
														</DropdownItem>
													</Dropdown>
												</div>
											</div>
										</div>

										{/* Subcategories */}
										{expandedCategories.includes(cat.id) &&
											cat.subCategories &&
											cat.subCategories.length > 0 && (
												<div className="bg-gray-50/30 px-6 lg:px-8 pb-8 pt-2">
													<div className="pl-18 grid grid-cols-1 md:grid-cols-2 gap-4">
														{cat.subCategories.map((sub) => (
															<div
																key={sub.id}
																className="bg-white border border-gray-100 p-4 flex items-center justify-between hover:border-gold/50 transition-all group/sub"
															>
																<div className="flex items-center gap-3">
																	<CornerDownRight
																		size={14}
																		className="text-gray-300 group-hover/sub:text-gold transition-colors"
																	/>
																	<div>
																		<h5 className="text-[10px] font-black uppercase tracking-tight text-gray-700 transition-colors group-hover/sub:text-black">
																			{sub.name}
																		</h5>
																		<p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">
																			ID: #{sub.id}
																		</p>
																	</div>
																</div>
																<div className="flex items-center gap-3">
																	<span
																		className={`text-[7px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${
																			sub.isActive
																				? "bg-green-50 text-green-500"
																				: "bg-gray-50 text-gray-300"
																		}`}
																	>
																		{sub.isActive ? "Active" : "Draft"}
																	</span>
																	<Dropdown
																		trigger={
																			<Button
																				variant="ghost"
																				size="sm"
																				className="p-0 h-auto text-gray-200 hover:text-black"
																			>
																				<MoreVertical size={14} />
																			</Button>
																		}
																	>
																		<DropdownItem
																			icon={
																				<Eye
																					size={14}
																					className="text-gray-400"
																				/>
																			}
																			onClick={() =>
																				router.push(
																					`/products?categoryId=${sub.id}`,
																				)
																			}
																		>
																			View Products
																		</DropdownItem>
																		<DropdownItem
																			icon={
																				<Copy
																					size={14}
																					className="text-gray-400"
																				/>
																			}
																			onClick={() => {
																				navigator.clipboard.writeText(
																					sub.id.toString(),
																				);
																				toast(
																					"Success",
																					"Category ID copied to clipboard",
																					"success",
																				);
																			}}
																		>
																			Copy Category ID
																		</DropdownItem>
																	</Dropdown>
																</div>
															</div>
														))}
													</div>
												</div>
											)}
									</div>
								))
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
