export type DisputeReason =
  | "ItemNotReceived"
  | "NotAsDescribed"
  | "Damaged"
  | "Fraudulent"
  | "Other";

export type ResolutionAction = "RefundBuyer" | "ReleaseToVendor";

export interface OpenDisputeRequestDTO {
  reason: DisputeReason;
  notes?: string | null;
  evidenceUrls?: string[] | null;
}

export interface ResolveDisputeRequestDTO {
  action: ResolutionAction;
  adminNotes?: string | null;
}

export interface DisputeResponseDTO {
  id: string;
  caseId: string | null;
  orderId: string;
  orderNumber: string | null;
  disputedAmount: number;
  currency: string | null;
  status: string | null;
  reason: string | null;
  notes: string | null;
  createdAt: string;
  resolvedAt: string | null;
}

export interface DisputeListItemDTO {
  id: string;
  caseId: string | null;
  buyerName: string | null;
  vendorName: string | null;
  disputedAmount: number;
  currency: string | null;
  status: string | null;
  createdAt: string;
}

export interface DisputeStatsDTO {
  activeCases: number;
  fundsInEscrow: number;
  currency: string;
  fraudAlerts: number;
}
