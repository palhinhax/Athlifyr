import { calculateWorkoutScore } from "@/lib/scoring/workout-score";
import type {
  BlockResultInput,
  ExerciseResultInput,
  WorkoutLogInput,
} from "@/lib/scoring/types";
import { SCORE_VERSION } from "@/lib/scoring/types";

// ─── Helpers ────────────────────────────────────────────────────────────────

function makeExercise(
  overrides: Partial<ExerciseResultInput> = {}
): ExerciseResultInput {
  return {
    exerciseId: "ex-1",
    category: "GYM",
    effortScore: 5,
    hasReps: true,
    hasWeight: false,
    hasDistance: false,
    hasTime: false,
    hasCalories: false,
    isPR: false,
    ...overrides,
  };
}

function makeBlock(
  overrides: Partial<BlockResultInput> = {}
): BlockResultInput {
  return {
    blockType: "STRENGTH",
    exerciseResults: [],
    ...overrides,
  };
}

function makeLog(overrides: Partial<WorkoutLogInput> = {}): WorkoutLogInput {
  return {
    blockResults: [],
    ...overrides,
  };
}

// ============================================================================
// Output shape
// ============================================================================

describe("calculateWorkoutScore — output shape", () => {
  it("returns correct version", () => {
    const result = calculateWorkoutScore(makeLog());
    expect(result.version).toBe(SCORE_VERSION);
  });

  it("returns all breakdown fields", () => {
    const result = calculateWorkoutScore(makeLog());
    expect(result.breakdown).toHaveProperty("strength");
    expect(result.breakdown).toHaveProperty("endurance");
    expect(result.breakdown).toHaveProperty("engine");
    expect(result.breakdown).toHaveProperty("volumeBonus");
    expect(result.breakdown).toHaveProperty("prBonus");
  });

  it("returns highlights as array", () => {
    const result = calculateWorkoutScore(makeLog());
    expect(Array.isArray(result.highlights)).toBe(true);
  });

  it("returns calculatedAt as ISO string", () => {
    const result = calculateWorkoutScore(makeLog());
    expect(() => new Date(result.calculatedAt)).not.toThrow();
  });
});

// ============================================================================
// Empty / edge cases
// ============================================================================

describe("calculateWorkoutScore — edge cases", () => {
  it("returns 0 for empty workout", () => {
    const result = calculateWorkoutScore(makeLog());
    expect(result.totalScore).toBe(0);
    expect(result.highlights).toContain("No scored exercises recorded");
  });

  it("returns 0 for workout with only warmup/cooldown blocks", () => {
    const result = calculateWorkoutScore(
      makeLog({
        blockResults: [
          makeBlock({
            blockType: "WARMUP",
            exerciseResults: [makeExercise({ actualReps: 20, hasReps: true })],
          }),
          makeBlock({
            blockType: "COOLDOWN",
            exerciseResults: [makeExercise({ actualReps: 10, hasReps: true })],
          }),
        ],
      })
    );
    expect(result.totalScore).toBe(0);
  });

  it("returns 0 for workout with REST block only", () => {
    const result = calculateWorkoutScore(
      makeLog({
        blockResults: [
          makeBlock({
            blockType: "REST",
            exerciseResults: [makeExercise({ actualReps: 0 })],
          }),
        ],
      })
    );
    expect(result.totalScore).toBe(0);
  });
});

// ============================================================================
// Strength scoring
// ============================================================================

describe("calculateWorkoutScore — strength", () => {
  it("scores a heavy strength session", () => {
    const result = calculateWorkoutScore(
      makeLog({
        blockResults: [
          makeBlock({
            blockType: "STRENGTH",
            exerciseResults: [
              makeExercise({
                category: "WEIGHTLIFTING",
                effortScore: 8,
                hasWeight: true,
                sets: [
                  { reps: 5, weightKg: 100, isPR: false },
                  { reps: 5, weightKg: 100, isPR: false },
                  { reps: 3, weightKg: 110, isPR: false },
                ],
              }),
            ],
          }),
        ],
      })
    );

    expect(result.breakdown.strength).toBeGreaterThan(0);
    expect(result.totalScore).toBeGreaterThan(0);
  });

  it("uses best e1RM from sets", () => {
    const lightResult = calculateWorkoutScore(
      makeLog({
        blockResults: [
          makeBlock({
            blockType: "STRENGTH",
            exerciseResults: [
              makeExercise({
                category: "GYM",
                effortScore: 7,
                hasWeight: true,
                sets: [{ reps: 10, weightKg: 40, isPR: false }],
              }),
            ],
          }),
        ],
      })
    );

    const heavyResult = calculateWorkoutScore(
      makeLog({
        blockResults: [
          makeBlock({
            blockType: "STRENGTH",
            exerciseResults: [
              makeExercise({
                category: "GYM",
                effortScore: 7,
                hasWeight: true,
                sets: [{ reps: 3, weightKg: 120, isPR: false }],
              }),
            ],
          }),
        ],
      })
    );

    expect(heavyResult.breakdown.strength).toBeGreaterThan(
      lightResult.breakdown.strength
    );
  });

  it("falls back to summary weight/reps when no sets", () => {
    const result = calculateWorkoutScore(
      makeLog({
        blockResults: [
          makeBlock({
            blockType: "STRENGTH",
            exerciseResults: [
              makeExercise({
                category: "GYM",
                effortScore: 7,
                hasWeight: true,
                actualWeightKg: 80,
                actualReps: 5,
              }),
            ],
          }),
        ],
      })
    );
    expect(result.breakdown.strength).toBeGreaterThan(0);
  });
});

