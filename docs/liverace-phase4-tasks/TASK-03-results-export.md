# TASK-03: Results CSV Export Endpoint

## Summary

Create a dedicated CSV export endpoint for race results. This is distinct from the
existing registration export — it focuses on race outcomes (position, time, status)
rather than participant data (payment, contact info).

---

## Type

`feat(results)`

## Priority

**High** — Critical organizer tool for post-race operations

## Estimate

3–5 Story Points

---

## User Story

> As an **organizer**, I want to export a CSV of race results per variant so that
> I can share official results with timing partners, publish on external websites,
> and archive for regulatory compliance.

---

## Acceptance Criteria

- [ ] `GET /api/events/[id]/results/export?variantId=...` endpoint exists
- [ ] Auth: Platform admin or organizer with `OWNER` / `ADMIN` / `FINANCE` role
- [ ] Returns RFC 4180-compliant CSV with UTF-8 BOM
- [ ] `Content-Disposition: attachment; filename="athlifyr-results-{slug}-{date}.csv"`
- [ ] Supports `variantId` filter (optional — exports all if omitted)
- [ ] CSV columns (minimum):
  - Position
  - Bib Number (dorsal)
  - Athlete Name
  - Time (HH:MM:SS)
  - Time (seconds — for calculations)
  - Status (FINISHED / DNF / DSQ)
  - Variant Name
  - Category Position (if available)
- [ ] Results sorted by position ASC (within variant)
- [ ] DNF/DSQ entries appear at the bottom
- [ ] Empty result set returns CSV with headers only
- [ ] Audit log: console log with user, event, filters, row count

---

## Technical Implementation

### File to Create

```
app/api/events/[id]/results/export/route.ts
```

### Reuse Existing Utilities

From `lib/csv-export.ts`:

- `escapeCSVField()` — RFC 4180 field escaping
- `buildCSVRow()` — Row construction
- `buildCSV()` — Full CSV with BOM

### CSV Row Builder

```typescript
const headers = [
  "Position",
  "Bib Number",
  "Name",
  "Time",
  "Time (seconds)",
  "Status",
  "Variant",
  "Category Position",
];

const rows = results.map((r) => [
  r.position?.toString() ?? "",
  r.registration?.bibNumber ?? "",
  r.user.name ?? "",
  r.time,
  r.timeSeconds?.toString() ?? "",
  r.notes === "DNF" ? "DNF" : r.notes === "DSQ" ? "DSQ" : "FINISHED",
  r.variant?.name ?? "",
  r.categoryPosition?.toString() ?? "",
]);
```

### Filename Builder

Add to `lib/csv-export.ts`:

```typescript
export function buildResultsExportFilename(
  eventSlug: string,
  variantSlug?: string | null
): string {
  const datePart = new Date().toISOString().slice(0, 10);
  const parts = ["athlifyr-results", sanitizeSlug(eventSlug)];
  if (variantSlug) parts.push(sanitizeSlug(variantSlug));
  parts.push(datePart);
  return parts.join("-") + ".csv";
}
```

### Auth Pattern

Same as registration export (`app/api/events/[id]/registrations/export/route.ts`):
platform admin OR organizer with OWNER/ADMIN/FINANCE role.

### Data Query

```typescript
const results = await prisma.result.findMany({
  where: {
    eventId,
    ...(variantId ? { variantId } : {}),
  },
  include: {
    user: { select: { name: true } },
    variant: { select: { name: true, slug: true } },
  },
  orderBy: [{ position: "asc" }, { timeSeconds: "asc" }],
});

// Join with registration for bib number
// Registration is linked via userId + eventId + variantId
```

---

## Dependencies

- `lib/csv-export.ts` (existing)
- `Result` model (existing)
- Auth helpers (existing)

## Blocked By

None

## Blocks

- Task 08 (Organizer Results UI — "Export CSV" button)

---

## Testing

- [ ] Returns valid CSV with correct headers
- [ ] Results sorted by position
- [ ] Variant filter works correctly
- [ ] DNF/DSQ entries included with correct status
- [ ] Bib number pulled from related Registration
- [ ] Content-Disposition header has correct filename
- [ ] UTF-8 BOM present
- [ ] 403 for unauthorized user
- [ ] 404 for non-existent event
- [ ] Empty results returns headers-only CSV
