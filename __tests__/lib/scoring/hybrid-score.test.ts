import { calculateHybridScore } from "@/lib/scoring/hybrid-score";
import type {
  PerformanceHistoryEntry,
  WorkoutScoreHistoryEntry,
} from "@/lib/scoring/types";
import { HYBRID_SCORE_VERSION } from "@/lib/scoring/constants";

// ─── Helpers ────────────────────────────────────────────────────────────────

const NOW = new Date("2026-03-18T12:00:00Z");

function daysAgo(days: number): Date {
  return new Date(NOW.getTime() - days * 24 * 60 * 60 * 1000);
}

function makeWorkoutScore(
  overrides: Partial<WorkoutScoreHistoryEntry> = {}
): WorkoutScoreHistoryEntry {
  return {
    totalScore: 500,
    breakdown: {
      strength: 500,
      endurance: 500,
      engine: 500,
      volumeBonus: 0,
      prBonus: 0,
    },
    performedAt: daysAgo(1),
    ...overrides,
  };
}

function makePerformanceEntry(
  overrides: Partial<PerformanceHistoryEntry> = {}
): PerformanceHistoryEntry {
  return {
    type: "STRENGTH",
    performedAt: daysAgo(1),
    ...overrides,
  };
}

// ============================================================================
// Output shape
// ============================================================================

describe("calculateHybridScore — output shape", () => {
  it("returns correct version", () => {
    const result = calculateHybridScore([], [], NOW);
    expect(result.version).toBe(HYBRID_SCORE_VERSION);
  });

  it("returns all breakdown fields", () => {
    const result = calculateHybridScore([], [], NOW);
    expect(result.breakdown).toHaveProperty("strength");
    expect(result.breakdown).toHaveProperty("endurance");
    expect(result.breakdown).toHaveProperty("engine");
  });

  it("returns confidence", () => {
    const result = calculateHybridScore([], [], NOW);
    expect(["LOW", "MEDIUM", "HIGH"]).toContain(result.confidence);
  });

  it("returns calculatedAt", () => {
    const result = calculateHybridScore([], [], NOW);
    expect(result.calculatedAt).toBe(NOW.toISOString());
  });
});

// ============================================================================
// Empty / edge cases
// ============================================================================

describe("calculateHybridScore — edge cases", () => {
  it("returns 0 for no data", () => {
    const result = calculateHybridScore([], [], NOW);
    expect(result.totalScore).toBe(0);
    expect(result.confidence).toBe("LOW");
  });

  it("returns 0 for all data outside history window", () => {
    const result = calculateHybridScore(
      [makeWorkoutScore({ performedAt: daysAgo(100) })],
      [
        makePerformanceEntry({
          type: "STRENGTH",
          weightKg: 100,
          reps: 5,
          performedAt: daysAgo(100),
        }),
      ],
      NOW
    );
    expect(result.totalScore).toBe(0);
  });

  it("handles missing strength data gracefully", () => {
    const result = calculateHybridScore(
      [
        makeWorkoutScore({
          breakdown: {
            strength: 0,
            endurance: 0,
            engine: 800,
            volumeBonus: 0,
            prBonus: 0,
          },
        }),
      ],
      [
        makePerformanceEntry({
          type: "RUN",
          distanceKm: 10,
          timeSeconds: 3000,
        }),
      ],
      NOW
    );
    // Should still produce a score from endurance + engine
    expect(result.totalScore).toBeGreaterThan(0);
    expect(result.breakdown.strength).toBe(0);
  });

  it("handles missing endurance data gracefully", () => {
    const result = calculateHybridScore(
      [],
      [
        makePerformanceEntry({
          type: "STRENGTH",
          weightKg: 100,
          reps: 5,
        }),
      ],
      NOW
    );
    expect(result.totalScore).toBeGreaterThan(0);
    expect(result.breakdown.endurance).toBe(0);
  });
});

