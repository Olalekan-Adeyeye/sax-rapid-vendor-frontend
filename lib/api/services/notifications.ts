/**
 * Notifications Services
 * All endpoints under the "Notifications" tag — /api/Notifications/*
 */

import apiClient from "../apiClient";
import type {
  NotificationCountResponse,
  PagedNotificationsResponse,
} from "../types/notifications.types";
import type { ApiResponse } from "../types/auth.types";

const BASE = "/Notifications";

/**
 * GET /api/Notifications
 * Returns a paginated list of notifications for the authenticated user.
 */
export async function getNotifications(
  page = 1,
  pageSize = 20,
  unreadOnly = false
): Promise<PagedNotificationsResponse> {
  const response = await apiClient.get<ApiResponse<PagedNotificationsResponse>>(BASE, {
    params: { page, pageSize, unreadOnly },
  });
  return response.data.data;
}

/**
 * GET /api/Notifications/count
 * Returns the total and unread notification counts.
 */
export async function getNotificationCount(): Promise<NotificationCountResponse> {
  const response = await apiClient.get<ApiResponse<NotificationCountResponse>>(`${BASE}/count`);
  return response.data.data;
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
