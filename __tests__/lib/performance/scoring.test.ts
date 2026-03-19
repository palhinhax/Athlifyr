import {
  computeRunQualityScore,
  computeStrengthQualityScore,
  computePredictionWeight,
  computeRunScores,
  computeStrengthScores,
  calculateE1rm,
  predictTimeWithRiegel,
  predictHalfMarathon,
  predictE1rm,
  formatTime,
  parseTimeToSeconds,
  formatPace,
} from "@/lib/performance/scoring";

import type { RunEntry, StrengthEntry } from "@/lib/performance/scoring";

// ============================================================================
// QUALITY SCORING - RUNNING
// ============================================================================

describe("computeRunQualityScore", () => {
  it("returns 1.0 for normal training pace (5:00/km)", () => {
    // 5:00/km = 300s/km, 10km run = 3000s
    expect(computeRunQualityScore(10, 3000)).toBe(1.0);
  });

  it("returns 0.2 for impossibly fast pace (< 2 min/km)", () => {
    // 1:30/km = 90s/km, 5km = 450s
    expect(computeRunQualityScore(5, 450)).toBe(0.2);
  });

  it("returns 0.3 for impossibly slow pace (> 15 min/km)", () => {
    // 16:00/km = 960s/km, 5km = 4800s
    expect(computeRunQualityScore(5, 4800)).toBe(0.3);
  });

  it("returns 0.2 for ultra-fast long distance (30km+ < 3min/km)", () => {
    // 2:50/km on 30km = 170s/km * 30 = 5100s
    expect(computeRunQualityScore(30, 5100)).toBe(0.2);
  });

  it("returns 0.4 for very fast on 20km+ without elevation", () => {
    // 3:10/km on 20km = 190s/km * 20 = 3800s
    expect(computeRunQualityScore(20, 3800, 0)).toBe(0.4);
  });

  it("returns 0.9 for slightly slow pace (8-10 min/km)", () => {
    // 9:00/km = 540s/km, 5km = 2700s
    expect(computeRunQualityScore(5, 2700)).toBe(0.9);
  });

  it("returns 0.7 for slow pace (10-12 min/km)", () => {
    // 11:00/km = 660s/km, 5km = 3300s
    expect(computeRunQualityScore(5, 3300)).toBe(0.7);
  });

  it("returns 0.5 for hiking pace (> 12 min/km)", () => {
    // 14:00/km = 840s/km, 5km = 4200s
    expect(computeRunQualityScore(5, 4200)).toBe(0.5);
  });
});

// ============================================================================
// QUALITY SCORING - STRENGTH
// ============================================================================

describe("computeStrengthQualityScore", () => {
  it("returns 1.0 for good rep range (1-12)", () => {
    expect(computeStrengthQualityScore(100, 5)).toBe(1.0);
    expect(computeStrengthQualityScore(100, 1)).toBe(1.0);
    expect(computeStrengthQualityScore(100, 12)).toBe(1.0);
  });

  it("returns 0.8 for 13-15 reps", () => {
    expect(computeStrengthQualityScore(50, 14)).toBe(0.8);
  });

  it("returns 0.7 for 16-20 reps", () => {
    expect(computeStrengthQualityScore(50, 18)).toBe(0.7);
  });

  it("returns 0.6 for > 20 reps", () => {
    expect(computeStrengthQualityScore(50, 25)).toBe(0.6);
  });

  it("returns 0.5 for zero weight", () => {
    expect(computeStrengthQualityScore(0, 10)).toBe(0.5);
  });

  it("returns 0 for invalid reps (< 1)", () => {
    expect(computeStrengthQualityScore(100, 0)).toBe(0);
  });
});

// ============================================================================
// PREDICTION WEIGHT
// ============================================================================

