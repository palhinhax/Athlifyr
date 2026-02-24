// This file configures the initialization of Sentry for edge runtimes.
// The config here will be used whenever the edge runtime handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN,

  // Environment tagging
  environment: process.env.NODE_ENV,

  // Performance tracing: capture 10% of transactions in production
  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,

  // Do not send events in development unless explicitly wanted
  enabled: process.env.NODE_ENV !== "development",

  // ── Sentry Logs ──────────────────────────────────────────────────────
  _experiments: { enableLogs: true },
});
