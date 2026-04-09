/**
 * TypeScript types/DTOs for the Chat tag
 */

export interface ConversationResponseDTO {
  id: string; // uuid
  otherParticipantId: string;
  otherParticipantName: string;
  otherParticipantAvatar: string | null;
  lastMessage: string | null;
  lastMessageAt: string;
  unreadCount: number;
}

export interface MessageResponseDTO {
  id: string; // uuid
  conversationId: string;
  senderId: string;
  senderName: string;
  content: string;
  imageUrl: string | null;
  isRead: boolean;
  createdAt: string;
}

export interface SendMessageRequestDTO {
  conversationId: string;
  content: string;
  imageUrl?: string | null;
}

export interface StartConversationRequestDTO {
  vendorId: string;
  orderId?: string | null;
  initialMessage?: string | null;
}

export interface PagedMessagesResponseDTO {
  items: MessageResponseDTO[];
  totalCount: number;
  pageIndex: number;
  pageSize: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface UnreadCountResponse {
  totalUnreadCount: number;
}
