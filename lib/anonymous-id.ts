"use client";

/**
 * Manages anonymous user ID for tracking preferences
 * Stored in localStorage to persist across sessions
 */

const ANONYMOUS_ID_KEY = "athlifyr_anonymous_id";

/**
 * Generate a simple unique ID (UUID v4 format)
 */
function generateId(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Get or create anonymous ID
 * Returns existing ID from localStorage or creates a new one
 */
export function getAnonymousId(): string {
  if (typeof window === "undefined") {
    return "";
  }

  try {
    let anonymousId = localStorage.getItem(ANONYMOUS_ID_KEY);

    if (!anonymousId) {
      anonymousId = generateId();
      localStorage.setItem(ANONYMOUS_ID_KEY, anonymousId);
    }

    return anonymousId;
  } catch (error) {
    console.error("Error managing anonymous ID:", error);
    return generateId(); // Fallback to session-only ID
  }
}

/**
 * Clear anonymous ID (e.g., when user logs in)
 */
export function clearAnonymousId(): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    localStorage.removeItem(ANONYMOUS_ID_KEY);
  } catch (error) {
    console.error("Error clearing anonymous ID:", error);
  }
}
