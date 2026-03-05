/**
 * Web-safe shim for expo-secure-store.
 * Uses localStorage as a fallback since SecureStore is native-only.
 */

export async function getItemAsync(key: string): Promise<string | null> {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

export async function setItemAsync(key: string, value: string): Promise<void> {
  try {
    localStorage.setItem(key, value);
  } catch {
    // silently fail
  }
}

export async function deleteItemAsync(key: string): Promise<void> {
  try {
    localStorage.removeItem(key);
  } catch {
    // silently fail
  }
}

export async function isAvailableAsync(): Promise<boolean> {
  try {
    return typeof localStorage !== "undefined";
  } catch {
    return false;
  }
}
