// ============================================================================
// Athlifyr Mobile — Chat API
//
// All chat REST operations go through the live server (Fastify).
// Real-time events are handled by Socket.io (see useSocketChat).
// ============================================================================

import { liveFetch } from "../lib/live";

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  createdAt: Date | string;
  /** Nested sender object (from initial fetch) */
  sender?: {
    id: string;
    name: string | null;
    image: string | null;
  };
  /** Flat sender fields (from Socket.io events) */
  senderName?: string | null;
  senderImage?: string | null;
}

export interface Conversation {
  id: string;
  participants: Array<{
    userId: string;
    lastSeenAt: Date | string;
    user: {
      id: string;
      name: string | null;
      image: string | null;
      email: string;
    };
  }>;
  messages: Array<{
    id: string;
    content: string;
    createdAt: Date | string;
    senderId: string;
    sender?: {
      id: string;
      name: string | null;
      image: string | null;
    };
  }>;
  updatedAt: Date | string;
}

export interface CreateConversationResponse {
  conversation: Conversation;
}

/** Helper to extract sender info from a Message regardless of format */
export function getMessageSender(message: Message): {
  id: string;
  name: string | null;
  image: string | null;
} {
  if (message.sender) return message.sender;
  return {
    id: message.senderId,
    name: message.senderName ?? null,
    image: message.senderImage ?? null,
  };
}

/**
 * Fetch all conversations for the current user (via live server)
 */
export async function fetchConversations(): Promise<Conversation[]> {
  const data = await liveFetch<{ conversations: Conversation[] }>(
    "/conversations"
  );
  return data.conversations || [];
}

/**
 * Fetch messages for a specific conversation (via live server)
 */
export async function fetchMessages(
  conversationId: string
): Promise<Message[]> {
  const data = await liveFetch<{ messages: Message[] }>(
    `/conversations/${conversationId}/messages`
  );
  return data.messages || [];
}

/**
 * Send a message to a conversation (via live server REST)
 * NOTE: Prefer socket.emit("chat:message") for real-time delivery.
 * This is used as a fallback when the socket is not connected.
 */
export async function sendMessage(
  conversationId: string,
  content: string
): Promise<Message> {
  const data = await liveFetch<{ message: Message }>(
    `/conversations/${conversationId}/messages`,
    {
      method: "POST",
      body: { content },
    }
  );
  return data.message;
}

/**
 * Create or get a conversation with another user (via live server)
 */
export async function createConversation(
  otherUserId: string
): Promise<CreateConversationResponse> {
  return liveFetch<CreateConversationResponse>("/conversations", {
    method: "POST",
    body: { otherUserId },
  });
}

/**
 * Hide a conversation (via live server)
 */
export async function hideConversation(conversationId: string): Promise<void> {
  await liveFetch(`/conversations/${conversationId}/hide`, {
    method: "POST",
  });
}

/**
 * Mark conversation as seen (via live server)
 */
export async function markConversationSeen(
  conversationId: string
): Promise<void> {
  await liveFetch(`/conversations/${conversationId}/seen`, {
    method: "POST",
  });
}

export interface ChatNotificationsResponse {
  notifications: Array<{
    id: string;
    conversationId: string;
    senderId: string;
    senderName: string | null;
    senderImage: string | null;
    content: string;
    createdAt: string;
    read: boolean;
  }>;
  unreadCount: number;
}

/**
 * Fetch chat notifications / unread count (via live server)
 */
export async function fetchChatNotifications(): Promise<ChatNotificationsResponse> {
  return liveFetch<ChatNotificationsResponse>("/notifications");
}
