// ============================================================================
// Athlifyr Live Server — LiveRace Type Definitions
// ============================================================================

// ─── Event / Race States ────────────────────────────────────────────────────

export type EventLiveStatus =
  | "SCHEDULED"
  | "CHECK_IN_OPEN"
  | "WARMUP"
  | "LIVE"
  | "PAUSED"
  | "FINISHED"
  | "CANCELLED";

export type AthleteStatus =
  | "ACTIVE"
  | "INACTIVE"
  | "OFF_ROUTE"
  | "FINISHED"
  | "DNF"
  | "DSQ";

export type LiveRaceVisibility = "PUBLIC" | "FRIENDS" | "ORGANIZER_ONLY";

export type CheckpointType = "START" | "FINISH" | "INTERMEDIATE" | "TRANSITION";

// ─── Config from Next.js API ────────────────────────────────────────────────

export interface LiveConfigCheckpoint {
  id: string;
  name: string;
  type: CheckpointType;
  order: number;
  latitude: number;
  longitude: number;
  radiusM: number;
  cutoffMin: number | null;
}

export interface LiveConfigVariant {
  variantId: string;
  variantName: string;
  distanceKm: number;
  elevationGainM: number;
  elevationLossM: number;
  startDate: string;
  startTime: string | null;
  cutoffTimeHours: number | null;
  routePoints: [number, number][];
  checkpoints: LiveConfigCheckpoint[];
}

export interface LiveConfigSettings {
  deviationThresholdM: number;
  minUpdateFrequencyMs: number;
  inactiveTimeoutMs: number;
  maxSpeedKmh: number;
  leaderboardBroadcastMs: number;
  positionBroadcastMs: number;
}

export interface LiveConfig {
  eventId: string;
  title: string;
  slug: string;
  startDate: string;
  endDate: string | null;
  liveStatus: EventLiveStatus;
  city: string;
  country: string;
  settings: LiveConfigSettings;
  variants: LiveConfigVariant[];
}

// ─── Athlete State (in-memory/Redis) ────────────────────────────────────────

export interface GPSPoint {
  lat: number;
  lng: number;
  timestamp: number; // unix ms
  accuracy?: number; // meters
  speed?: number; // m/s
  altitude?: number;
}

export interface CheckpointSplit {
  checkpointId: string;
  checkpointName: string;
  reachedAt: number; // unix ms
  splitTimeMs: number; // time from race start
}

export interface AthleteState {
  userId: string;
  name: string | null;
  image: string | null;
  variantId: string;
  variantName: string;
  bibNumber: string | null;
  status: AthleteStatus;
  visibility: LiveRaceVisibility;

  // Current position
  currentPosition: GPSPoint | null;
  lastUpdateAt: number; // unix ms

  // Personal start (chip time)
  // The timer starts when the athlete EXITS the START zone, not at the gun.
  personalStartTime: number | null; // unix ms when this athlete left the START zone
  wasInsideStartZone: boolean; // tracking flag for start zone exit detection

  // Route progress
  distanceAlongRouteM: number; // meters from start along the route polyline
  deviationM: number; // perpendicular distance from route
  progressPercent: number; // 0-100
  /** Consecutive GPS points exceeding the deviation threshold. Used for
   *  hysteresis: only transition to OFF_ROUTE after N consecutive off-route
   *  points, preventing single-point oscillation from noisy GPS. */
  consecutiveOffRouteCount: number;

  // Checkpoint tracking
  checkpointsReached: CheckpointSplit[];
  lastCheckpointOrder: number;

  // Ranking
  rank: number;

  // Finish
  finishTimeMs: number | null; // total race time in ms (null if not finished)
}

// ─── Leaderboard Entry ──────────────────────────────────────────────────────

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  name: string | null;
  image: string | null;
  bibNumber: string | null;
  variantId: string;
  variantName: string;
  status: AthleteStatus;
  visibility: LiveRaceVisibility;
  distanceAlongRouteM: number;
  progressPercent: number;
  lastCheckpointOrder: number;
  lastCheckpointName: string | null;
  finishTimeMs: number | null;
  personalStartTime: number | null; // unix ms — null means not yet exited START zone
  gap: string | null; // e.g. "+1:23" or "+500m"
}

// ─── Event Room State ───────────────────────────────────────────────────────

export interface EventRoomState {
  eventId: string;
  config: LiveConfig;
  status: EventLiveStatus;
  raceStartTime: number | null; // unix ms when first variant started (backward compat)
  variantStartTimes: Map<string, number>; // variantId → unix ms when that variant started
  athletes: Map<string, AthleteState>; // userId → AthleteState
  spectatorCount: number;

  // Precomputed route helpers (per variant)
  routeHelpers: Map<string, RouteHelper>;

  // Timers
  variantStartTimers: Map<string, ReturnType<typeof setTimeout>>; // variantId → scheduled timer
  leaderboardInterval: ReturnType<typeof setInterval> | null;
  positionInterval: ReturnType<typeof setInterval> | null;
  inactivityCheckInterval: ReturnType<typeof setInterval> | null;
}

