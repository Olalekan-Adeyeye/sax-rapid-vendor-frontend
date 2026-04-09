"use client";
import React, { useState, useEffect, useMemo } from "react";
import {
	ArrowLeft,
	Save,
	Plus,
	Upload,
	X,
	Trash2,
	Settings2,
	PlusCircle,
	Loader2,
	Calendar,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/context/AuthContext";
import { useToast } from "@/lib/context/ToastContext";
import { zodResolver } from "@hookform/resolvers/zod";
import * as categoriesService from "@/lib/api/services/categories";
import * as productsService from "@/lib/api/services/products";
import { CategoryResponseDTO } from "@/lib/api/types/categories.types";
import { ATTRIBUTE_CATEGORIES } from "@/lib/constants/attributeCategories";
import { ROBUST_CATEGORIES } from "@/lib/constants/categories";
import { getErrorMessage } from "@/lib/utils/errors";
import { Input } from "@/components/ui/Input";
import { TextArea } from "@/components/ui/TextArea";
import { Select } from "@/components/ui/Select";
import {
	useForm,
	useWatch,
	UseFormRegister,
	UseFormSetValue,
	FieldErrors,
	Path,
} from "react-hook-form";
import { productSchema, ProductFormValues } from "@/lib/schemas/vendor";
import { CreateProductDTO } from "@/lib/api/types/products.types";

// Helper type that represents the logical OR of all fields for easier RHF integration
type FlatProductValues = {
	name: string;
	description: string;
	categoryId: string;
	type: "simple" | "variable";
	regularPrice: string;
	salePrice?: string;
	saleStartDate?: string;
	saleEndDate?: string;
	stockQuantity: string;
	sku?: string;
	weight: string;
	length?: string;
	width?: string;
	height?: string;
	status: string;
	attributes: Attribute[];
	variations: Variation[];
};

interface Attribute {
	id: string;
	name: string;
	values: string[];
}

interface Variation {
	id: string;
	name: string;
	price: string;
	salePrice?: string;
	saleStartDate?: string;
	saleEndDate?: string;
	stock: string;
}

const ChipInput = ({
	values,
	onChange,
	placeholder,
}: {
	values: string[];
	onChange: (v: string[]) => void;
	placeholder?: string;
}) => {
	const [inputValue, setInputValue] = useState("");
	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter" && inputValue.trim()) {
			e.preventDefault();
			const newVal = inputValue.trim();
			if (!values.find((v) => v.toLowerCase() === newVal.toLowerCase())) {
				onChange([...values, newVal]);
			}
			setInputValue("");
		}
	};
	const removeValue = (valToRemove: string) => {
		onChange(values.filter((v) => v !== valToRemove));
	};
	return (
		<div className="w-full bg-gray-50 border border-transparent focus-within:border-gold/30 rounded px-4 py-3 transition-all flex flex-wrap gap-2 items-center min-h-12.5">
			{values.map((val) => (
				<span
					key={val}
					className="bg-black text-white text-[10px] font-bold px-2.5 py-1.5 rounded flex items-center gap-1.5"
				>
					{val}
					<X
						size={12}
						className="cursor-pointer hover:text-gold transition-colors"
						onClick={() => removeValue(val)}
					/>
				</span>
			))}
			<input
				type="text"
				value={inputValue}
				onChange={(e) => setInputValue(e.target.value)}
				onKeyDown={handleKeyDown}
				placeholder={
					values.length === 0 ? placeholder : "Type and press Enter..."
				}
				className="flex-1 bg-transparent text-xs font-bold text-black outline-none placeholder:text-gray-300 min-w-30"
			/>
		</div>
	);
};

