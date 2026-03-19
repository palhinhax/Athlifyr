# Workout Score & Hybrid Score — Technical Design v2

> **Status**: Foundation implemented (Phase 1)
> **Workout Score Version**: 1
> **Hybrid Score Version**: 1
> **Last updated**: 2026-03-18

---

## 1. Overview

This document describes the **product-facing scoring system** for Athlifyr.
It introduces two new score concepts:

| Concept           | Scope              | Purpose                                                          |
| ----------------- | ------------------ | ---------------------------------------------------------------- |
| **Workout Score** | Single workout log | Quantify the value of one training session                       |
| **Hybrid Score**  | User profile       | Aggregate athletic profile across strength, endurance and engine |

These scores are **separate** from the existing internal scoring system
(`qualityScore`, `predictionWeight`) which remains in use for prediction
features (e1RM, half-marathon prediction, PR detection).

### Why 0-1000?

The score scale is **0-1000** (not 0-100) for greater granularity:

- Fine-grained progression tracking (a +5 improvement is visible)
- Better differentiation for rankings and leaderboards
- Future challenge/achievement thresholds can use meaningful bands
- Avoids the "everything looks like a school grade" problem

---

## 2. Score Layers — What Changed and What Stayed

### Existing internal scores (unchanged)

| Field              | Model                                          | Purpose                                  |
| ------------------ | ---------------------------------------------- | ---------------------------------------- |
| `qualityScore`     | `UserPerformanceEntry`                         | Plausibility indicator (0-1)             |
| `predictionWeight` | `UserPerformanceEntry`                         | Recency × quality × outlier weight (0-1) |
| `effortScore`      | `Exercise`                                     | Difficulty/intensity rating (1-10)       |
| `isPR`             | `WorkoutExerciseResult` / `WorkoutExerciseSet` | Personal record flag                     |

These fields are **not reused** as public-facing product scores.
They continue to power:

- e1RM prediction (`predictE1rm`)
- Half-marathon prediction (`predictHalfMarathon`)
- Quality gating for predictions
- PR detection logic

### New product-facing scores

| Concept                     | Output Range                | Stored In                      |
| --------------------------- | --------------------------- | ------------------------------ |
| **Workout Score**           | 0 – 1000                    | `WorkoutScore` model           |
| **Workout Score Breakdown** | Per-pillar 0-1000 + bonuses | `WorkoutScore` model fields    |
| **Hybrid Score**            | 0 – 1000                    | `UserHybridScore` model        |
| **Hybrid Score Breakdown**  | Per-pillar 0-1000           | `UserHybridScore` model fields |

---

## 3. Workout Score

### 3.1 What it means

A Workout Score represents the overall performance value of a single
logged workout session. It is:

- **User-facing** – shown in workout history, detail, and posts
- **Deterministic** – same inputs always produce the same output
- **Explainable** – a breakdown shows where points come from
- **Versioned** – `scoreVersion` field allows recalculation when the formula improves

### 3.2 Pillars

The score is composed of three pillars plus two bonuses:

| Pillar        | Weight    | Source                                                     |
| ------------- | --------- | ---------------------------------------------------------- |
| **Strength**  | 35%       | Normalised e1RM from exercises with weight data            |
| **Endurance** | 35%       | Normalised pace or cal/min from exercises with cardio data |
| **Engine**    | 30%       | Normalised work-units from conditioning blocks             |
| Volume Bonus  | +0-50 pts | Total volume load (reps × weight), ~5% of max              |
| PR Bonus      | +0-30 pts | 15 pts per PR, capped at 30, ~3% of max                    |

**Total Score** = `(Strength × 0.35) + (Endurance × 0.35) + (Engine × 0.30) + volumeBonus + prBonus`, capped at 1000.

### 3.3 Pillar determination — metric-driven, not category-driven

Pillar contribution is determined by **exercise metrics**, not by
exercise category. This avoids rigid assumptions about categories like
CROSSFIT, BODYWEIGHT or OTHER:

| Exercise has…             | Contributes to | Regardless of block type |
| ------------------------- | -------------- | ------------------------ |
| Weight data (`hasWeight`) | **Strength**   | ✅                       |
| Distance / calories data  | **Endurance**  | ✅                       |
| Reps in an engine block   | **Engine**     | Engine blocks only       |

Block type serves as a **hint**:

