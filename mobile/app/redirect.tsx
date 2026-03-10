// ============================================================================
// Athlifyr Mobile — Redirect Handler (Expo Go)
//
// Handles the deep-link callback from Google OAuth when running in Expo Go.
// The Expo Go redirect URI uses the path "redirect" (athlifyr://redirect).
// Same exchange logic as oauth2redirect.tsx.
// ============================================================================

import { useEffect, useRef } from "react";
import { View, ActivityIndicator, Platform } from "react-native";
import * as WebBrowser from "expo-web-browser";
import * as SecureStore from "expo-secure-store";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useAuthStore } from "@/src/lib/auth-store";
import { api } from "@/src/lib/api";
import { theme } from "@/src/constants/theme";

WebBrowser.maybeCompleteAuthSession();

const TOKEN_KEY = "auth-token";
const REFRESH_TOKEN_KEY = "refresh-token";
const TOKEN_EXPIRY_KEY = "token-expiry";

export default function RedirectScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ code?: string }>();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const setUser = useAuthStore((s) => s.setUser);
  const processingRef = useRef(false);

  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/");
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    const code = params.code;
    if (!code || processingRef.current) return;
    if (useAuthStore.getState().isAuthenticated) return;

    processingRef.current = true;

    (async () => {
      try {
        const codeVerifier = await SecureStore.getItemAsync(
          "google-code-verifier"
        );
        const redirectUri = await SecureStore.getItemAsync(
          "google-redirect-uri"
        );

        if (!codeVerifier || !redirectUri) {
          console.error("❌ [redirect] Missing codeVerifier or redirectUri");
          router.replace("/login");
          return;
        }

        const res = await api.post("/auth/google/exchange", {
          code,
          codeVerifier,
          redirectUri,
          platform: Platform.OS === "web" ? "web" : "android",
        });

        const { token, refreshToken, user, expiresIn } = res.data;

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

        await SecureStore.deleteItemAsync("google-code-verifier");
        await SecureStore.deleteItemAsync("google-redirect-uri");

        console.log("✅ [redirect] Google auth OK, user:", user.id);
        router.replace("/");
      } catch (err) {
        console.error("❌ [redirect] Exchange failed:", err);
        if (useAuthStore.getState().isAuthenticated) {
          router.replace("/");
        } else {
          router.replace("/login");
        }
      } finally {
        processingRef.current = false;
        SecureStore.deleteItemAsync("google-code-verifier");
        SecureStore.deleteItemAsync("google-redirect-uri");
      }
    })();
  }, [params.code, router, setUser]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!useAuthStore.getState().isAuthenticated) {
        console.warn("⏰ [redirect] Timeout — redirecting to login");
        router.replace("/login");
      }
    }, 15_000);
    return () => clearTimeout(timeout);
  }, [router]);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: theme.colors.background,
      }}
    >
      <ActivityIndicator size="large" color={theme.colors.primary} />
    </View>
  );
}
