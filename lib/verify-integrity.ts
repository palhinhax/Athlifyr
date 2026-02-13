import { NextRequest } from "next/server";
import { decodeIntegrityToken } from "@/lib/play-integrity";

const NONCE_TTL_MS = 60_000; // 60 seconds

// In-memory nonce store to prevent replay attacks.
// In a multi-instance deployment, replace with Redis or similar.
const usedNonces = new Map<string, number>();

// Cleanup expired nonces every 5 minutes
const CLEANUP_INTERVAL_MS = 5 * 60 * 1000;
let lastCleanup = Date.now();

function cleanupNonces() {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL_MS) return;
  lastCleanup = now;

  for (const [nonce, timestamp] of usedNonces.entries()) {
    if (now - timestamp > NONCE_TTL_MS * 2) {
      usedNonces.delete(nonce);
    }
  }
}

export interface IntegrityResult {
  ok: boolean;
  reason?: string;
}

/**
 * Verify Play Integrity token from an incoming request.
 *
 * Reads the `x-app-integrity` header, decodes the token with Google,
 * and validates the verdict against minimum security rules.
 *
 * @param request - The incoming Next.js request
 * @returns IntegrityResult indicating whether the request is legitimate
 */
export async function verifyIntegrity(
  request: NextRequest
): Promise<IntegrityResult> {
  // Skip verification in development or when not configured
  if (process.env.NODE_ENV === "development") {
    return { ok: true };
  }

  // Skip if Play Integrity is not configured
  if (
    !process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON ||
    !process.env.GOOGLE_PLAY_PACKAGE_NAME
  ) {
    console.warn(
      "[verifyIntegrity] Play Integrity not configured, skipping verification"
    );
    return { ok: true };
  }

  // Only verify requests from mobile clients
  const userAgent = request.headers.get("user-agent") || "";
  const isMobileClient =
    request.headers.has("x-app-integrity") ||
    userAgent.includes("Athlifyr") ||
    request.headers.get("x-client-platform") === "android";

  // If not a mobile client, skip integrity check (web clients use other auth)
  if (!isMobileClient) {
    return { ok: true };
  }

  const token = request.headers.get("x-app-integrity");

  if (!token) {
    return { ok: false, reason: "missing_token" };
  }

  try {
    // Decode the token with Google
    const verdict = await decodeIntegrityToken(token);

    // Validate package name
    const expectedPackage = process.env.GOOGLE_PLAY_PACKAGE_NAME;
    if (verdict.requestDetails.requestPackageName !== expectedPackage) {
      return { ok: false, reason: "package_mismatch" };
    }

    // Validate nonce hasn't expired
    const nonceTimestamp = parseInt(verdict.requestDetails.timestampMillis, 10);
    const now = Date.now();
    if (now - nonceTimestamp > NONCE_TTL_MS) {
      return { ok: false, reason: "nonce_expired" };
    }

    // Validate nonce hasn't been used before (replay attack prevention)
    cleanupNonces();
    const nonce = verdict.requestDetails.nonce;
    if (usedNonces.has(nonce)) {
      return { ok: false, reason: "nonce_reused" };
    }
    usedNonces.set(nonce, now);

    // Validate app integrity
    if (verdict.appIntegrity.appRecognitionVerdict !== "PLAY_RECOGNIZED") {
      return {
        ok: false,
        reason: `app_integrity_failed: ${verdict.appIntegrity.appRecognitionVerdict}`,
      };
    }

    // Validate device integrity
    // MEETS_DEVICE_INTEGRITY means the app is running on a genuine Android device
    const deviceVerdicts = verdict.deviceIntegrity.deviceRecognitionVerdict;
    if (!deviceVerdicts || !deviceVerdicts.includes("MEETS_DEVICE_INTEGRITY")) {
      return {
        ok: false,
        reason: `device_integrity_failed: ${JSON.stringify(deviceVerdicts)}`,
      };
    }

    return { ok: true };
  } catch (error) {
    console.error("[verifyIntegrity] Token verification failed:", error);
    return {
      ok: false,
      reason:
        error instanceof Error ? error.message : "token_verification_failed",
    };
  }
}

/**
 * Middleware-style helper that returns a 403 response if integrity check fails.
 * Use this at the top of protected route handlers.
 *
 * @example
 * ```ts
 * export async function POST(request: NextRequest) {
 *   const integrityError = await requireIntegrity(request);
 *   if (integrityError) return integrityError;
 *   // ... handle request
 * }
 * ```
 */
export async function requireIntegrity(
  request: NextRequest
): Promise<Response | null> {
  const result = await verifyIntegrity(request);

  if (!result.ok) {
    console.warn(`[requireIntegrity] Request rejected: ${result.reason}`, {
      url: request.url,
      method: request.method,
      ip: request.headers.get("x-forwarded-for"),
    });

    return new Response(
      JSON.stringify({
        error: "Integrity verification failed",
        code: "INTEGRITY_FAILED",
      }),
      {
        status: 403,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  return null;
}