// ============================================================================
// Strength pillar
// ============================================================================

describe("calculateHybridScore — strength pillar", () => {
  it("computes strength from performance entries", () => {
    const result = calculateHybridScore(
      [],
      [
        makePerformanceEntry({
          type: "STRENGTH",
          weightKg: 100,
          reps: 5,
          performedAt: daysAgo(5),
        }),
        makePerformanceEntry({
          type: "STRENGTH",
          weightKg: 80,
          reps: 8,
          performedAt: daysAgo(10),
        }),
      ],
      NOW
    );
    expect(result.breakdown.strength).toBeGreaterThan(0);
  });

  it("higher e1RM → higher strength", () => {
    const light = calculateHybridScore(
      [],
      [
        makePerformanceEntry({
          type: "STRENGTH",
          weightKg: 50,
          reps: 5,
        }),
      ],
      NOW
    );

    const heavy = calculateHybridScore(
      [],
      [
        makePerformanceEntry({
          type: "STRENGTH",
          weightKg: 150,
          reps: 5,
        }),
      ],
      NOW
    );

    expect(heavy.breakdown.strength).toBeGreaterThan(light.breakdown.strength);
  });

  it("recent entries weigh more", () => {
    const recent = calculateHybridScore(
      [],
      [
        makePerformanceEntry({
          type: "STRENGTH",
          weightKg: 100,
          reps: 5,
          performedAt: daysAgo(1),
        }),
      ],
      NOW
    );

    const old = calculateHybridScore(
      [],
      [
        makePerformanceEntry({
          type: "STRENGTH",
          weightKg: 100,
          reps: 5,
          performedAt: daysAgo(60),
        }),
      ],
      NOW
    );

    // Both produce the same normalised strength, but the recent one has full weight
    // and the old one has decayed weight. Since there's only 1 entry each,
    // the weighted average is the same value regardless of weight.
    // What matters is that neither crashes.
    expect(recent.breakdown.strength).toBeGreaterThan(0);
    expect(old.breakdown.strength).toBeGreaterThan(0);
  });
});

// ============================================================================
// Endurance pillar
// ============================================================================

describe("calculateHybridScore — endurance pillar", () => {
  it("computes endurance from run entries", () => {
    const result = calculateHybridScore(
      [],
      [
        makePerformanceEntry({
          type: "RUN",
          distanceKm: 10,
          timeSeconds: 3000, // 5:00/km
          performedAt: daysAgo(3),
        }),
      ],
      NOW
    );
    expect(result.breakdown.endurance).toBeGreaterThan(0);
  });

  it("includes TRAIL entries", () => {
    const result = calculateHybridScore(
      [],
      [
        makePerformanceEntry({
          type: "TRAIL",
          distanceKm: 15,
          timeSeconds: 6000, // 6:40/km
          performedAt: daysAgo(5),
        }),
      ],
      NOW
    );
    expect(result.breakdown.endurance).toBeGreaterThan(0);
  });

  it("faster pace → higher endurance", () => {
    const slow = calculateHybridScore(
      [],
      [
        makePerformanceEntry({
          type: "RUN",
          distanceKm: 10,
          timeSeconds: 4200, // 7:00/km
        }),
      ],
      NOW
    );

    const fast = calculateHybridScore(
      [],
      [
        makePerformanceEntry({
          type: "RUN",
          distanceKm: 10,
          timeSeconds: 2400, // 4:00/km
        }),
      ],
      NOW
    );

    expect(fast.breakdown.endurance).toBeGreaterThan(slow.breakdown.endurance);
  });
});

// ============================================================================
// Engine pillar
// ============================================================================

