// ============================================================================
// Athlifyr Live Server — Socket.io Setup
// ============================================================================

import { Server as SocketIOServer } from "socket.io";
import type { Server as HttpServer } from "http";
import { config } from "../config.js";
import { socketAuthMiddleware } from "../plugins/auth.js";
import {
  handleChatConnect,
  handleChatDisconnect,
} from "../modules/chat/chat.handlers.js";
import {
  registerLiveRaceHandlers,
  handleLiveRaceDisconnect,
} from "../modules/liverace/liverace.handlers.js";
import type {
  ServerToClientEvents,
  ClientToServerEvents,
  InterServerEvents,
  SocketData,
} from "../types/index.js";

export type LiveIO = SocketIOServer<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>;

export function createSocketServer(httpServer: HttpServer): LiveIO {
  const io = new SocketIOServer<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    SocketData
  >(httpServer, {
    cors: {
      origin: config.corsOrigins,
      methods: ["GET", "POST"],
      credentials: true,
    },
    pingInterval: config.socket.pingInterval,
    pingTimeout: config.socket.pingTimeout,
    maxHttpBufferSize: config.socket.maxHttpBufferSize,
    transports: ["websocket", "polling"],
  });

  // ─── Authentication middleware ──────────────────────────────────────────
  io.use(socketAuthMiddleware);

  // ─── Connection handler ────────────────────────────────────────────────
  io.on("connection", async (socket) => {
    const { userId } = socket.data;

    // Confirm authentication
    socket.emit("connection:authenticated", { userId });

    // Register module handlers
    await handleChatConnect(io, socket);
    registerLiveRaceHandlers(io, socket);

    // Handle disconnection
    socket.on("disconnect", async (reason) => {
      console.log(`[Socket] User ${userId} disconnected: ${reason}`);
      await handleChatDisconnect(io, socket);
      handleLiveRaceDisconnect(io, socket);
    });

    // Handle errors
    socket.on("error", (err) => {
      console.error(`[Socket] Error for user ${userId}:`, err.message);
    });
  });

  return io;
}
