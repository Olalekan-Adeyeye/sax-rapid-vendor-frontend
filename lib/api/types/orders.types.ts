/**
 * TypeScript types/DTOs for the Orders tag
 */

export interface VariationAttributeDTO {
  attributeName?: string | null;
  attributeValue?: string | null;
  name?: string | null;
  value?: string | null;
}

export interface VariationDetailsDTO {
  id?: string;
  sku?: string | null;
  price?: number;
  salePrice?: number | null;
  effectivePrice?: number;
  stockQuantity?: number;
  isInStock?: boolean;
  attributes?: Record<string, string> | VariationAttributeDTO[] | null;
}

export type VariationDetails = string | VariationDetailsDTO | null;

export enum OrderStatus {
  Pending = "Pending",
  Confirmed = "Confirmed",
  Processing = "Processing",
  Shipped = "Shipped",
  Delivered = "Delivered",
  Cancelled = "Cancelled",
  Refunded = "Refunded",
  Failed = "Failed",
  OnHold = "OnHold",
  Dispute = "Dispute",
}

export enum PaymentStatus {
  Pending = "Pending",
  Authorized = "Authorized",
  Paid = "Paid",
  Failed = "Failed",
  Refunded = "Refunded",
  PartiallyRefunded = "PartiallyRefunded",
  Cancelled = "Cancelled",
}

export enum PaymentMethod {
  CreditCard = "CreditCard",
  DebitCard = "DebitCard",
  Wallet = "Wallet",
  BankTransfer = "BankTransfer",
  PayOnDelivery = "PayOnDelivery",
  Paystack = "Paystack",
  Flutterwave = "Flutterwave",
}

export interface OrderUserResponseDTO {
  id: string; // uuid
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  phoneNumber: string | null;
}

export interface OrderItemResponseDTO {
  id: string; // uuid
  productId: string;
  productName: string | null;
  productSKU: string | null;
  variationDetails: VariationDetails;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface OrderResponseDTO {
  id: string; // uuid
  orderNumber: string | null;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  subTotal: number;
  taxAmount: number;
  shippingFee: number;
  discountAmount: number;
  totalAmount: number;
  shippingAddress: string | null;
  shippingCity: string | null;
  shippingState: string | null;
  shippingCountry: string | null;
  trackingNumber: string | null;
  createdAt: string; // ISO 8601 date-time
  deliveredAt: string | null; // ISO 8601 date-time
  user: OrderUserResponseDTO | null;
  items: OrderItemResponseDTO[] | null;
}

export interface OrderStatsDTO {
  allOrders: number;
  processing: number;
  completed: number;
  disputes: number;
}

export interface UpdateOrderStatusRequest {
  status: OrderStatus;
}

export interface CreateOrderRequestDTO {
  shippingAddressId: string;
  paymentMethod: PaymentMethod;
  notes?: string | null;
  couponCode?: string | null;
}
