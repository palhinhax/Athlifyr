# Athlifyr Accessibility Audit

**Date:** March 20, 2026
**Branch:** feature/accessibility-improvements
**Auditor:** Internal review via code analysis

---

## Web Application

### Implemented

| Feature               | Status | Details                                                                          |
| --------------------- | ------ | -------------------------------------------------------------------------------- |
| Page language         | Done   | `<html lang={locale}>` with all 6 locales (pt, en, es, fr, de, it)               |
| Skip link             | Done   | Skip to main content link, visible on focus (WCAG 2.4.1)                         |
| Semantic HTML         | Done   | `<header>`, `<main id="main-content">`, `<footer role="contentinfo">`, `<nav>`   |
| Image alt text        | Done   | Meaningful alt on content images, empty alt on decorative, translated badge alts |
| Screen reader support | Done   | `sr-only` class used for hidden labels, `aria-hidden="true"` on decorative icons |
| Modal accessibility   | Done   | Radix UI Dialog handles focus trap, Escape key, `role="dialog"`                  |
| Tab navigation        | Done   | Radix UI Tabs with proper `role="tablist"`, keyboard arrows                      |
| Cookie consent        | Done   | Accessible buttons with `aria-label`, proper semantics                           |
| Toast notifications   | Done   | Radix UI Toast with `aria-live` regions                                          |
| Heading hierarchy     | Done   | Fixed h1-h2-h3 structure, sr-only section headings where needed                  |
| Button aria-labels    | Done   | Icon-only buttons (settings, fullscreen, mute, chat) have `aria-label`           |
| Footer translations   | Done   | All footer links translated, `aria-label` on social/download links               |

### Partially Implemented

| Feature             | Status     | Details                                                                                         | Priority |
| ------------------- | ---------- | ----------------------------------------------------------------------------------------------- | -------- |
| Keyboard navigation | Partial    | Works for inputs, dialogs; missing arrow key patterns for lists/comboboxes                      | Medium   |
| Focus visibility    | Partial    | Skip link has excellent focus style; not all interactive elements have visible focus            | Medium   |
| Form accessibility  | Partial    | Labels with `htmlFor` used consistently; missing `aria-required`, `aria-describedby` for errors | High     |
| Color contrast      | Unverified | Structured color system in CSS variables; not tested against WCAG 4.5:1                         | Medium   |

### Missing / Known Limitations

| Feature              | Status  | Details                                                               | Priority |
| -------------------- | ------- | --------------------------------------------------------------------- | -------- |
| Loading states       | Missing | No `aria-busy` or `aria-live` regions for async loading               | Medium   |
| Map accessibility    | Poor    | Mapbox maps lack `aria-label`, text description, keyboard alternative | Low      |
| Form error linking   | Missing | Error messages not linked via `aria-describedby`                      | Medium   |
| Arrow key navigation | Missing | Lists and custom comboboxes lack arrow key patterns                   | Low      |

---

## Mobile Application (iOS / Android)

### Implemented

| Feature                    | Status  | Details                                                                        |
| -------------------------- | ------- | ------------------------------------------------------------------------------ |
| Event card labels          | Done    | `accessibilityLabel` with full event description, `accessibilityRole="button"` |
| Events search              | Done    | `accessibilityLabel`, `accessibilityRole="search"` on search input             |
| View toggle states         | Done    | `accessibilityState={{ selected }}` on list/map toggles                        |
| Events list                | Done    | `accessibilityRole="list"` on FlatList                                         |
| Loading indicators         | Partial | Some `ActivityIndicator` have `accessibilityLabel` with translated text        |
| Translation infrastructure | Done    | `a11y` namespace exists in i18n for all 6 languages                            |
| Touch target expansion     | Done    | Consistent `hitSlop` of 8-12px on icon buttons                                 |

### Partially Implemented

| Feature                     | Status  | Details                                                                  | Priority |
| --------------------------- | ------- | ------------------------------------------------------------------------ | -------- |
| accessibilityLabel coverage | Partial | ~16 of 100+ interactive elements labeled                                 | High     |
| accessibilityRole coverage  | Partial | ~8 of 100+ elements have roles                                           | High     |
| accessibilityState          | Minimal | Only view mode toggle uses it                                            | Medium   |
| Tab bar                     | Partial | Expo Router provides baseline, titles translated; missing explicit roles | Medium   |
| Loading labels              | Partial | Some spinners labeled, many without context                              | Medium   |
| Image alt text              | Partial | CachedImage accepts `alt` prop but only applies on Web, not native       | High     |

### Missing / Known Limitations

| Feature                    | Status       | Details                                                                       | Priority |
| -------------------------- | ------------ | ----------------------------------------------------------------------------- | -------- |
| accessibilityHint          | Missing      | Zero implementations across entire codebase                                   | High     |
| Dynamic text scaling       | Missing      | No `allowFontScaling` directives; font sizes don't respect system preferences | High     |
| Focus management           | Missing      | No focus trap in modals, no auto-focus on inputs                              | High     |
| Icon-only buttons          | Missing      | 10+ buttons (search, run, camera, calendar, notification bell) without labels | High     |
| Venue cards                | Missing      | No accessibility attributes at all                                            | High     |
| Map accessibility          | Missing      | No labels on markers, no keyboard alternative, no text description            | Medium   |
| Form input labels          | Missing      | 50+ text inputs lack `accessibilityLabel`                                     | High     |
| VoiceOver/TalkBack actions | Missing      | No custom accessibility actions or gestures                                   | Low      |
| Touch target sizing        | Inconsistent | Some elements below 44x44 minimum (badges at 18px)                            | Medium   |

---

## Summary

### Web: Good Foundation

The web app has a solid accessibility foundation with proper semantic HTML, skip links, screen reader support, accessible modals/tabs (via Radix UI), and recent fixes for heading hierarchy and button labels. Main gaps are in form error associations, loading state announcements, map accessibility, and color contrast verification.

### Mobile: Early Stage

The mobile app has a strong translation infrastructure and good event card accessibility, but most interactive elements lack labels, roles, and hints. Dynamic text scaling is not implemented, focus management is absent, and many icon-only buttons are unlabeled. The events screen is the best example of accessibility patterns that should be replicated across all screens.

---

## Recommended Follow-up Backlog

### High Priority

1. Add `accessibilityLabel` and `accessibilityRole` to all mobile icon-only buttons
2. Add `accessibilityLabel` to all mobile form inputs
3. Implement native image alt text (remove Web-only conditional in CachedImage)
4. Add venue card accessibility attributes
5. Add `aria-describedby` for web form error messages
6. Verify color contrast with WCAG AA tools

### Medium Priority

7. Add `aria-busy` / `aria-live` for web loading states
8. Add `accessibilityHint` to mobile interactive elements
9. Add `accessibilityState` for mobile form fields and toggles
10. Ensure all web interactive elements have visible focus indicators
11. Add map accessibility (aria-label, text description)
12. Implement `allowFontScaling` for mobile text components

### Low Priority

13. Add arrow key navigation for web lists/comboboxes
14. Implement focus management in mobile modals
15. Add VoiceOver/TalkBack custom actions
16. Additional skip links (navigation, footer)
17. Keyboard shortcuts documentation
