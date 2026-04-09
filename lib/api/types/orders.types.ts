/**
 * TypeScript types/DTOs for the Orders tag
 */

export enum OrderStatus {
  Pending = "Pending",
  Confirmed = "Confirmed",
  Processing = "Processing",
  Shipped = "Shipped",
  Delivered = "Delivered",
  Cancelled = "Cancelled",
  Refunded = "Refunded",
  Failed = "Failed",
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

export interface OrderItemResponseDTO {
  id: string; // uuid
  productId: string;
  productName: string | null;
  productSKU: string | null;
  variationDetails: string | null;
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
  items: OrderItemResponseDTO[] | null;
}

export interface UpdateOrderStatusRequest {
  status: OrderStatus;
}
