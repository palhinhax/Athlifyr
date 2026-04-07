// ============================================================================
// Athlifyr Live Server — LiveRace Service
//
// Manages event rooms, athlete state, GPS processing, leaderboard,
// and periodic broadcasts. Keeps volatile state in memory + Redis.
// ============================================================================

import { getRedis, isRedisAvailable } from "../../plugins/redis.js";
import {
  buildRouteHelper,
  projectPointOnRouteNear,
  detectNewCheckpoints,
  detectFinish,
  detectStartLineCrossing,
  isPlausibleUpdate,
  isAccuracyAcceptable,
  isTimestampValid,
  haversineM,
} from "./route-engine.js";
import {
  fetchLiveConfig,
  updateLiveStatus,
  verifyAthlete,
  persistResults,
  fetchFriendIds,
} from "./liverace.api.js";
import type {
  EventRoomState,
  AthleteState,
  GPSPoint,
  LeaderboardEntry,
  AthletePositionUpdate,
  EventLiveStatus,
  CheckpointSplit,
  LiveConfigCheckpoint,
} from "./liverace.types.js";
import type { LiveIO } from "../../plugins/socket.js";
import type { LiveSocket } from "../../plugins/socket.js";

// Redis key TTL for event data (24 hours). Prevents stale data from
// accumulating if a race is never explicitly stopped.
const REDIS_EVENT_TTL_S = 24 * 60 * 60;

// ─── In-memory rooms ────────────────────────────────────────────────────────

const rooms = new Map<string, EventRoomState>();

/** Get an active event room */
export function getRoom(eventId: string): EventRoomState | undefined {
  return rooms.get(eventId);
}

/** Check if an event room exists */
export function hasRoom(eventId: string): boolean {
  return rooms.has(eventId);
}

/** Get all active room IDs */
export function getActiveRoomIds(): string[] {
  return Array.from(rooms.keys());
}

// ─── Room name helpers ──────────────────────────────────────────────────────

export function eventRoom(eventId: string): string {
  return `liverace:${eventId}`;
}

// ─── Start / Prepare Event ──────────────────────────────────────────────────

/**
 * Idempotent start: prepare a live race room for an event.
 * Returns the room state (existing or newly created).
 */
/**
 * Attempt to recover athlete state from Redis after a server restart.
 * Reads athlete metadata and position snapshots, merging them into the room.
 * Non-fatal: if Redis is down or data is stale, the room starts fresh.
 */
async function recoverAthletesFromRedis(room: EventRoomState): Promise<number> {
  if (!isRedisAvailable()) return 0;

  const redis = getRedis();
  const athleteKey = `live:event:${room.eventId}:athletes`;
  const positionKey = `live:event:${room.eventId}:positions`;

  try {
    const [athleteData, positionData] = await Promise.all([
      redis.hgetall(athleteKey),
      redis.hgetall(positionKey),
    ]);

    if (!athleteData || Object.keys(athleteData).length === 0) return 0;

    let recovered = 0;
    for (const [userId, raw] of Object.entries(athleteData)) {
      try {
        const meta = JSON.parse(raw) as {
          userId: string;
          name: string;
          variantId: string;
          variantName: string;
          bibNumber: string | null;
        };

        // Parse position snapshot if available
        const posRaw = positionData?.[userId];
        const pos = posRaw
          ? (JSON.parse(posRaw) as {
              lat: number;
              lng: number;
              ts: number;
              dist: number;
              dev: number;
              prog: number;
              status: string;
            })
          : null;

        const athleteState: AthleteState = {
          userId: meta.userId,
          name: meta.name,
          image: null,
          variantId: meta.variantId,
          variantName: meta.variantName,
          bibNumber: meta.bibNumber,
          status: (pos?.status as AthleteState["status"]) ?? "ACTIVE",
          visibility: "PUBLIC",
          currentPosition: pos
            ? { lat: pos.lat, lng: pos.lng, timestamp: pos.ts }
            : null,
          lastUpdateAt: pos?.ts ?? null,
          personalStartTime: null,
          wasInsideStartZone: false,
          distanceAlongRouteM: pos?.dist ?? 0,
          deviationM: pos?.dev ?? 0,
          progressPercent: pos?.prog ?? 0,
          consecutiveOffRouteCount: 0,
          checkpointsReached: [],
          lastCheckpointOrder: 0,
          rank: 0,
          finishTimeMs: null,
        };

        room.athletes.set(userId, athleteState);
        recovered++;
      } catch {
        // Skip malformed entries
      }
    }

    if (recovered > 0) {
      console.log(
        `[LiveRace] Recovered ${recovered} athletes from Redis for event ${room.eventId}`
      );
    }

    return recovered;
  } catch (err) {
    console.warn(
      `[LiveRace] Redis recovery failed for event ${room.eventId}:`,
      err
    );
    return 0;
  }
}

export async function startEvent(
  eventId: string,
  io: LiveIO
): Promise<{ room: EventRoomState; created: boolean }> {
  // Already active?
  const existing = rooms.get(eventId);
  if (existing) {
    return { room: existing, created: false };
  }

  // Redis lock to prevent duplicate starts
  if (isRedisAvailable()) {
    const redis = getRedis();
    const lockKey = `live:event:${eventId}:lock`;
    const acquired = await redis.set(lockKey, "1", "EX", 3600, "NX");
    if (!acquired) {
      // Another instance is starting this event — wait briefly and check again
      await new Promise((r) => setTimeout(r, 500));
      const retryRoom = rooms.get(eventId);
      if (retryRoom) return { room: retryRoom, created: false };
      // If still not found, the other instance may have failed — proceed
    }
  }

  // Fetch config from Next.js
  console.log(`[LiveRace] Fetching config for event ${eventId}...`);
  const liveConfig = await fetchLiveConfig(eventId);

  // Build route helpers for each variant
  const routeHelpers = new Map<string, ReturnType<typeof buildRouteHelper>>();
  for (const variant of liveConfig.variants) {
    if (variant.routePoints.length >= 2) {
      const helper = buildRouteHelper(
        variant.variantId,
        variant.routePoints,
        variant.checkpoints
      );
      routeHelpers.set(variant.variantId, helper);
      console.log(
        `[LiveRace] Route helper built for variant "${variant.variantName}" — ` +
          `${helper.segments.length} segments, ${helper.totalDistanceM.toFixed(0)}m total, ` +
          `${helper.checkpoints.length} checkpoints`
      );
    }
  }

  // Determine initial status
  const initialStatus: EventLiveStatus =
    liveConfig.liveStatus === "SCHEDULED" ? "WARMUP" : liveConfig.liveStatus;

  // Create room state
  const room: EventRoomState = {
    eventId,
    config: liveConfig,
    status: initialStatus,
    raceStartTime: null,
    variantStartTimes: new Map(),
    athletes: new Map(),
    spectatorCount: 0,
    routeHelpers,
    variantStartTimers: new Map(),
    leaderboardInterval: null,
    positionInterval: null,
    inactivityCheckInterval: null,
  };

  rooms.set(eventId, room);

  // Attempt to recover athlete state from Redis (survives server restart)
  await recoverAthletesFromRedis(room);

  // Update DB status to WARMUP (if was SCHEDULED)
  if (liveConfig.liveStatus === "SCHEDULED") {
    try {
      await updateLiveStatus(eventId, "WARMUP");
      console.log(`[LiveRace] Event ${eventId} status → WARMUP`);
    } catch (err) {
      console.error(`[LiveRace] Failed to update DB status:`, err);
    }
  }

  // Start broadcast timers
  startBroadcastTimers(room, io);

  // Schedule auto-start based on the event start time
  scheduleRaceStart(room, io);

  console.log(
    `[LiveRace] Room created for event "${liveConfig.title}" (${eventId}), ` +
      `status: ${room.status}, variants: ${liveConfig.variants.length}`
  );

  return { room, created: true };
}