- `WARMUP`, `REST`, `COOLDOWN`, `SKILL` → not scored
- `STRENGTH` → scored, but exercises contribute to their natural pillar
- `AMRAP`, `EMOM`, `FOR_TIME`, `TABATA`, `CHIPPER` → engine blocks

This means a weighted exercise in an AMRAP block contributes to **both**
strength (via e1RM) and engine (via work-units).

### 3.4 Normalization

All raw values are normalised to 0-1000 using a **diminishing-returns
exponential curve**:

```
score = 1000 × (1 − e^(−k × x))
```

where `k` is calibrated so that the reference value maps to score ≈ 700.

| Metric              | Reference value (≈ 700 score) | Note                                     |
| ------------------- | ----------------------------- | ---------------------------------------- |
| Strength (e1RM)     | 100 kg                        | Global default; per-exercise overridable |
| Endurance (pace)    | 300 s/km (5:00/km)            |                                          |
| Engine (work-units) | 150                           | = Σ(reps × effortMultiplier × density)   |
| Volume load         | 5 000 kg                      |                                          |
| Endurance (cal/min) | 10 cal/min                    |                                          |

`normalizeStrength` accepts an optional `ref` parameter so that
per-exercise or per-exercise-family references can be used in future.

### 3.5 Effort multiplier — light modifier

Each exercise has an `effortScore` (1-10). This is converted to a
**light** multiplier (0.8 – 1.2) that tilts how much the exercise
contributes without being a primary scoring driver:

- effort 1 → 0.8 (80% of raw contribution)
- effort 5 → 1.0 (neutral)
- effort 10 → 1.2 (120% of raw contribution)

### 3.6 Engine — work-units with density

Engine scoring uses **work-units** instead of raw reps:

```
block_work_units = min(Σ(min(reps, 500) × effortMultiplier) × densityFactor, 300)
total_work_units = Σ block_work_units across engine blocks
```

- **Per-exercise rep cap** (500): prevents a single exercise from dominating
- **Density factor**: if the block has a `completedTime` or `timeCap` **≥ 2 minutes**,
  work-units are scaled by `(refMinutes / actualMinutes)`, capped at 2.0.
  Blocks shorter than 2 minutes do not receive a density bonus to avoid
  over-rewarding very short efforts (e.g. 10 burpees in 30 seconds).
- **Per-block cap** (300 work-units): prevents a single large conditioning block
  from dominating the engine pillar. Rewards variety across multiple blocks.

### 3.7 Anti-outlier protections

| Protection                      | Value   | Purpose                              |
| ------------------------------- | ------- | ------------------------------------ |
| e1RM cap (`MAX_E1RM_KG_CAP`)    | 500 kg  | Protects against data-entry errors   |
| Per-exercise engine rep cap     | 500     | Prevents single exercise domination  |
| Density factor cap              | 2.0     | Prevents fast-time explosion         |
| Density minimum duration        | 120 sec | Prevents over-rewarding short blocks |
| Per-block engine work-units cap | 300     | Prevents single block domination     |
| Diminishing returns curve       | —       | Naturally caps extreme raw values    |

### 3.8 Highlights

The score result includes an array of human-readable highlights:

- "High strength contribution" (strength ≥ 700)
- "Strong endurance performance" (endurance ≥ 700)
- "Great engine output" (engine ≥ 700)
- "PR bonus applied (+N)"
- "High volume session" (volume bonus ≥ 25)
- "No scored exercises recorded" (total = 0)

---

## 4. Hybrid Score

### 4.1 What it means

The Hybrid Score is a user-level aggregation that represents overall
athletic capability. It is updated periodically from recent workout
scores and performance entries.

### 4.2 Pillars

| Pillar        | Weight | Data Source                                          |
| ------------- | ------ | ---------------------------------------------------- |
| **Strength**  | 1/3    | e1RM from `UserPerformanceEntry` (type=STRENGTH)     |
| **Endurance** | 1/3    | Pace from `UserPerformanceEntry` (type=RUN or TRAIL) |
| **Engine**    | 1/3    | Engine breakdown from `WorkoutScore`                 |

All pillar weights are equal by default. This can be tuned later.

### 4.3 History window

Only data from the last **90 days** is considered.

### 4.4 Recency weighting

Within the window, a **30-day half-life** exponential decay is applied:

```
weight = e^(−daysAgo × ln2 / 30)
```

This means:

- Today's entry: weight ≈ 1.0
- 30 days ago: weight ≈ 0.5
- 60 days ago: weight ≈ 0.25

### 4.5 Missing data handling

