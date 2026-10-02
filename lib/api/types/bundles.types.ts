/**
 * TypeScript types/DTOs for the ProductBundles tag
 * Derived from the Sax Rapid Marketplace Vendor API spec v1
 */

/** POST /api/ProductBundles – bundle line item */
export interface BundleItemRequestDTO {
  productId: string;
  quantity: number;
}

/** POST /api/ProductBundles */
export interface CreateProductBundleDTO {
  name?: string | null;
  description?: string | null;
  price: number;
  currency?: string | null;
  items?: BundleItemRequestDTO[] | null;
}

export interface BundleItemResponseDTO {
  productId: string;
  productName?: string | null;
  productSKU?: string | null;
  quantity: number;
}

/** GET /api/ProductBundles/vendor, GET /api/ProductBundles/{id} */
export interface ProductBundleResponseDTO {
  id: string;
  name?: string | null;
  description?: string | null;
  price: number;
  currency?: string | null;
  isActive: boolean;
  createdAt: string;
  items?: BundleItemResponseDTO[] | null;
}
