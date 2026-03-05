# LiveRace Phase 3 — Status Report

> **Generated**: March 2026
> **Phase**: LiveRace — Tracking + Leaderboard
> **Previous**: Phase 2 — Check-in & Access Control (✅ Complete)
> **Next**: Phase 4 — Results, Analytics & Refinements (Planned)

---

## Executive Summary

**Phase 3 is fully implemented and operational.** The live race engine — including GPS
tracking, route projection, checkpoint detection, real-time leaderboard, offline sync,
anti-cheat validation, and spectator broadcasts — is built, integrated, and functional
across the Live Server, Next.js backend, and management dashboard.

The implementation **deviates from the original roadmap** in architecture: instead of
per-point database persistence (`RaceSession` + `TrackingPoint` models), the system uses
an in-memory + Redis approach on a dedicated Fastify + Socket.io live server. Final
results are persisted atomically via the existing `Result` model. This architectural
decision prioritizes real-time performance and simplifies the hot path.

| Area                              | Status      |
| --------------------------------- | ----------- |
| GPS tracking engine               | ✅ Complete |
| Route projection (snap-to-route)  | ✅ Complete |
| Checkpoint detection              | ✅ Complete |
| Finish detection & result persist | ✅ Complete |
| Real-time leaderboard (Socket.io) | ✅ Complete |
| Offline batch sync                | ✅ Complete |
| Anti-cheat validation             | ✅ Complete |
| Athlete gating (Phase 2 gates)    | ✅ Complete |
| Live state machine (7 states)     | ✅ Complete |
| Organizer management UI           | ✅ Complete |
| Per-variant start times           | ✅ Complete |
| Personal chip-time (start zone)   | ✅ Complete |
| Internal API (Next.js ↔ Live)     | ✅ Complete |
| Spectator real-time view          | ✅ Complete |

---

## 1. Architecture Overview

The original roadmap (Phase 3 issue) described a Next.js-centric API with direct DB
persistence per tracking point. The implemented architecture uses a dedicated live server
for all real-time operations:

```
┌─────────────────────────────────────────────────────────────┐
│  BROWSER / MOBILE APP                                       │
│                                                             │
│  Spectator page          Athlete app                        │
│  (LiveRaceSection)       (GPS + Socket.io)                  │
│       │ Socket.io             │ Socket.io + GPS              │
└───────┼───────────────────────┼─────────────────────────────┘
        │                       │
        ▼                       ▼
┌─────────────────────────────────────────────────────────────┐
│  LIVE SERVER  (Fastify + Socket.io)                         │
│                                                             │
│  • In-memory event rooms (EventRoomState)                   │
│  • GPS projection engine (route-engine.ts)                  │
│  • Leaderboard computation + periodic broadcasts            │
│  • Checkpoint & finish detection                            │
│  • Anti-cheat validation (speed, accuracy, timestamp)       │
│  • Redis for persistence between restarts                   │
│                                                             │
│  REST:  /live/*      — public/admin control                 │
│         /internal/*  — Next.js ↔ Live Server sync           │
└─────────────────────────┬───────────────────────────────────┘
                          │ HTTP internal
                          ▼
┌─────────────────────────────────────────────────────────────┐
│  NEXT.JS  (main application)                                │
│                                                             │
│  • PostgreSQL (Prisma) — events, registrations, results     │
│  • Auth (NextAuth) — session/JWT verification               │
│  • Management dashboard — organizer controls                │
│  • Internal APIs — config, auth, status, results            │
└─────────────────────────────────────────────────────────────┘
```

### Communication Between Services

| Direction               | Protocol             | Authentication          |
| ----------------------- | -------------------- | ----------------------- |
| Browser → Live Server   | Socket.io (WebSocket)| JWT token (athletes)    |
| Browser → Next.js       | HTTP                 | Session cookie (NextAuth)|
| Next.js → Live Server   | HTTP REST            | Header `x-live-secret`  |
| Live Server → Next.js   | HTTP REST            | Header `X-Live-Secret`  |

---

## 2. Original Plan vs Implementation

### 2.1 What Changed

