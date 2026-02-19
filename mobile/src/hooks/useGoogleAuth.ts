import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import { useEffect, useState, useCallback, useRef } from "react";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";
import { api } from "@/src/lib/api";
import { useAuthStore } from "@/src/lib/auth-store";

// Ensure any in-progress auth sessions can complete their redirect
WebBrowser.maybeCompleteAuthSession();

const TOKEN_KEY = "auth-token";
const REFRESH_TOKEN_KEY = "refresh-token";
const TOKEN_EXPIRY_KEY = "token-expiry";

// Google OAuth endpoints for PKCE authorization code flow
const discovery: AuthSession.DiscoveryDocument = {
  authorizationEndpoint: "https://accounts.google.com/o/oauth2/v2/auth",
  tokenEndpoint: "https://oauth2.googleapis.com/token",
  revocationEndpoint: "https://oauth2.googleapis.com/revoke",
};

interface ExchangeResponse {
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
 * Returns the correct Google client ID for the current platform.
 * For PKCE authorization code flow on mobile, use the platform-specific
 * client ID (Android/iOS). Falls back to web client ID.
 */
function getClientId(): string {
  const webClientId = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID || "";
  const androidClientId =
    process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID || "";
  const iosClientId = process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID || "";

  if (Platform.OS === "android" && androidClientId) return androidClientId;
  if (Platform.OS === "ios" && iosClientId) return iosClientId;
  return webClientId;
}

/**
 * Google OAuth login hook using Authorization Code + PKCE flow.
 *
 * Flow:
 * 1. Opens Google consent screen in a secure browser.
 * 2. Google redirects back to the app via deep link (athlifyr://redirect).
 * 3. App sends the authorization code + code verifier to the backend.
 * 4. Backend exchanges the code with Google (server-to-server) and returns
 *    session tokens.
 * 5. Tokens are stored in SecureStore.
 */
export function useGoogleAuth() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const setUser = useAuthStore((s) => s.setUser);
  const processingRef = useRef(false);

  const redirectUri = AuthSession.makeRedirectUri({
    scheme: "athlifyr",
    path: "redirect",
  });

  const clientId = getClientId();

  // Validate required env vars on mount
  useEffect(() => {
    const missing: string[] = [];
    if (!process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID)
      missing.push("EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID");
    if (
      Platform.OS === "android" &&
      !process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID
    )
      missing.push("EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID");
    if (Platform.OS === "ios" && !process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID)
      missing.push("EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID");

    if (missing.length > 0) {
      console.error("❌ Missing Google OAuth env vars:", missing);
    }

    console.log("Google Auth PKCE Config:", {
      redirectUri,
      clientId: clientId ? clientId.substring(0, 20) + "..." : "MISSING",
      platform: Platform.OS,
    });
  }, [redirectUri, clientId]);

  // Create the PKCE auth request
  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId,
      redirectUri,
      scopes: ["openid", "profile", "email"],
      responseType: AuthSession.ResponseType.Code,
      usePKCE: true,
      extraParams: {
        // Ensures we get a refresh token from Google
        access_type: "offline",
        prompt: "consent",
      },
    },
    discovery
  );

  /**
   * Exchange the authorization code with our backend.
   * The backend handles the Google token exchange server-to-server.
   */
  const exchangeCodeWithBackend = useCallback(
    async (code: string, codeVerifier: string) => {
      setIsLoading(true);
      setError(null);

      try {
        const platform = Platform.OS === "ios" ? "ios" : "android";

        const res = await api.post<ExchangeResponse>("/auth/google/exchange", {
          code,
          codeVerifier,
          redirectUri,
          platform,
        });

        const { token, refreshToken, user, expiresIn } = res.data;

        // Store tokens securely
        await SecureStore.setItemAsync(TOKEN_KEY, token);
        if (refreshToken) {
          await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken);
        }
        if (expiresIn) {
          const expiryDate = Date.now() + expiresIn * 1000;
          await SecureStore.setItemAsync(
            TOKEN_EXPIRY_KEY,
            expiryDate.toString()
          );
        }

        // Update auth state
        setUser(user);
        useAuthStore.setState({
          token,
          isAuthenticated: true,
          isLoading: false,
        });

        console.log("✅ Google PKCE auth successful for user:", user.id);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Authentication failed";
        console.error("❌ Google PKCE exchange error:", message);
        setError(message);

        // Clean up on error
        await SecureStore.deleteItemAsync(TOKEN_KEY);
        await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
        await SecureStore.deleteItemAsync(TOKEN_EXPIRY_KEY);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [redirectUri, setUser]
  );

  // Handle the auth response when it arrives
  useEffect(() => {
    if (!response || processingRef.current) return;

    switch (response.type) {
      case "success": {
        const { code } = response.params;
        const codeVerifier = request?.codeVerifier;

        if (!code) {
          console.error("❌ Auth success but no authorization code received");
          setError("No authorization code received");
          break;
        }

        if (!codeVerifier) {
          console.error("❌ Auth success but no code verifier available");
          setError("PKCE code verifier missing");
          break;
        }

        processingRef.current = true;
        console.log("✅ Got authorization code, exchanging with backend...");
        exchangeCodeWithBackend(code, codeVerifier).finally(() => {
          processingRef.current = false;
        });
        break;
      }

      case "error":
        console.error("❌ Google Auth error:", {
          error: response.error,
          params: response.params,
        });
        setError(
          response.params?.error_description ||
            response.error?.message ||
            "Authentication error"
        );
        break;

      case "cancel":
        console.log("ℹ️ Google Auth cancelled by user");
        setError(null);
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
    error,
  };
}
