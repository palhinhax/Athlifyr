// Sentry initialization for Athlifyr mobile app.
// Called once at app startup, before any navigation or auth logic.
// https://docs.sentry.io/platforms/react-native/
import * as Sentry from "@sentry/react-native";
import Constants from "expo-constants";

// Read DSN from Expo public env var
const SENTRY_DSN = process.env.EXPO_PUBLIC_SENTRY_DSN;

export function initSentry() {
  if (!SENTRY_DSN) {
    return;
  }

  const appVersion =
    Constants.expoConfig?.version ?? Constants.manifest?.version ?? "unknown";
  const buildNumber =
    Constants.expoConfig?.ios?.buildNumber ??
    String(Constants.expoConfig?.android?.versionCode ?? "") ??
    "";

  const release = buildNumber ? `${appVersion}+${buildNumber}` : appVersion;

  Sentry.init({
    dsn: SENTRY_DSN,

    // Tag environment (development / preview / production)
    environment: __DEV__ ? "development" : "production",

    // Release string for regression tracking and source map matching
    release,
    dist: buildNumber || appVersion,

    // Performance tracing: 10% in production
    tracesSampleRate: __DEV__ ? 1.0 : 0.1,

    // Do not send events in development
    enabled: !__DEV__,

    // Privacy: scrub sensitive data before sending
    beforeSend(event) {
      // Strip auth tokens from extra context
      if (event.extra) {
        const sensitiveKeys = /password|token|secret|authorization|cookie/i;
        for (const key of Object.keys(event.extra)) {
          if (sensitiveKeys.test(key)) {
            delete event.extra[key];
          }
        }
      }

      // Strip sensitive request data
      if (event.request) {
        if (event.request.headers) {
          delete event.request.headers["authorization"];
          delete event.request.headers["Authorization"];
          delete event.request.headers["cookie"];
        }
        if (event.request.cookies) {
          event.request.cookies = {};
        }
      }

      return event;
    },

    // Filter out known noisy errors
    ignoreErrors: ["AbortError", "NetworkError", "Failed to fetch"],
  });
}

/**
 * Set authenticated user context. Only attaches pseudonymous id — never email.
 * Call this after a successful login.
 */
export function setSentryUser(userId: string) {
  Sentry.setUser({ id: userId });
}

/**
 * Clear user context on logout.
 */
export function clearSentryUser() {
  Sentry.setUser(null);
}