// ─── Schedule Race Start (per variant) ─────────────────────────────────────

/**
 * Compute the absolute start timestamp (ms) for a given variant.
 * Uses the variant's own startDate/startTime if available,
 * otherwise falls back to the event-level startDate.
 */
function computeVariantStartMs(
  room: EventRoomState,
  variantId: string
): number {
  const variant = room.config.variants.find((v) => v.variantId === variantId);
  if (!variant) return new Date(room.config.startDate).getTime();

  // If the variant has its own startDate, use it
  if (variant.startDate) {
    const base = new Date(variant.startDate);
    // If startTime is provided (e.g. "09:30"), overlay it onto the date
    if (variant.startTime) {
      const [hours, minutes] = variant.startTime.split(":").map(Number);
      if (!isNaN(hours) && !isNaN(minutes)) {
        base.setUTCHours(hours, minutes, 0, 0);
      }
    }
    return base.getTime();
  }

  // Fallback: event-level startDate
  return new Date(room.config.startDate).getTime();
}

/**
 * Get the start time for a specific variant from the room state.
 * Returns the actual recorded start time if already started, else null.
 */
export function getVariantStartTime(
  room: EventRoomState,
  variantId: string
): number | null {
  return room.variantStartTimes.get(variantId) ?? null;
}

/**
 * Get the scheduled start times for all variants (used for countdown sync).
 * Returns a map of variantId → scheduled start timestamp (unix ms).
 */
export function getScheduledVariantStartTimes(
  room: EventRoomState
): Record<string, number> {
  const result: Record<string, number> = {};
  for (const variant of room.config.variants) {
    result[variant.variantId] = computeVariantStartMs(room, variant.variantId);
  }
  return result;
}

/**
 * Schedule individual timers for each variant's start.
 * Variants may start at different times (e.g. 50km at 07:00, 25km at 09:00).
 * The room transitions to LIVE when the FIRST variant starts.
 */
function scheduleRaceStart(room: EventRoomState, io: LiveIO): void {
  const now = Date.now();

  for (const variant of room.config.variants) {
    const variantStartMs = computeVariantStartMs(room, variant.variantId);
    const delay = variantStartMs - now;

    if (delay <= 0) {
      // Start time already passed — start this variant immediately
      if (room.status === "WARMUP" || room.status === "LIVE") {
        startVariant(room, variant.variantId, io);
      }
    } else {
      console.log(
        `[LiveRace] Variant "${variant.variantName}" start scheduled in ${Math.round(delay / 1000)}s ` +
          `for event ${room.eventId}`
      );

      const timer = setTimeout(() => {
        if (room.status === "WARMUP" || room.status === "LIVE") {
          startVariant(room, variant.variantId, io);
        }
      }, delay);

      room.variantStartTimers.set(variant.variantId, timer);
    }
  }
}

/**
 * Start a single variant's race clock.
 * If this is the first variant to start, transitions the room to LIVE.
 */
async function startVariant(
  room: EventRoomState,
  variantId: string,
  io: LiveIO
): Promise<void> {
  // Already started?
  if (room.variantStartTimes.has(variantId)) return;

  const startTime = Date.now();
  room.variantStartTimes.set(variantId, startTime);

  // Remove the timer reference
  room.variantStartTimers.delete(variantId);

  const variant = room.config.variants.find((v) => v.variantId === variantId);
  const variantName = variant?.variantName ?? variantId;

  // First variant to start? Transition room to LIVE
  const isFirstStart = room.status === "WARMUP";
  if (isFirstStart) {
    room.status = "LIVE";
    room.raceStartTime = startTime; // backward compat: first variant = global start

    try {
      await updateLiveStatus(room.eventId, "LIVE");
    } catch (err) {
      console.error(`[LiveRace] Failed to update DB status to LIVE:`, err);
    }

    // Broadcast room-level status change
    io.to(eventRoom(room.eventId)).emit("liverace:status_changed", {
      eventId: room.eventId,
      status: "LIVE",
      raceStartTime: room.raceStartTime,
      variantStartTimes: Object.fromEntries(room.variantStartTimes),
    });

    console.log(
      `[LiveRace] 🏁 Race LIVE for event ${room.eventId} (first variant: "${variantName}")`
    );
  } else {
    // Subsequent variant start — broadcast updated variant start times
    io.to(eventRoom(room.eventId)).emit("liverace:status_changed", {
      eventId: room.eventId,
      status: "LIVE",
      raceStartTime: room.raceStartTime!,
      variantStartTimes: Object.fromEntries(room.variantStartTimes),
    });
  }

  // Always emit the per-variant start event
  io.to(eventRoom(room.eventId)).emit("liverace:variant_started", {
    eventId: room.eventId,
    variantId,
    variantName,
    raceStartTime: startTime,
  });

  console.log(
    `[LiveRace] 🚩 Variant "${variantName}" STARTED for event ${room.eventId}`
  );
}

// ─── Stop Event ─────────────────────────────────────────────────────────────

export async function stopEvent(
  eventId: string,
  io: LiveIO,
  reason: "FINISHED" | "CANCELLED" = "FINISHED"
): Promise<void> {
  const room = rooms.get(eventId);
  if (!room) return;

  room.status = reason;

  // Stop broadcast timers
  if (room.leaderboardInterval) clearInterval(room.leaderboardInterval);
  if (room.positionInterval) clearInterval(room.positionInterval);
  if (room.inactivityCheckInterval) clearInterval(room.inactivityCheckInterval);

  // Clear any pending variant start timers
  for (const timer of room.variantStartTimers.values()) {
    clearTimeout(timer);
  }
  room.variantStartTimers.clear();

  // Persist final results if finishing
  if (reason === "FINISHED") {
    await persistFinalResults(room);
  }

  // Update DB
  try {
    await updateLiveStatus(eventId, reason);
  } catch (err) {
    console.error(`[LiveRace] Failed to update final status:`, err);
  }

  // Broadcast
  io.to(eventRoom(eventId)).emit("liverace:status_changed", {
    eventId,
    status: reason,
  });

  // Release Redis lock and clean up event data
  if (isRedisAvailable()) {
    const redis = getRedis();
    await Promise.all([
      redis.del(`live:event:${eventId}:lock`),
      redis.del(`live:event:${eventId}:athletes`),
      redis.del(`live:event:${eventId}:positions`),
    ]).catch((err) => {
      console.warn(
        `[LiveRace] Redis cleanup failed for event ${eventId}:`,
        err
      );
    });
  }

  // Cleanup (keep room briefly for late joiners, then destroy)
  setTimeout(() => {
    rooms.delete(eventId);
    console.log(`[LiveRace] Room destroyed for event ${eventId}`);
  }, 60_000);

  console.log(`[LiveRace] Event ${eventId} → ${reason}`);
}

// ─── Athlete Management ─────────────────────────────────────────────────────

/**
 * Join an athlete to the event room. Validates registration via Next.js.
 */
