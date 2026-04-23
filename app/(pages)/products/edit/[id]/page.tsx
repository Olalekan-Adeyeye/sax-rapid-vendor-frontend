"use client";
import React, {
	useState,
	useEffect,
	useMemo,
	useCallback,
	useRef,
} from "react";
import {
	Plus,
	Upload,
	X,
	Trash2,
	Settings2,
	PlusCircle,
	Loader2,
	Calendar,
	RefreshCw,
} from "lucide-react";
import Image from "next/image";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/lib/context/AuthContext";
import { useToast } from "@/lib/context/ToastContext";
import { zodResolver } from "@hookform/resolvers/zod";
import * as categoriesService from "@/lib/api/services/categories";
import * as productsService from "@/lib/api/services/products";
import * as filesService from "@/lib/api/services/files";
import { CategoryResponseDTO } from "@/lib/api/types/categories.types";
import { ATTRIBUTE_CATEGORIES } from "@/lib/constants/attributeCategories";
import { ROBUST_CATEGORIES } from "@/lib/constants/categories";
import { getErrorMessage } from "@/lib/utils/errors";
import { Input } from "@/components/ui/Input";
import { PageHeader } from "@/components/ui/PageHeader";
import { TextArea } from "@/components/ui/TextArea";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { ErrorComponent } from "@/components/ui/ErrorComponent";
import { FullPageLoader } from "@/components/common/FullPageLoader";
import {
	useForm,
	useWatch,
	UseFormRegister,
	UseFormSetValue,
	FieldErrors,
	Path,
} from "react-hook-form";
import { productSchema, ProductFormValues } from "@/lib/schemas/vendor";
import { UpdateProductDTO } from "@/lib/api/types/products.types";

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
	images: string[];
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
	attributes?: { attributeName: string; attributeValue: string }[];
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
		<div className="w-full bg-gray-50 border border-gray-100 focus-within:border-black rounded px-4 py-3 transition-all flex flex-wrap gap-2 items-center min-h-12.5">
			{values.map((val) => (
				<span
					key={val}
					className="bg-black text-white text-xs font-bold px-3 py-1.5 rounded flex items-center gap-1.5"
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

export default function EditProductPage() {
	const router = useRouter();
	const params = useParams();
	const productId = params.id as string;
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
	const [error, setError] = useState<string | null>(null);
	const [fetchError, setFetchError] = useState<string | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isFetching, setIsFetching] = useState(true);

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
			images: [],
		} as unknown as ProductFormValues,
	});

	const {
		register,
		handleSubmit,
		setValue,
		reset,
		control,
		formState: { errors },
	} = form;

	// Typed versions of RHF utilities for the union type
	const registerField =
		register as unknown as UseFormRegister<FlatProductValues>;
	const setFieldValue =
		setValue as unknown as UseFormSetValue<FlatProductValues>;
	const fieldErrors = errors as unknown as FieldErrors<FlatProductValues>;

	const formValues = useWatch({ control });
	const productType = formValues.type;
	const categoryId = formValues.categoryId;
	const attributes = (formValues.type === "variable"
		? formValues.attributes || []
		: []) as unknown as Attribute[];
	const variations = (formValues.type === "variable"
		? formValues.variations || []
		: []) as unknown as Variation[];

	const [galleryItems, setGalleryItems] = useState<
		{ url?: string; file?: File; preview?: string }[]
	>([]);
	const [isUploading, setIsUploading] = useState(false);

	const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files;
		if (!files || files.length === 0) return;

		const availableSpace = 10 - galleryItems.length;
		const newFiles = Array.from(files).slice(0, availableSpace);

		const newItems = newFiles.map((file) => ({
			file,
			preview: URL.createObjectURL(file),
		}));

		setGalleryItems((prev) => [...prev, ...newItems]);
		e.target.value = ""; // Reset input
	};

	const removeImage = (index: number) => {
		setGalleryItems((prev) => {
			const item = prev[index];
			if (item.preview) URL.revokeObjectURL(item.preview);
			return prev.filter((_, i) => i !== index);
		});
	};

	const galleryRef = useRef(galleryItems);
	useEffect(() => {
		galleryRef.current = galleryItems;
	}, [galleryItems]);

	// Cleanup object URLs on unmount
	useEffect(() => {
		return () => {
			galleryRef.current.forEach((item) => {
				if (item.preview) URL.revokeObjectURL(item.preview);
			});
		};
	}, []);

	const fetchCats = useCallback(async () => {
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
		} catch (err) {
			console.error("Failed to load categories:", err);
			setError(getErrorMessage(err));
		} finally {
			setLoadingCategories(false);
		}
	}, []);

	const fetchProduct = useCallback(async () => {
		if (!productId) return;
		try {
			setIsFetching(true);
			setFetchError(null);
			const product = await productsService.getProductById(productId);

			const isVariable = !!(
				product.variations && product.variations.length > 0
			);

			reset({
				type: isVariable ? "variable" : "simple",
				name: product.name || "",
				description: product.description || "",
				categoryId: product.categoryId?.toString() || "",
				regularPrice: product.basePrice?.toString() || "",
				salePrice: product.salePrice?.toString() || "",
				saleStartDate: product.salePriceStartDate ? product.salePriceStartDate.split("T")[0] : "",
				saleEndDate: product.salePriceEndDate ? product.salePriceEndDate.split("T")[0] : "",
				status: (product.status as unknown as string) || "In stock",
				weight: product.weight?.toString() || "",
				dimensionLength: product.dimensionLength?.toString() || "",
				dimensionWidth: product.dimensionWidth?.toString() || "",
				dimensionHeight: product.dimensionHeight?.toString() || "",
				attributes: [],
				variations: [],
				images: [],
			} as unknown as ProductFormValues);

			if (product.sku) setValue("sku", product.sku);

			if (isVariable) {
				setHasGeneratedVariations(true);
				// Map variations back
				const mappedVariations = product.variations?.map((v) => {
					let attrsList: { attributeName: string; attributeValue: string }[] = [];
					if (v.attributes) {
						attrsList = Object.entries(v.attributes).map(([key, val]) => ({
							attributeName: key,
							attributeValue: val,
						}));
					}

					return {
						id: v.id,
						name: v.sku || "Variation",
						price: v.price?.toString() || "",
						stock: v.stockQuantity?.toString() || "0",
						salePrice: v.salePrice?.toString() || "",
						saleStartDate: v.salePriceStartDate ? v.salePriceStartDate.split("T")[0] : "",
						saleEndDate: v.salePriceEndDate ? v.salePriceEndDate.split("T")[0] : "",
						attributes: attrsList,
					};
				});
				setValue("variations", mappedVariations as unknown as Variation[]);

				// Map attributes back if possible
				if (product.attributes && product.attributes.length > 0) {
					const grouped = product.attributes.reduce(
						(acc, curr) => {
							if (!curr.name || !curr.value) return acc;
							if (!acc[curr.name]) {
								acc[curr.name] = {
									id: Math.random().toString(36).substring(7),
									name: curr.name,
									values: [],
								};
							}
							if (!acc[curr.name].values.includes(curr.value)) {
								acc[curr.name].values.push(curr.value);
							}
							return acc;
						},
						{} as Record<string, Attribute>,
					);
					setValue("attributes", Object.values(grouped));
				}
			}

			if (product.images) {
				setGalleryItems(
					product.images
						.map((img) => ({ url: img.imageUrl || "" }))
						.filter((i) => !!i.url),
				);
			}
		} catch (err) {
			setFetchError(getErrorMessage(err));
		} finally {
			setIsFetching(false);
		}
	}, [productId, reset, setValue]);

	useEffect(() => {
		fetchCats();
		fetchProduct();
	}, [fetchCats, fetchProduct]);

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
		const combine = (
			attrs: Attribute[],
		): { vals: string[]; attrList: { attributeName: string; attributeValue: string }[] }[] => {
			if (attrs.length === 0) return [];
			if (attrs.length === 1)
				return attrs[0].values.map((v: string) => ({
					vals: [v],
					attrList: [{ attributeName: attrs[0].name, attributeValue: v }],
				}));
			const rest = combine(attrs.slice(1));
			const current = attrs[0];
			return current.values.flatMap((val: string) =>
				rest.map((r) => ({
					vals: [val, ...r.vals],
					attrList: [{ attributeName: current.name, attributeValue: val }, ...r.attrList],
				})),
			);
		};

		const combos = combine(validAttributes);
		const newVariations = combos.map((combo) => ({
			id: Math.random().toString(36).substring(7),
			name: combo.vals.join(" / "),
			price: "",
			salePrice: "",
			saleStartDate: "",
			saleEndDate: "",
			stock: "",
			attributes: combo.attrList,
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

			// 1. Upload new images only
			const finalImages: string[] = [];
			setIsUploading(true);

			for (let i = 0; i < galleryItems.length; i++) {
				const item = galleryItems[i];
				if (item.url) {
					// Already exists on server
					finalImages.push(item.url);
				} else if (item.file) {
					// Needs upload
					try {
						const uploadedUrl = await filesService.uploadFile(
							item.file,
							"products",
						);
						finalImages.push(uploadedUrl);
					} catch (error) {
						console.error(`Failed to upload local image ${i}:`, error);
						toast(
							"Warning",
							`Image ${i + 1} failed to upload and was removed.`,
							"warning",
						);
					}
				}
			}
			setIsUploading(false);

			const imagePayload = finalImages.map((url, idx) => ({
				imageUrl: url,
				isPrimary: idx === 0,
			}));

			const isSimple = data.type === "simple";
			const payload: UpdateProductDTO = {
				name: data.name,
				description: data.description,
				categoryId: Number(data.categoryId),
				productType: isSimple ? "Simple" : "Variable",
				basePrice: Number(
					isSimple ? data.regularPrice : data.regularPrice || 0,
				),
				salePrice: isSimple && data.salePrice ? Number(data.salePrice) : null,
				salePriceStartDate: data.saleStartDate || null,
				salePriceEndDate: data.saleEndDate || null,
				stockQuantity: isSimple ? (Number(data.stockQuantity) || 0) : 0,
				sku: data.sku || null,
				images: imagePayload,
				...(isSimple
					? {}
					: {
							variations: data.variations.map((v) => ({
								sku: v.id,
								price: Number(v.price),
								salePrice: v.salePrice ? Number(v.salePrice) : undefined,
								salePriceStartDate: v.saleStartDate || null,
								salePriceEndDate: v.saleEndDate || null,
								stockQuantity: Number(v.stock),
								attributes: v.attributes || [],
							})),
						}),
			};
			await productsService.updateProduct(productId, payload);
			toast("Success", "Product updated successfully", "success");
			router.push("/products");
		} catch (error) {
			toast("Error", getErrorMessage(error), "error");
		} finally {
			setIsSubmitting(false);
			setIsUploading(false);
		}
	};

	const organizationCard = (
		<div className="bg-white border border-gray-100 rounded p-8 space-y-8 h-fit">
			<h4 className="text-sm font-bold text-gold pb-6 border-b border-gray-100">
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
					rightSlot={
						error ? (
							<button
								type="button"
								onClick={fetchCats}
								className="text-gold hover:text-black transition-colors"
								title="Retry Categories"
							>
								<RefreshCw
									size={14}
									className={loadingCategories ? "animate-spin" : ""}
								/>
							</button>
						) : null
					}
					error={error || errors.categoryId?.message}
				/>
				<Input
					id="sku-number"
					label="SKU Number"
					placeholder="PROD-8291-BL"
					{...register("sku")}
					error={errors.sku?.message}
					helpText="Product identification number"
				/>
			</div>
		</div>
	);

	if (isFetching) {
		return (
			<FullPageLoader label="Retrieving Product Details..." icon={RefreshCw} />
		);
	}

	if (fetchError) {
		return (
			<ErrorComponent
				title="Failed to Load Product"
				message={fetchError}
				onRetry={fetchProduct}
			/>
		);
	}

	return (
		<div className="max-w-5xl mx-auto space-y-12 pb-24">
			<PageHeader
				title="Edit Product"
				description="Update your product information"
				actions={
					<>
						<Button
							variant="outline"
							rounded="full"
							size="sm"
							className="px-8"
							onClick={() => router.back()}
						>
							Cancel
						</Button>
						<Button
							onClick={handleSubmit(onSubmit)}
							disabled={isSubmitting}
							size="sm"
							rounded="full"
							loading={isSubmitting}
							className="flex-1 lg:flex-none px-6 lg:px-8"
						>
							Update Product
						</Button>
					</>
				}
			/>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
				<div className="lg:col-span-2 space-y-10">
					{/* Basic Info */}
					<div className="bg-white border border-gray-100 rounded p-8 space-y-8">
						<h4 className="text-sm font-bold text-gold pb-6 border-b border-gray-100">
							General Information
						</h4>
						<div className="space-y-6">
							<Input
								id="product-name"
								label="Product Name"
								required
								{...register("name")}
								error={errors.name?.message}
							/>
							<TextArea
								id="product-description"
								label="Product Description"
								required
								rows={6}
								{...register("description")}
								error={errors.description?.message}
							/>
						</div>
					</div>

					{/* Mobile Organization */}
					<div className="lg:hidden">{organizationCard}</div>

					{/* Media */}
					<div className="bg-white border border-gray-100 rounded p-8 space-y-8">
						<h4 className="text-sm font-bold text-gold pb-6 border-b border-gray-100 flex justify-between items-center">
							<span>Product Gallery</span>
							<span className="text-gray-400 text-xs font-bold">
								Max 10 images
							</span>
						</h4>
						<div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
							<input
								type="file"
								id="image-upload"
								multiple
								accept="image/*"
								className="hidden"
								onChange={handleImageUpload}
								disabled={isUploading}
							/>
							{galleryItems.map((item, idx) => (
								<div
									key={idx}
									className="relative aspect-square rounded overflow-hidden border border-gray-100 group"
								>
									<Image
										src={(item.file ? item.preview : item.url) || ""}
										alt={`Product ${idx}`}
										fill
										className="object-cover"
										unoptimized
									/>
									<button
										type="button"
										onClick={() => removeImage(idx)}
										className="absolute top-1 right-1 bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
									>
										<X size={12} />
									</button>
									{idx === 0 && (
										<span className="absolute bottom-0 left-0 right-0 bg-gold text-black text-[8px] font-black uppercase py-1 text-center">
											Primary
										</span>
									)}
								</div>
							))}
							{galleryItems.length < 10 && (
								<label
									htmlFor="image-upload"
									className="aspect-square border-2 border-dashed border-gray-200 bg-gray-50 rounded flex flex-col items-center justify-center text-gray-400 hover:border-black hover:bg-gray-100 hover:text-black transition-all cursor-pointer group"
								>
									{isUploading ? (
										<Loader2 size={24} className="animate-spin text-gold" />
									) : (
										<>
											<Upload
												size={24}
												className="mb-2 transition-transform group-hover:-translate-y-1"
											/>
											<span className="text-[10px] font-bold">
												{galleryItems.length === 0 ? "Main Image" : "Add Image"}
											</span>
										</>
									)}
								</label>
							)}
						</div>
					</div>

					{/* Pricing & Variants */}
					<div className="bg-white border border-gray-100 rounded p-8 space-y-8">
						<h4 className="text-sm font-bold text-gold pb-6 border-b border-gray-100">
							Pricing & Variants
						</h4>
						<div className="bg-gray-100 p-1.5 rounded flex w-full mb-4">
							<Button
								onClick={() => handleTypeSwitch("simple")}
								variant={productType === "simple" ? "primary" : "ghost"}
								className={`flex-1 border-none h-10 ${productType === "simple" ? "bg-white text-black" : "text-gray-400 bg-transparent"}`}
							>
								Simple Product
							</Button>
							<Button
								onClick={() => handleTypeSwitch("variable")}
								variant={productType === "variable" ? "primary" : "ghost"}
								className={`flex-1 border-none h-10 ${productType === "variable" ? "bg-white text-black" : "text-gray-400 bg-transparent"}`}
							>
								Variable Product
							</Button>
						</div>

						{productType === "simple" && (
							<div className="space-y-6">
								<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
									<Input
										id="regular-price"
										label={`Regular Price (${currencySymbol})`}
										required
										type="number"
										{...registerField("regularPrice")}
										error={fieldErrors.regularPrice?.message}
									/>
									<Input
										id="sale-price"
										label={`Sale Price (${currencySymbol})`}
										type="number"
										{...registerField("salePrice")}
										rightSlot={
											<button
												type="button"
												className="text-gray-300 hover:text-gold transition-colors"
											>
												<Calendar size={14} />
											</button>
										}
									/>
								</div>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-gray-50/50 rounded border border-gray-100 animate-in zoom-in-95 duration-200">
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
								<Input
									id="stock-quantity"
									label="Stock Quantity"
									required
									type="number"
									{...registerField("stockQuantity")}
								/>
							</div>
						)}

						{productType === "variable" && (
							<div className="space-y-10">
								{/* Attributes */}
								<div className="space-y-6">
									<h5 className="text-sm font-bold text-black">
										Product Attributes
									</h5>
									<div className="space-y-4">
										{attributes.map((attr: Attribute) => (
											<div
												key={attr.id}
												className="p-5 border border-gray-100 rounded bg-gray-50/30 space-y-4 relative"
											>
												<Button
													variant="ghost"
													size="sm"
													onClick={() => removeAttribute(attr.id)}
													className="absolute top-4 right-4 text-gray-300 hover:text-red-500 border-none p-0 h-auto"
												>
													<Trash2 size={16} />
												</Button>
												<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
													<Input
														id={`attr-name-${attr.id}`}
														label="Attribute Name"
														value={attr.name}
														onChange={(e) =>
															updateAttribute(attr.id, "name", e.target.value)
														}
													/>
													<div className="md:col-span-2">
														<label className="block text-xs font-bold text-gray-500 mb-2">
															Values
														</label>
														<ChipInput
															values={attr.values}
															onChange={(newValues) =>
																updateAttribute(attr.id, "values", newValues)
															}
														/>
													</div>
												</div>
											</div>
										))}
									</div>

									{/* Restore Presets to mirror add page */}
									{displayedPresets.length > 0 && (
										<div className="pt-4 border-t border-gray-50">
											<h6 className="text-xs font-black text-gray-400 mb-4 uppercase tracking-widest">
												Quick Add Presets
											</h6>
											<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
												{displayedPresets.map((category) => (
													<div key={category.label} className="space-y-2">
														{category.attributes.map((attr) => (
															<Button
																key={attr.name}
																onClick={() =>
																	addAttribute(attr.name, attr.defaultValues)
																}
																variant="ghost"
																className="bg-gray-50 hover:bg-gold/10 hover:text-gold text-gray-500 text-[10px] font-bold px-3 py-2 w-full justify-start h-auto"
															>
																<PlusCircle size={10} className="mr-2" />{" "}
																{attr.name}
															</Button>
														))}
													</div>
												))}
											</div>
										</div>
									)}

									<Button
										onClick={() => addAttribute()}
										variant="black"
										size="sm"
										rounded="full"
									>
										<Plus size={12} /> Add Custom Attribute
									</Button>
								</div>

								<Button
									onClick={generateVariations}
									variant="black"
									rounded="full"
									size="sm"
									fullWidth
									className="py-4 h-auto"
								>
									<span className="text-[11px] font-black uppercase tracking-widest">
										Regenerate Variations
									</span>
								</Button>

								{/* Variations Table */}
								<div className="pt-4 border-t border-gray-50">
									<div className="flex items-center justify-between mb-4">
										<h5 className="text-xs font-black text-black">
											Variations ({variations.length})
										</h5>
										{variations.length > 0 && (
											<Button
												variant="ghost"
												size="sm"
												onClick={() => setValue("variations", [])}
												className="text-gray-300 hover:text-red-500 text-[10px] h-auto p-0 border-none"
											>
												Clear All
											</Button>
										)}
									</div>

									{!hasGeneratedVariations ? (
										<div className="py-12 border border-dashed border-gray-100 rounded flex flex-col items-center justify-center text-center space-y-3 bg-gray-50/50">
											<Settings2 size={24} className="text-gray-200" />
											<p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
												No variations generated
											</p>
										</div>
									) : (
										<div className="border border-gray-100 rounded overflow-hidden">
											<table className="w-full text-left">
												<thead>
													<tr className="bg-gray-50 border-b border-gray-100">
														<th className="px-5 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">
															Variation
														</th>
														<th className="px-5 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">
															Price
														</th>
														<th className="px-5 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">
															Stock
														</th>
													</tr>
												</thead>
												<tbody className="divide-y divide-gray-50">
													{variations.map((v: Variation) => (
														<React.Fragment key={v.id}>
															<tr className="hover:bg-gray-50/30 transition-colors">
																<td className="px-5 py-4 text-xs font-black">
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
																	/>
																</td>
																<td className="px-5 py-3">
																	<div className="flex items-center gap-2">
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
																		/>
																		<Button
																			variant="ghost"
																			size="sm"
																			onClick={() =>
																				toggleVariationSchedule(v.id)
																			}
																			className={`p-0 h-auto border-none ${expandedVariationSchedules.has(v.id) ? "text-gold" : "text-gray-200"}`}
																		>
																			<Calendar size={12} />
																		</Button>
																	</div>
																</td>
															</tr>
															{expandedVariationSchedules.has(v.id) && (
																<tr className="bg-gray-50/30">
																	<td colSpan={3} className="px-5 py-4">
																		<div className="grid grid-cols-2 gap-4">
																			<Input
																				id={`var-start-${v.id}`}
																				label="Sale Start"
																				type="date"
																				value={v.saleStartDate}
																				onChange={(e) =>
																					updateVariation(
																						v.id,
																						"saleStartDate",
																						e.target.value,
																					)
																				}
																			/>
																			<Input
																				id={`var-end-${v.id}`}
																				label="Sale End"
																				type="date"
																				value={v.saleEndDate}
																				onChange={(e) =>
																					updateVariation(
																						v.id,
																						"saleEndDate",
																						e.target.value,
																					)
																				}
																			/>
																		</div>
																	</td>
																</tr>
															)}
														</React.Fragment>
													))}
												</tbody>
											</table>
										</div>
									)}
								</div>
							</div>
						)}
					</div>

					{/* Shipping & Inventory mirroring add page */}
					<div className="bg-white border border-gray-100 rounded p-8 space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
						<h4 className="text-sm font-bold text-gold pb-6 border-b border-gray-100">
							Shipping & Inventory
						</h4>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
							<Input
								id="product-weight"
								label="Weight (kg)"
								required
								type="number"
								{...registerField("weight")}
								error={fieldErrors.weight?.message}
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
							/>
						</div>
						<div className="grid grid-cols-3 gap-4">
							<Input id="dim-l" label="Length" {...registerField("length")} />
							<Input id="dim-w" label="Width" {...registerField("width")} />
							<Input id="dim-h" label="Height" {...registerField("height")} />
						</div>
					</div>
				</div>

				{/* Right Sidebar - Organization mirroring add page */}
				<div className="hidden lg:block space-y-10">{organizationCard}</div>
			</div>
		</div>
	);
}
