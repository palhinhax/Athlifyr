---
name: review-improve
description: >
  Comprehensive code review, reuse detection, simplification, and quality improvement for TypeScript/React/Next.js/Tailwind projects.
  Use this skill whenever the user asks to: review code, find duplicated logic, simplify components, improve performance,
  refactor frontend code, clean up hooks, reduce complexity, extract reusable patterns, optimize renders, review changed files,
  or any variant like "review this", "simplify", "improve this code", "clean up", "refactor", "find duplications",
  "code quality", "reutilizar", "simplificar", "melhorar codigo", "rever codigo", "review my changes", "review PR".
  Also trigger when the user uses /review-improve.
---

# Review & Improve

A systematic code review skill that analyzes code for reuse opportunities, simplification, quality improvements, and frontend-specific optimizations. Built for TypeScript + React + Next.js + Tailwind codebases.

## Philosophy

Good code review isn't about nitpicking style — it's about catching real problems and surfacing genuine improvements that save time long-term. Focus on changes that reduce bugs, improve maintainability, or measurably improve performance. Skip cosmetic suggestions unless they fix a real readability problem.

## Workflow

### Step 1: Identify what to review

Determine the review scope based on the user's request:

- **If the user points to specific files** — review those files
- **If the user says "review my changes"** — run `git diff` (staged + unstaged) and `git diff --cached` to find changed files
- **If the user says "review this PR"** or gives a PR number — use `gh pr diff <number>` to get the changes
- **If the user says "review this component/hook/page"** — find and read the relevant files
- **If no specific scope** — check `git status` for recently modified files

Read ALL files in scope before making any suggestions. Understanding the full context prevents suggestions that break other parts of the code.

### Step 2: Analyze for issues

Run these analyses in parallel where possible. For each issue found, note the file, line number, severity, and a concrete fix.

#### 2.1 — Duplication & Reuse

Search the codebase for patterns similar to the code under review. The goal is to find opportunities to extract shared logic rather than having it copy-pasted.

**What to look for:**

- Functions or blocks that do the same thing in multiple files (fetch + transform patterns, validation logic, formatting helpers)
- Components that are near-identical with minor prop differences — candidates for a single parameterized component
- Hooks that duplicate data-fetching or state management logic already handled elsewhere
- Repeated Tailwind class combinations that could be a shared utility or component
- API route handlers with identical auth/validation/error-handling boilerplate

**How to search:**

- Use Grep to search for key function names, patterns, or string literals from the changed code
- Check `/components/ui/` for existing primitives before suggesting new ones
- Check `/lib/` for existing utility functions
- Check for existing custom hooks (files matching `use*.ts` or `use*.tsx`)

**Output format for each finding:**

```
REUSE: [file:line] — [description]
  Existing: [path to existing code that does this]
  Suggestion: [how to consolidate]
```

#### 2.2 — Simplification

Identify code that can be made simpler without changing behavior.

**What to look for:**

- Nested ternaries or complex conditional chains — extract to named variables or early returns
- useEffect chains that could be replaced with derived state or useMemo
- Overcomplicated state management (multiple related useState calls that should be a single useReducer or object state)
- Functions over 50 lines that do multiple things — break into focused functions
- Redundant null checks, optional chaining on values that are guaranteed to exist
- `any` types that could be properly typed
- Overly abstract code (wrappers around wrappers, indirection with no benefit)
- Promise chains that would read better as async/await (or vice versa)
- Components with too many props — consider composition or context instead
- Long className strings that repeat — extract into variables or use CVA variants

**Output format:**

```
SIMPLIFY: [file:line] — [description]
  Before: [current pattern, briefly]
  After: [simplified version]
  Why: [what makes this simpler — fewer branches, easier to read, less state]
```

#### 2.3 — Quality & Correctness

Find bugs, potential runtime errors, and code that doesn't follow established project patterns.

**What to look for:**

- Missing error handling on API calls or async operations
- Race conditions in useEffect (missing cleanup, stale closures)
- Missing dependency array items in useEffect/useMemo/useCallback
- Incorrect TypeScript types (unsafe casts, missing generics)
- SQL injection or XSS vectors (especially in API routes using raw queries)
- Missing loading/error states in components that fetch data
- Hardcoded values that should come from environment variables or constants
- Broken accessibility (missing labels, roles, keyboard handlers)
- Memory leaks (event listeners not cleaned up, subscriptions not cancelled)
- Next.js specific: mixing server/client patterns incorrectly, missing `"use client"` directives, improper use of server actions
- Zod schemas that don't match the actual data shape
- React Query hooks with missing or incorrect query keys

