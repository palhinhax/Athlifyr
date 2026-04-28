// ============================================================================
// Athlifyr Live Server — LiveRace REST Routes (Fastify)
//
// POST /live/start              — prepare/warm up an event room (idempotent)
// POST /live/stop               — stop a live race (admin)
// GET  /live/status             — get room status + stats
// POST /internal/status         — Next.js → live server: sync status change
// GET  /internal/room-info/:id  — Next.js → live server: get room metrics
// ============================================================================

import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { authGuard, verifyToken, extractToken } from "../../plugins/auth.js";
import {
  startEvent,
  stopEvent,
  getRoom,
  getActiveRoomIds,
  getSnapshot,
  eventRoom,
  getSpectatorFriends,
  filterLeaderboardForViewer,
  filterPositionsForViewer,
} from "./liverace.service.js";
import type { JWTPayload } from "../../types/index.js";
import type { EventLiveStatus } from "./liverace.types.js";

type AuthRequest = FastifyRequest & { user: JWTPayload };

/** Global IO reference — set during server bootstrap */
let ioRef: Parameters<typeof startEvent>[1] | null = null;

export function setLiveRaceIO(io: Parameters<typeof startEvent>[1]): void {
  ioRef = io;
}

// ─── Internal Secret Validation ─────────────────────────────────────────────
// Defined early so `liveRaceRoutes` can guard server-to-server endpoints.

function validateInternalSecret(
  request: FastifyRequest,
  reply: FastifyReply
): boolean {
  const secret = process.env.LIVE_INTERNAL_SECRET;
  if (!secret) {
    // Fail-closed: if the secret is not configured, no caller can be trusted.
    reply.code(500).send({ error: "LIVE_INTERNAL_SECRET not configured" });
    return false;
  }
  if (request.headers["x-live-secret"] !== secret) {
    reply.code(401).send({ error: "Unauthorized" });
    return false;
  }
  return true;
}

/**
 * Best-effort extraction of a viewer identity from an optional Bearer token.
 * Used by public-read endpoints to apply per-viewer privacy filtering.
 * Returns undefined for anonymous callers (who only get PUBLIC athletes).
 */
function tryExtractViewerId(request: FastifyRequest): string | undefined {
  const token = extractToken(request.headers.authorization);
  if (!token) return undefined;
  try {
    const payload = verifyToken(token);
    if (payload.type === "refresh") return undefined;
    return payload.userId;
  } catch {
    return undefined;
  }
}

export async function liveRaceRoutes(app: FastifyInstance): Promise<void> {
  // ─── POST /live/start ───────────────────────────────────────────────────
  // Server-to-server only: triggered by Next.js on spectator activation.
  // Requires the shared internal secret to prevent unauthenticated clients
  // from forcing room creation (DoS surface) on the live server.

  app.post("/start", async (request: FastifyRequest, reply: FastifyReply) => {
    if (!validateInternalSecret(request, reply)) return;

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
  // Public read: returns status + current snapshot for a single event.
  // Per-viewer privacy filtering is applied using the optional Bearer token:
  // authenticated viewers see FRIENDS athletes they are friends with; anon
  // viewers only see PUBLIC athletes. Without this filter the endpoint would
  // leak full GPS/leaderboard data for FRIENDS/ORGANIZER_ONLY athletes.
  //
  // Listing all active rooms is restricted to internal callers only.

  app.get("/status", async (request: FastifyRequest, reply: FastifyReply) => {
    const eventId = (request.query as { eventId?: string }).eventId;

    if (eventId) {
      const snapshot = getSnapshot(eventId);
      if (!snapshot) {
        return reply.code(404).send({ error: "No active room for this event" });
      }

      const viewerUserId = tryExtractViewerId(request);
      const friendIds = await getSpectatorFriends(viewerUserId);
      const filteredLeaderboard = filterLeaderboardForViewer(
        snapshot.leaderboard,
        viewerUserId,
        friendIds,
        false
      );
      const filteredAthletes = filterPositionsForViewer(
        snapshot.athletes,
        viewerUserId,
        friendIds,
        false
      );

      return reply.send({
        eventId,
        status: snapshot.status,
        raceStartTime: snapshot.raceStartTime,
        variantStartTimes: snapshot.variantStartTimes,
        spectatorCount: snapshot.spectatorCount,
        leaderboard: filteredLeaderboard,
        athletes: filteredAthletes,
      });
    }

    // Listing every active room exposes operational data about the whole
    // platform and has no legitimate public use case — restrict to internal.
    if (!validateInternalSecret(request, reply)) return;

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

// ─── Internal Routes (called by Next.js, not exposed to clients) ─────────────

export async function internalRoutes(app: FastifyInstance): Promise<void> {
  // POST /internal/status — called by Next.js live-control API after DB update
  app.post("/status", async (request: FastifyRequest, reply: FastifyReply) => {
    if (!validateInternalSecret(request, reply)) return;

    const body = request.body as {
      eventId?: string;
      status?: string;
    } | null;
    const { eventId, status } = body ?? {};

    if (!eventId || !status) {
      return reply.code(400).send({ error: "Missing eventId or status" });
    }

    const room = getRoom(eventId);
    if (room && ioRef) {
      room.status = status as EventLiveStatus;
      ioRef.to(eventRoom(eventId)).emit("liverace:status_changed", {
        eventId,
        status: status as EventLiveStatus,
        ...(room.raceStartTime != null && {
          raceStartTime: room.raceStartTime,
        }),
        variantStartTimes:
          room.variantStartTimes.size > 0
            ? Object.fromEntries(room.variantStartTimes)
            : undefined,
      });
    }

    return reply.send({ ok: true, eventId, status, roomFound: !!room });
  });

  // GET /internal/room-info/:eventId — called by Next.js live-status API
  app.get(
    "/room-info/:eventId",
    async (request: FastifyRequest, reply: FastifyReply) => {
      if (!validateInternalSecret(request, reply)) return;

      const { eventId } = request.params as { eventId: string };
      const room = getRoom(eventId);

      if (!room) {
        return reply.send({
          connectedCount: 0,
          participantCount: 0,
          lastUpdate: null,
        });
      }

      return reply.send({
        connectedCount: room.spectatorCount,
        participantCount: room.athletes.size,
        lastUpdate: null,
      });
    }
  );
}
