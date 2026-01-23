# Post-Deployment Verification Checklist

After deploying this PR, follow these steps to ensure Google can properly index and display the Athlifyr logo.

## Immediate Actions (Day 1)

### 1. Validate Structured Data

**Google Rich Results Test:**

- [ ] Visit: https://search.google.com/test/rich-results
- [ ] Enter URL: `https://athlifyr.com`
- [ ] Click "Test URL"
- [ ] Verify "Organization" markup appears in results
- [ ] Check that logo ImageObject is present with correct properties

**Schema Validator:**

- [ ] Visit: https://validator.schema.org/
- [ ] Enter URL: `https://athlifyr.com`
- [ ] Verify no errors or warnings for Organization schema
- [ ] Confirm logo property shows ImageObject with dimensions

### 2. Verify Logo Accessibility

**Direct Access Test:**

```bash
# Test logo is accessible (should return 200 OK)
curl -I https://athlifyr.com/logo.png

# Expected output:
# HTTP/2 200
# content-type: image/png
```

**Browser Test:**

- [ ] Open incognito window
- [ ] Navigate to: `https://athlifyr.com/logo.png`
- [ ] Verify logo loads correctly (no 404, no redirect to login)
- [ ] Check image dimensions (should be 307x303px)

### 3. Google Search Console Setup

**Add Property (if not already done):**

- [ ] Go to: https://search.google.com/search-console
- [ ] Add property: `https://athlifyr.com`
- [ ] Verify ownership using one of these methods:
  - HTML file upload
  - Meta tag in `<head>` (add to `/app/[locale]/layout.tsx` line 122-124)
  - DNS TXT record
  - Google Analytics
  - Google Tag Manager

**Submit for Indexing:**

- [ ] In Search Console, go to URL Inspection
- [ ] Enter: `https://athlifyr.com`
- [ ] Click "Request Indexing"
- [ ] Wait for confirmation message

## Week 1 Actions

### 4. Monitor Indexing Status

**Search Console - Coverage Report:**

- [ ] Navigate to "Coverage" in left sidebar
- [ ] Check that homepage is indexed
- [ ] Verify no errors related to structured data
- [ ] Review "Enhancements" section

**Search Console - Rich Results:**

- [ ] Go to "Enhancements" → "Logo"
- [ ] Check for any errors or warnings
- [ ] Verify logo is detected
- [ ] Note: May show "No data" initially - this is normal

### 5. Live Search Test

**Google Search:**

```
site:athlifyr.com
```

- [ ] Perform search in incognito mode
- [ ] Check if logo appears in knowledge panel (right side)
- [ ] Note: Logo may not appear immediately (can take 2-4 weeks)

## Week 2-4 Actions

### 6. Verify Logo in Search Results

**Brand Search:**

- [ ] Search: `Athlifyr`
- [ ] Check if logo appears in knowledge panel
- [ ] Verify correct logo image is displayed
- [ ] Check on both desktop and mobile

**Site Search:**

- [ ] Search: `site:athlifyr.com events`
- [ ] Check if logo appears in sitelinks
- [ ] Verify brand consistency

## Troubleshooting

### Logo Not Appearing After 4 Weeks

1. **Re-validate Structured Data:**
   - Use Rich Results Test again
   - Check for any errors or warnings
   - Ensure ImageObject properties are correct

2. **Check Search Console Errors:**
   - Review "Coverage" for crawl errors
   - Check "Enhancements" → "Logo" for issues
   - Look for manual actions or penalties

3. **Verify Logo Properties:**
   - Confirm logo is at least 112x112px (current: 307x303px ✓)
   - Ensure logo format is PNG, JPG, or SVG (current: PNG ✓)
   - Check logo is on same domain as site (current: yes ✓)

4. **Request Manual Review:**
   - In Search Console, go to "Enhancements" → "Logo"
   - Click "Request Review" if option available
   - Wait 1-2 weeks for response

### Common Issues

**Issue:** Logo shows generic icon instead of custom logo

- **Solution:** Ensure Organization schema includes logo as ImageObject (not just string)
- **Action:** Verify `/lib/structured-data.ts` has been deployed correctly

**Issue:** Logo not detected by Rich Results Test

- **Solution:** Check that StructuredData component is rendered in `<head>`
- **Action:** View page source, search for `"@type":"Organization"` and verify logo property

**Issue:** Logo loads but not displayed in search

- **Solution:** Logo may be cached by Google with old version
- **Action:** Wait 2-4 weeks, request reindexing, or use URL Parameters tool in Search Console

## Monitoring Dashboard

Create a simple monitoring checklist:

```
Weekly Check (Weeks 1-4):
- [ ] Week 1: Search Console shows homepage indexed
- [ ] Week 2: Rich Results Test shows Organization schema
- [ ] Week 3: Logo property appears in Search Console
- [ ] Week 4: Logo visible in Google Search results

Monthly Check (Ongoing):
- [ ] Logo still appears in brand searches
- [ ] No structured data errors in Search Console
- [ ] Logo loads correctly on site
- [ ] Organization schema passes validation
```

## Success Criteria

✅ Logo should meet these criteria:

1. Shows in Rich Results Test with no errors
2. Appears in Search Console "Logo" enhancement report
3. Displays in Google Search knowledge panel for brand queries
4. Shows consistently across desktop and mobile
5. No errors or warnings in Search Console

## Support

If issues persist after 4 weeks:

- Check `/docs/SEO-LOGO-SETUP.md` for detailed troubleshooting
- Review Google's documentation: https://developers.google.com/search/docs/appearance/structured-data/logo
- Contact support: hello@athlifyr.com

## Notes

- **Timeline:** Logo appearance typically takes 2-4 weeks after deployment
- **Patience:** Google's crawlers need time to discover and process changes
- **Cache:** Google may cache old logo for some time
- **Mobile vs Desktop:** Logo may appear on one device type before the other
- **International:** Logo should work for all locales (pt, en, es, fr, de, it)

---

**Last Updated:** After PR deployment
**Next Review:** 1 week post-deployment
