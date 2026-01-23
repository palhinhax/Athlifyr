# Google Search Logo Setup

This document explains how Athlifyr's logo is configured for optimal display in Google Search results.

## Current Implementation

### 1. Logo Assets

**Location:** `/public/logo.png`

- **Format:** PNG (with transparency)
- **Dimensions:** 307x303px (square)
- **Size:** ~100KB
- **Status:** ✅ Meets Google's minimum requirement (112x112px)

**Additional Assets:**

- `/public/logo.svg` - SVG version (153KB)
- `/public/favicon.ico` - Browser favicon
- `/public/favicon-16x16.png` - Small favicon
- `/public/favicon-32x32.png` - Standard favicon
- `/public/apple-touch-icon.png` - iOS/macOS icon (180x180px)
- `/public/android-chrome-192x192.png` - Android small icon
- `/public/android-chrome-512x512.png` - Android large icon

### 2. Structured Data (JSON-LD)

**File:** `/lib/structured-data.ts`

The Organization schema includes:

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Athlifyr",
  "alternateName": "Athlifyr Platform",
  "description": "All Sports Events. One Place.",
  "url": "https://athlifyr.com",
  "logo": {
    "@type": "ImageObject",
    "url": "https://athlifyr.com/logo.png",
    "width": 307,
    "height": 303,
    "caption": "Athlifyr Logo"
  },
  "image": "https://athlifyr.com/logo.png",
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "customer support",
    "email": "hello@athlifyr.com",
    "availableLanguage": [
      "Portuguese",
      "English",
      "Spanish",
      "French",
      "German",
      "Italian"
    ]
  }
}
```

**Implementation:** The schema is rendered in the `<head>` of every page via:

- `/app/[locale]/layout.tsx` (lines 156-157)
- `/components/structured-data.tsx` (safe JSON-LD rendering)

### 3. OpenGraph & Social Media

**File:** `/app/[locale]/layout.tsx`

```typescript
openGraph: {
  images: [
    {
      url: "/logo.png",
      width: 1200,
      height: 630,
      alt: "Athlifyr - one place. all sports.",
    },
  ],
}
```

**Note:** While the metadata claims 1200x630px, the actual logo is 307x303px. This is acceptable but not optimal for social sharing.

### 4. Accessibility

**Robots.txt:** Logo is publicly accessible (no restrictions on `/public/*`)

```
User-agent: *
Allow: /
Disallow: /api/
Disallow: /admin/
Disallow: /settings
```

**Sitemap:** Available at `https://athlifyr.com/sitemap.xml`

## Google's Requirements

### Minimum Requirements (✅ Met)

- [x] Logo is at least 112x112px (current: 307x303px)
- [x] Logo uses PNG, JPG, or SVG format (PNG)
- [x] Logo is publicly accessible (no authentication)
- [x] Organization structured data includes logo property
- [x] Logo URL is absolute (includes domain)

### Recommended Best Practices

- [ ] **Logo optimization:** Current logo (307x303px) is below the recommended 1200x630px for OpenGraph
  - **Action:** Consider creating a high-resolution version for social sharing
  - **Note:** Google accepts 307x303px, but social platforms prefer larger images

- [ ] **Social media links:** Add to Organization schema when available
  - Instagram, Facebook, Twitter/X profiles
  - Helps Google understand brand presence

- [ ] **Google Search Console:** Verify ownership and monitor logo display
  - Add verification meta tag to `/app/[locale]/layout.tsx` (line 122-124)

## Verification Checklist

### Local Verification

1. **Logo accessibility:**

   ```bash
   curl -I https://athlifyr.com/logo.png
   # Should return 200 OK, image/png
   ```

2. **Structured data validation:**
   - Visit: https://validator.schema.org/
   - Test URL: https://athlifyr.com
   - Verify Organization schema appears with logo

3. **Rich Results Test:**
   - Visit: https://search.google.com/test/rich-results
   - Test URL: https://athlifyr.com
   - Verify Organization markup is valid

### Production Verification

1. **Google Search Console:**
   - Add and verify site ownership
   - Check "Enhancements" → "Logo" report
   - Submit for reindexing if needed

2. **Live Search Test:**
   - Search: `site:athlifyr.com`
   - Check if logo appears in knowledge panel
   - Note: May take 2-4 weeks for Google to update

## Maintenance

### When to Update

1. **Logo redesign:** Update both `/logo.png` and structured data dimensions
2. **Domain change:** Update `NEXT_PUBLIC_BASE_URL` environment variable
3. **Social media:** Add sameAs links to Organization schema
4. **Contact changes:** Update contactPoint in structured data

### Files to Modify

- **Logo image:** `/public/logo.png`
- **Structured data:** `/lib/structured-data.ts` (Organization schema)
- **Metadata:** `/app/[locale]/layout.tsx` (OpenGraph metadata)
- **Icons:** `/public/` (favicon, apple-touch-icon, android-chrome)

## Future Improvements

1. **Create high-resolution logo (1200x630px):**
   - For optimal social media display
   - Update OpenGraph image metadata
   - Keep current 307x303px for structured data logo

2. **Add social media profiles:**
   - Update `sameAs` array in Organization schema
   - Helps with brand recognition in Google Search

3. **Monitor in Google Search Console:**
   - Track logo appearance in search results
   - Monitor rich results performance
   - Check for any structured data errors

## References

- [Google: Organization Structured Data](https://developers.google.com/search/docs/appearance/structured-data/logo)
- [Schema.org: Organization](https://schema.org/Organization)
- [Google: Rich Results Test](https://search.google.com/test/rich-results)
- [Schema Validator](https://validator.schema.org/)

## Support

For questions or issues:

- **Email:** hello@athlifyr.com
- **Issue Tracker:** GitHub repository issues