| Original Roadmap Item                         | Implementation                          | Reason                                          |
| --------------------------------------------- | --------------------------------------- | ----------------------------------------------- |
| `RaceSession` Prisma model (1:1 Registration) | In-memory `AthleteState` in live server | Real-time performance; no DB round-trips per GPS |
| `TrackingPoint` Prisma model (per GPS point)   | Volatile in-memory; not persisted       | Millions of points/race would overwhelm DB      |
| `POST /api/race/start` REST endpoint          | `liverace:join_athlete` Socket.io event | WebSocket is already open; REST unnecessary     |
| `POST /api/race/tracking` REST endpoint       | `liverace:gps_update` Socket.io event   | Lower latency; bidirectional feedback           |
| `POST /api/race/finish` REST endpoint         | Auto-finish via checkpoint detection    | Finish is detected server-side, not client-sent |
| `GET /api/events/[eventId]/leaderboard`       | `liverace:leaderboard` Socket.io event  | Push-based (2s broadcasts) vs poll-based        |
| `GET /api/race/[sessionId]/track`             | Not implemented (see below)             | Privacy mode not yet needed                     |
| `RaceSessionStatus` enum in Prisma            | `AthleteStatus` type in live server     | States differ: ACTIVE/INACTIVE/OFF_ROUTE/FINISHED/DNF/DSQ |
| `PrivacyMode` enum (PUBLIC/FRIENDS/ORGANIZER) | Not implemented                         | Deferred — no friends system exists yet         |
| Rate limiting (max 1 req/s per session)        | Client-side cadence (1–3s GPS updates)  | Server validates timestamp gaps instead         |

### 2.2 What Was Added Beyond Original Spec

1. **Route projection engine** — snap-to-route GPS processing with segment-level optimization
2. **Checkpoint detection** — dual method (distance-based + proximity-based) for reliability
3. **Personal chip time** — start zone exit detection per athlete (not just gun time)
4. **Per-variant start times** — scheduled auto-start timers with countdown sync
5. **Offline batch sync** — up to 5000 buffered GPS points with progress feedback
6. **Anti-cheat validation** — speed, accuracy, timestamp checks with configurable thresholds
7. **Off-route detection** — deviation monitoring with automatic status broadcast
8. **Inactivity detection** — marks athletes inactive after 30s without GPS signal
9. **Result persistence** — atomic upsert to `Result` model with position, time, DNF/DSQ
10. **Redis state backup** — room state survives live server restarts
11. **Spectator count** — real-time viewer count broadcast
12. **Variant-level broadcasts** — `liverace:variant_started` event per variant gun time

### 2.3 What No Longer Makes Sense

| Original Item                                        | Why It No Longer Applies                                                                 |
| ---------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| `RaceSession` model in Prisma                        | Tracking state is volatile by nature; persisting every GPS point is wasteful for MVP      |
| `TrackingPoint` model with retention strategy         | No DB persistence needed — in-memory during race, results persisted at finish             |
| `POST /api/race/finish` (client-initiated)           | Finish is auto-detected when athlete crosses FINISH checkpoint; manual endpoint redundant |
| `PrivacyMode` (FRIENDS)                              | No friendship system exists in Athlifyr; defer until social features are built            |
| Replay/aggregation strategy for tracking points       | Without DB persistence, no retention or aggregation is needed                             |
| `GET /api/race/[sessionId]/track` endpoint           | Track data is only in memory during race; post-race track viewing requires future work    |

---

## 3. Database Schema

### 3.1 Models Used by Phase 3

Phase 3 leverages existing models without requiring new Prisma migrations.

#### Event Model (Phase 2 fields used)

| Field             | Type              | Purpose                             |
| ----------------- | ----------------- | ----------------------------------- |
| `hasLiveRace`     | `Boolean`         | Feature flag (platform admin only)  |
| `liveStatus`      | `EventLiveStatus` | Current race lifecycle state        |
| `checkInOpensAt`  | `DateTime?`       | Check-in window start               |
| `checkInClosesAt` | `DateTime?`       | Check-in window end                 |

#### EventLiveStatus Enum

```
SCHEDULED → CHECK_IN_OPEN → WARMUP → LIVE → PAUSED → LIVE → FINISHED
                                                 └──────────┘
Any state → CANCELLED
```

States: `SCHEDULED`, `CHECK_IN_OPEN`, `WARMUP`, `LIVE`, `PAUSED`, `FINISHED`, `CANCELLED`

