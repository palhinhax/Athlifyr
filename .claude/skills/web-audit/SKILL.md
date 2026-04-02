---
name: web-audit
description: >
  Deep audit of the Athlifyr web app — hunts for missing translations, dead buttons,
  broken links, non-responsive layouts, unused code, accessibility gaps, and other
  frontend issues that slip through reviews. Use this skill whenever the user asks to:
  audit the web app, review web code quality, check translations, find dead UI,
  check responsiveness, find frontend bugs, scan for web issues, "rever codigo web",
  "analisar a app", "verificar traduções", or any request to systematically find
  problems across the frontend codebase. Also trigger when the user mentions
  "mobile issues", "missing translations", "broken buttons", or "responsive problems".
---

# Web Audit

You are a meticulous frontend auditor for the Athlifyr web app — a Next.js 16 sports platform with next-intl translations (pt, en, es, fr, de, it), shadcn/ui components, and Tailwind CSS. Your job is to systematically find real problems that affect users: things they can't click, text they can't read in their language, layouts that break on phones, and code that wastes their time.

## Tech Stack Context

- **Framework**: Next.js 16 App Router with `app/[locale]/` routing
- **Translations**: next-intl v4 — namespaced JSON files in `messages/{locale}/`
- **UI**: shadcn/ui (Radix primitives) + Tailwind CSS 3.4 + Framer Motion
- **Breakpoints**: `sm:` (640px), `md:` (768px), `lg:` (1024px), `2xl:` (1536px)
- **Components**: `components/` for app components, `components/ui/` for shadcn base
- **Icons**: Lucide React

## How to Run an Audit

When triggered, follow this sequence. The user may ask for a full audit or focus on a specific area — adapt accordingly.

### Step 1: Determine Scope

Ask the user (or infer from context):

- **Full audit** — scan everything below
- **Specific area** — e.g., "just translations" or "just the events pages"
- **Specific files/components** — targeted review

If the scope is broad (full audit or a large area), break the work into parallel subagents — one per audit category. This is important because a full scan touches hundreds of files and doing it sequentially wastes time.

### Step 2: Run Audit Categories

For each category, search the codebase systematically. Don't sample — be thorough within the scope.

---

#### 2.1 Missing Translations

Translation keys used in code must exist in ALL 6 locale files (`pt`, `en`, `es`, `fr`, `de`, `it`). A key present in `pt` but missing in `fr` means French users see a raw key string.

**What to check:**

1. **Extract used keys** — grep for `useTranslations("namespace")` and `t("key")` / `t('key')` patterns in components. Build a map of namespace + key pairs actually used in code.
2. **Cross-reference with JSON files** — for each namespace, read the corresponding JSON in every locale (`messages/pt/{namespace}.json`, `messages/en/{namespace}.json`, etc.) and check that every key used in code exists in every locale file.
3. **Orphan keys** — keys that exist in translation files but are never referenced in code. These aren't user-facing bugs but add maintenance noise.
4. **Hardcoded strings** — user-visible text in components that should be translated but isn't (e.g., `<p>Loading...</p>` instead of `<p>{t("loading")}</p>`). Focus on visible UI text, not technical strings like CSS classes or console.log messages.
5. **Interpolation mismatches** — a key like `"welcome": "Hello {name}"` in `en` but `"welcome": "Olá"` in `pt` (missing the `{name}` placeholder).

**Output per finding:**

- File and line where the key is used
- Which locales are missing the key
- The existing value in one locale (so the user can translate it)

---

#### 2.2 Dead UI Elements

Buttons, links, and interactive elements that do nothing when clicked — these frustrate users and make the app feel broken.

**What to check:**

1. **Empty onClick handlers** — `onClick={() => {}}`, `onClick={undefined}`, `onClick={noop}`
2. **Links to nowhere** — `href="#"`, `href=""`, `href="javascript:void(0)"`, missing `href` on `<a>` tags
3. **Disabled without reason** — permanently disabled buttons (not conditionally disabled based on state)
4. **TODO/FIXME handlers** — `onClick` that contains a comment like `// TODO` but no real logic
5. **Console.log-only handlers** — buttons whose only action is `console.log()`
6. **Commented-out functionality** — event handlers that are commented out, leaving the button visually present but non-functional
7. **Forms without onSubmit** — `<form>` elements missing submission logic
8. **Dead routes** — pages in `app/[locale]/` that render empty or placeholder content

**Be careful:** Some components are intentionally presentational (e.g., cards that link elsewhere, visual indicators). Don't flag those. Focus on elements that LOOK interactive but AREN'T.

---

#### 2.3 Responsive Design Issues

The app must work from 320px (small phones) to desktop. Tailwind's mobile-first approach means no prefix = mobile styles, `md:` = tablet+, `lg:` = desktop.

**What to check:**

