# TASK-02: Leaderboard Freeze per Variant

## Summary

After results are finalized, the leaderboard should be formally "frozen" — positions
are locked and the final leaderboard is served with correct tie-breaking rules.
Enhance the existing final leaderboard API to support variant filtering and
formal freeze indication.

---

## Type

`feat(results)`

## Priority

**High** — Part of core result publication

## Estimate

2–3 Story Points

---

## User Story

> As a **spectator or athlete**, I want to see the final leaderboard per variant
> with correct positions and tie-breaking, and know that it is the official result.

---

## Acceptance Criteria

- [ ] `GET /api/events/[id]/final-leaderboard` supports `?variantId=...` filter
- [ ] Positions are ordered by `timeSeconds ASC` (fastest first)
- [ ] Tie-breaking rule: equal `timeSeconds` → earlier `createdAt` wins
- [ ] DNF/DSQ entries appear at the bottom with appropriate status indicator
- [ ] Response includes `isFrozen: true` field when `liveStatus = FINISHED`
- [ ] Response includes variant metadata (name, distance)
- [ ] Works correctly with multiple variants (each ranked independently)
- [ ] Existing behaviour (all variants combined) still works when no filter

---

## Technical Implementation

### File to Modify

```
app/api/events/[id]/final-leaderboard/route.ts
```

### Changes

1. **Add `variantId` query parameter**:
   ```typescript
   const variantId = request.nextUrl.searchParams.get("variantId");
   ```

2. **Add variant filter to Prisma query**:
   ```typescript
   where: {
     eventId,
     isPublic: true,
     ...(variantId ? { variantId } : {}),
   }
   ```

3. **Add `isFrozen` to response**:
   ```typescript
   return NextResponse.json({
     entries,
     isFrozen: event.liveStatus === "FINISHED",
     variantId: variantId || null,
   });
   ```

4. **Improve ordering** (add `createdAt` for tie-breaking):
   ```typescript
   orderBy: [
     { position: "asc" },
     { timeSeconds: "asc" },
     { createdAt: "asc" },
   ],
   ```

---

## Dependencies

- Task 01 (Recalculate) — positions must be correctly calculated
- Existing `final-leaderboard` endpoint

## Blocked By

Task 01

## Blocks

- Task 08 (Organizer Results UI)

---

## Testing

- [ ] Returns only results for specified variant when `variantId` is provided
- [ ] Returns all results when no variant filter
- [ ] `isFrozen: true` when event is FINISHED
- [ ] `isFrozen: false` when event is LIVE (partial results)
- [ ] Tie-breaking: athletes with same time ranked by `createdAt`
- [ ] DNF/DSQ entries included but at bottom of list
- [ ] 404 when event not found
- [ ] 400 when LiveRace not enabled
