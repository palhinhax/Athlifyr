import { describe, it, expect } from "vitest";
import {
  haversineM,
  buildRouteHelper,
  projectPointOnRoute,
  projectPointOnRouteNear,
  crossesGateLine,
  detectNewCheckpoints,
  detectFinish,
  detectStartLineCrossing,
  isPlausibleUpdate,
  isAccuracyAcceptable,
  isTimestampValid,
} from "../route-engine.js";
import type { LiveConfigCheckpoint } from "../liverace.types.js";

// ────────────────────────────────────────────────────────────────────────────
// Helper factories
// ────────────────────────────────────────────────────────────────────────────

function makeCheckpoint(
  overrides: Partial<LiveConfigCheckpoint> & {
    type: LiveConfigCheckpoint["type"];
    order: number;
  }
): LiveConfigCheckpoint {
  return {
    id: `cp-${overrides.order}`,
    name: overrides.name ?? `CP ${overrides.order}`,
    latitude: overrides.latitude ?? 0,
    longitude: overrides.longitude ?? 0,
    radiusM: overrides.radiusM ?? 30,
    cutoffMin: overrides.cutoffMin ?? null,
    ...overrides,
  };
}

/** Create a simple straight-line route from A to B with N intermediate points */
function straightRoute(
  startLat: number,
  startLng: number,
  endLat: number,
  endLng: number,
  numPoints = 100
): [number, number][] {
  const pts: [number, number][] = [];
  for (let i = 0; i <= numPoints; i++) {
    const t = i / numPoints;
    pts.push([
      startLat + (endLat - startLat) * t,
      startLng + (endLng - startLng) * t,
    ]);
  }
  return pts;
}

/**
 * Create an out-and-back route: A → B → A
 * The route goes to B then returns to A (same physical path).
 */
function outAndBackRoute(
  startLat: number,
  startLng: number,
  turnLat: number,
  turnLng: number,
  numPointsPerLeg = 50
): [number, number][] {
  const out = straightRoute(
    startLat,
    startLng,
    turnLat,
    turnLng,
    numPointsPerLeg
  );
  const back = straightRoute(
    turnLat,
    turnLng,
    startLat,
    startLng,
    numPointsPerLeg
  );
  // Remove first point of return leg (duplicate of turnaround)
  return [...out, ...back.slice(1)];
}

// ────────────────────────────────────────────────────────────────────────────
// 1. Haversine
// ────────────────────────────────────────────────────────────────────────────

describe("haversineM", () => {
  it("returns 0 for identical points", () => {
    expect(haversineM(40.0, -8.0, 40.0, -8.0)).toBe(0);
  });

  it("computes a reasonable distance for known points", () => {
    // Lisbon → Porto ≈ 274 km
    const dist = haversineM(38.7223, -9.1393, 41.1579, -8.6291);
    expect(dist).toBeGreaterThan(270_000);
    expect(dist).toBeLessThan(280_000);
  });
});

// ────────────────────────────────────────────────────────────────────────────
// 2. alongTrackDistanceM — NaN guards
// ────────────────────────────────────────────────────────────────────────────

describe("alongTrackDistanceM NaN guards", () => {
  it("does not produce NaN for a point coincident with segment start", () => {
    const route: [number, number][] = [
      [40.0, -8.0],
      [40.001, -8.0],
    ];
    const helper = buildRouteHelper("v1", route, []);
    // Project exact segment start
    const result = projectPointOnRoute(40.0, -8.0, helper.segments);
    expect(Number.isNaN(result.distanceAlongRouteM)).toBe(false);
    expect(result.distanceAlongRouteM).toBeCloseTo(0, 0);
  });

  it("does not produce NaN for a point coincident with segment end", () => {
    const route: [number, number][] = [
      [40.0, -8.0],
      [40.001, -8.0],
    ];
    const helper = buildRouteHelper("v1", route, []);
    const result = projectPointOnRoute(40.001, -8.0, helper.segments);
    expect(Number.isNaN(result.distanceAlongRouteM)).toBe(false);
  });

  it("does not produce NaN for a point far from the segment (large cross-track)", () => {
    const route: [number, number][] = [
      [40.0, -8.0],
      [40.001, -8.0],
    ];
    const helper = buildRouteHelper("v1", route, []);
    // Point 1 degree away — large deviation
    const result = projectPointOnRoute(41.0, -7.0, helper.segments);
    expect(Number.isNaN(result.distanceAlongRouteM)).toBe(false);
    expect(Number.isNaN(result.deviationM)).toBe(false);
  });

  it("does not produce NaN for a point perpendicular to a very short segment", () => {
    // Segment of ~11m at equator
    const route: [number, number][] = [
      [0.0, 0.0],
      [0.0001, 0.0],
    ];
    const helper = buildRouteHelper("v1", route, []);
    // Point perpendicular at large distance
    const result = projectPointOnRoute(0.00005, 0.01, helper.segments);
    expect(Number.isNaN(result.distanceAlongRouteM)).toBe(false);
  });
});

