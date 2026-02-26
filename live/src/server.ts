// ============================================================================
// Athlifyr Live Server — Fastify Server Setup
// ============================================================================

import Fastify from "fastify";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import rateLimit from "@fastify/rate-limit";
import { config } from "./config.js";
import { chatRoutes } from "./modules/chat/chat.routes.js";

export async function buildServer() {
  // Build logger options — only use pino-pretty in development if available
  const loggerOptions: Record<string, unknown> = {
    level: config.env === "production" ? "info" : "debug",
  };

  if (config.env === "development") {
    try {
      // Only add transport if pino-pretty is available
      await import("pino-pretty");
      loggerOptions.transport = {
        target: "pino-pretty",
        options: { colorize: true },
      };
    } catch {
      // pino-pretty not installed — use default JSON logger
    }
  }

  const app = Fastify({
    logger: loggerOptions,
    trustProxy: true,
  });

  // ─── Global Plugins ────────────────────────────────────────────────────

  await app.register(cors, {
    origin: config.corsOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  });

  await app.register(helmet, {
    contentSecurityPolicy: false, // Let reverse proxy handle CSP
  });

  await app.register(rateLimit, {
    max: config.rateLimit.max,
    timeWindow: config.rateLimit.timeWindow,
  });

  // ─── Health Check ──────────────────────────────────────────────────────

  app.get("/health", async () => ({
    status: "ok",
    service: "athlifyr-live",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  }));

  // ─── API Routes ────────────────────────────────────────────────────────

  await app.register(chatRoutes, { prefix: "/api/chat" });

  // ─── Error Handler ─────────────────────────────────────────────────────

  app.setErrorHandler(
    (error: Error & { statusCode?: number }, _request, reply) => {
      app.log.error(error);

      const statusCode = error.statusCode || 500;
      const message =
        config.env === "production" && statusCode === 500
          ? "Internal Server Error"
          : error.message;

      reply.status(statusCode).send({
        error: message,
        statusCode,
      });
    }
  );

  return app;
}
