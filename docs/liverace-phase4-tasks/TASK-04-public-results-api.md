# TASK-04: Paginated Public Results API

## Summary

Create a public API endpoint for viewing event results with pagination and filtering.
This enables spectators, athletes, and external systems to query results without
authentication.

---

## Type

`feat(results)`

## Priority

**High** — Core public-facing feature

## Estimate

3–5 Story Points

---

## User Story

> As a **spectator or athlete**, I want to browse the results of a finished event
> with pagination and filter by variant, so that I can find specific results without
> loading all data at once.

---

## Acceptance Criteria

- [ ] `GET /api/events/[id]/results/public` endpoint exists
- [ ] Auth: Public (no authentication required)
- [ ] Only returns results where `isPublic = true`
- [ ] Supports query parameters:
  - `variantId` — filter by variant (optional)
  - `status` — filter by status: `FINISHED`, `DNF`, `DSQ` (optional)
  - `search` — search by athlete name (optional)
  - `page` — page number (default: 1)
  - `limit` — results per page (default: 50, max: 100)
- [ ] Response format:
  ```json
  {
    "results": [...],
    "pagination": {
      "page": 1,
      "limit": 50,
      "total": 234,
      "totalPages": 5
    },
    "eventId": "...",
    "variantId": "..." | null
  }
  ```
- [ ] Results sorted by `position ASC, timeSeconds ASC`
- [ ] Each result includes: position, name, time, variant name, status
- [ ] Athlete's image included if `isPublic = true`
- [ ] 404 if event not found
- [ ] 400 if `page` or `limit` are invalid

---

## Technical Implementation

### File to Create

```
app/api/events/[id]/results/public/route.ts
```

### Query with Pagination

```typescript
const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
const limit = Math.min(
  100,
  Math.max(1, parseInt(searchParams.get("limit") ?? "50"))
);
const skip = (page - 1) * limit;

const where = {
  eventId,
  isPublic: true,
  ...(variantId ? { variantId } : {}),
  ...(status === "DNF" ? { notes: "DNF" } : {}),
  ...(status === "DSQ" ? { notes: "DSQ" } : {}),
  ...(status === "FINISHED"
    ? { notes: { not: "DNF", notIn: ["DNF", "DSQ"] } }
    : {}),
  ...(search
    ? { user: { name: { contains: search, mode: "insensitive" } } }
    : {}),
};

const [results, total] = await Promise.all([
  prisma.result.findMany({
    where,
    include: {
      user: { select: { id: true, name: true, image: true } },
      variant: { select: { id: true, name: true, distanceKm: true } },
    },
    orderBy: [{ position: "asc" }, { timeSeconds: "asc" }],
    skip,
    take: limit,
  }),
  prisma.result.count({ where }),
]);
```

### Response Shape

```typescript
return NextResponse.json({
  results: results.map((r) => ({
    id: r.id,
    position: r.position,
    name: r.user.name,
    image: r.user.image,
    time: r.time,
    timeSeconds: r.timeSeconds,
    status: r.notes === "DNF" ? "DNF" : r.notes === "DSQ" ? "DSQ" : "FINISHED",
    variantId: r.variantId,
    variantName: r.variant?.name ?? null,
    categoryPosition: r.categoryPosition,
  })),
  pagination: {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  },
  eventId,
  variantId: variantId ?? null,
});
```

---

## Dependencies

- `Result` model (existing)
- `prisma` client (existing)

## Blocked By

None

## Blocks

- Task 08 (Organizer Results UI — data source)

---

## Testing

- [ ] Returns paginated results with correct page/limit/total
- [ ] `variantId` filter works correctly
- [ ] `status` filter works (FINISHED, DNF, DSQ)
- [ ] `search` filter matches athlete name (case-insensitive)
- [ ] Only `isPublic = true` results returned
- [ ] Privacy: athletes with `isPublic = false` are excluded
- [ ] Pagination: page 2 returns correct offset
- [ ] Default page=1, limit=50
- [ ] limit capped at 100
- [ ] 404 for non-existent event
- [ ] Empty results returns `[]` with correct pagination
