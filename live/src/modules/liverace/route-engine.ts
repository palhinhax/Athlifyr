// ============================================================================
// Athlifyr Live Server — Route Computation Engine
//
// Core geo-math for:
//   1. Precomputing route segments from a polyline
//   2. Projecting a GPS point onto the nearest route segment
//   3. Computing distance along route and deviation
//   4. Detecting checkpoint passage
//   5. Anti-cheat sanity checks
// ============================================================================

import type {
  RouteHelper,
  RouteSegment,
  GPSPoint,
  LiveConfigCheckpoint,
} from "./liverace.types.js";

const EARTH_RADIUS_M = 6_371_000;

// ─── Haversine Distance (meters) ────────────────────────────────────────────

export function haversineM(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return EARTH_RADIUS_M * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// ─── Bearing between two points (degrees) ───────────────────────────────────

function bearingDeg(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const r1 = (lat1 * Math.PI) / 180;
  const r2 = (lat2 * Math.PI) / 180;
  const y = Math.sin(dLng) * Math.cos(r2);
  const x =
    Math.cos(r1) * Math.sin(r2) - Math.sin(r1) * Math.cos(r2) * Math.cos(dLng);
  return ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360;
}

// ─── Cross-track distance: perpendicular distance from point to great circle ─

function crossTrackDistanceM(
  pointLat: number,
  pointLng: number,
  segStartLat: number,
  segStartLng: number,
  segEndLat: number,
  segEndLng: number
): number {
  const d13 = haversineM(segStartLat, segStartLng, pointLat, pointLng);
  const b13 =
    (bearingDeg(segStartLat, segStartLng, pointLat, pointLng) * Math.PI) / 180;
  const b12 =
    (bearingDeg(segStartLat, segStartLng, segEndLat, segEndLng) * Math.PI) /
    180;
  return Math.abs(
    Math.asin(Math.sin(d13 / EARTH_RADIUS_M) * Math.sin(b13 - b12)) *
      EARTH_RADIUS_M
  );
}

// ─── Along-track distance: distance from seg start to projection point ──────

function alongTrackDistanceM(
  pointLat: number,
  pointLng: number,
  segStartLat: number,
  segStartLng: number,
  segEndLat: number,
  segEndLng: number
): number {
  const d13 = haversineM(segStartLat, segStartLng, pointLat, pointLng);
  const crossTrack = crossTrackDistanceM(
    pointLat,
    pointLng,
    segStartLat,
    segStartLng,
    segEndLat,
    segEndLng
  );
  return (
    Math.acos(
      Math.cos(d13 / EARTH_RADIUS_M) / Math.cos(crossTrack / EARTH_RADIUS_M)
    ) * EARTH_RADIUS_M
  );
}

// ─── Precompute Route Helper ────────────────────────────────────────────────

export function buildRouteHelper(
  variantId: string,
  routePoints: [number, number][],
  checkpoints: LiveConfigCheckpoint[]
): RouteHelper {
  const segments: RouteSegment[] = [];
  let cumulativeDistance = 0;

  for (let i = 0; i < routePoints.length - 1; i++) {
    const [startLat, startLng] = routePoints[i];
    const [endLat, endLng] = routePoints[i + 1];
    const lengthM = haversineM(startLat, startLng, endLat, endLng);

    segments.push({
      startIdx: i,
      startLat,
      startLng,
      endLat,
      endLng,
      cumulativeDistanceM: cumulativeDistance,
      lengthM,
    });

    cumulativeDistance += lengthM;
  }

  // Precompute checkpoint distances along the route
  const checkpointDistancesM = checkpoints.map((cp) => {
    const projection = projectPointOnRoute(cp.latitude, cp.longitude, segments);
    return projection.distanceAlongRouteM;
  });

  return {
    variantId,
    totalDistanceM: cumulativeDistance,
    segments,
    checkpoints,
    checkpointDistancesM,
  };
}

// ─── Point Projection Result ────────────────────────────────────────────────

export interface ProjectionResult {
  /** Distance along the route from start to projected point (meters) */
  distanceAlongRouteM: number;
  /** Perpendicular distance from the route (deviation, meters) */
  deviationM: number;
  /** Index of the nearest segment */
  segmentIndex: number;
  /** Progress percentage (0–100) */
  progressPercent: number;
}

// ─── Project Point onto Route ───────────────────────────────────────────────

export function projectPointOnRoute(
  lat: number,
  lng: number,
  segments: RouteSegment[]
): ProjectionResult {
  if (segments.length === 0) {
    return {
      distanceAlongRouteM: 0,
      deviationM: 0,
      segmentIndex: 0,
      progressPercent: 0,
    };
  }

  let bestDeviation = Infinity;
  let bestDistanceAlong = 0;
  let bestSegIdx = 0;

  const totalDistance =
    segments.length > 0
      ? segments[segments.length - 1].cumulativeDistanceM +
        segments[segments.length - 1].lengthM
      : 0;

  for (let i = 0; i < segments.length; i++) {
    const seg = segments[i];

    // Cross-track (perpendicular) distance
    const crossDist = crossTrackDistanceM(
      lat,
      lng,
      seg.startLat,
      seg.startLng,
      seg.endLat,
      seg.endLng
    );

    // Along-track distance from segment start
    let alongDist = alongTrackDistanceM(
      lat,
      lng,
      seg.startLat,
      seg.startLng,
      seg.endLat,
      seg.endLng
    );

    // Clamp to segment bounds
    if (alongDist < 0) alongDist = 0;
    if (alongDist > seg.lengthM) alongDist = seg.lengthM;

    // Recalculate deviation if clamped (point is beyond segment endpoints)
    let deviation = crossDist;
    if (alongDist <= 0) {
      deviation = haversineM(lat, lng, seg.startLat, seg.startLng);
    } else if (alongDist >= seg.lengthM) {
      deviation = haversineM(lat, lng, seg.endLat, seg.endLng);
    }

    if (deviation < bestDeviation) {
      bestDeviation = deviation;
      bestDistanceAlong = seg.cumulativeDistanceM + alongDist;
      bestSegIdx = i;
    }
  }

  const progressPercent =
    totalDistance > 0
      ? Math.min(100, Math.max(0, (bestDistanceAlong / totalDistance) * 100))
      : 0;

  return {
    distanceAlongRouteM: bestDistanceAlong,
    deviationM: bestDeviation,
    segmentIndex: bestSegIdx,
    progressPercent,
  };
}

// ─── Optimised Projection (search near previous segment first) ──────────────

/**
 * Project a point with a hint about the previous segment index.
 * Searches ±searchRadius segments first for speed, then falls back to full scan.
 */
export function projectPointOnRouteNear(
  lat: number,
  lng: number,
  segments: RouteSegment[],
  previousSegIdx: number,
  searchRadius = 10
): ProjectionResult {
  if (segments.length === 0) {
    return {
      distanceAlongRouteM: 0,
      deviationM: 0,
      segmentIndex: 0,
      progressPercent: 0,
    };
  }

  const totalDistance =
    segments[segments.length - 1].cumulativeDistanceM +
    segments[segments.length - 1].lengthM;

  // Search within a local window first
  const startIdx = Math.max(0, previousSegIdx - searchRadius);
  const endIdx = Math.min(segments.length - 1, previousSegIdx + searchRadius);

  let bestDeviation = Infinity;
  let bestDistanceAlong = 0;
  let bestSegIdx = 0;

  for (let i = startIdx; i <= endIdx; i++) {
    const seg = segments[i];
    const crossDist = crossTrackDistanceM(
      lat,
      lng,
      seg.startLat,
      seg.startLng,
      seg.endLat,
      seg.endLng
    );

    let alongDist = alongTrackDistanceM(
      lat,
      lng,
      seg.startLat,
      seg.startLng,
      seg.endLat,
      seg.endLng
    );

    if (alongDist < 0) alongDist = 0;
    if (alongDist > seg.lengthM) alongDist = seg.lengthM;

    let deviation = crossDist;
    if (alongDist <= 0) {
      deviation = haversineM(lat, lng, seg.startLat, seg.startLng);
    } else if (alongDist >= seg.lengthM) {
      deviation = haversineM(lat, lng, seg.endLat, seg.endLng);
    }

    if (deviation < bestDeviation) {
      bestDeviation = deviation;
      bestDistanceAlong = seg.cumulativeDistanceM + alongDist;
      bestSegIdx = i;
    }
  }

  // If the local result has reasonable deviation, return it without full scan
  if (bestDeviation < 500) {
    return {
      distanceAlongRouteM: bestDistanceAlong,
      deviationM: bestDeviation,
      segmentIndex: bestSegIdx,
      progressPercent: Math.min(
        100,
        Math.max(0, (bestDistanceAlong / totalDistance) * 100)
      ),
    };
  }

  // Fall back to full scan
  return projectPointOnRoute(lat, lng, segments);
}

// ─── Checkpoint Detection ───────────────────────────────────────────────────

/**
 * Check if the athlete has reached new checkpoints based on their progress.
 * Returns the indices (into the checkpoints array) of newly reached checkpoints.
 */
export function detectNewCheckpoints(
  distanceAlongRouteM: number,
  lat: number,
  lng: number,
  routeHelper: RouteHelper,
  alreadyReachedOrders: Set<number>
): number[] {
  const newlyReached: number[] = [];

  for (let i = 0; i < routeHelper.checkpoints.length; i++) {
    const cp = routeHelper.checkpoints[i];

    // Skip already reached
    if (alreadyReachedOrders.has(cp.order)) continue;

    // Two detection methods:
    // 1. Distance-based: athlete's route distance has passed the checkpoint's route distance
    const cpDistanceM = routeHelper.checkpointDistancesM[i];
    const passedByDistance = distanceAlongRouteM >= cpDistanceM - 50; // 50m tolerance

    // 2. Proximity-based: athlete is within the checkpoint's radius
    const distToCheckpoint = haversineM(lat, lng, cp.latitude, cp.longitude);
    const withinRadius = distToCheckpoint <= cp.radiusM;

    if (passedByDistance || withinRadius) {
      newlyReached.push(i);
    }
  }

  return newlyReached;
}

// ─── Finish Detection ───────────────────────────────────────────────────────

/**
 * Check if the athlete has crossed the finish line.
 * The finish is the last checkpoint with type "FINISH".
 */
export function detectFinish(
  distanceAlongRouteM: number,
  lat: number,
  lng: number,
  routeHelper: RouteHelper
): boolean {
  const finishCp = routeHelper.checkpoints.find((cp) => cp.type === "FINISH");
  if (!finishCp) {
    // No explicit finish checkpoint — use route end
    return distanceAlongRouteM >= routeHelper.totalDistanceM - 50;
  }

  const finishIdx = routeHelper.checkpoints.indexOf(finishCp);
  const finishDistanceM = routeHelper.checkpointDistancesM[finishIdx];
  const passedByDistance = distanceAlongRouteM >= finishDistanceM - 30;
  const distToFinish = haversineM(
    lat,
    lng,
    finishCp.latitude,
    finishCp.longitude
  );
  const withinRadius = distToFinish <= finishCp.radiusM;

  return passedByDistance || withinRadius;
}

// ─── Anti-cheat: Speed Validation ───────────────────────────────────────────

/**
 * Check if a GPS update is plausible given the previous point.
 * Returns false if the speed is impossibly high (teleportation).
 */
export function isPlausibleUpdate(
  prev: GPSPoint,
  next: GPSPoint,
  maxSpeedKmh: number
): boolean {
  const distM = haversineM(prev.lat, prev.lng, next.lat, next.lng);
  const timeDeltaMs = next.timestamp - prev.timestamp;

  if (timeDeltaMs <= 0) return false; // Invalid timestamp

  const speedKmh = distM / 1000 / (timeDeltaMs / 3_600_000);
  return speedKmh <= maxSpeedKmh;
}

/**
 * Check if GPS accuracy is acceptable.
 */
export function isAccuracyAcceptable(
  accuracy: number | undefined,
  maxAccuracyM = 100
): boolean {
  if (accuracy === undefined) return true; // No accuracy info — accept
  return accuracy <= maxAccuracyM;
}

// ─── Anti-cheat: Timestamp Validation ───────────────────────────────────────

/** Maximum allowed future offset for a GPS timestamp (1 minute tolerance for clock drift). */
const MAX_FUTURE_MS = 60_000;

/** Default maximum age for a single GPS update (configurable via maxAgeMs param). */
const DEFAULT_MAX_AGE_MS = 24 * 60 * 60 * 1000; // 24 hours

/**
 * Check if a GPS timestamp is valid.
 * Rejects:
 * - Future timestamps (beyond tolerance)
 * - Extremely old timestamps (beyond max age)
 */
export function isTimestampValid(
  timestamp: number,
  maxAgeMs: number = DEFAULT_MAX_AGE_MS
): boolean {
  const now = Date.now();
  // Reject future timestamps beyond tolerance
  if (timestamp > now + MAX_FUTURE_MS) return false;
  // Reject timestamps that are too old
  if (now - timestamp > maxAgeMs) return false;
  return true;
}
