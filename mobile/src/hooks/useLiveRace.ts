// ============================================================================
// Athlifyr Mobile — useLiveRace Hook
//
// Full athlete-side LiveRace hook for the Expo app.
// - GPS foreground tracking via expo-location
// - Socket.io connection to Live Service
// - Offline buffer with auto-sync on reconnect
// - Computed stats: distance, avg pace, elevation, rank, progress
// ============================================================================

import { useEffect, useRef, useCallback, useState } from "react";
import { AppState, type AppStateStatus } from "react-native";
import * as Location from "expo-location";
import { activateKeepAwakeAsync, deactivateKeepAwake } from "expo-keep-awake";
import { io, type Socket } from "socket.io-client";
import { LIVE_SERVER_URL, fetchLiveToken } from "../lib/live";

// ─── Types ──────────────────────────────────────────────────────────────────

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

export interface GPSPoint {
  lat: number;
  lng: number;
  timestamp: number;
  accuracy?: number;
  speed?: number;
  altitude?: number;
}

export interface CheckpointSplit {
  checkpointId: string;
  checkpointName: string;
  reachedAt: number;
  splitTimeMs: number;
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

export interface RaceStats {
  /** Distance along the route in meters */
  distanceM: number;
  /** Progress along route in percent (0-100) */
  progressPercent: number;
  /** Average pace in min/km (null if not enough data) */
  avgPaceMinKm: number | null;
  /** Current speed in km/h from GPS */
  currentSpeedKmh: number | null;
  /** Total accumulated positive altitude in meters */
  elevationGainM: number;
  /** Total accumulated negative altitude in meters */
  elevationLossM: number;
  /** Current altitude above sea level in meters */
  currentAltitudeM: number | null;
  /** Rank in the race (0 if not ranked yet) */
  rank: number;
  /** Total number of active athletes */
  totalAthletes: number;
  /** Elapsed time since race started in ms */
  elapsedTimeMs: number;
  /** Finish time if finished (ms) */
  finishTimeMs: number | null;
  /** Current athlete status */
  status: AthleteStatus;
  /** Checkpoints reached */
  checkpointsReached: CheckpointSplit[];
  /** Deviation from route in meters */
  deviationM: number;
}

export interface LiveRaceState {
  // Connection
  connected: boolean;
  connecting: boolean;
  /** True while socket.io is actively retrying after an unexpected drop */
  reconnecting: boolean;
  raceStatus: EventLiveStatus;
  raceStartTime: number | null;

  // GPS
  gpsPermission: "undetermined" | "granted" | "denied";
  gpsActive: boolean;
  currentPosition: GPSPoint | null;

  // Offline
  offlineQueueSize: number;
  syncing: boolean;
  syncProgress: { processed: number; total: number } | null;

  // Race data (from server)
  stats: RaceStats;
  leaderboard: LeaderboardEntry[];
  athletes: AthletePosition[];
  spectatorCount: number;

