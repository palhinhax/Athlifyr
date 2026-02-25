// ============================================================================
// Athlifyr Live Server — Redis Plugin
// ============================================================================

import Redis from "ioredis";
import { config } from "../config.js";

let redisInstance: Redis | null = null;
let redisPubInstance: Redis | null = null;
let redisSubInstance: Redis | null = null;

/** Main Redis client (commands) */
export function getRedis(): Redis {
  if (!redisInstance) {
    redisInstance = new Redis(config.redis.url, {
      keyPrefix: config.redis.keyPrefix,
      maxRetriesPerRequest: 3,
      retryStrategy(times) {
        const delay = Math.min(times * 200, 5000);
        return delay;
      },
      lazyConnect: true,
    });

    redisInstance.on("error", (err) => {
      console.error("[Redis] Connection error:", err.message);
    });

    redisInstance.on("connect", () => {
      console.log("[Redis] Connected");
    });
  }
  return redisInstance;
}

/** Redis Pub client (for Socket.io adapter) */
export function getRedisPub(): Redis {
  if (!redisPubInstance) {
    redisPubInstance = new Redis(config.redis.url, {
      keyPrefix: config.redis.keyPrefix,
      maxRetriesPerRequest: 3,
      lazyConnect: true,
    });
  }
  return redisPubInstance;
}

/** Redis Sub client (for Socket.io adapter) */
export function getRedisSub(): Redis {
  if (!redisSubInstance) {
    redisSubInstance = new Redis(config.redis.url, {
      keyPrefix: config.redis.keyPrefix,
      maxRetriesPerRequest: 3,
      lazyConnect: true,
    });
  }
  return redisSubInstance;
}

/** Disconnect all Redis clients */
export async function disconnectRedis(): Promise<void> {
  const clients = [redisInstance, redisPubInstance, redisSubInstance];
  await Promise.all(
    clients.map((client) => {
      if (client) {
        return client.quit().catch(() => client.disconnect());
      }
    })
  );
  redisInstance = null;
  redisPubInstance = null;
  redisSubInstance = null;
}

// ─── Online presence helpers ───────────────────────────────────────────────

const ONLINE_KEY = "users:online";
const ONLINE_TTL = 300; // 5 minutes

export async function setUserOnline(userId: string): Promise<void> {
  const redis = getRedis();
  await redis.sadd(ONLINE_KEY, userId);
  // Also set a per-user key with TTL for heartbeat expiry
  await redis.set(`user:${userId}:online`, "1", "EX", ONLINE_TTL);
}

export async function setUserOffline(userId: string): Promise<void> {
  const redis = getRedis();
  await redis.srem(ONLINE_KEY, userId);
  await redis.del(`user:${userId}:online`);
}

export async function isUserOnline(userId: string): Promise<boolean> {
  const redis = getRedis();
  const result = await redis.exists(`user:${userId}:online`);
  return result === 1;
}

export async function getOnlineUsers(): Promise<string[]> {
  const redis = getRedis();
  return redis.smembers(ONLINE_KEY);
}

// ─── Typing indicator helpers ──────────────────────────────────────────────

export async function setTyping(
  conversationId: string,
  userId: string,
  isTyping: boolean
): Promise<void> {
  const redis = getRedis();
  const key = `typing:${conversationId}`;
  if (isTyping) {
    await redis.hset(key, userId, Date.now().toString());
    await redis.expire(key, 10); // Auto-expire after 10s
  } else {
    await redis.hdel(key, userId);
  }
}
