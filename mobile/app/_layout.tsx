import { useEffect } from "react";
import { AppState, Platform } from "react-native";
import type { AppStateStatus } from "react-native";
import { Stack } from "expo-router";
import {
  QueryClient,
  QueryClientProvider,
  focusManager,
} from "@tanstack/react-query";
import { I18nextProvider } from "react-i18next";
import i18n from "@/src/lib/i18n";
import { initIntegrity } from "@/src/lib/integrity";
import { useAuthStore } from "@/src/lib/auth-store";
import { SocketProvider } from "@/src/hooks/useSocket";

// ── React Query + React Native AppState integration ────────────────────
// By default, refetchOnWindowFocus only works in browsers.
// This wires AppState so queries refetch when the app comes back to the foreground.
function onAppStateChange(status: AppStateStatus) {
  if (Platform.OS !== "web") {
    focusManager.setFocused(status === "active");
  }
}

const queryClient = new QueryClient();

export default function RootLayout() {
  const loadStoredAuth = useAuthStore((s) => s.loadStoredAuth);

  // Restore auth session + initialize Play Integrity on app launch
  useEffect(() => {
    loadStoredAuth();
    initIntegrity();
  }, [loadStoredAuth]);

  // Subscribe to AppState changes so React Query refetches on foreground
  useEffect(() => {
    const subscription = AppState.addEventListener("change", onAppStateChange);
    return () => subscription.remove();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <I18nextProvider i18n={i18n}>
        <SocketProvider>
          <Stack
            screenOptions={{
              headerShown: true,
              animation: "slide_from_right",
            }}
          >
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen
              name="login"
              options={{ headerShown: false, presentation: "modal" }}
            />
            <Stack.Screen
              name="register"
              options={{ headerShown: false, presentation: "modal" }}
            />
            <Stack.Screen
              name="forgot-password"
              options={{ headerShown: false, presentation: "modal" }}
            />
            <Stack.Screen
              name="notifications"
              options={{ headerShown: false }}
            />
            <Stack.Screen name="my-schedule" options={{ headerShown: false }} />
            <Stack.Screen
              name="workout/[id]"
              options={{ headerShown: false }}
            />
            <Stack.Screen name="record-lift" options={{ headerShown: false }} />
            <Stack.Screen
              name="lift-analysis"
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="motion-analysis"
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="motion-analyses"
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="motion-analysis-view"
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="live-race"
              options={{ headerShown: false, gestureEnabled: false }}
            />
            <Stack.Screen
              name="free-run"
              options={{ headerShown: false, gestureEnabled: false }}
            />
            <Stack.Screen
              name="activity-detail"
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="oauth2redirect"
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="redirect"
              options={{ headerShown: false }}
            />
          </Stack>
        </SocketProvider>
      </I18nextProvider>
    </QueryClientProvider>
  );
}
