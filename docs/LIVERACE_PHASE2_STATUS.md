# LiveRace Phase 2 — Status Report

> **Generated**: March 2026
> **Phase**: Check-in & Access Control
> **Previous**: Phase 1 — Registrations & Payments (✅ Complete)
> **Next**: Phase 3 — LiveRace (Tracking + Leaderboard)

---

## Executive Summary

**Phase 2 is fully implemented and operational.** All core deliverables — check-in
window, QR code tickets, staff tools, self-service check-in, race-start gating, and
the live control state machine — are built, tested, and integrated. The implementation
exceeds the original spec in several areas (ticket revocation, live-readiness
validation, multi-role authorization).

| Area                           | Status         |
| ------------------------------ | -------------- |
| Check-in window configuration  | ✅ Complete    |
| Check-in API (staff)           | ✅ Complete    |
| Check-in API (self-service)    | ✅ Complete    |
| QR code ticket generation      | ✅ Complete    |
| QR code ticket verification    | ✅ Complete    |
| Ticket revocation (nonce)      | ✅ Complete    |
| Staff check-in UI (dashboard)  | ✅ Complete    |
| Race-start gating              | ✅ Complete    |
| Live control state machine     | ✅ Complete    |
| Live readiness validation      | ✅ Complete    |
| Test coverage                  | ✅ 99 tests   |

---

## 1. Database Schema

All Phase 2 fields are present in the Prisma schema and migrated.

### Event Model

| Field             | Type              | Default     | Purpose                            |
| ----------------- | ----------------- | ----------- | ---------------------------------- |
| `hasLiveRace`     | `Boolean`         | `false`     | Enables LiveRace features (admin)  |
| `checkInOpensAt`  | `DateTime?`       | `null`      | Start of check-in window           |
| `checkInClosesAt` | `DateTime?`       | `null`      | End of check-in window             |
| `liveStatus`      | `EventLiveStatus` | `SCHEDULED` | Current race lifecycle state       |

### Registration Model

| Field          | Type               | Default   | Purpose                          |
| -------------- | ------------------ | --------- | -------------------------------- |
| `status`       | `RegistrationStatus` | `PENDING` | Payment/confirmation status    |
| `checkedInAt`  | `DateTime?`        | `null`    | Timestamp of check-in            |
| `ticketNonce`  | `String`           | `cuid()`  | Rotated on ticket revocation     |
| `bibNumber`    | `String?`          | `null`    | Dorsal number                    |

### EventLiveStatus Enum

```
SCHEDULED → CHECK_IN_OPEN → WARMUP → LIVE → PAUSED → LIVE → FINISHED
                                                  └──────────┘
Any state → CANCELLED
```

States: `SCHEDULED`, `CHECK_IN_OPEN`, `WARMUP`, `LIVE`, `PAUSED`, `FINISHED`, `CANCELLED`

### RegistrationStatus Enum

States: `PENDING`, `CONFIRMED`, `CANCELLED`, `REFUNDED`

---

## 2. Check-in Window

**Implementation**: `lib/checkin-gating.ts` → `getCheckInWindowStatus()`

The check-in window is a configurable time range (`checkInOpensAt` / `checkInClosesAt`)
set by the organizer via the event management dashboard.

### Window States

| State            | Condition                              | Effect                                    |
| ---------------- | -------------------------------------- | ----------------------------------------- |
| `NO_WINDOW_SET`  | Both fields are `null`                 | Check-in allowed anytime (no time gate)   |
| `NOT_OPEN_YET`   | `now < checkInOpensAt`                 | Check-in blocked for staff; allowed for admin/organizer |
| `OPEN`           | Within window boundaries               | Check-in allowed for all authorized roles |
| `CLOSED`         | `now > checkInClosesAt`                | Check-in blocked for staff; allowed for admin/organizer |

### Configuration UI

- **Location**: Event management dashboard → Config tab
- **Component**: `app/[locale]/events/[slug]/manage/_components/tab-config.tsx`
- **Fields**: Two `datetime-local` inputs for open/close times
- **Admin panel**: Also configurable at `app/[locale]/admin/events/[id]/page.tsx`

---

## 3. Check-in Endpoints

### 3.1 Staff Check-in (Toggle)

