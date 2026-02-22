// This file configures the initialization of Sentry on the browser side.
// The config here will be used whenever a user loads a page in the browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Environment tagging
  environment: process.env.NODE_ENV,

  // Performance tracing: capture 10% of transactions in production
  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,

  // Session Replay: disabled by default for GDPR compliance
  // Enable with masking if needed; see docs/observability.md
  replaysSessionSampleRate: 0,
  replaysOnErrorSampleRate: 0,

  // Do not send events in development unless explicitly wanted
  enabled: process.env.NODE_ENV !== "development",

  // Privacy: scrub sensitive data before sending
  beforeSend(event) {
    // Strip Authorization headers and cookies from request context
    if (event.request) {
      if (event.request.headers) {
        delete event.request.headers["authorization"];
        delete event.request.headers["Authorization"];
        delete event.request.headers["cookie"];
        delete event.request.headers["Cookie"];
      }
      if (event.request.cookies) {
        event.request.cookies = {};
      }
      // Strip sensitive query params (tokens, passwords, etc.)
      if (event.request.query_string) {
        const sensitive = /token|password|secret|key|auth/i;
        if (typeof event.request.query_string === "string") {
          event.request.query_string = event.request.query_string
            .split("&")
            .filter((param) => !sensitive.test(param))
            .join("&");
        }
      }
    }

    // Strip sensitive data from extra / contexts
    if (event.extra) {
      const sensitiveKeys = /password|token|secret|authorization|cookie/i;
      for (const key of Object.keys(event.extra)) {
        if (sensitiveKeys.test(key)) {
          delete event.extra[key];
        }
      }
    }

    return event;
  },

  // Filter out known noisy / harmless errors to reduce noise
  ignoreErrors: [
    // Browser extension interference
    "ResizeObserver loop limit exceeded",
    "ResizeObserver loop completed with undelivered notifications",
    // Network / user-caused errors
    "Failed to fetch",
    "NetworkError",
    "Load failed",
    // Navigation interruptions
    "AbortError",
    // Next.js navigation
    "NEXT_NOT_FOUND",
    "NEXT_REDIRECT",
  ],
});
