// ============================================================================
// Athlifyr Live Server — LiveRace Socket.io Handlers
//
// Handles athlete join/leave, GPS streaming, spectator join/leave.
// All state management is delegated to liverace.service.
// ============================================================================

import type { Server, Socket } from "socket.io";
import type {
  ServerToClientEvents,
  ClientToServerEvents,
  InterServerEvents,
  SocketData,
} from "../../types/index.js";
import {
  startEvent,
  joinAthlete,
  leaveAthlete,
  joinSpectator,
  leaveSpectator,
  processGpsUpdate,
  processGpsBatch,
  getSnapshot,
  eventRoom,
  getScheduledVariantStartTimes,
  getSpectatorFriends,
  clearSpectatorFriendsCache,
  filterLeaderboardForViewer,
  filterPositionsForViewer,
} from "./liverace.service.js";
import type { GPSPoint } from "./liverace.types.js";

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

/** Track which live race events each socket has joined */
const socketEventRoles = new Map<
  string,
  { eventId: string; role: "athlete" | "spectator" }
>();

/**
 * Validate a client-supplied GPS point.
 *
 * Without this guard, NaN, Infinity, or out-of-range values flow into the
 * route engine's haversine / projection math and produce NaN distances that
 * propagate through the whole leaderboard (poisoning ranking state).
 */
function isValidGpsPoint(p: {
  lat: unknown;
  lng: unknown;
  timestamp?: unknown;
  accuracy?: unknown;
  speed?: unknown;
  altitude?: unknown;
}): p is {
  lat: number;
  lng: number;
  timestamp?: number;
  accuracy?: number;
  speed?: number;
  altitude?: number;
} {
  if (typeof p.lat !== "number" || typeof p.lng !== "number") return false;
  if (!Number.isFinite(p.lat) || !Number.isFinite(p.lng)) return false;
  if (p.lat < -90 || p.lat > 90) return false;
  if (p.lng < -180 || p.lng > 180) return false;
  if (p.timestamp !== undefined) {
    if (typeof p.timestamp !== "number" || !Number.isFinite(p.timestamp))
      return false;
  }
  // accuracy/speed/altitude are advisory and not used directly in geometry,
  // but we still reject non-finite numbers to keep downstream code simple.
  for (const k of ["accuracy", "speed", "altitude"] as const) {
    const v = p[k];
    if (v !== undefined && (typeof v !== "number" || !Number.isFinite(v))) {
      return false;
    }
  }
  return true;
}

