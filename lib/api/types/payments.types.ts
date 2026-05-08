/**
 * TypeScript types for the Payments module
 * Strictly following swagger.json
 */

export type PaymentGateway = "Paystack" | "PayFast" | "Manual";

export type PaymentStatus =
  | "Pending"
  | "Authorized"
  | "Paid"
  | "Failed"
  | "Refunded"
  | "PartiallyRefunded"
  | "Cancelled";

export interface InitializePaymentRequestDTO {
  amount: number;
  email: string;
  gateway: PaymentGateway;
  callbackUrl?: string | null;
  metadata?: Record<string, unknown> | null;
}

export interface InitializePaymentResponseDTO {
  reference?: string | null;
  authorizationUrl?: string | null;
  accessCode?: string | null;
  gateway: PaymentGateway;
  amount: number;
  currency?: string | null;
}

export interface VerifyPaymentResponseDTO {
  reference?: string | null;
  status: PaymentStatus;
  amount: number;
  currency?: string | null;
  channel?: string | null;
  paidAt?: string | null;
  gatewayResponse?: string | null;
  isSuccessful: boolean;
}
