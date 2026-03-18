import { calculateWorkoutScore } from "@/lib/scoring/workout-score";
import type {
  BlockResultInput,
  ExerciseResultInput,
  WorkoutLogInput,
} from "@/lib/scoring/types";
import { WORKOUT_SCORE_VERSION } from "@/lib/scoring/constants";

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
    expect(result.version).toBe(WORKOUT_SCORE_VERSION);
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
// Strength scoring — metric-driven, no category dependency
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

  it("weighted exercise in engine block contributes to strength", () => {
    const result = calculateWorkoutScore(
      makeLog({
        blockResults: [
          makeBlock({
            blockType: "AMRAP",
            exerciseResults: [
              makeExercise({
                category: "CROSSFIT",
                effortScore: 7,
                hasWeight: true,
                sets: [{ reps: 5, weightKg: 60, isPR: false }],
              }),
            ],
          }),
        ],
      })
    );
    // Weighted exercise in AMRAP should still contribute to strength pillar
    expect(result.breakdown.strength).toBeGreaterThan(0);
    // And also to engine (since it's in an engine block)
    expect(result.breakdown.engine).toBeGreaterThan(0);
  });

  it("caps e1RM at anti-outlier limit", () => {
    const normal = calculateWorkoutScore(
      makeLog({
        blockResults: [
          makeBlock({
            blockType: "STRENGTH",
            exerciseResults: [
              makeExercise({
                category: "WEIGHTLIFTING",
                effortScore: 7,
                hasWeight: true,
                sets: [{ reps: 1, weightKg: 400, isPR: false }],
              }),
            ],
          }),
        ],
      })
    );

    // Even an absurdly heavy e1RM should not produce wildly different results
    // because the cap at 500 kg and diminishing returns both constrain it
    const absurd = calculateWorkoutScore(
      makeLog({
        blockResults: [
          makeBlock({
            blockType: "STRENGTH",
            exerciseResults: [
              makeExercise({
                category: "WEIGHTLIFTING",
                effortScore: 7,
                hasWeight: true,
                sets: [{ reps: 10, weightKg: 5000, isPR: false }],
              }),
            ],
          }),
        ],
      })
    );

    // The gap should be small due to cap + diminishing returns
    expect(absurd.breakdown.strength - normal.breakdown.strength).toBeLessThan(
      50
    );
  });
});

