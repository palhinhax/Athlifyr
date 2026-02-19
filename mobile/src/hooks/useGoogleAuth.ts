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

  // auth.expo.io proxy only works with Authorization Code + PKCE flow.
  // Standalone APK uses native deep-link with Android Client ID.
  const redirectUri = isExpoGo
    ? "https://auth.expo.io/@joaomduart/athlifyr"
    : AuthSession.makeRedirectUri({ scheme: "com.athlifyr.app" });

  // Expo Go -> Web Client ID (proxy flow)
  // Standalone -> Android Client ID (native flow)
  const clientId = isExpoGo
    ? (process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID ?? "")
    : (process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID ?? "");

  console.log("[GoogleAuth]", { isExpoGo, redirectUri, clientId: clientId.substring(0, 30) + "..." });

  // Authorization Code + PKCE  compatible with auth.expo.io proxy
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

  console.log("[GoogleAuth] ready:", !!request, "| URI:", request?.redirectUri ?? "pending");

  useEffect(() => {
    if (!response || processingRef.current) return;

    console.log("[GoogleAuth] RESPONSE:", JSON.stringify(response, null, 2));

    if (response.type === "success") {
      const code = response.params?.code;
      const codeVerifier = request?.codeVerifier;

      if (!code) {
        setError("No authorization code received");
        return;
      }
      if (!codeVerifier) {
        setError("PKCE code verifier missing");
        return;
      }

      processingRef.current = true;
      setIsLoading(true);
      setError(null);

      api
        .post<AuthResponse>("/auth/google/exchange", {
          code,
          codeVerifier,
          redirectUri,
          platform: Platform.OS === "ios" ? "ios" : "android",
        })
        .then(async (res) => {
          const { token, refreshToken, user, expiresIn } = res.data;

          await SecureStore.setItemAsync(TOKEN_KEY, token);
          if (refreshToken) await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken);
          if (expiresIn) {
            await SecureStore.setItemAsync(TOKEN_EXPIRY_KEY, String(Date.now() + expiresIn * 1000));
          }

          setUser(user);
          useAuthStore.setState({ token, isAuthenticated: true, isLoading: false });
          console.log(" Google auth OK, user:", user.id);
        })
        .catch((err: unknown) => {
          const message = err instanceof Error ? err.message : "Authentication failed";
          console.error(" Google auth error:", message);
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
      console.error(" Google auth error response:", response.error);
      setError(response.error?.message ?? "Authentication error");
    } else if (response.type === "cancel") {
      console.log("ℹ Google auth cancelled");
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
