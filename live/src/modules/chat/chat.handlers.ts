// ============================================================================
// Athlifyr Live Server — Chat Socket.io Handlers
//
// Real-time layer only. All DB persistence goes through Next.js API.
// Redis is used for ephemeral data (typing indicators, presence).
// ============================================================================

import type { Server, Socket } from "socket.io";
import type {
  ServerToClientEvents,
  ClientToServerEvents,
  InterServerEvents,
  SocketData,
} from "../../types/index.js";
import {
  sendMessage,
  markConversationSeen,
  verifyParticipant,
  ApiError,
} from "./chat.service.js";
import {
  setTyping,
  setUserOnline,
  setUserOffline,
} from "../../plugins/redis.js";

type LiveServer = Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>;

type LiveSocket = Socket<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>;

/** User room name (for targeting specific users) */
function userRoom(userId: string): string {
  return `user:${userId}`;
}

/** Conversation room name */
function conversationRoom(conversationId: string): string {
  return `conversation:${conversationId}`;
}

/** Get the JWT token from the socket data (stored during auth middleware) */
function getSocketToken(socket: LiveSocket): string {
  return socket.data.token || "";
}

/** Register chat event handlers for a connected socket */
export function registerChatHandlers(io: LiveServer, socket: LiveSocket): void {
  const { userId, userName } = socket.data;
  const token = getSocketToken(socket);

  // Join user's personal room (for direct notifications)
  socket.join(userRoom(userId));

  // ─── Join conversation room ──────────────────────────────────────────

  socket.on("chat:join", async (conversationId) => {
    try {
      // Verify user is participant via Next.js API
      const isParticipant = await verifyParticipant(token, conversationId);

      if (!isParticipant) {
        socket.emit("chat:error", {
          message: "Not a participant of this conversation",
          code: "NOT_PARTICIPANT",
        });
        return;
      }

      socket.join(conversationRoom(conversationId));
      console.log(
        `[Chat] User ${userId} joined conversation ${conversationId}`
      );
    } catch (err) {
      console.error("[Chat] Error joining conversation:", err);
      socket.emit("chat:error", {
        message: "Failed to join conversation",
        code: "JOIN_ERROR",
      });
    }
  });

  // ─── Leave conversation room ─────────────────────────────────────────

  socket.on("chat:leave", (conversationId) => {
    socket.leave(conversationRoom(conversationId));
    console.log(`[Chat] User ${userId} left conversation ${conversationId}`);
  });

  // ─── Send message ────────────────────────────────────────────────────

  socket.on("chat:message", async ({ conversationId, content }) => {
    try {
      if (!content || !content.trim()) {
        socket.emit("chat:error", {
          message: "Message content is required",
          code: "EMPTY_MESSAGE",
        });
        return;
      }

      if (content.length > 5000) {
        socket.emit("chat:error", {
          message: "Message too long (max 5000 characters)",
          code: "MESSAGE_TOO_LONG",
        });
        return;
      }

      // Persist message via Next.js API
      const messageEvent = await sendMessage(token, conversationId, content);

      // Broadcast to all participants in the conversation room
      io.to(conversationRoom(conversationId)).emit(
        "chat:message",
        messageEvent
      );

      // Clear typing indicator
      await setTyping(conversationId, userId, false);
    } catch (err) {
      if (err instanceof ApiError) {
        socket.emit("chat:error", {
          message: err.message,
          code: err.code,
        });
      } else {
        console.error("[Chat] Error sending message:", err);
        socket.emit("chat:error", {
          message: "Failed to send message",
          code: "SEND_ERROR",
        });
      }
    }
  });

  // ─── Typing indicator (Redis only — no DB needed) ───────────────────

  socket.on("chat:typing", async ({ conversationId, isTyping }) => {
    try {
      // Store in Redis for ephemeral state
      await setTyping(conversationId, userId, isTyping);

      // Broadcast typing indicator to other participants in room
      socket.to(conversationRoom(conversationId)).emit("chat:typing", {
        conversationId,
        userId,
        userName: userName ?? null,
        isTyping,
      });
    } catch (err) {
      console.error("[Chat] Error handling typing:", err);
    }
  });

  // ─── Mark as seen (persisted via Next.js API) ───────────────────────

  socket.on("chat:seen", async (conversationId) => {
    try {
      const lastSeenAt = await markConversationSeen(token, conversationId);

      // Notify other participants in room
      socket.to(conversationRoom(conversationId)).emit("chat:seen", {
        conversationId,
        userId,
        lastSeenAt,
      });
    } catch (err) {
      console.error("[Chat] Error marking seen:", err);
    }
  });
}

// ─── Connection / Disconnection ────────────────────────────────────────────

export async function handleChatConnect(
  io: LiveServer,
  socket: LiveSocket
): Promise<void> {
  const { userId } = socket.data;

  // Mark user online in Redis (ephemeral)
  await setUserOnline(userId);

  // Register all chat event handlers
  registerChatHandlers(io, socket);

  // Notify others that user is online
  socket.broadcast.emit("chat:user_online", { userId });

  console.log(`[Chat] User ${userId} connected (socket: ${socket.id})`);
}

export async function handleChatDisconnect(
  io: LiveServer,
  socket: LiveSocket
): Promise<void> {
  const { userId } = socket.data;

  // Check if user has other active sockets before marking offline
  const sockets = await io.in(userRoom(userId)).fetchSockets();

  // Only mark offline if this was the last socket
  if (sockets.length === 0) {
    await setUserOffline(userId);
    socket.broadcast.emit("chat:user_offline", { userId });
    console.log(`[Chat] User ${userId} went offline`);
  }

  console.log(`[Chat] User ${userId} disconnected (socket: ${socket.id})`);
}
