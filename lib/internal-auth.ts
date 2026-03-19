import { NextRequest } from "next/server";
import crypto from "node:crypto";

/**
 * Validate that the request originates from the Live Service.
 *
 * Requires LIVE_INTERNAL_SECRET to be set. Uses timing-safe comparison
 * to prevent timing attacks on the shared secret.
 */
export function isLiveServer(request: NextRequest): boolean {
  const expectedSecret = process.env.LIVE_INTERNAL_SECRET;

  // Secret MUST be configured — fail closed if missing.
  if (!expectedSecret) {
    console.error(
      "[Security] LIVE_INTERNAL_SECRET is not configured. Rejecting internal request."
    );
    return false;
  }

  const liveHeader = request.headers.get("x-live-server");
  if (liveHeader !== "true") return false;

  const secret = request.headers.get("x-live-secret");
  if (!secret) return false;

  // Use timing-safe comparison to prevent timing attacks
  try {
    return crypto.timingSafeEqual(
      Buffer.from(secret),
      Buffer.from(expectedSecret)
    );
  } catch {
    // Buffers of different length throw — treat as mismatch
    return false;
  }
}
