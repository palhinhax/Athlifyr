// ============================================================================
// Athlifyr Mobile — useFreeRun Hook
//
// GPS-only solo run tracking — no live server, no socket.
// Records the GPS track locally and computes stats in real time.
// On stop, persists the activity to AsyncStorage.
// ============================================================================

import { useEffect, useRef, useCallback, useState } from "react";
import { AppState, type AppStateStatus } from "react-native";
import * as Location from "expo-location";
import { activateKeepAwakeAsync, deactivateKeepAwake } from "expo-keep-awake";
import {
  saveActivity,
  type FreeRunGPSPoint,
  type FreeRunActivity,
} from "../lib/free-run-store";
import { api } from "../lib/api";

// ─── Types ──────────────────────────────────────────────────────────────────

export interface FreeRunStats {
  distanceM: number;
  avgPaceMinKm: number | null;
  currentSpeedKmh: number | null;
  maxSpeedKmh: number;
  elevationGainM: number;
  elevationLossM: number;
  currentAltitudeM: number | null;
  elapsedTimeMs: number;
}

export interface FreeRunState {
  gpsPermission: "undetermined" | "granted" | "denied";
  gpsActive: boolean;
  currentPosition: FreeRunGPSPoint | null;
  stats: FreeRunStats;
  finished: boolean;
  savedActivityId: string | null;
}

// ─── Constants ──────────────────────────────────────────────────────────────

const GPS_INTERVAL_MS = 2000;
const GPS_MIN_DISTANCE_M = 5;
const KEEP_AWAKE_TAG = "FREE_RUN_GPS";
const TELEPORT_THRESHOLD_M = 500;

// ─── Haversine ──────────────────────────────────────────────────────────────

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

