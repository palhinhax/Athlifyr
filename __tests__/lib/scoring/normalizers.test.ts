import {
  calculateE1rm,
  clamp,
  effortMultiplier,
  normalizeEndurance,
  normalizeEnduranceByCalories,
  normalizeEngine,
  normalizeStrength,
  normalizeVolumeBonus,
  recencyWeight,
} from "@/lib/scoring/normalizers";

// ============================================================================
// clamp
// ============================================================================

describe("clamp", () => {
  it("returns value when within range", () => {
    expect(clamp(50, 0, 1000)).toBe(50);
  });

  it("clamps to min", () => {
    expect(clamp(-5, 0, 1000)).toBe(0);
  });

  it("clamps to max", () => {
    expect(clamp(1500, 0, 1000)).toBe(1000);
  });

  it("handles equal min and max", () => {
    expect(clamp(50, 42, 42)).toBe(42);
  });
});

// ============================================================================
// normalizeStrength
// ============================================================================

describe("normalizeStrength", () => {
  it("returns 0 for zero e1RM", () => {
    expect(normalizeStrength(0)).toBe(0);
  });

  it("returns 0 for negative e1RM", () => {
    expect(normalizeStrength(-10)).toBe(0);
  });

  it("returns ~700 for the default reference e1RM (100 kg)", () => {
    const score = normalizeStrength(100);
    expect(score).toBeGreaterThanOrEqual(680);
    expect(score).toBeLessThanOrEqual(720);
  });

  it("returns higher score for heavier weight", () => {
    expect(normalizeStrength(150)).toBeGreaterThan(normalizeStrength(100));
  });

  it("never exceeds 1000", () => {
    expect(normalizeStrength(1000)).toBeLessThanOrEqual(1000);
  });

  it("shows diminishing returns", () => {
    const gain100to150 = normalizeStrength(150) - normalizeStrength(100);
    const gain150to200 = normalizeStrength(200) - normalizeStrength(150);
    expect(gain100to150).toBeGreaterThan(gain150to200);
  });

  it("accepts optional custom reference", () => {
    // Custom ref 50 kg → 50 kg maps to ~700
    const score = normalizeStrength(50, 50);
    expect(score).toBeGreaterThanOrEqual(680);
    expect(score).toBeLessThanOrEqual(720);
  });

  it("custom ref changes the curve calibration", () => {
    // With ref=50, 100 kg should score higher than with ref=100
    const withSmallRef = normalizeStrength(100, 50);
    const withDefaultRef = normalizeStrength(100);
    expect(withSmallRef).toBeGreaterThan(withDefaultRef);
  });
});

// ============================================================================
// calculateE1rm
// ============================================================================

describe("calculateE1rm (normalizers)", () => {
  it("returns weight for 1 rep", () => {
    expect(calculateE1rm(100, 1)).toBe(100);
  });

  it("uses Epley formula for multiple reps", () => {
    // 100 * (1 + 5/30) = 116.67
    expect(calculateE1rm(100, 5)).toBeCloseTo(116.67, 1);
  });

  it("returns 0 for zero weight", () => {
    expect(calculateE1rm(0, 5)).toBe(0);
  });

  it("returns 0 for zero reps", () => {
    expect(calculateE1rm(100, 0)).toBe(0);
  });

  it("returns 0 for negative weight", () => {
    expect(calculateE1rm(-10, 5)).toBe(0);
  });
});

// ============================================================================
// normalizeEndurance
// ============================================================================

describe("normalizeEndurance", () => {
  it("returns 0 for zero pace", () => {
    expect(normalizeEndurance(0)).toBe(0);
  });

  it("returns ~700 for reference pace (300 s/km = 5:00/km)", () => {
    const score = normalizeEndurance(300);
    expect(score).toBeGreaterThanOrEqual(680);
    expect(score).toBeLessThanOrEqual(720);
  });

  it("returns higher score for faster pace", () => {
    expect(normalizeEndurance(240)).toBeGreaterThan(normalizeEndurance(300));
  });

  it("returns lower score for slower pace", () => {
    expect(normalizeEndurance(420)).toBeLessThan(normalizeEndurance(300));
  });

  it("never exceeds 1000", () => {
    expect(normalizeEndurance(60)).toBeLessThanOrEqual(1000);
  });
});

