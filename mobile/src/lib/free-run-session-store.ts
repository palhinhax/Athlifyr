// ============================================================================
// Athlifyr Mobile — Free Run Session Store (Zustand)
//
// Global in-memory store for the active free-run session.
// Survives navigation between screens so the user can leave the run screen
// and come back without losing tracking data.
// ============================================================================

import { create } from "zustand";
import type { FreeRunGPSPoint } from "./free-run-store";
import type { FreeRunStats } from "../hooks/useFreeRun";

// ─── Types ──────────────────────────────────────────────────────────────────

export interface FreeRunSession {
  /** Whether a run is currently being recorded */
  isActive: boolean;
  /** Whether the run has finished (stopped but not yet cleared) */
  isFinished: boolean;
  /** Activity ID after saving (null while recording) */
  savedActivityId: string | null;
  /** GPS permission status */
  gpsPermission: "undetermined" | "granted" | "denied";
  /** Current position from GPS */
  currentPosition: FreeRunGPSPoint | null;
  /** Live stats */
  stats: FreeRunStats;
  /** Recorded GPS track points */
  track: FreeRunGPSPoint[];
  /** Run start timestamp */
  startTime: number | null;

  // ── Mutable refs stored in the store for cross-screen access ──
  /** Last GPS point for delta calculations */
  lastPoint: FreeRunGPSPoint | null;
  elevationGain: number;
  elevationLoss: number;
  totalDistance: number;
  maxSpeed: number;

  // ── Reference to elapsed timer ──
  elapsedTimer: ReturnType<typeof setInterval> | null;
}

const initialStats: FreeRunStats = {
  distanceM: 0,
  avgPaceMinKm: null,
  currentSpeedKmh: null,
  maxSpeedKmh: 0,
  elevationGainM: 0,
  elevationLossM: 0,
  currentAltitudeM: null,
  elapsedTimeMs: 0,
};

const initialState: Omit<FreeRunSession, keyof FreeRunSessionActions> = {
  isActive: false,
  isFinished: false,
  savedActivityId: null,
  gpsPermission: "undetermined",
  currentPosition: null,
  stats: { ...initialStats },
  track: [],
  startTime: null,
  lastPoint: null,
  elevationGain: 0,
  elevationLoss: 0,
  totalDistance: 0,
  maxSpeed: 0,
  elapsedTimer: null,
};

interface FreeRunSessionActions {
  /** Update partial session state */
  update: (partial: Partial<FreeRunSession>) => void;
  /** Add a GPS point and recompute stats */
  addPoint: (point: FreeRunGPSPoint) => void;
  /** Tick elapsed time */
  tickElapsed: () => void;
  /** Reset the session for a new run */
  reset: () => void;
}

// ─── Haversine ──────────────────────────────────────────────────────────────

const TELEPORT_THRESHOLD_M = 500;

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

// ─── Store ──────────────────────────────────────────────────────────────────

export const useFreeRunSession = create<FreeRunSession & FreeRunSessionActions>(
  (set, get) => ({
    ...initialState,

    update: (partial) => set(partial),

    addPoint: (point) => {
      const state = get();
      const prev = state.lastPoint;

      let elevGain = state.elevationGain;
      let elevLoss = state.elevationLoss;
      let totalDist = state.totalDistance;
      let maxSpd = state.maxSpeed;

      // Elevation tracking
      if (prev && point.altitude != null && prev.altitude != null) {
        const diff = point.altitude - prev.altitude;
        if (diff > 0) elevGain += diff;
        else elevLoss += Math.abs(diff);
      }

      // Distance tracking (skip teleportation)
      if (prev) {
        const d = haversineM(prev.lat, prev.lng, point.lat, point.lng);
        if (d < TELEPORT_THRESHOLD_M) totalDist += d;
      }

      // Max speed
      if (point.speed != null) {
        const speedKmh = point.speed * 3.6;
        if (speedKmh > maxSpd && speedKmh < 100) maxSpd = speedKmh;
      }

      // Compute live stats
      const elapsedMs = state.startTime ? Date.now() - state.startTime : 0;
      const distKm = totalDist / 1000;
      const elapsedMin = elapsedMs / 60_000;
      const avgPace =
        distKm > 0.1 && elapsedMin > 0 ? elapsedMin / distKm : null;

      const newTrack = [...state.track, point];

      set({
        currentPosition: point,
        lastPoint: point,
        track: newTrack,
        elevationGain: elevGain,
        elevationLoss: elevLoss,
        totalDistance: totalDist,
        maxSpeed: maxSpd,
        stats: {
          distanceM: totalDist,
          elevationGainM: Math.round(elevGain),
          elevationLossM: Math.round(elevLoss),
          currentAltitudeM:
            point.altitude != null ? Math.round(point.altitude) : null,
          currentSpeedKmh:
            point.speed != null
              ? Math.round(point.speed * 3.6 * 10) / 10
              : null,
          maxSpeedKmh: Math.round(maxSpd * 10) / 10,
          avgPaceMinKm: avgPace ? Math.round(avgPace * 100) / 100 : null,
          elapsedTimeMs: elapsedMs,
        },
      });
    },

    tickElapsed: () => {
      const { startTime } = get();
      if (!startTime) return;
      set((prev) => ({
        stats: {
          ...prev.stats,
          elapsedTimeMs: Date.now() - startTime,
        },
      }));
    },

    reset: () => {
      const state = get();
      // Clean up timer
      if (state.elapsedTimer) clearInterval(state.elapsedTimer);
      set({ ...initialState });
    },
  })
);
