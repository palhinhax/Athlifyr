# Workout Score & Hybrid Score — Technical Design v2

> **Status**: Foundation implemented (Phase 1)
> **Score Version**: 1
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

| Concept                     | Output Range               | Stored In                      |
| --------------------------- | -------------------------- | ------------------------------ |
| **Workout Score**           | 0 – 100                    | `WorkoutScore` model           |
| **Workout Score Breakdown** | Per-pillar 0-100 + bonuses | `WorkoutScore` model fields    |
| **Hybrid Score**            | 0 – 100                    | `UserHybridScore` model        |
| **Hybrid Score Breakdown**  | Per-pillar 0-100           | `UserHybridScore` model fields |

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

| Pillar        | Weight    | Source                                                  |
| ------------- | --------- | ------------------------------------------------------- |
| **Strength**  | 35%       | Normalised e1RM from strength exercises                 |
| **Endurance** | 35%       | Normalised pace or cal/min from cardio exercises        |
| **Engine**    | 30%       | Normalised total weighted-reps from conditioning blocks |
| Volume Bonus  | +0-20 pts | Total volume load (reps × weight)                       |
| PR Bonus      | +0-10 pts | 5 pts per PR, capped at 10                              |

**Total Score** = `(Strength × 0.35) + (Endurance × 0.35) + (Engine × 0.30) + volumeBonus + prBonus`, capped at 100.

### 3.3 Block-type to pillar mapping

| Block Type                                       | Primary Pillar |
| ------------------------------------------------ | -------------- |
| `STRENGTH`                                       | strength       |
| `AMRAP`, `EMOM`, `FOR_TIME`, `TABATA`, `CHIPPER` | engine         |
| `WARMUP`, `COOLDOWN`, `REST`, `SKILL`            | not scored     |

Within engine blocks, exercises also contribute to strength or endurance
if they have weight/distance metrics.

### 3.4 Normalization

All raw values are normalised to 0-100 using a **diminishing-returns
exponential curve**:

```
score = 100 × (1 − e^(−k × x))
```

where `k` is calibrated so that the reference value maps to score ≈ 70.

| Metric                 | Reference value (≈ 70 score) |
| ---------------------- | ---------------------------- |
| Strength (e1RM)        | 100 kg                       |
| Endurance (pace)       | 300 s/km (5:00/km)           |
| Engine (weighted reps) | 100                          |
| Volume load            | 5 000 kg                     |
| Endurance (cal/min)    | 10 cal/min                   |

This approach:

- Rewards improvement at all levels
- Prevents extreme values from dominating
- Is maintainable via a constants file (`lib/scoring/constants.ts`)

### 3.5 Effort multiplier

Each exercise has an `effortScore` (1-10). This is converted to a
multiplier (0.2 – 2.0) that scales how much the exercise contributes to
its pillar. Higher-effort exercises (e.g. heavy deadlifts) earn more
credit than low-effort ones (e.g. bicep curls).

### 3.6 Highlights

The score result includes an array of human-readable highlights:

- "High strength contribution" (strength ≥ 70)
- "Strong endurance performance" (endurance ≥ 70)
- "Great engine output" (engine ≥ 70)
- "PR bonus applied (+N)"
- "High volume session" (volume bonus ≥ 10)
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

## 5. Data Model

### 5.1 WorkoutScore (new model)

Stores the computed score for each workout log.

| Field            | Type            | Description                   |
| ---------------- | --------------- | ----------------------------- |
| `id`             | String (cuid)   | Primary key                   |
| `workoutLogId`   | String (unique) | FK to `WorkoutLog`            |
| `userId`         | String          | FK to `User`                  |
| `totalScore`     | Int             | 0-100                         |
| `strengthScore`  | Int             | 0-100                         |
| `enduranceScore` | Int             | 0-100                         |
| `engineScore`    | Int             | 0-100                         |
| `volumeBonus`    | Int             | 0-20                          |
| `prBonus`        | Int             | 0-10                          |
| `scoreVersion`   | Int             | Algorithm version             |
| `highlights`     | String[]        | Human-readable explanations   |
| `calculatedAt`   | DateTime        | When the score was calculated |