describe("computePredictionWeight", () => {
  it("returns full weight for recent high-quality entry", () => {
    const now = new Date();
    const weight = computePredictionWeight(1.0, now);
    expect(weight).toBeCloseTo(1.0, 1);
  });

  it("decays weight over time (45-day constant)", () => {
    const fortyFiveDaysAgo = new Date(Date.now() - 45 * 24 * 3600 * 1000);
    const weight = computePredictionWeight(1.0, fortyFiveDaysAgo);
    // exp(-1) ≈ 0.368
    expect(weight).toBeCloseTo(0.368, 1);
  });

  it("has a floor of 0.01", () => {
    const veryOld = new Date(Date.now() - 365 * 24 * 3600 * 1000);
    const weight = computePredictionWeight(0.1, veryOld);
    expect(weight).toBeGreaterThanOrEqual(0.01);
  });

  it("down-weights outliers (> 50% deviation from median)", () => {
    const now = new Date();
    const weight = computePredictionWeight(1.0, now, 100, 200);
    // 100% deviation → weight *= 0.3
    expect(weight).toBeCloseTo(0.3, 1);
  });

  it("moderately down-weights moderate deviations (30-50%)", () => {
    const now = new Date();
    const weight = computePredictionWeight(1.0, now, 100, 140);
    // 40% deviation → weight *= 0.6
    expect(weight).toBeCloseTo(0.6, 1);
  });

  it("does not penalize values within 30% of median", () => {
    const now = new Date();
    const weight = computePredictionWeight(1.0, now, 100, 120);
    // 20% deviation → no penalty
    expect(weight).toBeCloseTo(1.0, 1);
  });
});

// ============================================================================
// COMPUTE RUN SCORES
// ============================================================================

describe("computeRunScores", () => {
  it("returns quality and prediction weight for a run entry", () => {
    const entry = {
      distanceKm: 10,
      timeSeconds: 3000,
      performedAt: new Date(),
    };
    const result = computeRunScores(entry, []);
    expect(result.qualityScore).toBe(1.0);
    expect(result.predictionWeight).toBeGreaterThan(0);
    expect(result.predictionWeight).toBeLessThanOrEqual(1);
  });

  it("uses median pace from recent history for outlier detection", () => {
    const now = new Date();
    const history = [
      { distanceKm: 10, timeSeconds: 3000, performedAt: now }, // 5:00/km
      { distanceKm: 10, timeSeconds: 3100, performedAt: now }, // 5:10/km
      { distanceKm: 10, timeSeconds: 2900, performedAt: now }, // 4:50/km
    ];

    // Normal entry
    const normal = computeRunScores(
      { distanceKm: 10, timeSeconds: 3050, performedAt: now },
      history
    );

    // Outlier entry (much faster)
    const outlier = computeRunScores(
      { distanceKm: 10, timeSeconds: 1500, performedAt: now }, // 2:30/km
      history
    );

    expect(normal.predictionWeight).toBeGreaterThan(outlier.predictionWeight);
  });
});

// ============================================================================
// COMPUTE STRENGTH SCORES
// ============================================================================

describe("computeStrengthScores", () => {
  it("returns quality and prediction weight for strength entry", () => {
    const entry = { weightKg: 100, reps: 5, performedAt: new Date() };
    const result = computeStrengthScores(entry, []);
    expect(result.qualityScore).toBe(1.0);
    expect(result.predictionWeight).toBeGreaterThan(0);
  });
});

// ============================================================================
// CALCULATE E1RM (Epley Formula)
// ============================================================================

describe("calculateE1rm", () => {
  it("returns weight directly for 1 rep (actual 1RM)", () => {
    expect(calculateE1rm(100, 1)).toBe(100);
  });

  it("calculates e1RM using Epley formula for multiple reps", () => {
    // e1rm = 100 * (1 + 5/30) = 100 * 1.1667 ≈ 116.67
    expect(calculateE1rm(100, 5)).toBeCloseTo(116.67, 1);
  });

  it("calculates e1RM for high reps", () => {
    // e1rm = 60 * (1 + 10/30) = 60 * 1.333 = 80
    expect(calculateE1rm(60, 10)).toBeCloseTo(80, 1);
  });
});

// ============================================================================
// PREDICT TIME WITH RIEGEL
// ============================================================================

