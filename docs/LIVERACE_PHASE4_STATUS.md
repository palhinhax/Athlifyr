# LiveRace Phase 4 — Status Report

> **Generated**: March 2026
> **Phase**: Results & Post-Race
> **Previous**: Phase 3 — LiveRace Tracking + Leaderboard (✅ Complete)
> **Next**: Phase 5 — Post-MVP Enhancements (Planned)

---

## Executive Summary

**Phase 4 focuses on consolidating the post-race experience**: calculating official
results, publishing final rankings, integrating with the existing `Result` model, and
providing export/audit capabilities for organizers.

Several foundational pieces were already delivered as part of Phase 3:

- The `Result` Prisma model exists with full CRUD API
- Live result persistence (`POST /api/internal/live-results`) upserts results
  idempotently when the race finishes
- The final leaderboard endpoint (`GET /api/events/[id]/final-leaderboard`) serves
  persisted results to spectators
- Finish detection calculates `finishTimeMs` from personal chip time automatically
- The event state machine transitions to `FINISHED` and blocks new sessions

Phase 4 extends this foundation with organizer tools, athlete-facing features, and
operational safeguards.

| Area                                          | Status         |
| --------------------------------------------- | -------------- |
| Official time calculation (finishTimeMs)       | ✅ Complete    |
| Result model integration (auto-persist)        | ✅ Complete    |
| Event FINISHED blocks new sessions             | ✅ Complete    |
| Idempotent result upsert (live server)         | ✅ Complete    |
| Final leaderboard API (public)                 | ✅ Complete    |
| Privacy mode (LiveRaceVisibility)              | ✅ Complete    |
| Registration CSV export                        | ✅ Complete    |
| Reprocessing (admin recalculate results)       | 🔲 Not started |
| Leaderboard freeze per variant                 | 🔲 Not started |
| Category rankings (gender / age group)         | 🔲 Not started |
| Athlete profile — result history + badge       | 🔲 Not started |
| Athlete route replay (basic map)               | 🔲 Not started |
| Organizer results management screen            | 🔲 Not started |
| Results CSV export endpoint                    | 🔲 Not started |
| Paginated results API with filters             | 🔲 Not started |
| DQ / Adjust manual actions                     | 🔲 Not started |
| Audit trail for manual changes                 | 🔲 Not started |
| Privacy enforcement in public results          | 🔲 Not started |

---

## 1. What Is Already Implemented (Phase 3 Deliverables)

### 1.1 Official Time Calculation

The live server calculates `finishTimeMs` automatically when an athlete crosses the
FINISH checkpoint:

```
finishTimeMs = finishTimestamp - personalStartTime
```

- **personalStartTime** is set when the athlete exits the START zone (chip time)
- **finishTimestamp** is set when the athlete crosses the FINISH gate line or enters
  the FINISH checkpoint radius
- Result is in milliseconds, converted to `HH:MM:SS` on persistence

**Implementation**: `live/src/modules/liverace/liverace.service.ts` → `processGpsUpdate()`

### 1.2 Result Model Integration

The `Result` Prisma model is populated automatically at race finish:

```prisma
model Result {
  id               String   @id @default(cuid())
  userId           String
  eventId          String
  variantId        String?
  time             String          // "HH:MM:SS"
  timeSeconds      Int?            // Seconds for sorting
  position         Int?            // Overall rank
  categoryPosition Int?            // Category rank (unused)
  notes            String?         // "DNF" | "DSQ" | null
  isPublic         Boolean  @default(true)
  createdAt        DateTime @default(now())
  updatedAt        DateTime @updatedAt

  @@unique([userId, eventId, variantId])
}
```

**Persistence flow**:

1. Live server calls `persistResults()` → `POST /api/internal/live-results`
2. Next.js upserts each result (idempotent via `@@unique`)
3. Event `liveStatus` updated to `FINISHED`

**Implementation**: `app/api/internal/live-results/route.ts`

### 1.3 Final Leaderboard API

```
GET /api/events/[id]/final-leaderboard
```

- Public endpoint (no auth)
- Returns only `isPublic = true` results
- Ordered by `position ASC, timeSeconds ASC`
- Compatible with `LiveLeaderboard` component format

**Implementation**: `app/api/events/[id]/final-leaderboard/route.ts`

### 1.4 Event FINISHED State

When `liveStatus = FINISHED`:

- No new athlete joins accepted
- No new GPS updates processed
- Live server room destroyed after 60s grace period
- State machine does not allow transition back to LIVE

