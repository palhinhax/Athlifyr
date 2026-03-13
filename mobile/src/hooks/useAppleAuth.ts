import { useState } from "react";
import { Platform } from "react-native";
import * as AppleAuthentication from "expo-apple-authentication";
import * as SecureStore from "expo-secure-store";
import { api } from "@/src/lib/api";
import { useAuthStore } from "@/src/lib/auth-store";

const TOKEN_KEY = "auth-token";
const REFRESH_TOKEN_KEY = "refresh-token";
const TOKEN_EXPIRY_KEY = "token-expiry";

interface AuthResponse {
  token: string;
  refreshToken?: string;
  expiresIn?: number;
  user: {
    id: string;
    email: string;
    name: string;
    image?: string;
    role: string;
  };
}

/**
 * Hook for Apple Sign In authentication on mobile (iOS only).
 * Uses expo-apple-authentication with the official Apple button.
 */
export function useAppleAuth() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const setUser = useAuthStore((s) => s.setUser);

  // Apple Sign In is only available on iOS
  const isAvailable = Platform.OS === "ios";

  const signIn = async () => {
    if (!isAvailable) return;

    setIsLoading(true);
    setError(null);

    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
        ],
      });

      if (!credential.identityToken) {
        throw new Error("No identity token received from Apple");
      }

      // Send identity token to backend for verification
      const response = await api.post<AuthResponse>("/auth/apple-mobile", {
        identityToken: credential.identityToken,
        fullName: credential.fullName
          ? {
              givenName: credential.fullName.givenName,
              familyName: credential.fullName.familyName,
            }
          : null,
      });

      const { token, refreshToken, user } = response.data;

      // Store tokens securely
      await SecureStore.setItemAsync(TOKEN_KEY, token);
      if (refreshToken) {
        await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken);
      }

      // Calculate and store token expiry (7 days from now)
      const expiryMs = Date.now() + 7 * 24 * 60 * 60 * 1000;
      await SecureStore.setItemAsync(TOKEN_EXPIRY_KEY, expiryMs.toString());

      // Update auth store
      setUser({
        id: user.id,
        email: user.email,
        name: user.name,
        image: user.image,
        role: user.role,
      });
      useAuthStore.setState({
        token,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (e: unknown) {
      // User cancelled — not an error
      if (
        e &&
        typeof e === "object" &&
        "code" in e &&
        e.code === "ERR_REQUEST_CANCELED"
      ) {
        setIsLoading(false);
        return;
      }

      const message = e instanceof Error ? e.message : "Apple sign in failed";
      setError(message);
      throw e;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    signIn,
    isLoading,
    isAvailable,
    error,
  };
}