export function useFreeRun() {
  const [state, setState] = useState<FreeRunState>({
    gpsPermission: "undetermined",
    gpsActive: false,
    currentPosition: null,
    stats: { ...initialStats },
    finished: false,
    savedActivityId: null,
  });

  // Mutable refs (hot path)
  const locationSubRef = useRef<Location.LocationSubscription | null>(null);
  const trackRef = useRef<FreeRunGPSPoint[]>([]);
  const lastPointRef = useRef<FreeRunGPSPoint | null>(null);
  const elevGainRef = useRef(0);
  const elevLossRef = useRef(0);
  const totalDistRef = useRef(0);
  const maxSpeedRef = useRef(0);
  const startTimeRef = useRef<number | null>(null);
  const elapsedTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

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

  // ─── Start GPS ─────────────────────────────────────────────────────

  const startGps = useCallback(async (): Promise<boolean> => {
    const hasPermission = await requestGpsPermission();
    if (!hasPermission) return false;

    try {
      await activateKeepAwakeAsync(KEEP_AWAKE_TAG);
    } catch {
      // non-critical
    }

    try {
      const sub = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.BestForNavigation,
          timeInterval: GPS_INTERVAL_MS,
          distanceInterval: GPS_MIN_DISTANCE_M,
        },
        (location) => {
          const point: FreeRunGPSPoint = {
            lat: location.coords.latitude,
            lng: location.coords.longitude,
            timestamp: location.timestamp,
            accuracy: location.coords.accuracy ?? undefined,
            speed: location.coords.speed ?? undefined,
            altitude: location.coords.altitude ?? undefined,
          };

          // Elevation tracking
          const prev = lastPointRef.current;
          if (prev && point.altitude != null && prev.altitude != null) {
            const diff = point.altitude - prev.altitude;
            if (diff > 0) {
              elevGainRef.current += diff;
            } else {
              elevLossRef.current += Math.abs(diff);
            }
          }

          // Distance tracking (skip teleportation)
          if (prev) {
            const d = haversineM(prev.lat, prev.lng, point.lat, point.lng);
            if (d < TELEPORT_THRESHOLD_M) {
              totalDistRef.current += d;
            }
          }

          // Max speed
          if (point.speed != null) {
            const speedKmh = point.speed * 3.6;
            if (speedKmh > maxSpeedRef.current && speedKmh < 100) {
              maxSpeedRef.current = speedKmh;
            }
          }

          lastPointRef.current = point;
          trackRef.current.push(point);

          // Compute live stats
          const elapsedMs = startTimeRef.current
            ? Date.now() - startTimeRef.current
            : 0;
          const distKm = totalDistRef.current / 1000;
          const elapsedMin = elapsedMs / 60_000;
          const avgPace =
            distKm > 0.1 && elapsedMin > 0 ? elapsedMin / distKm : null;

          setState((prev) => ({
            ...prev,
            currentPosition: point,
            gpsActive: true,
            stats: {
              distanceM: totalDistRef.current,
              elevationGainM: Math.round(elevGainRef.current),
              elevationLossM: Math.round(elevLossRef.current),
              currentAltitudeM:
                point.altitude != null ? Math.round(point.altitude) : null,
              currentSpeedKmh:
                point.speed != null
                  ? Math.round(point.speed * 3.6 * 10) / 10
                  : null,
              maxSpeedKmh: Math.round(maxSpeedRef.current * 10) / 10,
              avgPaceMinKm: avgPace ? Math.round(avgPace * 100) / 100 : null,
              elapsedTimeMs: elapsedMs,
            },
          }));
        }
      );

      locationSubRef.current = sub;
      setState((prev) => ({ ...prev, gpsActive: true }));
      return true;
    } catch (error) {
      console.error("[FreeRun] Failed to start GPS tracking:", error);
      return false;
    }
  }, [requestGpsPermission]);

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

  // ─── Start / Stop Run ───────────────────────────────────────────────

  const startRun = useCallback(async () => {
    // Reset state for a new run
    trackRef.current = [];
    lastPointRef.current = null;
    elevGainRef.current = 0;
    elevLossRef.current = 0;
    totalDistRef.current = 0;
    maxSpeedRef.current = 0;
    startTimeRef.current = Date.now();

    setState((prev) => ({
      ...prev,
      finished: false,
      savedActivityId: null,
      stats: { ...initialStats },
    }));

    const gpsStarted = await startGps();
    if (!gpsStarted) {
      startTimeRef.current = null;
      return;
    }

    // Elapsed timer
    elapsedTimerRef.current = setInterval(() => {
      if (startTimeRef.current) {
        setState((prev) => ({
          ...prev,
          stats: {
            ...prev.stats,
            elapsedTimeMs: Date.now() - startTimeRef.current!,
          },
        }));
      }
    }, 1000);
  }, [startGps]);

  const stopRun = useCallback(async (): Promise<string | null> => {
    stopGps();

    if (elapsedTimerRef.current) {
      clearInterval(elapsedTimerRef.current);
      elapsedTimerRef.current = null;
    }

    const track = trackRef.current;
    const startedAt = startTimeRef.current ?? Date.now();
    const finishedAt = Date.now();
    const durationMs = finishedAt - startedAt;

    // Only save if we have meaningful data (>10m, >10s, >3 points)
    if (track.length < 3 || totalDistRef.current < 10 || durationMs < 10_000) {
      setState((prev) => ({ ...prev, finished: true }));
      return null;
    }

    const distKm = totalDistRef.current / 1000;
    const durationMin = durationMs / 60_000;

    const activity: FreeRunActivity = {
      id: `run-${startedAt}-${Math.random().toString(36).slice(2, 8)}`,
      startedAt,
      finishedAt,
      durationMs,
      distanceM: Math.round(totalDistRef.current),
      avgPaceMinKm:
        distKm > 0.1 ? Math.round((durationMin / distKm) * 100) / 100 : null,
      maxSpeedKmh: Math.round(maxSpeedRef.current * 10) / 10,
      elevationGainM: Math.round(elevGainRef.current),
      elevationLossM: Math.round(elevLossRef.current),
      track,
    };

    await saveActivity(activity);

    // Sync to server (fire & forget — local storage is the source of truth)
    try {
      await api.post("/profile/activities", {
        startedAt: activity.startedAt,
        finishedAt: activity.finishedAt,
        durationMs: activity.durationMs,
        distanceM: activity.distanceM,
        avgPaceMinKm: activity.avgPaceMinKm,
        maxSpeedKmh: activity.maxSpeedKmh,
        elevationGainM: activity.elevationGainM,
        elevationLossM: activity.elevationLossM,
        track: activity.track,
      });
    } catch {
      // Non-critical: activity is saved locally, server sync can be retried
      console.warn("Failed to sync activity to server");
    }

    setState((prev) => ({
      ...prev,
      finished: true,
      savedActivityId: activity.id,
    }));

    return activity.id;
  }, [stopGps]);

  // ─── AppState handling ──────────────────────────────────────────────

  useEffect(() => {
    const handleAppState = (_nextState: AppStateStatus) => {
      // GPS continues in background via expo-location
    };
    const sub = AppState.addEventListener("change", handleAppState);
    return () => sub.remove();
  }, []);

  // ─── Cleanup on unmount ─────────────────────────────────────────────

  useEffect(() => {
    return () => {
      locationSubRef.current?.remove();
      if (elapsedTimerRef.current) clearInterval(elapsedTimerRef.current);
      try {
        deactivateKeepAwake(KEEP_AWAKE_TAG);
      } catch {
        /* noop */
      }
    };
  }, []);

  return {
    ...state,
    startRun,
    stopRun,
    requestGpsPermission,
  };
}
