// ============================================================================
// Athlifyr Live Server — Chat Service (via Next.js API)
//
// All DB operations are delegated to the Next.js API.
// This service is a thin wrapper that the Socket.io handlers call.
// ============================================================================

import {
  apiGetConversations,
  apiCreateConversation,
  apiGetMessages,
  apiSendMessage,
  apiMarkSeen,
  apiHideConversation,
  apiGetChatNotifications,
  apiMarkChatNotificationRead,
  apiMarkAllChatNotificationsRead,
  apiVerifyParticipant,
  ApiError,
} from "../../plugins/api-client.js";
import type { ChatMessageEvent } from "../../types/index.js";

// Re-export ApiError for handlers
export { ApiError };

// ─── Conversations ─────────────────────────────────────────────────────────

/** List conversations for a user (via Next.js API) */
export async function getUserConversations(token: string) {
  const { conversations } = await apiGetConversations(token);
  return conversations;
}

/** Get or create a conversation between two users (via Next.js API) */
export async function getOrCreateConversation(
  token: string,
  otherUserId: string
) {
  const { conversation } = await apiCreateConversation(token, otherUserId);
  return conversation;
}

// ─── Messages ──────────────────────────────────────────────────────────────

/** Send a message in a conversation (via Next.js API) */
export async function sendMessage(
  token: string,
  conversationId: string,
  content: string
): Promise<ChatMessageEvent> {
  const { message } = await apiSendMessage(token, conversationId, content);

  return {
    id: message.id,
    conversationId: message.conversationId,
    senderId: message.senderId,
    senderName: message.sender.name,
    senderImage: message.sender.image,
    content: message.content,
    createdAt: message.createdAt,
  };
}

/** Get paginated messages for a conversation (via Next.js API) */
export async function getMessages(
  token: string,
  conversationId: string,
  cursor?: string,
  limit = 50
) {
  return apiGetMessages(token, conversationId, cursor, limit);
}

// ─── Seen / Read receipts ──────────────────────────────────────────────────

/** Mark a conversation as seen (via Next.js API) */
export async function markConversationSeen(
  token: string,
  conversationId: string
): Promise<string> {
  const { lastSeenAt } = await apiMarkSeen(token, conversationId);
  return lastSeenAt;
}

/** Get chat notifications (via Next.js API) */
export async function getChatNotifications(token: string) {
  return apiGetChatNotifications(token);
}

/** Mark a chat notification as read (via Next.js API) */
export async function markChatNotificationRead(
  token: string,
  notificationId: string
): Promise<void> {
  await apiMarkChatNotificationRead(token, notificationId);
}

/** Mark all chat notifications as read (via Next.js API) */
export async function markAllChatNotificationsRead(
  token: string
): Promise<void> {
  await apiMarkAllChatNotificationsRead(token);
}

// ─── Participant verification ─────────────────────────────────────────────

/** Verify if user is a participant of a conversation (via Next.js API) */
export async function verifyParticipant(
  token: string,
  conversationId: string
): Promise<boolean> {
  return apiVerifyParticipant(token, conversationId);
}

// ─── Hide conversation ────────────────────────────────────────────────────

/** Hide a conversation for a user (via Next.js API) */
export async function hideConversation(
  token: string,
  conversationId: string
): Promise<void> {
  await apiHideConversation(token, conversationId);
}
