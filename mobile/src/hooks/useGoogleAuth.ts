import * as WebBrowser from "expo-web-browser";
import { useEffect, useState, useRef } from "react";
import { Platform } from "react-native";
import { setSecureItem, deleteSecureItem } from "@/src/lib/token-storage";
import { flushPendingActivities } from "@/src/lib/activity-sync-queue";
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

  const isWeb = Platform.OS === "web";

  // Build the redirect URI dynamically:
  // - Web: use makeRedirectUri() which produces the current page URL
  // - Expo Go: exp://127.0.0.1:8081/--/redirect  (auto-detected, uses Web Client ID)
  // - Dev build / Production (Android): com.athlifyr.app:/oauth2redirect
  //     This is the reverse-DNS scheme required by Android OAuth Client IDs.
  //     Google validates it automatically via package name + SHA-1 fingerprint.
  //     Custom URI schemes (athlifyr://...) are rejected by Android-type clients.
  //
  // ⚠️ IMPORTANT: makeRedirectUri({ scheme, path }) produces "scheme://path" (two slashes),
  //    but Android OAuth clients require "scheme:/path" (one slash).
  //    Use the literal string to avoid the Error 400: invalid_request from Google.
  let redirectUri: string;
  if (isWeb) {
    redirectUri = AuthSession.makeRedirectUri({ preferLocalhost: true });
  } else if (isExpoGo) {
    redirectUri = AuthSession.makeRedirectUri({
      scheme: "athlifyr",
      path: "redirect",
    });
  } else {
    redirectUri = "com.athlifyr.app:/oauth2redirect";
  }

  // Web and Expo Go use the Web Client ID (web-type credential in Google Cloud Console).
  // Standalone Android uses the Android Client ID.
  const clientId =
    isWeb || isExpoGo
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
  // and persist PKCE codeVerifier so the redirect screen can
  // complete the exchange if this screen is unmounted by deep-link navigation.
  const safePromptAsync: typeof promptAsync = async (options) => {
    if (isExpoGo && !isWeb) {
      console.warn(
        "[GoogleAuth] Google Sign-In is not supported in Expo Go. " +
          "Use a development or preview build (eas build --profile preview)."
      );
    }
    if (request?.codeVerifier) {
      await setSecureItem("google-code-verifier", request.codeVerifier);
    }
    await setSecureItem("google-redirect-uri", redirectUri);
    return promptAsync(options);
  };

  useEffect(() => {
    if (!response || processingRef.current) return;

    // On native Android/iOS, the oauth2redirect / redirect screen handles
    // the code exchange via deep-link.  Skip here to avoid a race condition
    // where both try to exchange the same authorization code.
    if (!isWeb && !isExpoGo) return;

    if (response.type === "success") {
      // If oauth2redirect already completed auth, skip.
      if (useAuthStore.getState().isAuthenticated) return;

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
          platform: "web",
        });
        return res.data;
      };

      authenticate()
        .then(async ({ token, refreshToken, user, expiresIn }) => {
          await setSecureItem(TOKEN_KEY, token);
          if (refreshToken)
            await setSecureItem(REFRESH_TOKEN_KEY, refreshToken);
          if (expiresIn) {
            await setSecureItem(
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

          // Sync any activities recorded while logged out
          flushPendingActivities().catch(() => {});
        })
        .catch((err: unknown) => {
          // Don't wipe tokens if authentication already succeeded elsewhere
          if (useAuthStore.getState().isAuthenticated) return;
          const message =
            err instanceof Error ? err.message : "Authentication failed";
          console.error("❌ Google auth error:", message);
          setError(message);
          deleteSecureItem(TOKEN_KEY);
          deleteSecureItem(REFRESH_TOKEN_KEY);
          deleteSecureItem(TOKEN_EXPIRY_KEY);
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
