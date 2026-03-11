// ============================================================================
// Athlifyr Mobile — Background Location Task
//
// Defines an expo-task-manager task that receives GPS updates even when the
// app is backgrounded or the screen is locked.  Points are fed into the
// global Zustand session store so stats stay up to date.
//
// MUST be imported at the top-level of the app (e.g. index.ts or _layout.tsx)
// so the task is registered before the JS bundle finishes loading.
// ============================================================================

import * as TaskManager from "expo-task-manager";
import * as Location from "expo-location";
import i18n from "i18next";
import { useFreeRunSession } from "./free-run-session-store";
import type { FreeRunGPSPoint } from "./free-run-store";

export const BACKGROUND_LOCATION_TASK = "athlifyr-background-location";

// ─── Register the background task ──────────────────────────────────────────

TaskManager.defineTask(BACKGROUND_LOCATION_TASK, async ({ data, error }) => {
  if (error) {
    console.error("[BgLocation] Task error:", error.message);
    return;
  }

  const { locations } = data as { locations: Location.LocationObject[] };
  if (!locations || locations.length === 0) return;

  const store = useFreeRunSession.getState();
  if (!store.isActive) return;

  for (const location of locations) {
    const point: FreeRunGPSPoint = {
      lat: location.coords.latitude,
      lng: location.coords.longitude,
      timestamp: location.timestamp,
      accuracy: location.coords.accuracy ?? undefined,
      speed: location.coords.speed ?? undefined,
      altitude: location.coords.altitude ?? undefined,
    };
    useFreeRunSession.getState().addPoint(point);
  }
});

// ─── Helpers ────────────────────────────────────────────────────────────────

export async function startBackgroundLocation(): Promise<boolean> {
  // Request foreground first
  const { status: fgStatus } =
    await Location.requestForegroundPermissionsAsync();
  if (fgStatus !== "granted") return false;

  // Then request background
  const { status: bgStatus } =
    await Location.requestBackgroundPermissionsAsync();
  if (bgStatus !== "granted") {
    console.warn(
      "[BgLocation] Background permission denied — will use foreground only"
    );
  }

  const hasStarted = await Location.hasStartedLocationUpdatesAsync(
    BACKGROUND_LOCATION_TASK
  );
  if (hasStarted) return true;

  await Location.startLocationUpdatesAsync(BACKGROUND_LOCATION_TASK, {
    accuracy: Location.Accuracy.BestForNavigation,
    timeInterval: 2000,
    distanceInterval: 5,
    deferredUpdatesInterval: 1000,
    showsBackgroundLocationIndicator: true,
    foregroundService: {
      notificationTitle: i18n.t("freeRun.backgroundNotificationTitle"),
      notificationBody: i18n.t("freeRun.backgroundNotificationBody"),
      notificationColor: "#FF6B2B",
      killServiceOnDestroy: false,
    },
  });

  return true;
}

export async function stopBackgroundLocation(): Promise<void> {
  try {
    const hasStarted = await Location.hasStartedLocationUpdatesAsync(
      BACKGROUND_LOCATION_TASK
    );
    if (hasStarted) {
      await Location.stopLocationUpdatesAsync(BACKGROUND_LOCATION_TASK);
    }
  } catch (err) {
    console.warn("[BgLocation] Error stopping:", err);
  }
}
