/**
 * Chat and Messaging Services
 * Strictly following swagger.json and project's functional service pattern.
 */

import { pickNumber, unwrapEnvelope } from "@/lib/utils/response";

import apiClient from "../apiClient";
import type { ApiResponse } from "../types/auth.types";
import type {
  ConversationResponseDTO,
  MessageResponseDTO,
  SendMessageRequestDTO,
  StartConversationRequestDTO,
  PagedMessagesResponseDTO,
  UnreadCountResponse,
} from "../types/chat.types";

const BASE = "/Chat";

/**
 * GET /api/Chat/conversations
 * Get all conversations for the authenticated user
 */
export async function getConversations(): Promise<ConversationResponseDTO[]> {
  const response = await apiClient.get<ApiResponse<ConversationResponseDTO[]>>(
    `${BASE}/conversations`,
  );
  return response.data.data;
}

/**
 * GET /api/Chat/conversations/{conversationId}
 * Get details of a specific conversation
 */
export async function getConversation(
  conversationId: string,
): Promise<ConversationResponseDTO> {
  const response = await apiClient.get<ApiResponse<ConversationResponseDTO>>(
    `${BASE}/conversations/${conversationId}`,
  );
  return response.data.data;
}

/**
 * GET /api/Chat/conversations/{conversationId}/messages
 * Get messages in a conversation (paginated)
 */
export async function getMessages(
  conversationId: string,
  page = 1,
  pageSize = 50,
): Promise<PagedMessagesResponseDTO> {
  const response = await apiClient.get<ApiResponse<MessageResponseDTO[]>>(
    `${BASE}/conversations/${conversationId}/messages`,
    { params: { page, pageSize } },
  );
  const messages = response.data.data;

  return {
    items: messages,
    totalCount: messages.length,
    pageIndex: page,
    pageSize: pageSize,
    totalPages: 1,
    hasPreviousPage: page > 1,
    hasNextPage: pageSize > 0 && messages.length >= pageSize,
  };
}

/**
 * POST /api/Chat/messages
 * Send a new message
 */
export async function sendMessage(
  request: SendMessageRequestDTO,
): Promise<MessageResponseDTO> {
  const response = await apiClient.post<ApiResponse<MessageResponseDTO>>(
    `${BASE}/messages`,
    request,
  );
  return response.data.data;
}

/**
 * PATCH /api/Chat/conversations/{conversationId}/read
 * Mark all messages in a conversation as read
 */
export async function markAsRead(conversationId: string): Promise<void> {
  await apiClient.patch(`${BASE}/conversations/${conversationId}/read`);
}

/**
 * GET /api/Chat/unread-count
 * Get total unread message count
 */
export async function getUnreadCount(): Promise<UnreadCountResponse> {
  const response = await apiClient.get<unknown>(`${BASE}/unread-count`);
  const raw = unwrapEnvelope(response.data);
  if (typeof raw === "number" && Number.isFinite(raw)) {
    return { totalUnreadCount: raw };
  }
  if (raw && typeof raw === "object" && !Array.isArray(raw)) {
    const record = raw as Record<string, unknown>;
    const count = pickNumber(record, [
      "totalUnreadCount",
      "TotalUnreadCount",
      "unreadCount",
      "UnreadCount",
      "unread",
      "Unread",
      "count",
      "Count",
      "total",
      "Total",
    ]);
    return { totalUnreadCount: count ?? 0 };
  }
  return { totalUnreadCount: 0 };
}

/**
 * POST /api/Chat/conversations
 * Start a new conversation (Vendor usually doesn't do this, but included for completeness)
 */
export async function startConversation(
  request: StartConversationRequestDTO,
): Promise<ConversationResponseDTO> {
  const response = await apiClient.post<ApiResponse<ConversationResponseDTO>>(
    `${BASE}/conversations`,
    request,
  );
  return response.data.data;
}