#### EventRoute Model

| Field            | Type     | Purpose                              |
| ---------------- | -------- | ------------------------------------ |
| `variantId`      | `String` | 1:1 with EventVariant (unique)       |
| `gpxData`        | `String` | Original GPX XML                     |
| `routePoints`    | `Json`   | Array of `[lat, lng]` pairs          |
| `distanceKm`     | `Float?` | Total route distance                 |
| `elevationGainM` | `Int?`   | Total positive elevation             |
| `elevationLossM` | `Int?`   | Total negative elevation             |

#### RouteCheckpoint Model

| Field       | Type     | Purpose                              |
| ----------- | -------- | ------------------------------------ |
| `routeId`   | `String` | FK to EventRoute                     |
| `name`      | `String` | Checkpoint display name              |
| `type`      | `String` | `START`, `FINISH`, `INTERMEDIATE`    |
| `order`     | `Int`    | Sequential order along route         |
| `latitude`  | `Float`  | Checkpoint latitude                  |
| `longitude` | `Float`  | Checkpoint longitude                 |
| `radiusM`   | `Int`    | Detection radius (default 50m)       |
| `cutoffMin` | `Int?`   | Time cutoff in minutes (optional)    |

#### Result Model (persisted at race finish)

| Field              | Type      | Purpose                           |
| ------------------ | --------- | --------------------------------- |
| `userId`           | `String`  | FK to User                        |
| `eventId`          | `String`  | FK to Event                       |
| `variantId`        | `String`  | FK to EventVariant                |
| `time`             | `String`  | Finish time (HH:MM:SS format)     |
| `timeSeconds`      | `Int`     | Finish time in seconds            |
| `position`         | `Int`     | Overall rank                      |
| `categoryPosition` | `Int?`    | Category rank (optional)          |
| `notes`            | `String?` | DNF, DSQ, or other notes          |
| `isPublic`         | `Boolean` | Whether result is publicly visible|

### 3.2 Models NOT Implemented (Roadmap Deviations)

| Planned Model    | Status       | Alternative                                |
| ---------------- | ------------ | ------------------------------------------ |
| `RaceSession`    | Not created  | `AthleteState` in live server memory       |
| `TrackingPoint`  | Not created  | GPS points are volatile (memory only)      |
| `PrivacyMode`    | Not created  | All athletes visible during race (no toggle)|

---

## 4. Live Server — Race Engine

### 4.1 Core Service (`liverace.service.ts`)

| Function                   | Purpose                                                  |
| -------------------------- | -------------------------------------------------------- |
| `startEvent(eventId, io)`  | Idempotent room creation; fetches config, builds routes  |
| `stopEvent(eventId, io)`   | Stops race, persists results, destroys room after 60s    |
| `joinAthlete()`            | Registers athlete; verifies via internal auth API        |
| `leaveAthlete()`           | Marks athlete INACTIVE                                   |
| `joinSpectator()`          | Increments spectator count                               |
| `leaveSpectator()`         | Decrements spectator count                               |
| `processGpsUpdate()`       | **Hot path** — projects GPS, detects checkpoints/finish  |
| `processGpsBatch()`        | Offline sync — replays buffered points chronologically   |
| `computeLeaderboard()`     | Sorts athletes by finish time → distance → checkpoint    |
| `getSnapshot()`            | Returns current state for newly connected clients        |
| `scheduleRaceStart()`      | Per-variant auto-start timers at configured startTime    |

### 4.2 Route Engine (`route-engine.ts`)

| Function                     | Purpose                                                |
| ---------------------------- | ------------------------------------------------------ |
| `buildRouteHelper()`         | Precomputes route segments and checkpoint distances    |
| `projectPointOnRoute()`      | Finds closest route segment, returns distance + deviation|
| `projectPointOnRouteNear()`  | Optimized projection (±10 segment window from hint)    |
| `detectNewCheckpoints()`     | Dual detection: distance-based + proximity-based       |
| `detectFinish()`             | Detects FINISH checkpoint passage or route completion  |
| `isPlausibleUpdate()`        | **Anti-cheat**: rejects impossible speed jumps         |
| `isAccuracyAcceptable()`     | **Anti-cheat**: rejects noisy GPS (>100m accuracy)     |
| `isTimestampValid()`         | **Anti-cheat**: rejects future or stale timestamps     |
| `haversineM()`               | Distance between two GPS coordinates (meters)          |

