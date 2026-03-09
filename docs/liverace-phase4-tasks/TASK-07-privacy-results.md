# TASK-07: Privacy Enforcement in Public Results

## Summary

Ensure that athletes with `LiveRaceVisibility = ORGANIZER_ONLY` have their results
hidden from public endpoints. Sync the user's privacy preference with the
`Result.isPublic` flag during result persistence and manual operations.

---

## Type

`feat(results)`

## Priority

**Medium** — Important for privacy compliance

## Estimate

2–3 Story Points

---

## User Story

> As an **athlete** with privacy set to `ORGANIZER_ONLY`, I want my race results
> to be hidden from public leaderboards and result pages, while still being visible
> to me and the organizer.

---

## Acceptance Criteria

- [ ] When results are persisted (`POST /api/internal/live-results`), check user's
      `liveRaceVisibility` setting
- [ ] If `ORGANIZER_ONLY`: set `Result.isPublic = false`
- [ ] If `PUBLIC` or `FRIENDS`: set `Result.isPublic = true`
- [ ] `FRIENDS` mode: result is public on leaderboard (MVP simplification — full
      friend-filtering is complex and deferred)
- [ ] Public endpoints (`/final-leaderboard`, `/results/public`) only return
      `isPublic = true` (already implemented)
- [ ] Athlete can always see their own results regardless of `isPublic`
- [ ] Organizer can see all results regardless of `isPublic`
- [ ] If athlete changes privacy setting after results are published, a batch update
      should sync `isPublic` (optional — can be manual for MVP)

---

## Technical Implementation

### File to Modify

```
app/api/internal/live-results/route.ts
```

### Change: Fetch User Privacy Preference

```typescript
// Before upserting each result, check user privacy
for (const result of results) {
  const user = await prisma.user.findUnique({
    where: { id: result.userId },
    select: { liveRaceVisibility: true },
  });

  const isPublic = user?.liveRaceVisibility !== "ORGANIZER_ONLY";

  await prisma.result.upsert({
    where: { ... },
    update: { ..., isPublic },
    create: { ..., isPublic },
  });
}
```

### Optimization: Batch Fetch User Preferences

```typescript
// Fetch all user preferences in one query
const userIds = results.map((r) => r.userId);
const users = await prisma.user.findMany({
  where: { id: { in: userIds } },
  select: { id: true, liveRaceVisibility: true },
});
const privacyMap = new Map(users.map((u) => [u.id, u.liveRaceVisibility]));
```

### File to Modify — Existing Results API

```
app/api/events/[id]/results/route.ts
```

In the `GET` handler, ensure athletes always see their own results:

```typescript
// Current: only user's own results (already filtered by userId)
// No change needed — user always sees their own results
```

---

## Dependencies

- `User.liveRaceVisibility` field (exists from Phase 3)
- `Result.isPublic` field (exists)
- Live result persistence endpoint (exists)

## Blocked By

None

## Blocks

None (independent enhancement)

---

## Edge Cases

- User has no `liveRaceVisibility` set (default `PUBLIC`) → `isPublic = true`
- User changes privacy to `ORGANIZER_ONLY` after race → existing results stay
  `isPublic = true` until manually synced (acceptable for MVP)
- User deleted → results remain with current `isPublic` value (cascade handled
  by Prisma)

---

## Testing

- [ ] `ORGANIZER_ONLY` user → `Result.isPublic = false`
- [ ] `PUBLIC` user → `Result.isPublic = true`
- [ ] `FRIENDS` user → `Result.isPublic = true` (MVP)
- [ ] Public endpoints exclude `isPublic = false` results
- [ ] Athlete always sees own results (GET /api/events/[id]/results)
- [ ] Organizer sees all results (including private ones)
- [ ] Default (no visibility set) → `isPublic = true`