/** Register all LiveRace event handlers for a connected socket */
export function registerLiveRaceHandlers(
  io: LiveServer,
  socket: LiveSocket
): void {
  const { userId, userName } = socket.data;

  // ─── Join as Athlete ───────────────────────────────────────────────────

  socket.on("liverace:join_athlete", async ({ eventId }) => {
    try {
      // Ensure room exists (idempotent start)
      const { room } = await startEvent(eventId, io);

      // Join the athlete
      const result = await joinAthlete(eventId, userId, socket.id, io);

      if (!result.success) {
        socket.emit("liverace:error", {
          message: result.error || "Failed to join as athlete",
          code: "JOIN_FAILED",
        });
        return;
      }

      // Join the Socket.io rooms
      socket.join(eventRoom(eventId));
      socket.join(`${eventRoom(eventId)}:athletes`);

      // Track this socket's role
      socketEventRoles.set(socket.id, { eventId, role: "athlete" });

      // Send confirmation + initial snapshot
      socket.emit("liverace:joined", {
        eventId,
        status: room.status,
        role: "athlete",
        serverTime: Date.now(),
        variantStartTimes: getScheduledVariantStartTimes(room),
      });

      // Send current snapshot to the newly joined athlete — with visibility
      // filtering applied. An athlete is NOT an event organizer, so they must
      // go through the same filter as a spectator. The athlete always sees
      // themselves regardless of their own visibility setting.
      const snapshot = getSnapshot(eventId);
      if (snapshot) {
        const athleteFriends = await getSpectatorFriends(userId);
        const filteredLeaderboard = filterLeaderboardForViewer(
          snapshot.leaderboard,
          userId,
          athleteFriends,
          false
        );
        const filteredPositions = filterPositionsForViewer(
          snapshot.athletes,
          userId,
          athleteFriends,
          false
        );
        socket.emit("liverace:leaderboard", {
          eventId,
          entries: filteredLeaderboard,
          timestamp: Date.now(),
        });
        socket.emit("liverace:positions", {
          eventId,
          athletes: filteredPositions,
        });
      }

      console.log(
        `[LiveRace] Athlete ${userName || userId} joined event ${eventId} via socket ${socket.id}`
      );
    } catch (err) {
      console.error("[LiveRace] Error joining as athlete:", err);
      socket.emit("liverace:error", {
        message: "Failed to join race",
        code: "INTERNAL_ERROR",
      });
    }
  });

  // ─── Join as Spectator ─────────────────────────────────────────────────

  socket.on("liverace:join_spectator", async ({ eventId }) => {
    try {
      // Ensure room exists (idempotent start — spectator-driven lazy activation)
      const { room } = await startEvent(eventId, io);

      // Join the Socket.io room
      socket.join(eventRoom(eventId));

      // Track spectator
      joinSpectator(eventId, io);
      socketEventRoles.set(socket.id, { eventId, role: "spectator" });

      // Send confirmation
      socket.emit("liverace:joined", {
        eventId,
        status: room.status,
        role: "spectator",
        serverTime: Date.now(),
        variantStartTimes: getScheduledVariantStartTimes(room),
      });

      // Pre-fetch spectator's friends for visibility filtering
      const spectatorFriends = await getSpectatorFriends(userId);

      // Send current snapshot (with visibility filtering applied)
      const snapshot = getSnapshot(eventId);
      if (snapshot) {
        const filteredLeaderboard = filterLeaderboardForViewer(
          snapshot.leaderboard,
          userId,
          spectatorFriends,
          false // spectators are not organizers
        );
        const filteredPositions = filterPositionsForViewer(
          snapshot.athletes,
          userId,
          spectatorFriends,
          false
        );

        socket.emit("liverace:leaderboard", {
          eventId,
          entries: filteredLeaderboard,
          timestamp: Date.now(),
        });
        socket.emit("liverace:positions", {
          eventId,
          athletes: filteredPositions,
        });
        socket.emit("liverace:spectator_count", {
          eventId,
          count: snapshot.spectatorCount,
        });
      }

      console.log(
        `[LiveRace] Spectator ${userName || userId || "anonymous"} joined event ${eventId}`
      );
    } catch (err) {
      console.error("[LiveRace] Error joining as spectator:", err);
      socket.emit("liverace:error", {
        message: "Failed to join as spectator",
        code: "INTERNAL_ERROR",
      });
    }
  });

  // ─── Leave Event ───────────────────────────────────────────────────────

  socket.on("liverace:leave", ({ eventId }) => {
    handleLeave(io, socket, eventId);
  });

  // ─── GPS Update (from athletes only) ──────────────────────────────────

  socket.on("liverace:gps_update", ({ eventId, point }) => {
    const role = socketEventRoles.get(socket.id);
    if (!role || role.role !== "athlete" || role.eventId !== eventId) {
      socket.emit("liverace:error", {
        message: "Not joined as athlete for this event",
        code: "NOT_ATHLETE",
      });
      return;
    }

    if (!isValidGpsPoint(point)) {
      socket.emit("liverace:error", {
        message: "Invalid GPS point",
        code: "INVALID_GPS",
      });
      return;
    }

    const gpsPoint: GPSPoint = {
      lat: point.lat,
      lng: point.lng,
      timestamp: point.timestamp ?? Date.now(),
      accuracy: point.accuracy,
      speed: point.speed,
      altitude: point.altitude,
    };

    processGpsUpdate(eventId, userId, gpsPoint, io);
  });

  // ─── GPS Batch (offline sync from athletes) ────────────────────────────

  socket.on("liverace:gps_batch", async ({ eventId, points }) => {
    const role = socketEventRoles.get(socket.id);
    if (!role || role.role !== "athlete" || role.eventId !== eventId) {
      socket.emit("liverace:error", {
        message: "Not joined as athlete for this event",
        code: "NOT_ATHLETE",
      });
      return;
    }

    // Drop invalid points from the batch rather than rejecting the whole
    // payload — a single corrupted sample shouldn't force the client to
    // retry a 1000-point backlog.
    const validPoints = points.filter(isValidGpsPoint);
    const droppedCount = points.length - validPoints.length;
    if (droppedCount > 0) {
      console.warn(
        `[LiveRace] gps_batch: dropped ${droppedCount}/${points.length} invalid points from ${userName || userId}`
      );
    }
    if (validPoints.length === 0) {
      socket.emit("liverace:error", {
        message: "Batch contains no valid GPS points",
        code: "INVALID_GPS_BATCH",
      });
      return;
    }

    const gpsPoints: GPSPoint[] = validPoints.map((p) => ({
      lat: p.lat,
      lng: p.lng,
      timestamp: p.timestamp ?? Date.now(),
      accuracy: p.accuracy,
      speed: p.speed,
      altitude: p.altitude,
    }));

    try {
      const startMs = Date.now();
      const result = await processGpsBatch(
        eventId,
        userId,
        gpsPoints,
        io,
        socket
      );
      const durationMs = Date.now() - startMs;

      // Notify the client that the batch has been fully processed so it
      // can unlock the UI and clear syncing state.
      socket.emit("liverace:sync_complete", {
        eventId,
        processed: result.processed,
        skipped: result.skipped,
        newCheckpoints: result.newCheckpoints,
        durationMs,
      });

      console.log(
        `[LiveRace] Batch sync for ${userName || userId}: ${result.processed} processed, ${result.skipped} skipped (${durationMs}ms)`
      );
    } catch (err) {
      console.error("[LiveRace] Error processing GPS batch:", err);
      socket.emit("liverace:error", {
        message: "Failed to process GPS batch",
        code: "BATCH_ERROR",
      });
    }
  });
}

// ─── Handle Disconnect ──────────────────────────────────────────────────────

export function handleLiveRaceDisconnect(
  io: LiveServer,
  socket: LiveSocket
): void {
  const role = socketEventRoles.get(socket.id);
  if (!role) return;

  // Clear spectator friend cache on disconnect
  if (role.role === "spectator") {
    clearSpectatorFriendsCache(socket.data.userId);
  }

  handleLeave(io, socket, role.eventId);
}

// ─── Internal Helpers ───────────────────────────────────────────────────────

function handleLeave(
  io: LiveServer,
  socket: LiveSocket,
  eventId: string
): void {
  const role = socketEventRoles.get(socket.id);
  if (!role || role.eventId !== eventId) return;

  const { userId } = socket.data;

  socket.leave(eventRoom(eventId));
  socket.leave(`${eventRoom(eventId)}:athletes`);

  if (role.role === "athlete") {
    leaveAthlete(eventId, userId, io);
  } else {
    leaveSpectator(eventId, io);
  }

  socketEventRoles.delete(socket.id);
}