// ============================================================================
// normalizeEnduranceByCalories
// ============================================================================

describe("normalizeEnduranceByCalories", () => {
  it("returns 0 for zero calories", () => {
    expect(normalizeEnduranceByCalories(0, 600)).toBe(0);
  });

  it("returns 0 for zero time", () => {
    expect(normalizeEnduranceByCalories(100, 0)).toBe(0);
  });

  it("returns ~700 for 10 cal/min", () => {
    // 10 cal/min = 100 cal / 10 min = 100 cal / 600s
    const score = normalizeEnduranceByCalories(100, 600);
    expect(score).toBeGreaterThanOrEqual(680);
    expect(score).toBeLessThanOrEqual(720);
  });

  it("higher cal/min → higher score", () => {
    expect(normalizeEnduranceByCalories(200, 600)).toBeGreaterThan(
      normalizeEnduranceByCalories(100, 600)
    );
  });
});

// ============================================================================
// normalizeEngine
// ============================================================================

describe("normalizeEngine", () => {
  it("returns 0 for zero work-units", () => {
    expect(normalizeEngine(0)).toBe(0);
  });

  it("returns ~700 for reference work-units (150)", () => {
    const score = normalizeEngine(150);
    expect(score).toBeGreaterThanOrEqual(680);
    expect(score).toBeLessThanOrEqual(720);
  });

  it("higher work-units → higher score", () => {
    expect(normalizeEngine(300)).toBeGreaterThan(normalizeEngine(150));
  });

  it("never exceeds 1000", () => {
    expect(normalizeEngine(100000)).toBeLessThanOrEqual(1000);
  });
});

// ============================================================================
// effortMultiplier
// ============================================================================

describe("effortMultiplier", () => {
  it("returns 0.8 for effort 1", () => {
    expect(effortMultiplier(1)).toBeCloseTo(0.8, 2);
  });

  it("returns ~1.0 for effort 5", () => {
    expect(effortMultiplier(5)).toBeCloseTo(1.0, 1);
  });

  it("returns 1.2 for effort 10", () => {
    expect(effortMultiplier(10)).toBeCloseTo(1.2, 2);
  });

  it("clamps below 1", () => {
    expect(effortMultiplier(-5)).toBeCloseTo(0.8, 2);
  });

  it("clamps above 10", () => {
    expect(effortMultiplier(15)).toBeCloseTo(1.2, 2);
  });
});

// ============================================================================
// normalizeVolumeBonus
// ============================================================================

describe("normalizeVolumeBonus", () => {
  it("returns 0 for zero volume", () => {
    expect(normalizeVolumeBonus(0)).toBe(0);
  });

  it("returns value between 0 and 50", () => {
    const bonus = normalizeVolumeBonus(3000);
    expect(bonus).toBeGreaterThan(0);
    expect(bonus).toBeLessThanOrEqual(50);
  });

  it("approaches max with very high volume", () => {
    const bonus = normalizeVolumeBonus(50000);
    expect(bonus).toBeGreaterThan(45);
  });

  it("respects custom maxBonus", () => {
    const bonus = normalizeVolumeBonus(50000, 10);
    expect(bonus).toBeLessThanOrEqual(10);
  });
});

// ============================================================================
// recencyWeight
// ============================================================================

describe("recencyWeight", () => {
  it("returns ~1 for today", () => {
    const now = new Date();
    expect(recencyWeight(now, 30, now)).toBeCloseTo(1.0, 2);
  });

  it("returns ~0.5 after one half-life", () => {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    expect(recencyWeight(thirtyDaysAgo, 30, now)).toBeCloseTo(0.5, 1);
  });

  it("returns ~0.25 after two half-lives", () => {
    const now = new Date();
    const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);
    expect(recencyWeight(sixtyDaysAgo, 30, now)).toBeCloseTo(0.25, 1);
  });

  it("returns positive value even for very old dates", () => {
    const now = new Date();
    const yearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
    expect(recencyWeight(yearAgo, 30, now)).toBeGreaterThan(0);
  });
});
