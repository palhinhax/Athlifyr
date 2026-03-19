import {
  smoothPath,
  interpolatePath,
  computeMetrics,
  generateMarkerTimes,
} from "@/src/lib/bar-path-utils";
import type { BarPathPoint } from "@/src/types/lift-analysis";

describe("smoothPath", () => {
  it("returns points unchanged when fewer than 3", () => {
    const pts: BarPathPoint[] = [
      { t: 0, x: 0.5, y: 0.5 },
      { t: 100, x: 0.6, y: 0.4 },
    ];
    expect(smoothPath(pts)).toEqual(pts);
  });

  it("returns empty array for empty input", () => {
    expect(smoothPath([])).toEqual([]);
  });

  it("smooths a noisy path", () => {
    const pts: BarPathPoint[] = [
      { t: 0, x: 0.5, y: 0.8 },
      { t: 100, x: 0.52, y: 0.7 },
      { t: 200, x: 0.48, y: 0.6 },
      { t: 300, x: 0.51, y: 0.5 },
      { t: 400, x: 0.49, y: 0.4 },
    ];
    const result = smoothPath(pts, 1);
    expect(result).toHaveLength(5);
    // Middle points should be averaged
    expect(result[2].x).toBeCloseTo((0.52 + 0.48 + 0.51) / 3, 5);
    expect(result[2].y).toBeCloseTo((0.7 + 0.6 + 0.5) / 3, 5);
  });

  it("preserves timestamps", () => {
    const pts: BarPathPoint[] = [
      { t: 0, x: 0.5, y: 0.8 },
      { t: 100, x: 0.6, y: 0.7 },
      { t: 200, x: 0.4, y: 0.6 },
    ];
    const result = smoothPath(pts);
    expect(result.map((p) => p.t)).toEqual([0, 100, 200]);
  });
});

describe("interpolatePath", () => {
  it("returns empty array for all-null input", () => {
    expect(interpolatePath([null, null, null], [0, 100, 200])).toEqual([]);
  });

  it("returns single point if only one non-null", () => {
    const sparse: (BarPathPoint | null)[] = [
      null,
      { t: 100, x: 0.5, y: 0.5 },
      null,
    ];
    const result = interpolatePath(sparse, [0, 100, 200]);
    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({ t: 100, x: 0.5, y: 0.5 });
  });

  it("interpolates gaps between known points", () => {
    const sparse: (BarPathPoint | null)[] = [
      { t: 0, x: 0.0, y: 0.0 },
      null,
      { t: 200, x: 1.0, y: 1.0 },
    ];
    const result = interpolatePath(sparse, [0, 100, 200]);
    expect(result).toHaveLength(3);
    expect(result[1].x).toBeCloseTo(0.5, 5);
    expect(result[1].y).toBeCloseTo(0.5, 5);
    expect(result[1].t).toBe(100);
  });

  it("handles no gaps (all non-null)", () => {
    const pts: BarPathPoint[] = [
      { t: 0, x: 0.1, y: 0.2 },
      { t: 100, x: 0.3, y: 0.4 },
      { t: 200, x: 0.5, y: 0.6 },
    ];
    const result = interpolatePath(pts, [0, 100, 200]);
    expect(result).toEqual(pts);
  });
});

describe("computeMetrics", () => {
  it("returns zero metrics for short path", () => {
    const result = computeMetrics([{ t: 0, x: 0.5, y: 0.5 }]);
    expect(result).toEqual({
      maxHorizontalDrift: 0,
      totalVerticalTravel: 0,
      durationMs: 0,
      averageSpeed: 0,
      maxSpeed: 0,
    });
  });

  it("returns zero metrics for empty path", () => {
    const result = computeMetrics([]);
    expect(result).toEqual({
      maxHorizontalDrift: 0,
      totalVerticalTravel: 0,
      durationMs: 0,
      averageSpeed: 0,
      maxSpeed: 0,
    });
  });

  it("computes correct duration", () => {
    const path: BarPathPoint[] = [
      { t: 0, x: 0.5, y: 0.8 },
      { t: 500, x: 0.5, y: 0.6 },
      { t: 1000, x: 0.5, y: 0.4 },
    ];
    const result = computeMetrics(path);
    expect(result.durationMs).toBe(1000);
  });

  it("computes horizontal drift", () => {
    const path: BarPathPoint[] = [
      { t: 0, x: 0.5, y: 0.5 },
      { t: 500, x: 0.6, y: 0.5 },
      { t: 1000, x: 0.55, y: 0.5 },
    ];
    const result = computeMetrics(path);
    expect(result.maxHorizontalDrift).toBeCloseTo(0.1, 3);
  });

  it("computes vertical travel", () => {
    const path: BarPathPoint[] = [
      { t: 0, x: 0.5, y: 0.8 },
      { t: 1000, x: 0.5, y: 0.3 },
    ];
    const result = computeMetrics(path);
    expect(result.totalVerticalTravel).toBeCloseTo(0.5, 3);
  });

  it("computes speed metrics", () => {
    const path: BarPathPoint[] = [
      { t: 0, x: 0.0, y: 0.0 },
      { t: 1000, x: 0.0, y: 1.0 },
    ];
    const result = computeMetrics(path);
    expect(result.averageSpeed).toBeCloseTo(1.0, 3);
    expect(result.maxSpeed).toBeCloseTo(1.0, 3);
  });
});

describe("generateMarkerTimes", () => {
  it("generates correct number of markers", () => {
    const markers = generateMarkerTimes(1000, 40, 250);
    expect(markers).toHaveLength(5); // 1000/250 + 1 = 5
  });

  it("starts at 0 and ends at duration", () => {
    const markers = generateMarkerTimes(1000);
    expect(markers[0]).toBe(0);
    expect(markers[markers.length - 1]).toBe(1000);
  });

  it("respects maxMarkers limit", () => {
    const markers = generateMarkerTimes(100000, 10, 250);
    expect(markers).toHaveLength(10);
  });

  it("handles short duration", () => {
    const markers = generateMarkerTimes(100, 40, 250);
    expect(markers.length).toBeGreaterThanOrEqual(1);
    expect(markers[0]).toBe(0);
  });
});
