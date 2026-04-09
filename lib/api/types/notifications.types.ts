/**
 * TypeScript types/DTOs for the Notifications tag
 * Based on suspected API structure and common patterns
 */

export interface NotificationResponse {
  id: string; // uuid
  title: string;
  message: string;
  type: "Order" | "Wallet" | "Warning" | "Review" | "System" | "Admin";
  isRead: boolean;
  createdAt: string; // ISO 8601 date-time
  metadata?: Record<string, unknown>;
}

export interface NotificationCountResponse {
  totalCount: number;
  unreadCount: number;
}

export interface PagedNotificationsResponse {
  items: NotificationResponse[];
  totalCount: number;
  pageIndex: number;
  pageSize: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}
