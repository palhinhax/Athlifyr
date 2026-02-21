import * as WebBrowser from "expo-web-browser";
import { useEffect, useState, useRef } from "react";
import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";
import { api } from "@/src/lib/api";
import { useAuthStore } from "@/src/lib/auth-store";
import * as AuthSession from "expo-auth-session";
import Constants from "expo-constants";

WebBrowser.maybeCompleteAuthSession();

const TOKEN_KEY = "auth-token";
const REFRESH_TOKEN_KEY = "refresh-token";
const TOKEN_EXPIRY_KEY = "token-expiry";

// Google OAuth 2.0 endpoints
const discovery: AuthSession.DiscoveryDocument = {
  authorizationEndpoint: "https://accounts.google.com/o/oauth2/v2/auth",
  tokenEndpoint: "https://oauth2.googleapis.com/token",
  revocationEndpoint: "https://oauth2.googleapis.com/revoke",
};

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

export function useGoogleAuth() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const setUser = useAuthStore((s) => s.setUser);
  const processingRef = useRef(false);

  const isExpoGo =
    Constants.executionEnvironment === "storeClient" ||
    (Constants as unknown as Record<string, string>).appOwnership === "expo";

  // Build the redirect URI dynamically:
  // - Expo Go: exp://127.0.0.1:8081/--/redirect  (auto-detected)
  // - Dev build / Production: athlifyr://redirect  (custom scheme)
  const redirectUri = AuthSession.makeRedirectUri({
    scheme: "athlifyr",
    path: "redirect",
  });

  // Both environments use PKCE authorization code flow.
  // Expo Go  → Web Client ID   (web-type credential in Google Cloud Console)
  //            The redirect URI (exp://...) must be added to the client's
  //            "Authorized redirect URIs" in Google Cloud Console.
  // Standalone → Android Client ID (android-type credential)
  //
  // The authorization code is exchanged server-side via /auth/google/exchange
  // which uses GOOGLE_CLIENT_SECRET.
  const clientId = isExpoGo
    ? (process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID ?? "")
    : (process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID ?? "");

  console.log("[GoogleAuth]", {
    isExpoGo,
    redirectUri,
    clientId: clientId.substring(0, 30) + "...",
  });

  // PKCE Authorization Code flow for all environments
  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId,
      redirectUri,
      scopes: ["openid", "profile", "email"],
      responseType: AuthSession.ResponseType.Code,
      usePKCE: true,
      extraParams: { access_type: "offline" },
    },
    discovery
  );

  console.log(
    "[GoogleAuth] ready:",
    !!request,
    "| URI:",
    request?.redirectUri ?? "pending"
  );

  // Wrap promptAsync to warn when running in Expo Go
  const safePromptAsync: typeof promptAsync = async (options) => {
    if (isExpoGo) {
      console.warn(
        "[GoogleAuth] Google Sign-In is not supported in Expo Go. " +
          "Use a development or preview build (eas build --profile preview)."
      );
    }
    return promptAsync(options);
  };

  useEffect(() => {
    if (!response || processingRef.current) return;

    if (response.type === "success") {
      processingRef.current = true;
      setIsLoading(true);
      setError(null);

      const authenticate = async (): Promise<AuthResponse> => {
        const code = response.params?.code;
        const codeVerifier = request?.codeVerifier;
        if (!code) throw new Error("No authorization code received");
        if (!codeVerifier) throw new Error("PKCE code verifier missing");

        const res = await api.post<AuthResponse>("/auth/google/exchange", {
          code,
          codeVerifier,
          redirectUri,
          platform: Platform.OS === "ios" ? "ios" : "android",
        });
        return res.data;
      };

      authenticate()
        .then(async ({ token, refreshToken, user, expiresIn }) => {
          await SecureStore.setItemAsync(TOKEN_KEY, token);
          if (refreshToken)
            await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken);
          if (expiresIn) {
            await SecureStore.setItemAsync(
              TOKEN_EXPIRY_KEY,
              String(Date.now() + expiresIn * 1000)
            );
          }

          setUser(user);
          useAuthStore.setState({
            token,
            isAuthenticated: true,
            isLoading: false,
          });
          console.log("✅ Google auth OK, user:", user.id);
        })
        .catch((err: unknown) => {
          const message =
            err instanceof Error ? err.message : "Authentication failed";
          console.error("❌ Google auth error:", message);
          setError(message);
          SecureStore.deleteItemAsync(TOKEN_KEY);
          SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
          SecureStore.deleteItemAsync(TOKEN_EXPIRY_KEY);
        })
        .finally(() => {
          setIsLoading(false);
          processingRef.current = false;
        });
    } else if (response.type === "error") {
      console.error("❌ Google auth error response:", response.error);
      setError(response.error?.message ?? "Authentication error");
    } else if (response.type === "cancel") {
      console.log("ℹ️ Google auth cancelled");
      setError(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [response]);

  return {
    promptAsync: safePromptAsync,
    isReady: !!request,
    isLoading,
    error,
  };
}