// ────────────────────────────────────────────────────────────────────────────
// 3. Zero / near-zero length segments (duplicate GPX points)
// ────────────────────────────────────────────────────────────────────────────

describe("zero-length segment filtering", () => {
  it("filters out duplicate GPX points", () => {
    const route: [number, number][] = [
      [40.0, -8.0],
      [40.0, -8.0], // duplicate
      [40.0, -8.0], // duplicate
      [40.001, -8.0],
    ];
    const helper = buildRouteHelper("v1", route, []);
    // Only 1 valid segment: [40.0, -8.0] → [40.001, -8.0]
    expect(helper.segments.length).toBe(1);
    expect(helper.totalDistanceM).toBeGreaterThan(0);
  });

  it("handles a route with ALL duplicate points gracefully", () => {
    const route: [number, number][] = [
      [40.0, -8.0],
      [40.0, -8.0],
      [40.0, -8.0],
    ];
    const helper = buildRouteHelper("v1", route, []);
    expect(helper.segments.length).toBe(0);
    expect(helper.totalDistanceM).toBe(0);
  });

  it("projectPointOnRoute returns zero results for empty segments", () => {
    const result = projectPointOnRoute(40.0, -8.0, []);
    expect(result.distanceAlongRouteM).toBe(0);
    expect(result.deviationM).toBe(0);
    expect(result.progressPercent).toBe(0);
  });
});

// ────────────────────────────────────────────────────────────────────────────
// 4. Out-and-back route: checkpoint assignment
// ────────────────────────────────────────────────────────────────────────────

describe("out-and-back route checkpoint assignment", () => {
  const startLat = 40.0;
  const startLng = -8.0;
  const turnLat = 40.01;
  const turnLng = -8.0;

  const route = outAndBackRoute(startLat, startLng, turnLat, turnLng, 50);

  const checkpoints: LiveConfigCheckpoint[] = [
    makeCheckpoint({
      type: "START",
      order: 0,
      latitude: startLat,
      longitude: startLng,
    }),
    makeCheckpoint({
      type: "FINISH",
      order: 2,
      latitude: startLat,
      longitude: startLng,
    }),
  ];

  const helper = buildRouteHelper("v1", route, checkpoints);

  it("assigns START to the outbound leg (early distance)", () => {
    const startDist = helper.checkpointDistancesM[0];
    expect(startDist).toBeLessThan(helper.totalDistanceM * 0.1);
  });

  it("assigns FINISH to the return leg (late distance)", () => {
    const finishDist = helper.checkpointDistancesM[1];
    expect(finishDist).toBeGreaterThan(helper.totalDistanceM * 0.8);
  });

  it("FINISH distance > START distance", () => {
    expect(helper.checkpointDistancesM[1]).toBeGreaterThan(
      helper.checkpointDistancesM[0]
    );
  });
});

// ────────────────────────────────────────────────────────────────────────────
// 5. projectPointOnRouteNear — local search & fallback
// ────────────────────────────────────────────────────────────────────────────

