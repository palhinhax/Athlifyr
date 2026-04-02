---
name: live-race-specialist
description: >
  Deep specialist audit of the Live Race real-time tracking system — tests all three personas
  (spectator, athlete, organizer), validates state machine transitions, WebSocket events,
  readiness checks, GPS processing, route engine, offline sync, privacy filtering, leaderboard
  ranking, and presentation pages. Use this skill whenever the user asks to: test live race,
  audit live race, check what's missing in live race, validate the live race feature, QA the
  real-time tracking, review the live server, check WebSocket integration, or anything related
  to ensuring the Live Race feature works correctly end-to-end.
---

# Live Race Specialist

You are a deep specialist in the Athlifyr Live Race system — the real-time race tracking feature
that connects athletes (GPS tracking via mobile), spectators (live leaderboard via web), and
organizers (race control panel). Your job is to audit, test, and identify gaps across the entire
feature stack.

## Why this matters

Live Race is the flagship differentiator of Athlifyr. A race day has zero margin for error —
thousands of spectators watching, athletes depending on GPS accuracy, and organizers managing
chaos in real time. Any bug, missing state, or broken flow directly impacts the event experience
and Athlifyr's reputation.

## Architecture overview

The Live Race spans three codebases and two servers:

| Layer            | Technology          | Location                                                        |
| ---------------- | ------------------- | --------------------------------------------------------------- |
| **Live Server**  | Fastify + Socket.io | `/live/src/modules/liverace/`                                   |
| **Web App**      | Next.js + React     | `/components/live-*.tsx`, `/app/api/events/[id]/live-*`         |
| **Mobile App**   | React Native (Expo) | `/mobile/src/hooks/useLiveRace.ts`, `/mobile/app/live-race.tsx` |
| **Shared Hook**  | React (web)         | `/hooks/use-live-race.ts`                                       |
| **Route Engine** | Pure TypeScript     | `/live/src/modules/liverace/route-engine.ts`                    |
| **Translations** | next-intl           | `/messages/{locale}/live-race.json`                             |

### State Machine

```
SCHEDULED → CHECK_IN_OPEN → WARMUP → LIVE ↔ PAUSED → FINISHED
                                                    → CANCELLED (from any)
```

### WebSocket Events

**Client → Server:** `liverace:join_athlete`, `liverace:join_spectator`, `liverace:leave`, `liverace:gps_update`, `liverace:gps_batch`

**Server → Client:** `liverace:joined`, `liverace:status_changed`, `liverace:variant_started`, `liverace:leaderboard`, `liverace:positions`, `liverace:checkpoint_reached`, `liverace:athlete_finished`, `liverace:athlete_started`, `liverace:athlete_status`, `liverace:spectator_count`, `liverace:sync_progress`, `liverace:sync_complete`

---

## Audit methodology

Run the audit in phases. Each phase targets a different layer. Use subagents in parallel when
checking independent areas.

### Phase 1 — State Machine & API Routes

Read and validate these files:

- `/app/api/events/[id]/live-control/route.ts` — all state transitions
- `/app/api/events/[id]/live-readiness/route.ts` — readiness report
- `/app/api/events/[id]/live-status/route.ts` — status + connected count
- `/app/api/events/[id]/live-start/route.ts` — spectator activation
- `/app/api/events/[id]/live-time/route.ts` — time sync
- `/app/api/events/[id]/final-leaderboard/route.ts` — persisted results

**Check for:**

1. **Every valid transition is implemented:** SCHEDULED→CHECK_IN_OPEN, CHECK_IN_OPEN→WARMUP, WARMUP→LIVE, LIVE→PAUSED, PAUSED→LIVE, LIVE→FINISHED, PAUSED→FINISHED, any→CANCELLED
2. **Invalid transitions are rejected** with proper error codes
3. **Authorization:** only organizers (manage_event or manage_liverace permission) can trigger transitions
4. **Readiness checks enforced** before checkin, warmup, and start — not just at readiness endpoint
5. **Race condition protection:** concurrent transition requests handled (Redis locking or DB-level)
6. **Error responses** use consistent format with meaningful codes

### Phase 2 — Live Server (Socket.io)

Read and validate:

- `/live/src/modules/liverace/liverace.service.ts` — core service (~1,671 lines)
- `/live/src/modules/liverace/liverace.handlers.ts` — Socket.io handlers
- `/live/src/modules/liverace/liverace.routes.ts` — REST endpoints
- `/live/src/modules/liverace/liverace.types.ts` — type definitions
- `/live/src/modules/liverace/liverace.api.ts` — API client
- `/live/src/plugins/socket.ts` — Socket.io setup

**Check for:**

1. **Room lifecycle:** room created on WARMUP, destroyed 60s after FINISHED/CANCELLED
2. **GPS processing only in LIVE state** — WARMUP accepts but doesn't rank
3. **Leaderboard broadcast interval** configurable and reasonable (2-5s)
4. **Spectator count** updated and broadcast periodically
5. **Athlete disconnect handling:** state preserved, reconnect works
6. **Memory management:** rooms cleaned up, no leaks on long-running events
7. **Error handling in handlers:** malformed GPS data, invalid event IDs, expired tokens
8. **Batch sync:** `gps_batch` processes chronologically, deduplicates, reports progress
9. **Privacy filtering:** positions filtered by athlete visibility setting before broadcast to spectators
10. **Multi-variant support:** separate leaderboards per variant, variant-specific start times

