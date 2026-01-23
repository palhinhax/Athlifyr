# Google Indexing Strategy for Event Pages

## Current Status

Google is currently showing `Detected — currently not indexed` for event detail pages (`/events/*`).

## Improvements Implemented

### 1. ✅ Enhanced Structured Data

**File**: `/lib/structured-data.ts`

**Changes**:

- **SportsEvent Schema**: Enhanced with additional fields:
  - `geo` coordinates for precise location
  - `keywords` for better topic identification
  - `sameAs` for external event website
  - Sport activity mapping (RUNNING → "Running", TRAIL_RUNNING → "Trail Running", etc.)
  - Dynamic `eventStatus` based on date
  - Dynamic `availability` based on event date
  - Enhanced `offers` with descriptions and validity dates
  - `inLanguage` specification

- **FAQ Schema**: NEW schema added with:
  - "When is the event?" (date and location)
  - "What distances are available?" (variants list)
  - "Where is the event?" (location with map link)
  - "What are the prices?" (price ranges)
  - "How to register?" (external URL)

### 2. ✅ Internal Linking

**Component**: `/components/related-events.tsx`

**Features**:

- Shows up to 6 related events based on:
  - Same sport type
  - Same country
  - Same city
  - Upcoming events only
- Displays event cards with images, dates, locations
- Translatable titles and content
- Improves site navigation and crawl depth

### 3. ✅ Improved Sitemap

**File**: `/app/sitemap.ts`

**Improvements**:

- Language alternates for all 6 supported locales (pt, en, es, fr, de, it)
- Higher priority (0.9) for upcoming events
- Lower priority (0.6) for past events
- Only includes events from last 30 days forward
- Proper `lastModified` dates for cache management

### 4. ✅ Robots.txt

**File**: `/app/robots.ts`

Already properly configured:

- Allows all search engines
- Explicit Googlebot rules
- Disallows only `/api/`, `/admin/`, `/settings`
- Sitemap reference included

## Content Quality Guidelines

### Minimum Requirements for Each Event

Event seed files should include:

1. **Description** (120-200 words minimum):
   - Event overview and history
   - What makes it unique
   - Target audience
   - Course highlights

2. **Distances/Variants**:
   - All available distances
   - Elevation gain (for trails)
   - Cutoff times
   - Technical difficulty

3. **Location Data**:
   - City and country
   - GPS coordinates (`latitude`, `longitude`)
   - Google Maps URL
   - Venue information

4. **Pricing**:
   - Registration phases
   - Price ranges
   - Early bird discounts

5. **External Links**:
   - Official website (`externalUrl`)
   - Registration link
   - Social media (if available)

6. **Media**:
   - High-quality event image (`imageUrl`)
   - Minimum 1200x630px for social sharing

### Example Quality Event Seed

```typescript
const event = await prisma.event.create({
  data: {
    title: "Ultra Trail do Douro 2026 - 8ª Edição",
    slug: "ultra-trail-douro-2026",
    description: `O Ultra Trail do Douro é uma das provas de trail running mais emblemáticas de Portugal, percorrendo os vinhedos classificados como Património Mundial da UNESCO. Agora na sua 8ª edição, a prova oferece percursos desafiantes com vistas deslumbrantes sobre o Rio Douro e os socalcos vinhateiros. Com distâncias de 12km a 105km, há opções para todos os níveis de experiência.`,
    sportTypes: [SportType.TRAIL_RUNNING, SportType.ULTRA_RUNNING],
    startDate: new Date("2026-05-02T08:00:00Z"),
    endDate: new Date("2026-05-02T20:00:00Z"),
    city: "Peso da Régua",
    country: "Portugal",
    region: "Douro",
    latitude: 41.163,
    longitude: -7.788,
    googleMapsUrl: "https://maps.app.goo.gl/...",
    imageUrl: "https://...",
    externalUrl: "https://ultratraildouro.com",
    // ... variants, pricing, etc.
  },
});
```

## SEO Best Practices

### On-Page Optimization

1. **Title Tags**: Automatically generated with:
   - Event name
   - Date
   - Location
   - Example: "Ultra Trail do Douro 2026 - 2 Maio | Peso da Régua"

2. **Meta Descriptions**: Include:
   - Event summary
   - Date and location
   - Main distances
   - Circuits/certifications
   - 150-160 characters

3. **Headings Structure**:
   - H1: Event title (already in `<EventHeader>`)
   - H2: Sections (About, Variants, Location, Community, Related Events)
   - H3: Sub-sections (variant names, pricing phases)

4. **Image Alt Text**:
   - All images should have descriptive alt text
   - Include event name and location

### Internal Linking Strategy

1. **Related Events Section**:
   - Links to 6 similar events
   - Based on sport type, location, or date
   - Improves crawl depth and PageRank flow

2. **Breadcrumbs**:
   - Already implemented with BreadcrumbList schema
   - Home → Events → Event Name

