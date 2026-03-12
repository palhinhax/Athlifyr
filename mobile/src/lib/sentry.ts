import * as Sentry from "@sentry/react-native";
import Constants from "expo-constants";

const DSN = process.env.EXPO_PUBLIC_SENTRY_DSN;

/**
 * Initialize Sentry for the mobile app.
 * Silently skips initialization when no DSN is provided (local development).
 */
export function initSentry(): void {
  if (!DSN) {
    return;
  }

  Sentry.init({
    dsn: DSN,

    // Tracing — sample 20% in production, 100% in dev
    tracesSampleRate: __DEV__ ? 1.0 : 0.2,

    // Disable in dev to avoid noise
    enabled: !__DEV__,

    // Release & environment
    release: Constants.expoConfig?.version ?? "unknown",
    environment: __DEV__ ? "development" : "production",

    // Enable native crash reporting
    enableNativeCrash: true,
    enableNativeNagger: false,

    // Attach stack traces to all events
    attachStacktrace: true,
  });
}

export { Sentry };
