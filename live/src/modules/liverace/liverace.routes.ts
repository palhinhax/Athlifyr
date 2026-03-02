// ============================================================================
// Athlifyr Live Server — LiveRace REST Routes (Fastify)
//
// POST /live/start  — prepare/warm up an event room (idempotent)
// POST /live/stop   — stop a live race (admin)
// GET  /live/status — get room status + stats
// ============================================================================

import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { authGuard } from "../../plugins/auth.js";
import {
  startEvent,
  stopEvent,
  getRoom,
  getActiveRoomIds,
  getSnapshot,
} from "./liverace.service.js";
import type { JWTPayload } from "../../types/index.js";

type AuthRequest = FastifyRequest & { user: JWTPayload };

/** Global IO reference — set during server bootstrap */
let ioRef: Parameters<typeof startEvent>[1] | null = null;

export function setLiveRaceIO(io: Parameters<typeof startEvent>[1]): void {
  ioRef = io;
}

export async function liveRaceRoutes(app: FastifyInstance): Promise<void> {
  // ─── POST /live/start ───────────────────────────────────────────────────
  // Idempotent: can be called by spectator activation or admin trigger.
  // Does NOT require auth (called from server-side by the Next.js frontend).
  // Validates via internal headers (X-Live-Server).

  app.post("/start", async (request: FastifyRequest, reply: FastifyReply) => {
    const body = request.body as { eventId?: string } | null;
    const eventId = body?.eventId;

    if (!eventId) {
      return reply.code(400).send({ error: "Missing eventId in request body" });
    }

    if (!ioRef) {
      return reply.code(503).send({ error: "Socket.io not yet initialised" });
    }

    try {
      const { room, created } = await startEvent(eventId, ioRef);
      return reply.send({
        status: room.status,
        eventId: room.eventId,
        created,
        athletes: room.athletes.size,
        spectators: room.spectatorCount,
      });
    } catch (err) {
      app.log.error(err);
      return reply
        .code(500)
        .send({ error: (err as Error).message || "Failed to start event" });
    }
  });

  // ─── POST /live/stop ────────────────────────────────────────────────────
  // Admin-only: stop a live race and persist results.

  app.post(
    "/stop",
    { onRequest: authGuard },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const user = (request as AuthRequest).user;
      if (user.role !== "ADMIN") {
        return reply.code(403).send({ error: "Admin role required" });
      }

      const body = request.body as {
        eventId?: string;
        reason?: "FINISHED" | "CANCELLED";
      } | null;
      const eventId = body?.eventId;
      const reason = body?.reason ?? "FINISHED";

      if (!eventId) {
        return reply
          .code(400)
          .send({ error: "Missing eventId in request body" });
      }

      if (!ioRef) {
        return reply.code(503).send({ error: "Socket.io not yet initialised" });
      }

      try {
        await stopEvent(eventId, ioRef, reason);
        return reply.send({ success: true, eventId, status: reason });
      } catch (err) {
        app.log.error(err);
        return reply
          .code(500)
          .send({ error: (err as Error).message || "Failed to stop event" });
      }
    }
  );

  // ─── GET /live/status ───────────────────────────────────────────────────
  // Public: get current status of a live event or list all active rooms.

  app.get("/status", async (request: FastifyRequest, reply: FastifyReply) => {
    const eventId = (request.query as { eventId?: string }).eventId;

    if (eventId) {
      const snapshot = getSnapshot(eventId);
      if (!snapshot) {
        return reply.code(404).send({ error: "No active room for this event" });
      }
      return reply.send({ eventId, ...snapshot });
    }

    // List all active rooms
    const roomIds = getActiveRoomIds();
    const summaries = roomIds.map((id) => {
      const room = getRoom(id);
      return {
        eventId: id,
        status: room?.status ?? "UNKNOWN",
        athletes: room?.athletes.size ?? 0,
        spectators: room?.spectatorCount ?? 0,
      };
    });

    return reply.send({ rooms: summaries });
  });
}
