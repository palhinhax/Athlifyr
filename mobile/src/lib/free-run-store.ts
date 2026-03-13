// ============================================================================
// Athlifyr Mobile — Free Run Activity Storage
//
// Persists solo run activities to AsyncStorage for offline-first recording.
// Each activity stores: GPS track, stats summary, timestamps, and metadata.
// ============================================================================

import AsyncStorage from "@react-native-async-storage/async-storage";

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