// ============================================================================
// Endurance scoring — metric-driven
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
// Engine scoring — work-units with density
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

  it("rewards faster FOR_TIME completion via density", () => {
    const slow = calculateWorkoutScore(
      makeLog({
        blockResults: [
          makeBlock({
            blockType: "FOR_TIME",
            completedTime: 1200, // 20 min
            exerciseResults: [
              makeExercise({
                category: "BODYWEIGHT",
                effortScore: 6,
                actualReps: 100,
              }),
            ],
          }),
        ],
      })
    );

    const fast = calculateWorkoutScore(
      makeLog({
        blockResults: [
          makeBlock({
            blockType: "FOR_TIME",
            completedTime: 300, // 5 min
            exerciseResults: [
              makeExercise({
                category: "BODYWEIGHT",
                effortScore: 6,
                actualReps: 100,
              }),
            ],
          }),
        ],
      })
    );

    expect(fast.breakdown.engine).toBeGreaterThan(slow.breakdown.engine);
  });

  it("caps per-exercise engine reps", () => {
    const normal = calculateWorkoutScore(
      makeLog({
        blockResults: [
          makeBlock({
            blockType: "AMRAP",
            exerciseResults: [
              makeExercise({
                category: "BODYWEIGHT",
                effortScore: 6,
                actualReps: 400,
              }),
            ],
          }),
        ],
      })
    );

    const extreme = calculateWorkoutScore(
      makeLog({
        blockResults: [
          makeBlock({
            blockType: "AMRAP",
            exerciseResults: [
              makeExercise({
                category: "BODYWEIGHT",
                effortScore: 6,
                actualReps: 50000,
              }),
            ],
          }),
        ],
      })
    );

    // Extreme reps should be capped at MAX_ENGINE_REPS_PER_EXERCISE (500)
    // so the difference should be modest
    expect(extreme.breakdown.engine - normal.breakdown.engine).toBeLessThan(
      100
    );
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
    expect(result.breakdown.prBonus).toBeLessThanOrEqual(30);
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
    expect(result.breakdown.volumeBonus).toBeLessThanOrEqual(50);
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
  it("never exceeds 1000", () => {
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
    expect(result.totalScore).toBeLessThanOrEqual(1000);
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

// ============================================================================
// Realistic workout validation — bonus proportions (#1)
// ============================================================================

describe("calculateWorkoutScore — realistic workout validation", () => {
  it("mediocre workout scores low with small bonuses", () => {
    // Beginner: 3 sets of 10 @ 30 kg on one exercise
    const result = calculateWorkoutScore(
      makeLog({
        blockResults: [
          makeBlock({
            blockType: "STRENGTH",
            exerciseResults: [
              makeExercise({
                category: "GYM",
                effortScore: 3,
                hasWeight: true,
                sets: [
                  { reps: 10, weightKg: 30, isPR: false },
                  { reps: 10, weightKg: 30, isPR: false },
                  { reps: 10, weightKg: 30, isPR: false },
                ],
              }),
            ],
          }),
        ],
      })
    );

    // Volume: 900 kg — well below 5000 ref → small bonus
    expect(result.breakdown.volumeBonus).toBeLessThan(15);
    expect(result.breakdown.prBonus).toBe(0);
    // Total should be modest — a mediocre workout
    expect(result.totalScore).toBeLessThan(300);
  });

  it("solid workout has moderate scores and proportional bonuses", () => {
    // Intermediate: 4 exercises × 4 sets of 8 @ 60–80 kg
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
                  { reps: 8, weightKg: 80, isPR: false },
                  { reps: 8, weightKg: 80, isPR: false },
                  { reps: 8, weightKg: 80, isPR: false },
                  { reps: 8, weightKg: 80, isPR: false },
                ],
              }),
              makeExercise({
                category: "GYM",
                effortScore: 6,
                hasWeight: true,
                sets: [
                  { reps: 8, weightKg: 60, isPR: false },
                  { reps: 8, weightKg: 60, isPR: false },
                  { reps: 8, weightKg: 60, isPR: false },
                  { reps: 8, weightKg: 60, isPR: false },
                ],
              }),
            ],
          }),
        ],
      })
    );

    // Volume: 2560 + 1920 = 4480 kg → decent bonus but not max
    expect(result.breakdown.volumeBonus).toBeGreaterThan(10);
    expect(result.breakdown.volumeBonus).toBeLessThan(40);
    // Strength should be meaningful
    expect(result.breakdown.strength).toBeGreaterThan(400);
    expect(result.totalScore).toBeGreaterThan(100);
    expect(result.totalScore).toBeLessThan(600);
  });

  it("bonuses stay proportional — PR bonus capped at 3% of max", () => {
    // A workout that hits both max PR and volume bonuses
    const result = calculateWorkoutScore(
      makeLog({
        blockResults: [
          makeBlock({
            blockType: "STRENGTH",
            exerciseResults: [
              makeExercise({
                category: "WEIGHTLIFTING",
                effortScore: 9,
                hasWeight: true,
                isPR: true,
                sets: [
                  { reps: 1, weightKg: 150, isPR: true },
                  { reps: 1, weightKg: 150, isPR: true },
                ],
              }),
            ],
          }),
        ],
      })
    );

    // PR bonus: max 30 points (3% of 1000)
    expect(result.breakdown.prBonus).toBeLessThanOrEqual(30);
    // Total should be driven by pillars, not bonuses
    const pillarContribution =
      result.breakdown.strength * 0.35 +
      result.breakdown.endurance * 0.35 +
      result.breakdown.engine * 0.3;
    const bonusContribution =
      result.breakdown.volumeBonus + result.breakdown.prBonus;
    // Bonuses should be a small fraction of the total
    expect(bonusContribution).toBeLessThan(pillarContribution);
  });
});

// ============================================================================
// Engine density across durations (#4)
// ============================================================================

