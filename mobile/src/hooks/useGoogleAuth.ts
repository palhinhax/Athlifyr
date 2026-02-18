import * as Google from "expo-auth-session/providers/google";
import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import { useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { api } from "@/src/lib/api";
import { useAuthStore } from "@/src/lib/auth-store";

// Required for Expo Go auth session redirect
WebBrowser.maybeCompleteAuthSession();

const TOKEN_KEY = "auth-token";
const REFRESH_TOKEN_KEY = "refresh-token";
const TOKEN_EXPIRY_KEY = "token-expiry";

interface GoogleAuthResponse {
  token: string;
  refreshToken?: string;
  user: {
    id: string;
    email: string;
    name: string;
    image?: string;
    role: string;
  };
  expiresIn?: number;
}

export function useGoogleAuth() {
  const [isLoading, setIsLoading] = useState(false);
  const setUser = useAuthStore((s) => s.setUser);

  // makeRedirectUri automatically generates the correct URI for each context:
  // • Expo Go / dev-client: exp://…/--/
  // • Standalone builds:    com.athlifyr.app://  (uses scheme from app.json)
  const redirectUri = AuthSession.makeRedirectUri({
    scheme: "athlifyr",
    path: "redirect",
  });

  const androidClientId = process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID;
  const webClientId = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;
  const iosClientId = process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID;

  // Validate required env vars on mount
  useEffect(() => {
    const requiredVars: Record<string, string | undefined> = {
      EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID: webClientId,
      EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID: androidClientId,
    };

    const missing = Object.entries(requiredVars)
      .filter(([, value]) => !value)
      .map(([name]) => name);

    if (missing.length > 0) {
      console.error("❌ Missing required Google Auth env vars:", missing);
    }
  }, [webClientId, androidClientId]);

  // Debug (no sensitive data exposed)
  console.log("Google Auth Config:", {
    redirectUri,
    webClientId: webClientId?.substring(0, 20) + "...",
    androidClientId: androidClientId?.substring(0, 20) + "...",
    hasIosId: !!iosClientId,
  });

  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: androidClientId || webClientId,
    iosClientId: iosClientId || webClientId,
    webClientId,
    redirectUri,
  });

  const handleGoogleToken = async (accessToken: string) => {
    setIsLoading(true);
    try {
      // Send the Google access token to your backend
      // The backend will verify it with Google and create/find the user
      const res = await api.post<GoogleAuthResponse>("/auth/google-mobile", {
        accessToken,
      });

      const { token, refreshToken, user, expiresIn } = res.data;

      // Store tokens with metadata
      await SecureStore.setItemAsync(TOKEN_KEY, token);
      if (refreshToken) {
        await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken);
      }

      // Store token expiry timestamp for proactive refresh
      if (expiresIn) {
        const expiryDate = Date.now() + expiresIn * 1000;
        await SecureStore.setItemAsync(TOKEN_EXPIRY_KEY, expiryDate.toString());
      }

      // Update auth state
      setUser(user);
      useAuthStore.setState({
        token,
        isAuthenticated: true,
        isLoading: false,
      });

      // Log success without exposing sensitive data
      console.log("✅ Google auth successful for user:", user.id);
    } catch (error) {
      console.error("❌ Google auth error:", error);
      // Clean up state on error
      await SecureStore.deleteItemAsync(TOKEN_KEY);
      await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
      await SecureStore.deleteItemAsync(TOKEN_EXPIRY_KEY);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!response) return;

    switch (response.type) {
      case "success": {
        const { authentication } = response;
        if (authentication?.accessToken) {
          console.log(
            "✅ Google Auth success, token length:",
            authentication.accessToken.length
          );
          handleGoogleToken(authentication.accessToken);
        } else {
          console.error("❌ Success response missing access token");
        }
        break;
      }

      case "error":
        console.error("❌ Google Auth Error:", {
          error: response.error,
          params: response.params,
        });
        break;

      case "cancel":
        console.log("ℹ️ Google Auth cancelled by user");
        break;

      default:
        console.log("ℹ️ Unhandled auth response type:", response.type);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [response]);

  return {
    promptAsync,
    isReady: !!request,
    isLoading,
  };
}
