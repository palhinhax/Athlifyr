// ============================================================================
// Athlifyr Live Server — LiveRace API Client (Next.js Internal Endpoints)
// ============================================================================

import { config } from "../../config.js";
import type { LiveConfig } from "./liverace.types.js";

class LiveApiError extends Error {
  statusCode: number;
  constructor(statusCode: number, message: string) {
    super(message);
    this.name = "LiveApiError";
    this.statusCode = statusCode;
  }
}

/** Headers for internal calls to Next.js */
function internalHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "X-Live-Server": "true",
  };
  const secret = process.env.LIVE_INTERNAL_SECRET;
  if (secret) {
    headers["X-Live-Secret"] = secret;
  }
  return headers;
}

/** Make a request to the Next.js internal API */
async function internalRequest<T>(
  path: string,
  options: { method?: string; body?: Record<string, unknown> } = {}
): Promise<T> {
  const { method = "GET", body } = options;
  const url = `${config.nextApiUrl}${path}`;

  const res = await fetch(url, {
    method,
    headers: internalHeaders(),
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const errBody = await res.json().catch(() => ({ error: res.statusText }));
    throw new LiveApiError(
      res.status,
      (errBody as { error?: string }).error || "Internal API call failed"
    );
  }

  return res.json() as Promise<T>;
}

// ─── Public API Methods ─────────────────────────────────────────────────────

/** Fetch live config for an event (route, checkpoints, settings) */
export async function fetchLiveConfig(eventId: string): Promise<LiveConfig> {
  return internalRequest<LiveConfig>(
    `/api/internal/live-config?eventId=${encodeURIComponent(eventId)}`
  );
}

/** Update event live status in the database */
export async function updateLiveStatus(
  eventId: string,
  status: string
): Promise<{ success: boolean }> {
  return internalRequest<{ success: boolean }>("/api/internal/live-status", {
    method: "POST",
    body: { eventId, status },
  });
}

/** Persist race results */
export async function persistResults(
  eventId: string,
  results: {
    userId: string;
    variantId: string;
    rank: number;
    finishTimeMs: number;
    status: "FINISHED" | "DNF" | "DSQ";
  }[]
): Promise<{ success: boolean; persisted: number }> {
  return internalRequest<{ success: boolean; persisted: number }>(
    "/api/internal/live-results",
    {
      method: "POST",
      body: { eventId, results },
    }
  );
}

/** Verify athlete registration */
export async function verifyAthlete(
  userId: string,
  eventId: string
): Promise<{
  verified: boolean;
  athlete?: {
    userId: string;
    name: string | null;
    image: string | null;
    variantId: string;
    variantName: string | null;
    bibNumber: string | null;
    liveRaceVisibility: "PUBLIC" | "FRIENDS" | "ORGANIZER_ONLY";
  };
  reason?: string;
}> {
  return internalRequest("/api/internal/live-auth/verify", {
    method: "POST",
    body: { userId, eventId },
  });
}

/** Fetch accepted friend IDs for a user (used for FRIENDS visibility filtering) */
export async function fetchFriendIds(
  userId: string
): Promise<{ friendIds: string[] }> {
  return internalRequest<{ friendIds: string[] }>(
    "/api/internal/live-friends",
    {
      method: "POST",
      body: { userId },
    }
  );
}

export { LiveApiError };
