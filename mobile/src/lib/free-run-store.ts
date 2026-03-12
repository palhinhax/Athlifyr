// ============================================================================
// Athlifyr Mobile — Free Run Activity Storage
//
// Persists solo run activities to AsyncStorage for offline-first recording.
// Each activity stores: GPS track, stats summary, timestamps, and metadata.
// ============================================================================

import AsyncStorage from "@react-native-async-storage/async-storage";
import { api } from "./api";
import { enqueueActivity } from "./activity-sync-queue";

const ACTIVITIES_KEY = "free-run-activities";
const MAX_STORED_ACTIVITIES = 100;

// ─── Types ──────────────────────────────────────────────────────────────────

export interface FreeRunGPSPoint {
  lat: number;
  lng: number;
  timestamp: number;
  altitude?: number;
  speed?: number;
  accuracy?: number;
}

export type PerceivedEffort = 1 | 2 | 3 | 4 | 5;
export type ActivityVisibility = "everyone" | "only_me";

export interface FreeRunActivity {
  id: string;
  startedAt: number;
  finishedAt: number;
  durationMs: number;
  distanceM: number;
  avgPaceMinKm: number | null;
  maxSpeedKmh: number;
  elevationGainM: number;
  elevationLossM: number;
  track: FreeRunGPSPoint[];
  // Metadata (editable via save screen)
  title?: string;
  description?: string;
  perceivedEffort?: PerceivedEffort;
  photos?: string[];
  visibility?: ActivityVisibility;
  muted?: boolean;
}

// ─── Storage API ────────────────────────────────────────────────────────────

export async function loadActivities(): Promise<FreeRunActivity[]> {
  const raw = await AsyncStorage.getItem(ACTIVITIES_KEY);
  if (!raw) return [];
  return JSON.parse(raw) as FreeRunActivity[];
}

export async function saveActivity(activity: FreeRunActivity): Promise<void> {
  const existing = await loadActivities();
  existing.unshift(activity);
  // Keep only the most recent activities
  const trimmed = existing.slice(0, MAX_STORED_ACTIVITIES);
  await AsyncStorage.setItem(ACTIVITIES_KEY, JSON.stringify(trimmed));
}

export async function deleteActivity(activityId: string): Promise<void> {
  const existing = await loadActivities();
  const filtered = existing.filter((a) => a.id !== activityId);
  await AsyncStorage.setItem(ACTIVITIES_KEY, JSON.stringify(filtered));
}

export async function getActivity(
  activityId: string
): Promise<FreeRunActivity | null> {
  const activities = await loadActivities();
  return activities.find((a) => a.id === activityId) ?? null;
}

export async function updateActivity(
  activityId: string,
  updates: Partial<Omit<FreeRunActivity, "id">>
): Promise<FreeRunActivity | null> {
  const activities = await loadActivities();
  const idx = activities.findIndex((a) => a.id === activityId);
  if (idx === -1) return null;
  activities[idx] = { ...activities[idx], ...updates };
  await AsyncStorage.setItem(ACTIVITIES_KEY, JSON.stringify(activities));
  return activities[idx];
}

/**
 * Export the track as a GPX XML string.
 */
export function exportGPX(activity: FreeRunActivity): string {
  const points = activity.track
    .map((pt) => {
      const ele =
        pt.altitude != null ? `    <ele>${pt.altitude.toFixed(1)}</ele>\n` : "";
      const time = `    <time>${new Date(pt.timestamp).toISOString()}</time>\n`;
      return `   <trkpt lat="${pt.lat}" lon="${pt.lng}">\n${ele}${time}   </trkpt>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="Athlifyr"
  xmlns="http://www.topografix.com/GPX/1/1">
  <trk>
    <name>Free Run - ${new Date(activity.startedAt).toISOString()}</name>
    <trkseg>
${points}
    </trkseg>
  </trk>
</gpx>`;
}

/**
 * Sync a saved activity (with metadata) to the server.
 * Queues for retry if the network request fails.
 */
export async function syncActivityToServer(
  activity: FreeRunActivity
): Promise<void> {
  const syncPayload = {
    startedAt: activity.startedAt,
    finishedAt: activity.finishedAt,
    durationMs: activity.durationMs,
    distanceM: activity.distanceM,
    avgPaceMinKm: activity.avgPaceMinKm,
    maxSpeedKmh: activity.maxSpeedKmh,
    elevationGainM: activity.elevationGainM,
    elevationLossM: activity.elevationLossM,
    track: activity.track,
    title: activity.title,
    description: activity.description,
    perceivedEffort: activity.perceivedEffort,
    visibility: activity.visibility,
    muted: activity.muted,
  };
  try {
    await api.post("/profile/activities", syncPayload);
  } catch {
    console.warn("Failed to sync activity — queued for retry after login");
    await enqueueActivity(syncPayload);
  }
}