describe("predictTimeWithRiegel", () => {
  it("predicts longer distance time from shorter distance", () => {
    // Known: 10km in 50 min (3000s)
    // Predict: 21.1km
    const predicted = predictTimeWithRiegel(10, 3000, 21.0975);
    // T2 = 3000 * (21.0975/10)^1.06
    expect(predicted).toBeGreaterThan(6000); // should be > 100 min
    expect(predicted).toBeLessThan(7500); // should be < 125 min
  });

  it("returns same time for same distance", () => {
    const predicted = predictTimeWithRiegel(10, 3000, 10);
    expect(predicted).toBeCloseTo(3000, 0);
  });

  it("predicts shorter distance time correctly", () => {
    // Known: 21km in 6300s. Predict 10km
    const predicted = predictTimeWithRiegel(21.0975, 6300, 10);
    expect(predicted).toBeLessThan(6300);
    expect(predicted).toBeGreaterThan(2500);
  });
});

// ============================================================================
// PREDICT HALF MARATHON
// ============================================================================

describe("predictHalfMarathon", () => {
  it("returns null when no valid entries", () => {
    expect(predictHalfMarathon([])).toBeNull();
  });

  it("returns null when all entries have low quality", () => {
    const entries: RunEntry[] = [
      {
        distanceKm: 5,
        timeSeconds: 500,
        performedAt: new Date(),
        qualityScore: 0.2, // too low
        predictionWeight: 0.1,
      },
    ];
    expect(predictHalfMarathon(entries)).toBeNull();
  });

  it("predicts half marathon time from valid entries", () => {
    const entries: RunEntry[] = [
      {
        distanceKm: 10,
        timeSeconds: 3000, // 50 min for 10k
        performedAt: new Date(),
        qualityScore: 1.0,
        predictionWeight: 0.9,
      },
    ];

    const result = predictHalfMarathon(entries);
    expect(result).not.toBeNull();
    expect(result!.predictedTimeSeconds).toBeGreaterThan(0);
    expect(result!.averagePace).toBeGreaterThan(0);
    expect(result!.inputsUsedCount).toBe(1);
    expect(result!.confidence).toBe("LOW"); // only 1 entry
  });

  it("returns MEDIUM confidence with 3-5 entries", () => {
    const now = new Date();
    const entries: RunEntry[] = Array.from({ length: 4 }, (_, i) => ({
      distanceKm: 10,
      timeSeconds: 3000 + i * 50,
      performedAt: now,
      qualityScore: 1.0,
      predictionWeight: 0.9,
    }));

    const result = predictHalfMarathon(entries);
    expect(result!.confidence).toBe("MEDIUM");
  });

  it("returns HIGH confidence with 6+ entries", () => {
    const now = new Date();
    const entries: RunEntry[] = Array.from({ length: 7 }, (_, i) => ({
      distanceKm: 10,
      timeSeconds: 3000 + i * 30,
      performedAt: now,
      qualityScore: 1.0,
      predictionWeight: 0.9,
    }));

    const result = predictHalfMarathon(entries);
    expect(result!.confidence).toBe("HIGH");
  });

  it("includes prediction range", () => {
    const entries: RunEntry[] = [
      {
        distanceKm: 10,
        timeSeconds: 3000,
        performedAt: new Date(),
        qualityScore: 1.0,
        predictionWeight: 0.9,
      },
    ];

    const result = predictHalfMarathon(entries)!;
    expect(result.rangeLowSeconds).toBeLessThan(result.predictedTimeSeconds);
    expect(result.rangeHighSeconds).toBeGreaterThan(
      result.predictedTimeSeconds
    );
  });

  it("filters out null qualityScore/predictionWeight entries", () => {
    const entries: RunEntry[] = [
      {
        distanceKm: 10,
        timeSeconds: 3000,
        performedAt: new Date(),
        qualityScore: null,
        predictionWeight: null,
      },
      {
        distanceKm: 10,
        timeSeconds: 3000,
        performedAt: new Date(),
        qualityScore: 1.0,
        predictionWeight: 0.9,
      },
    ];

    const result = predictHalfMarathon(entries)!;
    expect(result.inputsUsedCount).toBe(1);
  });
});