### 1.5 Privacy Mode

`LiveRaceVisibility` enum on User model: `PUBLIC` | `FRIENDS` | `ORGANIZER_ONLY`

- Enforced in live server leaderboard and position broadcasts
- User setting in Account Settings → Privacy tab

### 1.6 Registration CSV Export

```
GET /api/events/[id]/registrations/export?variant=X&status=Y&search=Z
```

- Auth: Platform admin or organizer (OWNER/ADMIN/FINANCE)
- RFC 4180-compliant CSV with BOM
- 23+ columns (athlete data, payment, check-in, custom fields)

**Implementation**: `app/api/events/[id]/registrations/export/route.ts`

### 1.7 Result CRUD API

```
GET    /api/events/[id]/results     — User's own results
POST   /api/events/[id]/results     — Create result (manual entry)
PUT    /api/events/[id]/results     — Update result
DELETE /api/events/[id]/results     — Delete result
```

- Auth: User-scoped (own results only)
- Creates linked `UserPerformanceEntry` for profile tracking

**Implementation**: `app/api/events/[id]/results/route.ts`

---

## 2. What Needs to Be Implemented (Phase 4 Tasks)

### 2.1 Reprocessing — Admin Recalculate Results

**Purpose**: Allow organizers or platform admins to trigger a full recalculation of
results for a finished event. This is needed when:

- Manual adjustments are made (DQ, time corrections)
- Results need to be recalculated after data corrections
- A bug fix requires retroactive recalculation

**Requirements**:

- Idempotent: running multiple times produces the same result
- Recalculates positions based on current `timeSeconds` values
- Respects DNF/DSQ entries (excluded from position ranking)
- Per-variant ranking (each variant ranked independently)
- Admin-only endpoint

**Proposed endpoint**:

```
POST /api/events/[id]/results/recalculate
Auth: Platform admin or organizer OWNER/ADMIN
```

### 2.2 Leaderboard Freeze per Variant

**Purpose**: After results are finalized, the leaderboard should be "frozen" — positions
are locked and cannot change without explicit recalculation.

**Requirements**:

- Positions assigned by `timeSeconds` ascending per variant
- Tie-breaking rule (MVP): if `timeSeconds` is equal, the athlete who finished
  earlier (`createdAt` or a `finishedAt` timestamp) ranks higher
- Frozen leaderboard served by `GET /api/events/[id]/final-leaderboard`
- Optional: `isFrozen` flag on event to indicate leaderboard is final

### 2.3 Category Rankings (MVP Optional)

**Purpose**: Rank athletes within categories (gender, age group) if profile data exists.

**Requirements**:

- Use existing `User.gender` and `User.dateOfBirth` if available
- Standard age groups: U20, 20-29, 30-39, 40-49, 50-59, 60+
- Populate `Result.categoryPosition` when category data is available
- If data is missing, skip category ranking (no error)
- Category leaderboard filter in final leaderboard API

### 2.4 Athlete Profile — Result History + Badge

**Purpose**: Athletes see their race history in their profile.

**Requirements**:

- "My Results" section in athlete profile
- List of past events with: event name, variant, time, position, date
- "FINISHED" badge on completed events
- Link to event page + detailed result
- Integration with existing `UserPerformanceEntry` for training metrics

### 2.5 Athlete Route Replay (Basic Map)

**Purpose**: Post-race, athletes can view their GPS track on a map.

**Current limitation**: GPS tracking points are not persisted in Phase 3 (in-memory
only). Options for Phase 4:

- Option A: Persist final GPS track summary (simplified polyline) before room teardown
- Option B: Export track from live server to storage before room destruction
- Option C: Allow GPX export during race (athlete downloads their own track)

**MVP scope**: Basic route display on the event page (using route data from
`EventRoute.routePoints`) with start/finish markers. Full athlete-specific replay
requires track persistence (future work).

### 2.6 Organizer Results Management Screen

**Purpose**: A "Results" tab in the organizer dashboard for managing final results.

**Requirements**:

- Table view: position, bib, name, time, status, variant
- Filter by variant
- Search by name/bib
- Actions: Mark DQ, adjust time, edit notes
- "Recalculate Positions" button
- "Export CSV" button per variant

### 2.7 Results CSV Export Endpoint

**Purpose**: Dedicated endpoint for exporting race results (distinct from registration
export).

**Proposed endpoint**:

```
GET /api/events/[id]/results/export?variantId=...
Auth: Platform admin or organizer OWNER/ADMIN
```

