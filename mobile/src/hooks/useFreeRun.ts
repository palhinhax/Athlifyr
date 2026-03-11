// ============================================================================
// Athlifyr Mobile — useFreeRun Hook
//
// GPS-only solo run tracking — no live server, no socket.
// Records the GPS track locally and computes stats in real time.
// On stop, persists the activity to AsyncStorage.
//
// State lives in a global Zustand store (free-run-session-store) so the run
// survives navigation between screens and continues in background.
// ============================================================================

import { useEffect, useCallback } from "react";
import { activateKeepAwakeAsync, deactivateKeepAwake } from "expo-keep-awake";
import * as Location from "expo-location";
import {
  saveActivity,
  type FreeRunGPSPoint,
  type FreeRunActivity,
} from "../lib/free-run-store";
import { useFreeRunSession } from "../lib/free-run-session-store";
import {
  startBackgroundLocation,
  stopBackgroundLocation,
} from "../lib/background-location";
import { api } from "../lib/api";

// ─── Types (re-exported for consumers) ──────────────────────────────────────

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

const KEEP_AWAKE_TAG = "FREE_RUN_GPS";

// ─── Hook ───────────────────────────────────────────────────────────────────

export function useFreeRun() {
  const session = useFreeRunSession();

  // ─── GPS Permission ─────────────────────────────────────────────────

  const requestGpsPermission = useCallback(async () => {
    const { status: fgStatus } =
      await Location.requestForegroundPermissionsAsync();
    if (fgStatus !== "granted") {
      useFreeRunSession.getState().update({ gpsPermission: "denied" });
      return false;
    }
    // Also request background permission (needed for screen-off tracking)
    const { status: bgStatus } =
      await Location.requestBackgroundPermissionsAsync();
    useFreeRunSession.getState().update({
      gpsPermission:
        bgStatus === "granted" || fgStatus === "granted" ? "granted" : "denied",
    });
    return fgStatus === "granted";
  }, []);

  // ─── Start / Stop GPS (background-capable) ─────────────────────────

  const startGps = useCallback(async (): Promise<boolean> => {
    const hasPermission = await requestGpsPermission();
    if (!hasPermission) return false;

    await activateKeepAwakeAsync(KEEP_AWAKE_TAG).catch(() => {});

    const started = await startBackgroundLocation();
    if (started) {
      useFreeRunSession.getState().update({ isActive: true });
    }
    return started;
  }, [requestGpsPermission]);

  const stopGps = useCallback(async () => {
    await stopBackgroundLocation();
    deactivateKeepAwake(KEEP_AWAKE_TAG);
    useFreeRunSession.getState().update({ isActive: false });
  }, []);

  // ─── Start / Stop Run ───────────────────────────────────────────────

  const startRun = useCallback(async () => {
    // Reset session for a new run
    useFreeRunSession.getState().reset();
    const now = Date.now();
    useFreeRunSession.getState().update({ startTime: now });

    const gpsStarted = await startGps();
    if (!gpsStarted) {
      useFreeRunSession.getState().update({ startTime: null });
      return;
    }

    // Elapsed timer
    const timer = setInterval(() => {
      useFreeRunSession.getState().tickElapsed();
    }, 1000);
    useFreeRunSession.getState().update({ elapsedTimer: timer });
  }, [startGps]);

  const stopRun = useCallback(async (): Promise<string | null> => {
    await stopGps();

    const state = useFreeRunSession.getState();
    if (state.elapsedTimer) {
      clearInterval(state.elapsedTimer);
      useFreeRunSession.getState().update({ elapsedTimer: null });
    }

    const track = state.track;
    const startedAt = state.startTime ?? Date.now();
    const finishedAt = Date.now();
    const durationMs = finishedAt - startedAt;

    // Only save if we have meaningful data (>10m, >10s, >3 points)
    if (track.length < 3 || state.totalDistance < 10 || durationMs < 10_000) {
      useFreeRunSession
        .getState()
        .update({ isFinished: true, isActive: false });
      return null;
    }

    const distKm = state.totalDistance / 1000;
    const durationMin = durationMs / 60_000;

    const activity: FreeRunActivity = {
      id: `run-${startedAt}-${Math.random().toString(36).slice(2, 8)}`,
      startedAt,
      finishedAt,
      durationMs,
      distanceM: Math.round(state.totalDistance),
      avgPaceMinKm:
        distKm > 0.1 ? Math.round((durationMin / distKm) * 100) / 100 : null,
      maxSpeedKmh: Math.round(state.maxSpeed * 10) / 10,
      elevationGainM: Math.round(state.elevationGain),
      elevationLossM: Math.round(state.elevationLoss),
      track,
    };

    await saveActivity(activity);

    // Sync to server (fire & forget)
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
      console.warn("Failed to sync activity to server");
    }

    useFreeRunSession.getState().update({
      isFinished: true,
      isActive: false,
      savedActivityId: activity.id,
    });

    return activity.id;
  }, [stopGps]);

  // ─── No cleanup on unmount — GPS persists in the global store ───────

  // Only clean up when the component that OWNS the run unmounts and there's
  // no active run. The store owns the lifecycle now.
  useEffect(() => {
    return () => {
      // Don't clean up if a run is still active — it should keep going
    };
  }, []);

  return {
    gpsPermission: session.gpsPermission,
    gpsActive: session.isActive,
    currentPosition: session.currentPosition,
    stats: session.stats,
    finished: session.isFinished,
    savedActivityId: session.savedActivityId,
    trackPoints: session.track.map((p) => [p.lat, p.lng] as [number, number]),
    startRun,
    stopRun,
    requestGpsPermission,
  };
}