export async function joinAthlete(
  eventId: string,
  userId: string,
  socketId: string,
  io: LiveIO
): Promise<{ success: boolean; error?: string; athlete?: AthleteState }> {
  const room = rooms.get(eventId);
  if (!room) {
    return { success: false, error: "Event room not found" };
  }

  if (room.status !== "WARMUP" && room.status !== "LIVE") {
    return { success: false, error: `Cannot join: race is ${room.status}` };
  }

  // Check if already joined
  const existing = room.athletes.get(userId);
  if (existing) {
    existing.status = "ACTIVE";
    existing.lastUpdateAt = Date.now();
    return { success: true, athlete: existing };
  }

  // Verify registration via Next.js
  const verification = await verifyAthlete(userId, eventId);
  if (!verification.verified || !verification.athlete) {
    return {
      success: false,
      error: verification.reason || "Not registered for this event",
    };
  }

  const { athlete: athleteInfo } = verification;

  // Create athlete state
  const athleteState: AthleteState = {
    userId,
    name: athleteInfo.name,
    image: athleteInfo.image,
    variantId: athleteInfo.variantId,
    variantName: athleteInfo.variantName ?? "",
    bibNumber: athleteInfo.bibNumber,
    status: "ACTIVE",
    visibility: athleteInfo.liveRaceVisibility ?? "PUBLIC",
    currentPosition: null,
    lastUpdateAt: Date.now(),
    personalStartTime: null,
    wasInsideStartZone: false,
    distanceAlongRouteM: 0,
    deviationM: 0,
    progressPercent: 0,
    consecutiveOffRouteCount: 0,
    checkpointsReached: [],
    lastCheckpointOrder: -1,
    rank: 0,
    finishTimeMs: null,
  };

  room.athletes.set(userId, athleteState);

  // Broadcast athlete joined to all in the room
  io.to(eventRoom(eventId)).emit("liverace:athlete_joined", {
    eventId,
    athlete: {
      userId,
      name: athleteState.name,
      image: athleteState.image,
      bibNumber: athleteState.bibNumber,
      variantId: athleteState.variantId,
      variantName: athleteState.variantName,
    },
  });

  // Store in Redis for persistence across reconnections
  if (isRedisAvailable()) {
    const redis = getRedis();
    const athleteKey = `live:event:${eventId}:athletes`;
    await redis.hset(
      athleteKey,
      userId,
      JSON.stringify({
        userId,
        name: athleteState.name,
        variantId: athleteState.variantId,
        variantName: athleteState.variantName,
        bibNumber: athleteState.bibNumber,
      })
    );
    redis.expire(athleteKey, REDIS_EVENT_TTL_S).catch(() => {});
  }

  console.log(
    `[LiveRace] Athlete joined: ${athleteState.name || userId} → event ${eventId}, ` +
      `variant: ${athleteState.variantName}`
  );

  return { success: true, athlete: athleteState };
}

/**
 * Handle an athlete leaving the event.
 */
export function leaveAthlete(
  eventId: string,
  userId: string,
  io: LiveIO
): void {
  const room = rooms.get(eventId);
  if (!room) return;

  const athlete = room.athletes.get(userId);
  if (athlete) {
    athlete.status = "INACTIVE";
  }

  io.to(eventRoom(eventId)).emit("liverace:athlete_left", { eventId, userId });
  console.log(`[LiveRace] Athlete left: ${userId} from event ${eventId}`);
}

// ─── Spectator Management ───────────────────────────────────────────────────

export function joinSpectator(eventId: string, io: LiveIO): void {
  const room = rooms.get(eventId);
  if (!room) return;
  room.spectatorCount++;
  io.to(eventRoom(eventId)).emit("liverace:spectator_count", {
    eventId,
    count: room.spectatorCount,
  });
}

export function leaveSpectator(eventId: string, io: LiveIO): void {
  const room = rooms.get(eventId);
  if (!room) return;
  room.spectatorCount = Math.max(0, room.spectatorCount - 1);
  io.to(eventRoom(eventId)).emit("liverace:spectator_count", {
    eventId,
    count: room.spectatorCount,
  });
}

// ─── GPS Update Processing ──────────────────────────────────────────────────

/**
 * Process a GPS update from an athlete.
 * This is the hot path — called every 1-3 seconds per athlete.
 */