### 4.3 Anti-Cheat Thresholds

| Validation          | Threshold      | Action                            |
| ------------------- | -------------- | --------------------------------- |
| Maximum speed       | 50 km/h        | Point rejected (skip)             |
| GPS accuracy        | 100m           | Point rejected (skip)             |
| Future timestamp    | +60 seconds    | Point rejected                    |
| Stale timestamp     | >24 hours old  | Point rejected                    |
| Route deviation     | 150m (default) | Athlete flagged `OFF_ROUTE`       |
| Inactivity timeout  | 30 seconds     | Athlete marked `INACTIVE`         |
| Batch speed (offline)| 75 km/h (1.5×) | Lenient for GPS drift accumulation|
| Backward tolerance  | 50m            | Allowed (GPS jitter tolerance)    |

### 4.4 Broadcast Intervals

| Broadcast           | Interval | Active During     | Payload                    |
| ------------------- | -------- | ----------------- | -------------------------- |
| Leaderboard         | 2 seconds| LIVE only         | All ranked athlete entries |
| Athlete positions   | 1 second | LIVE + WARMUP     | lat/lng, rank, progress    |
| Inactivity check    | 10 seconds| Always            | Marks inactive athletes    |
| Spectator count     | On change| Always            | Current viewer count       |

---

## 5. Socket.io Events

### 5.1 Client → Server

| Event                     | Payload                          | Role     | Purpose                    |
| ------------------------- | -------------------------------- | -------- | -------------------------- |
| `liverace:join_athlete`   | `{eventId}`                      | Athlete  | Join race (verified via JWT)|
| `liverace:join_spectator` | `{eventId}`                      | Spectator| Watch race                 |
| `liverace:leave`          | `{eventId}`                      | Both     | Leave race room            |
| `liverace:gps_update`     | `{eventId, point}`               | Athlete  | Real-time GPS (1–3s)       |
| `liverace:gps_batch`      | `{eventId, points[]}` (max 5000) | Athlete  | Offline GPS sync           |

### 5.2 Server → Client

| Event                         | Payload                                      | Trigger            |
| ----------------------------- | -------------------------------------------- | ------------------ |
| `liverace:joined`             | `{eventId, status, role, serverTime, variantStartTimes}` | On join  |
| `liverace:error`              | `{message, code}`                            | On error           |
| `liverace:status_changed`     | `{eventId, status, raceStartTime, variantStartTimes}`    | State change |
| `liverace:variant_started`    | `{eventId, variantId, variantName, raceStartTime}`       | Variant gun |
| `liverace:leaderboard`        | `{eventId, entries[], timestamp}`             | Every 2s (LIVE)    |
| `liverace:positions`          | `{eventId, athletes[]}`                      | Every 1s           |
| `liverace:athlete_joined`     | `{eventId, athlete}`                         | Athlete entry      |
| `liverace:athlete_left`       | `{eventId, userId}`                          | Athlete exit       |
| `liverace:athlete_started`    | `{eventId, userId, personalStartTime}`       | Start zone exit    |
| `liverace:checkpoint_reached` | `{eventId, userId, athleteName, checkpoint}` | Checkpoint crossed |
| `liverace:athlete_finished`   | `{eventId, userId, rank, finishTimeMs}`      | Finish crossed     |
| `liverace:athlete_status`     | `{eventId, userId, status}`                  | Status change      |
| `liverace:spectator_count`    | `{eventId, count}`                           | On join/leave      |
| `liverace:sync_progress`      | `{eventId, processed, total}`                | Every 100 pts      |
| `liverace:sync_complete`      | `{eventId, processed, skipped, newCheckpoints, durationMs}` | Batch done |

---

## 6. Live Server REST Endpoints

### 6.1 Public Endpoints

| Method | Endpoint       | Auth      | Purpose                                    |
| ------ | -------------- | --------- | ------------------------------------------ |
| POST   | `/live/start`  | None      | Idempotent room prep (spectator page load) |
| POST   | `/live/stop`   | JWT (Admin)| Admin-only race termination                |
| GET    | `/live/status` | None      | Room status query (single or all rooms)    |