```
PATCH /api/events/[id]/registrations/[registrationId]/checkin
```

- **File**: `app/api/events/[id]/registrations/[registrationId]/checkin/route.ts`
- **Body**: `{ checkedIn: boolean }`
- **Response**: `{ checkedInAt: string | null }`

**Validations:**

1. Authentication required (401)
2. Event must exist (404)
3. Event must not be cancelled (422)
4. User must be platform admin, event organizer (OWNER/ADMIN), or staff member (403)
5. Registration must exist (404)
6. Registration must be `CONFIRMED` (422)
7. Check-in window enforced for staff role — admin/organizer bypass (422)
8. Idempotent: no DB write if already in desired state

**Audit logging**: Console log with user email, event ID, registration ID, action.

### 3.2 Athlete Self-Service Check-in

```
POST /api/registrations/[registrationId]/check-in
```

- **File**: `app/api/registrations/[registrationId]/check-in/route.ts`
- **Body**: none (action is implicit)
- **Response**: `{ checkedInAt: string, alreadyCheckedIn: boolean }`

**Validations:**

1. Authentication required (401)
2. Registration must exist (404)
3. User must own the registration or be a guest matching user email (403)
4. Registration must be `CONFIRMED` (422)
5. Event must not be cancelled (422)
6. Check-in window must be open (422)
7. Idempotent: returns success if already checked in

### 3.3 QR Code Ticket Verification + Auto Check-in

```
POST /api/events/[id]/registration/verify-ticket
```

- **File**: `app/api/events/[id]/registration/verify-ticket/route.ts`
- **Body**: `{ token: string }`
- **Response**: `{ valid: boolean, alreadyCheckedIn: boolean, checkedInAt: string, registration: {...} }`

**Validations:**

1. Authentication required — staff/admin/organizer (401/403)
2. JWT token signature verification
3. Token must belong to correct event
4. Ticket nonce must match DB (detects revoked tickets)
5. Performs automatic check-in if not already done

---

## 4. QR Code Ticket System

### Ticket Generation

```
GET /api/events/[id]/registration/ticket
```

- **File**: `app/api/events/[id]/registration/ticket/route.ts`
- **Token format**: JWT signed with `NEXTAUTH_SECRET`
- **Payload**: `registrationId`, `userId`, `eventId`, `variantId`, `nonce`, `type`
- **JWT option**: `noTimestamp: true` ensures QR code is always identical (idempotent generation)
- **Supports**: Direct registrations and guest registrations

### QR Code Display

- **Component**: `components/event-ticket-modal.tsx`
- **Library**: `qrcode` (250×250px, error correction level "H")
- **Features**: Downloadable PNG, event details, participant name, dorsal number, check-in status badge

### Ticket Revocation

```
PATCH /api/events/[id]/registrations/[registrationId]/revoke-ticket
```

- Rotates `Registration.ticketNonce` to a new `cuid()`
- All previously generated QR codes become invalid
- Athlete must regenerate their ticket (new QR code)

---

## 5. Race-Start Gating

**Implementation**: `lib/checkin-gating.ts` → `validateRaceStartGating()`

### Gate Conditions (ALL must pass)

| # | Gate                               | Blocks when                             |
| - | ---------------------------------- | --------------------------------------- |
| 1 | Registration status is `CONFIRMED` | `PENDING`, `CANCELLED`, or `REFUNDED`   |
| 2 | Check-in completed                 | `checkedInAt == null`                   |
| 3 | Event is `LIVE`                    | Any status other than `LIVE`            |

### Race Gate API

```
GET /api/registrations/[registrationId]/race-gate
```

- **File**: `app/api/registrations/[registrationId]/race-gate/route.ts`
- **Response**: `{ allowed: boolean, reason?: string, gates: { isConfirmed, isCheckedIn, isEventLive } }`

**Additional validations:**

- Event must have `hasLiveRace = true` (422)
- Event must not be cancelled (422)
- User must own the registration or match guest email (403)

---

## 6. Live Control State Machine

### Commands & Transitions

```
POST /api/events/[id]/live-control
```

- **File**: `app/api/events/[id]/live-control/route.ts`
- **Body**: `{ command: string }`

