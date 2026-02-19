import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import { useEffect, useState, useRef } from "react";
import * as SecureStore from "expo-secure-store";
import { api } from "@/src/lib/api";
import { useAuthStore } from "@/src/lib/auth-store";

// Required — lets the in-app browser close and return the result
WebBrowser.maybeCompleteAuthSession();

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
 * Google OAuth hook using expo-auth-session/providers/google.
 *
 * This provider automatically picks the right redirect URI and client ID:
 *   • Expo Go          → uses Web Client ID + auth.expo.io proxy redirect
 *   • Standalone APK   → uses Android Client ID + com.athlifyr.app:/ redirect
 *   • Standalone IPA   → uses iOS Client ID     + com.athlifyr.app:/ redirect
 *
 * Required Google Cloud Console setup
 * ─────────────────────────────────────
 * Web Client ID (849323427488-4oo3r0ia80ces1bqfo5c46qs8fb2vbk9):
 *   Authorised JavaScript origins:
 *     https://auth.expo.io
 *   Authorised redirect URIs:
 *     https://auth.expo.io/@joaomduart/athlifyr
 *
 * Android Client ID (849323427488-b3e26goccuvhndhfn8hiptfecr3q5bqq):
 *   Package name: com.athlifyr.app
 *   SHA-1: B0:39:5A:EB:12:19:3D:DC:04:A9:83:8D:9C:37:BF:5A:62:5D:66:EF
 */
export function useGoogleAuth() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const setUser = useAuthStore((s) => s.setUser);
  const processingRef = useRef(false);

  const [request, response, promptAsync] = Google.useAuthRequest({
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
    androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
    iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
    scopes: ["openid", "profile", "email"],
  });

  const handleGoogleToken = async (accessToken: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await api.post<AuthResponse>("/auth/google-mobile", {
        accessToken,
      });

      const { token, refreshToken, user, expiresIn } = res.data;

      await SecureStore.setItemAsync(TOKEN_KEY, token);
      if (refreshToken) {
        await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken);
      }
      if (expiresIn) {
        const expiry = Date.now() + expiresIn * 1000;
        await SecureStore.setItemAsync(TOKEN_EXPIRY_KEY, expiry.toString());
      }

      setUser(user);
      useAuthStore.setState({ token, isAuthenticated: true, isLoading: false });

      console.log("✅ Google auth successful, user:", user.id);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Authentication failed";
      console.error("❌ Google auth error:", message);
      setError(message);
      await SecureStore.deleteItemAsync(TOKEN_KEY);
      await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
      await SecureStore.deleteItemAsync(TOKEN_EXPIRY_KEY);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!response || processingRef.current) return;

    if (response.type === "success") {
      const accessToken = response.authentication?.accessToken;
      if (!accessToken) {
        console.error("❌ Google success but no access token received");
        setError("No access token received");
        return;
      }
      processingRef.current = true;
      console.log("✅ Got Google access token, sending to backend...");
      handleGoogleToken(accessToken).finally(() => {
        processingRef.current = false;
      });
    } else if (response.type === "error") {
      console.error("❌ Google auth error:", response.error);
      setError(response.error?.message ?? "Authentication error");
    } else if (response.type === "cancel") {
      console.log("ℹ️ Google auth cancelled by user");
      setError(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [response]);

  return {
    promptAsync,
    isReady: !!request,
    isLoading,
    error,
  };
}