### 6.2 Internal Endpoints (Next.js ↔ Live Server)

| Method | Endpoint                       | Auth             | Purpose                            |
| ------ | ------------------------------ | ---------------- | ---------------------------------- |
| POST   | `/internal/status`             | `x-live-secret`  | Broadcast status change to clients |
| GET    | `/internal/room-info/:eventId` | `x-live-secret`  | Metrics for manage panel           |

---

## 7. Next.js Internal APIs

### 7.1 Live Config

```
GET /api/internal/live-config?eventId={id}
```

Returns complete event configuration including route points, checkpoints, variant
settings, and broadcast intervals. Called by the live server when creating a room.

### 7.2 Live Auth Verification

```
POST /api/internal/live-auth/verify
Body: { userId, eventId }
```

Verifies athlete eligibility: checks for CONFIRMED registration (paid) or CONFIRMED
participation (free). Returns athlete details (name, image, variant, bib number).

### 7.3 Live Status Sync

```
POST /api/internal/live-status
Body: { eventId, status }
```

Updates `event.liveStatus` in the database. Called by the live server when state
transitions occur. Validates the transition is legal.

### 7.4 Live Results Persistence

```
POST /api/internal/live-results
Body: { eventId, results: [{ userId, variantId, position, timeMs, status, checkpoints }] }
```

Persists race results via upsert to the `Result` model. Called once when the race
finishes. Updates event status to `FINISHED`. Idempotent (safe to retry).

---

## 8. Next.js Public APIs (Phase 2, used by Phase 3)

| Method | Endpoint                                                    | Purpose                   |
| ------ | ----------------------------------------------------------- | ------------------------- |
| POST   | `/api/events/[id]/live-control`                             | State machine commands    |
| GET    | `/api/events/[id]/live-status`                              | Current live status       |
| GET    | `/api/events/[id]/live-readiness`                           | Variant readiness report  |
| GET    | `/api/registrations/[regId]/race-gate`                      | Race-start gating check   |

### State Machine Commands

| Command    | From States               | To State        |
| ---------- | ------------------------- | --------------- |
| `checkin`  | `SCHEDULED`               | `CHECK_IN_OPEN` |
| `warmup`   | `CHECK_IN_OPEN`           | `WARMUP`        |
| `start`    | `WARMUP`                  | `LIVE`          |
| `pause`    | `LIVE`                    | `PAUSED`        |
| `resume`   | `PAUSED`                  | `LIVE`          |
| `finish`   | `LIVE`, `PAUSED`          | `FINISHED`      |
| `cancel`   | Any (except `CANCELLED`)  | `CANCELLED`     |

### Readiness Validation (on `checkin`, `warmup`, `start`)

Per active variant:

1. Route has ≥50 valid points with coordinates in range (`-90 ≤ lat ≤ 90`, `-180 ≤ lng ≤ 180`)
2. START checkpoint exists
3. FINISH checkpoint exists (highest order)
4. No duplicate checkpoint orders
5. `variant.startTime` is set

Non-advancing commands (`pause`, `resume`, `finish`) skip readiness checks.

---

## 9. Race-Start Gating

**Endpoint**: `GET /api/registrations/[registrationId]/race-gate`
**Implementation**: `lib/checkin-gating.ts` → `validateRaceStartGating()`

### Gate Conditions (ALL must pass)

| # | Gate                               | Blocks When                             |
| - | ---------------------------------- | --------------------------------------- |
| 1 | Registration status is `CONFIRMED` | `PENDING`, `CANCELLED`, or `REFUNDED`   |
| 2 | Check-in completed                 | `checkedInAt == null`                   |
| 3 | Event is `LIVE`                    | Any status other than `LIVE`            |

Additional validations:

- Event must have `hasLiveRace = true`
- Event must not be `CANCELLED`
- User must own the registration (or match guest email)

---

## 10. Management Dashboard

### LiveRace Tab (`tab-liverace.tsx`)

The organizer management dashboard provides:

- **Status badge**: Color-coded per state (SCHEDULED, CHECK_IN_OPEN, WARMUP, LIVE, PAUSED, FINISHED, CANCELLED)
- **Live metrics**: Connected spectators count, active participants count, last GPS update time
- **Server health**: Connectivity indicator (polls live server every 10 seconds)
- **Readiness checklist**: Per-variant validation (route points, checkpoints, start time)
- **Control buttons**: Sequential state advancement with confirmation dialogs
- **Public page link**: Quick link to spectator view for verification

