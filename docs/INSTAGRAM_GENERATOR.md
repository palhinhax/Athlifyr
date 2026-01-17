# Instagram Post Generator - Admin Feature

## Overview

The Instagram Post Generator is an admin-only tool that allows the creation of branded Instagram images using predefined Athlifyr templates. It supports multiple formats and provides export functionality in PNG/JPG.

## Access

- **Route**: `/admin/instagram`
- **Permission**: Admin users only (role: `ADMIN`)
- **Navigation**: Accessible via the main navigation menu when logged in as admin

## Features

### 1. Templates (4 Available)

#### T1: Event Hero

Perfect for promoting specific events.

- **Title** (required, max 50 chars): Main event name
- **Subtitle** (optional, max 40 chars): Additional info like "Singles • Doubles"
- **Date/Location** (optional, max 30 chars): Event details like "Mar 2026 • Lisboa"
- **CTA** (optional, max 30 chars): Call to action like "Descobre na Athlifyr"

#### T2: Category Card

Ideal for promoting event categories.

- **Category Title** (required, max 20 chars): Category name like "TRAIL"
- **Keywords** (required, 2-3 items): Comma-separated keywords like "20K, 50K, Ultra"
- **Tagline** (required, max 40 chars): Message like "Encontra eventos perto de ti"

#### T3: Weekly Picks

List multiple events in a single post.

- **Header** (required, max 30 chars): Title like "EVENTOS DA SEMANA"
- **Items** (required, 3-5 items): One event per line, max 40 chars each
- **Footer** (required, max 30 chars): Brand name like "athlifyr.com"

#### T4: Minimal Quote

Simple motivational or promotional posts.

- **Quote** (required, max 200 chars): The quote text
- **Footer** (optional, max 20 chars): Attribution like "Athlifyr"

### 2. Export Formats

All templates can be exported in three sizes:

- **Square (1:1)**: 1080x1080px - Standard Instagram feed
- **Portrait (4:5)**: 1080x1350px - Vertical feed post
- **Story (9:16)**: 1080x1920px - Instagram Stories/Reels cover

### 3. Background Options

#### Solid Colors

Choose from 5 brand colors:

- Primary (black)
- Secondary (light gray)
- Accent (blue)
- Text (white)
- Text Dark (black)

#### Gradients

8 predefined brand gradients:

- Purple/Violet blend
- Pink/Red blend
- Blue/Cyan blend
- Green/Teal blend
- Pink/Yellow blend
- Cyan/Purple blend
- Light gradient blend
- Pink/Purple soft blend

#### Photo Upload

- Upload custom background images
- Adjust overlay intensity (0-100%) for text readability
- Supports JPG, PNG formats
- Max file size: 5MB for regular users, 20MB for admins

#### Video Upload

- Upload custom background videos
- Adjust overlay intensity (0-100%) for text readability
- Supports MP4, WebM, QuickTime formats
- Max file size: 50MB for regular users, 100MB for admins
- Export as WebM video format

### 4. Safe Area Guides

Toggle safe area guides to ensure:

- No text too close to edges
- Content stays within safe zones
- Logo placement doesn't conflict with content
- Story format respects top/bottom UI areas

Guides are visible only in preview, not in exported images.

### 5. Export Options

- **PNG**: Default format, lossless quality
- **JPG**: Alternative format, smaller file size
- High-quality export (2x pixel ratio)
- Automatic font loading before export
- Filename format: `athlifyr-{template}-{format}.{extension}`

### 6. Draft Management

- Save designs as drafts for later editing
- Drafts are stored in the database (PostgreSQL)
- Each draft includes:
  - Template type
  - Format selection
  - All field values
  - Background settings
  - Timestamps

## Brand Guidelines

The generator enforces Athlifyr brand consistency:

### Logo

- Always present in bottom-right corner
- Fixed size per format
- White color filter applied

### Typography

- Auto-scaling for long text
- Maximum 2 font weights (Bold/Regular)
- Strict line-height for readability

### Safe Areas

- **Square**: 60px margins (left/right), 80px margins (top/bottom)
- **Portrait**: 60px margins (left/right), 80px margins (top/bottom)
- **Story**: 60px margins (left/right), 150px margins (top/bottom)

### Text Contrast

- Automatic overlay application for photo backgrounds
- Default 50% overlay intensity (adjustable)
- Ensures text is always readable

## Usage Guide

