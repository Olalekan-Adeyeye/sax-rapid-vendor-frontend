export interface CouponListItemDTO {
  id: string;
  code: string | null;
  discountType: string | null;
  value: number;
  scope: string | null;
  usageLimit: number | null;
  usedCount: number;
  expiryDate: string | null;
  status: string | null;
}

export interface CouponStatsDTO {
  totalCoupons: number;
  activeNow: number;
  expired: number;
  drafts: number;
}

export interface CreateCouponRequestDTO {
  code: string | null;
  discountType: string | null;
  discountValue: number;
  scope: string | null;
  vendorId?: string | null;
  allowFreeShipping: boolean;
  showOnStore: boolean;
  usageLimit: number | null;
  expiryDate: string;
  status: string | null;
  description: string | null;
}

export interface UpdateCouponRequestDTO {
  code: string | null;
  DiscountType: string | null;
  discountValue: number;
  scope?: string | null;
  vendorId?: string | null;
  adCampaignId?: string | null;
  allowFreeShipping?: boolean;
  showOnStore?: boolean;
  usageLimit: number | null;
  expiryDate: string | null;
  status?: string | null;
  description?: string | null;
}

export interface CouponQueryParams {
  status?: string;
  dateFrom?: string;
  dateTo?: string;
  pageNumber?: number;
  pageSize?: number;
}

export interface Coupon {
  id: string;
  vendorId: string | null;
  code: string | null;
  description: string | null;
  value: number;
  minimumOrderAmount: number | null;
  maximumDiscountAmount: number | null;
  usageLimit: number | null;
  usedCount: number;
  isActive: boolean;
  discountType: string | null;
  allowFreeShipping: boolean;
  showOnStore: boolean;
  status: string | null;
  scope: string | null;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string | null;
}

export interface CreateVendorCouponRequestDTO {
  code: string;
  DiscountType: string;
  value: number;
  minimumOrderAmount?: number | null;
  maximumDiscountAmount?: number | null;
  usageLimit?: number | null;
  endDate: string;
  description?: string | null;
}