### Phase 3 — Route Engine

Read: `/live/src/modules/liverace/route-engine.ts` (~882 lines)

**Check for:**

1. **Haversine distance** accuracy (Earth radius = 6,371km)
2. **Snap-to-route** (point projection onto nearest segment)
3. **Checkpoint detection** — circular zones with configurable radius
4. **Start/Finish gate detection** — perpendicular line crossing
5. **Anti-cheat validation:**
   - Max speed threshold (default 100 km/h)
   - GPS accuracy threshold (default ≤50m)
   - Timestamp validation (±60 min from server time)
   - Distance plausibility between consecutive points
6. **OFF_ROUTE detection** — deviation threshold, returns to ACTIVE when back on route
7. **Edge cases:**
   - Route with very short segments (<0.01m)
   - GPS point exactly on a checkpoint center
   - Athlete going backwards on route
   - Route that crosses itself (figure-8, loop)
   - Multiple checkpoints very close together

### Phase 4 — Spectator Experience (Web Components)

Read and validate:

- `/components/live-race-section.tsx` — main container
- `/components/live-leaderboard.tsx` — ranking table
- `/components/live-event-feed.tsx` — event timeline
- `/components/live-countdown.tsx` — countdown timer
- `/components/live-race-checkin-banner.tsx` — check-in banner
- `/components/live-race-visibility-settings.tsx` — privacy controls
- `/hooks/use-live-race.ts` — WebSocket hook (~490 lines)

**Check for:**

1. **All states render correctly:**
   - SCHEDULED — no live section or minimal teaser
   - CHECK_IN_OPEN — banner + countdown
   - WARMUP — countdown + "warming up" message
   - LIVE — leaderboard + feed + spectator count (red pulsing badge)
   - PAUSED — frozen leaderboard + "paused" message
   - FINISHED — final results, no WebSocket needed
   - CANCELLED — appropriate message
2. **Leaderboard columns:** position, athlete (avatar+name+bib), distance, gap, progress bar, status badge, finish time
3. **Leaderboard filters:** All / Male / Female / Age group / Variant
4. **Feed items:** checkpoint passes (with split time), finishes (with position + time), timestamps
5. **Countdown:** synced via server time offset, HH:MM:SS format
6. **Spectator count:** visible with eye icon
7. **Reconnection UX:** "Connection lost, reconnecting..." message
8. **Responsive design:** works on mobile browsers (spectators often use phones)
9. **Loading states:** skeleton/spinner while WebSocket connects
10. **Empty states:** no athletes yet, no events in feed

### Phase 5 — Organizer Panel

Read and validate:

- `/app/[locale]/events/[slug]/manage/_components/tab-liverace.tsx`
- `/app/[locale]/events/[slug]/manage/_components/liverace-controls.tsx`
- `/app/[locale]/events/[slug]/manage/_components/liverace-readiness.tsx`

**Check for:**

1. **Readiness checks display:**
   - Red errors: hasLiveRace, variants exist, route defined, START checkpoint, FINISH checkpoint, start time
   - Yellow warnings: intermediate checkpoints
   - Green: "Ready to start"
2. **Control buttons** match current state (see state machine table)
3. **Confirmation dialogs** for destructive actions (finish, cancel)
4. **Real-time metrics:** connected athletes, spectator count, server status, last update time
5. **Polling interval** reasonable (every 10s)
6. **Link to public page** for organizer to preview spectator view
7. **Error feedback** when Live Service is unreachable
8. **Disabled states** when readiness checks fail

### Phase 6 — Internal API Routes

Read and validate:

- `/app/api/internal/live-config/route.ts` — event config for Live Server
- `/app/api/internal/live-status/route.ts` — status updates from Live Server
- `/app/api/internal/live-results/route.ts` — persist final results
- `/app/api/internal/live-auth/verify/route.ts` — athlete verification
- `/app/api/internal/live-friends/route.ts` — friend list for visibility
- `/app/api/auth/live-token/route.ts` — JWT issuance

**Check for:**

1. **Internal routes protected** — API key or secret header, not publicly accessible
2. **JWT token:** short-lived (1-4h), contains userId + email + role
3. **Config endpoint** returns complete data: route points, checkpoints, variants, settings
4. **Results persistence:** stores rank, finish time, status, checkpoint splits per athlete
5. **Athlete verification:** checks registration exists and is confirmed
6. **Friend list:** returns IDs for visibility filtering

### Phase 7 — Translations

Read all locale files:

- `/messages/pt/live-race.json`
- `/messages/en/live-race.json`
- `/messages/es/live-race.json`
- `/messages/fr/live-race.json`
- `/messages/de/live-race.json`
- `/messages/it/live-race.json`

**Check for:**

1. **All keys present** in every locale (compare against `en` as baseline)
2. **No hardcoded strings** in components — everything uses `useTranslations('live-race')`
3. **Dynamic values** use ICU message format correctly (plurals, numbers, dates)
4. **Status labels** translated for all states
5. **Error messages** translated

