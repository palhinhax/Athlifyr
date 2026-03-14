// ============================================================================
// Athlifyr Live Server — Next.js API Client
//
// All database operations go through the Next.js API.
// The live server is ONLY a real-time layer (Socket.io + Redis).
// ============================================================================

import { config } from "../config.js";

/** Error thrown when the Next.js API returns a non-OK response */
export class ApiError extends Error {
  statusCode: number;
  code: string;

  constructor(statusCode: number, message: string, code = "API_ERROR") {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.code = code;
  }
}

/** Make an authenticated request to the Next.js API */
async function apiRequest<T>(
  path: string,
  options: {
    method?: string;
    body?: Record<string, unknown>;
    token: string;
    query?: Record<string, string>;
  }
): Promise<T> {
  const { method = "GET", body, token, query } = options;

  let url = `${config.nextApiUrl}${path}`;
  if (query) {
    const params = new URLSearchParams(query);
    url += `?${params.toString()}`;
  }

  const headers: Record<string, string> = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
    "X-Live-Server": "true", // Identify requests from the live server
  };

  const res = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({ error: res.statusText }));
    throw new ApiError(
      res.status,
      (errorBody as { error?: string }).error || "API request failed",
      res.status === 403 ? "NOT_PARTICIPANT" : "API_ERROR"
    );
  }

  return res.json() as Promise<T>;
}

// ─── Conversation types (matching Next.js API responses) ───────────────────

export interface UserBasic {
  id: string;
  name: string | null;
  image: string | null;
  email?: string;
}

export interface ParticipantInfo {
  id: string;
  conversationId: string;
  userId: string;
  hidden: boolean;
  lastSeenAt: string;
  user: UserBasic;
}

export interface MessageInfo {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  createdAt: string;
  sender: UserBasic;
}

export interface ConversationInfo {
  id: string;
  createdAt: string;
  updatedAt: string;
  participants: ParticipantInfo[];
  messages: MessageInfo[];
}

export interface ChatNotificationInfo {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string | null;
  senderImage: string | null;
  content: string;
  createdAt: string;
  read: boolean;
}

// ─── Chat API Methods ──────────────────────────────────────────────────────

/** List conversations for authenticated user */
export async function apiGetConversations(
  token: string
): Promise<{ conversations: ConversationInfo[] }> {
  return apiRequest("/api/chat/conversations", { token });
}

/** Create or get existing conversation with another user */
export async function apiCreateConversation(
  token: string,
  otherUserId: string
): Promise<{ conversation: ConversationInfo }> {
  return apiRequest("/api/chat/conversations", {
    method: "POST",
    token,
    body: { otherUserId },
  });
}

/** Get messages for a conversation (paginated) */
export async function apiGetMessages(
  token: string,
  conversationId: string,
  cursor?: string,
  limit = 50
): Promise<{ messages: MessageInfo[]; nextCursor: string | null }> {
  const query: Record<string, string> = { limit: String(limit) };
  if (cursor) query.cursor = cursor;

  return apiRequest(`/api/chat/conversations/${conversationId}/messages`, {
    token,
    query,
  });
}

/** Send a message in a conversation */
export async function apiSendMessage(
  token: string,
  conversationId: string,
  content: string
): Promise<{ message: MessageInfo; participantUserIds?: string[] }> {
  return apiRequest(`/api/chat/conversations/${conversationId}/messages`, {
    method: "POST",
    token,
    body: { content },
  });
}

/** Mark a conversation as seen */
export async function apiMarkSeen(
  token: string,
  conversationId: string
): Promise<{ lastSeenAt: string }> {
  return apiRequest(`/api/chat/conversations/${conversationId}/seen`, {
    method: "POST",
    token,
  });
}

/** Hide a conversation */
export async function apiHideConversation(
  token: string,
  conversationId: string
): Promise<{ success: boolean }> {
  return apiRequest(`/api/chat/conversations/${conversationId}/hide`, {
    method: "POST",
    token,
  });
}

/** Get chat notifications (unread count) */
export async function apiGetChatNotifications(token: string): Promise<{
  notifications: ChatNotificationInfo[];
  unreadCount: number;
}> {
  return apiRequest("/api/chat/notifications", { token });
}

/** Mark a chat notification as read */
export async function apiMarkChatNotificationRead(
  token: string,
  notificationId: string
): Promise<{ success: boolean }> {
  return apiRequest(`/api/chat/notifications/${notificationId}/read`, {
    method: "POST",
    token,
  });
}

/** Mark all chat notifications as read */
export async function apiMarkAllChatNotificationsRead(
  token: string
): Promise<{ success: boolean }> {
  return apiRequest("/api/chat/notifications/read-all", {
    method: "POST",
    token,
  });
}

/** Verify user is a participant of a conversation (used for room join) */
export async function apiVerifyParticipant(
  token: string,
  conversationId: string
): Promise<boolean> {
  try {
    // If we can fetch messages, the user is a participant
    await apiGetMessages(token, conversationId, undefined, 1);
    return true;
  } catch (err) {
    if (err instanceof ApiError && err.statusCode === 403) {
      return false;
    }
    throw err;
  }
}
