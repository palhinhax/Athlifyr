# TASK-01: Reprocessing — Recalculate Results (Idempotent)

## Summary

Create an admin endpoint that recalculates all result positions for a finished event.
This is needed after manual adjustments (DQ, time corrections) or as a safety net
for data integrity.

---

## Type

`feat(results)`

## Priority

**High** — Foundation for Tasks 02, 05, 10

## Estimate

3–5 Story Points

---

## User Story

> As an **organizer**, I want to trigger a "Recalculate Results" action so that
> positions are correctly recomputed after any manual adjustments (DQ, time edits),
> without losing data.

---

## Acceptance Criteria

- [ ] `POST /api/events/[id]/results/recalculate` endpoint exists
- [ ] Auth: Platform admin or organizer with `OWNER` / `ADMIN` role
- [ ] Validates event exists and `liveStatus = FINISHED`
- [ ] Recalculates positions per variant independently
- [ ] Ranking rule: `timeSeconds ASC` (lower is better)
- [ ] DNF entries (`notes = "DNF"`) are excluded from ranking (position = null)
- [ ] DSQ entries (`notes = "DSQ"`) are excluded from ranking (position = null)
- [ ] Tie-breaking: when `timeSeconds` is equal, `createdAt ASC` wins
- [ ] Uses a single transaction to update all positions atomically
- [ ] Idempotent: running N times produces the same result
- [ ] Returns `{ success: true, recalculated: <count>, eventId }` on success
- [ ] Returns `400` if event is not FINISHED
- [ ] Returns `403` if user lacks authorization
- [ ] Returns `404` if event not found

---

## Technical Implementation

### File to Create

```
app/api/events/[id]/results/recalculate/route.ts
```

### Algorithm

```typescript
// 1. Fetch all results for the event, grouped by variantId
const results = await prisma.result.findMany({
  where: { eventId },
  orderBy: [{ timeSeconds: "asc" }, { createdAt: "asc" }],
});

// 2. Group by variantId
const byVariant = groupBy(results, "variantId");

// 3. For each variant, assign positions
for (const [variantId, variantResults] of Object.entries(byVariant)) {
  const rankable = variantResults.filter(
    (r) => r.notes !== "DNF" && r.notes !== "DSQ"
  );

  // Assign position 1..N
  for (let i = 0; i < rankable.length; i++) {
    await tx.result.update({
      where: { id: rankable[i].id },
      data: { position: i + 1 },
    });
  }

  // DNF/DSQ get position = null
  const excluded = variantResults.filter(
    (r) => r.notes === "DNF" || r.notes === "DSQ"
  );
  for (const r of excluded) {
    await tx.result.update({
      where: { id: r.id },
      data: { position: null },
    });
  }
}
```

### Auth Pattern

Follow the same authorization pattern as `app/api/events/[id]/registrations/export/route.ts`:

```typescript
// Check platform admin OR organizer with OWNER/ADMIN role
const isAdmin = session.user.role === "ADMIN";
const isOrganizer = await prisma.organizerMember.findFirst({
  where: {
    userId: session.user.id,
    organizer: { events: { some: { id: eventId } } },
    role: { in: ["OWNER", "ADMIN"] },
  },
});

if (!isAdmin && !isOrganizer) {
  return NextResponse.json({ error: "Forbidden" }, { status: 403 });
}
```

---

## Dependencies

- Existing `Result` model (Prisma)
- Existing auth helpers (`lib/auth-helpers.ts`)

## Blocked By

None

## Blocks

- Task 02 (Leaderboard Freeze)
- Task 05 (DQ/Adjust)
- Task 10 (Category Rankings)

---

## Testing

- [ ] Recalculates positions correctly for single variant
- [ ] Recalculates positions correctly for multiple variants
- [ ] DNF/DSQ entries get `position = null`
- [ ] Tie-breaking by `createdAt` when `timeSeconds` matches
- [ ] Running twice produces identical results (idempotent)
- [ ] Returns 403 for unauthorized user
- [ ] Returns 400 for non-FINISHED event
- [ ] Returns 404 for non-existent event