// ============================================================================
// PREDICT E1RM
// ============================================================================

describe("predictE1rm", () => {
  it("returns null for no matching entries", () => {
    expect(predictE1rm([], "squat-1", "Squat")).toBeNull();
  });

  it("predicts e1RM from strength entries", () => {
    const entries: StrengthEntry[] = [
      {
        exerciseId: "squat-1",
        weightKg: 100,
        reps: 5,
        performedAt: new Date(),
        qualityScore: 1.0,
        predictionWeight: 0.9,
      },
    ];

    const result = predictE1rm(entries, "squat-1", "Squat");
    expect(result).not.toBeNull();
    expect(result!.exerciseId).toBe("squat-1");
    expect(result!.exerciseName).toBe("Squat");
    expect(result!.currentE1rmKg).toBeGreaterThan(100); // With 5 reps, e1RM > weight
    expect(result!.inputsUsedCount).toBe(1);
  });

  it("filters entries by exerciseId", () => {
    const entries: StrengthEntry[] = [
      {
        exerciseId: "squat-1",
        weightKg: 100,
        reps: 5,
        performedAt: new Date(),
        qualityScore: 1.0,
        predictionWeight: 0.9,
      },
      {
        exerciseId: "bench-1",
        weightKg: 80,
        reps: 5,
        performedAt: new Date(),
        qualityScore: 1.0,
        predictionWeight: 0.9,
      },
    ];

    const result = predictE1rm(entries, "squat-1", "Squat")!;
    expect(result.inputsUsedCount).toBe(1);
  });

  it("gives HIGH confidence with recent 1RM test", () => {
    const entries: StrengthEntry[] = [
      {
        exerciseId: "squat-1",
        weightKg: 120,
        reps: 1, // actual 1RM
        performedAt: new Date(), // today
        qualityScore: 1.0,
        predictionWeight: 0.9,
      },
    ];

    const result = predictE1rm(entries, "squat-1", "Squat")!;
    expect(result.confidence).toBe("HIGH");
    // With 1 rep, e1RM should equal the weight
    expect(result.currentE1rmKg).toBeCloseTo(120, 0);
  });

  it("excludes entries with reps > 12", () => {
    const entries: StrengthEntry[] = [
      {
        exerciseId: "squat-1",
        weightKg: 50,
        reps: 20, // too many reps for e1RM
        performedAt: new Date(),
        qualityScore: 1.0,
        predictionWeight: 0.9,
      },
    ];

    const result = predictE1rm(entries, "squat-1", "Squat");
    expect(result).toBeNull();
  });
});

// ============================================================================
// FORMATTING UTILITIES
// ============================================================================

describe("formatTime", () => {
  it("formats seconds to mm:ss", () => {
    expect(formatTime(65)).toBe("1:05");
  });

  it("formats to hh:mm:ss when hours > 0", () => {
    expect(formatTime(3661)).toBe("1:01:01");
  });

  it("formats zero correctly", () => {
    expect(formatTime(0)).toBe("0:00");
  });

  it("pads minutes and seconds with zeros", () => {
    expect(formatTime(3601)).toBe("1:00:01");
  });
});

describe("parseTimeToSeconds", () => {
  it("parses mm:ss format", () => {
    expect(parseTimeToSeconds("5:30")).toBe(330);
  });

  it("parses hh:mm:ss format", () => {
    expect(parseTimeToSeconds("1:30:00")).toBe(5400);
  });

  it("returns null for invalid format", () => {
    expect(parseTimeToSeconds("abc")).toBeNull();
  });

  it("returns null for single value", () => {
    expect(parseTimeToSeconds("300")).toBeNull();
  });
});

describe("formatPace", () => {
  it("formats pace in sec/km to min:ss/km", () => {
    expect(formatPace(300)).toBe("5:00"); // 5:00/km
  });

  it("handles pace with seconds", () => {
    expect(formatPace(330)).toBe("5:30"); // 5:30/km
  });

  it("pads seconds with zero", () => {
    expect(formatPace(305)).toBe("5:05"); // 5:05/km
  });
});
