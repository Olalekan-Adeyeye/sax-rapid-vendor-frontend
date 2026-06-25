export type ProductStatus =
	| "Draft"
	| "Active"
	| "Pending"
	| "Rejected"
	| "Deleted";
export type ProductType = "Simple" | "Variable";

export interface ProductImageResponseDTO {
	id: string;
	imageUrl: string | null;
	isPrimary: boolean;
}

export interface ProductAttributeResponseDTO {
	id: string;
	name: string | null;
	value: string | null;
}

export interface ProductVariationResponseDTO {
	id: string;
	sku: string | null;
	price: number;
	salePrice?: number | null;
	salePriceStartDate?: string | null;
	salePriceEndDate?: string | null;
	effectivePrice: number;
	stockQuantity: number;
	isInStock: boolean;
	attributes: Record<string, string> | null;
}

export interface ProductResponseDTO {
	id: string;
	name: string | null;
	description: string | null;
	currency: string | null;
	location: string | null;
	vendorProfileId: string;
	vendorId: string;
	vendorName?: string | null;
	categoryId: number;
	categoryName?: string | null;
	brandId: number | null;
	brandName?: string | null;
	productType: ProductType;
	basePrice: number;
	salePrice?: number | null;
	salePriceStartDate?: string | null;
	salePriceEndDate?: string | null;
	effectivePrice: number;
	sku: string | null;
	stockQuantity: number;
	isActive: boolean;
	isFeatured: boolean;
	status: string | null;
	weight: number;
	dimensionLength: number | null;
	dimensionWidth: number | null;
	dimensionHeight: number | null;
	viewCount: number;
	favoriteCount: number;
	averageRating: number;
	reviewCount: number;
	images: ProductImageResponseDTO[] | null;
	attributes: ProductAttributeResponseDTO[] | null;
	variations: ProductVariationResponseDTO[] | null;
	createdAt: string;
	updatedAt: string | null;
}

export interface ProductListItemDto {
	id: string;
	name: string | null;
	description: string | null;
	basePrice: number;
	salePrice: number | null;
	salePriceStartDate: string | null;
	salePriceEndDate: string | null;
	effectivePrice: number;
	sku: string | null;
	currency: string | null;
	location: string | null;
	status: ProductStatus;
	stockQuantity: number;
	isFeatured: boolean;
	isNew: boolean;
	averageRating: number;
	reviewCount: number;
	categoryId: number;
	categoryName: string | null;
	createdAt: string;
	isBoosted: boolean;
	vendorProfileId: string;
	attributes: ProductAttributeResponseDTO[] | null;
	images: ProductImageResponseDTO[] | null;
	variations: ProductVariationResponseDTO[] | null;
}

export interface PagedProductResponseDTO {
	items: ProductResponseDTO[] | null;
	totalCount: number;
	pageIndex: number;
	pageSize: number;
	totalPages: number;
	hasPreviousPage: boolean;
	hasNextPage: boolean;
}

export interface CreateProductAttributeValueDTO {
	name: string | null;
	value: string | null;
}

export interface VariationAttributeDTO {
	attributeName: string | null;
	attributeValue: string | null;
}

export interface CreateVariationDTO {
	sku: string | null;
	price: number;
	salePrice?: number | null;
	salePriceStartDate?: string | null;
	salePriceEndDate?: string | null;
	stockQuantity: number;
	attributes: VariationAttributeDTO[] | null;
}

export interface CreateProductDTO {
	name: string | null;
	description: string | null;
	categoryId: number;
	brandId?: number | null;
	basePrice: number;
	currency?: string | null;
	salePrice?: number | null;
	salePriceStartDate?: string | null;
	salePriceEndDate?: string | null;
	stockQuantity: number;
	weight: number;
	dimensionLength: number | null;
	dimensionWidth: number | null;
	dimensionHeight: number | null;
	sku: string | null;
	attributes?: CreateProductAttributeValueDTO[] | null;
	variations?: CreateVariationDTO[] | null;
	imageUrls?: string[] | null;
}

export interface UpdateProductDTO {
	name: string | null;
	description: string | null;
	categoryId?: number | null;
	brandId?: number | null;
	basePrice?: number | null;
	currency?: string | null;
	salePrice?: number | null;
	salePriceStartDate?: string | null;
	salePriceEndDate?: string | null;
	sku: string | null;
	stockQuantity?: number | null;
	weight?: number | null;
	dimensionLength?: number | null;
	dimensionWidth?: number | null;
	dimensionHeight?: number | null;
	imageUrls?: string[] | null;
	attributes?: CreateProductAttributeValueDTO[] | null;
	variations?: CreateVariationDTO[] | null;
}

export interface ProductQueryParams {
	CategoryId?: number;
	VendorId?: string;
	BrandId?: number;
	MinPrice?: number;
	MaxPrice?: number;
	SearchTerm?: string;
	Status?: ProductStatus;
	Currency?: string;
	Location?: string;
	Country?: string;
	City?: string;
	LowStockOnly?: boolean;
	SortBy?: string;
	SortDirection?: "Asc" | "Desc";
	IsFeatured?: boolean;
	PageIndex?: number;
	PageSize?: number;
}

export interface ProductStatsResponseDTO {
	totalProducts: number;
	activeProducts: number;
	pendingApproval: number;
	outOfStock: number;
	totalViews: number;
	averageRating: number;
}