### Phase 8 — Tests Coverage

Check existing tests:

- `/__tests__/api/auth/live-token.test.ts`
- `/__tests__/api/events/live-control.test.ts`
- `/__tests__/api/events/live-readiness.test.ts`
- `/__tests__/api/events/live-start.test.ts`
- `/__tests__/api/events/live-status.test.ts`
- `/__tests__/api/events/live-time.test.ts`
- `/__tests__/api/internal/live-auth-verify.test.ts`
- `/__tests__/api/internal/live-config.test.ts`
- `/__tests__/api/internal/live-friends.test.ts`
- `/__tests__/api/internal/live-results.test.ts`
- `/__tests__/api/internal/live-status.test.ts`
- `/live/src/modules/liverace/__tests__/route-engine.test.ts`

**Check for:**

1. **Happy path coverage** for each API route
2. **Authorization tests** — unauthenticated, wrong role, non-organizer
3. **Invalid state transitions** tested
4. **Readiness check failures** tested
5. **Route engine edge cases** tested (short segments, crossing routes, anti-cheat triggers)
6. **Missing test files** — any routes without tests?

### Phase 9 — Mobile Integration

Read:

- `/mobile/src/hooks/useLiveRace.ts`
- `/mobile/app/live-race.tsx`
- `/mobile/src/lib/live.ts`

**Check for:**

1. **Offline buffering:** GPS points stored locally (up to 5,000), auto-sync on reconnect
2. **HUD metrics:** elapsed time, distance, pace, speed, elevation, altitude, progress, checkpoints
3. **Connection indicators:** connected/disconnected/syncing status
4. **Map integration:** Mapbox with route polyline, athlete position, other athletes, checkpoints
5. **Mini leaderboard:** bottom sheet with own position highlighted
6. **Background GPS:** foreground service for continuous tracking
7. **Token refresh:** JWT renewed before expiry
8. **Battery optimization:** GPS interval balanced with accuracy needs

---

## Output format

Structure your findings as follows:

```markdown
# Live Race Audit Report

## Executive Summary

[2-3 sentences: overall health, critical issues count, top priority]

## Critical Issues (blocks race day)

- **[AREA] Issue title** — description, file:line, impact, suggested fix

## Important Issues (degrades experience)

- **[AREA] Issue title** — description, file:line, impact, suggested fix

## Minor Issues (polish)

- **[AREA] Issue title** — description, file:line, impact, suggested fix

## Missing Features (spec vs implementation gaps)

- **[FEATURE]** — what the spec describes vs what exists, effort estimate (S/M/L)

## State Machine Validation

| Transition                | API | Live Server | UI  | Tests | Status         |
| ------------------------- | --- | ----------- | --- | ----- | -------------- |
| SCHEDULED → CHECK_IN_OPEN | ... | ...         | ... | ...   | OK/MISSING/BUG |

## Translation Coverage

| Key | pt  | en  | es  | fr  | de  | it  |
| --- | --- | --- | --- | --- | --- | --- |

## Test Coverage Summary

| Area | Tests | Coverage | Gaps |
| ---- | ----- | -------- | ---- |

## Recommendations (prioritized)

1. [Priority 1] ...
2. [Priority 2] ...
```

### Severity definitions

- **Critical:** Would cause a race day failure — data loss, crash, wrong results, broken state transition, security vulnerability
- **Important:** Noticeably degrades the experience — missing loading state, wrong translation, stale data, confusing UX
- **Minor:** Polish item — alignment, naming inconsistency, minor optimization, nice-to-have

---

## Execution strategy

For maximum speed, run phases in parallel using subagents:

**Batch 1 (parallel):**

- Phase 1 (State Machine & API Routes)
- Phase 2 (Live Server)
- Phase 3 (Route Engine)

**Batch 2 (parallel):**

- Phase 4 (Spectator Components)
- Phase 5 (Organizer Panel)
- Phase 6 (Internal APIs)

**Batch 3 (parallel):**

- Phase 7 (Translations)
- Phase 8 (Tests)
- Phase 9 (Mobile)

Then synthesize all findings into the final report.

---

## Common pitfalls to watch for

These are patterns that frequently cause issues in real-time systems like Live Race:

1. **State desync** — DB says LIVE but Live Server room doesn't exist (server restarted)
2. **Zombie rooms** — room stays in memory after FINISHED/CANCELLED without cleanup
3. **Race condition on finish** — two athletes cross finish line at same millisecond
4. **Clock drift** — countdown shows negative time if server/client clocks differ
5. **WebSocket reconnection storm** — all spectators reconnect simultaneously after server blip
6. **Missing error boundaries** — one bad GPS point crashes the entire leaderboard render
7. **Translation key mismatch** — component uses key that doesn't exist in locale file
8. **Stale JWT** — token expires mid-race, athlete gets disconnected without clear UX
9. **Privacy leak** — athlete set to ORGANIZER_ONLY but position still sent to spectators
10. **Final results not persisted** — organizer clicks FINISH but results endpoint fails silently
