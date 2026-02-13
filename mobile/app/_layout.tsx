import { useEffect } from "react";
import { Stack } from "expo-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { I18nextProvider } from "react-i18next";
import i18n from "@/src/lib/i18n";
import { initIntegrity } from "@/src/lib/integrity";

const queryClient = new QueryClient();

export default function RootLayout() {
  // Initialize Play Integrity on app launch
  useEffect(() => {
    initIntegrity();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <I18nextProvider i18n={i18n}>
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
          <Stack.Screen name="notifications" options={{ headerShown: false }} />
        </Stack>
      </I18nextProvider>
    </QueryClientProvider>
  );
}