export function processGpsUpdate(
  eventId: string,
  userId: string,
  point: GPSPoint,
  io: LiveIO
): void {
  const room = rooms.get(eventId);
  if (!room) return;

  const athlete = room.athletes.get(userId);
  if (!athlete) return;

  // Only process GPS during LIVE state (in WARMUP we just accept presence)
  if (room.status === "WARMUP") {
    athlete.currentPosition = point;
    athlete.lastUpdateAt = Date.now();
    athlete.status = "ACTIVE";
    return;
  }

  if (room.status !== "LIVE") return;

  // Check if this athlete's variant has started yet
  // (room may be LIVE because another variant started first)
  const variantStart = getVariantStartTime(room, athlete.variantId);
  if (!variantStart) {
    // Variant hasn't started — accept position but don't process route/checkpoints
    athlete.currentPosition = point;
    athlete.lastUpdateAt = Date.now();
    athlete.status = "ACTIVE";
    return;
  }

  // Detect personal start: athlete exiting the START zone
  detectStartZoneExit(room, athlete, point, io);

  // Anti-cheat: accuracy check
  if (!isAccuracyAcceptable(point.accuracy)) return;

  // Anti-cheat: timestamp validation (reject future or extremely old timestamps)
  if (!isTimestampValid(point.timestamp)) {
    console.warn(
      `[LiveRace] Rejected GPS from ${userId}: invalid timestamp ${point.timestamp}`
    );
    return;
  }

  // Anti-cheat: speed check (if we have a previous point)
  if (athlete.currentPosition) {
    if (
      !isPlausibleUpdate(
        athlete.currentPosition,
        point,
        room.config.settings.maxSpeedKmh
      )
    ) {
      console.warn(
        `[LiveRace] Rejected implausible GPS from ${userId}: possible teleportation`
      );
      return;
    }
  }

  // Previous segment index for optimised search
  const routeHelper = room.routeHelpers.get(athlete.variantId);
  if (!routeHelper) {
    // No route for this variant — just track position
    athlete.currentPosition = point;
    athlete.lastUpdateAt = Date.now();
    athlete.status = "ACTIVE";
    return;
  }

  // Previous segment hint
  const prevSegIdx =
    athlete.distanceAlongRouteM > 0
      ? findSegmentForDistance(
          routeHelper.segments,
          athlete.distanceAlongRouteM
        )
      : 0;

  // Project onto route
  const projection = projectPointOnRouteNear(
    point.lat,
    point.lng,
    routeHelper.segments,
    prevSegIdx
  );

  // Enforce monotonic progress (with small tolerance for GPS jitter)
  const newDistance = Math.max(
    athlete.distanceAlongRouteM - 50, // allow 50m backwards (GPS jitter)
    projection.distanceAlongRouteM
  );

  // Save previous position for gate-line crossing detection
  const prevPos = athlete.currentPosition;

  // Update athlete state
  athlete.currentPosition = point;
  athlete.lastUpdateAt = Date.now();
  athlete.distanceAlongRouteM = newDistance;
  athlete.deviationM = projection.deviationM;
  // Derive progressPercent from the monotonically clamped newDistance, not
  // from the raw projection. On out-and-back routes the projection may snap to
  // an earlier overlapping segment (outbound), which would cause the displayed
  // progress to jump backward even though distanceAlongRouteM is protected.
  athlete.progressPercent =
    routeHelper.totalDistanceM > 0
      ? Math.min(
          100,
          Math.max(0, (newDistance / routeHelper.totalDistanceM) * 100)
        )
      : 0;

  // Off-route detection with hysteresis.
  // Require OFF_ROUTE_ENTER_COUNT consecutive off-route points before
  // transitioning, and use a tighter threshold for the return transition.
  // This prevents noisy GPS at the edge of the threshold from spamming
  // status-change broadcasts.
  const OFF_ROUTE_ENTER_COUNT = 3;
  const offRouteThreshold = room.config.settings.deviationThresholdM;
  const returnThreshold = offRouteThreshold * 0.75;

  if (athlete.status !== "FINISHED") {
    if (projection.deviationM > offRouteThreshold) {
      athlete.consecutiveOffRouteCount++;
      if (
        athlete.status !== "OFF_ROUTE" &&
        athlete.consecutiveOffRouteCount >= OFF_ROUTE_ENTER_COUNT
      ) {
        athlete.status = "OFF_ROUTE";
        io.to(eventRoom(eventId)).emit("liverace:athlete_status", {
          eventId,
          userId,
          status: "OFF_ROUTE",
        });
      }
    } else {
      athlete.consecutiveOffRouteCount = 0;
      if (
        athlete.status === "OFF_ROUTE" &&
        projection.deviationM <= returnThreshold
      ) {
        athlete.status = "ACTIVE";
        io.to(eventRoom(eventId)).emit("liverace:athlete_status", {
          eventId,
          userId,
          status: "ACTIVE",
        });
      } else if (athlete.status !== "OFF_ROUTE") {
        athlete.status = "ACTIVE";
      }
    }
  }

  // Skip further processing if already finished
  if (athlete.status === "FINISHED") return;

  // Checkpoint detection
  const reachedOrders = new Set(
    athlete.checkpointsReached.map((s) => {
      const cp = routeHelper.checkpoints.find((c) => c.id === s.checkpointId);
      return cp?.order ?? -1;
    })
  );

  const newCheckpoints = detectNewCheckpoints(
    newDistance,
    point.lat,
    point.lng,
    routeHelper,
    reachedOrders,
    prevPos?.lat,
    prevPos?.lng
  );

  for (const cpIdx of newCheckpoints) {
    const cp = routeHelper.checkpoints[cpIdx];
    const athleteStart = getAthleteRaceStart(room, athlete);
    const splitTimeMs = athleteStart ? Date.now() - athleteStart : 0;

    const split: CheckpointSplit = {
      checkpointId: cp.id,
      checkpointName: cp.name,
      reachedAt: Date.now(),
      splitTimeMs,
    };

    athlete.checkpointsReached.push(split);
    athlete.lastCheckpointOrder = Math.max(
      athlete.lastCheckpointOrder,
      cp.order
    );

    // Broadcast checkpoint reached
    io.to(eventRoom(eventId)).emit("liverace:checkpoint_reached", {
      eventId,
      userId,
      athleteName: athlete.name,
      checkpoint: split,
    });

    console.log(
      `[LiveRace] 📍 ${athlete.name || userId} reached checkpoint "${cp.name}" ` +
        `(${formatTimeMs(splitTimeMs)})`
    );
  }

  // Finish detection
  {
    const finished = detectFinish(
      newDistance,
      point.lat,
      point.lng,
      routeHelper,
      prevPos?.lat,
      prevPos?.lng
    );
    if (finished) {
      athlete.status = "FINISHED";
      const athleteStart = getAthleteRaceStart(room, athlete);
      athlete.finishTimeMs = athleteStart ? Date.now() - athleteStart : 0;

      // Compute rank (within same variant)
      const finishedAthletes = Array.from(room.athletes.values())
        .filter(
          (a) => a.variantId === athlete.variantId && a.status === "FINISHED"
        )
        .sort(
          (a, b) => (a.finishTimeMs ?? Infinity) - (b.finishTimeMs ?? Infinity)
        );
      athlete.rank = finishedAthletes.indexOf(athlete) + 1;

      // Broadcast finish
      io.to(eventRoom(eventId)).emit("liverace:athlete_finished", {
        eventId,
        userId,
        athleteName: athlete.name,
        rank: athlete.rank,
        finishTimeMs: athlete.finishTimeMs,
      });

      console.log(
        `[LiveRace] 🏆 ${athlete.name || userId} FINISHED in position ${athlete.rank} ` +
          `(${formatTimeMs(athlete.finishTimeMs)})`
      );
    }
  }

  // Update Redis (debounced — store position every N updates or by timer)
  if (isRedisAvailable()) {
    const redis = getRedis();
    const posKey = `live:event:${eventId}:positions`;
    // Fire and forget — we don't block on Redis writes in the hot path
    redis
      .hset(
        posKey,
        userId,
        JSON.stringify({
          lat: point.lat,
          lng: point.lng,
          ts: point.timestamp,
          dist: Math.round(newDistance),
          dev: Math.round(projection.deviationM),
          prog: Math.round(athlete.progressPercent * 10) / 10,
          status: athlete.status,
        })
      )
      .catch(() => {}); // Ignore Redis errors in hot path
    redis.expire(posKey, REDIS_EVENT_TTL_S).catch(() => {});
  }
}

// ─── Offline GPS Batch Processing ───────────────────────────────────────────

/**
 * Maximum number of buffered points accepted in a single batch.
 * Prevents abuse from a malicious client sending huge payloads.
 */
const MAX_BATCH_SIZE = 5000;

/**
 * Maximum age (ms) of a buffered point relative to the current time.
 * Points older than this are discarded (stale from a previous race, etc.).
 */
const MAX_POINT_AGE_MS = 24 * 60 * 60 * 1000; // 24 hours

/**
 * Process a batch of GPS points collected while the athlete was offline.
 *
 * Key differences from real-time `processGpsUpdate`:
 *  - Points are sorted by timestamp and replayed chronologically.
 *  - The anti-cheat speed check uses the *timestamps from the points*
 *    rather than wall-clock time, so it correctly handles historical gaps.
 *  - Progress reports are emitted periodically to give UI feedback.
 *  - Checkpoint and finish events are still emitted so they appear in the feed.
 *  - The position broadcast happens only once at the end (not per-point).
 *
 * Returns { processed, skipped, newCheckpoints }.
 */
