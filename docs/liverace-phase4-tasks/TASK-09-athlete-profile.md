# TASK-09: Athlete Profile — Result History + FINISHED Badge

## Summary

Add a "My Results" section to the athlete's profile that displays their race history
across all events, with a "FINISHED" badge for completed races and links to detailed
results.

---

## Type

`feat(results)`

## Priority

**Medium** — Core athlete experience

## Estimate

5–8 Story Points

---

## User Story

> As an **athlete**, I want to see all my race results in my profile, with a
> "FINISHED" badge and official times, so that I can track my progress and share
> my achievements.

---

## Acceptance Criteria

### Profile Section

- [ ] "Race Results" section in athlete profile page
- [ ] List view: event name, variant, date, time, position, status badge
- [ ] "FINISHED" badge (green) for completed races
- [ ] "DNF" badge (yellow) for unfinished races
- [ ] "DSQ" badge (red) for disqualified
- [ ] Sorted by event date descending (most recent first)
- [ ] Link to event page from each result
- [ ] Empty state: "No race results yet"

### Data Source

- [ ] Uses existing Result model data
- [ ] Includes event and variant metadata
- [ ] Shows position within variant (e.g., "12th of 156")
- [ ] Shows official time in HH:MM:SS format

### Integration with Performance Tracking

- [ ] Results linked to `UserPerformanceEntry` (already implemented in POST)
- [ ] Performance tab shows race results alongside training data
- [ ] Differentiates "official race" results from manual entries

### Privacy

- [ ] Only show results where `isPublic = true` on public profile
- [ ] Always show all own results in private profile view
- [ ] Respect user's profile visibility settings

---

## Technical Implementation

### API Endpoint

Existing endpoint can be extended:

```
GET /api/users/[userId]/results
```

Or use a new profile-specific endpoint:

```
GET /api/me/results?page=1&limit=20
Auth: Authenticated user
```

### Query

```typescript
const results = await prisma.result.findMany({
  where: { userId: session.user.id },
  include: {
    event: {
      select: {
        id: true,
        slug: true,
        startDate: true,
        sportTypes: true,
        translations: {
          where: { language: locale },
          select: { title: true, city: true },
        },
      },
    },
    variant: {
      select: {
        name: true,
        distanceKm: true,
        elevationGainM: true,
      },
    },
  },
  orderBy: { event: { startDate: "desc" } },
  skip,
  take: limit,
});
```

### Component Structure

```
AthleteResultsSection
├── ResultCard (per result)
│   ├── EventInfo (name, date, city)
│   ├── VariantInfo (name, distance)
│   ├── TimeBadge (HH:MM:SS)
│   ├── PositionBadge ("12th of 156")
│   ├── StatusBadge (FINISHED / DNF / DSQ)
│   └── EventLink
└── EmptyState
```

### Component Files

```
components/athlete-results-section.tsx
components/result-card.tsx
```

### i18n Keys Required

All 6 languages (en, pt, es, fr, de, it):

```json
{
  "profile": {
    "raceResults": "Race Results",
    "noResults": "No race results yet",
    "position": "{position}th of {total}",
    "officialTime": "Official Time",
    "viewEvent": "View Event",
    "finished": "Finished",
    "dnf": "DNF",
    "dsq": "DSQ"
  }
}
```

---

## Dependencies

- `Result` model (existing)
- `UserPerformanceEntry` (existing)
- Athlete profile page (existing)

## Blocked By

None

## Blocks

- Task 12 (Social Sharing — shares results from profile)

---

## Testing

- [ ] Results listed on athlete profile
- [ ] Sorted by event date descending
- [ ] FINISHED badge shown for completed races
- [ ] DNF/DSQ badges shown correctly
- [ ] Position shows "Xth of Y" format
- [ ] Time shown in HH:MM:SS format
- [ ] Link to event page works
- [ ] Empty state shown when no results
- [ ] Public profile hides `isPublic = false` results
- [ ] Private view shows all own results
- [ ] Pagination works correctly
- [ ] i18n: all text uses translation keys
- [ ] All 6 language translations provided
