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

/** Minimum segment length (meters) to consider valid.  Shorter segments
 *  arise from duplicate/near-duplicate GPX points and produce degenerate
 *  cross-track / along-track calculations. */
const MIN_SEGMENT_LENGTH_M = 0.01;

/** Clamp a value to [-1, 1] to prevent NaN from Math.acos / Math.asin
 *  caused by floating-point rounding slightly exceeding the valid domain. */
function clampUnit(v: number): number {
  return v < -1 ? -1 : v > 1 ? 1 : v;
}

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
  const sinArg = Math.sin(d13 / EARTH_RADIUS_M) * Math.sin(b13 - b12);
  return Math.abs(Math.asin(clampUnit(sinArg)) * EARTH_RADIUS_M);
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

  // Guard: if the point is coincident with the segment start, the
  // along-track distance is trivially zero.  This avoids a 0/0 ratio
  // inside acos that would produce NaN.
  if (d13 < MIN_SEGMENT_LENGTH_M) return 0;

  const crossTrack = crossTrackDistanceM(
    pointLat,
    pointLng,
    segStartLat,
    segStartLng,
    segEndLat,
    segEndLng
  );

  const cosD13 = Math.cos(d13 / EARTH_RADIUS_M);
  const cosCT = Math.cos(crossTrack / EARTH_RADIUS_M);

  // Guard: when cosCT ≈ 0 (crossTrack ≈ π/2 * R ≈ 10 000 km) or when
  // floating-point rounding pushes |cosD13/cosCT| > 1, clamp to the
  // valid acos domain to prevent NaN.
  if (cosCT === 0) return 0;
  const ratio = clampUnit(cosD13 / cosCT);

  const result = Math.acos(ratio) * EARTH_RADIUS_M;
  // Final safety net: if result is NaN despite the guards (should not
  // happen), fall back to the straight-line distance from segment start.
  return Number.isNaN(result) ? d13 : result;
}

// ─── Gate Line Computation (perpendicular to route at checkpoint) ────────────

/**
 * Compute a perpendicular "gate line" across the route at the given checkpoint.
 * The line extends `halfWidthM` in each direction from the checkpoint centre,
 * perpendicular to the local route bearing.
 *
 * Used for precise START/FINISH line-crossing detection.
 *
 * `cpSegmentIdx` is the index of the route segment at this checkpoint (from
 * the monotonic distance search in buildRouteHelper). Using the segment index
 * rather than searching for the nearest route point by GPS distance ensures
 * correct gate orientation on out-and-back routes where the FINISH checkpoint
 * is at the same physical location as the START but on the return leg.
 */
