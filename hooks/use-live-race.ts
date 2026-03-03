// ============================================================================
// useLiveRace — React hook for connecting to the LiveRace WebSocket
//
// Manages connection, event join, and real-time state updates.
// Used by both the live map and leaderboard components.
// ============================================================================

"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { io, type Socket } from "socket.io-client";

// ─── Types (mirrored from live service) ─────────────────────────────────────

export type EventLiveStatus =
  | "SCHEDULED"
  | "CHECK_IN_OPEN"
  | "WARMUP"
  | "LIVE"
  | "PAUSED"
  | "FINISHED"
  | "CANCELLED";

export type AthleteStatus =
  | "ACTIVE"
  | "INACTIVE"
  | "OFF_ROUTE"
  | "FINISHED"
  | "DNF"
  | "DSQ";

export interface AthletePosition {
  userId: string;
  name: string | null;
  bibNumber: string | null;
  lat: number;
  lng: number;
  status: AthleteStatus;
  distanceAlongRouteM: number;
  progressPercent: number;
  rank: number;
  deviationM: number;
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  name: string | null;
  image: string | null;
  bibNumber: string | null;
  variantId: string;
  variantName: string;
  status: AthleteStatus;
  distanceAlongRouteM: number;
  progressPercent: number;
  lastCheckpointOrder: number;
  lastCheckpointName: string | null;
  finishTimeMs: number | null;
  gap: string | null;
}

export interface CheckpointEvent {
  eventId: string;
  userId: string;
  athleteName: string | null;
  checkpoint: {
    checkpointId: string;
    checkpointName: string;
    reachedAt: number;
    splitTimeMs: number;
  };
}

export interface FinishEvent {
  eventId: string;
  userId: string;
  athleteName: string | null;
  rank: number;
  finishTimeMs: number;
}

export interface LiveRaceState {
  connected: boolean;
  status: EventLiveStatus;
  raceStartTime: number | null;
  athletes: AthletePosition[];
  leaderboard: LeaderboardEntry[];
  spectatorCount: number;
  error: string | null;
  recentEvents: (CheckpointEvent | FinishEvent)[];
  /** Number of GPS points queued while offline (athlete only) */
  offlineQueueSize: number;
  /** True while a batch sync is in progress after reconnect */
  syncing: boolean;
  /** Sync progress percentage (0-100) during batch upload */
  syncProgress: number;
  /** Countdown in ms until the earliest variant starts (null if no data or already started) */
  countdownMs: number | null;
  /** Scheduled start times per variant (variantId → unix ms), synced from server */
  scheduledStartTimes: Record<string, number> | null;
  /** Clock offset: server time - client time (ms). Positive = client clock is behind. */
  serverTimeOffset: number;
}

interface UseLiveRaceOptions {
  eventId: string;
  role?: "spectator" | "athlete";
  token?: string;
  /** Auto-connect on mount (default: true) */
  autoConnect?: boolean;
  /** Live service URL (default: from env) */
  liveUrl?: string;
  /** Initial status from DB — used as fallback until WebSocket connects */
  initialStatus?: EventLiveStatus;
}

const MAX_RECENT_EVENTS = 20;
/** Maximum offline buffer size to prevent unbounded memory growth */
const MAX_OFFLINE_BUFFER = 5000;

interface BufferedGpsPoint {
  lat: number;
  lng: number;
  timestamp: number;
  accuracy?: number;
  speed?: number;
  altitude?: number;
}

