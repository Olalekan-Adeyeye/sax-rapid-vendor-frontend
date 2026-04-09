import apiClient from "../apiClient";
import type { 
  ConversationResponseDTO, 
  MessageResponseDTO, 
  SendMessageRequestDTO, 
  StartConversationRequestDTO,
  PagedMessagesResponseDTO,
  UnreadCountResponse
} from "../types/chat.types";

/**
 * Chat and Messaging Service
 */
export const chatService = {
  /**
   * Get all conversations for the authenticated user
   */
  getConversations: async (): Promise<ConversationResponseDTO[]> => {
    const response = await apiClient.get<ConversationResponseDTO[]>("/api/Chat/conversations");
    return response.data;
  },

  /**
   * Get details of a specific conversation
   */
  getConversation: async (conversationId: string): Promise<ConversationResponseDTO> => {
    const response = await apiClient.get<ConversationResponseDTO>(`/api/Chat/conversations/${conversationId}`);
    return response.data;
  },

  /**
   * Get messages in a conversation (paginated)
   */
  getMessages: async (conversationId: string, page = 1, pageSize = 50): Promise<PagedMessagesResponseDTO> => {
    const response = await apiClient.get<PagedMessagesResponseDTO>(
      `/api/Chat/conversations/${conversationId}/messages`,
      { params: { page, pageSize } }
    );
    return response.data;
  },

  /**
   * Send a new message
   */
  sendMessage: async (request: SendMessageRequestDTO): Promise<MessageResponseDTO> => {
    const response = await apiClient.post<MessageResponseDTO>("/api/Chat/messages", request);
    return response.data;
  },

  /**
   * Mark all messages in a conversation as read
   */
  markAsRead: async (conversationId: string): Promise<void> => {
    await apiClient.patch(`/api/Chat/conversations/${conversationId}/read`);
  },

  /**
   * Get total unread message count
   */
  getUnreadCount: async (): Promise<UnreadCountResponse> => {
    const response = await apiClient.get<UnreadCountResponse>("/api/Chat/unread-count");
    return response.data;
  },

  /**
   * Start a new conversation (Vendor usually doesn't do this, but included for completeness)
   */
  startConversation: async (request: StartConversationRequestDTO): Promise<ConversationResponseDTO> => {
    const response = await apiClient.post<ConversationResponseDTO>("/api/Chat/conversations", request);
    return response.data;
  }
};
