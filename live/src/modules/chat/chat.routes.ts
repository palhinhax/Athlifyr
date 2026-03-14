// ============================================================================
// Athlifyr Live Server — Chat REST Routes (Fastify)
//
// These routes proxy chat operations through to the Next.js API.
// Clients can use these OR connect directly via Socket.io.
// ============================================================================

import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import type { Server } from "socket.io";
import { authGuard, extractToken } from "../../plugins/auth.js";
import {
  getUserConversations,
  getOrCreateConversation,
  getMessages,
  sendMessage,
  markConversationSeen,
  getChatNotifications,
  markChatNotificationRead,
  markAllChatNotificationsRead,
  hideConversation,
  ApiError,
} from "./chat.service.js";
import type {
  JWTPayload,
  ServerToClientEvents,
  ClientToServerEvents,
  InterServerEvents,
  SocketData,
} from "../../types/index.js";

type AuthRequest = FastifyRequest & { user: JWTPayload };

/** Global IO reference — set during server bootstrap */
let ioRef: Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
> | null = null;

export function setChatIO(
  io: Server<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    SocketData
  >
): void {
  ioRef = io;
}

/** Get Bearer token from request for forwarding to Next.js API */
function getToken(request: FastifyRequest): string {
  const token = extractToken(request.headers.authorization);
  if (!token) throw new Error("Missing token");
  return token;
}

export async function chatRoutes(app: FastifyInstance): Promise<void> {
  // All chat routes require authentication
  app.addHook("onRequest", authGuard);

  // ─── Error handler helper ──────────────────────────────────────────────

  function handleApiError(err: unknown, reply: FastifyReply) {
    if (err instanceof ApiError) {
      return reply.code(err.statusCode).send({ error: err.message });
    }
    throw err;
  }

  // ─── GET /chat/conversations ────────────────────────────────────────────

  app.get(
    "/conversations",
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const token = getToken(request);
        const conversations = await getUserConversations(token);
        return reply.send({ conversations });
      } catch (err) {
        return handleApiError(err, reply);
      }
    }
  );

  // ─── POST /chat/conversations ───────────────────────────────────────────

  app.post(
    "/conversations",
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const { userId } = (request as AuthRequest).user;
        const token = getToken(request);
        const { otherUserId } = request.body as { otherUserId: string };

        if (!otherUserId) {
          return reply.code(400).send({ error: "otherUserId is required" });
        }

        if (otherUserId === userId) {
          return reply
            .code(400)
            .send({ error: "Cannot create conversation with yourself" });
        }

        const conversation = await getOrCreateConversation(token, otherUserId);
        return reply.send({ conversation });
      } catch (err) {
        return handleApiError(err, reply);
      }
    }
  );

  // ─── GET /chat/conversations/:id/messages ───────────────────────────────

  app.get(
    "/conversations/:id/messages",
    async (
      request: FastifyRequest<{
        Params: { id: string };
        Querystring: { cursor?: string; limit?: string };
      }>,
      reply: FastifyReply
    ) => {
      try {
        const token = getToken(request);
        const { id: conversationId } = request.params;
        const cursor = request.query.cursor;
        const limit = parseInt(request.query.limit || "50", 10);

        const result = await getMessages(
          token,
          conversationId,
          cursor,
          Math.min(limit, 100)
        );
        return reply.send(result);
      } catch (err) {
        return handleApiError(err, reply);
      }
    }
  );

  // ─── POST /chat/conversations/:id/messages ──────────────────────────────

  app.post(
    "/conversations/:id/messages",
    async (
      request: FastifyRequest<{ Params: { id: string } }>,
      reply: FastifyReply
    ) => {
      try {
        const token = getToken(request);
        const { id: conversationId } = request.params;
        const { content } = request.body as { content: string };

        if (!content || !content.trim()) {
          return reply.code(400).send({ error: "Message content is required" });
        }

        if (content.length > 5000) {
          return reply
            .code(400)
            .send({ error: "Message too long (max 5000 characters)" });
        }

        const { event: messageEvent, participantUserIds } = await sendMessage(
          token,
          conversationId,
          content
        );

        // Broadcast via Socket.io so all connected clients see it in real-time
        if (ioRef) {
          // Emit to conversation room + participant user rooms in one call
          // Socket.io deduplicates: a socket in both rooms receives the event once
          const senderId = (request as AuthRequest).user.userId;
          let target = ioRef.to(`conversation:${conversationId}`);
          for (const uid of participantUserIds) {
            if (uid !== senderId) {
              target = target.to(`user:${uid}`);
            }
          }
          target.emit("chat:message", messageEvent);
        }

        return reply.code(201).send({ message: messageEvent });
      } catch (err) {
        return handleApiError(err, reply);
      }
    }
  );

  // ─── POST /chat/conversations/:id/seen ──────────────────────────────────

  app.post(
    "/conversations/:id/seen",
    async (
      request: FastifyRequest<{ Params: { id: string } }>,
      reply: FastifyReply
    ) => {
      try {
        const token = getToken(request);
        const { id: conversationId } = request.params;

        const lastSeenAt = await markConversationSeen(token, conversationId);
        return reply.send({ lastSeenAt });
      } catch (err) {
        return handleApiError(err, reply);
      }
    }
  );

  // ─── POST /chat/conversations/:id/hide ──────────────────────────────────

  app.post(
    "/conversations/:id/hide",
    async (
      request: FastifyRequest<{ Params: { id: string } }>,
      reply: FastifyReply
    ) => {
      try {
        const token = getToken(request);
        const { id: conversationId } = request.params;

        await hideConversation(token, conversationId);
        return reply.send({ success: true });
      } catch (err) {
        return handleApiError(err, reply);
      }
    }
  );

  // ─── GET /chat/notifications ──────────────────────────────────────────

  app.get(
    "/notifications",
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const token = getToken(request);
        const result = await getChatNotifications(token);
        return reply.send(result);
      } catch (err) {
        return handleApiError(err, reply);
      }
    }
  );

  // ─── POST /chat/notifications/:id/read ────────────────────────────────

  app.post(
    "/notifications/:id/read",
    async (
      request: FastifyRequest<{ Params: { id: string } }>,
      reply: FastifyReply
    ) => {
      try {
        const token = getToken(request);
        const { id: notificationId } = request.params;

        await markChatNotificationRead(token, notificationId);
        return reply.send({ success: true });
      } catch (err) {
        return handleApiError(err, reply);
      }
    }
  );

  // ─── POST /chat/notifications/read-all ────────────────────────────────

  app.post(
    "/notifications/read-all",
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const token = getToken(request);
        await markAllChatNotificationsRead(token);
        return reply.send({ success: true });
      } catch (err) {
        return handleApiError(err, reply);
      }
    }
  );
}
