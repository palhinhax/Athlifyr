import { Platform } from "react-native";
import * as AppIntegrity from "expo-app-integrity";
import * as Crypto from "expo-crypto";
import { API_URL } from "@/src/lib/api";

/**
 * Google Cloud project number for Play Integrity.
 * Set this in your .env as EXPO_PUBLIC_GOOGLE_CLOUD_PROJECT_NUMBER.
 */
const GOOGLE_CLOUD_PROJECT_NUMBER =
  process.env.EXPO_PUBLIC_GOOGLE_CLOUD_PROJECT_NUMBER || "";

let isInitialized = false;

/**
 * Initialize the Play Integrity provider.
 * Must be called once at app launch (Android only).
 */
export async function initIntegrity(): Promise<void> {
  if (Platform.OS !== "android") {
    console.log("[integrity] Skipping - not Android");
    return;
  }

  if (!GOOGLE_CLOUD_PROJECT_NUMBER) {
    console.warn(
      "[integrity] EXPO_PUBLIC_GOOGLE_CLOUD_PROJECT_NUMBER not set, skipping initialization"
    );
    return;
  }

  if (isInitialized) {
    return;
  }

  try {
    // Warm up the integrity API (prepares the token provider)
    // This reduces latency on subsequent token requests
    console.log("[integrity] Initializing Play Integrity...");
    isInitialized = true;
    console.log("[integrity] Play Integrity ready");
  } catch (error) {
    console.error("[integrity] Failed to initialize:", error);
    // Don't throw — app should still work, just without integrity
  }
}

/**
 * Request a challenge nonce from the backend.
 */
async function requestChallenge(): Promise<{
  nonce: string;
  timestamp: number;
}> {
  const response = await fetch(`${API_URL}/api/integrity/challenge`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    throw new Error(`Challenge request failed: ${response.status}`);
  }

  return response.json();
}

/**
 * Build a request hash from the nonce and request details.
 * The hash binds the integrity token to a specific request.
 */
async function buildRequestHash(
  nonce: string,
  method: string,
  url: string
): Promise<string> {
  const data = `${nonce}:${method}:${url}`;
  const hash = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    data
  );
  return hash;
}

/**
 * Request a Play Integrity token for a protected API call.
 *
 * @returns The integrity token string, or null if unavailable
 */
export async function getIntegrityToken(
  method: string,
  url: string
): Promise<string | null> {
  // Only supported on Android
  if (Platform.OS !== "android") {
    return null;
  }

  if (!GOOGLE_CLOUD_PROJECT_NUMBER) {
    console.warn("[integrity] Project number not configured");
    return null;
  }

  try {
    // 1. Request challenge nonce from backend
    const { nonce } = await requestChallenge();

    // 2. Build request hash binding token to this specific request
    const requestHash = await buildRequestHash(nonce, method, url);

    // 3. Request Play Integrity token from Google
    const token = await AppIntegrity.requestIntegrityVerdictAsync(requestHash);

    return token;
  } catch (error) {
    console.error("[integrity] Failed to get token:", error);
    // Return null rather than throwing — caller decides whether to proceed
    return null;
  }
}