export default function AddProductPage() {
	const router = useRouter();
	const { user } = useAuth();
	const { toast } = useToast();

	const currencySymbol = useMemo(() => {
		const code = user?.countryCode?.toUpperCase();
		if (code === "NG") return "₦";
		if (code === "ZA") return "R";
		return "$";
	}, [user?.countryCode]);

	const [hasGeneratedVariations, setHasGeneratedVariations] = useState(false);
	const [expandedVariationSchedules, setExpandedVariationSchedules] = useState<
		Set<string>
	>(new Set());

	const [categories, setCategories] = useState<CategoryResponseDTO[]>([]);
	const [loadingCategories, setLoadingCategories] = useState(true);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const form = useForm<ProductFormValues>({
		resolver: zodResolver(productSchema),
		defaultValues: {
			type: "simple",
			name: "",
			description: "",
			categoryId: "",
			regularPrice: "",
			salePrice: "",
			saleStartDate: "",
			saleEndDate: "",
			weight: "",
			length: "",
			width: "",
			height: "",
			status: "In stock",
			attributes: [],
			variations: [],
		} as unknown as ProductFormValues,
	});

	const [isSchedulingSale, setIsSchedulingSale] = useState(false);

	const {
		register,
		handleSubmit,
		setValue,
		control,
		formState: { errors },
	} = form;

	// Typed versions of RHF utilities for the union type
	// We cast to unknown first to avoid the "neither type sufficiently overlaps" error
	const registerField =
		register as unknown as UseFormRegister<FlatProductValues>;
	const setFieldValue =
		setValue as unknown as UseFormSetValue<FlatProductValues>;
	const fieldErrors = errors as unknown as FieldErrors<FlatProductValues>;

	const formValues = useWatch({ control });
	const productType = formValues.type;
	const categoryId = formValues.categoryId;
	const attributes = (formValues.type === "variable"
		? formValues.attributes
		: []) as unknown as Attribute[];
	const variations = (formValues.type === "variable"
		? formValues.variations
		: []) as unknown as Variation[];

	useEffect(() => {
		const fetchCats = async () => {
			try {
				setLoadingCategories(true);
				const data = (await categoriesService.getCategories()) || [];

				const apiCategoryNames = new Set(
					data.filter((c) => c && c.name).map((c) => c.name?.toLowerCase()),
				);
				const filteredRobust = ROBUST_CATEGORIES.filter(
					(c) => c && c.name && !apiCategoryNames.has(c.name?.toLowerCase()),
				);

				setCategories([...data, ...filteredRobust]);
			} catch (error) {
				console.error("Failed to load categories:", error);
				setCategories(ROBUST_CATEGORIES);
				toast("Info", "Using offline category presets.", "info");
			} finally {
				setLoadingCategories(false);
			}
		};
		fetchCats();
	}, [toast]);

	const flattenedCategories = useMemo(() => {
		const flat: { id: string; label: string; name: string }[] = [];
		const seenIds = new Set<string>();

		const process = (cats: CategoryResponseDTO[]) => {
			if (!cats || !Array.isArray(cats)) return;
			cats.forEach((cat) => {
				if (!cat) return;
				const stringId = (cat.id ?? "").toString();
				if (stringId && !seenIds.has(stringId)) {
					flat.push({
						id: stringId,
						label: cat.name || "Unnamed Category",
						name: cat.name || "",
					});
					seenIds.add(stringId);
				}
				if (cat.subCategories && cat.subCategories.length > 0) {
					process(cat.subCategories);
				}
			});
		};
		process(categories);
		return flat;
	}, [categories]);

	const displayedPresets = useMemo(() => {
		if (!categoryId) return [];
		const findInTree = (
			cats: CategoryResponseDTO[],
			id: string,
		): CategoryResponseDTO | undefined => {
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
		const catName = (selectedCategory.name || "").toLowerCase();
		const parentName = (selectedCategory.parentName || "").toLowerCase();
		return ATTRIBUTE_CATEGORIES.filter((cat) =>
			cat.keywords.some((k) => catName.includes(k) || parentName.includes(k)),
		);
	}, [categories, categoryId]);

	const handleTypeSwitch = (type: "simple" | "variable") => {
		if (type === "simple" && attributes.length > 0) {
			setValue("attributes", []);
			setValue("variations", []);
			setHasGeneratedVariations(false);
			toast(
				"Switched to Simple",
				"Attributes and variations were reset.",
				"warning",
			);
		}
		setValue("type", type);
	};

	const addAttribute = (name: string = "", initialValues: string[] = []) => {
		if (
			name &&
			attributes.some(
				(a: Attribute) => a.name.toLowerCase() === name.toLowerCase(),
			)
		) {
			toast(
				"Already exists",
				`The attribute '${name}' has already been added.`,
				"info",
			);
			return;
		}
		setFieldValue("attributes" as Path<FlatProductValues>, [
			...attributes,
			{
				id: Math.random().toString(36).substring(7),
				name,
				values: initialValues,
			},
		]);
		if (initialValues.length > 0) {
			toast(
				"Attribute Added",
				`${name} added with ${initialValues.length} predefined options.`,
				"success",
			);
		}
	};

	const updateAttribute = (
		id: string,
		field: keyof Attribute,
		value: string | string[],
	) => {
		const updated = attributes.map((attr: Attribute) =>
			attr.id === id ? { ...attr, [field]: value } : attr,
		);
		setFieldValue("attributes" as Path<FlatProductValues>, updated);
	};

	const removeAttribute = (id: string) => {
		const filtered = attributes.filter((attr: Attribute) => attr.id !== id);
		setFieldValue("attributes" as Path<FlatProductValues>, filtered);
	};

	const toggleVariationSchedule = (id: string) => {
		setExpandedVariationSchedules((prev) => {
			const next = new Set(prev);
			if (next.has(id)) next.delete(id);
			else next.add(id);
			return next;
		});
	};

	const generateVariations = () => {
		const validAttributes = attributes.filter(
			(a: Attribute) => a.name.trim() && a.values.length > 0,
		);
		if (validAttributes.length === 0) {
			toast(
				"Action needed",
				"Add at least one attribute with values to generate variations.",
				"error",
			);
			return;
		}

		const combine = (attrs: Attribute[]): string[][] => {
			if (attrs.length === 0) return [];
			if (attrs.length === 1) return attrs[0].values.map((v: string) => [v]);
			const rest = combine(attrs.slice(1));
			const current = attrs[0].values;
			return current.flatMap((val: string) =>
				rest.map((r: string[]) => [val, ...r]),
			);
		};

		const combos = combine(validAttributes);
		const newVariations = combos.map((combo: string[]) => ({
			id: Math.random().toString(36).substring(7),
			name: combo.join(" / "),
			price: "",
			salePrice: "",
			saleStartDate: "",
			saleEndDate: "",
			stock: "",
		}));

		setFieldValue("variations" as Path<FlatProductValues>, newVariations);
		setHasGeneratedVariations(true);
		toast(
			"Variations Created",
			`Successfully generated ${newVariations.length} variations.`,
			"success",
		);
	};

	const updateVariation = (
		id: string,
		field: keyof Variation,
		value: string,
	) => {
		const updated = variations.map((v: Variation) =>
			v.id === id ? { ...v, [field]: value } : v,
		);
		setFieldValue("variations" as Path<FlatProductValues>, updated);
	};

	const onSubmit = async (values: ProductFormValues) => {
		const data = values as unknown as FlatProductValues;
		try {
			setIsSubmitting(true);

			let payload: CreateProductDTO;

			if (data.type === "simple") {
				// Simple products only supports these fields
				payload = {
					name: data.name,
					description: data.description,
					categoryId: Number(data.categoryId),
					basePrice: Number(data.regularPrice),
					sku: data.sku || null,
				};
			} else {
				// For variable products, we send the full schema as it will be supported later
				payload = {
					name: data.name,
					description: data.description,
					categoryId: Number(data.categoryId),
					basePrice: 0, // Base price is usually 0 for variable products
					salePrice: data.salePrice ? Number(data.salePrice) : null,
					saleStartDate: data.saleStartDate || null,
					saleEndDate: data.saleEndDate || null,
					sku: data.sku || null,
					weight: Number(data.weight),
					length: data.length ? Number(data.length) : null,
					width: data.width ? Number(data.width) : null,
					height: data.height ? Number(data.height) : null,
					status: data.status,
					attributes: data.attributes.map((a) => ({
						name: a.name,
						values: a.values,
					})),
					variations: data.variations.map((v) => ({
						name: v.name,
						price: Number(v.price),
						salePrice: v.salePrice ? Number(v.salePrice) : null,
						saleStartDate: v.saleStartDate || null,
						saleEndDate: v.saleEndDate || null,
						stockQuantity: Number(v.stock),
					})),
				};
			}

			await productsService.createProduct(payload);
			toast("Success", "Product published successfully", "success");
			router.push("/products");
		} catch (error) {
			toast("Error", getErrorMessage(error), "error");
		} finally {
			setIsSubmitting(false);
		}
	};

	// Organization Segment shared between mobile and desktop
	const organizationCard = (
		<div className="bg-white border border-gray-100 rounded p-8 space-y-8 h-fit">
			<h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-gold pb-6 border-b border-gray-50">
				Organization
			</h4>
			<div className="space-y-6">
				<Select
					id="category-selection"
					label="Category Selection"
					required
					value={categoryId}
					onChange={(e) => setValue("categoryId", e.target.value)}
					disabled={loadingCategories}
					options={flattenedCategories.map((cat) => ({
						label: cat.label,
						value: cat.id,
					}))}
					leftSlot={
						loadingCategories ? (
							<Loader2 size={14} className="animate-spin" />
						) : null
					}
					error={errors.categoryId?.message}
				/>
				<Input
					id="sku-number"
					label="SKU Number"
					placeholder="PROD-8291-BL"
					{...register("sku")}
					error={errors.sku?.message}
					helpText="Leave empty to auto-generate"
				/>
			</div>
		</div>
	);

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
							<h2 className="text-xl lg:text-3xl font-black tracking-tighter text-black truncate max-w-50 sm:max-w-none">
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
							onClick={handleSubmit((data) =>
								onSubmit(data as ProductFormValues),
							)}
							disabled={isSubmitting}
							className="flex-1 lg:flex-none px-4 lg:px-8 py-3 lg:py-3.5 rounded bg-gold text-[9px] lg:text-[10px] font-black uppercase tracking-widest text-black hover:bg-black hover:text-white transition-all flex items-center justify-center gap-2 disabled:opacity-50 whitespace-nowrap"
						>
							{isSubmitting ? (
								<Loader2 size={14} className="animate-spin" />
							) : (
								<Save size={14} />
							)}
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
							<Input
								id="product-name"
								label="Product Name"
								required
								placeholder="e.g. Premium Wireless Headphones"
								{...register("name")}
								error={errors.name?.message}
							/>
							<TextArea
								id="product-description"
								label="Product Description"
								required
								rows={6}
								placeholder="Describe your product details..."
								{...register("description")}
								error={errors.description?.message}
							/>
						</div>
					</div>

					{/* Mobile Organization (Visible only on small screens) */}
					<div className="lg:hidden">{organizationCard}</div>

					{/* Media */}
					<div className="bg-white border border-gray-100 rounded p-8 space-y-8">
						<h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-gold pb-6 border-b border-gray-50 flex justify-between items-center">
							<span>Product Gallery</span>
							<span className="text-gray-300 text-[9px] normal-case tracking-normal font-bold">
								Max 4 images (5MB each)
							</span>
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
									<Plus
										size={20}
										className="group-hover:scale-110 transition-transform"
									/>
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
							<div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
								<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
									<Input
										id="regular-price"
										label={`Regular Price (${currencySymbol})`}
										required
										type="number"
										min="0"
										step="0.01"
										placeholder="0.00"
										{...registerField("regularPrice")}
										error={fieldErrors.regularPrice?.message}
									/>
									<div className="space-y-2">
										<label className="text-[10px] font-black uppercase tracking-widest text-gray-400">
											Sale Price ({currencySymbol})
										</label>
										<Input
											id="sale-price"
											type="number"
											min="0"
											step="0.01"
											placeholder="0.00"
											{...registerField("salePrice")}
											error={fieldErrors.salePrice?.message}
											outerClassName="!mt-0"
											rightSlot={
												<button
													type="button"
													onClick={() => setIsSchedulingSale(!isSchedulingSale)}
													title="Schedule Sale Dates"
													className={`transition-colors ${isSchedulingSale ? "text-gold" : "text-gray-300 hover:text-gold"}`}
												>
													<Calendar size={14} />
												</button>
											}
										/>
									</div>
								</div>

								{isSchedulingSale && (
									<div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-gray-50/50 rounded animate-in zoom-in-95 duration-200">
										<Input
											id="sale-start-date"
											label="Sale Start Date"
											type="date"
											{...registerField("saleStartDate")}
										/>
										<Input
											id="sale-end-date"
											label="Sale End Date"
											type="date"
											{...registerField("saleEndDate")}
										/>
									</div>
								)}

								<Input
									id="stock-quantity"
									label="Stock Quantity"
									required
									type="number"
									min="0"
									placeholder="0"
									{...registerField("stockQuantity")}
									error={fieldErrors.stockQuantity?.message}
								/>
							</div>
						)}

						{/* Variable Product Fields */}
						{productType === "variable" && (
							<div className="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-300">
								{/* Attribute Builder */}
								<div className="space-y-6">
									<div className="flex items-center justify-between">
										<div>
											<h5 className="text-xs font-black text-black">
												Product Attributes
											</h5>
											<p className="text-[10px] text-gray-400 font-bold mt-1">
												Add attributes like Size or Color, and specify their
												options.
											</p>
										</div>
									</div>

									<div className="space-y-4">
										{attributes.map((attr: Attribute) => (
											<div
												key={attr.id}
												className="p-5 border border-gray-100 rounded bg-white space-y-4 relative group"
											>
												<button
													onClick={() => removeAttribute(attr.id)}
													className="absolute top-4 right-4 text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
												>
													<Trash2 size={16} />
												</button>
												<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
													<Input
														id={`attr-name-${attr.id}`}
														label="Attribute Name"
														value={attr.name}
														onChange={(e) =>
															updateAttribute(attr.id, "name", e.target.value)
														}
														placeholder="e.g. Size"
														outerClassName="w-full"
													/>
													<div className="md:col-span-2 space-y-2.5">
														<label className="block text-[10px] font-black uppercase tracking-widest text-gray-400">
															Values (Press enter to add)
														</label>
														<ChipInput
															values={attr.values}
															onChange={(newValues) =>
																updateAttribute(attr.id, "values", newValues)
															}
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
												{displayedPresets.map((category) => (
													<div key={category.label} className="space-y-2.5">
														<span className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2 block border-l-2 border-gold pl-2">
															{category.label}
														</span>
														<div className="flex flex-col gap-2">
															{category.attributes.map((attr) => (
																<button
																	key={attr.name}
																	onClick={() =>
																		addAttribute(attr.name, attr.defaultValues)
																	}
																	className="bg-gray-50 hover:bg-gold/10 hover:text-gold text-gray-500 text-[10px] font-bold px-3 py-2.5 rounded flex items-center justify-between transition-all border border-transparent hover:border-gold/30 text-left w-full group"
																>
																	<span className="flex items-center gap-1.5">
																		<PlusCircle
																			size={12}
																			className="text-gray-300 group-hover:text-gold"
																		/>
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
										{attributes.length > 0 && (
											<span className="text-[9px] text-gray-400 normal-case tracking-normal font-bold">
												This will create all combinations based on attributes
											</span>
										)}
									</button>
								</div>

								{/* Variations Table */}
								<div className="pt-4 space-y-4">
									<div className="flex items-center justify-between">
										<h5 className="text-xs font-black text-black">
											Variations ({variations.length})
										</h5>
										{variations.length > 0 && (
											<button
												onClick={() => {
													setValue("variations", []);
													setHasGeneratedVariations(false);
													toast(
														"Cleared",
														"All variations have been cleared.",
														"info",
													);
												}}
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
												<p className="text-sm font-black text-gray-400">
													No variations generated yet
												</p>
												<p className="text-[10px] font-bold text-gray-300 mt-1">
													Add attributes and click generate above
												</p>
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
															<th className="px-5 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400 w-1/3">
																Variation Focus
															</th>
															<th className="px-5 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400 w-1/4">
																Price ({currencySymbol})
															</th>
															<th className="px-5 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400 w-1/4">
																Sale ({currencySymbol})
															</th>
															<th className="px-5 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400 w-1/6">
																Stock
															</th>
														</tr>
													</thead>
													<tbody className="divide-y divide-gray-50">
														{variations.map((v: Variation) => (
															<React.Fragment key={v.id}>
																<tr className="hover:bg-gray-50/50 transition-colors border-b border-gray-50">
																	<td className="px-5 py-4 text-xs font-black text-black">
																		{v.name}
																	</td>
																	<td className="px-5 py-3">
																		<Input
																			id={`var-price-${v.id}`}
																			value={v.price}
																			onChange={(e) =>
																				updateVariation(
																					v.id,
																					"price",
																					e.target.value,
																				)
																			}
																			placeholder="0.00"
																			className="bg-white border-gray-200 focus:border-gold/50 py-2.5! px-4!"
																		/>
																	</td>
																	<td className="px-5 py-3">
																		<Input
																			id={`var-sale-price-${v.id}`}
																			value={v.salePrice}
																			onChange={(e) =>
																				updateVariation(
																					v.id,
																					"salePrice",
																					e.target.value,
																				)
																			}
																			placeholder="0.00"
																			className="bg-white border-gray-200 focus:border-gold/50 py-2.5! pl-4! pr-10!"
																			rightSlot={
																				<button
																					type="button"
																					onClick={() =>
																						toggleVariationSchedule(v.id)
																					}
																					title="Schedule Sale Dates"
																					className={`transition-colors ${expandedVariationSchedules.has(v.id) ? "text-gold" : "text-gray-300 hover:text-gold"}`}
																				>
																					<Calendar size={12} />
																				</button>
																			}
																		/>
																	</td>
																	<td className="px-5 py-3">
																		<Input
																			id={`var-stock-${v.id}`}
																			type="number"
																			value={v.stock}
																			onChange={(e) =>
																				updateVariation(
																					v.id,
																					"stock",
																					e.target.value,
																				)
																			}
																			placeholder="0"
																			className="bg-white border-gray-200 focus:border-gold/50 py-2.5! px-4!"
																		/>
																	</td>
																</tr>
																{expandedVariationSchedules.has(v.id) && (
																	<tr className="bg-gray-50/30">
																		<td colSpan={4} className="px-5 py-4">
																			<div className="grid grid-cols-2 gap-4 animate-in slide-in-from-top-1 duration-200">
																				<div className="space-y-1.5">
																					<label className="text-[8px] font-black uppercase tracking-widest text-gray-400 ml-1">
																						Start Date
																					</label>
																					<Input
																						id={`var-sale-start-${v.id}`}
																						type="date"
																						value={v.saleStartDate}
																						onChange={(e) =>
																							updateVariation(
																								v.id,
																								"saleStartDate",
																								e.target.value,
																							)
																						}
																						className="bg-white border-gray-100 py-2! px-3!"
																					/>
																				</div>
																				<div className="space-y-1.5">
																					<label className="text-[8px] font-black uppercase tracking-widest text-gray-400 ml-1">
																						End Date
																					</label>
																					<Input
																						id={`var-sale-end-${v.id}`}
																						type="date"
																						value={v.saleEndDate}
																						onChange={(e) =>
																							updateVariation(
																								v.id,
																								"saleEndDate",
																								e.target.value,
																							)
																						}
																						className="bg-white border-gray-100 py-2! px-3!"
																					/>
																				</div>
																			</div>
																		</td>
																	</tr>
																)}
															</React.Fragment>
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

					{/* Shipping & Inventory */}
					<div className="bg-white border border-gray-100 rounded p-8 space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
						<h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-gold pb-6 border-b border-gray-50 flex items-center gap-2">
							Shipping & Inventory
						</h4>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
							<Input
								id="product-weight"
								label="Weight (kg)"
								required
								type="number"
								step="0.01"
								min="0"
								placeholder="0.00"
								{...registerField("weight")}
								error={fieldErrors.weight?.message}
								rightSlot={
									<span className="text-[10px] font-black text-gray-300 pr-5">
										KG
									</span>
								}
							/>
							<Select
								id="inventory-status"
								label="Inventory Status"
								required
								options={[
									{ label: "In stock", value: "In stock" },
									{ label: "Out of Stock", value: "Out of Stock" },
									{ label: "Pre-order", value: "Pre-order" },
								]}
								{...registerField("status")}
								error={fieldErrors.status?.message}
							/>
						</div>

						<div className="pt-4 space-y-4">
							<label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-2">
								Dimensions (L x W x H) cm
							</label>
							<div className="grid grid-cols-3 gap-4">
								<Input
									id="dim-length"
									placeholder="L"
									type="number"
									min="0"
									{...registerField("length")}
								/>
								<Input
									id="dim-width"
									placeholder="W"
									type="number"
									min="0"
									{...registerField("width")}
								/>
								<Input
									id="dim-height"
									placeholder="H"
									type="number"
									min="0"
									{...registerField("height")}
								/>
							</div>
						</div>
					</div>
				</div>

				{/* Right Sidebar - Organization (Visible only on large screens) */}
				<div className="hidden lg:block space-y-10">{organizationCard}</div>
			</div>
		</div>
	);
}
