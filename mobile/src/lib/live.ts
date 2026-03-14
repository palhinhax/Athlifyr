// ============================================================================
// Athlifyr Mobile — Live Server Client
//
// All chat operations go through the live server (Fastify + Socket.io).
// Auth tokens are fetched from the Next.js API and forwarded.
// ============================================================================

import * as SecureStore from "expo-secure-store";
import { API_URL } from "./api";

const TOKEN_KEY = "auth-token";

/** Live server base URL */
export const LIVE_SERVER_URL =
  process.env.EXPO_PUBLIC_LIVE_URL || "http://localhost:4000";

/** Live chat API base */
export const LIVE_CHAT_BASE = `${LIVE_SERVER_URL.replace(/\/$/, "")}/api/chat`;

/**
 * Fetch a short-lived JWT token for the live server.
 * Uses the stored auth token to authenticate with Next.js API.
 */
export async function fetchLiveToken(): Promise<string | null> {
  try {
    const authToken = await SecureStore.getItemAsync(TOKEN_KEY);
    if (!authToken) {
      console.warn(
        "[LiveChat] No auth token in SecureStore — user not logged in?"
      );
      return null;
    }

    const url = `${API_URL}/api/auth/live-token`;
    console.log("[LiveChat] Fetching live token from:", url);

    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    if (!res.ok) {
      const errorBody = await res.text().catch(() => "");
      console.error(
        `[LiveChat] live-token request failed: ${res.status} ${res.statusText}`,
        errorBody
      );
      return null;
    }

    const data = (await res.json()) as { token?: string };
    return data.token ?? null;
  } catch (error) {
    console.error("[LiveChat] Failed to fetch live token:", error);
    return null;
  }
}

interface LiveFetchOptions {
  method?: "GET" | "POST";
  body?: Record<string, unknown>;
}

/**
 * Authenticated fetch to the live server.
 * Obtains a live token and makes the request.
 */
export async function liveFetch<T>(
  path: string,
  options: LiveFetchOptions = {}
): Promise<T> {
  const token = await fetchLiveToken();
  if (!token) {
    throw new Error("Failed to obtain live token");
  }

  const url = `${LIVE_CHAT_BASE}${path}`;
  console.log(`[LiveChat] ${options.method ?? "GET"} ${url}`);

  let response: Response;
  try {
    response = await fetch(url, {
      method: options.method ?? "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: options.body ? JSON.stringify(options.body) : undefined,
    });
  } catch (networkError) {
    console.error(`[LiveChat] Network error calling ${url}:`, networkError);
    throw new Error(
      `Live chat network error: ${networkError instanceof Error ? networkError.message : String(networkError)}`
    );
  }

  if (!response.ok) {
    const errorBody = await response.text().catch(() => "");
    console.error(
      `[LiveChat] Request failed: ${response.status} ${response.statusText}`,
      errorBody
    );
    throw new Error(
      `Live chat request failed: ${response.status} ${response.statusText}`
    );
  }

  return (await response.json()) as T;
}
