"use client";
import React, { useState, useEffect } from "react";
import { ArrowLeft, Save, Plus, Upload, X, Trash2, Settings2, PlusCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useToast } from "@/lib/context/ToastContext";
import * as categoriesService from "@/lib/api/services/categories";
import * as productsService from "@/lib/api/services/products";
import { CategoryResponseDTO } from "@/lib/api/types/categories.types";
import { ATTRIBUTE_CATEGORIES } from "@/lib/constants/attributeCategories";
import { ROBUST_CATEGORIES } from "@/lib/constants/categories";
import { getErrorMessage } from "@/lib/utils/errors";

type ProductType = "simple" | "variable";

interface Attribute {
	id: string;
	name: string;
	values: string[];
}

interface Variation {
	id: string;
	name: string;
	price: string;
	stock: string;
}

const ChipInput = ({ values, onChange, placeholder }: { values: string[], onChange: (v: string[]) => void, placeholder?: string }) => {
	const [inputValue, setInputValue] = useState("");
	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter" && inputValue.trim()) {
			e.preventDefault();
			const newVal = inputValue.trim();
			if (!values.find(v => v.toLowerCase() === newVal.toLowerCase())) {
				onChange([...values, newVal]);
			}
			setInputValue("");
		}
	};
	const removeValue = (valToRemove: string) => {
		onChange(values.filter(v => v !== valToRemove));
	};
	return (
		<div className="w-full bg-gray-50 border border-transparent focus-within:border-gold/30 rounded px-4 py-3 transition-all flex flex-wrap gap-2 items-center min-h-12.5">
			{values.map(val => (
				<span key={val} className="bg-black text-white text-[10px] font-bold px-2.5 py-1.5 rounded flex items-center gap-1.5">
					{val}
					<X size={12} className="cursor-pointer hover:text-gold transition-colors" onClick={() => removeValue(val)} />
				</span>
			))}
			<input
				type="text"
				value={inputValue}
				onChange={e => setInputValue(e.target.value)}
				onKeyDown={handleKeyDown}
				placeholder={values.length === 0 ? placeholder : "Type and press Enter..."}
				className="flex-1 bg-transparent text-xs font-bold text-black outline-none placeholder:text-gray-300 min-w-30"
			/>
		</div>
	);
};