If a user has no data for a pillar, that pillar scores 0.
The total still works — it just reflects the available data.

Example: a user with many strength logs but no running data will have
strength > 0, endurance = 0, engine = maybe, and a lower total.

### 4.6 Confidence

| Level  | Condition                 |
| ------ | ------------------------- |
| LOW    | < 5 data points in window |
| MEDIUM | 5-14 data points          |
| HIGH   | ≥ 15 data points          |

### 4.7 Future extensibility

The architecture supports adding more pillars later (e.g. mobility,
consistency, recovery) without changing the core structure. Each pillar
is independently calculated and weighted.

---

## 5. Score Versioning

Workout Score and Hybrid Score have **independent** version numbers:

| Score         | Version constant        | Current |
| ------------- | ----------------------- | ------- |
| Workout Score | `WORKOUT_SCORE_VERSION` | 1       |
| Hybrid Score  | `HYBRID_SCORE_VERSION`  | 1       |

When either formula changes:

1. Bump the corresponding version constant in `lib/scoring/constants.ts`
2. The new version is stored with newly calculated scores
3. Existing scores retain their old version
4. A migration script can optionally recalculate old scores

Posts use **score snapshots** that are frozen at creation time, so they
are not affected by formula changes.

---

## 6. Data Model

### 6.1 WorkoutScore (new model)

Stores the computed score for each workout log.

| Field            | Type            | Description                   |
| ---------------- | --------------- | ----------------------------- |
| `id`             | String (cuid)   | Primary key                   |
| `workoutLogId`   | String (unique) | FK to `WorkoutLog`            |
| `userId`         | String          | FK to `User`                  |
| `totalScore`     | Int             | 0-1000                        |
| `strengthScore`  | Int             | 0-1000                        |
| `enduranceScore` | Int             | 0-1000                        |
| `engineScore`    | Int             | 0-1000                        |
| `volumeBonus`    | Int             | 0-50                          |
| `prBonus`        | Int             | 0-30                          |
| `scoreVersion`   | Int             | Algorithm version             |
| `highlights`     | String[]        | Human-readable explanations   |
| `calculatedAt`   | DateTime        | When the score was calculated |

### 6.2 UserHybridScore (new model)

Stores the latest hybrid score for a user.

| Field            | Type            | Description            |
| ---------------- | --------------- | ---------------------- |
| `id`             | String (cuid)   | Primary key            |
| `userId`         | String (unique) | FK to `User`           |
| `totalScore`     | Int             | 0-1000                 |
| `strengthScore`  | Int             | 0-1000                 |
| `enduranceScore` | Int             | 0-1000                 |
| `engineScore`    | Int             | 0-1000                 |
| `confidence`     | String          | LOW / MEDIUM / HIGH    |
| `scoreVersion`   | Int             | Algorithm version      |
| `calculatedAt`   | DateTime        | When last recalculated |

### 6.3 Post extensions

Three new fields on the `Post` model:

| Field            | Type    | Description                              |
| ---------------- | ------- | ---------------------------------------- |
| `workoutLogId`   | String? | Link to the workout log                  |
| `scoreSnapshot`  | Int?    | Frozen total score at post-creation time |
| `scoreBreakdown` | Json?   | Frozen breakdown (JSONB)                 |

Score snapshots ensure posts remain visually consistent even if the
scoring algorithm changes in a future version.

---

## 7. What Is Reused from Existing Code

### Reused as-is

| Item                            | Location                     | Usage                                                           |
| ------------------------------- | ---------------------------- | --------------------------------------------------------------- |
| `calculateE1rm` (Epley formula) | `lib/performance/scoring.ts` | Re-implemented in `lib/scoring/normalizers.ts` for independence |
| `isPR` detection                | Workout log creation         | Used to count PRs for PR bonus                                  |
| Exercise measurement flags      | `Exercise` model             | `hasReps`, `hasWeight`, `hasDistance`, etc.                     |
| `WorkoutBlockType` enum         | Prisma schema                | Maps blocks to scoring contexts (engine vs non-engine)          |
| Unit conversion utilities       | `types/workout.ts`           | `convertWeight`, `convertDistance`                              |

### Reused as light modifier

| Item          | Change                                                     |
| ------------- | ---------------------------------------------------------- |
| `effortScore` | Used as a 0.8-1.2 multiplier, not a primary scoring driver |

### Reused with small changes

| Item                        | Change                              |
| --------------------------- | ----------------------------------- |
| `UserPerformanceEntry` data | Read by Hybrid Score (not modified) |
| `WorkoutLog` model          | Added `score` relation              |

