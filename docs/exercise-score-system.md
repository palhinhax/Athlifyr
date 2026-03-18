# Exercise Score System — Technical Documentation

> **Purpose**: Document the current exercise score implementation in Athlifyr before any refactor or improvements are made.
>
> **Last updated**: March 2026
>
> **Status**: As-is documentation — no business logic was changed.

---

## Table of Contents

1. [Overview](#1-overview)
2. [Data Model](#2-data-model)
3. [Score Calculation Logic](#3-score-calculation-logic)
4. [Supported Metric Types](#4-supported-metric-types)
5. [Exercise Configuration](#5-exercise-configuration)
6. [Current Flow](#6-current-flow)
7. [Existing API Usage](#7-existing-api-usage)
8. [Current Limitations / Issues](#8-current-limitations--issues)
9. [Real Examples](#9-real-examples)
10. [Source References](#10-source-references)
11. [Bonus: Score Flow Diagram](#11-bonus-score-flow-diagram)
12. [Bonus: Metric → Formula → Example Table](#12-bonus-metric--formula--example-table)
13. [Bonus: Improvement Opportunities](#13-bonus-improvement-opportunities)

---

## 1. Overview

### Purpose of the Score System

Athlifyr has **two distinct scoring concepts** that are often conflated:

| Concept | Field | Stored In | Purpose |
|---------|-------|-----------|---------|
| **Effort Score** | `effortScore` | `Exercise` model | A static 1–10 rating of how physically demanding an exercise is. Used for training load estimation. |
| **Performance Scores** | `qualityScore` + `predictionWeight` | `UserPerformanceEntry` model | Dynamic per-entry scores indicating data plausibility and relevance for predictions. |

**Effort Score** is a property of the exercise definition itself (e.g., Back Squat = 8.0, Air Squat = 3.0). It is seeded once and does not change per user or per entry.

**Performance Scores** are computed every time a user logs a performance entry (run, strength, HYROX). They drive two key features:

- **Half-marathon prediction** — uses weighted running entries to predict 21.1 km time via the Riegel formula.
- **e1RM prediction** — uses weighted strength entries to estimate the user's current estimated 1-rep max for each exercise via the Epley formula.

### What Scores Are Used For Today

- **qualityScore** (0–1): Indicates how plausible/trustworthy the data is. Impossible paces or suspicious weights receive a low quality score.
- **predictionWeight** (0–1): Indicates how much influence a given entry should have in future predictions. Combines quality, recency (exponential decay), and outlier detection.
- **effortScore** (1–10): Currently stored per exercise but **not used in any runtime calculation** — only documented in `docs/EFFORT_SCORE_GUIDE.md` for future training load features.
- **e1RM**: Calculated inline using the Epley formula (`weight × (1 + reps / 30)`) for display. Not persisted as a field.
- **isPR** (boolean): Computed at workout log submission time by comparing the current e1RM against historical best for the same exercise.

### Score Scope

| Level | Score Type | Exists? |
|-------|-----------|---------|
| Per exercise definition | `effortScore` | ✅ |
| Per performance entry | `qualityScore`, `predictionWeight` | ✅ |
| Per workout result | `isPR` flag | ✅ |
| Per workout (aggregate) | Training load | ❌ (documented formula, not implemented) |

---

## 2. Data Model

### 2.1 Exercise

**Model**: `Exercise` — `prisma/schema.prisma`

| Field | Type | Required | Default | Purpose | Example |
|-------|------|----------|---------|---------|---------|
| `id` | `String` (cuid) | ✅ | auto | Primary key | `"clx1abc..."` |
| `name` | `String` | ✅ | — | English exercise name | `"Back Squat"` |
| `aliases` | `String[]` | ✅ | `[]` | Alternative English names | `["BS", "High Bar Squat"]` |
| `category` | `ExerciseCategory` | ✅ | `OTHER` | Classification | `"GYM"` |
| `effortScore` | `Float` | ✅ | `5.0` | Static effort rating 1–10 | `8.0` |
| `isGlobal` | `Boolean` | ✅ | `false` | Available to all users | `true` |
| `createdById` | `String?` | ❌ | `null` | User who created it | `null` (global) |
| `hasReps` | `Boolean` | ✅ | `true` | Supports repetitions | `true` |
| `hasWeight` | `Boolean` | ✅ | `false` | Supports weight tracking | `true` |
| `hasDistance` | `Boolean` | ✅ | `false` | Supports distance tracking | `false` |
| `hasTime` | `Boolean` | ✅ | `false` | Supports time tracking | `false` |
| `hasCalories` | `Boolean` | ✅ | `false` | Supports calorie tracking | `false` |
| `hasHeight` | `Boolean` | ✅ | `false` | Supports height tracking | `false` |

**Relations**: `entries` → `UserPerformanceEntry[]`, `translations` → `ExerciseTranslation[]`, `workoutBlockExercises`, `workoutExerciseResults`

### 2.2 ExerciseTranslation

**Model**: `ExerciseTranslation` — `prisma/schema.prisma`

| Field | Type | Required | Purpose |
|-------|------|----------|---------|
| `id` | `String` (cuid) | ✅ | Primary key |
| `exerciseId` | `String` | ✅ | FK → Exercise |
| `language` | `String` | ✅ | Language code (`pt`, `en`, `es`, `fr`, `de`, `it`) |
| `name` | `String` | ✅ | Translated name |
| `aliases` | `String[]` | ✅ | Translated aliases |
| `description` | `String?` | ❌ | Optional description |

**Unique constraint**: `[exerciseId, language]`

### 2.3 UserPerformanceEntry

**Model**: `UserPerformanceEntry` — `prisma/schema.prisma`

This is the **central scoring entity**. Each row represents one user performance data point with its computed scores.

| Field | Type | Required | Default | Purpose | Used By |
|-------|------|----------|---------|---------|---------|
| `id` | `String` (cuid) | ✅ | auto | Primary key | — |
| `userId` | `String` | ✅ | — | FK → User | All entries |
| `type` | `PerformanceEntryType` | ✅ | — | Entry type | All entries |
| `performedAt` | `DateTime` | ✅ | `now()` | When it was performed | All entries |
| `distanceKm` | `Float?` | ❌ | — | Distance in km | RUN, TRAIL |
| `timeSeconds` | `Int?` | ❌ | — | Duration in seconds | RUN, TRAIL, HYROX |
| `elevationGainM` | `Int?` | ❌ | — | Elevation gain in meters | RUN, TRAIL |
| `exerciseId` | `String?` | ❌ | — | FK → Exercise | STRENGTH |
| `weightKg` | `Float?` | ❌ | — | Weight in kg | STRENGTH |
| `reps` | `Int?` | ❌ | — | Repetition count | STRENGTH |
| `hyroxCategory` | `HyroxCategory?` | ❌ | — | HYROX category | HYROX |
| `eventName` | `String?` | ❌ | — | Event name | HYROX |
| `location` | `String?` | ❌ | — | Event location | HYROX |
| `resultId` | `String?` (unique) | ❌ | — | FK → Result (event link) | RUN, TRAIL |
| `workoutExerciseResultId` | `String?` | ❌ | — | FK → WorkoutExerciseResult | STRENGTH |
| `workoutExerciseSetId` | `String?` (unique) | ❌ | — | FK → WorkoutExerciseSet | STRENGTH |
| `runActivityId` | `String?` (unique) | ❌ | — | FK → RunActivity (GPS) | RUN |
| **`qualityScore`** | **`Float`** | **✅** | **`0.5`** | **Data plausibility (0–1)** | **All entries** |
| **`predictionWeight`** | **`Float`** | **✅** | **`0.5`** | **Prediction influence (0–1)** | **All entries** |

### 2.4 WorkoutExerciseResult

**Model**: `WorkoutExerciseResult` — `prisma/schema.prisma`

Stores the actual results of an exercise within a workout log.

| Field | Type | Required | Purpose |
|-------|------|----------|---------|
| `id` | `String` (cuid) | ✅ | Primary key |
| `blockResultId` | `String` | ✅ | FK → WorkoutBlockResult |
| `blockExerciseId` | `String` | ✅ | FK → WorkoutBlockExercise |
| `exerciseId` | `String` | ✅ | FK → Exercise (denormalized) |
| `actualReps` | `Int?` | ❌ | Actual reps performed |
| `actualWeight` | `Float?` | ❌ | Actual weight used |
| `actualWeightUnit` | `WeightUnit?` | ❌ | KG or LB |
| `actualDistance` | `Float?` | ❌ | Actual distance |
| `actualDistanceUnit` | `DistanceUnit?` | ❌ | M, KM, MI, FT |
| `actualTime` | `Int?` | ❌ | Actual time in seconds |
| `actualCalories` | `Int?` | ❌ | Actual calories |
| **`isPR`** | **`Boolean`** | **✅** | **`false`** — set to `true` by PR detection |
| `notes` | `String?` | ❌ | Optional notes |

### 2.5 WorkoutExerciseSet

**Model**: `WorkoutExerciseSet` — `prisma/schema.prisma`

Individual sets within a strength exercise result.

| Field | Type | Required | Purpose |
|-------|------|----------|---------|
| `id` | `String` (cuid) | ✅ | Primary key |
| `exerciseResultId` | `String` | ✅ | FK → WorkoutExerciseResult |
| `setNumber` | `Int` | ✅ | Set number (1, 2, 3...) |
| `reps` | `Int` | ✅ | Reps in this set |
| `weight` | `Float` | ✅ | Weight used |
| `weightUnit` | `WeightUnit` | ✅ | KG or LB |
| **`isPR`** | **`Boolean`** | **✅** | **`false`** — set to `true` by PR detection |
| `notes` | `String?` | ❌ | Optional notes |

### 2.6 Relevant Enums

```prisma
enum PerformanceEntryType {
  RUN
  TRAIL
  STRENGTH
  HYROX
}

enum ExerciseCategory {
  CROSSFIT
  GYM
  WEIGHTLIFTING
  BODYWEIGHT
  CARDIO
  OTHER
}

enum WeightUnit {
  KG
  LB
}

enum DistanceUnit {
  M
  KM
  MI
  FT
}
```

### 2.7 Relationship Diagram

```
Exercise ──1:N──▶ UserPerformanceEntry ◀──N:1── User
                         │
              ┌──────────┼──────────┐
              ▼          ▼          ▼
           Result   WorkoutExercise WorkoutExercise
           (Event)     Result          Set
                         │
                    1:N──▶ WorkoutExerciseSet
```

---

## 3. Score Calculation Logic

All scoring logic lives in **`lib/performance/scoring.ts`**.

### 3.1 Quality Score

Quality score measures **data plausibility** on a 0–1 scale.

#### Running Quality (`computeRunQualityScore`)

Evaluates pace (sec/km) against known physiological limits:

| Condition | Quality Score | Reason |
|-----------|:------------:|--------|
| Pace < 2:00/km | 0.2 | Impossibly fast |
| Pace > 15:00/km | 0.3 | Impossibly slow |
| 30km+ at < 3:00/km | 0.2 | Ultra-fast for long distance |
| 20km+ at < 3:20/km without elevation | 0.4 | Very fast for long distance |
| 3:00–8:00/km | **1.0** | Normal trained runner range |
| 8:00–10:00/km | 0.9 | Slightly slow but valid |
| 10:00–12:00/km | 0.7 | Slow but valid |
| > 12:00/km | 0.5 | Hiking pace |

**Parameters**: `distanceKm`, `timeSeconds`, `elevationGainM` (optional)

#### Strength Quality (`computeStrengthQualityScore`)

Evaluates based on weight and rep count:

| Condition | Quality Score | Reason |
|-----------|:------------:|--------|
| Weight = 0 kg | 0.5 | Suspicious unless bodyweight |
| Reps < 1 | 0 | Invalid data |
| Reps > 20 | 0.6 | Less useful for strength prediction |
| Reps 16–20 | 0.7 | Endurance range |
| Reps 13–15 | 0.8 | Moderate rep range |
| Reps 1–12 | **1.0** | Ideal range for e1RM calculation |

**Parameters**: `weightKg`, `reps`

#### HYROX Quality

HYROX entries are assigned **hardcoded default scores** — no algorithmic calculation:
- `qualityScore: 0.8`
- `predictionWeight: 1.0`

#### Event Result Quality

Official event results are assigned higher default scores:
- `qualityScore: 0.8`
- `predictionWeight: 0.9`

### 3.2 Prediction Weight

`computePredictionWeight` determines how much influence an entry should have in prediction algorithms. It combines three factors:

#### Factor 1: Quality Score (base)

The quality score itself is the starting weight.

#### Factor 2: Recency Decay

Uses exponential decay with a 45-day time constant:

```
recencyFactor = max(0.1, min(1.0, exp(-daysAgo / 45)))
```

| Days Ago | Factor | Meaning |
|----------|:------:|---------|
| 0 | 1.00 | Full weight |
| 14 | ~0.73 | Recent |
| 45 | ~0.37 | Moderate decay |
| 90 | ~0.13 | Significant decay |
| 365 | ~0.1 | Floor (minimum) |

#### Factor 3: Outlier Detection

Compares the current entry's metric value against the median of recent history:

| Deviation from Median | Multiplier |
|----------------------|:----------:|
| ≤ 30% | 1.0 (no penalty) |
| 30–50% | 0.6 |
| > 50% | 0.3 (severe down-weight) |

**Final formula**: `predictionWeight = max(0.01, min(1.0, qualityScore × recencyFactor × outlierMultiplier))`

### 3.3 Composite Score Functions

#### `computeRunScores(entry, history)`

1. Computes `qualityScore` via `computeRunQualityScore`
2. Calculates median pace from last 90 days of history (needs ≥ 3 entries)
3. Computes `predictionWeight` using current pace vs. median pace for outlier detection
4. Returns `{ qualityScore, predictionWeight }`

#### `computeStrengthScores(entry, history)`

1. Computes `qualityScore` via `computeStrengthQualityScore`
2. Calculates median e1RM from last 90 days of history (needs ≥ 3 entries, reps ≤ 12, weight > 0)
3. Computes `predictionWeight` using current e1RM vs. median e1RM for outlier detection
4. Returns `{ qualityScore, predictionWeight }`

### 3.4 Prediction Algorithms

#### e1RM Prediction (`predictE1rm`)

Uses the **Epley formula**: `e1RM = weight × (1 + reps / 30)`

**Prediction weighting** uses a more aggressive 14-day half-life (vs. 45-day for general scoring):

```
recencyFactor = max(0.05, exp(-daysAgo × ln(2) / 14))
```

**Rep accuracy multiplier** gives higher weight to lower-rep sets:

| Reps | Multiplier | Rationale |
|------|:----------:|-----------|
| 1 | 2.0 | Actual 1RM — gold standard |
| 2–3 | 1.5 | Very accurate estimate |
| 4–6 | 1.2 | Good estimate |
| 7–10 | 1.0 | Acceptable |
| 11–12 | 0.7 | Less reliable |

**Confidence levels**:

| Condition | Confidence |
|-----------|:----------:|
| Recent 1RM test (≤ 14 days) OR recent low-rep entry (≤ 21 days) + ≥ 3 recent entries | HIGH |
| Recent low-rep entry OR ≥ 2 entries in last 30 days | MEDIUM |
| Otherwise | LOW |

#### Half-Marathon Prediction (`predictHalfMarathon`)

Uses the **Riegel formula**: `T2 = T1 × (D2 / D1)^1.06`

- Target distance: 21.0975 km
- Minimum quality threshold: 0.5
- Computes weighted average of predictions from all valid entries
- Confidence determined by entry count: 1–2 = LOW, 3–5 = MEDIUM, 6+ = HIGH

### 3.5 PR Detection

**Location**: `app/api/workouts/logs/route.ts` → `processStrengthEntry`

PR (Personal Record) is detected when logging a workout by comparing e1RM:

```typescript
const currentE1rm = weightKg * (1 + reps / 30);
const bestHistoricalE1rm = history.reduce((best, h) => {
  const e1rm = h.weightKg * (1 + h.reps / 30);
  return Math.max(best, e1rm);
}, 0);
const isPR = history.length > 0 && currentE1rm > bestHistoricalE1rm;
```

If `isPR` is `true`, the `WorkoutExerciseSet.isPR` or `WorkoutExerciseResult.isPR` flag is set to `true`.

---

## 4. Supported Metric Types

### 4.1 Performance Entry Types

| Type | Metrics Stored | Score Computation | Direction |
|------|---------------|-------------------|-----------|
| **RUN** | `distanceKm`, `timeSeconds`, `elevationGainM` | `computeRunScores` — pace-based quality | Lower time = better |
| **TRAIL** | `distanceKm`, `timeSeconds`, `elevationGainM` | No dedicated scoring — uses same fields as RUN | Lower time = better |
| **STRENGTH** | `exerciseId`, `weightKg`, `reps` | `computeStrengthScores` — e1RM-based quality | Higher e1RM = better |
| **HYROX** | `hyroxCategory`, `timeSeconds`, `eventName`, `location` | Hardcoded defaults (`0.8 / 1.0`) | Lower time = better |

### 4.2 Exercise Measurement Flags

Each exercise has boolean flags indicating which metrics apply:

| Flag | Meaning | Example Exercises |
|------|---------|-------------------|
| `hasReps` | Supports repetitions | Back Squat, Push-up, Burpee |
| `hasWeight` | Supports weight tracking | Back Squat, Deadlift, Bench Press |
| `hasDistance` | Supports distance | Rowing, Running, Farmers Carry |
| `hasTime` | Supports time tracking | Plank, Running, Assault Bike |
| `hasCalories` | Supports calorie tracking | Rowing, Assault Bike, Ski Erg |
| `hasHeight` | Supports height tracking | Box Jump |

**Important**: These flags control UI display and workout logging behavior (e.g., `hasWeight` must be `true` for performance tracking to create strength entries). They do **not** directly affect score calculation.

### 4.3 Effort Score Scale

| Range | Description | Examples |
|-------|-------------|---------|
| 1–2 | Mobility, stretching, recovery | — |
| 3–4 | Light cardio, technique work | Air Squat (3.0), Push-up (3.5) |
| 5–6 | Moderate intensity, accessory lifts | Wall Ball (6.0), KB Swing (5.5) |
| 7–8 | Heavy compound lifts | Back Squat (8.0), Bench Press (7.5) |
| 9 | Olympic lifts, advanced gymnastics | Clean (9.5), Ring Muscle-up (9.5) |
| 10 | Maximum effort (rare) | Snatch (10.0), Clean & Jerk (10.0) |

---

## 5. Exercise Configuration

### How an Exercise is Configured for Scoring

An exercise contributes to performance scoring through its measurement flags:

1. **`hasWeight: true`** is the **gate** for strength performance tracking. When a workout is logged, `processExercisePerformance` checks `er.exercise.hasWeight` before creating `UserPerformanceEntry` records.
2. The `exerciseId` links the exercise to its strength history for e1RM calculation and PR detection.
3. The `effortScore` field is stored but **not currently used in any runtime calculation**.

### Can Exercises Have Multiple Metrics?

**Yes**. An exercise can have multiple `has*` flags set to `true` (e.g., Rowing has `hasDistance`, `hasTime`, `hasCalories` all true). However:

- Only the `hasWeight` + reps combination triggers **strength performance tracking**.
- Other metrics (time, distance, calories) are **recorded in workout results** but do **not generate separate performance entries**.

### Defaults and Fallbacks

- **Default `effortScore`**: `5.0` (middle of scale)
- **Default `hasReps`**: `true` (all exercises default to supporting reps)
- **Default for all other `has*` flags**: `false`
- **Default `qualityScore`**: `0.5`
- **Default `predictionWeight`**: `0.5`

### Hidden Assumptions

1. **Only strength (weight-based) exercises generate performance entries from workouts** — time-based, distance-based, and calorie-based exercises do not.
2. **Weight is always converted to kg** before scoring — the `convertToKg` function in the workout logs route handles `LB → KG` conversion: `weight / 2.20462`.
3. **e1RM is always computed inline** using the Epley formula — it is never stored as a persistent field.
4. **HYROX entries bypass algorithmic scoring** and receive hardcoded quality/weight values.
5. **TRAIL entries share the same data model as RUN entries** but there is no dedicated `computeTrailScores` function — trail entries use default scoring.

---

## 6. Current Flow

### 6.1 Manual Performance Entry

```
User opens Performance tab → Clicks "Add Entry"
    │
    ├─ RUN entry:
    │   → User inputs: distanceKm, timeSeconds, elevationGainM, performedAt
    │   → POST /api/profile/performance
    │   → Fetch 90-day run history
    │   → computeRunScores() → { qualityScore, predictionWeight }
    │   → prisma.userPerformanceEntry.create()
    │   → Return entry to frontend
    │
    ├─ STRENGTH entry:
    │   → User inputs: exerciseId, weightKg, reps, performedAt
    │   → POST /api/profile/performance
    │   → Verify exercise exists
    │   → Fetch 90-day strength history for same exercise
    │   → computeStrengthScores() → { qualityScore, predictionWeight }
    │   → prisma.userPerformanceEntry.create()
    │   → Return entry to frontend
    │
    └─ HYROX entry:
        → User inputs: hyroxCategory, timeSeconds, eventName, location
        → POST /api/profile/performance
        → No algorithmic scoring (hardcoded: 0.8 / 1.0)
        → prisma.userPerformanceEntry.create()
        → Return entry to frontend
```

### 6.2 Workout Log with PR Detection

```
User completes workout → Submits results
    │
    └─ POST /api/workouts/logs
        │
        ├─ Create WorkoutLog record
        ├─ For each block → create WorkoutBlockResult
        │   └─ For each exercise → create WorkoutExerciseResult
        │       └─ For each set → create WorkoutExerciseSet
        │
        └─ trackStrengthPerformance():
            └─ For each exercise with hasWeight = true:
                ├─ processExercisePerformance():
                │   ├─ If sets exist:
                │   │   └─ For each set:
                │   │       ├─ convertToKg(weight, unit)
                │   │       ├─ processStrengthEntry():
                │   │       │   ├─ Fetch 90-day strength history
                │   │       │   ├─ computeStrengthScores()
                │   │       │   ├─ Calculate current e1RM
                │   │       │   ├─ Compare against best historical e1RM
                │   │       │   ├─ Create UserPerformanceEntry
                │   │       │   └─ Return { entryId, isPR }
                │   │       └─ If isPR → update WorkoutExerciseSet.isPR = true
                │   │
                │   └─ Else if actualWeight + actualReps:
                │       ├─ convertToKg(weight, unit)
                │       ├─ processStrengthEntry() (same flow as above)
                │       └─ If isPR → update WorkoutExerciseResult.isPR = true
                │
                └─ Return list of entries and PRs
```

### 6.3 Event Result Submission

```
User submits event result → POST /api/events/[id]/results
    │
    ├─ Create Result record (time, position, etc.)
    │
    └─ If trackable sport type (RUN/TRAIL):
        └─ Create UserPerformanceEntry:
            ├─ type = performanceType (RUN or TRAIL)
            ├─ distanceKm = variant.distanceKm
            ├─ timeSeconds = parsed from result
            ├─ elevationGainM = variant.elevationGainM
            ├─ resultId = newResult.id
            ├─ qualityScore = 0.8 (hardcoded)
            └─ predictionWeight = 0.9 (hardcoded)
```

### 6.4 GPS Activity Import

```
User syncs GPS activity → POST /api/profile/activities
    │
    ├─ Create RunActivity record
    ├─ Fetch 90-day run history
    ├─ computeRunScores() → { qualityScore, predictionWeight }
    └─ Create UserPerformanceEntry with runActivityId link
```

### 6.5 Score Display in UI

```
User opens Profile → Performance tab
    │
    └─ GET /api/profile/performance/summary
        │
        ├─ Run tab:
        │   ├─ Chart: pace evolution (rolling 3-point average)
        │   └─ Card: half-marathon prediction (time, range, confidence)
        │
        ├─ Trail tab:
        │   └─ Chart: pace and distance evolution
        │
        ├─ Strength tab:
        │   ├─ Exercise selector (sorted by total entries)
        │   ├─ Chart: e1RM evolution over time
        │   └─ Card: predicted e1RM with confidence level (LOW/MEDIUM/HIGH)
        │
        └─ HYROX tab:
            ├─ Category filter
            └─ Best times by category
```

---

## 7. Existing API Usage

### 7.1 Performance CRUD

| Method | Endpoint | Purpose | Scoring Logic |
|--------|----------|---------|--------------|
| `POST` | `/api/profile/performance` | Create performance entry | Calls `computeRunScores` or `computeStrengthScores` |
| `GET` | `/api/profile/performance` | List entries (paginated, cursor-based) | No scoring — read only |
| `PATCH` | `/api/profile/performance/[id]` | Update entry | **Recalculates** scores via `computeRunScores` / `computeStrengthScores` |
| `DELETE` | `/api/profile/performance?id=xxx` | Delete entry | No scoring |

### 7.2 Performance Summary

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `GET` | `/api/profile/performance/summary` | Returns aggregated data: run chart points, trail chart points, strength exercise summaries with e1RM predictions, HYROX best times, half-marathon prediction |

### 7.3 Workout Logs

| Method | Endpoint | Purpose | Scoring Logic |
|--------|----------|---------|--------------|
| `POST` | `/api/workouts/logs` | Create workout log with performance tracking | Calls `processStrengthEntry` → `computeStrengthScores` + PR detection for weight exercises |

### 7.4 Activities

| Method | Endpoint | Purpose | Scoring Logic |
|--------|----------|---------|--------------|
| `POST` | `/api/profile/activities` | Import GPS run activity | Calls `computeRunScores` |

### 7.5 Event Results

| Method | Endpoint | Purpose | Scoring Logic |
|--------|----------|---------|--------------|
| `POST` | `/api/events/[id]/results` | Submit event result | Hardcoded scores: `qualityScore: 0.8, predictionWeight: 0.9` |

### 7.6 Exercise Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `GET` | `/api/exercises` | List exercises (admin, paginated, search) |
| `GET` | `/api/exercises/[id]` | Get specific exercise |
| `PATCH` | `/api/exercises/[id]` | Update exercise measurement flags |
| `GET` | `/api/exercises/search` | Search exercises by name |

### 7.7 AI Integration

The `lib/athli-ai.ts` AI assistant can create performance entries with default scores:

- Default `qualityScore: 0.5` and `predictionWeight: 0.5` for entries created via AI.

---

## 8. Current Limitations / Issues

### 8.1 Duplicated Logic

- **e1RM calculation** is implemented in **3 separate places**:
  1. `lib/performance/scoring.ts` → `calculateE1rm()` (exported)
  2. `app/api/profile/performance/summary/route.ts` → local `calculateE1rm()` (re-implemented)
  3. `components/performance/performance-entries-list.tsx` → inline formula in JSX: `weightKg * (1 + reps / 30)`

### 8.2 effortScore Is Unused at Runtime

- The `effortScore` field is stored per exercise and has a Prisma index, but no code currently reads it for calculations. The training load formula is only documented in `docs/EFFORT_SCORE_GUIDE.md` and not implemented.

### 8.3 No Scoring for TRAIL Entries

- `PerformanceEntryType.TRAIL` exists as a type, and trail entries are fetched and displayed in the summary. However, there is no `computeTrailScores` function. Trail entries created via event results receive hardcoded scores (`0.8 / 0.9`).

### 8.4 Hardcoded Scores for Event Results and HYROX

- Event results always get `qualityScore: 0.8, predictionWeight: 0.9` regardless of the actual data quality.
- HYROX entries always get `qualityScore: 0.8, predictionWeight: 1.0`.
- These hardcoded values bypass the quality/outlier scoring that manual entries undergo.

### 8.5 Missing Tests

- There are no tests for:
  - `processStrengthEntry` (PR detection logic)
  - `processExercisePerformance` (workout log → performance entry flow)
  - `convertToKg` (unit conversion)
  - Integration between workout logging and performance entry creation
  - HYROX scoring (since it's hardcoded, but the behavior is untested)
  - The `calculateE1rm` duplicate in the summary route

### 8.6 Inconsistent Naming

- `qualityScore` vs. `effortScore` — these are completely different concepts but the naming suggests they might be related.
- `predictionWeight` — the name doesn't clearly communicate that it decays over time.
- `isPR` appears in both `WorkoutExerciseResult` and `WorkoutExerciseSet` but with different semantics (set-level vs. exercise-level).

### 8.7 Frontend/Backend Score Mismatch Risk

- The frontend calculates e1RM inline (`weightKg * (1 + reps / 30)`) rather than receiving it from the API. If the formula changes on the backend, the frontend would show different values.

### 8.8 No Score for Time/Distance/Calorie Exercises in Workouts

- When logging a workout, only exercises with `hasWeight = true` generate `UserPerformanceEntry` records. Time-based results (e.g., a plank hold or rowing time) are recorded in `WorkoutExerciseResult` but don't flow into the performance tracking system.

### 8.9 convertToKg Is a Local Function

- The `convertToKg` function that handles LB → KG conversion is defined locally in `app/api/workouts/logs/route.ts` and not shared. If another endpoint needs unit conversion, it would need to duplicate the logic.

### 8.10 Default qualityScore/predictionWeight = 0.5

- The Prisma schema defaults both to `0.5`, but all API routes explicitly compute and set them. If an entry were somehow created without going through the API (e.g., via direct database insert or migration), it would have a `0.5/0.5` score that wasn't algorithmically derived.

---

## 9. Real Examples

### Example 1: Strength — Back Squat 5×100 kg

| Property | Value |
|----------|-------|
| **Exercise** | Back Squat |
| **Type** | STRENGTH |
| **Input** | weightKg = 100, reps = 5 |
| **e1RM** | `100 × (1 + 5/30) = 100 × 1.1667 = 116.67 kg` |
| **qualityScore** | `computeStrengthQualityScore(100, 5) = 1.0` (reps in 1–12 range) |
| **predictionWeight** | `1.0` (if today, no outlier, full quality) |
| **Source code** | `lib/performance/scoring.ts:93–110` (quality), `lib/performance/scoring.ts:200–232` (composite) |

### Example 2: Running — 10 km in 50:00

| Property | Value |
|----------|-------|
| **Type** | RUN |
| **Input** | distanceKm = 10, timeSeconds = 3000 |
| **Pace** | `3000 / 10 = 300 sec/km = 5:00/km` |
| **qualityScore** | `computeRunQualityScore(10, 3000) = 1.0` (pace 300 sec/km is in 180–480 range) |
| **predictionWeight** | `1.0` (if today, no history for outlier detection) |
| **Half-marathon prediction** | `predictTimeWithRiegel(10, 3000, 21.0975)` → ~6,487 sec (~1:48:07) |
| **Source code** | `lib/performance/scoring.ts:53–88` (quality), `lib/performance/scoring.ts:154–195` (composite), `lib/performance/scoring.ts:248–254` (Riegel) |

### Example 3: Strength PR Detection — Deadlift 1×140 kg

| Property | Value |
|----------|-------|
| **Exercise** | Deadlift |
| **Type** | STRENGTH (via workout log) |
| **Input** | weightKg = 140, reps = 1 |
| **Current e1RM** | `140 × (1 + 1/30) = 140 kg` (1 rep = actual weight) |
| **Previous best e1RM** | Assume `130 × (1 + 3/30) = 143 kg` from a prior 3×130 kg set |
| **isPR** | `false` — 140 < 143, so not a PR despite heavier single |
| **Source code** | `app/api/workouts/logs/route.ts:191–246` (`processStrengthEntry`) |

### Example 4: Old Entry with Recency Decay

| Property | Value |
|----------|-------|
| **Exercise** | Bench Press |
| **Type** | STRENGTH |
| **Input** | weightKg = 80, reps = 8, performedAt = 45 days ago |
| **qualityScore** | `computeStrengthQualityScore(80, 8) = 1.0` |
| **Recency factor** | `exp(-45 / 45) = exp(-1) ≈ 0.368` |
| **predictionWeight** | `1.0 × 0.368 = 0.368` (assuming no outlier) |
| **Impact** | This entry has ~37% influence on e1RM prediction compared to a today-entry |
| **Source code** | `lib/performance/scoring.ts:117–149` (`computePredictionWeight`) |

### Example 5: Outlier Running Entry

| Property | Value |
|----------|-------|
| **Type** | RUN |
| **Input** | distanceKm = 10, timeSeconds = 1500 (2:30/km pace) |
| **qualityScore** | `computeRunQualityScore(10, 1500) = 0.2` (pace 150 sec/km < 120 threshold → actually returns 1.0 for pace between 180-480 — wait, 150 < 180, but ≥ 120, so neither impossibly fast nor in normal range) |
| **Median pace** | Assume median from history = 300 sec/km (5:00/km) |
| **Current pace** | 150 sec/km |
| **Deviation** | `|150 - 300| / 300 = 50%` → multiplier = 0.3 (severe outlier) |
| **predictionWeight** | `quality × recency × 0.3 ≈ very low` |
| **Source code** | `lib/performance/scoring.ts:134–146` (outlier detection) |

### Example 6: HYROX Entry — OPEN_MEN 1:15:00

| Property | Value |
|----------|-------|
| **Type** | HYROX |
| **Input** | hyroxCategory = "OPEN_MEN", timeSeconds = 4500, eventName = "HYROX Lisbon" |
| **qualityScore** | `0.8` (hardcoded) |
| **predictionWeight** | `1.0` (hardcoded) |
| **Source code** | `app/api/profile/performance/route.ts:232–247` |

### Example 7: Event Result — Trail 25 km in 3:30:00

| Property | Value |
|----------|-------|
| **Type** | TRAIL (via event result) |
| **Input** | distanceKm = 25 (from variant), timeSeconds = 12600 |
| **qualityScore** | `0.8` (hardcoded for event results) |
| **predictionWeight** | `0.9` (hardcoded for event results) |
| **Note** | No `computeRunScores` or `computeTrailScores` is called — bypassed |
| **Source code** | `app/api/events/[id]/results/route.ts:197–211` |

---

## 10. Source References

### Core Scoring Logic

| File | Purpose |
|------|---------|
| `lib/performance/scoring.ts` | All scoring algorithms, quality scoring, prediction weight, e1RM, half-marathon prediction, Riegel formula, formatting utilities |
| `__tests__/lib/performance/scoring.test.ts` | Unit tests for all scoring functions |

### API Routes

| File | Purpose |
|------|---------|
| `app/api/profile/performance/route.ts` | CRUD for manual performance entries (POST, GET, DELETE) |
| `app/api/profile/performance/[id]/route.ts` | Update individual entries (PATCH) with score recalculation |
| `app/api/profile/performance/summary/route.ts` | Summary endpoint with charts, predictions, aggregations |
| `app/api/workouts/logs/route.ts` | Workout log creation with PR detection and performance entry creation |
| `app/api/profile/activities/route.ts` | GPS activity import with run score computation |
| `app/api/events/[id]/results/route.ts` | Event result submission with hardcoded performance entry |
| `app/api/exercises/route.ts` | Exercise listing (admin) |
| `app/api/exercises/[id]/route.ts` | Exercise CRUD (GET, PATCH measurement flags) |
| `app/api/exercises/search/route.ts` | Exercise search |

### Prisma Schema & Seeds

| File | Purpose |
|------|---------|
| `prisma/schema.prisma` | Data model definitions (Exercise, UserPerformanceEntry, WorkoutExerciseResult, WorkoutExerciseSet, enums) |
| `prisma/seeds/exercises-seed.ts` | Exercise definitions with effortScore values (~97 exercises) |
| `prisma/seeds/strength-exercises.ts` | Additional strength exercise seeds |
| `prisma/seeds/mobility-exercises.ts` | Mobility exercise seeds |

### Frontend Components

| File | Purpose |
|------|---------|
| `components/performance/performance-section.tsx` | Main performance hub with tabs (Run, Trail, Strength, HYROX) |
| `components/performance/performance-entries-list.tsx` | Entry list with inline e1RM calculation and delete/edit |
| `components/performance/performance-strength-tab.tsx` | Strength tab: e1RM prediction card with confidence levels |
| `components/performance/performance-strength-chart.tsx` | e1RM evolution chart |
| `components/performance/performance-run-tab.tsx` | Run tab: half-marathon prediction, pace chart |
| `components/performance/performance-trail-tab.tsx` | Trail tab: pace and distance chart |
| `components/performance/performance-run-chart.tsx` | Shared pace/distance chart component |
| `components/performance/performance-hyrox-tab.tsx` | HYROX tab: category filter, best times |
| `components/performance/performance-hyrox-entries-list.tsx` | HYROX entry list |
| `components/workout-history.tsx` | Workout log display with PR badges, set-level metrics |

### Existing Documentation

| File | Purpose |
|------|---------|
| `docs/EFFORT_SCORE_GUIDE.md` | Effort score guidelines (1–10 scale), training load formula (not implemented) |
| `docs/EXERCISES_SYSTEM.md` | Exercise system overview, seeding, translation, API |

### AI Integration

| File | Purpose |
|------|---------|
| `lib/athli-ai.ts` | AI assistant that can create performance entries with default scores (0.5/0.5) |

---

## 11. Bonus: Score Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         USER INPUT SOURCES                              │
├────────────┬──────────────┬────────────────┬───────────────────────────┤
│  Manual    │  Workout Log │  Event Result  │  GPS Activity  │   AI    │
│  Entry     │  (w/ sets)   │  (race time)   │  (Strava/etc)  │  Chat   │
└─────┬──────┴──────┬───────┴────────┬───────┴────────┬───────┴────┬────┘
      │             │                │                │            │
      ▼             ▼                ▼                ▼            ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                       SCORING LAYER                                     │
├─────────────┬─────────────┬──────────────────┬──────────────────────────┤
│ computeRun  │ computeStr  │  Hardcoded       │  Default                 │
│ Scores()    │ engthScores │  (0.8/0.9 event) │  (0.5/0.5 AI)           │
│             │ ()          │  (0.8/1.0 HYROX) │                          │
│ ┌─────────┐ │ ┌─────────┐ │                  │                          │
│ │quality  │ │ │quality  │ │                  │                          │
│ │Score    │ │ │Score    │ │                  │                          │
│ └────┬────┘ │ └────┬────┘ │                  │                          │
│      ▼      │      ▼      │                  │                          │
│ ┌─────────┐ │ ┌─────────┐ │                  │                          │
│ │predict. │ │ │predict. │ │                  │                          │
│ │Weight   │ │ │Weight   │ │                  │                          │
│ └─────────┘ │ └─────────┘ │                  │                          │
└─────────────┴─────────────┴──────────────────┴──────────────────────────┘
                      │
                      ▼
         ┌──────────────────────┐
         │ UserPerformanceEntry │  ← Persisted in database
         │  qualityScore        │
         │  predictionWeight    │
         └──────────┬───────────┘
                    │
         ┌──────────┴───────────┐
         ▼                      ▼
┌─────────────────┐  ┌──────────────────────┐
│  PREDICTIONS    │  │  DISPLAY             │
│                 │  │                      │
│  predictE1rm()  │  │  e1RM chart          │
│  predictHalf    │  │  Pace chart          │
│  Marathon()     │  │  PR badges (isPR)    │
│                 │  │  Confidence levels   │
│  Uses weighted  │  │  Half-marathon card  │
│  average of all │  │                      │
│  valid entries  │  │                      │
└─────────────────┘  └──────────────────────┘
```

---

## 12. Bonus: Metric → Formula → Example Table

| Metric Type | Formula | Input Example | Output | Direction | Source |
|-------------|---------|---------------|--------|-----------|--------|
| **Run Quality** | Pace thresholds (sec/km) | 10 km, 3000s → 300 sec/km | `1.0` | — | `scoring.ts:53–88` |
| **Strength Quality** | Rep range thresholds | 100 kg, 5 reps | `1.0` | — | `scoring.ts:93–110` |
| **Prediction Weight** | `quality × recency × outlier` | quality=1.0, 45d ago | `0.368` | — | `scoring.ts:117–149` |
| **e1RM (Epley)** | `weight × (1 + reps / 30)` | 100 kg × 5 reps | `116.67 kg` | Higher = better | `scoring.ts:239–242` |
| **Half-Marathon (Riegel)** | `T1 × (D2/D1)^1.06` | 10 km in 3000s → 21.1 km | `~6487s` | Lower = better | `scoring.ts:248–254` |
| **PR Detection** | `currentE1rm > bestHistoricalE1rm` | 140×1 vs. best 143 | `false` | — | `logs/route.ts:191–246` |
| **Effort Score** | Static per exercise | Back Squat | `8.0` | Higher = harder | `exercises-seed.ts` |
| **Training Load** | `Σ(effort × reps × weightFactor × timeFactor)` | Grace (C&J×30) | `450 pts` | Higher = harder | `EFFORT_SCORE_GUIDE.md` (not implemented) |

---

## 13. Bonus: Improvement Opportunities

| Area | Issue | Suggested Improvement |
|------|-------|-----------------------|
| **DRY** | e1RM formula duplicated in 3 places | Extract to a single shared utility |
| **Trail scoring** | No dedicated trail scoring function | Create `computeTrailScores` that accounts for elevation |
| **HYROX scoring** | Hardcoded quality/weight values | Implement algorithmic scoring based on historical HYROX times |
| **Event result scoring** | Hardcoded 0.8/0.9 scores | Use `computeRunScores` for event results too |
| **AI entry scoring** | Default 0.5/0.5 scores | Compute actual scores for AI-created entries |
| **Training load** | Documented but not implemented | Implement the training load formula using `effortScore` |
| **Unit conversion** | `convertToKg` is a local function | Extract to shared `lib/units.ts` utility |
| **Non-weight metrics** | Time/distance/calorie exercises don't generate performance entries | Extend performance tracking to all metric types |
| **Frontend e1RM** | Inline calculation in JSX | Use API-provided value or shared utility |
| **Test coverage** | No integration tests for workout → performance flow | Add tests for `processStrengthEntry`, `processExercisePerformance`, unit conversion |
| **Type naming** | `qualityScore` vs. `effortScore` confusion | Rename or add documentation to distinguish clearly |
| **Score persistence** | e1RM is never persisted | Consider storing computed e1RM for faster queries |
| **Prediction recalculation** | Predictions only update when summary is fetched | Consider background recalculation or caching |