**CSV columns**: Position, Bib Number, Name, Time, Status (FINISHED/DNF/DSQ),
Start Time, Finish Time, Variant, Category Position

### 2.8 Paginated Results API with Filters

**Purpose**: Public API for viewing event results (spectators, embedding, etc.).

**Proposed endpoint**:

```
GET /api/events/[id]/results/public?variantId=...&page=1&limit=50&status=FINISHED
Auth: Public (no auth required)
```

**Response**: Paginated list with total count, sorted by position.

### 2.9 DQ / Adjust Manual Actions

**Purpose**: Organizer can disqualify athletes or adjust results manually.

**Requirements**:

- Mark athlete as DISQUALIFIED (sets `notes = "DSQ"`, removes from ranking)
- Mark athlete as DNF (Did Not Finish)
- Adjust time (correct timing errors)
- Adjust bib number (fix dorsal assignment errors)
- All manual changes trigger audit log entry
- Recalculate positions after manual change

### 2.10 Audit Trail for Manual Changes

**Purpose**: Track all manual modifications to results for accountability.

**Requirements**:

- Log: who changed, what changed, when, reason/notes
- Store in database (new `ResultAuditLog` model or JSON field)
- Viewable by organizer and platform admin
- Cannot be deleted or modified
- Covers: DQ, time adjustment, position override, notes edit

**Proposed model**:

```prisma
model ResultAuditLog {
  id        String   @id @default(cuid())
  resultId  String
  eventId   String
  userId    String   // Who made the change
  action    String   // "DQ" | "TIME_ADJUST" | "NOTE_EDIT" | "POSITION_OVERRIDE"
  before    Json     // Previous values
  after     Json     // New values
  reason    String?  // Organizer-provided reason
  createdAt DateTime @default(now())

  result    Result   @relation(fields: [resultId], references: [id], onDelete: Cascade)
  event     Event    @relation(fields: [eventId], references: [id], onDelete: Cascade)
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([resultId])
  @@index([eventId])
}
```

### 2.11 Privacy Enforcement in Public Results

**Purpose**: Ensure that athletes with `LiveRaceVisibility = ORGANIZER_ONLY` are not
displayed in public result listings.

**Requirements**:

- Public leaderboard and results endpoints filter by `isPublic` flag on Result
- When `LiveRaceVisibility = ORGANIZER_ONLY`, set `Result.isPublic = false`
- Organizer can see all results regardless of privacy setting
- Athlete always sees their own results

**Note**: `isPublic` flag already exists on Result model. The missing piece is
syncing it with the user's `LiveRaceVisibility` preference during result persistence.

---

## 3. Architecture for Phase 4

### Data Flow

```
Race FINISHED
    │
    ▼
Live Server: persistResults() ───────►  POST /api/internal/live-results
                                              │
                                              ▼
                                        Result.upsert() per athlete
                                        Event.liveStatus = FINISHED
                                              │
    ┌─────────────────────────────────────────┘
    ▼
Phase 4 additions:
    │
    ├── Recalculate endpoint ─► Re-rank positions per variant
    ├── Results export ────────► CSV download per variant
    ├── Public results API ────► Paginated + filtered listing
    ├── Organizer UI ──────────► Manage + DQ + adjust actions
    ├── Audit trail ───────────► Log every manual change
    └── Athlete profile ───────► History + badge + replay
```

### Existing Files to Extend

| File                                            | Change                                    |
| ----------------------------------------------- | ----------------------------------------- |
| `app/api/events/[id]/results/route.ts`          | Add organizer-level access for management |
| `app/api/events/[id]/final-leaderboard/route.ts`| Add variant filter, category filter       |
| `app/api/internal/live-results/route.ts`        | Sync privacy flag during persistence      |
| `lib/csv-export.ts`                             | Add results export filename builder       |

### New Files to Create

| File                                                                | Purpose                         |
| ------------------------------------------------------------------- | ------------------------------- |
| `app/api/events/[id]/results/recalculate/route.ts`                  | Admin recalculation endpoint    |
| `app/api/events/[id]/results/export/route.ts`                       | Results CSV export              |
| `app/api/events/[id]/results/public/route.ts`                       | Paginated public results        |
| `app/[locale]/events/[slug]/manage/_components/tab-results.tsx`     | Organizer results management UI |
| `prisma/migrations/xxxx_result_audit_log/migration.sql`             | Audit log table                 |

---

