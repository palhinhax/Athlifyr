// ============================================================================
// Athlifyr Live Server — Type Definitions
// ============================================================================

/** User roles (mirrored from Prisma schema — no direct dependency) */
export type UserRole = "USER" | "ADMIN";

/** JWT payload decoded from token (shared with Next.js) */
export interface JWTPayload {
  userId: string;
  email: string;
  role: UserRole;
  name?: string;
  type?: "access" | "refresh";
  iat?: number;
  exp?: number;
}

/** Authenticated socket data attached after auth middleware */
export interface SocketAuthData {
  userId: string;
  email: string | null;
  userName: string | null;
  role: UserRole | "spectator";
}

// ─── Chat Events ───────────────────────────────────────────────────────────

/** Client → Server events */
export interface ChatClientToServerEvents {
  "chat:join": (conversationId: string) => void;
  "chat:leave": (conversationId: string) => void;
  "chat:message": (data: ChatSendMessagePayload) => void;
  "chat:typing": (data: ChatTypingPayload) => void;
  "chat:seen": (conversationId: string) => void;
}

/** Server → Client events */
export interface ChatServerToClientEvents {
  "chat:message": (data: ChatMessageEvent) => void;
  "chat:typing": (data: ChatTypingEvent) => void;
  "chat:seen": (data: ChatSeenEvent) => void;
  "chat:user_online": (data: { userId: string }) => void;
  "chat:user_offline": (data: { userId: string }) => void;
  "chat:error": (data: { message: string; code?: string }) => void;
}

/** Payload sent by client to send a message */
export interface ChatSendMessagePayload {
  conversationId: string;
  content: string;
}

/** Payload sent by client for typing indicator */
export interface ChatTypingPayload {
  conversationId: string;
  isTyping: boolean;
}

/** Message event broadcast to participants */
export interface ChatMessageEvent {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string | null;
  senderImage: string | null;
  content: string;
  createdAt: string;
}

/** Typing indicator event */
export interface ChatTypingEvent {
  conversationId: string;
  userId: string;
  userName: string | null;
  isTyping: boolean;
}

/** Seen indicator event */
export interface ChatSeenEvent {
  conversationId: string;
  userId: string;
  lastSeenAt: string;
}

// ─── LiveRace Events (re-exported from module) ────────────────────────────

import type {
  LiveRaceClientToServerEvents,
  LiveRaceServerToClientEvents,
  AthletePositionUpdate as _AthletePositionUpdate,
  LeaderboardEntry as _LeaderboardEntry,
  EventLiveStatus as _EventLiveStatus,
  AthleteStatus as _AthleteStatus,
  GPSPoint as _GPSPoint,
  CheckpointSplit as _CheckpointSplit,
} from "../modules/liverace/liverace.types.js";

export type { LiveRaceClientToServerEvents, LiveRaceServerToClientEvents };

// Re-export common types for convenience
export type AthletePositionUpdate = _AthletePositionUpdate;
export type LeaderboardEntry = _LeaderboardEntry;
export type EventLiveStatus = _EventLiveStatus;
export type AthleteStatus = _AthleteStatus;
export type GPSPoint = _GPSPoint;
export type CheckpointSplit = _CheckpointSplit;

// ─── Generic Socket Types ──────────────────────────────────────────────────

export interface ServerToClientEvents
  extends ChatServerToClientEvents, LiveRaceServerToClientEvents {
  "connection:authenticated": (data: { userId: string }) => void;
}

export interface ClientToServerEvents
  extends ChatClientToServerEvents, LiveRaceClientToServerEvents {
  ping: () => void;
}

export interface InterServerEvents {
  ping: () => void;
}

export interface SocketData extends SocketAuthData {
  token: string | null; // JWT token for forwarding to Next.js API (null for anonymous spectators)
}