describe("projectPointOnRouteNear", () => {
  const route = straightRoute(40.0, -8.0, 40.01, -8.0, 200);
  const helper = buildRouteHelper("v1", route, []);

  it("returns correct projection near the hinted segment", () => {
    const midSegIdx = 100;
    const result = projectPointOnRouteNear(
      40.005,
      -8.0,
      helper.segments,
      midSegIdx
    );
    expect(result.progressPercent).toBeGreaterThan(40);
    expect(result.progressPercent).toBeLessThan(60);
    expect(result.deviationM).toBeLessThan(50);
  });

  it("falls back to full scan when deviation exceeds 150m", () => {
    // Point very far from the route — should trigger fallback
    const result = projectPointOnRouteNear(42.0, -6.0, helper.segments, 0);
    // Should still return a valid (non-NaN) result
    expect(Number.isNaN(result.distanceAlongRouteM)).toBe(false);
    expect(Number.isNaN(result.deviationM)).toBe(false);
  });

  it("does not match to a distant parallel segment (out-and-back)", () => {
    const oabRoute = outAndBackRoute(40.0, -8.0, 40.01, -8.0, 50);
    const oabHelper = buildRouteHelper("v2", oabRoute, []);

    // Athlete at 75% on the return leg — segIdx should be on return half
    const returnSegIdx = Math.floor(oabHelper.segments.length * 0.75);
    const result = projectPointOnRouteNear(
      40.0025,
      -8.0,
      oabHelper.segments,
      returnSegIdx,
      10
    );
    // The matched segment should be on the return leg (not outbound)
    expect(result.segmentIndex).toBeGreaterThan(
      oabHelper.segments.length / 2 - 15
    );
  });
});

// ────────────────────────────────────────────────────────────────────────────
// 6. Gate-line crossing detection
// ────────────────────────────────────────────────────────────────────────────

describe("crossesGateLine", () => {
  // Simple gate crossing the route at lat=40.005
  const gate = {
    checkpointIdx: 0,
    aLat: 40.005,
    aLng: -8.001,
    bLat: 40.005,
    bLng: -7.999,
    distanceAlongRouteM: 500,
  };

  it("detects a crossing when movement path intersects the gate", () => {
    expect(crossesGateLine(40.004, -8.0, 40.006, -8.0, gate)).toBe(true);
  });

  it("does not detect crossing when path is parallel / away from gate", () => {
    expect(crossesGateLine(40.006, -8.001, 40.006, -7.999, gate)).toBe(false);
  });

  it("does not detect crossing when both points are on the same side", () => {
    expect(crossesGateLine(40.003, -8.0, 40.004, -8.0, gate)).toBe(false);
  });
});

// ────────────────────────────────────────────────────────────────────────────
// 7. FINISH false positive protection (out-and-back)
// ────────────────────────────────────────────────────────────────────────────

describe("detectFinish — out-and-back false positive protection", () => {
  const startLat = 40.0;
  const startLng = -8.0;
  const turnLat = 40.01;
  const route = outAndBackRoute(startLat, startLng, turnLat, -8.0, 50);

  const checkpoints: LiveConfigCheckpoint[] = [
    makeCheckpoint({
      type: "START",
      order: 0,
      latitude: startLat,
      longitude: startLng,
    }),
    makeCheckpoint({
      type: "FINISH",
      order: 2,
      latitude: startLat,
      longitude: startLng,
      radiusM: 50,
    }),
  ];

  const helper = buildRouteHelper("v1", route, checkpoints);

  it("does NOT detect finish early (distance-based) near the start", () => {
    // Athlete at ~5% progress, physically near start/finish zone
    const result = detectFinish(
      helper.totalDistanceM * 0.05,
      startLat + 0.0001,
      startLng,
      helper
    );
    expect(result).toBe(false);
  });

  it("does NOT detect finish at 50% progress near the turnaround", () => {
    const result = detectFinish(
      helper.totalDistanceM * 0.5,
      turnLat,
      -8.0,
      helper
    );
    expect(result).toBe(false);
  });

  it("DOES detect finish when athlete has completed 95% and is near finish", () => {
    const result = detectFinish(
      helper.totalDistanceM * 0.95,
      startLat + 0.0001,
      startLng,
      helper
    );
    expect(result).toBe(true);
  });
});

// ────────────────────────────────────────────────────────────────────────────
// 8. detectNewCheckpoints
// ────────────────────────────────────────────────────────────────────────────

describe("detectNewCheckpoints", () => {
  const route = straightRoute(40.0, -8.0, 40.01, -8.0, 100);
  const checkpoints: LiveConfigCheckpoint[] = [
    makeCheckpoint({
      type: "START",
      order: 0,
      latitude: 40.0,
      longitude: -8.0,
    }),
    makeCheckpoint({
      type: "INTERMEDIATE",
      order: 1,
      latitude: 40.005,
      longitude: -8.0,
      radiusM: 50,
    }),
    makeCheckpoint({
      type: "FINISH",
      order: 2,
      latitude: 40.01,
      longitude: -8.0,
    }),
  ];
  const helper = buildRouteHelper("v1", route, checkpoints);

  it("detects intermediate checkpoint by proximity", () => {
    const reached = new Set<number>();
    const newCps = detectNewCheckpoints(
      helper.totalDistanceM * 0.5,
      40.005,
      -8.0,
      helper,
      reached
    );
    expect(newCps).toContain(1);
  });

  it("does not re-detect already reached checkpoints", () => {
    const reached = new Set<number>([1]);
    const newCps = detectNewCheckpoints(
      helper.totalDistanceM * 0.5,
      40.005,
      -8.0,
      helper,
      reached
    );
    expect(newCps).not.toContain(1);
  });
});

