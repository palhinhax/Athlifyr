# SEO Implementation Guide

This document describes the SEO enhancements implemented for Athlifyr.com to improve search engine visibility, ranking, and discoverability.

## Overview

The SEO implementation follows modern best practices for Next.js 14 applications and includes:

1. **Dynamic Meta Tags** - Comprehensive metadata for all pages
2. **Structured Data (JSON-LD)** - Rich snippets for search results
3. **Dynamic Sitemap** - Auto-generated sitemap including all events
4. **Robots.txt** - Proper crawling directives

## Implementation Details

### 1. Dynamic Meta Tags

All pages now have proper metadata including:

- **Title Tags**: Unique, descriptive titles (< 60 chars)
- **Meta Descriptions**: Compelling descriptions (< 160 chars)
- **Keywords**: Relevant keywords for search
- **Canonical URLs**: Prevent duplicate content issues
- **Open Graph Tags**: Optimize social media sharing
- **Twitter Cards**: Enhance Twitter link previews
- **Robots Directives**: Control search engine indexing

#### Example: Event Detail Page

```typescript
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const event = await getEvent(params.slug);

  return {
    title: `${event.title} - ${sportTypeLabels[event.sportType]} | Athlifyr`,
    description: metaDescription, // Properly truncated to 160 chars
    keywords: [...],
    alternates: { canonical: eventUrl },
    openGraph: { ... },
    twitter: { ... },
    robots: { index: true, follow: true }
  };
}
```

### 2. Structured Data (JSON-LD)

Implemented schema.org markup for rich search results:

#### SportsEvent Schema

Added to event detail pages to enable rich snippets showing:

- Event name and description
- Date and time
- Location (city and country)
- Pricing information (from variants)
- Event status
- Organizer information

```typescript
{
  "@context": "https://schema.org",
  "@type": "SportsEvent",
  "name": "Event Title",
  "startDate": "2024-06-15T09:00:00Z",
  "location": { "@type": "Place", ... },
  "offers": [...],
  ...
}
```

#### Organization Schema

Added to root layout for brand recognition:

- Organization name and logo
- Website URL
- Contact information

#### WebSite Schema

Added to root layout with search action:

- Enables search box in Google results
- Points to the events search page

#### BreadcrumbList Schema

Added to event pages for navigation:

- Shows page hierarchy
- Improves user navigation in search results

### 3. Dynamic Sitemap

The sitemap (`/sitemap.xml`) is now dynamically generated and includes:

- **Static Pages**: Home, Events listing, Feed
- **Event Pages**: All events from the database
- **Priorities**:
  - Homepage: 1.0
  - Events listing: 0.9
  - Individual events: 0.8
  - Feed: 0.8
- **Change Frequencies**:
  - Homepage: daily
  - Events listing: hourly
  - Individual events: weekly

The sitemap updates automatically when new events are added.

### 4. Robots.txt

Enhanced robots.txt to:

- Allow all pages by default
- Disallow admin routes (`/admin/*`)
- Disallow API routes (`/api/*`)
- Disallow user settings (`/settings`)
- Reference the sitemap
- Specific rules for Googlebot

## Security Considerations

### XSS Protection in Structured Data

The `StructuredData` component sanitizes JSON-LD output by escaping:

- `<` → `\u003c`
- `>` → `\u003e`
- `&` → `\u0026`

This prevents XSS attacks from user-generated content in event descriptions.

### Meta Description Safety

Meta descriptions are properly truncated to ensure they stay within SEO limits while preserving important event information.

## Testing Your SEO Implementation

### 1. Google Rich Results Test

Visit: https://search.google.com/test/rich-results
Test URL: `https://athlifyr.com/events/[any-event-slug]`

### 2. Validate Structured Data

Use the Rich Results Test to verify:

- SportsEvent schema is detected
- No errors in JSON-LD
- All required fields are present

### 3. Check Meta Tags

Use browser DevTools or online tools:

- https://metatags.io/
- https://www.opengraph.xyz/

### 4. Test Sitemap

Visit: `https://athlifyr.com/sitemap.xml`
Verify:

- All events are listed
- URLs are correct
- Priorities are appropriate

### 5. Check Robots.txt

Visit: `https://athlifyr.com/robots.txt`
Verify:

- Sitemap is referenced
- Admin/API routes are disallowed

## Google Search Console Setup

Once deployed, register the site in Google Search Console:

1. Visit https://search.google.com/search-console
2. Add property: `athlifyr.com`
3. Verify ownership (DNS or HTML file method)
4. Submit sitemap: `https://athlifyr.com/sitemap.xml`
5. Monitor:
   - Indexing status
   - Coverage issues
   - Performance metrics
   - Rich results

## Expected Results

After implementation and indexing, expect:

1. **Rich Snippets**: Events appear with structured data in search results
2. **Better Rankings**: Improved relevance signals from proper metadata
3. **Increased CTR**: Better titles and descriptions attract more clicks
4. **Social Engagement**: Enhanced Open Graph tags improve social shares
5. **Faster Indexing**: Dynamic sitemap helps Google discover new events quickly

## Future Enhancements

Consider implementing:

1. **Hreflang Tags**: For international SEO when adding more languages
2. **FAQ Schema**: For popular events with common questions
3. **Rating/Review Schema**: When user reviews are implemented
4. **Video Schema**: If event videos are added
5. **Currency Field**: Add to Event model for international events
6. **Performance Monitoring**: Core Web Vitals tracking
7. **Image Alt Text**: Automated generation for event images

## Monitoring and Maintenance

### Regular Tasks

1. **Weekly**: Check Google Search Console for errors
2. **Monthly**: Review top-performing pages and keywords
3. **Quarterly**: Audit structured data validity
4. **As Needed**: Update meta descriptions for seasonal events

### Key Metrics to Track

- **Impressions**: How often pages appear in search
- **CTR (Click-Through Rate)**: Percentage of impressions that result in clicks
- **Average Position**: Where pages rank in search results
- **Coverage**: Number of indexed pages vs. total pages
- **Core Web Vitals**: Page load performance metrics

## Resources

- [Next.js Metadata API](https://nextjs.org/docs/app/building-your-application/optimizing/metadata)
- [Schema.org SportsEvent](https://schema.org/SportsEvent)
- [Google Search Central](https://developers.google.com/search)
- [Open Graph Protocol](https://ogp.me/)
- [Twitter Cards Documentation](https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/abouts-cards)

## Support

For questions or issues with SEO implementation, refer to:

- This documentation
- Next.js documentation
- Google Search Central
- Schema.org documentation
