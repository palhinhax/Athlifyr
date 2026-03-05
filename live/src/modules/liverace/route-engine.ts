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
  GateLine,
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

// ─── Gate Line Computation (perpendicular to route at checkpoint) ────────────

/**
 * Compute a perpendicular "gate line" across the route at the given checkpoint.
 * The line extends `halfWidthM` in each direction from the checkpoint centre,
 * perpendicular to the local route bearing.
 *
 * Used for precise START/FINISH line-crossing detection.
 */
function computeGateLine(
  cp: LiveConfigCheckpoint,
  cpIdx: number,
  routePoints: [number, number][],
  cpDistanceAlongRouteM: number,
  halfWidthM?: number
): GateLine {
  const width = halfWidthM ?? cp.radiusM; // default: use checkpoint radius

  // Find the closest route point to the checkpoint
  let minDist = Infinity;
  let closestIdx = 0;
  for (let i = 0; i < routePoints.length; i++) {
    const dlat = routePoints[i][0] - cp.latitude;
    const dlng = routePoints[i][1] - cp.longitude;
    const d = dlat * dlat + dlng * dlng;
    if (d < minDist) {
      minDist = d;
      closestIdx = i;
    }
  }

  // Compute the local route bearing at that point
  const prevIdx = Math.max(0, closestIdx - 1);
  const nextIdx = Math.min(routePoints.length - 1, closestIdx + 1);
  const dLat = routePoints[nextIdx][0] - routePoints[prevIdx][0];
  const dLng = routePoints[nextIdx][1] - routePoints[prevIdx][1];
  const routeBearing = Math.atan2(dLng, dLat); // radians

  // Perpendicular bearing (90° rotated)
  const perpBearing = routeBearing + Math.PI / 2;

  // Approximate metres → degrees conversion at this latitude
  const metresToDegLat = 1 / 111_320;
  const metresToDegLng =
    1 / (111_320 * Math.cos((cp.latitude * Math.PI) / 180));

  const offLat = Math.cos(perpBearing) * width * metresToDegLat;
  const offLng = Math.sin(perpBearing) * width * metresToDegLng;

  return {
    checkpointIdx: cpIdx,
    aLat: cp.latitude - offLat,
    aLng: cp.longitude - offLng,
    bLat: cp.latitude + offLat,
    bLng: cp.longitude + offLng,
    distanceAlongRouteM: cpDistanceAlongRouteM,
  };
}

// ─── 2-D Line Segment Intersection (lat/lng as flat coords — fine at <1 km) ─

/**
 * Returns true if segment P1→P2 intersects segment P3→P4.
 * Uses the standard cross-product orientation test.
 */
function segmentsIntersect(
  p1Lat: number,
  p1Lng: number,
  p2Lat: number,
  p2Lng: number,
  p3Lat: number,
  p3Lng: number,
  p4Lat: number,
  p4Lng: number
): boolean {
  const d1 = cross(p3Lat, p3Lng, p4Lat, p4Lng, p1Lat, p1Lng);
  const d2 = cross(p3Lat, p3Lng, p4Lat, p4Lng, p2Lat, p2Lng);
  const d3 = cross(p1Lat, p1Lng, p2Lat, p2Lng, p3Lat, p3Lng);
  const d4 = cross(p1Lat, p1Lng, p2Lat, p2Lng, p4Lat, p4Lng);

  if (
    ((d1 > 0 && d2 < 0) || (d1 < 0 && d2 > 0)) &&
    ((d3 > 0 && d4 < 0) || (d3 < 0 && d4 > 0))
  ) {
    return true;
  }

  // Collinear / endpoint-on-segment cases
  if (d1 === 0 && onSegment(p3Lat, p3Lng, p4Lat, p4Lng, p1Lat, p1Lng))
    return true;
  if (d2 === 0 && onSegment(p3Lat, p3Lng, p4Lat, p4Lng, p2Lat, p2Lng))
    return true;
  if (d3 === 0 && onSegment(p1Lat, p1Lng, p2Lat, p2Lng, p3Lat, p3Lng))
    return true;
  if (d4 === 0 && onSegment(p1Lat, p1Lng, p2Lat, p2Lng, p4Lat, p4Lng))
    return true;

  return false;
}

/** Cross product of vectors (b-a) × (c-a) — sign determines orientation. */
function cross(
  aLat: number,
  aLng: number,
  bLat: number,
  bLng: number,
  cLat: number,
  cLng: number
): number {
  return (bLat - aLat) * (cLng - aLng) - (bLng - aLng) * (cLat - aLat);
}