Relationship: `WorkoutLog` 1:1 `WorkoutScore`.

### 5.2 UserHybridScore (new model)

Stores the latest hybrid score for a user.

| Field            | Type            | Description            |
| ---------------- | --------------- | ---------------------- |
| `id`             | String (cuid)   | Primary key            |
| `userId`         | String (unique) | FK to `User`           |
| `totalScore`     | Int             | 0-100                  |
| `strengthScore`  | Int             | 0-100                  |
| `enduranceScore` | Int             | 0-100                  |
| `engineScore`    | Int             | 0-100                  |
| `confidence`     | String          | LOW / MEDIUM / HIGH    |
| `scoreVersion`   | Int             | Algorithm version      |
| `calculatedAt`   | DateTime        | When last recalculated |

Relationship: `User` 1:1 `UserHybridScore`.

### 5.3 Post extensions

Three new fields on the `Post` model:

| Field            | Type    | Description                              |
| ---------------- | ------- | ---------------------------------------- |
| `workoutLogId`   | String? | Link to the workout log                  |
| `scoreSnapshot`  | Int?    | Frozen total score at post-creation time |
| `scoreBreakdown` | Json?   | Frozen breakdown (JSONB)                 |

Score snapshots ensure posts remain visually consistent even if the
scoring algorithm changes in a future version.

---

## 6. What Is Reused from Existing Code

### Reused as-is

| Item                            | Location                     | Usage                                                           |
| ------------------------------- | ---------------------------- | --------------------------------------------------------------- |
| `calculateE1rm` (Epley formula) | `lib/performance/scoring.ts` | Re-implemented in `lib/scoring/normalizers.ts` for independence |
| `isPR` detection                | Workout log creation         | Used to count PRs for PR bonus                                  |
| Exercise measurement flags      | `Exercise` model             | `hasReps`, `hasWeight`, `hasDistance`, etc.                     |
| `effortScore` per exercise      | `Exercise` model             | Powers the effort multiplier                                    |
| `ExerciseCategory` enum         | Prisma schema                | Maps exercises to strength/endurance                            |
| `WorkoutBlockType` enum         | Prisma schema                | Maps blocks to scoring pillars                                  |
| Unit conversion utilities       | `types/workout.ts`           | `convertWeight`, `convertDistance`                              |

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

---

## 7. Code Organisation

```
lib/scoring/
├── index.ts          # Barrel export
├── types.ts          # Type definitions
├── constants.ts      # Tunable constants and reference values
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

## 8. API Surface (Planned)

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
  scoreSnapshot: 78,
  scoreBreakdown: { strength: 80, endurance: 60, engine: 85, volumeBonus: 12, prBonus: 5 }
}
```

---

## 9. Score Versioning Strategy

Every score output includes a `version` field (currently `1`).

When the formula changes:

1. Bump `SCORE_VERSION` in `lib/scoring/types.ts`
2. The new version is stored with newly calculated scores
3. Existing scores retain their old version
4. A migration script can optionally recalculate old scores

Posts use **score snapshots** that are frozen at creation time, so they
are not affected by formula changes.

---

## 10. Known Tradeoffs and Future Work

### Phase 1 (this implementation)

- ✅ Score architecture and type system
- ✅ Normalization with reference-based curves
- ✅ Workout Score calculation (pure functions)
- ✅ Hybrid Score calculation (pure functions)
- ✅ Prisma models for persistence
- ✅ Post model extended for score snapshots
- ✅ 84 unit tests
- ✅ Design documentation

### Phase 2 (future)

- API route implementation
- Score computation on workout log save
- Hybrid Score recalculation (cron or on-demand)
- Frontend score display components
- Feed integration with score cards
- Score label / badge system

### Phase 3 (future)

- Refine normalization curves with real data
- Add more pillars (consistency, mobility)
- Rankings / leaderboards
- Challenge system
- Per-sport scoring variants

### Known limitations

- Reference values are sensible defaults but not data-driven yet
- Engine pillar uses weighted reps; future versions may use work capacity models
- Normalization curves are the same for all users; future versions may support gender/age adjustments
- Imperial unit conversion should happen before calling the calculators (the API layer is responsible)

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