function computeGateLine(
  cp: LiveConfigCheckpoint,
  cpIdx: number,
  segments: RouteSegment[],
  cpDistanceAlongRouteM: number,
  cpSegmentIdx: number,
  halfWidthM?: number
): GateLine {
  // Default gate half-width: at least 50 m so the gate is wide enough for
  // trail races with GPS noise of ±15–30 m. Use a wider value if the
  // checkpoint radius itself exceeds 50 m.
  const width = halfWidthM ?? Math.max(cp.radiusM, 50);

  // Derive local route bearing using spherical bearing (bearingDeg) instead
  // of flat lat/lng subtraction. Raw degree subtraction distorts at higher
  // latitudes (a degree of longitude shrinks by cos(lat)).
  const seg = segments[cpSegmentIdx];
  const routeBearing =
    (bearingDeg(seg.startLat, seg.startLng, seg.endLat, seg.endLng) * Math.PI) /
    180;

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

    // Skip degenerate segments (duplicate / near-duplicate GPX points).
    // These produce meaningless cross-track and along-track results and
    // can cause NaN propagation in the projection functions.
    if (lengthM < MIN_SEGMENT_LENGTH_M) {
      continue;
    }

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

  // Precompute checkpoint distances along the route using a monotonic search.
  //
  // Checkpoints are processed in race order (sorted by `order` field). For each
  // checkpoint the segment search starts from the segment where the previous
  // checkpoint landed. This guarantees that two checkpoints at the same physical
  // GPS location (e.g. the START and FINISH of an out-and-back race) receive
  // distinct, monotonically increasing route distances — the START is assigned
  // to the outbound leg and the FINISH to the return leg.
  //
  // Both arrays are zero-initialized as a safe fallback for the empty-segment
  // case (segments.length === 0), where checkpoints cannot be projected.
  const checkpointDistancesM: number[] = new Array(checkpoints.length).fill(0);
  const checkpointSegmentIndices: number[] = new Array(checkpoints.length).fill(
    0
  );

  if (segments.length > 0) {
    // Process checkpoints in race sequence so the monotonic search advances
    // correctly through the route.
    const sortedIndices = checkpoints
      .map((cp, idx) => ({ order: cp.order, idx }))
      .sort((a, b) => a.order - b.order)
      .map(({ idx }) => idx);

    // Deviation tolerance for tie-breaking (meters). When two segments
    // produce deviations within this epsilon, later-order checkpoints
    // (e.g. FINISH) prefer the later segment so they land on the return
    // leg of an out-and-back route instead of the outbound leg.
    const DEVIATION_EPSILON_M = 0.5;

    let minSearchIdx = 0;
    for (let sortedPos = 0; sortedPos < sortedIndices.length; sortedPos++) {
      const cpIdx = sortedIndices[sortedPos];
      const cp = checkpoints[cpIdx];
      // The first checkpoint in race order (typically START) keeps the
      // earliest matching segment. All subsequent checkpoints prefer
      // a later segment when deviations are within epsilon — this
      // ensures FINISH lands on the return leg, not the outbound leg.
      const preferLaterSegment = sortedPos > 0;
      let bestDeviation = Infinity;
      let bestDistance = 0;
      let bestSegIdx = minSearchIdx;

      for (let i = minSearchIdx; i < segments.length; i++) {
        const seg = segments[i];
        const crossDist = crossTrackDistanceM(
          cp.latitude,
          cp.longitude,
          seg.startLat,
          seg.startLng,
          seg.endLat,
          seg.endLng
        );
        const alongDist = Math.max(
          0,
          Math.min(
            alongTrackDistanceM(
              cp.latitude,
              cp.longitude,
              seg.startLat,
              seg.startLng,
              seg.endLat,
              seg.endLng
            ),
            seg.lengthM
          )
        );

        let deviation = crossDist;
        if (alongDist <= 0) {
          deviation = haversineM(
            cp.latitude,
            cp.longitude,
            seg.startLat,
            seg.startLng
          );
        } else if (alongDist >= seg.lengthM) {
          deviation = haversineM(
            cp.latitude,
            cp.longitude,
            seg.endLat,
            seg.endLng
          );
        }

        const isBetterMatch = deviation < bestDeviation;
        // Tie-breaker: for later-order checkpoints, accept a later segment
        // when the deviation is within epsilon of the current best. This
        // resolves the out-and-back ambiguity where START and FINISH at the
        // same GPS coordinates would otherwise both snap to the outbound leg.
        const isTiedLaterMatch =
          preferLaterSegment &&
          Math.abs(deviation - bestDeviation) < DEVIATION_EPSILON_M &&
          i > bestSegIdx;

        if (isBetterMatch || isTiedLaterMatch) {
          bestDeviation = deviation;
          bestDistance = seg.cumulativeDistanceM + alongDist;
          bestSegIdx = i;
        }
      }

      checkpointDistancesM[cpIdx] = bestDistance;
      checkpointSegmentIndices[cpIdx] = bestSegIdx;
      minSearchIdx = bestSegIdx;
    }
  }

  // Precompute gate lines for START and FINISH checkpoints.
  // Pass the segment index so computeGateLine uses the correct bearing for
  // each leg (important for out-and-back routes).
  const gateLines: GateLine[] = [];
  if (segments.length >= 1) {
    for (let i = 0; i < checkpoints.length; i++) {
      const cp = checkpoints[i];
      if (cp.type === "START" || cp.type === "FINISH") {
        gateLines.push(
          computeGateLine(
            cp,
            i,
            segments,
            checkpointDistancesM[i],
            checkpointSegmentIndices[i]
          )
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

  // If the local result has reasonable deviation, return it without full scan.
  // 150 m is tight enough to reject incorrect matches on parallel/overlapping
  // segments (e.g. out-and-back routes, switchbacks) while still tolerating
  // normal GPS noise and brief off-trail excursions.
  if (bestDeviation < 150) {
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
 *
 * Out-and-back safety: FINISH gate-line crossings are only credited once the
 * athlete has covered at least 90% of the FINISH checkpoint's route distance.
 * This prevents a false FINISH detection at race start when the FINISH gate is
 * at the same physical location as the START (common in out-and-back races).
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
        // For FINISH checkpoints: require the athlete to have covered at least
        // 90% of the FINISH distance before crediting the gate crossing.
        // On out-and-back routes the FINISH gate is at the same physical
        // location as the START, so without this guard an athlete departing
        // the start area would be immediately marked as finished.
        if (cp.type === "FINISH") {
          const cpDistanceM = routeHelper.checkpointDistancesM[i];
          if (distanceAlongRouteM < cpDistanceM * 0.9) {
            // Too early — athlete is near the finish gate but hasn't run the course
            continue;
          }
        }
        newlyReached.push(i);
        continue;
      }
      // Fallback: distance-based (in case gate line wasn't precomputed).
      // Apply the same 90% minimum-progress guard as the gate-line path so
      // a co-located FINISH cannot be triggered on the outbound leg.
      const cpDistanceM = routeHelper.checkpointDistancesM[i];
      const minProgressRequired =
        cp.type === "FINISH" ? cpDistanceM * 0.9 : -Infinity;
      if (
        distanceAlongRouteM >= cpDistanceM - 30 &&
        distanceAlongRouteM >= minProgressRequired
      ) {
        newlyReached.push(i);
      }
    } else {
      // ── Radius / distance for INTERMEDIATE/TRANSITION and gate checkpoints
      //    without a previous position ─────────────────────────────────────
      // Two detection methods:
      // 1. Distance-based: athlete's route distance has passed the checkpoint's route distance
      const cpDistanceM = routeHelper.checkpointDistancesM[i];
      // Apply the 90% minimum-progress guard for FINISH checkpoints so that
      // a co-located START/FINISH zone is not credited at race start when
      // the athlete has no previous position yet (first GPS update).
      const minProgressRequired =
        cp.type === "FINISH" ? cpDistanceM * 0.9 : -Infinity;
      const passedByDistance =
        distanceAlongRouteM >= cpDistanceM - 50 && // 50m tolerance
        distanceAlongRouteM >= minProgressRequired;

      // 2. Proximity-based: athlete is within the checkpoint's radius.
      // Same guard: proximity alone should not trigger a FINISH checkpoint
      // at the start of an out-and-back race.
      const distToCheckpoint = haversineM(lat, lng, cp.latitude, cp.longitude);
      const withinRadius =
        distToCheckpoint <= cp.radiusM &&
        distanceAlongRouteM >= minProgressRequired;

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
 *
 * Out-and-back safety: both detection methods require the athlete to have
 * covered at least 90% of the FINISH checkpoint's route distance before
 * crediting a finish. This prevents false finishes at race start when the
 * FINISH gate/zone is at the same physical location as the START (common in
 * out-and-back and loop races).
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
  const finishDistanceM = routeHelper.checkpointDistancesM[finishIdx];

  // Minimum progress required before a finish can be credited.
  // 90% of the finish checkpoint's route distance guards against false
  // positives on out-and-back routes where the FINISH gate is co-located
  // with the START gate.
  const minFinishDistanceM = finishDistanceM * 0.9;

  // ── Primary: gate-line crossing ───────────────────────────────────
  if (prevLat !== undefined && prevLng !== undefined) {
    const gate = routeHelper.gateLines.find(
      (g) => g.checkpointIdx === finishIdx
    );
    if (
      gate &&
      crossesGateLine(prevLat, prevLng, lat, lng, gate) &&
      distanceAlongRouteM >= minFinishDistanceM
    ) {
      return true;
    }
  }

  // ── Fallback: distance-based + radius (for first point / no gate) ─
  // Both fallback methods require the minimum progress guard to prevent
  // false finishes on out-and-back routes where the finish zone overlaps
  // the start area.
  const passedByDistance =
    distanceAlongRouteM >= finishDistanceM - 30 &&
    distanceAlongRouteM >= minFinishDistanceM;
  const distToFinish = haversineM(
    lat,
    lng,
    finishCp.latitude,
    finishCp.longitude
  );
  const withinRadius =
    distToFinish <= finishCp.radiusM &&
    distanceAlongRouteM >= minFinishDistanceM;

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

  if (!crossesGateLine(prevLat, prevLng, currLat, currLng, gate)) return false;

  // Direction check: the athlete must be crossing in the forward (race)
  // direction. Without this, an athlete approaching the start from the wrong
  // side (e.g. on a loop that returns near the start) would trigger a false
  // start detection. We verify by checking that the movement vector has a
  // positive projection along the route direction at the start segment.
  const seg = routeHelper.segments[0];
  if (!seg) return true; // no segment info — accept the crossing
  const movementBearing = bearingDeg(prevLat, prevLng, currLat, currLng);
  const routeBearing = bearingDeg(
    seg.startLat,
    seg.startLng,
    seg.endLat,
    seg.endLng
  );
  const angleDiff = Math.abs(
    ((movementBearing - routeBearing + 540) % 360) - 180
  );
  return angleDiff <= 90;
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

  if (timeDeltaMs < 0) return false; // Backwards in time
  // Equal timestamps happen in batch replay when multiple points share the
  // same millisecond. Accept if the points are essentially the same location.
  if (timeDeltaMs === 0) return distM < 1;

  const speedKmh = distM / 1000 / (timeDeltaMs / 3_600_000);
  return speedKmh <= maxSpeedKmh;
}

/**
 * Check if GPS accuracy is acceptable.
 */
export function isAccuracyAcceptable(
  accuracy: number | undefined,
  maxAccuracyM = 50
): boolean {
  if (accuracy === undefined) return true; // No accuracy info — accept
  return accuracy <= maxAccuracyM;
}

// ─── Anti-cheat: Timestamp Validation ───────────────────────────────────────

/** Maximum allowed future offset for a GPS timestamp (1 minute tolerance for clock drift). */
const MAX_FUTURE_MS = 60_000;

/** Default maximum age for a single GPS update (configurable via maxAgeMs param).
 *  Reduced from 24h to 6h — a 24h window would accept yesterday's GPS track
 *  replayed as a batch, bypassing speed validation per-point. */
const DEFAULT_MAX_AGE_MS = 6 * 60 * 60 * 1000; // 6 hours

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
