# TASK-12: Social Sharing of Results

## Summary

Allow athletes to share their race results on social media (Instagram, Facebook,
Twitter/X) with a visually appealing card that includes their time, position, and
event information.

---

## Type

`feat(results)`

## Priority

**Low** — Nice-to-have, enhances engagement

## Estimate

5–8 Story Points

---

## User Story

> As an **athlete**, I want to share my race result on social media with a
> beautiful card showing my time, position, and event name, so that my friends
> and followers can celebrate my achievement.

---

## Acceptance Criteria

### Share Button

- [ ] "Share Result" button on athlete's result view (profile + event result page)
- [ ] Opens share modal with options:
  - Copy link
  - Share to Twitter/X
  - Share to Facebook
  - Download image (result card)
- [ ] Uses Web Share API on mobile (native share sheet)
- [ ] Falls back to individual share links on desktop

### Result Card (OG Image)

- [ ] Dynamic Open Graph image generated for each result
- [ ] Card content:
  - Event name and logo
  - Variant name and distance
  - Athlete name (or anonymized if `isPublic = false`)
  - Official time (HH:MM:SS)
  - Position (e.g., "12th of 156")
  - Date and location
  - Athlifyr branding
- [ ] 1200×630 pixels (Facebook/Twitter optimal size)
- [ ] Clean, modern design consistent with Athlifyr brand

### OG Metadata

- [ ] Result page has proper Open Graph meta tags:
  ```html
  <meta property="og:title" content="John finished Trail 32km in 03:45:21!" />
  <meta
    property="og:description"
    content="12th of 156 — Trail Manuelino 2026"
  />
  <meta property="og:image" content="/api/og/result?id=..." />
  ```
- [ ] Twitter Card meta tags included
- [ ] Shareable URL: `/events/{slug}/results/{resultId}`

---

## Technical Implementation

### Share Button Component

```
components/result-share-button.tsx
```

```typescript
function handleShare() {
  if (navigator.share) {
    // Mobile: use native share sheet
    navigator.share({
      title: `${athleteName} finished ${variantName} in ${time}!`,
      text: `${position}th of ${total} — ${eventName}`,
      url: shareUrl,
    });
  } else {
    // Desktop: open share modal
    setShareModalOpen(true);
  }
}
```

### OG Image Generation

Use Vercel OG (already available in Next.js):

```
app/api/og/result/route.tsx
```

```typescript
import { ImageResponse } from "next/og";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const resultId = searchParams.get("id");

  // Fetch result data
  const result = await prisma.result.findUnique({
    where: { id: resultId },
    include: { event: true, variant: true, user: true },
  });

  return new ImageResponse(
    <div style={{ /* result card layout */ }}>
      <h1>{result.event.title}</h1>
      <h2>{result.variant.name}</h2>
      <p className="time">{result.time}</p>
      <p className="position">#{result.position}</p>
    </div>,
    { width: 1200, height: 630 }
  );
}
```

### Shareable Result Page

```
app/[locale]/events/[slug]/results/[resultId]/page.tsx
```

- Public page showing a single result with full details
- OG meta tags for social sharing preview
- Privacy check: only if `isPublic = true`

### i18n Keys Required

All 6 languages (en, pt, es, fr, de, it):

```json
{
  "share": {
    "shareResult": "Share Result",
    "copyLink": "Copy Link",
    "shareTwitter": "Share on X",
    "shareFacebook": "Share on Facebook",
    "downloadCard": "Download Card",
    "linkCopied": "Link copied!",
    "finishedIn": "{name} finished {variant} in {time}!",
    "positionOf": "{position}th of {total}"
  }
}
```

---

## Dependencies

- Task 09 (Athlete Profile) — result display in profile
- Next.js OG Image generation (built-in)
- Web Share API (browser native)

## Blocked By

Task 09

## Blocks

None

---

## Testing

- [ ] Share button visible on result view
- [ ] Web Share API used on supported browsers
- [ ] Fallback modal shown on desktop
- [ ] Copy link copies correct URL to clipboard
- [ ] Twitter share link opens with correct text
- [ ] Facebook share link opens with correct URL
- [ ] OG image generates correctly for a result
- [ ] OG meta tags present on result page
- [ ] Private results (`isPublic = false`) not shareable
- [ ] Download card produces image file
- [ ] i18n: all text uses translation keys
- [ ] All 6 language translations provided
