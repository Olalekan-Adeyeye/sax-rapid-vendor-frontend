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
	stockQuantity: number;
	attributes: Record<string, string> | null;
}

export interface ProductResponseDTO {
	id: string;
	name: string | null;
	description: string | null;
	vendorId: string;
	vendorName: string | null;
	categoryId: number;
	categoryName: string | null;
	brandId: number | null;
	brandName: string | null;
	basePrice: number;
	sku: string | null;
	stockQuantity: number;
	isActive: boolean;
	isFeatured: boolean;
	status: string | null;
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

export interface PagedProductResponseDTO {
	items: ProductResponseDTO[] | null;
	totalCount: number;
	pageIndex: number;
	pageSize: number;
	totalPages: number;
	hasPreviousPage: boolean;
	hasNextPage: boolean;
}

export interface CreateProductDTO {
	name: string | null;
	description: string | null;
	categoryId: number;
	brandId?: number | null;
	basePrice: number;
	salePrice?: number | null;
	saleStartDate?: string | null;
	saleEndDate?: string | null;
	sku: string | null;
	weight?: number | null;
	length?: number | null;
	width?: number | null;
	height?: number | null;
	status?: string | null;
	attributes?: { name: string; values: string[] }[] | null;
	variations?: { 
		name: string; 
		price: number; 
		salePrice?: number | null; 
		saleStartDate?: string | null;
		saleEndDate?: string | null;
		stockQuantity: number 
	}[] | null;
}

export interface UpdateProductDTO {
	name: string | null;
	description: string | null;
	categoryId: number;
	brandId?: number | null;
	basePrice: number;
	salePrice?: number | null;
	saleStartDate?: string | null;
	saleEndDate?: string | null;
	sku: string | null;
	weight?: number | null;
	length?: number | null;
	width?: number | null;
	height?: number | null;
	status?: string | null;
	attributes?: { name: string; values: string[] }[] | null;
	variations?: { name: string; price: number; salePrice?: number | null; stockQuantity: number }[] | null;
}

export interface ProductQueryParams {
	CategoryId?: number;
	VendorId?: string;
	BrandId?: number;
	MinPrice?: number;
	MaxPrice?: number;
	SearchTerm?: string;
	PageIndex?: number;
	PageSize?: number;
}
