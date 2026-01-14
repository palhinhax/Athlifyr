# Instagram Post Generator - Quick Start

## Access

- **URL**: `/admin/instagram`
- **Required**: Admin role

## Quick Guide

### 1. Select Template

- **T1 Event Hero**: For specific events (title, subtitle, date, CTA)
- **T2 Category Card**: For categories (big title, keywords, tagline)
- **T3 Weekly Picks**: List of 3-5 events
- **T4 Minimal Quote**: Simple motivational quote

### 2. Choose Format

- **Square (1:1)**: 1080x1080px - Standard feed
- **Portrait (4:5)**: 1080x1350px - Vertical feed
- **Story (9:16)**: 1080x1920px - Stories/Reels

### 3. Set Background

- **Solid**: Choose from brand colors
- **Gradient**: 8 predefined brand gradients
- **Photo**: Upload image + adjust overlay (0-100%)

### 4. Fill Content

Fill the template fields according to character limits

### 5. Export

- **PNG**: High quality, larger file
- **JPG**: Smaller file size

## Tips

- Toggle safe area guides to check layout
- Text auto-scales if too long
- Save as draft to edit later
- Logo is always bottom-right

## Character Limits

- **T1 Title**: 50 chars
- **T1 Subtitle**: 40 chars
- **T2 Category**: 20 chars
- **T3 Items**: 40 chars each
- **T4 Quote**: 200 chars

## Deployment

Run migration before using:

```bash
npm run db:push
# or
npx prisma migrate deploy
```

## Documentation

See [INSTAGRAM_GENERATOR.md](./INSTAGRAM_GENERATOR.md) for full details.