export function useLiveRace(options: UseLiveRaceOptions): LiveRaceState & {
  connect: () => void;
  disconnect: () => void;
  sendGpsUpdate: (point: {
    lat: number;
    lng: number;
    accuracy?: number;
    speed?: number;
    altitude?: number;
  }) => void;
  /** Number of points currently buffered offline */
  getOfflineQueueSize: () => number;
  /** Manually trigger sync (normally automatic on reconnect) */
  flushOfflineQueue: () => void;
} {
  const {
    eventId,
    role = "spectator",
    token,
    autoConnect = true,
    liveUrl,
    initialStatus = "SCHEDULED",
  } = options;

  const [state, setState] = useState<LiveRaceState>({
    connected: false,
    status: initialStatus,
    raceStartTime: null,
    athletes: [],
    leaderboard: [],
    spectatorCount: 0,
    error: null,
    recentEvents: [],
    offlineQueueSize: 0,
    syncing: false,
    syncProgress: 0,
    countdownMs: null,
    scheduledStartTimes: null,
    serverTimeOffset: 0,
  });

  const socketRef = useRef<Socket | null>(null);
  const reconnectAttempts = useRef(0);
  /** Offline GPS buffer — survives reconnects */
  const offlineBuffer = useRef<BufferedGpsPoint[]>([]);
  /** Whether we've already joined as athlete (avoid double-join on reconnect) */
  const hasJoinedRef = useRef(false);

  /** Flush the offline buffer to the server */
  const flushOfflineQueue = useCallback(() => {
    const socket = socketRef.current;
    if (!socket?.connected || offlineBuffer.current.length === 0) return;
    if (role !== "athlete") return;

    const points = offlineBuffer.current.splice(
      0,
      offlineBuffer.current.length
    );

    setState((prev) => ({
      ...prev,
      syncing: true,
      syncProgress: 0,
      offlineQueueSize: 0,
    }));

    socket.emit("liverace:gps_batch", { eventId, points });
  }, [eventId, role]);

  const connect = useCallback(() => {
    if (socketRef.current?.connected) return;

    const url =
      liveUrl || process.env.NEXT_PUBLIC_LIVE_URL || "http://localhost:4000";

    const socket = io(url, {
      auth: token ? { token } : undefined,
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 10000,
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      setState((prev) => ({ ...prev, connected: true, error: null }));
      reconnectAttempts.current = 0;

      // Join the event room
      if (role === "athlete") {
        socket.emit("liverace:join_athlete", { eventId });
      } else {
        socket.emit("liverace:join_spectator", { eventId });
      }
    });

    socket.on("disconnect", () => {
      setState((prev) => ({ ...prev, connected: false, syncing: false }));
    });

    socket.on("connect_error", (err) => {
      reconnectAttempts.current++;
      setState((prev) => ({
        ...prev,
        connected: false,
        error: `Connection error: ${err.message}`,
      }));
    });

    // ─── LiveRace Events ──────────────────────────────────────────────

    socket.on(
      "liverace:joined",
      ({ status, serverTime, variantStartTimes }) => {
        // Compute clock offset: positive = client clock is behind server
        const offset = serverTime ? serverTime - Date.now() : 0;

        setState((prev) => ({
          ...prev,
          status,
          serverTimeOffset: offset,
          scheduledStartTimes: variantStartTimes ?? null,
        }));
        hasJoinedRef.current = true;

        // Auto-flush offline buffer on (re)join as athlete
        if (role === "athlete" && offlineBuffer.current.length > 0) {
          // Small delay to ensure the server has processed the join
          setTimeout(() => {
            flushOfflineQueue();
          }, 500);
        }
      }
    );

    socket.on("liverace:error", ({ message }) => {
      setState((prev) => ({ ...prev, error: message }));
    });

    socket.on("liverace:status_changed", ({ status, raceStartTime }) => {
      setState((prev) => ({
        ...prev,
        status,
        raceStartTime: raceStartTime ?? prev.raceStartTime,
      }));
    });

    socket.on("liverace:positions", ({ athletes }) => {
      setState((prev) => ({ ...prev, athletes }));
    });

    socket.on("liverace:leaderboard", ({ entries }) => {
      setState((prev) => ({ ...prev, leaderboard: entries }));
    });

    socket.on("liverace:spectator_count", ({ count }) => {
      setState((prev) => ({ ...prev, spectatorCount: count }));
    });

    socket.on("liverace:checkpoint_reached", (data) => {
      setState((prev) => ({
        ...prev,
        recentEvents: [data, ...prev.recentEvents].slice(0, MAX_RECENT_EVENTS),
      }));
    });

    socket.on("liverace:athlete_finished", (data) => {
      setState((prev) => ({
        ...prev,
        recentEvents: [data, ...prev.recentEvents].slice(0, MAX_RECENT_EVENTS),
      }));
    });

    // ─── Offline Sync Events ────────────────────────────────────────────

    socket.on("liverace:sync_progress", ({ processed, total }) => {
      const pct = total > 0 ? Math.round((processed / total) * 100) : 0;
      setState((prev) => ({ ...prev, syncProgress: pct }));
    });

    socket.on("liverace:sync_complete", ({ processed, skipped }) => {
      setState((prev) => ({
        ...prev,
        syncing: false,
        syncProgress: 100,
        error: null,
      }));
      console.log(
        `[LiveRace] Sync complete: ${processed} processed, ${skipped} skipped`
      );
    });
  }, [eventId, role, token, liveUrl, flushOfflineQueue]);

  const disconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.emit("liverace:leave", { eventId });
      socketRef.current.disconnect();
      socketRef.current = null;
      hasJoinedRef.current = false;
      setState((prev) => ({ ...prev, connected: false, syncing: false }));
    }
  }, [eventId]);

  const sendGpsUpdate = useCallback(
    (point: {
      lat: number;
      lng: number;
      accuracy?: number;
      speed?: number;
      altitude?: number;
    }) => {
      if (role !== "athlete") return;

      const timestamped: BufferedGpsPoint = {
        ...point,
        timestamp: Date.now(),
      };

      // If connected, send immediately
      if (socketRef.current?.connected) {
        socketRef.current.emit("liverace:gps_update", {
          eventId,
          point: timestamped,
        });
        return;
      }

      // Offline: buffer the point for later sync
      if (offlineBuffer.current.length < MAX_OFFLINE_BUFFER) {
        offlineBuffer.current.push(timestamped);
        setState((prev) => ({
          ...prev,
          offlineQueueSize: offlineBuffer.current.length,
        }));
      }
      // If buffer is full, drop oldest points to make room
      else {
        offlineBuffer.current.shift();
        offlineBuffer.current.push(timestamped);
        // offlineQueueSize stays at MAX_OFFLINE_BUFFER
      }
    },
    [eventId, role]
  );

  const getOfflineQueueSize = useCallback(
    () => offlineBuffer.current.length,
    []
  );

  // Auto-connect on mount
  useEffect(() => {
    if (autoConnect) {
      connect();
    }
    return () => {
      disconnect();
    };
  }, [autoConnect, connect, disconnect]);

  // ─── Countdown Timer (updates every second during CHECK_IN_OPEN / WARMUP) ─
  useEffect(() => {
    const shouldCountdown =
      state.scheduledStartTimes &&
      (state.status === "CHECK_IN_OPEN" ||
        state.status === "WARMUP" ||
        state.status === "SCHEDULED");

    if (!shouldCountdown) {
      // Clear countdown when race is live or finished
      if (state.countdownMs !== null) {
        setState((prev) => ({ ...prev, countdownMs: null }));
      }
      return;
    }

    const computeCountdown = () => {
      const starts = state.scheduledStartTimes;
      if (!starts) return null;
      const times = Object.values(starts);
      if (times.length === 0) return null;
      // Earliest variant start time
      const earliest = Math.min(...times);
      // Use server time offset for accuracy
      const serverNow = Date.now() + state.serverTimeOffset;
      const remaining = earliest - serverNow;
      return remaining > 0 ? remaining : 0;
    };

    // Update immediately
    setState((prev) => ({ ...prev, countdownMs: computeCountdown() }));

    // Update every second
    const interval = setInterval(() => {
      setState((prev) => ({ ...prev, countdownMs: computeCountdown() }));
    }, 1000);

    return () => clearInterval(interval);
  }, [
    state.scheduledStartTimes,
    state.status,
    state.serverTimeOffset,
    state.countdownMs,
  ]);

  return {
    ...state,
    connect,
    disconnect,
    sendGpsUpdate,
    getOfflineQueueSize,
    flushOfflineQueue,
  };
}
