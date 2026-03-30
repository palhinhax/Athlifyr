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

  const isWeb = Platform.OS === "web";

  const isIOS = Platform.OS === "ios";

  // Build the redirect URI and client ID dynamically per platform:
  //
  // - Web: makeRedirectUri() → current page URL, uses Web Client ID
  // - Expo Go: exp://<host>:8081/--/redirect, uses Web Client ID
  // - Standalone Android: com.athlifyr.app:/oauth2redirect
  //     Reverse-DNS scheme required by Android OAuth Client IDs.
  //     Google validates via package name + SHA-1 fingerprint.
  // - Standalone iOS: <reversed-ios-client-id>:/oauth2redirect
  //     iOS OAuth Client IDs require the reversed client ID as the URL scheme.
  //     Google validates via bundle ID.
  //
  // ⚠️ IMPORTANT: makeRedirectUri({ scheme, path }) produces "scheme://path" (two slashes),
  //    but native OAuth clients require "scheme:/path" (one slash).
  //    Use literal strings to avoid Error 400: invalid_request from Google.
  let redirectUri: string;
  let clientId: string;

  if (isWeb) {
    redirectUri = AuthSession.makeRedirectUri({ preferLocalhost: true });
    clientId = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID ?? "";
  } else if (isExpoGo) {
    redirectUri = AuthSession.makeRedirectUri({
      scheme: "athlifyr",
      path: "redirect",
    });
    clientId = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID ?? "";
  } else if (isIOS) {
    clientId = process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID ?? "";
    // iOS requires the reversed client ID as the redirect URI scheme.
    // e.g. "123-abc.apps.googleusercontent.com" → "com.googleusercontent.apps.123-abc"
    const reversedClientId = clientId.split(".").reverse().join(".");
    redirectUri = `${reversedClientId}:/oauth2redirect`;
  } else {
    // Android
    clientId = process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID ?? "";
    redirectUri = "com.athlifyr.app:/oauth2redirect";
  }

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
      await SecureStore.setItemAsync(
        "google-code-verifier",
        request.codeVerifier
      );
    }
    await SecureStore.setItemAsync("google-redirect-uri", redirectUri);
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
          // Don't wipe tokens if authentication already succeeded elsewhere
          if (useAuthStore.getState().isAuthenticated) return;
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