## 4. Acceptance Criteria (from Issue)

| Criterion                                                  | Status         | Notes                                               |
| ---------------------------------------------------------- | -------------- | --------------------------------------------------- |
| ✔ Finish generates consistent official time                | ✅ Complete    | `finishTimeMs` from personalStartTime               |
| ✔ Result (existing model) is auto-populated                | ✅ Complete    | Upsert via `/api/internal/live-results`              |
| ✔ Final leaderboard per variant is correct and frozen      | 🔲 Partial     | Leaderboard exists; freeze + tie-breaking needed     |
| ✔ Athlete sees result in profile/history                   | 🔲 Not started | Profile integration pending                          |
| ✔ Organizer exports final CSV                              | 🔲 Not started | Registration export exists; results export needed    |
| ✔ Idempotent reprocessing exists                           | 🔲 Not started | Live persistence is idempotent; admin recalc needed  |
| ✔ Manual changes are audited                               | 🔲 Not started | No audit log model yet                               |

---

## 5. Task Breakdown

Each task below has a dedicated Azure DevOps-ready specification in
`docs/liverace-phase4-tasks/`:

| #  | Task                                         | File                    | Priority | Depends On |
| -- | -------------------------------------------- | ----------------------- | -------- | ---------- |
| 01 | Reprocessing — Recalculate Results           | `TASK-01-recalculate.md`| High     | —          |
| 02 | Leaderboard Freeze per Variant               | `TASK-02-leaderboard-freeze.md` | High | 01   |
| 03 | Results CSV Export                            | `TASK-03-results-export.md` | High | —          |
| 04 | Paginated Public Results API                  | `TASK-04-public-results-api.md` | High | —      |
| 05 | DQ / Adjust Manual Actions                   | `TASK-05-dq-adjust.md`  | High     | 01         |
| 06 | Audit Trail for Manual Changes               | `TASK-06-audit-trail.md`| High     | 05         |
| 07 | Privacy Enforcement in Public Results        | `TASK-07-privacy-results.md` | Medium | —       |
| 08 | Organizer Results Management Screen          | `TASK-08-organizer-results-ui.md` | Medium | 03,04,05 |
| 09 | Athlete Profile — Result History + Badge     | `TASK-09-athlete-profile.md` | Medium | —       |
| 10 | Category Rankings (Gender / Age Group)       | `TASK-10-category-rankings.md` | Low | 01       |
| 11 | Athlete Route Replay (Basic Map)             | `TASK-11-route-replay.md` | Low    | —          |
| 12 | Social Sharing of Results                    | `TASK-12-social-sharing.md` | Low  | 09         |

---

## 6. Key Files Reference

### Existing (Phase 3)

| File                                              | Purpose                          |
| ------------------------------------------------- | -------------------------------- |
| `app/api/events/[id]/results/route.ts`            | Result CRUD (user-scoped)        |
| `app/api/events/[id]/final-leaderboard/route.ts`  | Public final leaderboard         |
| `app/api/internal/live-results/route.ts`           | Live server result persistence   |
| `app/api/events/[id]/registrations/export/route.ts`| Registration CSV export         |
| `lib/csv-export.ts`                               | CSV utilities (RFC 4180)         |
| `live/src/modules/liverace/liverace.service.ts`   | Race engine + finish detection   |
| `live/src/modules/liverace/liverace.api.ts`       | Live → Next.js HTTP client       |

### Prisma Schema

| Model              | Phase 4 Relevance                      |
| ------------------ | -------------------------------------- |
| `Result`           | Core results model (already exists)    |
| `Event`            | `liveStatus`, `hasLiveRace` flags      |
| `Registration`     | `bibNumber`, `checkedInAt`             |
| `EventVariant`     | Per-variant result grouping            |
| `User`             | `gender`, `dateOfBirth` for categories |
| `ResultAuditLog`   | **New** — audit trail (to create)      |

---

## 7. Summary

Phase 4 builds on a solid Phase 3 foundation. The core result calculation and
persistence pipeline is operational. The remaining work focuses on:

1. **Operational tools** — recalculation, DQ/adjust, audit trail
2. **Export capabilities** — results-specific CSV export
3. **Public access** — paginated results API, privacy enforcement
4. **User experience** — athlete profile history, organizer results UI
5. **Optional enhancements** — category rankings, route replay, social sharing

The highest-priority items (Tasks 01–06) form the minimum viable Phase 4 delivery.
Tasks 07–12 can be scheduled independently based on business priorities.