  // Errors
  error: string | null;
}

interface UseLiveRaceOptions {
  eventId: string;
  /** Authenticated user's ID — used to match own entries in leaderboard/events */
  userId?: string;
  /** Auto-start GPS and connect on mount */
  autoStart?: boolean;
}

// ─── Constants ──────────────────────────────────────────────────────────────

const GPS_INTERVAL_MS = 2000;
const GPS_MIN_DISTANCE_M = 5;
const MAX_OFFLINE_BUFFER = 5000;
const KEEP_AWAKE_TAG = "LIVE_RACE_GPS";
/** Refresh the live JWT well before the 2h expiry */
const TOKEN_REFRESH_MS = 5 * 60 * 1000; // 5 minutes

// ─── Haversine for local distance/elevation calc ────────────────────────────

function haversineM(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6_371_000;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// ─── Hook ───────────────────────────────────────────────────────────────────

const initialStats: RaceStats = {
  distanceM: 0,
  progressPercent: 0,
  avgPaceMinKm: null,
  currentSpeedKmh: null,
  elevationGainM: 0,
  elevationLossM: 0,
  currentAltitudeM: null,
  rank: 0,
  totalAthletes: 0,
  elapsedTimeMs: 0,
  finishTimeMs: null,
  status: "ACTIVE",
  checkpointsReached: [],
  deviationM: 0,
};

export function useLiveRace(options: UseLiveRaceOptions) {
  const { eventId, userId, autoStart = false } = options;

  const [state, setState] = useState<LiveRaceState>({
    connected: false,
    connecting: false,
    reconnecting: false,
    raceStatus: "SCHEDULED",
    raceStartTime: null,
    gpsPermission: "undetermined",
    gpsActive: false,
    currentPosition: null,
    offlineQueueSize: 0,
    syncing: false,
    syncProgress: null,
    stats: { ...initialStats },
    leaderboard: [],
    athletes: [],
    spectatorCount: 0,
    error: null,
  });

  // Refs for mutable state (hot path — avoids re-renders)
  const socketRef = useRef<Socket | null>(null);
  const locationSubRef = useRef<Location.LocationSubscription | null>(null);
  const offlineBufferRef = useRef<GPSPoint[]>([]);
  const lastPointRef = useRef<GPSPoint | null>(null);
  const elevGainRef = useRef(0);
  const elevLossRef = useRef(0);
  const totalGpsDistRef = useRef(0);
  const raceStartRef = useRef<number | null>(null);
  const elapsedTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const tokenRefreshTimerRef = useRef<ReturnType<typeof setInterval> | null>(
    null
  );
  /** Server clock offset: server time - client time (ms) */
  const serverTimeOffsetRef = useRef(0);
  const userIdRef = useRef(userId);
  userIdRef.current = userId;

  // ─── GPS Permission ─────────────────────────────────────────────────

  const requestGpsPermission = useCallback(async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    const granted = status === "granted";
    setState((prev) => ({
      ...prev,
      gpsPermission: granted ? "granted" : "denied",
    }));
    return granted;
  }, []);

  // ─── Socket Connection ──────────────────────────────────────────────

  const connectSocket = useCallback(async () => {
    if (socketRef.current?.connected) return;

    setState((prev) => ({ ...prev, connecting: true, error: null }));

    const token = await fetchLiveToken();
    if (!token) {
      setState((prev) => ({
        ...prev,
        connecting: false,
        error: "Failed to get auth token",
      }));
      return;
    }

    const socket = io(LIVE_SERVER_URL, {
      auth: { token },
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 15000,
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      setState((prev) => ({
        ...prev,
        connected: true,
        connecting: false,
        reconnecting: false,
        error: null,
      }));

      // Join as athlete — the server will confirm via liverace:joined,
      // which is where we flush the offline buffer (not here).
      socket.emit("liverace:join_athlete", { eventId });
    });

    socket.on("disconnect", (reason) => {
      const willRetry = reason !== "io client disconnect";
      setState((prev) => ({
        ...prev,
        connected: false,
        reconnecting: willRetry,
      }));
    });

    socket.on("connect_error", (err) => {
      setState((prev) => ({
        ...prev,
        connected: false,
        connecting: false,
        reconnecting: true,
        error: `Connection error: ${err.message}`,
      }));
    });

    // ─── Token Refresh ──────────────────────────────────────────────
    // The live JWT expires after 2h. Refresh well before that so the
    // socket can re-handshake on reconnect with a valid token.
    if (tokenRefreshTimerRef.current) {
      clearInterval(tokenRefreshTimerRef.current);
    }
    tokenRefreshTimerRef.current = setInterval(async () => {
      const newToken = await fetchLiveToken();
      if (newToken && socketRef.current) {
        socketRef.current.auth = { token: newToken };
      }
    }, TOKEN_REFRESH_MS);

    // ─── LiveRace Server Events ─────────────────────────────────────

    socket.on("liverace:joined", (data) => {
      // Capture server clock offset for accurate elapsed-time calculation
      const offset = data.serverTime ? data.serverTime - Date.now() : 0;
      serverTimeOffsetRef.current = offset;

      setState((prev) => ({
        ...prev,
        raceStatus: data.status,
      }));

      // Flush offline buffer *after* the server has acknowledged our join.
      // Flushing on raw `connect` would send the batch before the server
      // knows who we are, causing it to be silently dropped.
      const buffer = offlineBufferRef.current;
      if (buffer.length > 0) {
        setState((prev) => ({
          ...prev,
          syncing: true,
          syncProgress: { processed: 0, total: buffer.length },
        }));
        socket.emit("liverace:gps_batch", {
          eventId,
          points: buffer,
        });
        offlineBufferRef.current = [];
        setState((prev) => ({ ...prev, offlineQueueSize: 0 }));
      }
    });

    socket.on("liverace:error", (data) => {
      setState((prev) => ({ ...prev, error: data.message }));
    });

    socket.on("liverace:status_changed", (data) => {
      setState((prev) => ({
        ...prev,
        raceStatus: data.status,
        raceStartTime: data.raceStartTime ?? prev.raceStartTime,
      }));
      if (data.raceStartTime) {
        raceStartRef.current = data.raceStartTime;
      }
    });

    socket.on("liverace:positions", (data) => {
      setState((prev) => ({ ...prev, athletes: data.athletes }));
    });

    socket.on("liverace:leaderboard", (data) => {
      setState((prev) => {
        // Find own entry to update stats
        const ownEntry = data.entries.find(
          (e) => e.userId === userIdRef.current
        );
        const newStats = { ...prev.stats };
        if (ownEntry) {
          newStats.rank = ownEntry.rank;
          newStats.distanceM = ownEntry.distanceAlongRouteM;
          newStats.progressPercent = ownEntry.progressPercent;
          newStats.status = ownEntry.status;
          newStats.finishTimeMs = ownEntry.finishTimeMs;
          if (ownEntry.lastCheckpointName) {
            newStats.checkpointsReached = prev.stats.checkpointsReached;
          }
        }
        return {
          ...prev,
          leaderboard: data.entries,
          stats: {
            ...newStats,
            totalAthletes: data.entries.length,
          },
        };
      });
    });

    socket.on("liverace:checkpoint_reached", (data) => {
      setState((prev) => {
        // If this is our own checkpoint, add to our stats
        const newCheckpoints =
          data.userId === userIdRef.current
            ? [...prev.stats.checkpointsReached, data.checkpoint]
            : prev.stats.checkpointsReached;
        return {
          ...prev,
          stats: {
            ...prev.stats,
            checkpointsReached: newCheckpoints,
          },
        };
      });
    });

    socket.on("liverace:athlete_finished", (data) => {
      setState((prev) => {
        if (data.userId === userIdRef.current) {
          return {
            ...prev,
            stats: {
              ...prev.stats,
              status: "FINISHED",
              finishTimeMs: data.finishTimeMs,
              rank: data.rank,
            },
          };
        }
        return prev;
      });
    });

    socket.on("liverace:athlete_status", (data) => {
      setState((prev) => {
        if (data.userId === userIdRef.current) {
          return {
            ...prev,
            stats: { ...prev.stats, status: data.status, deviationM: 0 },
          };
        }
        return prev;
      });
    });

    socket.on("liverace:spectator_count", (data) => {
      setState((prev) => ({ ...prev, spectatorCount: data.count }));
    });

    // Sync progress
    socket.on("liverace:sync_progress", (data) => {
      setState((prev) => ({
        ...prev,
        syncProgress: { processed: data.processed, total: data.total },
      }));
    });

    socket.on("liverace:sync_complete", (data) => {
      setState((prev) => ({
        ...prev,
        syncing: false,
        syncProgress: null,
      }));
      console.log(
        `[LiveRace] Sync complete: ${data.processed} points in ${data.durationMs}ms`
      );
    });
  }, [eventId]);

  // ─── GPS Tracking ───────────────────────────────────────────────────

  const startGps = useCallback(async () => {
    const hasPermission = await requestGpsPermission();
    if (!hasPermission) return;

    // Keep the screen awake during the race
    try {
      await activateKeepAwakeAsync(KEEP_AWAKE_TAG);
    } catch {
      // non-critical
    }

    const sub = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.BestForNavigation,
        timeInterval: GPS_INTERVAL_MS,
        distanceInterval: GPS_MIN_DISTANCE_M,
      },
      (location) => {
        const point: GPSPoint = {
          lat: location.coords.latitude,
          lng: location.coords.longitude,
          timestamp: location.timestamp,
          accuracy: location.coords.accuracy ?? undefined,
          speed: location.coords.speed ?? undefined,
          altitude: location.coords.altitude ?? undefined,
        };

        // Local elevation calculation
        const prev = lastPointRef.current;
        if (prev && point.altitude != null && prev.altitude != null) {
          const diff = point.altitude - prev.altitude;
          if (diff > 0) {
            elevGainRef.current += diff;
          } else {
            elevLossRef.current += Math.abs(diff);
          }
        }

        // Local GPS distance
        if (prev) {
          const d = haversineM(prev.lat, prev.lng, point.lat, point.lng);
          if (d < 500) {
            // ignore teleportation > 500m
            totalGpsDistRef.current += d;
          }
        }

        lastPointRef.current = point;

        // Update local state — use server-synced clock for accurate elapsed time
        const serverNow = Date.now() + serverTimeOffsetRef.current;
        const elapsedMs = raceStartRef.current
          ? serverNow - raceStartRef.current
          : 0;
        setState((prev) => {
          // Compute pace from the server's route-snapped distance (prev.stats.distanceM)
          // when available, else fall back to local GPS distance. This keeps pace
          // consistent with the distance shown in the HUD.
          const bestDistM =
            prev.stats.distanceM > 0
              ? prev.stats.distanceM
              : totalGpsDistRef.current;
          const distKm = bestDistM / 1000;
          const elapsedMin = elapsedMs / 60_000;
          const avgPace =
            distKm > 0.1 && elapsedMin > 0 ? elapsedMin / distKm : null;

          return {
            ...prev,
            currentPosition: point,
            gpsActive: true,
            stats: {
              ...prev.stats,
              elevationGainM: Math.round(elevGainRef.current),
              elevationLossM: Math.round(elevLossRef.current),
              currentAltitudeM:
                point.altitude != null ? Math.round(point.altitude) : null,
              currentSpeedKmh:
                point.speed != null
                  ? Math.round(point.speed * 3.6 * 10) / 10
                  : null,
              avgPaceMinKm: avgPace ? Math.round(avgPace * 100) / 100 : null,
              elapsedTimeMs: elapsedMs,
            },
          };
        });

        // Send to server or buffer offline
        const socket = socketRef.current;
        if (socket?.connected) {
          socket.emit("liverace:gps_update", {
            eventId,
            point: {
              lat: point.lat,
              lng: point.lng,
              accuracy: point.accuracy,
              speed: point.speed,
              altitude: point.altitude,
              timestamp: point.timestamp,
            },
          });
        } else {
          // Buffer for offline sync — FIFO: drop oldest when full so the
          // most recent (most valuable for route reconstruction) are kept.
          if (offlineBufferRef.current.length >= MAX_OFFLINE_BUFFER) {
            offlineBufferRef.current.shift();
          }
          offlineBufferRef.current.push(point);
          setState((prev) => ({
            ...prev,
            offlineQueueSize: offlineBufferRef.current.length,
          }));
        }
      }
    );

    locationSubRef.current = sub;
    setState((prev) => ({ ...prev, gpsActive: true }));
  }, [eventId, requestGpsPermission]);

  const stopGps = useCallback(() => {
    locationSubRef.current?.remove();
    locationSubRef.current = null;
    try {
      deactivateKeepAwake(KEEP_AWAKE_TAG);
    } catch {
      // non-critical
    }
    setState((prev) => ({ ...prev, gpsActive: false }));
  }, []);

  // ─── Start / Stop Race ──────────────────────────────────────────────

  const startRace = useCallback(async () => {
    // 1. Request GPS permission
    const permission = await requestGpsPermission();
    if (!permission) return;

    // 2. Connect socket
    await connectSocket();

    // 3. Start GPS tracking
    await startGps();

    // 4. Start elapsed timer
    elapsedTimerRef.current = setInterval(() => {
      if (raceStartRef.current) {
        setState((prev) => ({
          ...prev,
          stats: {
            ...prev.stats,
            elapsedTimeMs:
              Date.now() + serverTimeOffsetRef.current - raceStartRef.current!,
          },
        }));
      }
    }, 1000);
  }, [requestGpsPermission, connectSocket, startGps]);

  const stopRace = useCallback(() => {
    // Stop GPS
    stopGps();

    // Clear timers
    if (elapsedTimerRef.current) {
      clearInterval(elapsedTimerRef.current);
      elapsedTimerRef.current = null;
    }
    if (tokenRefreshTimerRef.current) {
      clearInterval(tokenRefreshTimerRef.current);
      tokenRefreshTimerRef.current = null;
    }

    // Flush remaining buffer
    const socket = socketRef.current;
    const buffer = offlineBufferRef.current;
    if (socket?.connected && buffer.length > 0) {
      socket.emit("liverace:gps_batch", {
        eventId,
        points: buffer,
      });
      offlineBufferRef.current = [];
    }

    // Disconnect socket
    socket?.emit("liverace:leave", { eventId });
    socket?.disconnect();
    socketRef.current = null;

    setState((prev) => ({
      ...prev,
      connected: false,
      gpsActive: false,
      offlineQueueSize: 0,
    }));
  }, [eventId, stopGps]);

  // ─── Auto-start ─────────────────────────────────────────────────────

  useEffect(() => {
    if (autoStart) {
      startRace();
    }
    return () => {
      // Cleanup on unmount — keep GPS+socket if navigating away temporarily
    };
  }, [autoStart, startRace]);

  // ─── AppState handling (background/foreground) ──────────────────────

  useEffect(() => {
    const handleAppState = (nextState: AppStateStatus) => {
      if (nextState === "active") {
        // Returning to foreground — re-establish socket if needed.
        // Clear a stale (disconnected) socket ref first so
        // connectSocket() doesn't bail on the `.connected` guard.
        if (state.gpsActive && !socketRef.current?.connected) {
          if (socketRef.current) {
            socketRef.current.disconnect();
            socketRef.current = null;
          }
          connectSocket();
        }
      }
    };

    const sub = AppState.addEventListener("change", handleAppState);
    return () => sub.remove();
  }, [state.gpsActive, connectSocket]);

  // ─── Cleanup on unmount ─────────────────────────────────────────────

  useEffect(() => {
    return () => {
      locationSubRef.current?.remove();
      socketRef.current?.disconnect();
      if (elapsedTimerRef.current) clearInterval(elapsedTimerRef.current);
      if (tokenRefreshTimerRef.current)
        clearInterval(tokenRefreshTimerRef.current);
      try {
        deactivateKeepAwake(KEEP_AWAKE_TAG);
      } catch {
        /* noop */
      }
    };
  }, []);

  return {
    ...state,
    startRace,
    stopRace,
    startGps,
    stopGps,
    requestGpsPermission,
  };
}
