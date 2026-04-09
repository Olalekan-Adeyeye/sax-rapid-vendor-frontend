/**
 * Chat and Messaging Services
 * Strictly following swagger.json and project's functional service pattern.
 */

import apiClient from "../apiClient";
import type { ApiResponse } from "../types/auth.types";
import type { 
  ConversationResponseDTO, 
  MessageResponseDTO, 
  SendMessageRequestDTO, 
  StartConversationRequestDTO,
  PagedMessagesResponseDTO,
  UnreadCountResponse
} from "../types/chat.types";

const BASE = "/Chat";

/**
 * GET /api/Chat/conversations
 * Get all conversations for the authenticated user
 */
export async function getConversations(): Promise<ConversationResponseDTO[]> {
  const response = await apiClient.get<ApiResponse<ConversationResponseDTO[]>>(`${BASE}/conversations`);
  return response.data.data;
}

/**
 * GET /api/Chat/conversations/{conversationId}
 * Get details of a specific conversation
 */
export async function getConversation(conversationId: string): Promise<ConversationResponseDTO> {
  const response = await apiClient.get<ApiResponse<ConversationResponseDTO>>(`${BASE}/conversations/${conversationId}`);
  return response.data.data;
}

/**
 * GET /api/Chat/conversations/{conversationId}/messages
 * Get messages in a conversation (paginated)
 */
export async function getMessages(
  conversationId: string, 
  page = 1, 
  pageSize = 50
): Promise<PagedMessagesResponseDTO> {
  const response = await apiClient.get<ApiResponse<PagedMessagesResponseDTO>>(
    `${BASE}/conversations/${conversationId}/messages`,
    { params: { page, pageSize } }
  );
  return response.data.data;
}

/**
 * POST /api/Chat/messages
 * Send a new message
 */
export async function sendMessage(request: SendMessageRequestDTO): Promise<MessageResponseDTO> {
  const response = await apiClient.post<ApiResponse<MessageResponseDTO>>(`${BASE}/messages`, request);
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
  const response = await apiClient.get<ApiResponse<UnreadCountResponse>>(`${BASE}/unread-count`);
  return response.data.data;
}

/**
 * POST /api/Chat/conversations
 * Start a new conversation (Vendor usually doesn't do this, but included for completeness)
 */
export async function startConversation(request: StartConversationRequestDTO): Promise<ConversationResponseDTO> {
  const response = await apiClient.post<ApiResponse<ConversationResponseDTO>>(`${BASE}/conversations`, request);
  return response.data.data;
}
