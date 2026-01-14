/**
 * Device ID management for anonymous users
 * Used to persist map filters across sessions without authentication
 */

const DEVICE_ID_KEY = "athlifyr_device_id";

/**
 * Generate a UUID v4
 */
function generateUUID(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Get or create a device ID
 * Returns the existing device ID from localStorage or creates a new one
 */
export function getDeviceId(): string {
  if (typeof window === "undefined") {
    // SSR - return empty string, will be handled on client
    return "";
  }

  try {
    let deviceId = localStorage.getItem(DEVICE_ID_KEY);

    if (!deviceId) {
      deviceId = generateUUID();
      localStorage.setItem(DEVICE_ID_KEY, deviceId);
    }

    return deviceId;
  } catch (error) {
    console.error("Error accessing localStorage for device ID:", error);
    // Return a session-only ID if localStorage fails
    return generateUUID();
  }
}

/**
 * Clear the device ID (used after migration to user account)
 */
export function clearDeviceId(): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    localStorage.removeItem(DEVICE_ID_KEY);
  } catch (error) {
    console.error("Error removing device ID from localStorage:", error);
  }
}

/**
 * Check if a device ID exists
 */
export function hasDeviceId(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  try {
    return localStorage.getItem(DEVICE_ID_KEY) !== null;
  } catch {
    return false;
  }
}