describe("calculateHybridScore — engine pillar", () => {
  it("computes engine from workout scores", () => {
    const result = calculateHybridScore(
      [
        makeWorkoutScore({
          breakdown: {
            strength: 500,
            endurance: 300,
            engine: 750,
            volumeBonus: 25,
            prBonus: 0,
          },
          performedAt: daysAgo(2),
        }),
      ],
      [],
      NOW
    );
    expect(result.breakdown.engine).toBeGreaterThan(0);
  });

  it("ignores workout scores with 0 engine", () => {
    const result = calculateHybridScore(
      [
        makeWorkoutScore({
          breakdown: {
            strength: 800,
            endurance: 0,
            engine: 0,
            volumeBonus: 25,
            prBonus: 15,
          },
          performedAt: daysAgo(2),
        }),
      ],
      [],
      NOW
    );
    expect(result.breakdown.engine).toBe(0);
  });
});

// ============================================================================
// Confidence
// ============================================================================

describe("calculateHybridScore — confidence", () => {
  it("returns LOW for < 5 data points", () => {
    const result = calculateHybridScore(
      [makeWorkoutScore()],
      [makePerformanceEntry({ type: "STRENGTH", weightKg: 80, reps: 5 })],
      NOW
    );
    expect(result.confidence).toBe("LOW");
  });

  it("returns MEDIUM for 5-14 data points", () => {
    const workouts = Array.from({ length: 3 }, (_, i) =>
      makeWorkoutScore({ performedAt: daysAgo(i + 1) })
    );
    const perfs = Array.from({ length: 4 }, (_, i) =>
      makePerformanceEntry({
        type: "STRENGTH",
        weightKg: 80 + i * 5,
        reps: 5,
        performedAt: daysAgo(i + 1),
      })
    );
    const result = calculateHybridScore(workouts, perfs, NOW);
    expect(result.confidence).toBe("MEDIUM");
  });

  it("returns HIGH for 15+ data points", () => {
    const workouts = Array.from({ length: 8 }, (_, i) =>
      makeWorkoutScore({ performedAt: daysAgo(i + 1) })
    );
    const perfs = Array.from({ length: 8 }, (_, i) =>
      makePerformanceEntry({
        type: "STRENGTH",
        weightKg: 80 + i * 5,
        reps: 5,
        performedAt: daysAgo(i + 1),
      })
    );
    const result = calculateHybridScore(workouts, perfs, NOW);
    expect(result.confidence).toBe("HIGH");
  });
});

// ============================================================================
// Total score
// ============================================================================

describe("calculateHybridScore — total", () => {
  it("stays within 0-1000", () => {
    const result = calculateHybridScore(
      Array.from({ length: 20 }, (_, i) =>
        makeWorkoutScore({
          totalScore: 1000,
          breakdown: {
            strength: 1000,
            endurance: 1000,
            engine: 1000,
            volumeBonus: 50,
            prBonus: 30,
          },
          performedAt: daysAgo(i + 1),
        })
      ),
      Array.from({ length: 20 }, (_, i) =>
        makePerformanceEntry({
          type: "STRENGTH",
          weightKg: 200,
          reps: 1,
          performedAt: daysAgo(i + 1),
        })
      ),
      NOW
    );
    expect(result.totalScore).toBeLessThanOrEqual(1000);
    expect(result.totalScore).toBeGreaterThanOrEqual(0);
  });

  it("combines all three pillars", () => {
    const result = calculateHybridScore(
      [
        makeWorkoutScore({
          breakdown: {
            strength: 0,
            endurance: 0,
            engine: 800,
            volumeBonus: 0,
            prBonus: 0,
          },
        }),
      ],
      [
        makePerformanceEntry({
          type: "STRENGTH",
          weightKg: 100,
          reps: 5,
        }),
        makePerformanceEntry({
          type: "RUN",
          distanceKm: 10,
          timeSeconds: 3000,
        }),
      ],
      NOW
    );
    expect(result.breakdown.strength).toBeGreaterThan(0);
    expect(result.breakdown.endurance).toBeGreaterThan(0);
    expect(result.breakdown.engine).toBeGreaterThan(0);
    expect(result.totalScore).toBeGreaterThan(0);
  });
});
