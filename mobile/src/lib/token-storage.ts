/**
 * Token storage abstraction that uses expo-secure-store when available
 * and falls back to AsyncStorage (e.g. in Expo Go on Android).
 */
import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";

let _secureStoreAvailable: boolean | null = null;

async function isSecureStoreAvailable(): Promise<boolean> {
  if (_secureStoreAvailable !== null) return _secureStoreAvailable;
  try {
    _secureStoreAvailable = await SecureStore.isAvailableAsync();
  } catch {
    _secureStoreAvailable = false;
  }
  if (!_secureStoreAvailable) {
    console.warn(
      "[token-storage] SecureStore unavailable — falling back to AsyncStorage"
    );
  }
  return _secureStoreAvailable;
}

export async function getSecureItem(key: string): Promise<string | null> {
  if (await isSecureStoreAvailable()) {
    return SecureStore.getItemAsync(key);
  }
  return AsyncStorage.getItem(key);
}

export async function setSecureItem(key: string, value: string): Promise<void> {
  if (await isSecureStoreAvailable()) {
    await SecureStore.setItemAsync(key, value);
  } else {
    await AsyncStorage.setItem(key, value);
  }
}

export async function deleteSecureItem(key: string): Promise<void> {
  if (await isSecureStoreAvailable()) {
    await SecureStore.deleteItemAsync(key);
  } else {
    await AsyncStorage.removeItem(key);
  }
}