export default function AddProductPage() {
	const router = useRouter();
	const { toast } = useToast();
	const [productType, setProductType] = useState<ProductType>("simple");
	const [attributes, setAttributes] = useState<Attribute[]>([]);
	const [variations, setVariations] = useState<Variation[]>([]);
	const [hasGeneratedVariations, setHasGeneratedVariations] = useState(false);

	// Form State
	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [basePrice, setBasePrice] = useState("");
	const [stockQuantity, setStockQuantity] = useState("");
	const [sku, setSku] = useState("");
	const [categoryId, setCategoryId] = useState("");
	
	const [categories, setCategories] = useState<CategoryResponseDTO[]>([]);
	const [loadingCategories, setLoadingCategories] = useState(true);
	const [isSubmitting, setIsSubmitting] = useState(false);

	useEffect(() => {
		const fetchCats = async () => {
			try {
				setLoadingCategories(true);
				const data = await categoriesService.getCategories();
				
				// Merge API categories with Robust fallbacks, avoiding duplicates by name
				const apiCategoryNames = new Set(data.map(c => c.name?.toLowerCase()));
				const filteredRobust = ROBUST_CATEGORIES.filter(c => !apiCategoryNames.has(c.name?.toLowerCase()));
				
				setCategories([...data, ...filteredRobust]);
			} catch (error) {
				console.error("Failed to load categories:", error);
				// On error, still load the robust ones so the UI isn't broken
				setCategories(ROBUST_CATEGORIES);
				toast("Info", "Using offline category presets.", "info");
			} finally {
				setLoadingCategories(false);
			}
		};
		fetchCats();
	}, [toast]);

	// Flatten categories for the select dropdown (e.g., "Men's Clothing")
	const getFlattenedCategories = () => {
		const flat: { id: string; label: string; name: string }[] = [];
		
		const process = (cats: CategoryResponseDTO[]) => {
			cats.forEach(cat => {
				flat.push({ 
					id: (cat.id || 0).toString(), 
					label: cat.name || "",
					name: cat.name || ""
				});
				if (cat.subCategories && cat.subCategories.length > 0) {
					process(cat.subCategories);
				}
			});
		};
		
		process(categories);
		return flat;
	};

	const flattenedCategories = getFlattenedCategories();

	const getDisplayedPresets = () => {
		if (!categoryId) return [];
		
		// Find selected category in flattened list or original tree
		const findInTree = (cats: CategoryResponseDTO[], id: string): CategoryResponseDTO | undefined => {
			for (const cat of cats) {
				if (cat.id.toString() === id) return cat;
				if (cat.subCategories) {
					const found = findInTree(cat.subCategories, id);
					if (found) return found;
				}
			}
			return undefined;
		};

		const selectedCategory = findInTree(categories, categoryId);
		if (!selectedCategory) return [];
		
		const name = (selectedCategory.name || "").toLowerCase();
		const parentName = (selectedCategory.parentName || "").toLowerCase();
		
		const filtered = ATTRIBUTE_CATEGORIES.filter(cat => 
			cat.keywords.some(k => name.includes(k) || parentName.includes(k))
		);

		return filtered;
	};

	const displayedPresets = getDisplayedPresets();

	const handleTypeSwitch = (type: ProductType) => {
		if (type === "simple" && attributes.length > 0) {
			setAttributes([]);
			setVariations([]);
			setHasGeneratedVariations(false);
			toast("Switched to Simple", "Attributes and variations were reset.", "warning");
		}
		setProductType(type);
	};

	const addAttribute = (name: string = "", initialValues: string[] = []) => {
		if (name && attributes.some(a => a.name.toLowerCase() === name.toLowerCase())) {
			toast("Already exists", `The attribute '${name}' has already been added.`, "info");
			return;
		}
		setAttributes([...attributes, { id: Math.random().toString(36).substring(7), name, values: initialValues }]);
		if (initialValues.length > 0) {
			toast("Attribute Added", `${name} added with ${initialValues.length} predefined options.`, "success");
		}
	};

	const updateAttribute = (id: string, field: keyof Attribute, value: string | string[]) => {
		setAttributes(attributes.map(attr => attr.id === id ? { ...attr, [field]: value } : attr) as Attribute[]);
	};

	const removeAttribute = (id: string) => {
		setAttributes(attributes.filter(attr => attr.id !== id));
	};

	const generateVariations = () => {
		const validAttributes = attributes.filter(a => a.name.trim() && a.values.length > 0);
		if (validAttributes.length === 0) {
			toast("Action needed", "Add at least one attribute with values to generate variations.", "error");
			return;
		}

		const combine = (attrs: Attribute[]): string[][] => {
			if (attrs.length === 0) return [];
			if (attrs.length === 1) return attrs[0].values.map(v => [v]);
			const rest = combine(attrs.slice(1));
			const current = attrs[0].values;
			return current.flatMap(val => rest.map(r => [val, ...r]));
		};

		const combos = combine(validAttributes);
		const newVariations: Variation[] = combos.map(combo => ({
			id: Math.random().toString(36).substring(7),
			name: combo.join(" / "),
			price: "",
			stock: ""
		}));

		setVariations(newVariations);
		setHasGeneratedVariations(true);
		toast("Variations Created", `Successfully generated ${newVariations.length} variations.`, "success");
	};

	const updateVariation = (id: string, field: keyof Variation, value: string) => {
		setVariations(variations.map(variation => variation.id === id ? { ...variation, [field]: value } : variation));
	};

	const handleSubmit = async () => {
		if (!name || !description || !basePrice || !categoryId) {
			toast("Error", "Please fill in all required fields.", "error");
			return;
		}
		try {
			setIsSubmitting(true);
			await productsService.createProduct({
				name,
				description,
				categoryId: Number(categoryId),
				basePrice: Number(basePrice),
				sku: sku || null,
			});
			// Note: Attributes/Variations processing would happen here if the endpoint accepts it
			toast("Success", "Product published successfully", "success");
			router.push("/products");
		} catch (error) {
			toast("Error", getErrorMessage(error), "error");
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="max-w-5xl mx-auto space-y-12 pb-24">
			{/* Header */}
			<div className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-50 -mx-4 px-4 py-4 mb-8 lg:static lg:bg-transparent lg:backdrop-blur-none lg:border-none lg:mx-0 lg:px-0 lg:py-0 lg:mb-12">
				<div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
					<div className="flex items-center gap-4 lg:gap-6">
						<Link
							href="/products"
							className="w-10 h-10 rounded border border-gray-100 flex items-center justify-center text-gray-400 hover:text-black hover:bg-gray-50 transition-all font-bold shrink-0"
						>
							<ArrowLeft size={16} />
						</Link>
						<div>
							<h2 className="text-xl lg:text-3xl font-black tracking-tighter text-black truncate max-w-[200px] sm:max-w-none">
								Add New Product
							</h2>
							<p className="text-gray-400 mt-0.5 lg:mt-1 uppercase tracking-[0.2em] block text-[8px] lg:text-[10px] font-black">
								Create and publish a new marketplace listing
							</p>
						</div>
					</div>
					<div className="flex items-center gap-2 lg:gap-3">
						<button className="flex-1 lg:flex-none px-4 lg:px-8 py-3 lg:py-3.5 rounded border border-gray-100 block text-[9px] lg:text-[10px] font-black uppercase tracking-widest text-black hover:bg-gray-50 transition-all whitespace-nowrap">
							Save Draft
						</button>
						<button 
							onClick={handleSubmit} 
							disabled={isSubmitting}
							className="flex-1 lg:flex-none px-4 lg:px-8 py-3 lg:py-3.5 rounded bg-gold text-[9px] lg:text-[10px] font-black uppercase tracking-widest text-black hover:bg-black hover:text-white transition-all flex items-center justify-center gap-2 disabled:opacity-50 whitespace-nowrap"
						>
							{isSubmitting ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
							Publish Product
						</button>
					</div>
				</div>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
				<div className="lg:col-span-2 space-y-10">
					{/* Basic Info */}
					<div className="bg-white border border-gray-100 rounded p-8 space-y-8">
						<h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-gold pb-6 border-b border-gray-50">
							General Information
						</h4>
						<div className="space-y-6">
							<div className="space-y-2.5">
								<label className="block text-[10px] font-black uppercase tracking-widest text-gray-400">
									Product Name <span className="text-red-500">*</span>
								</label>
								<input
									type="text"
									placeholder="e.g. Premium Wireless Headphones"
									value={name}
									onChange={(e) => setName(e.target.value)}
									className="w-full bg-gray-50 border border-transparent focus:border-gold/30 rounded px-5 py-4 text-xs font-bold text-black outline-none transition-all placeholder:text-gray-300"
								/>
							</div>
							<div className="space-y-2.5">
								<label className="block text-[10px] font-black uppercase tracking-widest text-gray-400">
									Product Description <span className="text-red-500">*</span>
								</label>
								<textarea
									rows={6}
									placeholder="Describe your product details..."
									value={description}
									onChange={(e) => setDescription(e.target.value)}
									className="w-full bg-gray-50 border border-transparent focus:border-gold/30 rounded px-5 py-4 text-xs font-bold text-black outline-none transition-all placeholder:text-gray-300 resize-none"
								/>
							</div>
						</div>
					</div>

					{/* Media */}
					<div className="bg-white border border-gray-100 rounded p-8 space-y-8">
						<h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-gold pb-6 border-b border-gray-50 flex justify-between items-center">
							<span>Product Gallery</span>
							<span className="text-gray-300 text-[9px] normal-case tracking-normal font-bold">Max 4 images (5MB each)</span>
						</h4>
						<div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
							<div className="aspect-square border-2 border-dashed border-gray-200 bg-gray-50 rounded flex flex-col items-center justify-center text-gray-400 hover:border-gold hover:bg-gold/5 hover:text-gold transition-all cursor-pointer group">
								<Upload
									size={24}
									className="mb-2 group-hover:-translate-y-1 transition-transform"
								/>
								<span className="text-[8px] font-black uppercase tracking-widest text-center px-2">
									Main Image
								</span>
							</div>
							{[1, 2, 3].map((i) => (
								<div
									key={i}
									className="aspect-square border-2 border-dashed border-gray-100 rounded flex flex-col items-center justify-center text-gray-200 hover:border-gold hover:text-gold hover:bg-gold/5 transition-all cursor-pointer group"
								>
									<Plus size={20} className="group-hover:scale-110 transition-transform" />
								</div>
							))}
						</div>
					</div>

					{/* Product Type & Pricing/Inventory */}
					<div className="bg-white border border-gray-100 rounded p-8 space-y-8">
						<h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-gold pb-6 border-b border-gray-50">
							Pricing & Variants
						</h4>
						
						{/* Type Toggle */}
						<div className="bg-gray-50 p-1.5 rounded flex w-full mb-4">
							<button
								onClick={() => handleTypeSwitch("simple")}
								className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded transition-all ${
									productType === "simple" 
										? "bg-white text-black" 
										: "text-gray-400 hover:text-black"
								}`}
							>
								Simple Product
							</button>
							<button
								onClick={() => handleTypeSwitch("variable")}
								className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded transition-all ${
									productType === "variable" 
										? "bg-white text-black" 
										: "text-gray-400 hover:text-black"
								}`}
							>
								Variable Product
							</button>
						</div>

						{/* Simple Product Fields */}
						{productType === "simple" && (
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
								<div className="space-y-2.5">
									<label className="block text-[10px] font-black uppercase tracking-widest text-gray-400">
										Base Price (₦) <span className="text-red-500">*</span>
									</label>
									<input
										type="number"
										min="0"
										step="0.01"
										placeholder="0.00"
										value={basePrice}
										onChange={(e) => setBasePrice(e.target.value)}
										className="w-full bg-gray-50 border border-transparent focus:border-gold/30 rounded px-5 py-4 text-xs font-black text-black outline-none transition-all placeholder:text-gray-300"
									/>
								</div>
								<div className="space-y-2.5">
									<label className="block text-[10px] font-black uppercase tracking-widest text-gray-400">
										Stock Quantity <span className="text-red-500">*</span>
									</label>
									<input
										type="number"
										min="0"
										placeholder="0"
										value={stockQuantity}
										onChange={(e) => setStockQuantity(e.target.value)}
										className="w-full bg-gray-50 border border-transparent focus:border-gold/30 rounded px-5 py-4 text-xs font-bold text-black outline-none transition-all placeholder:text-gray-300"
									/>
								</div>
							</div>
						)}

						{/* Variable Product Fields */}
						{productType === "variable" && (
							<div className="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-300">
								{/* Attribute Builder */}
								<div className="space-y-6">
									<div className="flex items-center justify-between">
										<div>
											<h5 className="text-xs font-black text-black">Product Attributes</h5>
											<p className="text-[10px] text-gray-400 font-bold mt-1">Add attributes like Size or Color, and specify their options.</p>
										</div>
									</div>
									
									<div className="space-y-4">
										{attributes.map((attr, index) => (
											<div key={attr.id} className="p-5 border border-gray-100 rounded bg-white space-y-4 relative group">
												<button 
													onClick={() => removeAttribute(attr.id)}
													className="absolute top-4 right-4 text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
												>
													<Trash2 size={16} />
												</button>
												<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
													<div className="space-y-2.5">
														<label className="block text-[10px] font-black uppercase tracking-widest text-gray-400">
															Attribute Name
														</label>
														<input
															type="text"
															value={attr.name}
															onChange={e => updateAttribute(attr.id, "name", e.target.value)}
															placeholder="e.g. Size"
															className="w-full bg-gray-50 border border-transparent focus:border-gold/30 rounded px-4 py-3 text-xs font-bold text-black outline-none transition-all placeholder:text-gray-300"
														/>
													</div>
													<div className="md:col-span-2 space-y-2.5">
														<label className="block text-[10px] font-black uppercase tracking-widest text-gray-400">
															Values (Press enter to add)
														</label>
														<ChipInput 
															values={attr.values} 
															onChange={(newValues) => updateAttribute(attr.id, "values", newValues)} 
															placeholder="Type options like 'Small', 'Red'..."
														/>
													</div>
												</div>
											</div>
										))}
									</div>

									{/* Quick Add and Custom Add Actions */}
									<div className="space-y-6 pt-4 border-t border-gray-50">
										<div>
											<h6 className="text-[11px] font-black uppercase tracking-widest text-black flex items-center justify-between mb-4">
												<span>Quick Add Presets</span>
												<button 
													onClick={() => addAttribute()}
													className="bg-black hover:bg-gold text-white hover:text-black text-[10px] font-black px-4 py-2 rounded flex items-center gap-1.5 transition-colors border border-transparent"
												>
													<Plus size={12} />
													Custom Attribute
												</button>
											</h6>
											
											<div className="grid grid-cols-1 sm:grid-cols-3 gap-6 relative">
												{displayedPresets.map(category => (
													<div key={category.label} className="space-y-2.5">
														<span className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2 block border-l-2 border-gold pl-2">
															{category.label}
														</span>
														<div className="flex flex-col gap-2">
															{category.attributes.map(attr => (
																<button
																	key={attr.name}
																	onClick={() => addAttribute(attr.name, attr.defaultValues)}
																	className="bg-gray-50 hover:bg-gold/10 hover:text-gold text-gray-500 text-[10px] font-bold px-3 py-2.5 rounded flex items-center justify-between transition-all border border-transparent hover:border-gold/30 text-left w-full group"
																>
																	<span className="flex items-center gap-1.5">
																		<PlusCircle size={12} className="text-gray-300 group-hover:text-gold" />
																		{attr.name}
																	</span>
																	<span className="text-[9px] font-medium text-gray-300 group-hover:text-gold/60 truncate max-w-20">
																		{attr.example}
																	</span>
																</button>
															))}
														</div>
													</div>
												))}
											</div>
										</div>
									</div>
								</div>

								{/* Generate Variations Button */}
								<div className="pt-6 border-t border-gray-50">
									<button 
										onClick={generateVariations}
										className="w-full py-4 rounded bg-black text-white text-[11px] font-black uppercase tracking-widest hover:bg-gold hover:text-black transition-all flex flex-col items-center justify-center gap-1"
									>
										<span>Generate Variations</span>
										{attributes.length > 0 && <span className="text-[9px] text-gray-400 normal-case tracking-normal font-bold">This will create all combinations based on attributes</span>}
									</button>
								</div>

								{/* Variations Table */}
								<div className="pt-4 space-y-4">
									<div className="flex items-center justify-between">
										<h5 className="text-xs font-black text-black">Variations ({variations.length})</h5>
										{variations.length > 0 && (
											<button 
												onClick={() => { setVariations([]); setHasGeneratedVariations(false); toast("Cleared", "All variations have been cleared.", "info"); }}
												className="text-[10px] font-bold text-gray-400 hover:text-red-500 transition-colors"
											>
												Clear Variations
											</button>
										)}
									</div>
									
									{!hasGeneratedVariations ? (
										<div className="py-12 border border-dashed border-gray-200 rounded flex flex-col items-center justify-center text-center space-y-3 bg-gray-50/50">
											<div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-gray-300 border border-gray-100">
												<Settings2 size={24} />
											</div>
											<div>
												<p className="text-sm font-black text-gray-400">No variations generated yet</p>
												<p className="text-[10px] font-bold text-gray-300 mt-1">Add attributes and click generate above</p>
											</div>
										</div>
									) : variations.length === 0 ? (
										<div className="py-8 border border-dashed border-gray-200 rounded flex items-center justify-center text-gray-400 text-xs font-bold">
											No valid combinations. Ensure attributes have values.
										</div>
									) : (
										<div className="border border-gray-100 rounded overflow-hidden">
											<div className="overflow-x-auto">
												<table className="w-full text-left border-collapse">
													<thead>
														<tr className="bg-gray-50 border-b border-gray-100">
															<th className="px-5 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400 w-1/2">
																Variation Focus
															</th>
															<th className="px-5 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400 w-1/4">
																Price (₦)
															</th>
															<th className="px-5 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400 w-1/4">
																Stock
															</th>
														</tr>
													</thead>
													<tbody className="divide-y divide-gray-50">
														{variations.map((v) => (
															<tr key={v.id} className="hover:bg-gray-50/50 transition-colors">
																<td className="px-5 py-4 text-xs font-black text-black">
																	{v.name}
																</td>
																<td className="px-5 py-3">
																	<input
																		type="text"
																		value={v.price}
																		onChange={e => updateVariation(v.id, "price", e.target.value)}
																		placeholder="0.00"
																		className="w-full bg-white border border-gray-200 focus:border-gold/50 rounded px-3 py-2 text-xs font-bold text-black outline-none transition-all placeholder:text-gray-300"
																	/>
																</td>
																<td className="px-5 py-3">
																	<input
																		type="number"
																		value={v.stock}
																		onChange={e => updateVariation(v.id, "stock", e.target.value)}
																		placeholder="0"
																		className="w-full bg-white border border-gray-200 focus:border-gold/50 rounded px-3 py-2 text-xs font-bold text-black outline-none transition-all placeholder:text-gray-300"
																	/>
																</td>
															</tr>
														))}
													</tbody>
												</table>
											</div>
										</div>
									)}
								</div>
							</div>
						)}
					</div>
				</div>

				{/* Right Sidebar - Organization */}
				<div className="space-y-10">
					<div className="bg-white border border-gray-100 rounded p-8 space-y-8">
						<h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-gold pb-6 border-b border-gray-50">
							Organization
						</h4>
						<div className="space-y-6">
							<div className="space-y-2.5">
								<label className="block text-[10px] font-black uppercase tracking-widest text-gray-400">
									Category Selection <span className="text-red-500">*</span>
								</label>
								<div className="relative">
									<select 
										value={categoryId}
										onChange={(e) => setCategoryId(e.target.value)}
										disabled={loadingCategories}
										className="w-full bg-gray-50 border border-transparent focus:border-gold/30 rounded px-5 py-4 text-xs font-bold text-black outline-none transition-all appearance-none cursor-pointer"
									>
										<option value="">{loadingCategories ? "Loading categories..." : "Select Category"}</option>
										{flattenedCategories.map((cat) => (
											<option key={cat.id} value={cat.id}>
												{cat.label}
											</option>
										))}
									</select>
									<div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-400">
										{loadingCategories ? <Loader2 size={14} className="animate-spin" /> : (
											<svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
												<path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
											</svg>
										)}
									</div>
								</div>
							</div>
							<div className="space-y-2.5">
								<label className="block text-[10px] font-black uppercase tracking-widest text-gray-400">
									SKU Number
								</label>
								<input
									type="text"
									placeholder="PROD-8291-BL"
									value={sku}
									onChange={(e) => setSku(e.target.value)}
									className="w-full bg-gray-50 border border-transparent focus:border-gold/30 rounded px-5 py-4 text-xs font-bold text-black outline-none transition-all placeholder:text-gray-300"
								/>
								<p className="text-[9px] text-gray-400 font-bold">Leave empty auto-generate</p>
							</div>
							<div className="space-y-2.5 pt-4 border-t border-gray-50">
								<label className="block text-[10px] font-black uppercase tracking-widest text-gray-400">
									Launch Status
								</label>
								<div className="flex gap-2">
									<button className="flex-1 py-3.5 rounded bg-black text-[9px] font-black uppercase tracking-widest text-white border border-black transition-all hover:bg-black/90">
										Publish
									</button>
									<button className="flex-1 py-3.5 rounded bg-white text-[9px] font-black uppercase tracking-widest text-gray-400 border border-gray-100 hover:border-gold hover:text-gold transition-all">
										Schedule
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