// ============================================================================
// Endurance scoring
// ============================================================================

describe("calculateWorkoutScore — endurance", () => {
  it("scores a running exercise via pace", () => {
    const result = calculateWorkoutScore(
      makeLog({
        blockResults: [
          makeBlock({
            blockType: "STRENGTH", // block type doesn't limit endurance; exercise metrics do
            exerciseResults: [
              makeExercise({
                category: "CARDIO",
                effortScore: 6,
                hasDistance: true,
                hasTime: true,
                actualDistanceM: 5000, // 5 km
                actualTimeSeconds: 1500, // 25 min → 5:00/km
              }),
            ],
          }),
        ],
      })
    );
    expect(result.breakdown.endurance).toBeGreaterThan(0);
  });

  it("scores a calorie-based cardio exercise", () => {
    const result = calculateWorkoutScore(
      makeLog({
        blockResults: [
          makeBlock({
            blockType: "AMRAP",
            exerciseResults: [
              makeExercise({
                category: "CARDIO",
                effortScore: 6,
                hasCalories: true,
                hasTime: true,
                actualCalories: 120,
                actualTimeSeconds: 600, // 10 min → 12 cal/min
              }),
            ],
          }),
        ],
      })
    );
    expect(result.breakdown.endurance).toBeGreaterThan(0);
  });
});

// ============================================================================
// Engine scoring
// ============================================================================

describe("calculateWorkoutScore — engine", () => {
  it("scores an AMRAP workout", () => {
    const result = calculateWorkoutScore(
      makeLog({
        blockResults: [
          makeBlock({
            blockType: "AMRAP",
            completedRounds: 5,
            exerciseResults: [
              makeExercise({
                category: "CROSSFIT",
                effortScore: 7,
                actualReps: 50, // 5 rounds × 10 reps
              }),
            ],
          }),
        ],
      })
    );
    expect(result.breakdown.engine).toBeGreaterThan(0);
    expect(result.totalScore).toBeGreaterThan(0);
  });

  it("scores a FOR_TIME workout", () => {
    const result = calculateWorkoutScore(
      makeLog({
        blockResults: [
          makeBlock({
            blockType: "FOR_TIME",
            completedTime: 600,
            exerciseResults: [
              makeExercise({
                category: "BODYWEIGHT",
                effortScore: 6,
                actualReps: 100,
              }),
              makeExercise({
                category: "CARDIO",
                effortScore: 5,
                actualReps: 50,
              }),
            ],
          }),
        ],
      })
    );
    expect(result.breakdown.engine).toBeGreaterThan(0);
  });

  it("uses set reps when available", () => {
    const result = calculateWorkoutScore(
      makeLog({
        blockResults: [
          makeBlock({
            blockType: "EMOM",
            exerciseResults: [
              makeExercise({
                category: "GYM",
                effortScore: 6,
                hasWeight: true,
                sets: [
                  { reps: 10, weightKg: 50, isPR: false },
                  { reps: 10, weightKg: 50, isPR: false },
                  { reps: 10, weightKg: 50, isPR: false },
                ],
              }),
            ],
          }),
        ],
      })
    );
    expect(result.breakdown.engine).toBeGreaterThan(0);
  });
});

// ============================================================================
// PR bonus
// ============================================================================

describe("calculateWorkoutScore — PR bonus", () => {
  it("adds PR bonus when exercise isPR", () => {
    const withPR = calculateWorkoutScore(
      makeLog({
        blockResults: [
          makeBlock({
            blockType: "STRENGTH",
            exerciseResults: [
              makeExercise({
                category: "GYM",
                effortScore: 7,
                hasWeight: true,
                isPR: true,
                sets: [{ reps: 1, weightKg: 120, isPR: true }],
              }),
            ],
          }),
        ],
      })
    );

    expect(withPR.breakdown.prBonus).toBeGreaterThan(0);
    expect(withPR.highlights.some((h) => h.includes("PR bonus"))).toBe(true);
  });

  it("caps PR bonus at maximum", () => {
    const result = calculateWorkoutScore(
      makeLog({
        blockResults: [
          makeBlock({
            blockType: "STRENGTH",
            exerciseResults: Array.from({ length: 10 }, () =>
              makeExercise({
                category: "GYM",
                effortScore: 7,
                hasWeight: true,
                isPR: true,
                sets: [{ reps: 5, weightKg: 80, isPR: true }],
              })
            ),
          }),
        ],
      })
    );
    expect(result.breakdown.prBonus).toBeLessThanOrEqual(10);
  });
});

