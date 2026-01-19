# Instagram & TikTok Post Generator - Admin Feature

## Overview

The Instagram & TikTok Post Generator is an admin-only tool that allows the creation of branded social media images using predefined Athlifyr templates. It supports multiple formats for Instagram (Feed, Stories, Reels) and TikTok, with export functionality in PNG/JPG.

## Access

- **Route**: `/admin/instagram`
- **Permission**: Admin users only (role: `ADMIN`)
- **Navigation**: Accessible via the main navigation menu when logged in as admin

## Features

### 1. Templates (10 Available)

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

#### T5: Monthly Events

Showcase events happening in a specific month.

- **Month** (required): Select month and year
- **Sport Type** (optional): Filter by sport or show all
- **Events** (3-10 items): Auto-loaded from database
- **Footer** (default): "athlifyr.com"

#### T6: Bold Text Overlay (Modern)

Trending style with bold statements - perfect for Instagram Reels.

- **Main Text** (required, max 60 chars): Your bold statement
- **Sub Text** (optional, max 40 chars): Supporting text
- **Emoji** (optional): Single emoji for extra impact

#### T7: Split Screen (Comparison)

Before/After or comparison posts.

- **Left Title** (required, max 30 chars): First option
- **Left Subtitle** (optional, max 40 chars): Description
- **Right Title** (required, max 30 chars): Second option
- **Right Subtitle** (optional, max 40 chars): Description
- **VS Text** (optional, max 5 chars): Default "VS"

#### T8: Testimonial/Stats Card

Social proof with big numbers.

- **Stat Number** (required, max 10 chars): "1000+", "95%", etc.
- **Stat Label** (required, max 30 chars): What the number represents
- **Quote** (optional, max 150 chars): Testimonial text
- **Author** (optional, max 30 chars): Who said it

#### T9: Vertical Challenge Card (TikTok/Reels)

Step-by-step format for challenges and tutorials.

- **Challenge Title** (required, max 40 chars): Name of challenge
- **Steps** (3-5 items, max 50 chars each): Action items
- **Hashtag** (optional, max 30 chars): Challenge hashtag
- **CTA** (optional, max 30 chars): Call to action

#### T10: Hook + CTA (Viral Format)

Attention → Value → Action format for maximum engagement.

- **Hook** (required, max 80 chars): Attention-grabbing opener
- **Body** (required, max 120 chars): Value proposition
- **CTA** (required, max 40 chars): Strong call to action

### 2. Export Formats

All templates can be exported in five optimized sizes:

- **Square (1:1)**: 1080x1080px - Standard Instagram feed
- **Portrait (4:5)**: 1080x1350px - Vertical feed post
- **Story (9:16)**: 1080x1920px - Instagram Stories
- **Reels (9:16)**: 1080x1920px - Instagram Reels (optimized safe areas)
- **TikTok (9:16)**: 1080x1920px - TikTok (optimized safe areas)

### 3. Background Options

#### Solid Colors

Choose from 5 brand colors:

- Primary (black)
- Secondary (light gray)
- Accent (blue)
- Text (white)
- Text Dark (black)

#### Gradients

16 modern gradients including:

- Classic brand gradients (8)
- Modern 2024-2026 trends (8):
  - Warm Energy (orange/yellow)
  - Royal Purple (deep purple)
  - Sky Gradient (cyan/blue)
  - Magenta Burst (pink/magenta)
  - Fire Sunset (red/orange)
  - Nature Green (lime/green)
  - Professional Blue (navy/blue)
  - Dramatic Dark (black/gray)

#### Photo Upload

- Upload custom background images
- Adjust overlay intensity (0-100%) for text readability
- Supports JPG, PNG formats
- Max file size: 5MB for regular users, 20MB for admins

#### Transparent Background

- Generate images with transparent backgrounds
- Ideal for overlaying content on videos in external apps
- Exports as PNG with transparency support
- No overlay controls (background is fully transparent)

### 4. Safe Area Guides

Toggle safe area guides to ensure:

- No text too close to edges
- Content stays within safe zones
- Logo placement doesn't conflict with content
- Story format respects top/bottom UI areas

Guides are visible only in preview, not in exported images.

### 5. Export Options

- **PNG**: Default format, lossless quality, supports transparency
- **JPG**: Alternative format, smaller file size (no transparency)
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
- **Reels**: 60px margins (left/right), 180px margins (top), 200px margins (bottom)
- **TikTok**: 60px margins (left/right), 180px margins (top), 220px margins (bottom)

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
   - Upload photo (and adjust overlay), or
   - Transparent (for overlaying on videos)
5. Fill in template fields
6. Toggle safe area guides to check layout
7. Click "Export Image"

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

## Marketing Machine: Strategic Template Usage

The Instagram & TikTok generator is designed as a comprehensive marketing machine with templates optimized for different platforms and content strategies:

### Instagram Strategy

**Feed Posts (Square/Portrait)**:

- **T1 (Event Hero)**: Major event announcements
- **T2 (Category Card)**: Weekly sport category highlights
- **T8 (Testimonial/Stats)**: Social proof and success metrics

**Stories (Story Format)**:

- **T3 (Weekly Picks)**: Daily event roundups
- **T4 (Minimal Quote)**: Motivational content
- **T6 (Bold Text Overlay)**: Quick announcements

**Reels (Reels Format)**:

- **T6 (Bold Text Overlay)**: Trending hook content
- **T7 (Split Screen)**: Before/After transformations
- **T9 (Vertical Challenge)**: 30-day challenge content

### TikTok Strategy

**TikTok Optimized (TikTok Format)**:

- **T9 (Vertical Challenge)**: Step-by-step tutorials
- **T10 (Hook + CTA)**: Viral content formula (Hook → Value → CTA)
- **T6 (Bold Text Overlay)**: Scroll-stopping statements

### Content Calendar Recommendations

**Daily**:

- 1x Story post (T3 or T4)
- Monitor trends for T6/T10 opportunities

**3x per Week**:

- 1x Feed post (T1 or T2)
- 1x Reels/TikTok (T6, T7, or T9)

**Weekly**:

- 1x Stats/Testimonial post (T8)
- 1x Viral format experiment (T10)

**Monthly**:

- 1x Monthly roundup (T5)
- Review and optimize best-performing templates

### Best Practices

**For Maximum Engagement**:

1. **Use T10 (Hook + CTA)** for viral potential on TikTok
2. **Use T8 (Stats)** to build credibility
3. **Use T9 (Challenges)** to increase participation
4. **Use T7 (Split Screen)** for comparison content
5. **Use T6 (Bold)** for trending topics

**For Brand Building**:

1. Maintain consistent gradients across posts
2. Use T1 for signature event announcements
3. Alternate between motivational (T4) and practical (T3) content
4. Build challenge series with T9

**For Conversions**:

1. Always include CTA in T1, T9, T10
2. Use T8 to showcase social proof
3. Use T2 to drive category exploration
4. Link all posts to athlifyr.com

## Support

For issues or questions:

1. Check browser console for errors
2. Verify admin role is assigned
3. Check database migrations are applied
4. Review API route logs

## License

This feature is part of the Athlifyr platform. All rights reserved.
