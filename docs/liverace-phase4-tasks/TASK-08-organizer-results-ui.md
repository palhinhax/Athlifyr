# TASK-08: Organizer Results Management Screen

## Summary

Create a "Results" tab in the organizer management dashboard that displays final
race results with management capabilities: view, filter, export, DQ, and adjust.

---

## Type

`feat(results)`

## Priority

**Medium** — Depends on backend Tasks 01, 03, 04, 05

## Estimate

8–13 Story Points

---

## User Story

> As an **organizer**, I want a dedicated "Results" tab in my event dashboard where
> I can view all results, filter by variant, export to CSV, and make manual
> adjustments (DQ, time correction), so that I can manage post-race operations
> efficiently.

---

## Acceptance Criteria

### Layout

- [ ] New "Results" tab in event management dashboard
      (`app/[locale]/events/[slug]/manage/`)
- [ ] Tab visible when `event.liveStatus = FINISHED` or results exist
- [ ] Follows existing tab pattern (same as Registrations, LiveRace tabs)

### Results Table

- [ ] Columns: Position, Bib #, Name, Time, Status, Variant, Actions
- [ ] Sorted by position ASC per variant
- [ ] Color-coded status badges: FINISHED (green), DNF (yellow), DSQ (red)
- [ ] Pagination (50 results per page)
- [ ] Empty state with message when no results

### Filters

- [ ] Variant selector (dropdown with all event variants)
- [ ] Status filter (All / FINISHED / DNF / DSQ)
- [ ] Search by athlete name or bib number

### Actions (per result row)

- [ ] "Mark DSQ" button → opens modal with reason input → calls PATCH endpoint
- [ ] "Mark DNF" button → opens modal with reason input → calls PATCH endpoint
- [ ] "Reinstate" button (for DSQ/DNF entries) → reason modal → calls PATCH
- [ ] "Adjust Time" button → opens modal with time input + reason → calls PATCH
- [ ] Action buttons only visible to OWNER/ADMIN role

### Bulk Actions (header level)

- [ ] "Recalculate Positions" button → calls POST recalculate endpoint → refreshes table
- [ ] "Export CSV" button → triggers CSV download for current variant filter
- [ ] Confirmation dialog for recalculation

### Audit Log Section

- [ ] Expandable "Change History" section at bottom of tab
- [ ] Shows recent audit log entries (last 20)
- [ ] Each entry: timestamp, user, action, athlete name, reason
- [ ] "View All" link to full audit log (modal or separate view)

---

## Technical Implementation

### File to Create

```
app/[locale]/events/[slug]/manage/_components/tab-results.tsx
```

### Component Structure

```
TabResults
├── ResultsToolbar
│   ├── VariantSelector
│   ├── StatusFilter
│   ├── SearchInput
│   ├── RecalculateButton
│   └── ExportCSVButton
├── ResultsTable
│   ├── ResultRow (per result)
│   │   ├── PositionBadge
│   │   ├── AthleteInfo
│   │   ├── TimeBadge
│   │   ├── StatusBadge
│   │   └── ActionMenu
│   └── Pagination
├── AdjustModal (shared for DSQ/DNF/Time)
│   ├── ActionSelect
│   ├── ReasonInput
│   ├── TimeInput (conditional)
│   └── ConfirmButton
└── AuditLogSection
    ├── AuditLogEntry (per entry)
    └── ViewAllLink
```

### API Calls

| Action            | Endpoint                               | Method |
| ----------------- | -------------------------------------- | ------ |
| Fetch results     | `/api/events/[id]/results/public`      | GET    |
| Export CSV        | `/api/events/[id]/results/export`      | GET    |
| Recalculate       | `/api/events/[id]/results/recalculate` | POST   |
| DQ / DNF / Adjust | `/api/events/[id]/results/[resultId]`  | PATCH  |
| Fetch audit log   | `/api/events/[id]/results/audit-log`   | GET    |

### i18n Keys Required

All 6 languages (en, pt, es, fr, de, it):

```json
{
  "results": {
    "title": "Results",
    "position": "Position",
    "bibNumber": "Bib #",
    "athlete": "Athlete",
    "time": "Time",
    "status": "Status",
    "variant": "Variant",
    "actions": "Actions",
    "markDSQ": "Disqualify",
    "markDNF": "Mark DNF",
    "reinstate": "Reinstate",
    "adjustTime": "Adjust Time",
    "recalculate": "Recalculate Positions",
    "exportCSV": "Export CSV",
    "reason": "Reason",
    "reasonRequired": "A reason is required for this action",
    "confirmRecalculate": "Recalculate all positions for this event?",
    "noResults": "No results found",
    "auditLog": "Change History",
    "viewAllChanges": "View All Changes",
    "statusFinished": "Finished",
    "statusDNF": "DNF",
    "statusDSQ": "DSQ"
  }
}
```

---

## Dependencies

- Task 01 (Recalculate) — recalculate endpoint
- Task 03 (Results Export) — CSV export endpoint
- Task 04 (Public Results API) — data fetching
- Task 05 (DQ/Adjust) — manual action endpoint
- Task 06 (Audit Trail) — audit log endpoint

## Blocked By

Tasks 01, 03, 04, 05, 06

## Blocks

None

---

## UI/UX Notes

- Follow existing management tab styles (`tab-registrations.tsx`, `tab-liverace.tsx`)
- Use existing UI components: `Badge`, `Button`, `Dialog`, `Table`, `Input`
- Status badge colours consistent with the live leaderboard component
- Mobile-responsive: table converts to card layout on small screens
- Loading states for all async operations
- Toast notifications for action results (success/error)

---

## Testing

- [ ] Tab renders with results table
- [ ] Variant filter works (updates table)
- [ ] Status filter works
- [ ] Search filter works
- [ ] DQ modal opens and submits correctly
- [ ] DNF modal opens and submits correctly
- [ ] Reinstate button appears for DSQ/DNF entries
- [ ] Adjust Time modal validates format
- [ ] Recalculate button triggers refresh
- [ ] Export CSV triggers download
- [ ] Audit log section shows recent changes
- [ ] Empty state displayed when no results
- [ ] i18n: all text uses translation keys
- [ ] All 6 language translations provided
