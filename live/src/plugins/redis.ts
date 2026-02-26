// ============================================================================
// Athlifyr Live Server — Redis Plugin
// ============================================================================

import Redis from "ioredis";
import { config } from "../config.js";

let redisInstance: Redis | null = null;
let redisPubInstance: Redis | null = null;
let redisSubInstance: Redis | null = null;
let redisAvailable = false;
let redisErrorLogged = false;

/** Whether Redis is currently available */
export function isRedisAvailable(): boolean {
  return redisAvailable;
}

/** Main Redis client (commands) */
export function getRedis(): Redis {
  if (!redisInstance) {
    redisInstance = new Redis(config.redis.url, {
      keyPrefix: config.redis.keyPrefix,
      maxRetriesPerRequest: 3,
      retryStrategy(times) {
        // Stop retrying after 5 attempts in development without Redis
        if (times > 5) {
          if (!redisErrorLogged) {
            console.warn("[Redis] Max retries reached — running without Redis");
            redisErrorLogged = true;
          }
          return null; // Stop retrying
        }
        const delay = Math.min(times * 200, 5000);
        return delay;
      },
      lazyConnect: true,
    });

    redisInstance.on("error", () => {
      // Only log once to avoid spamming console
      if (!redisErrorLogged) {
        console.error(
          "[Redis] Connection failed — features requiring Redis will be disabled"
        );
        redisErrorLogged = true;
      }
      redisAvailable = false;
    });

    redisInstance.on("connect", () => {
      console.log("[Redis] Connected");
      redisAvailable = true;
      redisErrorLogged = false;
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
  if (!redisAvailable) return;
  const redis = getRedis();
  await redis.sadd(ONLINE_KEY, userId);
  // Also set a per-user key with TTL for heartbeat expiry
  await redis.set(`user:${userId}:online`, "1", "EX", ONLINE_TTL);
}

export async function setUserOffline(userId: string): Promise<void> {
  if (!redisAvailable) return;
  const redis = getRedis();
  await redis.srem(ONLINE_KEY, userId);
  await redis.del(`user:${userId}:online`);
}

export async function isUserOnline(userId: string): Promise<boolean> {
  if (!redisAvailable) return false;
  const redis = getRedis();
  const result = await redis.exists(`user:${userId}:online`);
  return result === 1;
}

export async function getOnlineUsers(): Promise<string[]> {
  if (!redisAvailable) return [];
  const redis = getRedis();
  return redis.smembers(ONLINE_KEY);
}

// ─── Typing indicator helpers ──────────────────────────────────────────────

export async function setTyping(
  conversationId: string,
  userId: string,
  isTyping: boolean
): Promise<void> {
  if (!redisAvailable) return;
  const redis = getRedis();
  const key = `typing:${conversationId}`;
  if (isTyping) {
    await redis.hset(key, userId, Date.now().toString());
    await redis.expire(key, 10); // Auto-expire after 10s
  } else {
    await redis.hdel(key, userId);
  }
}