### Creating a Post

1. Navigate to `/admin/instagram`
2. Select a template (T1-T4)
3. Choose the export format (1:1, 4:5, or 9:16)
4. Select background:
   - Solid color, or
   - Gradient, or
   - Upload photo (and adjust overlay)
5. Fill in template fields
6. Toggle safe area guides to check layout
7. Click "Download PNG" or "Download JPG"

### Saving a Draft

1. After filling in all fields
2. Click "Save Draft"
3. Draft is saved to database
4. Can be loaded later for editing (feature can be extended)

## Technical Details

### Technologies Used

- **React/Next.js**: UI framework
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Styling
- **html-to-image**: Export functionality
- **Radix UI**: Select and Slider components
- **Prisma**: Database ORM

### Database Schema

```prisma
enum InstagramFormat {
  SQUARE   // 1:1 (1080x1080)
  PORTRAIT // 4:5 (1080x1350)
  STORY    // 9:16 (1080x1920)
}

model InstagramPostDraft {
  id          String          @id @default(cuid())
  userId      String
  user        User            @relation(fields: [userId], references: [id], onDelete: Cascade)
  templateKey String          // T1, T2, T3, T4
  format      InstagramFormat @default(SQUARE)
  payload     Json            // All template fields
  createdAt   DateTime        @default(now())
  updatedAt   DateTime        @updatedAt

  @@index([userId])
  @@index([createdAt])
}
```

### API Routes

- `GET /api/instagram/drafts` - List all user's drafts
- `POST /api/instagram/drafts` - Create new draft
- `GET /api/instagram/drafts/[id]` - Get specific draft
- `PUT /api/instagram/drafts/[id]` - Update draft
- `DELETE /api/instagram/drafts/[id]` - Delete draft

All routes require admin authentication.

## File Structure

```
app/
  admin/
    instagram/
      page.tsx           # Main Instagram generator page

components/
  instagram/
    brand-frame.tsx      # Logo + safe areas wrapper
    canvas-preview.tsx   # Preview renderer
    template-event-hero.tsx       # T1
    template-category-card.tsx    # T2
    template-weekly-picks.tsx     # T3
    template-minimal-quote.tsx    # T4

lib/
  instagram-export.ts    # Export utilities

types/
  instagram.ts           # Type definitions

prisma/
  schema.prisma          # Database schema (updated)
  migrations/
    20260114011856_add_instagram_draft/
      migration.sql      # Migration file
```

## Deployment Checklist

Before deploying to production:

1. **Database Migration**

   ```bash
   npm run db:push
   # or
   npx prisma migrate deploy
   ```

2. **Environment Variables**
   - Ensure `DATABASE_URL` is configured
   - Ensure file upload is configured (S3/B2)

3. **Test the Feature**
   - Log in as admin user
   - Test all 4 templates
   - Test all 3 formats
   - Test export functionality
   - Test draft save/load

4. **Verify Access Control**
   - Confirm non-admin users cannot access `/admin/instagram`
   - Confirm API routes reject non-admin requests

## Future Enhancements

Potential improvements for future iterations:

1. **Draft Management UI**
   - List all saved drafts
   - Quick load draft button
   - Delete draft button

2. **Event Integration**
   - Fetch event data to auto-fill Event Hero template
   - Quick select from upcoming events

3. **Batch Export**
   - Generate multiple sizes at once
   - Export all templates for an event

4. **Template Preview Grid**
   - Show all 4 templates side by side
   - Quick template switching

5. **Custom Fonts**
   - Upload custom fonts
   - Font selection per template

6. **Advanced Editing**
   - Drag-and-drop text positioning
   - Manual logo placement
   - Custom safe areas

## Troubleshooting

### Export fails

- Ensure fonts are loaded (wait for preview to render)
- Check if image URLs have proper CORS headers
- Verify browser supports html-to-image

### Blurry export

- Check pixel ratio setting (should be 2x)
- Ensure source images are high resolution
- Verify export dimensions are correct

### Draft not saving

- Check admin authentication
- Verify database connection
- Check API route errors in console

### Photo upload fails

- Verify file size (max 5MB)
- Check file type (must be image)
- Ensure upload API is configured

## Support

For issues or questions:

1. Check browser console for errors
2. Verify admin role is assigned
3. Check database migrations are applied
4. Review API route logs

## License

This feature is part of the Athlifyr platform. All rights reserved.
