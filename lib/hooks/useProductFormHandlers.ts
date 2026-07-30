"use client";
import { useState, useEffect, useRef, SetStateAction, Dispatch } from "react";
import {
	useForm,
	useWatch,
	UseFormReturn,
	UseFormRegister,
	UseFormSetValue,
	FieldErrors,
	Path,
} from "react-hook-form";
import { ProductFormValues } from "@/lib/schemas/vendor";
import {
	FlatProductValues,
	Attribute,
	Variation,
} from "@/lib/types/product-form.types";
import { generateVariations as generateVariationsUtil } from "@/lib/utils/product";

type ToastFn = (
	title: string,
	message: string,
	type: "success" | "error" | "warning" | "info",
) => void;

export function useProductFormHandlers(
	form: UseFormReturn<ProductFormValues>,
	toast: ToastFn,
) {
	const { setValue, getValues, control } = form;

	const registerField = form.register as unknown as UseFormRegister<FlatProductValues>;
	const setFieldValue = setValue as unknown as UseFormSetValue<FlatProductValues>;
	const fieldErrors = form.formState.errors as unknown as FieldErrors<FlatProductValues>;

	const formValues = useWatch({ control }) as unknown as FlatProductValues;
	const productType = formValues.type;
	const categoryId = formValues.categoryId;
	const attributes = (formValues.type === "variable"
		? formValues.attributes
		: []) as unknown as Attribute[];
	const variations = (formValues.type === "variable"
		? formValues.variations
		: []) as unknown as Variation[];

	const [hasGeneratedVariations, setHasGeneratedVariations] = useState(false);
	const [expandedVariationSchedules, setExpandedVariationSchedules] = useState<
		Set<string>
	>(new Set());
	const [isSchedulingSale, setIsSchedulingSale] = useState(false);

	const [varDirty, setVarDirty] = useState(true);
	const varDirtyRef = useRef(varDirty);
	useEffect(() => { varDirtyRef.current = varDirty; }, [varDirty]);

	const [varUrls, setVarUrls] = useState<Record<string, string>>({});
	const varUrlsRef = useRef(varUrls);
	useEffect(() => { varUrlsRef.current = varUrls; }, [varUrls]);

	const [varImages, setVarImages] = useState<
		Record<string, { file: File; preview: string }[]>
	>({});
	const varImagesRef = useRef(varImages);
	useEffect(() => { varImagesRef.current = varImages; }, [varImages]);

	const galleryDirtyRef = useRef(true);
	const galleryUrlsRef = useRef<string[]>([]);

	const handleTypeSwitch = (type: "simple" | "variable") => {
		if (type === "simple" && attributes.length > 0) {
			setFieldValue("attributes" as Path<FlatProductValues>, []);
			setFieldValue("variations" as Path<FlatProductValues>, []);
			setHasGeneratedVariations(false);
			toast(
				"Switched to Simple",
				"Attributes and variations were reset.",
				"warning",
			);
		}
		setValue("type", type);
	};

	const addAttribute = (
		name: string = "",
		initialValues: string[] = [],
	) => {
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
		const filtered = attributes.filter(
			(attr: Attribute) => attr.id !== id,
		);
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

	const generateAllVariations = () => {
		const result = generateVariationsUtil(attributes);
		if (result.length === 0) {
			toast(
				"Action needed",
				"Add at least one attribute with values to generate variations.",
				"error",
			);
			return;
		}
		setFieldValue("variations" as Path<FlatProductValues>, result);
		setHasGeneratedVariations(true);
		toast(
			"Variations Created",
			`Successfully generated ${result.length} variations.`,
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

	const handleVariationImageUpload = (
		variationId: string,
		e: React.ChangeEvent<HTMLInputElement>,
	) => {
		const files = e.target.files;
		if (!files || files.length === 0) return;
		const file = files[0];
		const preview = URL.createObjectURL(file);
		setVarImages((prev) => {
			const existing = prev[variationId];
			if (existing?.[0]) URL.revokeObjectURL(existing[0].preview);
			return { ...prev, [variationId]: [{ file, preview }] };
		});
		setVarDirty(true);
		varDirtyRef.current = true;
		e.target.value = "";
	};

	const removeVariationImage = (variationId: string) => {
		setVarImages((prev) => {
			const existing = prev[variationId];
			if (existing?.[0]) URL.revokeObjectURL(existing[0].preview);
			const next = { ...prev };
			delete next[variationId];
			return next;
		});
		setVarDirty(true);
		varDirtyRef.current = true;
	};

	return {
		registerField,
		setFieldValue,
		fieldErrors,
		formValues,
		productType,
		categoryId,
		attributes,
		variations,
		hasGeneratedVariations,
		setHasGeneratedVariations,
		expandedVariationSchedules,
		setExpandedVariationSchedules,
		isSchedulingSale,
		setIsSchedulingSale,
		varDirty,
		varDirtyRef,
		setVarDirty,
		varUrls,
		varUrlsRef,
		setVarUrls,
		varImages,
		varImagesRef,
		setVarImages,
		galleryDirtyRef,
		galleryUrlsRef,
		handleTypeSwitch,
		addAttribute,
		updateAttribute,
		removeAttribute,
		toggleVariationSchedule,
		generateVariations: generateAllVariations,
		updateVariation,
		handleVariationImageUpload,
		removeVariationImage,
	};
}
