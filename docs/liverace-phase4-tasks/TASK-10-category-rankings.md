# TASK-10: Category Rankings (Gender / Age Group)

## Summary

Rank athletes within categories (gender and age group) in addition to the overall
ranking. This is an MVP-optional enhancement that leverages existing user profile
data when available.

---

## Type

`feat(results)`

## Priority

**Low** — MVP optional, depends on user profile completeness

## Estimate

5–8 Story Points

---

## User Story

> As an **athlete**, I want to see my ranking within my age group and gender
> category, so that I can compare my performance against peers in my demographic.

---

## Acceptance Criteria

### Category Detection

- [ ] Categories determined from `User.gender` and `User.dateOfBirth`
- [ ] Gender categories: `M` (Male), `F` (Female), `X` (Other/Non-binary)
- [ ] Age groups (at event date):
  - U20 (under 20)
  - 20-29
  - 30-39
  - 40-49
  - 50-59
  - 60+ (60 and above)
- [ ] Combined category label: e.g., "M30-39", "F50-59"
- [ ] If `gender` or `dateOfBirth` is missing, skip category assignment (no error)

### Ranking

- [ ] `Result.categoryPosition` populated during recalculation (Task 01)
- [ ] Category ranking is per variant + per category
- [ ] Same rules: `timeSeconds ASC`, tie-breaking by `createdAt ASC`
- [ ] DNF/DSQ excluded from category ranking

### API

- [ ] `GET /api/events/[id]/final-leaderboard?category=M30-39` filter
- [ ] `GET /api/events/[id]/results/public?category=M30-39` filter
- [ ] Category data included in result objects: `{ category: "M30-39", categoryPosition: 5 }`

### Export

- [ ] Results CSV export (Task 03) includes "Category" and "Category Position" columns

---

## Technical Implementation

### Category Calculation Function

```typescript
// lib/result-categories.ts

interface CategoryInfo {
  label: string;      // "M30-39"
  gender: string;     // "M"
  ageGroup: string;   // "30-39"
}

export function calculateCategory(
  gender: string | null,
  dateOfBirth: Date | null,
  eventDate: Date
): CategoryInfo | null {
  if (!gender || !dateOfBirth) return null;

  const age = calculateAge(dateOfBirth, eventDate);
  const ageGroup = getAgeGroup(age);
  const genderMap: Record<string, string> = {
    MALE: "M",
    FEMALE: "F",
  };
  const genderCode = genderMap[gender] ?? "X";

  return {
    label: `${genderCode}${ageGroup}`,
    gender: genderCode,
    ageGroup,
  };
}

function calculateAge(dob: Date, referenceDate: Date): number {
  const diff = referenceDate.getTime() - dob.getTime();
  return Math.floor(diff / (365.25 * 24 * 60 * 60 * 1000));
}

function getAgeGroup(age: number): string {
  if (age < 20) return "U20";
  if (age < 30) return "20-29";
  if (age < 40) return "30-39";
  if (age < 50) return "40-49";
  if (age < 60) return "50-59";
  return "60+";
}
```

### Recalculate Extension (Task 01)

Add to the recalculation logic:

```typescript
// After overall position assignment:
// 1. Fetch user profiles (gender + DOB)
// 2. Calculate category for each result
// 3. Group by variant + category
// 4. Assign categoryPosition within each group
```

### Schema Consideration

The `Result` model already has `categoryPosition Int?`. Consider adding:

```prisma
// Optional: store category label for querying
model Result {
  // ... existing fields
  category String?  // "M30-39", "F50-59", etc.
}
```

Or calculate dynamically at query time (no schema change).

---

## Dependencies

- Task 01 (Recalculate) — category positions assigned during recalculation
- `User.gender` field (verify exists)
- `User.dateOfBirth` field (verify exists)

## Blocked By

Task 01

## Blocks

None

---

## Edge Cases

- User has gender but no date of birth → skip category (no partial categorization)
- User has date of birth but no gender → skip category
- Age is exactly on boundary (e.g., 30th birthday on event date) → belongs to new group
- Non-binary gender → category "X" + age group
- Very few athletes in a category → still rank (even if position = 1 of 1)

---

## Testing

- [ ] Category calculated correctly for known DOB + gender combinations
- [ ] Age groups assigned correctly at boundary ages
- [ ] `categoryPosition` populated during recalculation
- [ ] Category filter works in leaderboard API
- [ ] Category filter works in public results API
- [ ] Missing gender/DOB → category fields null (no error)
- [ ] DNF/DSQ excluded from category ranking
- [ ] Category data included in CSV export
- [ ] Multiple variants ranked independently within categories