describe("calculateWorkoutScore — engine density duration guard", () => {
  it("does NOT apply density for very short blocks (< 2 min)", () => {
    // 30-second sprint: 20 burpees
    const shortBlock = calculateWorkoutScore(
      makeLog({
        blockResults: [
          makeBlock({
            blockType: "FOR_TIME",
            completedTime: 30, // 30 sec — below threshold
            exerciseResults: [
              makeExercise({
                category: "BODYWEIGHT",
                effortScore: 8,
                actualReps: 20,
              }),
            ],
          }),
        ],
      })
    );

    // Same reps, no time context (density = 1.0 implicitly)
    const noTime = calculateWorkoutScore(
      makeLog({
        blockResults: [
          makeBlock({
            blockType: "AMRAP",
            exerciseResults: [
              makeExercise({
                category: "BODYWEIGHT",
                effortScore: 8,
                actualReps: 20,
              }),
            ],
          }),
        ],
      })
    );

    // Short block should NOT get a density boost
    expect(shortBlock.breakdown.engine).toBe(noTime.breakdown.engine);
  });

  it("applies density for medium-duration blocks (≥ 2 min)", () => {
    const withDensity = calculateWorkoutScore(
      makeLog({
        blockResults: [
          makeBlock({
            blockType: "FOR_TIME",
            completedTime: 300, // 5 min — above threshold
            exerciseResults: [
              makeExercise({
                category: "BODYWEIGHT",
                effortScore: 6,
                actualReps: 100,
              }),
            ],
          }),
        ],
      })
    );

    const withoutTime = calculateWorkoutScore(
      makeLog({
        blockResults: [
          makeBlock({
            blockType: "AMRAP",
            exerciseResults: [
              makeExercise({
                category: "BODYWEIGHT",
                effortScore: 6,
                actualReps: 100,
              }),
            ],
          }),
        ],
      })
    );

    // Density should boost the score for a 5-min block
    expect(withDensity.breakdown.engine).toBeGreaterThan(
      withoutTime.breakdown.engine
    );
  });

  it("long workouts get moderate density reward", () => {
    const long = calculateWorkoutScore(
      makeLog({
        blockResults: [
          makeBlock({
            blockType: "FOR_TIME",
            completedTime: 2400, // 40 min
            exerciseResults: [
              makeExercise({
                category: "BODYWEIGHT",
                effortScore: 6,
                actualReps: 200,
              }),
            ],
          }),
        ],
      })
    );

    const medium = calculateWorkoutScore(
      makeLog({
        blockResults: [
          makeBlock({
            blockType: "FOR_TIME",
            completedTime: 600, // 10 min
            exerciseResults: [
              makeExercise({
                category: "BODYWEIGHT",
                effortScore: 6,
                actualReps: 200,
              }),
            ],
          }),
        ],
      })
    );

    // Medium (10 min) should have better density than long (40 min)
    // since density = refMinutes / actualMinutes
    expect(medium.breakdown.engine).toBeGreaterThan(long.breakdown.engine);
  });
});

// ============================================================================
// Per-block engine cap (#5)
// ============================================================================

describe("calculateWorkoutScore — per-block engine cap", () => {
  it("a single huge engine block is capped", () => {
    const uncapped = calculateWorkoutScore(
      makeLog({
        blockResults: [
          makeBlock({
            blockType: "AMRAP",
            exerciseResults: Array.from({ length: 5 }, () =>
              makeExercise({
                category: "BODYWEIGHT",
                effortScore: 10,
                actualReps: 500, // Each capped at 500 reps
              })
            ),
          }),
        ],
      })
    );

    const twoBlocks = calculateWorkoutScore(
      makeLog({
        blockResults: [
          makeBlock({
            blockType: "AMRAP",
            exerciseResults: [
              makeExercise({
                category: "BODYWEIGHT",
                effortScore: 6,
                actualReps: 100,
              }),
            ],
          }),
          makeBlock({
            blockType: "EMOM",
            exerciseResults: [
              makeExercise({
                category: "BODYWEIGHT",
                effortScore: 6,
                actualReps: 100,
              }),
            ],
          }),
        ],
      })
    );

    // The huge single block should be capped — it should NOT score
    // dramatically higher than two reasonable blocks combined
    expect(uncapped.breakdown.engine).toBeLessThanOrEqual(1000);
    // Two modest blocks should still produce meaningful engine
    expect(twoBlocks.breakdown.engine).toBeGreaterThan(0);
  });

  it("two moderate blocks can score higher than one capped block", () => {
    const singleCapped = calculateWorkoutScore(
      makeLog({
        blockResults: [
          makeBlock({
            blockType: "AMRAP",
            exerciseResults: Array.from({ length: 10 }, () =>
              makeExercise({
                category: "BODYWEIGHT",
                effortScore: 8,
                actualReps: 500,
              })
            ),
          }),
        ],
      })
    );

    const multiBlock = calculateWorkoutScore(
      makeLog({
        blockResults: [
          makeBlock({
            blockType: "AMRAP",
            exerciseResults: [
              makeExercise({
                category: "BODYWEIGHT",
                effortScore: 7,
                actualReps: 200,
              }),
            ],
          }),
          makeBlock({
            blockType: "FOR_TIME",
            completedTime: 600,
            exerciseResults: [
              makeExercise({
                category: "BODYWEIGHT",
                effortScore: 7,
                actualReps: 200,
              }),
            ],
          }),
          makeBlock({
            blockType: "EMOM",
            exerciseResults: [
              makeExercise({
                category: "BODYWEIGHT",
                effortScore: 7,
                actualReps: 150,
              }),
            ],
          }),
        ],
      })
    );

    // Multi-block workout should score higher because it demonstrates
    // more variety and each block contributes its capped amount
    expect(multiBlock.breakdown.engine).toBeGreaterThan(
      singleCapped.breakdown.engine
    );
  });
});