export async function processGpsBatch(
  eventId: string,
  userId: string,
  rawPoints: GPSPoint[],
  io: LiveIO,
  socket?: LiveSocket
): Promise<{ processed: number; skipped: number; newCheckpoints: number }> {
  const startMs = Date.now();
  const room = rooms.get(eventId);
  if (!room) return { processed: 0, skipped: 0, newCheckpoints: 0 };

  const athlete = room.athletes.get(userId);
  if (!athlete) return { processed: 0, skipped: 0, newCheckpoints: 0 };

  // Only process during LIVE (in WARMUP we just store presence)
  if (room.status !== "LIVE" && room.status !== "WARMUP") {
    return { processed: 0, skipped: 0, newCheckpoints: 0 };
  }

  // Truncate to max batch size
  const cappedPoints = rawPoints.slice(0, MAX_BATCH_SIZE);

  // Sort by timestamp ascending (client may send out-of-order)
  const points = [...cappedPoints].sort((a, b) => a.timestamp - b.timestamp);

  // Filter out overly stale points
  const now = Date.now();
  const validPoints = points.filter(
    (p) => now - p.timestamp <= MAX_POINT_AGE_MS && p.timestamp <= now + 60_000
  );

  let processed = 0;
  let skipped = 0;
  let newCheckpoints = 0;

  // For WARMUP: just update last known position
  if (room.status === "WARMUP") {
    const lastPoint = validPoints[validPoints.length - 1];
    if (lastPoint) {
      athlete.currentPosition = lastPoint;
      athlete.lastUpdateAt = lastPoint.timestamp;
      athlete.status = "ACTIVE";
      processed = validPoints.length;
    }
    return {
      processed,
      skipped: cappedPoints.length - processed,
      newCheckpoints: 0,
    };
  }

  // ── LIVE: replay points chronologically ──────────────────────────────

  const routeHelper = room.routeHelpers.get(athlete.variantId);

  // Track a "previous" point for speed validation within the batch
  let prevPoint: GPSPoint | null = athlete.currentPosition;
  const PROGRESS_INTERVAL = 100; // emit progress every N points

  for (let i = 0; i < validPoints.length; i++) {
    const point = validPoints[i];

    // Accuracy filter
    if (!isAccuracyAcceptable(point.accuracy)) {
      skipped++;
      continue;
    }

    // Speed check using *point timestamps* (not wall-clock)
    if (prevPoint && prevPoint.timestamp > 0 && point.timestamp > 0) {
      const dtMs = point.timestamp - prevPoint.timestamp;
      if (dtMs > 0) {
        const dist = haversineForBatch(
          prevPoint.lat,
          prevPoint.lng,
          point.lat,
          point.lng
        );
        const speedKmh = dist / 1000 / (dtMs / 3_600_000);
        if (speedKmh > room.config.settings.maxSpeedKmh * 1.5) {
          // More lenient than realtime (×1.5) — GPS drift accumulates offline
          skipped++;
          continue;
        }
      }
    }

    if (!routeHelper) {
      // No route — just track position
      athlete.currentPosition = point;
      athlete.lastUpdateAt = point.timestamp;
      athlete.status = "ACTIVE";
      prevPoint = point;
      processed++;
      continue;
    }

    // Projection
    const projection = projectPointOnRouteNear(
      point.lat,
      point.lng,
      routeHelper.segments,
      findSegmentForDistance(routeHelper.segments, athlete.distanceAlongRouteM)
    );

    // Monotonic progress (with tolerance)
    const newDistance = Math.max(
      athlete.distanceAlongRouteM - 50,
      projection.distanceAlongRouteM
    );

    // Update athlete state
    athlete.currentPosition = point;
    athlete.lastUpdateAt = point.timestamp;
    athlete.distanceAlongRouteM = newDistance;
    athlete.deviationM = projection.deviationM;
    // Derive progressPercent from the monotonically clamped newDistance, not
    // from the raw projection. On out-and-back routes the projection may snap
    // to an earlier overlapping segment, causing a visible progress regression.
    athlete.progressPercent =
      routeHelper.totalDistanceM > 0
        ? Math.min(
            100,
            Math.max(0, (newDistance / routeHelper.totalDistanceM) * 100)
          )
        : 0;

    // Off-route detection (silent during batch — no per-point broadcast).
    // Uses the same hysteresis counter as real-time to stay consistent.
    if (athlete.status !== "FINISHED") {
      if (projection.deviationM > room.config.settings.deviationThresholdM) {
        athlete.consecutiveOffRouteCount++;
        if (
          athlete.status !== "OFF_ROUTE" &&
          athlete.consecutiveOffRouteCount >= 3
        ) {
          athlete.status = "OFF_ROUTE";
        }
      } else {
        athlete.consecutiveOffRouteCount = 0;
        if (
          athlete.status === "OFF_ROUTE" &&
          projection.deviationM <=
            room.config.settings.deviationThresholdM * 0.75
        ) {
          athlete.status = "ACTIVE";
        } else if (athlete.status !== "OFF_ROUTE") {
          athlete.status = "ACTIVE";
        }
      }
    }

    // Detect personal start: athlete exiting the START zone (batch replay)
    detectStartZoneExitBatch(room, athlete, point, prevPoint);

    // Checkpoint detection
    const reachedOrders = new Set(
      athlete.checkpointsReached.map((s) => {
        const cp = routeHelper.checkpoints.find((c) => c.id === s.checkpointId);
        return cp?.order ?? -1;
      })
    );

    const newCpIndices = detectNewCheckpoints(
      newDistance,
      point.lat,
      point.lng,
      routeHelper,
      reachedOrders,
      prevPoint?.lat,
      prevPoint?.lng
    );

    const raceStart =
      getAthleteRaceStart(room, athlete) ??
      getVariantStartTime(room, athlete.variantId) ??
      room.raceStartTime ??
      0;
    for (const cpIdx of newCpIndices) {
      const cp = routeHelper.checkpoints[cpIdx];
      const splitTimeMs = point.timestamp - raceStart;
      const split: CheckpointSplit = {
        checkpointId: cp.id,
        checkpointName: cp.name,
        reachedAt: point.timestamp,
        splitTimeMs,
      };
      athlete.checkpointsReached.push(split);
      athlete.lastCheckpointOrder = Math.max(
        athlete.lastCheckpointOrder,
        cp.order
      );
      newCheckpoints++;

      // Emit checkpoint event (batched checkpoints still show in the feed)
      io.to(eventRoom(eventId)).emit("liverace:checkpoint_reached", {
        eventId,
        userId,
        athleteName: athlete.name,
        checkpoint: split,
      });
    }

    // Finish detection
    if (athlete.status !== "FINISHED") {
      const finished = detectFinish(
        newDistance,
        point.lat,
        point.lng,
        routeHelper,
        prevPoint?.lat,
        prevPoint?.lng
      );
      if (finished) {
        athlete.status = "FINISHED";
        athlete.finishTimeMs = raceStart ? point.timestamp - raceStart : 0;

        const finishedAthletes = Array.from(room.athletes.values())
          .filter(
            (a) => a.variantId === athlete.variantId && a.status === "FINISHED"
          )
          .sort(
            (a, b) =>
              (a.finishTimeMs ?? Infinity) - (b.finishTimeMs ?? Infinity)
          );
        athlete.rank = finishedAthletes.indexOf(athlete) + 1;

        io.to(eventRoom(eventId)).emit("liverace:athlete_finished", {
          eventId,
          userId,
          athleteName: athlete.name,
          rank: athlete.rank,
          finishTimeMs: athlete.finishTimeMs,
        });
      }
    }

    prevPoint = point;
    processed++;

    // Yield the event loop every 500 points so real-time GPS updates from
    // other athletes are not blocked during a large batch replay.
    if (processed % 500 === 0) {
      await new Promise<void>((resolve) => setImmediate(resolve));
    }

    // Progress feedback (avoids flooding — every N points)
    if (socket && processed % PROGRESS_INTERVAL === 0) {
      socket.emit("liverace:sync_progress", {
        eventId,
        processed,
        total: validPoints.length,
      });
    }
  }

  // Final status broadcast after batch
  if (athlete.status !== "FINISHED") {
    io.to(eventRoom(eventId)).emit("liverace:athlete_status", {
      eventId,
      userId,
      status: athlete.status,
    });
  }

  // Emit personal start event if detected during batch
  if (athlete.personalStartTime !== null) {
    io.to(eventRoom(eventId)).emit("liverace:athlete_started", {
      eventId,
      userId,
      athleteName: athlete.name,
      personalStartTime: athlete.personalStartTime,
    });
  }

  // Update Redis with final position
  if (isRedisAvailable() && athlete.currentPosition) {
    const redis = getRedis();
    const posKey = `live:event:${eventId}:positions`;
    redis
      .hset(
        posKey,
        userId,
        JSON.stringify({
          lat: athlete.currentPosition.lat,
          lng: athlete.currentPosition.lng,
          ts: athlete.currentPosition.timestamp,
          dist: Math.round(athlete.distanceAlongRouteM),
          dev: Math.round(athlete.deviationM),
          prog: Math.round(athlete.progressPercent * 10) / 10,
          status: athlete.status,
        })
      )
      .catch(() => {});
    redis.expire(posKey, REDIS_EVENT_TTL_S).catch(() => {});
  }

  const durationMs = Date.now() - startMs;
  console.log(
    `[LiveRace] 📶 Sync batch for ${athlete.name || userId}: ` +
      `${processed} processed, ${skipped} skipped, ` +
      `${newCheckpoints} new checkpoints (${durationMs}ms)`
  );

  return { processed, skipped, newCheckpoints };
}

