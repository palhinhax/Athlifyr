// ============================================================================
// Athlifyr Mobile — Activity Sync Queue
//
// Stores activities that failed to sync to the server (e.g. user not logged in).
// After login, call flushPendingActivities() to retry all pending uploads.
// ============================================================================

import AsyncStorage from "@react-native-async-storage/async-storage";
import { api } from "./api";

const PENDING_KEY = "pending-activity-sync";

export interface PendingActivity {
  startedAt: number;
  finishedAt: number;
  durationMs: number;
  distanceM: number;
  avgPaceMinKm: number | null;
  maxSpeedKmh: number;
  elevationGainM: number;
  elevationLossM: number;
  track: Array<{
    lat: number;
    lng: number;
    timestamp: number;
    altitude?: number;
    speed?: number;
    accuracy?: number;
  }>;
}

/** Load all pending (unsynced) activities. */
async function loadPending(): Promise<PendingActivity[]> {
  const raw = await AsyncStorage.getItem(PENDING_KEY);
  if (!raw) return [];
  return JSON.parse(raw) as PendingActivity[];
}

/** Persist the pending queue. */
async function savePending(items: PendingActivity[]): Promise<void> {
  await AsyncStorage.setItem(PENDING_KEY, JSON.stringify(items));
}

/** Add an activity to the pending sync queue. */
export async function enqueueActivity(
  activity: PendingActivity
): Promise<void> {
  const pending = await loadPending();
  pending.push(activity);
  await savePending(pending);
  console.log(`📋 Activity queued for sync (${pending.length} pending total)`);
}

/** Get the number of pending activities. */
export async function getPendingCount(): Promise<number> {
  const pending = await loadPending();
  return pending.length;
}

/**
 * Attempt to sync all pending activities to the server.
 * Successfully synced items are removed from the queue.
 * Returns the number of activities synced.
 */
export async function flushPendingActivities(): Promise<number> {
  const pending = await loadPending();
  if (pending.length === 0) return 0;

  console.log(`🔄 Syncing ${pending.length} pending activities...`);

  const stillPending: PendingActivity[] = [];
  let synced = 0;

  for (const activity of pending) {
    try {
      await api.post("/profile/activities", activity);
      synced++;
    } catch {
      // Keep in queue for next attempt
      stillPending.push(activity);
    }
  }

  await savePending(stillPending);

  if (synced > 0) {
    console.log(
      `✅ Synced ${synced} activities (${stillPending.length} still pending)`
    );
  }
  if (stillPending.length > 0) {
    console.warn(`⚠️ ${stillPending.length} activities still pending`);
  }

  return synced;
}
