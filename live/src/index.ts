// ============================================================================
// Athlifyr Live Server — Entry Point
//
// Fastify + Socket.io + Redis
// Chat · Notifications · LiveRace (coming soon)
//
// NOTE: All database operations are delegated to the Next.js API.
// This server is a real-time layer only (WebSockets + Redis).
// ============================================================================

import { buildServer } from "./server.js";
import { createSocketServer } from "./plugins/socket.js";
import { getRedis, disconnectRedis } from "./plugins/redis.js";
import { config } from "./config.js";

async function main() {
  console.log("─────────────────────────────────────────────────");
  console.log("  🏃 Athlifyr Live Server");
  console.log(`  Environment: ${config.env}`);
  console.log(`  Port: ${config.port}`);
  console.log(`  Next.js API: ${config.nextApiUrl}`);
  console.log("─────────────────────────────────────────────────");

  // Build Fastify HTTP server
  const app = await buildServer();

  // Connect Redis
  try {
    const redis = getRedis();
    await redis.connect();
    console.log("[Boot] Redis connected ✓");
  } catch (err) {
    console.warn(
      "[Boot] Redis not available — running without Redis (no pub/sub, no presence):",
      (err as Error).message
    );
  }

  // Start Fastify (get raw HTTP server)
  await app.listen({ port: config.port, host: config.host });

  // Attach Socket.io to the HTTP server
  const httpServer = app.server;
  const io = createSocketServer(httpServer);

  console.log(`[Boot] Fastify listening on ${config.host}:${config.port} ✓`);
  console.log(`[Boot] Socket.io attached ✓`);
  console.log("─────────────────────────────────────────────────");
  console.log("  Ready! 🚀");
  console.log("─────────────────────────────────────────────────");

  // ─── Graceful Shutdown ──────────────────────────────────────────────────

  const shutdown = async (signal: string) => {
    console.log(`\n[Shutdown] Received ${signal}, shutting down gracefully...`);

    // Close Socket.io
    io.close(() => {
      console.log("[Shutdown] Socket.io closed ✓");
    });

    // Close Fastify
    await app.close();
    console.log("[Shutdown] Fastify closed ✓");

    // Close Redis
    await disconnectRedis();
    console.log("[Shutdown] Redis disconnected ✓");

    process.exit(0);
  };

  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));
}

main().catch((err) => {
  console.error("[Fatal] Failed to start live server:", err);
  process.exit(1);
});
