# TASK-05: DQ / Adjust Manual Actions

## Summary

Allow organizers and platform admins to disqualify athletes (DSQ), mark them as
Did Not Finish (DNF), or adjust their result data (time, bib number). All manual
changes must trigger an audit log entry (see Task 06) and automatic position
recalculation (see Task 01).

---

## Type

`feat(results)`

## Priority

**High** — Essential organizer operation

## Estimate

5–8 Story Points

---

## User Story

> As an **organizer**, I want to mark an athlete as disqualified or adjust their
> result (time correction, bib fix) with an audit trail, so that official results
> are accurate and every change is traceable.

---

## Acceptance Criteria

### DQ / DNF Actions

- [ ] `PATCH /api/events/[id]/results/[resultId]` endpoint exists
- [ ] Auth: Platform admin or organizer with `OWNER` / `ADMIN` role
- [ ] Supported actions via request body:
  - `{ action: "DSQ", reason: "..." }` — Disqualify athlete
  - `{ action: "DNF", reason: "..." }` — Mark as Did Not Finish
  - `{ action: "REINSTATE", reason: "..." }` — Remove DQ/DNF status
  - `{ action: "ADJUST_TIME", time: "HH:MM:SS", reason: "..." }` — Correct time
  - `{ action: "ADJUST_BIB", bibNumber: "123", reason: "..." }` — Fix bib number
- [ ] `reason` is required for all actions (non-empty string)
- [ ] DSQ: sets `notes = "DSQ"`, clears `position`
- [ ] DNF: sets `notes = "DNF"`, clears `position`
- [ ] REINSTATE: clears `notes`, does NOT restore position (recalculate needed)
- [ ] ADJUST_TIME: updates `time` and `timeSeconds`, validates format
- [ ] ADJUST_BIB: updates bib on the related `Registration` record
- [ ] After any action, triggers position recalculation (Task 01 logic)
- [ ] Creates audit log entry (Task 06) with before/after values
- [ ] Returns updated result on success
- [ ] Returns 403 for unauthorized user
- [ ] Returns 404 for non-existent result
- [ ] Returns 400 for invalid action or missing reason

---

## Technical Implementation

### File to Create

```
app/api/events/[id]/results/[resultId]/route.ts
```

### Request Body Schema

```typescript
interface AdjustPayload {
  action: "DSQ" | "DNF" | "REINSTATE" | "ADJUST_TIME" | "ADJUST_BIB";
  reason: string; // Required, non-empty
  time?: string;  // Required for ADJUST_TIME (HH:MM:SS)
  bibNumber?: string; // Required for ADJUST_BIB
}
```

### Handler Logic

```typescript
export async function PATCH(request, { params }) {
  // 1. Authenticate & authorize (admin or organizer OWNER/ADMIN)
  // 2. Fetch existing result (with before snapshot)
  // 3. Validate action + required fields
  // 4. Apply change in transaction:
  //    a. Update Result
  //    b. Create ResultAuditLog (Task 06)
  //    c. If ADJUST_BIB: update Registration.bibNumber
  // 5. Trigger position recalculation (call Task 01 logic)
  // 6. Return updated result
}
```

### DQ Example Flow

```
Organizer clicks "Disqualify" on athlete #42
  → PATCH /api/events/{eventId}/results/{resultId}
    Body: { action: "DSQ", reason: "Cutoff time exceeded at CP3" }
  → Transaction:
    1. Snapshot before: { position: 42, notes: null, time: "03:45:21" }
    2. Update Result: { notes: "DSQ", position: null }
    3. Create AuditLog: { action: "DSQ", before, after, reason }
    4. Recalculate all positions for this variant
  → Response: { result: { ...updated }, recalculated: true }
```

---

## Dependencies

- Task 01 (Recalculate) — position recalculation logic
- Task 06 (Audit Trail) — audit log model and creation
- `Result` model (existing)
- `Registration` model (existing, for bib adjustment)

## Blocked By

- Task 01 (Recalculate)

## Blocks

- Task 06 (Audit Trail — consumed by this task)
- Task 08 (Organizer Results UI — action buttons)

---

## Edge Cases

- DQ an already DQ'd athlete → return 400 (already disqualified)
- Reinstate a non-DQ/DNF athlete → return 400 (not disqualified)
- Adjust time with invalid format → return 400
- Adjust bib to a number already assigned → return 409 (conflict)
- Empty reason string → return 400

---

## Testing

- [ ] DSQ sets notes to "DSQ" and clears position
- [ ] DNF sets notes to "DNF" and clears position
- [ ] REINSTATE clears notes
- [ ] ADJUST_TIME updates time and timeSeconds correctly
- [ ] ADJUST_BIB updates Registration.bibNumber
- [ ] Reason is required (400 without it)
- [ ] Positions are recalculated after any action
- [ ] Audit log entry created for each action
- [ ] Before/after snapshots are correct
- [ ] 403 for unauthorized user
- [ ] 404 for non-existent result
- [ ] 400 for invalid action
- [ ] Idempotent: DSQ twice returns 400 on second attempt