| Command    | From States               | To State        |
| ---------- | ------------------------- | --------------- |
| `checkin`  | `SCHEDULED`               | `CHECK_IN_OPEN` |
| `warmup`   | `CHECK_IN_OPEN`           | `WARMUP`        |
| `start`    | `WARMUP`                  | `LIVE`          |
| `pause`    | `LIVE`                    | `PAUSED`        |
| `resume`   | `PAUSED`                  | `LIVE`          |
| `finish`   | `LIVE`, `PAUSED`          | `FINISHED`      |
| `cancel`   | Any (except `CANCELLED`)  | `CANCELLED`     |

Invalid transitions return 409 Conflict.

### Readiness Validation

State-advancing commands (`checkin`, `warmup`, `start`) enforce variant readiness:

- **Route**: ≥50 points with valid coordinates (`-90 ≤ lat ≤ 90`, `-180 ≤ lng ≤ 180`)
- **Checkpoints**: START and FINISH checkpoints, no duplicate orders, FINISH has highest order
- **Start time**: `variant.startTime` must be set
- Errors return `422 LIVE_RACE_NOT_READY` with details

Non-advancing commands (`pause`, `resume`, `finish`) skip readiness checks.

### Live Server Integration

On each state transition, the API notifies the live server via internal HTTP
so connected clients receive real-time status updates via Socket.io.

### Readiness Report

```
GET /api/events/[id]/live-readiness
```

Returns a detailed per-variant validation report with errors and warnings for the
organizer dashboard.

### Live Status Query

```
GET /api/events/[id]/live-status
```

Returns current `liveStatus` plus connected participant count (from live server,
with graceful fallback to DB-only).

---

## 7. Staff UI (Management Dashboard)

### Registrations Tab (`tab-inscritos.tsx`)

- **Check-in toggle button**: ScanLine icon per registration row
- **Check-in filter**: Filter by checked-in / not checked-in
- **Status indicators**: Green check (checked in), clock (pending), X (cancelled)
- **Optimistic UI**: Instant toggle with count update, reverts on error
- **Toast notifications**: Success/error messages for check-in actions
- **Columns**: Name, bib number, email, variant, status, check-in, amount (all toggleable)

### Config Tab (`tab-config.tsx`)

- Check-in window date/time inputs
- Refund deadline configuration

### LiveRace Tab (`tab-liverace.tsx`)

- Current `liveStatus` badge (color-coded per state)
- Variant readiness checklist
- Control buttons for state transitions (play/pause/stop)

---

## 8. Athlete UI

### Event Ticket Modal (`event-ticket-modal.tsx`)

- Full ticket display with event details
- QR code for staff scanning
- Download ticket as PNG
- Check-in status badge when already checked in

### My Registrations

- Check-in button (active only within window)
- Visual states: open / closed / already checked in

---

## 9. Test Coverage

**Total: 99 test cases across 6 test files**

| Test File                             | Tests | Scope                                  |
| ------------------------------------- | ----- | -------------------------------------- |
| `events/registrations/checkin.test.ts` | 17   | Staff check-in endpoint                |
| `registrations/check-in.test.ts`       | 16   | Self-service check-in endpoint         |
| `registrations/race-gate.test.ts`      | 13   | Race-start gating endpoint             |
| `lib/checkin-gating.test.ts`           | 17   | Window status & gating logic           |
| `events/live-control.test.ts`          | 18   | Live state machine & readiness         |
| `events/live-readiness.test.ts`        | 18   | Variant readiness validation           |

### Coverage Areas

- ✅ Authentication (401) for all endpoints
- ✅ Authorization: admin, organizer (OWNER/ADMIN/VIEWER), staff, athlete roles
- ✅ Check-in window enforcement and bypass logic
- ✅ Registration status validation (`CONFIRMED` only)
- ✅ Idempotent operations (no duplicate writes)
- ✅ Event cancellation blocking
- ✅ LiveRace flag validation
- ✅ State transition validation (valid and invalid)
- ✅ Route readiness (point count, coordinates, checkpoints)
- ✅ Guest registration ownership

---

## 10. Phase 2 Acceptance Criteria — Validation