/** Check if point (pLat,pLng) lies on segment (aLat,aLng)→(bLat,bLng) when collinear. */
function onSegment(
  aLat: number,
  aLng: number,
  bLat: number,
  bLng: number,
  pLat: number,
  pLng: number
): boolean {
  return (
    Math.min(aLat, bLat) <= pLat &&
    pLat <= Math.max(aLat, bLat) &&
    Math.min(aLng, bLng) <= pLng &&
    pLng <= Math.max(aLng, bLng)
  );
}

/**
 * Check whether the GPS movement from `prev` to `curr` crosses a gate line.
 * This is the core "line-crossing" detection used for START and FINISH.
 */
export function crossesGateLine(
  prevLat: number,
  prevLng: number,
  currLat: number,
  currLng: number,
  gate: GateLine
): boolean {
  return segmentsIntersect(
    prevLat,
    prevLng,
    currLat,
    currLng,
    gate.aLat,
    gate.aLng,
    gate.bLat,
    gate.bLng
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

  // Precompute gate lines for START and FINISH checkpoints
  const gateLines: GateLine[] = [];
  if (routePoints.length >= 2) {
    for (let i = 0; i < checkpoints.length; i++) {
      const cp = checkpoints[i];
      if (cp.type === "START" || cp.type === "FINISH") {
        gateLines.push(
          computeGateLine(cp, i, routePoints, checkpointDistancesM[i])
        );
      }
    }
  }

  return {
    variantId,
    totalDistanceM: cumulativeDistance,
    segments,
    checkpoints,
    checkpointDistancesM,
    gateLines,
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
 *
 * For START/FINISH checkpoints: uses gate-line crossing (precise).
 * For INTERMEDIATE/TRANSITION: uses distance + radius (existing logic).
 */
export function detectNewCheckpoints(
  distanceAlongRouteM: number,
  lat: number,
  lng: number,
  routeHelper: RouteHelper,
  alreadyReachedOrders: Set<number>,
  prevLat?: number,
  prevLng?: number
): number[] {
  const newlyReached: number[] = [];

  for (let i = 0; i < routeHelper.checkpoints.length; i++) {
    const cp = routeHelper.checkpoints[i];

    // Skip already reached
    if (alreadyReachedOrders.has(cp.order)) continue;

    const isGateCheckpoint = cp.type === "START" || cp.type === "FINISH";

    if (isGateCheckpoint && prevLat !== undefined && prevLng !== undefined) {
      // ── Gate-line crossing for START/FINISH ──────────────────────
      const gate = routeHelper.gateLines.find((g) => g.checkpointIdx === i);
      if (gate && crossesGateLine(prevLat, prevLng, lat, lng, gate)) {
        newlyReached.push(i);
        continue;
      }
      // Fallback: distance-based (in case gate line wasn't precomputed)
      const cpDistanceM = routeHelper.checkpointDistancesM[i];
      if (distanceAlongRouteM >= cpDistanceM - 30) {
        newlyReached.push(i);
      }
    } else {
      // ── Radius / distance for INTERMEDIATE/TRANSITION ───────────
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
  }

  return newlyReached;
}

// ─── Finish Detection ───────────────────────────────────────────────────────

/**
 * Check if the athlete has crossed the finish line.
 * Primary: gate-line crossing (precise).
 * Fallback: distance + radius (for backward compat / no prev point).
 */
export function detectFinish(
  distanceAlongRouteM: number,
  lat: number,
  lng: number,
  routeHelper: RouteHelper,
  prevLat?: number,
  prevLng?: number
): boolean {
  const finishCp = routeHelper.checkpoints.find((cp) => cp.type === "FINISH");
  if (!finishCp) {
    // No explicit finish checkpoint — use route end
    return distanceAlongRouteM >= routeHelper.totalDistanceM - 50;
  }

  const finishIdx = routeHelper.checkpoints.indexOf(finishCp);

  // ── Primary: gate-line crossing ───────────────────────────────────
  if (prevLat !== undefined && prevLng !== undefined) {
    const gate = routeHelper.gateLines.find(
      (g) => g.checkpointIdx === finishIdx
    );
    if (gate && crossesGateLine(prevLat, prevLng, lat, lng, gate)) {
      return true;
    }
  }

  // ── Fallback: distance-based + radius (for first point / no gate) ─
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

/**
 * Detect if the GPS movement from prev → curr crosses the START gate line
 * for the given variant. Returns the timestamp of crossing (uses curr point
 * timestamp) or null if no crossing detected.
 */
export function detectStartLineCrossing(
  prevLat: number,
  prevLng: number,
  currLat: number,
  currLng: number,
  routeHelper: RouteHelper
): boolean {
  const startCpIdx = routeHelper.checkpoints.findIndex(
    (cp) => cp.type === "START"
  );
  if (startCpIdx === -1) return false;

  const gate = routeHelper.gateLines.find(
    (g) => g.checkpointIdx === startCpIdx
  );
  if (!gate) return false;

  return crossesGateLine(prevLat, prevLng, currLat, currLng, gate);
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