### NOT reused as public score

| Item               | Reason                                                  |
| ------------------ | ------------------------------------------------------- |
| `qualityScore`     | Internal plausibility metric, not meaningful to users   |
| `predictionWeight` | Internal prediction confidence, not meaningful to users |

### NOT used for pillar determination

| Item               | Reason                                                                        |
| ------------------ | ----------------------------------------------------------------------------- |
| `ExerciseCategory` | Too rigid — CROSSFIT, BODYWEIGHT, OTHER cannot always be mapped to one pillar |

---

## 8. Code Organisation

```
lib/scoring/
├── index.ts          # Barrel export
├── types.ts          # Type definitions
├── constants.ts      # Tunable constants, version numbers, anti-outlier caps
├── normalizers.ts    # Pure normalisation functions
├── workout-score.ts  # Workout Score calculator
└── hybrid-score.ts   # Hybrid Score calculator
```

All score logic lives in `lib/scoring/` and has **no database
dependencies**. Data must be mapped to the input types before calling
the calculators. This keeps the scoring layer:

- Testable in isolation
- Reusable across web and mobile
- Free from Prisma coupling

---

## 9. API Surface (Planned)

These APIs are **designed** but not yet implemented. They describe the
intended contract for frontend consumption.

### Workout detail

```
GET /api/workouts/logs/:id/score
→ WorkoutScoreResult
```

### Workout history (score in list)

```
GET /api/workouts/logs?includeScore=true
→ WorkoutLog[] with optional score field
```

### User hybrid score

```
GET /api/profile/hybrid-score
→ HybridScoreResult
```

### Post creation with score snapshot

```
POST /api/posts
{
  postType: "WOD",
  workoutId: "...",
  workoutLogId: "...",
  content: "...",
  imageUrl: "...",
  scoreSnapshot: 780,
  scoreBreakdown: { strength: 820, endurance: 600, engine: 850, volumeBonus: 30, prBonus: 15 }
}
```

---

## 10. Known Tradeoffs and Future Work

### Phase 1 (this implementation)

- ✅ Score architecture and type system
- ✅ 0-1000 scale for granularity
- ✅ Metric-driven pillar determination (no category rigidity)
- ✅ Light effort multiplier (0.8-1.2)
- ✅ Engine work-units with density and per-exercise caps
- ✅ Anti-outlier protections (e1RM cap, rep cap, density cap, minimum duration, per-block cap)
- ✅ Per-exercise overridable strength reference
- ✅ Separate version constants for workout and hybrid scores
- ✅ Normalization with reference-based curves
- ✅ Workout Score calculation (pure functions)
- ✅ Hybrid Score calculation (pure functions)
- ✅ Prisma models for persistence
- ✅ Post model extended for score snapshots
- ✅ Per-block engine cap (MAX_ENGINE_WORK_UNITS_PER_BLOCK = 300)
- ✅ Minimum duration guard for density (ENGINE_MIN_DENSITY_DURATION_SEC = 120)
- ✅ Realistic workout validation tests (mediocre/solid/elite bonus proportions)
- ✅ 98 unit tests
- ✅ Design documentation

### Phase 2 (future)

- API route implementation
- Score computation on workout log save
- Hybrid Score recalculation (cron or on-demand)
- Per-exercise or per-exercise-family strength references
- Frontend score display components
- Feed integration with score cards
- Score label / badge system

### Phase 3 (future)

- Refine normalization curves with real data
- Add more pillars (consistency, mobility)
- Rankings / leaderboards
- Challenge system
- Per-sport scoring variants
- Gender/age-adjusted normalization

### Known limitations

- Strength reference is a global default (100 kg); per-exercise refs are supported in the API but need reference tables
- Endurance normalization is run-centric (pace + cal/min); future versions should add rowing, ski erg, bike-specific normalizers
- Imperial unit conversion should happen before calling the calculators (the API layer is responsible)
- Engine density uses reference time of 15 minutes; may need sport-specific tuning

---

## 11. Backward Compatibility

The new scoring system is **additive only**. No existing fields or
features are modified:

- ✅ Performance entry creation unchanged
- ✅ e1RM prediction unchanged
- ✅ Half-marathon prediction unchanged
- ✅ PR detection unchanged
- ✅ Summary charts unchanged
- ✅ Workout log flow unchanged
- ✅ All 52 existing scoring tests pass
