/**
 * TypeScript types/DTOs for inventory and commissions
 * Derived from the Sax Rapid Marketplace Vendor API spec v1
 */

/** GET /api/inventory/status */
export interface InventoryItemDTO {
  productId: string;
  productName?: string | null;
  sku?: string | null;
  stockStatus?: string | null;
  stockLevel?: number | null;
  category?: string | null;
}