// ─── Route Helper (precomputed for fast projection) ─────────────────────────

export interface RouteSegment {
  startIdx: number;
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
  /** Cumulative distance (m) at the START of this segment */
  cumulativeDistanceM: number;
  /** Length of this individual segment (m) */
  lengthM: number;
}

/**
 * A "gate line" perpendicular to the route at a checkpoint.
 * Used for precise START/FINISH line-crossing detection.
 */
export interface GateLine {
  /** Index into routeHelper.checkpoints */
  checkpointIdx: number;
  /** Endpoint A of the perpendicular line */
  aLat: number;
  aLng: number;
  /** Endpoint B of the perpendicular line */
  bLat: number;
  bLng: number;
  /** Distance along the route (m) at this gate — for ordering / sanity checks */
  distanceAlongRouteM: number;
}

export interface RouteHelper {
  variantId: string;
  totalDistanceM: number;
  segments: RouteSegment[];
  checkpoints: LiveConfigCheckpoint[];
  /** Cumulative distance at each checkpoint (precomputed) */
  checkpointDistancesM: number[];
  /** Precomputed gate lines for START / FINISH checkpoints */
  gateLines: GateLine[];
}

// ─── WebSocket Events (Client ↔ Server) ─────────────────────────────────────

/** Client → Server: LiveRace events */
export interface LiveRaceClientToServerEvents {
  "liverace:join_athlete": (data: { eventId: string }) => void;
  "liverace:join_spectator": (data: { eventId: string }) => void;
  "liverace:leave": (data: { eventId: string }) => void;
  "liverace:gps_update": (data: {
    eventId: string;
    point: Omit<GPSPoint, "timestamp"> & { timestamp?: number };
  }) => void;
  /** Batch of buffered GPS points collected while the athlete was offline */
  "liverace:gps_batch": (data: {
    eventId: string;
    points: (Omit<GPSPoint, "timestamp"> & { timestamp: number })[];
  }) => void;
}

/** Server → Client: LiveRace events */
export interface LiveRaceServerToClientEvents {
  // Connection
  "liverace:joined": (data: {
    eventId: string;
    status: EventLiveStatus;
    role: "athlete" | "spectator";
    serverTime: number; // unix ms — used by client to compute clock offset for countdown sync
    variantStartTimes?: Record<string, number>; // variantId → scheduled start (unix ms)
  }) => void;
  "liverace:error": (data: { message: string; code: string }) => void;

  // State changes
  "liverace:status_changed": (data: {
    eventId: string;
    status: EventLiveStatus;
    raceStartTime?: number;
    variantStartTimes?: Record<string, number>; // variantId → unix ms
  }) => void;

  // Variant-level start (fired when each variant's gun goes off)
  "liverace:variant_started": (data: {
    eventId: string;
    variantId: string;
    variantName: string;
    raceStartTime: number; // unix ms for this variant
  }) => void;

  // Athlete positions (broadcast to spectators)
  "liverace:positions": (data: {
    eventId: string;
    athletes: AthletePositionUpdate[];
  }) => void;

  // Leaderboard
  "liverace:leaderboard": (data: {
    eventId: string;
    entries: LeaderboardEntry[];
    timestamp: number;
  }) => void;

  // Individual events
  "liverace:athlete_joined": (data: {
    eventId: string;
    athlete: Pick<
      AthleteState,
      "userId" | "name" | "image" | "bibNumber" | "variantId" | "variantName"
    >;
  }) => void;
  "liverace:athlete_left": (data: { eventId: string; userId: string }) => void;
  "liverace:checkpoint_reached": (data: {
    eventId: string;
    userId: string;
    athleteName: string | null;
    checkpoint: CheckpointSplit;
  }) => void;
  "liverace:athlete_finished": (data: {
    eventId: string;
    userId: string;
    athleteName: string | null;
    rank: number;
    finishTimeMs: number;
  }) => void;
  "liverace:athlete_started": (data: {
    eventId: string;
    userId: string;
    athleteName: string | null;
    personalStartTime: number; // unix ms when this athlete exited the START zone
  }) => void;
  "liverace:athlete_status": (data: {
    eventId: string;
    userId: string;
    status: AthleteStatus;
  }) => void;

  // Spectator count
  "liverace:spectator_count": (data: {
    eventId: string;
    count: number;
  }) => void;

  // Offline sync feedback
  "liverace:sync_progress": (data: {
    eventId: string;
    processed: number;
    total: number;
  }) => void;
  "liverace:sync_complete": (data: {
    eventId: string;
    processed: number;
    skipped: number;
    newCheckpoints: number;
    durationMs: number;
  }) => void;
}

// ─── Position Update (for broadcast) ────────────────────────────────────────

export interface AthletePositionUpdate {
  userId: string;
  name: string | null;
  bibNumber: string | null;
  lat: number;
  lng: number;
  status: AthleteStatus;
  visibility: LiveRaceVisibility;
  distanceAlongRouteM: number;
  progressPercent: number;
  rank: number;
  deviationM: number;
}