// ============================================================================
// Volume bonus
// ============================================================================

describe("calculateWorkoutScore — volume bonus", () => {
  it("adds volume bonus for high-volume session", () => {
    const result = calculateWorkoutScore(
      makeLog({
        blockResults: [
          makeBlock({
            blockType: "STRENGTH",
            exerciseResults: [
              makeExercise({
                category: "GYM",
                effortScore: 7,
                hasWeight: true,
                sets: [
                  { reps: 10, weightKg: 80, isPR: false },
                  { reps: 10, weightKg: 80, isPR: false },
                  { reps: 10, weightKg: 80, isPR: false },
                  { reps: 10, weightKg: 80, isPR: false },
                  { reps: 10, weightKg: 80, isPR: false },
                ],
              }),
            ],
          }),
        ],
      })
    );
    expect(result.breakdown.volumeBonus).toBeGreaterThan(0);
  });

  it("does not exceed max volume bonus", () => {
    const result = calculateWorkoutScore(
      makeLog({
        blockResults: [
          makeBlock({
            blockType: "STRENGTH",
            exerciseResults: [
              makeExercise({
                category: "GYM",
                effortScore: 8,
                hasWeight: true,
                sets: Array.from({ length: 20 }, () => ({
                  reps: 10,
                  weightKg: 200,
                  isPR: false,
                })),
              }),
            ],
          }),
        ],
      })
    );
    expect(result.breakdown.volumeBonus).toBeLessThanOrEqual(20);
  });
});

// ============================================================================
// Mixed / hybrid workout
// ============================================================================

describe("calculateWorkoutScore — mixed workout", () => {
  it("scores a HYROX-style mixed workout", () => {
    const result = calculateWorkoutScore(
      makeLog({
        blockResults: [
          // Running block
          makeBlock({
            blockType: "FOR_TIME",
            exerciseResults: [
              makeExercise({
                category: "CARDIO",
                effortScore: 6,
                hasDistance: true,
                hasTime: true,
                actualDistanceM: 1000,
                actualTimeSeconds: 300,
              }),
            ],
          }),
          // Strength station
          makeBlock({
            blockType: "STRENGTH",
            exerciseResults: [
              makeExercise({
                category: "GYM",
                effortScore: 8,
                hasWeight: true,
                sets: [
                  { reps: 10, weightKg: 60, isPR: false },
                  { reps: 10, weightKg: 60, isPR: false },
                ],
              }),
            ],
          }),
          // Engine/AMRAP block
          makeBlock({
            blockType: "AMRAP",
            exerciseResults: [
              makeExercise({
                category: "BODYWEIGHT",
                effortScore: 6,
                actualReps: 80,
              }),
            ],
          }),
        ],
      })
    );

    // All three pillars should have some contribution
    expect(result.breakdown.strength).toBeGreaterThan(0);
    expect(result.breakdown.endurance).toBeGreaterThan(0);
    expect(result.breakdown.engine).toBeGreaterThan(0);
    expect(result.totalScore).toBeGreaterThan(0);
  });
});

// ============================================================================
// Total score capping
// ============================================================================

describe("calculateWorkoutScore — total capping", () => {
  it("never exceeds 100", () => {
    const result = calculateWorkoutScore(
      makeLog({
        blockResults: [
          makeBlock({
            blockType: "STRENGTH",
            exerciseResults: Array.from({ length: 5 }, () =>
              makeExercise({
                category: "WEIGHTLIFTING",
                effortScore: 10,
                hasWeight: true,
                isPR: true,
                sets: Array.from({ length: 5 }, () => ({
                  reps: 1,
                  weightKg: 200,
                  isPR: true,
                })),
              })
            ),
          }),
          makeBlock({
            blockType: "AMRAP",
            exerciseResults: Array.from({ length: 5 }, () =>
              makeExercise({
                category: "CROSSFIT",
                effortScore: 10,
                actualReps: 500,
              })
            ),
          }),
        ],
      })
    );
    expect(result.totalScore).toBeLessThanOrEqual(100);
  });
});

// ============================================================================
// Only time-based exercise
// ============================================================================

describe("calculateWorkoutScore — time-only exercise", () => {
  it("handles workout with only time-based exercise", () => {
    const result = calculateWorkoutScore(
      makeLog({
        blockResults: [
          makeBlock({
            blockType: "STRENGTH",
            exerciseResults: [
              makeExercise({
                category: "CARDIO",
                effortScore: 4,
                hasTime: true,
                actualTimeSeconds: 300,
              }),
            ],
          }),
        ],
      })
    );
    // Should not crash; time-only without distance/calories gives 0 endurance
    expect(result.totalScore).toBeGreaterThanOrEqual(0);
  });
});