### Command Flow

```
Organizer clicks "Start" button
  → POST /api/events/{id}/live-control { command: "start" }
  → Validates readiness (route, checkpoints, start time)
  → Updates DB: event.liveStatus = "LIVE"
  → POST /internal/status { eventId, status: "LIVE" }
  → Live Server broadcasts liverace:status_changed
  → All connected clients receive status update
  → Dashboard badge updates in real-time
```

---

## 11. GPS Processing Flow

### Real-Time Update (Online)

```
1. Athlete app sends GPS every 1–3 seconds
   → liverace:gps_update { eventId, point: { lat, lng, accuracy, speed, altitude } }

2. Live Server validates:
   a. Room exists and status is LIVE
   b. Athlete is registered in room
   c. Timestamp is valid (not future, not stale)
   d. GPS accuracy is acceptable (≤100m)
   e. Speed is plausible (≤50 km/h from last known position)

3. If valid, project GPS onto route:
   a. Find nearest route segment (optimized ±10 segment window)
   b. Calculate distance-along-route (meters from start)
   c. Calculate deviation from route (perpendicular distance)
   d. Update progress percentage

4. Enforce monotonic progress:
   a. Allow up to 50m backward (GPS jitter)
   b. Reject larger backward jumps

5. Check for start zone exit (personal chip time):
   a. If athlete was inside START zone and is now outside → set personalStartTime

6. Detect new checkpoints:
   a. Distance-based: distance along route passes checkpoint distance (±50m)
   b. Proximity-based: GPS coordinates within checkpoint radius
   c. Emit liverace:checkpoint_reached for each new checkpoint

7. Detect finish:
   a. FINISH checkpoint crossed (distance-based or proximity-based)
   b. Calculate finishTimeMs from personalStartTime
   c. Compute rank among finished athletes
   d. Emit liverace:athlete_finished

8. Update AthleteState in memory
```

### Offline Batch Sync

```
1. Athlete reconnects after network loss
   → liverace:gps_batch { eventId, points: [...] } (max 5000 points)

2. Live Server sorts points by timestamp (chronological)

3. Processes each point sequentially with lenient validation:
   a. Speed threshold increased to 75 km/h (1.5× normal)
   b. All other validations apply

4. Emits progress feedback every 100 points:
   → liverace:sync_progress { processed, total }

5. On completion:
   → liverace:sync_complete { processed, skipped, newCheckpoints, durationMs }

6. Leaderboard updates normally after batch processing
```

---

## 12. Leaderboard Computation

### Ranking Algorithm

Athletes are sorted by:

1. **Finished athletes first** — sorted by finish time (ascending)
2. **Active athletes** — sorted by distance along route (descending)
3. **Tied distance** — sorted by last checkpoint order (descending)

### Leaderboard Entry

```typescript
{
  rank: number;
  userId: string;
  name: string | null;
  image: string | null;
  bibNumber: string | null;
  variantId: string;
  variantName: string;
  status: "ACTIVE" | "INACTIVE" | "OFF_ROUTE" | "FINISHED" | "DNF" | "DSQ";
  distanceAlongRouteM: number;
  progressPercent: number;
  lastCheckpointOrder: number;
  lastCheckpointName: string | null;
  finishTimeMs: number | null;
  personalStartTime: number | null;
  gap: string | null;        // e.g. "+1:23" or "+500m"
}
```

### Gap Calculation

- Between finished athletes: time difference (e.g. `"+1:23"`)
- Between active athletes: distance difference (e.g. `"+500m"`)
- First place: `null` (no gap)

---

## 13. Result Persistence

When the organizer finishes the race or the live server detects all athletes have
finished:

1. `computeLeaderboard()` calculates final standings
2. `persistResults()` calls `POST /api/internal/live-results`
3. Next.js upserts each result into the `Result` model:
   - Position (overall rank)
   - Time (HH:MM:SS format + seconds)
   - Notes (DNF/DSQ if applicable)
   - Checkpoint splits (if available)
4. Event `liveStatus` is updated to `FINISHED`
5. Live server room is destroyed after a 60-second grace period