// ────────────────────────────────────────────────────────────────────────────
// 9. START line crossing
// ────────────────────────────────────────────────────────────────────────────

describe("detectStartLineCrossing", () => {
  const route = straightRoute(40.0, -8.0, 40.01, -8.0, 100);
  const checkpoints: LiveConfigCheckpoint[] = [
    makeCheckpoint({
      type: "START",
      order: 0,
      latitude: 40.0,
      longitude: -8.0,
    }),
    makeCheckpoint({
      type: "FINISH",
      order: 1,
      latitude: 40.01,
      longitude: -8.0,
    }),
  ];
  const helper = buildRouteHelper("v1", route, checkpoints);

  it("detects crossing when movement crosses the start gate", () => {
    // Move from just before to just after the start
    const result = detectStartLineCrossing(
      39.9999,
      -8.0,
      40.0001,
      -8.0,
      helper
    );
    expect(result).toBe(true);
  });

  it("does not detect crossing far from start", () => {
    const result = detectStartLineCrossing(40.005, -8.0, 40.006, -8.0, helper);
    expect(result).toBe(false);
  });
});

// ────────────────────────────────────────────────────────────────────────────
// 10. Anti-cheat: plausibility & accuracy
// ────────────────────────────────────────────────────────────────────────────

describe("isPlausibleUpdate", () => {
  it("accepts a normal walking speed update", () => {
    const prev = { lat: 40.0, lng: -8.0, timestamp: 0 };
    const next = { lat: 40.0001, lng: -8.0, timestamp: 10_000 }; // ~11m in 10s
    expect(isPlausibleUpdate(prev, next, 50)).toBe(true);
  });

  it("rejects impossible teleportation", () => {
    const prev = { lat: 40.0, lng: -8.0, timestamp: 0 };
    const next = { lat: 41.0, lng: -8.0, timestamp: 1_000 }; // ~111km in 1s
    expect(isPlausibleUpdate(prev, next, 50)).toBe(false);
  });

  it("rejects zero or negative time delta", () => {
    const prev = { lat: 40.0, lng: -8.0, timestamp: 1_000 };
    const next = { lat: 40.0001, lng: -8.0, timestamp: 1_000 };
    expect(isPlausibleUpdate(prev, next, 50)).toBe(false);
  });
});

describe("isAccuracyAcceptable", () => {
  it("accepts undefined accuracy", () => {
    expect(isAccuracyAcceptable(undefined)).toBe(true);
  });

  it("accepts accuracy within tolerance", () => {
    expect(isAccuracyAcceptable(50, 100)).toBe(true);
  });

  it("rejects poor accuracy", () => {
    expect(isAccuracyAcceptable(150, 100)).toBe(false);
  });
});

describe("isTimestampValid", () => {
  it("accepts a recent timestamp", () => {
    expect(isTimestampValid(Date.now() - 5_000)).toBe(true);
  });

  it("rejects a far-future timestamp", () => {
    expect(isTimestampValid(Date.now() + 120_000)).toBe(false);
  });

  it("rejects a very old timestamp", () => {
    expect(isTimestampValid(Date.now() - 48 * 3600_000)).toBe(false);
  });
});

// ────────────────────────────────────────────────────────────────────────────
// 11. Progress monotonicity on straight route
// ────────────────────────────────────────────────────────────────────────────

describe("progress monotonicity on a straight route", () => {
  const route = straightRoute(40.0, -8.0, 40.01, -8.0, 200);
  const helper = buildRouteHelper("v1", route, []);

  it("progress increases monotonically as points advance along the route", () => {
    let prevProgress = 0;
    for (let i = 0; i <= 20; i++) {
      const t = i / 20;
      const lat = 40.0 + 0.01 * t;
      const result = projectPointOnRoute(lat, -8.0, helper.segments);
      expect(result.progressPercent).toBeGreaterThanOrEqual(
        prevProgress - 0.01
      );
      prevProgress = result.progressPercent;
    }
  });
});

