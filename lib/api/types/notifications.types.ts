/**
 * TypeScript types/DTOs for the Notifications tag
 * Based on suspected API structure and common patterns
 */

export interface NotificationResponse {
  id: string;
  title: string;
  body: string;
  type: string;
  referenceId?: string | null;
  referenceType?: string | null;
  isRead: boolean;
  createdAt: string;
  readAt?: string | null;
}

export interface NotificationCountResponse {
  totalCount: number;
  unreadCount: number;
}
