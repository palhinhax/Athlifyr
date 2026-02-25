// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";
import { nodeProfilingIntegration } from "@sentry/profiling-node";

Sentry.init({
  dsn: "https://67aacfb6978f7531afd1dac70ce5f497@o4510941393256448.ingest.de.sentry.io/4510941416652885",

  // Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
  tracesSampleRate: 1,

  // Profiling
  integrations: [nodeProfilingIntegration()],
  // Set sampling rate for profiling - evaluated once per SDK.init call
  profileSessionSampleRate: 1.0,
  // Trace lifecycle automatically enables profiling during active traces
  profileLifecycle: "trace",

  // Enable logs to be sent to Sentry
  enableLogs: true,
});
