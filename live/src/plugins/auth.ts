// ============================================================================
// Athlifyr Live Server — Auth Plugin (JWT verification)
// ============================================================================

import jwt from "jsonwebtoken";
import type { FastifyRequest, FastifyReply } from "fastify";
import type { Socket } from "socket.io";
import { config } from "../config.js";
import type { JWTPayload, SocketData } from "../types/index.js";

function getSecret(): string {
  if (!config.jwtSecret) {
    throw new Error(
      "JWT_SECRET or NEXTAUTH_SECRET is not defined in environment"
    );
  }
  return config.jwtSecret;
}

/** Verify and decode a JWT token */
export function verifyToken(token: string): JWTPayload {
  return jwt.verify(token, getSecret()) as JWTPayload;
}

/** Extract Bearer token from Authorization header */
export function extractToken(header: string | undefined): string | null {
  if (!header || !header.startsWith("Bearer ")) return null;
  return header.substring(7);
}

// ─── Fastify Auth Hook ─────────────────────────────────────────────────────

export async function authGuard(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  const token = extractToken(request.headers.authorization);
  if (!token) {
    reply.code(401).send({ error: "Missing authorization token" });
    return;
  }

  try {
    const payload = verifyToken(token);

    if (payload.type === "refresh") {
      reply
        .code(401)
        .send({ error: "Refresh tokens cannot be used for API access" });
      return;
    }

    // Attach user info to request
    (request as FastifyRequest & { user: JWTPayload }).user = payload;
  } catch {
    reply.code(401).send({ error: "Invalid or expired token" });
  }
}

// ─── Socket.io Auth Middleware ──────────────────────────────────────────────

export function socketAuthMiddleware(
  socket: Socket,
  next: (err?: Error) => void
): void {
  const token =
    socket.handshake.auth?.token ||
    extractToken(socket.handshake.headers?.authorization);

  if (!token) {
    return next(new Error("Authentication required"));
  }

  try {
    const payload = verifyToken(token);

    if (payload.type === "refresh") {
      return next(
        new Error("Refresh tokens cannot be used for socket connections")
      );
    }

    // Attach user data to socket
    const data = socket.data as SocketData;
    data.userId = payload.userId;
    data.email = payload.email;
    data.userName = payload.name ?? null;
    data.role = payload.role;
    data.token = token;

    next();
  } catch {
    next(new Error("Invalid or expired token"));
  }
}