// ────────────────────────────────────────────────────────────────────────────
// 12. Noisy GPS — stability test
// ────────────────────────────────────────────────────────────────────────────

describe("GPS noise stability", () => {
  const route = straightRoute(40.0, -8.0, 40.01, -8.0, 200);
  const helper = buildRouteHelper("v1", route, []);

  it("produces reasonable deviation for points with noise perpendicular to route", () => {
    // Point 50m off-route (perpendicular)
    const noiseLng = -8.0 + 0.0005; // ~50m at lat 40
    const result = projectPointOnRoute(40.005, noiseLng, helper.segments);
    expect(result.deviationM).toBeGreaterThan(20);
    expect(result.deviationM).toBeLessThan(100);
    // Progress should still be ~50%
    expect(result.progressPercent).toBeGreaterThan(40);
    expect(result.progressPercent).toBeLessThan(60);
    // No NaN
    expect(Number.isNaN(result.distanceAlongRouteM)).toBe(false);
    expect(Number.isNaN(result.deviationM)).toBe(false);
  });

  it("handles large GPS jumps without NaN", () => {
    // Simulate a 1km GPS jump
    const result = projectPointOnRoute(40.05, -7.95, helper.segments);
    expect(Number.isNaN(result.distanceAlongRouteM)).toBe(false);
    expect(Number.isNaN(result.deviationM)).toBe(false);
    expect(Number.isNaN(result.progressPercent)).toBe(false);
  });
});

// ────────────────────────────────────────────────────────────────────────────
// 13. Tight switchback / loop route
// ────────────────────────────────────────────────────────────────────────────

describe("tight switchback route", () => {
  // Create a Z-shaped route with tight turns
  const route: [number, number][] = [
    [40.0, -8.0],
    [40.001, -8.0],
    [40.001, -7.999],
    [40.0, -7.999],
    [40.0, -7.998],
    [40.001, -7.998],
  ];
  const helper = buildRouteHelper("v1", route, []);

  it("has the expected number of segments", () => {
    expect(helper.segments.length).toBe(5);
  });

  it("does not produce NaN at any switchback vertex", () => {
    for (const [lat, lng] of route) {
      const result = projectPointOnRoute(lat, lng, helper.segments);
      expect(Number.isNaN(result.distanceAlongRouteM)).toBe(false);
      expect(Number.isNaN(result.deviationM)).toBe(false);
    }
  });

  it("progress increases as we traverse each route point", () => {
    let prevDist = -1;
    for (const [lat, lng] of route) {
      const result = projectPointOnRoute(lat, lng, helper.segments);
      expect(result.distanceAlongRouteM).toBeGreaterThanOrEqual(prevDist - 1);
      prevDist = result.distanceAlongRouteM;
    }
  });
});

// ────────────────────────────────────────────────────────────────────────────
// 14. Edge: single-segment route
// ────────────────────────────────────────────────────────────────────────────

describe("single-segment route", () => {
  const route: [number, number][] = [
    [40.0, -8.0],
    [40.01, -8.0],
  ];
  const helper = buildRouteHelper("v1", route, []);

  it("has exactly 1 segment", () => {
    expect(helper.segments.length).toBe(1);
  });

  it("correctly computes 0% at start, 100% at end", () => {
    const start = projectPointOnRoute(40.0, -8.0, helper.segments);
    expect(start.progressPercent).toBeCloseTo(0, 0);

    const end = projectPointOnRoute(40.01, -8.0, helper.segments);
    expect(end.progressPercent).toBeCloseTo(100, 0);
  });
});

// ────────────────────────────────────────────────────────────────────────────
// 15. Edge: point at exact segment boundary
// ────────────────────────────────────────────────────────────────────────────

describe("projection at exact segment boundary", () => {
  const route: [number, number][] = [
    [40.0, -8.0],
    [40.005, -8.0],
    [40.01, -8.0],
  ];
  const helper = buildRouteHelper("v1", route, []);

  it("projects correctly at the junction point between two segments", () => {
    const result = projectPointOnRoute(40.005, -8.0, helper.segments);
    expect(Number.isNaN(result.distanceAlongRouteM)).toBe(false);
    // Should be ~50% of total distance
    expect(result.progressPercent).toBeGreaterThan(40);
    expect(result.progressPercent).toBeLessThan(60);
    expect(result.deviationM).toBeLessThan(5);
  });
});