| Acceptance Criterion                                          | Status | Implementation                                                        |
| ------------------------------------------------------------- | ------ | --------------------------------------------------------------------- |
| Check-in only works for `CONFIRMED` within window             | ✅     | Both staff and self-service endpoints enforce status + window          |
| QR scan + manual fallback work                                | ✅     | `verify-ticket` (QR) + `checkin` (manual toggle) endpoints            |
| UI shows correct states (open/closed/already checked-in)      | ✅     | Dashboard table, ticket modal, badge indicators                       |
| Start race blocked without check-in (real gating)             | ✅     | `race-gate` endpoint + `validateRaceStartGating()` library            |
| Tests cover window, status, and permissions                   | ✅     | 99 tests across 6 files covering all branches                         |

---

## 11. Deviations from Original Spec

The original issue described endpoints at:

- `PATCH /api/registrations/[id]/check-in` — Implemented as `POST /api/registrations/[registrationId]/check-in` (self-service) and `PATCH /api/events/[id]/registrations/[registrationId]/checkin` (staff)
- `PATCH /api/registrations/[id]/cancel` — Cancellation is handled through existing registration management flows

### Features Added Beyond Original Spec

1. **Ticket revocation** (nonce rotation) — not in original spec
2. **Live control state machine** with validated transitions — originally planned for Phase 3
3. **Readiness validation** (route points, coordinates, checkpoints) — not in original spec
4. **Guest registration support** — ownership via email matching
5. **Multi-role authorization** — platform admin, organizer (OWNER/ADMIN), staff, with different bypass rules
6. **Live server integration** — real-time status push on state changes

### Items Moved to Phase 3

1. **RaceSession model** — defined in roadmap but not yet in schema (tracking data structure)
2. **TrackingPoint model** — GPS tracking points (depends on mobile app integration)
3. **Privacy mode** (`PUBLIC / FRIENDS / ORGANIZER_ONLY`) — per-athlete visibility control

---

## 12. API Reference Summary

| Method | Endpoint                                                       | Purpose                   | Auth Required        |
| ------ | -------------------------------------------------------------- | ------------------------- | -------------------- |
| PATCH  | `/api/events/[id]/registrations/[regId]/checkin`               | Staff check-in toggle     | Admin/Organizer/Staff |
| POST   | `/api/registrations/[regId]/check-in`                          | Self-service check-in     | Registration owner   |
| POST   | `/api/events/[id]/registration/verify-ticket`                  | QR verification + check-in| Admin/Organizer/Staff |
| GET    | `/api/events/[id]/registration/ticket`                         | Generate QR ticket        | Registration owner   |
| PATCH  | `/api/events/[id]/registrations/[regId]/revoke-ticket`         | Revoke ticket             | Admin/Organizer/Staff |
| GET    | `/api/registrations/[regId]/race-gate`                         | Race-start gating check   | Registration owner   |
| POST   | `/api/events/[id]/live-control`                                | State machine commands    | Admin/Organizer      |
| GET    | `/api/events/[id]/live-status`                                 | Current live status       | Admin/Organizer      |
| GET    | `/api/events/[id]/live-readiness`                              | Variant readiness report  | Admin/Organizer      |

---

## 13. Key Files

| File                                                              | Purpose                               |
| ----------------------------------------------------------------- | ------------------------------------- |
| `lib/checkin-gating.ts`                                           | Shared gating logic (window + race)   |
| `app/api/events/[id]/registrations/[regId]/checkin/route.ts`      | Staff check-in endpoint               |
| `app/api/registrations/[regId]/check-in/route.ts`                 | Self-service check-in endpoint        |
| `app/api/events/[id]/registration/verify-ticket/route.ts`         | QR ticket verification                |
| `app/api/events/[id]/registration/ticket/route.ts`                | Ticket generation                     |
| `app/api/registrations/[regId]/race-gate/route.ts`                | Race-start gating                     |
| `app/api/events/[id]/live-control/route.ts`                       | State machine control                 |
| `app/api/events/[id]/live-status/route.ts`                        | Live status query                     |
| `app/api/events/[id]/live-readiness/route.ts`                     | Readiness validation                  |
| `components/event-ticket-modal.tsx`                                | QR ticket display modal               |
| `app/[locale]/events/[slug]/manage/_components/tab-inscritos.tsx`  | Staff check-in UI                     |
| `app/[locale]/events/[slug]/manage/_components/tab-config.tsx`     | Check-in window config UI             |