**Output format:**

```
QUALITY: [file:line] — [severity: critical|warning|info] — [description]
  Problem: [what's wrong]
  Fix: [concrete solution]
```

#### 2.4 — Frontend Performance

Identify React/Next.js performance issues that have real impact. Only flag these when they actually matter — in hot paths, large lists, or frequent re-renders.

**What to look for:**

- Components re-rendering unnecessarily due to unstable references (inline objects/arrays/functions as props)
- Missing React.memo on expensive pure components rendered in lists
- Large components that should be split for better code-splitting
- Images without Next.js `<Image>` optimization or missing `sizes`/`priority`
- Heavy computations on every render that should use useMemo
- Fetching data client-side that could be fetched server-side (RSC or server components)
- Bundle size: importing entire libraries when only a small part is needed (e.g., `import _ from 'lodash'` vs `import groupBy from 'lodash/groupBy'`)
- Tailwind: overly long class strings that hurt readability — suggest extracting to `cn()` compositions or component variants with CVA
- Missing `key` props or using array index as key in dynamic lists
- Unnecessary re-fetching with React Query (missing staleTime, incorrect invalidation)

**Output format:**

```
PERF: [file:line] — [description]
  Impact: [estimated impact — high/medium/low and why]
  Fix: [concrete solution]
```

### Step 3: Present findings

Group findings by file, then by category. Lead with the most impactful items.

**Structure the review as:**

```markdown
## Review: [scope description]

### Critical Issues

[Issues that should be fixed — bugs, security, correctness]

### Improvements

[Reuse opportunities, simplifications, performance wins worth doing]

### Minor Suggestions

[Nice-to-haves, small optimizations]

### Summary

- X files reviewed
- X issues found (X critical, X improvements, X minor)
- Key theme: [one sentence about the main pattern you noticed]
```

### Step 4: Apply fixes (if requested)

If the user asks you to fix the issues (not just review), apply changes file by file:

1. Start with critical issues
2. Then apply improvements
3. Skip minor suggestions unless explicitly asked
4. After each file edit, briefly note what changed

When fixing, preserve the existing code style. Don't reformat untouched code, don't add comments to unchanged functions, don't rename variables that aren't part of the fix.

## Project-Specific Patterns

This skill knows about the following stack and respects established patterns:

- **Next.js App Router** with `[locale]` dynamic routes and server/client components
- **React 19** with hooks
- **TypeScript** in strict mode
- **Tailwind CSS** with custom HSL theme variables (`p-brand`, `p-golden`, `p-highlight`, `p-info`)
- **Radix UI** primitives in `/components/ui/`
- **React Hook Form + Zod** for form validation
- **TanStack React Query** for server state and caching
- **Prisma** for database queries
- **next-intl** for internationalization
- **CVA** (Class Variance Authority) for component variants
- **cn()** utility for className merging (clsx + tailwind-merge)
- **Framer Motion** for animations
- **Recharts** for data visualization
- **Stripe** for payments

Don't suggest replacing established patterns with alternatives (e.g., don't suggest replacing React Query with SWR, or Radix with another library).

## Quick Checklists

### React/Next.js Component Checklist

- `"use client"` directive present if component uses hooks, event handlers, or browser APIs
- Props are typed with an interface or type (not inline)
- Loading and error states handled for async data
- Accessibility: interactive elements have labels, proper roles, keyboard support
- Images use `<Image>` from `next/image`
- Links use `<Link>` from `next/link`
- Translations use `useTranslations()` from `next-intl` — no hardcoded user-facing strings
- No unnecessary `useEffect` — check if derived state or event handlers suffice
- React Query hooks used for server data instead of manual fetch + useState

### API Route Checklist

- Auth check at the top (getServerSession or equivalent)
- Input validation with Zod
- Proper error responses with meaningful status codes
- No raw SQL — use Prisma queries
- CORS headers if accessed from mobile app
- Response shape is consistent with other endpoints

### Common Extraction Patterns

| Pattern                               | Extract To                              |
| ------------------------------------- | --------------------------------------- |
| `fetch` + loading + error state       | Custom React Query hook                 |
| Auth check + role guard in API route  | Middleware or helper in `/lib/`         |
| Form with React Hook Form + Zod       | Shared schema + reusable form component |
| Repeated Tailwind card/section layout | Shared component or CVA variant         |
| Date formatting logic                 | Helper in `/lib/`                       |
| Price/currency formatting             | Helper in `/lib/currency`               |
| Modal/Dialog with form inside         | Composed dialog component               |