/** Haversine distance in meters (lightweight inlined for batch perf) */
function haversineForBatch(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6_371_000;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// ─── Leaderboard Computation ────────────────────────────────────────────────

export function computeLeaderboard(room: EventRoomState): LeaderboardEntry[] {
  const athletes = Array.from(room.athletes.values());

  // Group by variant so that a 10 km athlete is never ranked against a 50 km
  // athlete — raw distanceAlongRouteM is meaningless across different routes.
  const byVariant = new Map<string, typeof athletes>();
  for (const a of athletes) {
    const group = byVariant.get(a.variantId) ?? [];
    group.push(a);
    byVariant.set(a.variantId, group);
  }

  const leaderEntries: LeaderboardEntry[] = [];

  for (const [, group] of byVariant) {
    // Sort within each variant:
    // 1. Finished first (by finish time ascending)
    // 2. Then by distance along route descending
    // 3. Tie-breaker: last update timestamp
    group.sort((a, b) => {
      const aFinished = a.status === "FINISHED";
      const bFinished = b.status === "FINISHED";
      if (aFinished && !bFinished) return -1;
      if (!aFinished && bFinished) return 1;
      if (aFinished && bFinished) {
        return (a.finishTimeMs ?? Infinity) - (b.finishTimeMs ?? Infinity);
      }
      if (b.distanceAlongRouteM !== a.distanceAlongRouteM) {
        return b.distanceAlongRouteM - a.distanceAlongRouteM;
      }
      return (a.lastUpdateAt ?? 0) - (b.lastUpdateAt ?? 0);
    });

    // Assign per-variant ranks and compute gaps against the variant leader
    const leader = group[0];

    for (let i = 0; i < group.length; i++) {
      const a = group[i];
      const rank = i + 1;
      a.rank = rank;

      let gap: string | null = null;
      if (i > 0 && leader) {
        if (a.status === "FINISHED" && leader.status === "FINISHED") {
          const diffMs = (a.finishTimeMs ?? 0) - (leader.finishTimeMs ?? 0);
          gap = `+${formatTimeMs(diffMs)}`;
        } else {
          const distGap = leader.distanceAlongRouteM - a.distanceAlongRouteM;
          if (distGap > 1000) {
            gap = `+${(distGap / 1000).toFixed(1)}km`;
          } else {
            gap = `+${Math.round(distGap)}m`;
          }
        }
      }

      const lastCp =
        a.checkpointsReached.length > 0
          ? a.checkpointsReached[a.checkpointsReached.length - 1]
          : null;

      leaderEntries.push({
        rank,
        userId: a.userId,
        name: a.name,
        image: a.image,
        bibNumber: a.bibNumber,
        variantId: a.variantId,
        variantName: a.variantName,
        status: a.status,
        visibility: a.visibility,
        distanceAlongRouteM: Math.round(a.distanceAlongRouteM),
        progressPercent: Math.round(a.progressPercent * 10) / 10,
        lastCheckpointOrder: a.lastCheckpointOrder,
        lastCheckpointName: lastCp?.checkpointName ?? null,
        finishTimeMs: a.finishTimeMs,
        personalStartTime: a.personalStartTime,
        gap,
      });
    }
  }

  return leaderEntries;
}

// ─── Get Snapshot for New Spectators ────────────────────────────────────────

export function getSnapshot(eventId: string): {
  status: EventLiveStatus;
  raceStartTime: number | null;
  variantStartTimes: Record<string, number>;
  athletes: AthletePositionUpdate[];
  leaderboard: LeaderboardEntry[];
  spectatorCount: number;
} | null {
  const room = rooms.get(eventId);
  if (!room) return null;

  return {
    status: room.status,
    raceStartTime: room.raceStartTime,
    variantStartTimes: Object.fromEntries(room.variantStartTimes),
    athletes: getPositionUpdates(room),
    leaderboard: computeLeaderboard(room),
    spectatorCount: room.spectatorCount,
  };
}

// ─── Broadcast Timers ───────────────────────────────────────────────────────

function startBroadcastTimers(room: EventRoomState, io: LiveIO): void {
  const { positionBroadcastMs, leaderboardBroadcastMs, inactiveTimeoutMs } =
    room.config.settings;

  // Position broadcast — per-socket filtering applies athlete visibility
  // (PUBLIC / FRIENDS / ORGANIZER_ONLY). Without this loop every connected
  // client would receive the raw GPS of every athlete, leaking the position
  // of athletes who set their race to FRIENDS or ORGANIZER_ONLY.
  room.positionInterval = setInterval(() => {
    if (room.status !== "LIVE" && room.status !== "WARMUP") return;
    const positions = getPositionUpdates(room);
    if (positions.length === 0) return;
    void broadcastPositionsFiltered(room, io, positions);
  }, positionBroadcastMs);

  // Leaderboard broadcast — same per-socket filtering as positions.
  // Hidden athletes are anonymized (not dropped) to preserve ranking.
  room.leaderboardInterval = setInterval(() => {
    if (room.status !== "LIVE") return;
    const entries = computeLeaderboard(room);
    void broadcastLeaderboardFiltered(room, io, entries);
  }, leaderboardBroadcastMs);

  // Inactivity check
  room.inactivityCheckInterval = setInterval(() => {
    const now = Date.now();
    for (const [userId, athlete] of room.athletes) {
      if (
        athlete.status === "ACTIVE" &&
        now - athlete.lastUpdateAt > inactiveTimeoutMs
      ) {
        athlete.status = "INACTIVE";
        io.to(eventRoom(room.eventId)).emit("liverace:athlete_status", {
          eventId: room.eventId,
          userId,
          status: "INACTIVE",
        });
        console.log(
          `[LiveRace] ⚠️ Athlete ${athlete.name || userId} marked INACTIVE (no GPS for ${Math.round(inactiveTimeoutMs / 1000)}s)`
        );
      }
    }
  }, 10_000); // Check every 10s
}

// ─── Helpers ────────────────────────────────────────────────────────────────

/**
 * Find the START checkpoint for a given variant.
 */
function findStartCheckpoint(
  room: EventRoomState,
  variantId: string
): LiveConfigCheckpoint | null {
  const variant = room.config.variants.find((v) => v.variantId === variantId);
  if (!variant) return null;
  return variant.checkpoints.find((cp) => cp.type === "START") ?? null;
}

/**
 * Check if a GPS point is inside a checkpoint's radius.
 */
function isInsideCheckpointZone(
  lat: number,
  lng: number,
  checkpoint: LiveConfigCheckpoint
): boolean {
  const dist = haversineM(lat, lng, checkpoint.latitude, checkpoint.longitude);
  return dist <= checkpoint.radiusM;
}

/**
 * Detect if an athlete has crossed the START line.
 *
 * Primary: gate-line crossing — the GPS segment (prev → curr) intersects
 * the perpendicular START line on the route.
 *
 * Fallback (no previous point / no route helper): zone-exit detection
 * (inside → outside the START checkpoint radius).
 *
 * Only triggers if the variant's gun time has passed.
 */
function detectStartZoneExit(
  room: EventRoomState,
  athlete: AthleteState,
  point: GPSPoint,
  io: LiveIO
): void {
  // Already has a personal start time — nothing to do
  if (athlete.personalStartTime !== null) return;

  // Variant must have started (gun time)
  const variantStart = getVariantStartTime(room, athlete.variantId);
  if (!variantStart) return;

  const startCp = findStartCheckpoint(room, athlete.variantId);
  if (!startCp) {
    // No START checkpoint defined — fall back to variant gun time
    athlete.personalStartTime = variantStart;
    return;
  }

  // ── Primary: gate-line crossing ─────────────────────────────────────
  const routeHelper = room.routeHelpers.get(athlete.variantId);
  if (routeHelper && athlete.currentPosition) {
    const crossed = detectStartLineCrossing(
      athlete.currentPosition.lat,
      athlete.currentPosition.lng,
      point.lat,
      point.lng,
      routeHelper
    );

    if (crossed) {
      athlete.personalStartTime = point.timestamp || Date.now();

      io.to(eventRoom(room.eventId)).emit("liverace:athlete_started", {
        eventId: room.eventId,
        userId: athlete.userId,
        athleteName: athlete.name,
        personalStartTime: athlete.personalStartTime,
      });

      console.log(
        `[LiveRace] ⏱️ ${athlete.name || athlete.userId} personal start ` +
          `(crossed START line) at ${new Date(athlete.personalStartTime).toISOString()}`
      );
      return;
    }
  }

  // ── Fallback: zone-exit detection (no prev point or no route) ───────
  const isInside = isInsideCheckpointZone(point.lat, point.lng, startCp);

  if (isInside) {
    // Mark that we've seen the athlete inside the START zone
    athlete.wasInsideStartZone = true;
    return;
  }

  // Athlete is OUTSIDE the start zone
  if (athlete.wasInsideStartZone) {
    // Was inside, now outside → personal start!
    athlete.personalStartTime = point.timestamp || Date.now();

    io.to(eventRoom(room.eventId)).emit("liverace:athlete_started", {
      eventId: room.eventId,
      userId: athlete.userId,
      athleteName: athlete.name,
      personalStartTime: athlete.personalStartTime,
    });

    console.log(
      `[LiveRace] ⏱️ ${athlete.name || athlete.userId} personal start ` +
        `(exited START zone — fallback) at ${new Date(athlete.personalStartTime).toISOString()}`
    );
  }
  // If never seen inside and is outside — we don't start yet.
  // The athlete needs to be detected inside the START zone first,
  // then exit it. This prevents false starts from distant GPS signals.
}

/**
 * Silent version of detectStartZoneExit for batch replay.
 * Same gate-line crossing logic but does not emit WebSocket events.
 */
function detectStartZoneExitBatch(
  room: EventRoomState,
  athlete: AthleteState,
  point: GPSPoint,
  prevPoint?: GPSPoint | null
): void {
  if (athlete.personalStartTime !== null) return;

  const variantStart = getVariantStartTime(room, athlete.variantId);
  if (!variantStart) return;

  const startCp = findStartCheckpoint(room, athlete.variantId);
  if (!startCp) {
    athlete.personalStartTime = variantStart;
    return;
  }

  // ── Primary: gate-line crossing ─────────────────────────────────────
  const routeHelper = room.routeHelpers.get(athlete.variantId);
  if (routeHelper && prevPoint) {
    const crossed = detectStartLineCrossing(
      prevPoint.lat,
      prevPoint.lng,
      point.lat,
      point.lng,
      routeHelper
    );

    if (crossed) {
      athlete.personalStartTime = point.timestamp || Date.now();
      return;
    }
  }

  // ── Fallback: zone-exit detection ───────────────────────────────────
  const isInside = isInsideCheckpointZone(point.lat, point.lng, startCp);

  if (isInside) {
    athlete.wasInsideStartZone = true;
    return;
  }

  if (athlete.wasInsideStartZone) {
    athlete.personalStartTime = point.timestamp || Date.now();
  }
}

/**
 * Get the effective race start time for an athlete's timing calculations.
 * Priority: personalStartTime > variantStartTime > raceStartTime
 */
export function getAthleteRaceStart(
  room: EventRoomState,
  athlete: AthleteState
): number | null {
  // Personal chip time (exited START zone)
  if (athlete.personalStartTime !== null) return athlete.personalStartTime;

  // Fallback: variant gun time
  return getVariantStartTime(room, athlete.variantId);
}

function getPositionUpdates(room: EventRoomState): AthletePositionUpdate[] {
  const updates: AthletePositionUpdate[] = [];

  for (const athlete of room.athletes.values()) {
    if (!athlete.currentPosition) continue;

    updates.push({
      userId: athlete.userId,
      name: athlete.name,
      bibNumber: athlete.bibNumber,
      lat: athlete.currentPosition.lat,
      lng: athlete.currentPosition.lng,
      status: athlete.status,
      visibility: athlete.visibility,
      distanceAlongRouteM: Math.round(athlete.distanceAlongRouteM),
      progressPercent: Math.round(athlete.progressPercent * 10) / 10,
      rank: athlete.rank,
      deviationM: Math.round(athlete.deviationM),
    });
  }

  return updates;
}

function findSegmentForDistance(
  segments: { cumulativeDistanceM: number; lengthM: number }[],
  distanceM: number
): number {
  for (let i = 0; i < segments.length; i++) {
    if (
      distanceM >= segments[i].cumulativeDistanceM &&
      distanceM <= segments[i].cumulativeDistanceM + segments[i].lengthM
    ) {
      return i;
    }
  }
  return segments.length - 1;
}

function formatTimeMs(ms: number): string {
  const totalSecs = Math.floor(ms / 1000);
  const hours = Math.floor(totalSecs / 3600);
  const mins = Math.floor((totalSecs % 3600) / 60);
  const secs = totalSecs % 60;
  if (hours > 0) {
    return `${hours}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

async function persistFinalResults(room: EventRoomState): Promise<void> {
  const allAthletes = Array.from(room.athletes.values());

  // Group finished athletes by variant for per-variant ranking
  const finishedByVariant = new Map<string, AthleteState[]>();
  for (const a of allAthletes) {
    if (a.status === "FINISHED" && a.finishTimeMs !== null) {
      const list = finishedByVariant.get(a.variantId) ?? [];
      list.push(a);
      finishedByVariant.set(a.variantId, list);
    }
  }

  const results: {
    userId: string;
    variantId: string;
    rank: number;
    finishTimeMs: number;
    status: "FINISHED" | "DNF";
  }[] = [];

  // Rank per variant
  for (const [, athletes] of finishedByVariant) {
    athletes.sort((a, b) => (a.finishTimeMs ?? 0) - (b.finishTimeMs ?? 0));
    for (let i = 0; i < athletes.length; i++) {
      results.push({
        userId: athletes[i].userId,
        variantId: athletes[i].variantId,
        rank: i + 1,
        finishTimeMs: athletes[i].finishTimeMs!,
        status: "FINISHED",
      });
    }
  }

  if (results.length === 0 && allAthletes.length === 0) return;

  // Also add DNF athletes
  const dnfAthletes = allAthletes.filter(
    (a) => a.status !== "FINISHED" && a.status !== "DSQ"
  );
  for (const a of dnfAthletes) {
    results.push({
      userId: a.userId,
      variantId: a.variantId,
      rank: 0,
      finishTimeMs: 0,
      status: "DNF",
    });
  }

  try {
    const resp = await persistResults(room.eventId, results);
    console.log(
      `[LiveRace] 💾 Persisted ${resp.persisted} results for event ${room.eventId}`
    );
  } catch (err) {
    console.error(`[LiveRace] Failed to persist results:`, err);
  }
}

// ─── Filtered Broadcast Helpers ─────────────────────────────────────────────

/**
 * Emit per-socket filtered position updates to every client in the event room.
 * Each viewer gets only the athletes they are allowed to see based on the
 * athlete's visibility setting (PUBLIC / FRIENDS / ORGANIZER_ONLY) combined
 * with the viewer's friendship graph.
 *
 * This is deliberately per-socket: using `io.to(room).emit(...)` would send
 * the unfiltered payload to every viewer, defeating the privacy system.
 */
async function broadcastPositionsFiltered(
  room: EventRoomState,
  io: LiveIO,
  positions: AthletePositionUpdate[]
): Promise<void> {
  try {
    const sockets = await io.in(eventRoom(room.eventId)).fetchSockets();
    if (sockets.length === 0) return;

    // Fast path: if all athletes are PUBLIC, no filtering is required.
    const allPublic = positions.every((p) => p.visibility === "PUBLIC");
    if (allPublic) {
      io.to(eventRoom(room.eventId)).emit("liverace:positions", {
        eventId: room.eventId,
        athletes: positions,
      });
      return;
    }

    for (const socket of sockets) {
      const viewerUserId = socket.data.userId as string | undefined;
      const friendIds = await getSpectatorFriends(viewerUserId);
      const filtered = filterPositionsForViewer(
        positions,
        viewerUserId,
        friendIds,
        false
      );
      if (filtered.length > 0) {
        socket.emit("liverace:positions", {
          eventId: room.eventId,
          athletes: filtered,
        });
      }
    }
  } catch (err) {
    console.error("[LiveRace] broadcastPositionsFiltered failed:", err);
  }
}

/**
 * Emit per-socket filtered leaderboard updates. Hidden athletes are kept in
 * the list (to preserve rank/gap) but anonymized — see filterLeaderboardForViewer.
 */
async function broadcastLeaderboardFiltered(
  room: EventRoomState,
  io: LiveIO,
  entries: LeaderboardEntry[]
): Promise<void> {
  try {
    const sockets = await io.in(eventRoom(room.eventId)).fetchSockets();
    if (sockets.length === 0) return;

    const allPublic = entries.every((e) => e.visibility === "PUBLIC");
    if (allPublic) {
      io.to(eventRoom(room.eventId)).emit("liverace:leaderboard", {
        eventId: room.eventId,
        entries,
        timestamp: Date.now(),
      });
      return;
    }

    const timestamp = Date.now();
    for (const socket of sockets) {
      const viewerUserId = socket.data.userId as string | undefined;
      const friendIds = await getSpectatorFriends(viewerUserId);
      const filtered = filterLeaderboardForViewer(
        entries,
        viewerUserId,
        friendIds,
        false
      );
      socket.emit("liverace:leaderboard", {
        eventId: room.eventId,
        entries: filtered,
        timestamp,
      });
    }
  } catch (err) {
    console.error("[LiveRace] broadcastLeaderboardFiltered failed:", err);
  }
}

// ─── Spectator Friend Cache ─────────────────────────────────────────────────

/**
 * Cache spectator friend lists so we don't call the internal API every broadcast.
 * Key: spectatorUserId → Set of accepted friend IDs.
 * TTL: refreshed every 60 seconds or on first access.
 */
const spectatorFriendsCache = new Map<
  string,
  { friendIds: Set<string>; fetchedAt: number }
>();

const FRIEND_CACHE_TTL_MS = 60_000; // 60 seconds

/**
 * Get friend IDs for a spectator (cached).
 * Returns empty set for anonymous spectators.
 */
export async function getSpectatorFriends(
  spectatorUserId: string | undefined
): Promise<Set<string>> {
  if (!spectatorUserId) return new Set();

  const cached = spectatorFriendsCache.get(spectatorUserId);
  if (cached && Date.now() - cached.fetchedAt < FRIEND_CACHE_TTL_MS) {
    return cached.friendIds;
  }

  try {
    const result = await fetchFriendIds(spectatorUserId);
    const friendSet = new Set(result.friendIds);
    spectatorFriendsCache.set(spectatorUserId, {
      friendIds: friendSet,
      fetchedAt: Date.now(),
    });
    return friendSet;
  } catch (err) {
    console.error(
      `[LiveRace] Failed to fetch friends for spectator ${spectatorUserId}:`,
      err
    );
    return cached?.friendIds ?? new Set();
  }
}

/**
 * Clear friend cache for a spectator (e.g. on disconnect).
 */
export function clearSpectatorFriendsCache(
  spectatorUserId: string | undefined
): void {
  if (spectatorUserId) {
    spectatorFriendsCache.delete(spectatorUserId);
  }
}

// ─── Visibility Filtering ───────────────────────────────────────────────────

/**
 * Filter leaderboard entries based on visibility rules for a given viewer.
 *
 * Rules:
 * - PUBLIC athletes → always visible to everyone
 * - FRIENDS athletes → visible only to their friends, the athlete themselves, and event organizers
 * - ORGANIZER_ONLY athletes → visible only to event organizers (and the athlete themselves)
 *
 * Hidden athletes are replaced with anonymized entries to preserve ranking integrity.
 */
export function filterLeaderboardForViewer(
  entries: LeaderboardEntry[],
  viewerUserId: string | undefined,
  viewerFriendIds: Set<string>,
  isOrganizer: boolean
): LeaderboardEntry[] {
  return entries.map((entry) => {
    if (isOrganizer) return entry;
    if (entry.visibility === "PUBLIC") return entry;
    if (viewerUserId && entry.userId === viewerUserId) return entry;

    if (entry.visibility === "FRIENDS") {
      if (viewerUserId && viewerFriendIds.has(entry.userId)) return entry;
    }

    // Hidden: anonymize the entry but keep position/rank for leaderboard integrity
    return {
      ...entry,
      name: null,
      image: null,
      bibNumber: null,
    };
  });
}

/**
 * Filter athlete position updates based on visibility rules for a given viewer.
 * Hidden athletes are completely excluded from position broadcasts (no GPS leak).
 */
export function filterPositionsForViewer(
  positions: AthletePositionUpdate[],
  viewerUserId: string | undefined,
  viewerFriendIds: Set<string>,
  isOrganizer: boolean
): AthletePositionUpdate[] {
  return positions.filter((pos) => {
    if (isOrganizer) return true;
    if (pos.visibility === "PUBLIC") return true;
    if (viewerUserId && pos.userId === viewerUserId) return true;

    if (pos.visibility === "FRIENDS") {
      return viewerUserId ? viewerFriendIds.has(pos.userId) : false;
    }

    // ORGANIZER_ONLY → not visible to non-organizers
    return false;
  });
}