---

## 14. Test Coverage

### Existing Tests (Phase 2 + Phase 3 Related)

| Test File                                      | Tests | Scope                          |
| ---------------------------------------------- | ----- | ------------------------------ |
| `__tests__/api/events/live-control.test.ts`    | 18    | State machine transitions      |
| `__tests__/api/events/live-readiness.test.ts`  | 18    | Variant readiness validation   |
| `__tests__/api/registrations/race-gate.test.ts`| 13    | Race-start gating              |
| `__tests__/lib/checkin-gating.test.ts`         | 17    | Window status & gating logic   |

### Coverage Areas

- ✅ State machine transitions (valid + invalid)
- ✅ Route readiness (point count, coordinates, checkpoints)
- ✅ Race-start gating (CONFIRMED + checked-in + LIVE)
- ✅ Authorization for live-control (admin/organizer only)
- ✅ Check-in window enforcement

### Areas Not Yet Tested

- ❌ Live server GPS processing (route engine unit tests)
- ❌ Live server checkpoint detection
- ❌ Live server leaderboard computation
- ❌ Live server anti-cheat validation
- ❌ Internal API endpoints (live-config, live-auth, live-results)
- ❌ Socket.io event handlers (integration tests)
- ❌ Offline batch sync processing

---

## 15. Phase 3 Acceptance Criteria — Validation

### From the Original Issue

| Criterion                                                         | Status | Implementation                                           |
| ----------------------------------------------------------------- | ------ | -------------------------------------------------------- |
| Athlete (CONFIRMED + checked-in) starts race                      | ✅     | `race-gate` validates all 3 gates; `join_athlete` verifies via internal API |
| Tracking points arrive at backend in batch and are stored          | ⚠️     | Points arrive via Socket.io (real-time + batch); stored **in memory**, not DB |
| Leaderboard updates in real-time (socket) and via GET              | ✅     | `liverace:leaderboard` broadcasts every 2s; `getSnapshot()` for initial load |
| Finish closes session and calculates base time                     | ✅     | Auto-detected via checkpoint; `finishTimeMs` from personal start time |
| Privacy mode respected in track and leaderboard                    | ❌     | Not implemented — all athletes are visible (deferred)    |
| Rate limiting and validations prevent basic abuse                  | ✅     | Anti-cheat (speed, accuracy, timestamp); client cadence; auth required |

### From the Acceptance Criteria Document (`LIVERACEAC.md`)

| Criterion                                           | Status | Notes                                              |
| --------------------------------------------------- | ------ | -------------------------------------------------- |
| Organizer runs full race lifecycle end-to-end        | ✅     | 7-state machine with validated transitions         |
| Athlete starts race                                  | ✅     | Via `join_athlete` with registration verification  |
| Athlete sees rank updates                            | ✅     | Via `liverace:leaderboard` broadcasts              |
| Athlete sees finish confirmation                     | ✅     | Via `liverace:athlete_finished` event              |
| Athlete recovers from temporary offline              | ✅     | Via `liverace:gps_batch` (max 5000 points)         |
| Spectator watches live positions                     | ✅     | Via `liverace:positions` (1s broadcasts)           |
| Spectator sees ranking changes in real time          | ✅     | Via `liverace:leaderboard` (2s broadcasts)         |
| No ranking corruption after offline reconnection     | ✅     | Chronological replay with monotonic progress       |
| Results correctly stored after finish                | ✅     | Via `persist_results` → `Result` model upsert      |

---

## 16. Key Files

### Live Server

| File                                               | Purpose                             |
| -------------------------------------------------- | ----------------------------------- |
| `live/src/modules/liverace/liverace.service.ts`    | Room management, GPS processing     |
| `live/src/modules/liverace/liverace.routes.ts`     | REST endpoints                      |
| `live/src/modules/liverace/liverace.handlers.ts`   | Socket.io event handlers            |
| `live/src/modules/liverace/liverace.types.ts`      | Type definitions                    |
| `live/src/modules/liverace/liverace.api.ts`        | HTTP client for Next.js callbacks   |
| `live/src/modules/liverace/route-engine.ts`        | GPS math and route projection       |

### Next.js APIs

