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
      });

      // Send current snapshot to the newly joined athlete
      const snapshot = getSnapshot(eventId);
      if (snapshot) {
        socket.emit("liverace:leaderboard", {
          eventId,
          entries: snapshot.leaderboard,
          timestamp: Date.now(),
        });
        socket.emit("liverace:positions", {
          eventId,
          athletes: snapshot.athletes,
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
      });

      // Send current snapshot
      const snapshot = getSnapshot(eventId);
      if (snapshot) {
        socket.emit("liverace:leaderboard", {
          eventId,
          entries: snapshot.leaderboard,
          timestamp: Date.now(),
        });
        socket.emit("liverace:positions", {
          eventId,
          athletes: snapshot.athletes,
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

    const gpsPoints: GPSPoint[] = points.map((p) => ({
      lat: p.lat,
      lng: p.lng,
      timestamp: p.timestamp ?? Date.now(),
      accuracy: p.accuracy,
      speed: p.speed,
      altitude: p.altitude,
    }));

    try {
      const result = await processGpsBatch(
        eventId,
        userId,
        gpsPoints,
        io,
        socket
      );
      console.log(
        `[LiveRace] Batch sync for ${userName || userId}: ${result.processed} processed, ${result.skipped} skipped`
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