1. **Fixed widths without responsive alternatives** — `w-[500px]` or `width: 500px` without `max-w-full` or responsive overrides. These overflow on mobile.
2. **Missing mobile breakpoints** — layouts using `flex-row` or `grid-cols-3` without a mobile stack (`flex-col` on small screens).
3. **Hidden content without mobile alternative** — `hidden md:block` hides content on mobile, but is there a mobile version? If critical content is just hidden on mobile with no replacement, that's a bug.
4. **Overflow risks** — horizontal scroll on containers, tables without `overflow-x-auto`, long text without `truncate` or `break-words`.
5. **Touch targets too small** — interactive elements smaller than 44x44px on mobile (buttons, links, checkboxes). Tailwind classes like `p-1` on a button are suspicious.
6. **Text too small on mobile** — `text-xs` (12px) for body text on mobile is hard to read.
7. **Images without responsive sizing** — `<img>` or `<Image>` without `w-full` or responsive width classes.
8. **Modals/dialogs on mobile** — dialogs that don't adapt to mobile (missing `max-h-screen`, no scroll, full-width on mobile).

---

#### 2.4 Accessibility Gaps

Real accessibility issues that affect users with disabilities or assistive technology.

**What to check:**

1. **Images without alt text** — `<img>` or `<Image>` without `alt` attribute (or empty `alt` on non-decorative images)
2. **Missing form labels** — `<input>` elements without associated `<label>` or `aria-label`
3. **Color-only indicators** — status shown only by color (e.g., red/green dot) without text or icon alternative
4. **Missing ARIA on custom widgets** — custom dropdowns, modals, tabs without proper `role`, `aria-expanded`, `aria-selected`
5. **Keyboard navigation** — interactive elements that can't be reached with Tab key, or custom components missing `onKeyDown` handlers
6. **Focus trapping in modals** — dialogs that don't trap focus (shadcn/ui handles this, but custom dialogs might not)
7. **Heading hierarchy** — skipped heading levels (h1 -> h3) or multiple h1s on a page

---

#### 2.5 Code Quality & Consistency

Frontend-specific code issues that indicate bugs or maintenance problems.

**What to check:**

1. **Unused imports** — components or hooks imported but never used
2. **Duplicate components** — two components that do nearly the same thing (e.g., two different event card components)
3. **Inline styles** — `style={{}}` when Tailwind classes would work
4. **Missing error boundaries** — pages or complex components without error handling
5. **Client/server mismatches** — `"use client"` on components that don't need it (no hooks, no interactivity), or server components trying to use client-only APIs
6. **Missing loading states** — data fetching without skeleton/spinner (user sees blank screen)
7. **Missing empty states** — lists/grids that show nothing when data is empty (no "No results" message)
8. **Hardcoded URLs** — API URLs or external links hardcoded instead of using env vars or constants
9. **Z-index chaos** — arbitrary z-index values (`z-[9999]`) that could cause stacking issues

---

### Step 3: Present Findings

Group findings by category and severity. Use this format:

```markdown
# Web Audit Report

## Summary

- X critical issues (breaks functionality for users)
- Y important issues (degrades experience significantly)
- Z minor issues (polish and maintenance)

## Critical Issues

### [Category] Issue title

**File:** `path/to/file.tsx:42`
**Impact:** What the user experiences
**Fix:** What to change (be specific — show the code change if short)

## Important Issues

...

## Minor Issues

...

## Recommendations

Patterns or systemic improvements (not individual fixes).
```

**Severity guide:**

- **Critical** — users can't complete a task, see broken UI, or get wrong information (missing translation for a CTA button, dead checkout button, layout completely broken on mobile)
- **Important** — noticeable degradation (missing translations for secondary text, small touch targets, missing loading states)
- **Minor** — polish (orphan translation keys, unused imports, inconsistent spacing)

### Step 4: Offer to Fix

After presenting findings, offer to fix the issues — starting with critical ones. For translation issues, suggest the missing translations based on existing values in other locales. For responsive issues, show the Tailwind classes to add. For dead UI, either wire up the handler or remove the element.

## Important Guidelines

- **Don't flag what works.** If a button has a proper handler and it's just complex, that's fine. Focus on genuinely broken or missing things.
- **Be specific.** "Some buttons might not work" is useless. "`components/event-header.tsx:87` — Share button onClick is empty" is useful.
- **Show evidence.** Include the relevant code snippet (2-3 lines) so the user can verify without opening the file.
- **Prioritize user impact.** A missing translation on the homepage is more critical than one on an admin-only page.
- **Know the stack.** shadcn/ui components (Dialog, DropdownMenu, etc.) handle accessibility by default via Radix — don't flag those for missing ARIA unless they're customized incorrectly.
- **Use subagents for speed.** When auditing multiple categories or large sections, spawn parallel subagents to search different areas simultaneously.
