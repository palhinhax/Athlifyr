# LiveRace — Objective & Acceptance Criteria

## 🎯 Objective

Deliver a reliable real-time race tracking system where:

- Athletes can join a race via the mobile app
- Their GPS is processed against the official route (GPX)
- Rankings are calculated based on route progress (not raw distance)
- Spectators can follow the race live on the event page
- Organizers can fully control the race lifecycle (check-in → warmup → live → finish)
- The system remains stable even with temporary network loss (offline buffering)

The system must be production-ready for real outdoor events (trail, road, BTT).

---

# ✅ Acceptance Criteria

## 1. Race Lifecycle Control (Organizer)

- Organizer can:
  - Open check-in
  - Activate warmup
  - Start race
  - Pause race
  - Resume race
  - Finish race
- Each state change:
  - Updates DB (Next.js)
  - Syncs with Live Server
  - Broadcasts status to connected clients
- Spectators see visual badge:
  - WARMUP
  - LIVE
  - PAUSED
  - FINISHED

---

## 2. Athlete Experience (Mobile App)

When the athlete joins:

- Athlete connects via authenticated Socket.io
- Athlete sees:
  - Current race status
  - Confirmation of join
  - GPS connection state (connected/offline)

During race (LIVE):

- Athlete can see:
  - Current rank (e.g. 1st, 2nd, 3rd)
  - Distance covered (meters/km)
  - Progress percentage
  - Last checkpoint reached
  - Finish confirmation when crossing finish line
- GPS is sent every 1–3 seconds
- Route engine projects position onto official route

If athlete loses internet:

- GPS continues to be recorded locally
- Up to configured buffer size (e.g. 5000 points)
- On reconnection:
  - Buffered points are sent in batch
  - Server processes them in chronological order
  - Ranking updates correctly
  - No teleport or ranking corruption occurs

---

## 3. Spectator Experience (Web)

When a spectator opens the event page:

- If race is in WARMUP or LIVE:
  - LiveRace section loads automatically
- Spectator sees:
  - Real-time athlete positions on map
  - Live leaderboard
  - Checkpoint notifications
  - Finish notifications
  - Spectator count

During LIVE:

- Positions update at configured interval (e.g. 2s)
- Leaderboard updates at configured interval (e.g. 5s)
- Rankings are consistent and reflect actual route progress

---

## 4. Route & Ranking Logic

- Ranking is based on:
  - Distance along official route (projected GPS)
  - Not straight-line distance
- Off-route detection:
  - Athlete marked OFF_ROUTE if deviation exceeds threshold
- Anti-cheat:
  - Impossible speeds rejected
  - Invalid GPS accuracy rejected
  - Future timestamps rejected
- Checkpoints:
  - Automatically detected when crossed
  - Event emitted to spectators

---

## 5. Reliability

- `/live/start` is idempotent (multiple spectators cannot create duplicate rooms)
- Redis lock prevents race duplication
- Live Server can handle concurrent athletes
- If Live Server restarts:
  - Race state can be reconstructed from DB (minimum: status + config)
- Finishing a race:
  - Results are persisted
  - Room is destroyed after grace period

---

## 6. Security

- Athlete join requires valid JWT
- GPS updates are only accepted from authenticated athletes
- Internal routes require shared secret
- Spectators cannot manipulate race state

---

## 7. Non-Functional Requirements

- System must support:
  - Minimum 500 concurrent athletes
  - Minimum 1000 concurrent spectators
- Map rendering must remain responsive
- GPS processing must not block event loop
- Broadcast frequency must be configurable

---

# 🎉 Definition of Done

The feature is considered complete when:

- An organizer can run a full race lifecycle end-to-end
- An athlete can:
  - Start race
  - See rank updates
  - See finish confirmation
  - Recover from temporary offline state
- A spectator can:
  - Watch live positions
  - See ranking changes in real time
- No ranking corruption occurs after offline reconnection
- Results are correctly stored after finish