| File                                               | Purpose                             |
| -------------------------------------------------- | ----------------------------------- |
| `app/api/events/[id]/live-control/route.ts`        | State machine control               |
| `app/api/events/[id]/live-status/route.ts`         | Live status query                   |
| `app/api/events/[id]/live-readiness/route.ts`      | Readiness validation                |
| `app/api/registrations/[regId]/race-gate/route.ts` | Race-start gating                   |
| `app/api/internal/live-config/route.ts`            | Event config for live server        |
| `app/api/internal/live-auth/verify/route.ts`       | Athlete verification                |
| `app/api/internal/live-status/route.ts`            | Status sync (live → DB)             |
| `app/api/internal/live-results/route.ts`           | Result persistence                  |

### Shared Libraries

| File                                               | Purpose                             |
| -------------------------------------------------- | ----------------------------------- |
| `lib/checkin-gating.ts`                            | Check-in window + race gate logic   |

### Management UI

| File                                                              | Purpose                    |
| ----------------------------------------------------------------- | -------------------------- |
| `app/[locale]/events/[slug]/manage/_components/tab-liverace.tsx`  | Organizer live race panel  |

---

## 17. Future Work (Phase 4+)

### High Priority

1. **Post-race track viewer** — display athlete GPS tracks after the race finishes (requires either persisting key points during race or exporting from live server before room teardown)
2. **Live server unit tests** — route engine, GPS processing, leaderboard computation, anti-cheat
3. **Internal API tests** — live-config, live-auth, live-results endpoints
4. **Socket.io integration tests** — end-to-end event flow simulation

### Medium Priority

5. **Privacy mode** — `PUBLIC` / `ORGANIZER_ONLY` toggle per athlete (defer `FRIENDS` until social system exists)
6. **Tracking point export** — export GPS data for post-race analysis (GPX/KML format)
7. **Category rankings** — age group, gender, team category leaderboards
8. **Split times persistence** — store checkpoint splits in dedicated table for post-race review

### Low Priority

9. **Heart rate integration** — wearable device data (BPM) alongside GPS
10. **Live streams** — staff video feeds embedded in spectator view
11. **Push notifications** — notify followers when athlete reaches checkpoint or finishes
12. **Historical race replay** — time-scrubbing animation of the race after it ends

---

## 18. Configuration Reference

### Live Server Environment Variables

| Variable                   | Default  | Purpose                              |
| -------------------------- | -------- | ------------------------------------ |
| `LIVE_SECRET`              | —        | Shared secret for internal API auth  |
| `NEXT_PUBLIC_URL`          | —        | Next.js base URL for API calls       |
| `REDIS_URL`                | —        | Redis connection for state backup    |
| `PORT`                     | `3001`   | Live server port                     |

### Configurable Settings (via `live-config` API)

| Setting                   | Default   | Purpose                              |
| ------------------------- | --------- | ------------------------------------ |
| `deviationThresholdM`     | `150`     | Off-route detection distance (m)     |
| `minUpdateFrequencyMs`    | `3000`    | Minimum GPS update interval (ms)     |
| `inactiveTimeoutMs`       | `30000`   | Inactivity timeout (ms)              |
| `maxSpeedKmh`             | `50`      | Anti-cheat max speed (km/h)          |
| `leaderboardBroadcastMs`  | `2000`    | Leaderboard broadcast interval (ms)  |
| `positionBroadcastMs`     | `1000`    | Position broadcast interval (ms)     |

---

## 19. Summary

Phase 3 delivers a **fully functional live race engine** that exceeds the original
specification in several areas (route projection, personal chip time, per-variant starts,
offline sync, anti-cheat). The key architectural deviation — using in-memory state
instead of per-point DB persistence — is a deliberate trade-off that simplifies the hot
path and avoids database bottlenecks during high-frequency GPS updates.

The two items from the original plan that are **not implemented** are:

1. **Privacy mode** (`PUBLIC` / `FRIENDS` / `ORGANIZER_ONLY`) — deferred because no
   friendship system exists in Athlifyr yet. All athletes are visible during the race.

2. **Persistent tracking points** (`TrackingPoint` model) — replaced by volatile
   in-memory state. Final results are persisted; individual GPS points are not. Post-race
   track viewing will require future work (Phase 4).

Everything else from the Phase 3 specification is implemented and operational.