3. **Sport Badges**:
   - Link to filtered event lists by sport
   - (Future improvement)

4. **Location Links**:
   - Link to events in the same city/country
   - (Future improvement)

## Reindexing Process

### Step 1: Deploy Changes

1. Commit and push all changes
2. Verify build passes
3. Deploy to production

### Step 2: Google Search Console

1. Go to [Google Search Console](https://search.google.com/search-console)
2. Select property: `athlifyr.com`
3. Navigate to **Sitemaps**
4. Submit sitemap: `https://athlifyr.com/sitemap.xml`

### Step 3: Request Indexing (Sample Pages)

Request indexing for ~10 high-quality event pages:

1. Go to **URL Inspection** tool
2. Enter event URL (e.g., `https://athlifyr.com/pt/events/boston-marathon-2026`)
3. Click **Test Live URL**
4. If valid, click **Request Indexing**

Prioritize:

- World Marathon Majors (Boston, Berlin, London, NYC, Chicago, Tokyo)
- UTMB events (UTMB Mont Blanc, Canyons, Leadville)
- Major European marathons (Seville, Valencia, Paris)
- Large USA events (Rock 'n' Roll series, Ironman)

### Step 4: Monitor Progress

**Timeline**: 4-8 weeks for significant changes

**Metrics to Track**:

1. **Coverage Report** (Search Console → Coverage):
   - Monitor decline in "Discovered — not indexed"
   - Monitor increase in "Indexed" pages
   - Check for new errors

2. **Performance** (Search Console → Performance):
   - Track impressions increase
   - Monitor click-through rate (CTR)
   - Identify top-performing queries

3. **Sitemaps** (Search Console → Sitemaps):
   - Verify sitemap is processing correctly
   - Check for any errors

**Weekly Checklist**:

- [ ] Check Coverage Report for status changes
- [ ] Review Performance data for new impressions
- [ ] Identify and fix any crawl errors
- [ ] Request indexing for 5 new events

**Monthly Review**:

- [ ] Analyze which event types get indexed faster
- [ ] Review top-performing event pages
- [ ] Adjust content strategy based on data
- [ ] Update seed files with learnings

## Common Issues and Solutions

### Issue 1: "Discovered — currently not indexed"

**Causes**:

- Page quality perceived as low
- Duplicate/thin content
- Low internal linking
- Slow crawl rate

**Solutions**:

- ✅ Enhanced structured data (DONE)
- ✅ Added FAQ schema (DONE)
- ✅ Added related events section (DONE)
- Ensure descriptions are 150+ words
- Add unique content per event
- Request indexing via Search Console

### Issue 2: "Crawled — currently not indexed"

**Causes**:

- Google crawled but deemed not valuable enough
- Similar to other pages
- Low external links pointing to page

**Solutions**:

- Improve content uniqueness
- Add more specific details per event
- Build external links (social media, event directories)
- Add user-generated content (comments, reviews)

### Issue 3: Slow Indexing Rate

**Causes**:

- Low domain authority
- Limited crawl budget
- Too many pages

**Solutions**:

- Focus on high-quality events first
- Request indexing for priority pages
- Build domain authority (backlinks, social signals)
- Ensure fast page load times

## Future Improvements

### Phase 2: User-Generated Content

1. **Event Reviews**:
   - Allow users to rate events
   - Add review schema (AggregateRating)
   - Display star ratings in search results

2. **Photo Galleries**:
   - User-uploaded event photos
   - Increase unique content per page
   - Improve engagement metrics

3. **Race Reports**:
   - Detailed user experiences
   - Tips and advice
   - Course conditions

### Phase 3: Enhanced Metadata

1. **Video Content**:
   - Event highlight videos
   - Course previews
   - VideoObject schema

2. **Live Updates**:
   - Real-time results during events
   - Live blog coverage
   - Social media integration

3. **Historical Data**:
   - Past editions results
   - Statistics and trends
   - Winner archives

## Success Metrics

### Short-term (1-2 months)

- [ ] 50% of priority events indexed
- [ ] Increase in event page impressions (Search Console)
- [ ] Decrease in "Discovered — not indexed" count

### Medium-term (3-6 months)

- [ ] 80% of active events indexed
- [ ] Organic traffic to event pages > 1000/month
- [ ] Average position < 20 for brand+event queries

### Long-term (6-12 months)

- [ ] 90%+ of active events indexed
- [ ] Ranking in top 10 for "[sport] events in [location]"
- [ ] Featured snippets for event FAQs
- [ ] Rich results showing in search (event cards)

## Resources

- [Google Search Console](https://search.google.com/search-console)
- [Google Rich Results Test](https://search.google.com/test/rich-results)
- [Schema.org SportsEvent](https://schema.org/SportsEvent)
- [Schema.org FAQPage](https://schema.org/FAQPage)
- [Google Event Guidelines](https://developers.google.com/search/docs/appearance/structured-data/event)

---

**Last Updated**: January 23, 2026
**Next Review**: February 23, 2026
