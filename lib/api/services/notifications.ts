/**
 * Notifications Services
 * All endpoints under the "Notifications" tag — /api/Notifications/*
 */

import { pickNumber, unwrapEnvelope } from "@/lib/utils/response";

import apiClient from "../apiClient";
import type { ApiResponse } from "../types/auth.types";
import type {
  NotificationCountResponse,
  NotificationResponse,
} from "../types/notifications.types";

const BASE = "/Notifications";

/**
 * GET /api/Notifications
 * Returns a list of notifications for the authenticated user.
 */
export async function getNotifications(
  page = 1,
  pageSize = 20,
  unreadOnly = false
): Promise<NotificationResponse[]> {
  const response = await apiClient.get<ApiResponse<{ items?: NotificationResponse[] | null }>>(BASE, {
    params: { page, pageSize, unreadOnly },
  });
  return response.data.data.items ?? [];
}

/**
 * GET /api/Notifications/count
 * Returns the total and unread notification counts.
 */
export async function getNotificationCount(): Promise<NotificationCountResponse> {
  const response = await apiClient.get<unknown>(`${BASE}/count`);
  const raw = unwrapEnvelope(response.data);
  if (typeof raw === "number" && Number.isFinite(raw)) {
    return { totalCount: raw, unreadCount: raw };
  }
  if (raw && typeof raw === "object" && !Array.isArray(raw)) {
    const record = raw as Record<string, unknown>;
    const total = pickNumber(record, [
      "totalCount",
      "TotalCount",
      "total",
      "Total",
      "totalNotifications",
    ]);
    const unread = pickNumber(record, [
      "unreadCount",
      "UnreadCount",
      "unread",
      "Unread",
      "totalUnreadCount",
      "unreadNotifications",
    ]);
    return { totalCount: total ?? 0, unreadCount: unread ?? 0 };
  }
  return { totalCount: 0, unreadCount: 0 };
}

/**
 * PATCH /api/Notifications/{notificationId}/read
 * Marks a specific notification as read.
 */
export async function markAsRead(notificationId: string): Promise<void> {
  await apiClient.patch(`${BASE}/${notificationId}/read`);
}

/**
 * PATCH /api/Notifications/read-all
 * Marks all unread notifications as read.
 */
export async function markAllAsRead(): Promise<void> {
  await apiClient.patch(`${BASE}/read-all`);
}

/**
 * DELETE /api/Notifications/{notificationId}
 * Deletes a specific notification.
 */
export async function deleteNotification(notificationId: string): Promise<void> {
  await apiClient.delete(`${BASE}/${notificationId}`);
}
