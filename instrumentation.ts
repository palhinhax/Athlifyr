// Next.js App Router instrumentation hook.
// Sentry server/edge initialization is loaded here via the sentry.*.config.ts files.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/
export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("./sentry.server.config");
  }

  if (process.env.NEXT_RUNTIME === "edge") {
    await import("./sentry.edge.config");
  }
}
