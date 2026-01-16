# GitHub Copilot Instructions - TheBate

## Language and Internationalization Requirements

**CRITICAL**: This project is multilingual and must support **ALL 6 CONFIGURED LANGUAGES**.

### Supported Languages (COMPLETE LIST)

This project supports **6 languages**. NEVER add features without translating to ALL 6:

1. **English (en)** - en_US
2. **Portuguese (pt)** - pt_PT (European Portuguese - see rules below)
3. **Spanish (es)** - es_ES
4. **French (fr)** - fr_FR
5. **German (de)** - de_DE
6. **Italian (it)** - it_IT

### Translation Rules

1. **Always provide translations in ALL 6 supported languages**: en, pt, es, fr, de, it
2. **Portuguese variant**: ALWAYS use **European Portuguese (pt-PT)**, never Brazilian Portuguese
   - Use "tu" instead of "você"
   - Use European Portuguese vocabulary and expressions
   - Examples: "ecrã" not "tela", "telemóvel" not "celular", "autocarro" not "ônibus"
3. **Translation files**: When adding or modifying UI text, update ALL 6 locale files:
   - `/messages/en.json` (English)
   - `/messages/pt.json` (European Portuguese)
   - `/messages/es.json` (Spanish)
   - `/messages/fr.json` (French)
   - `/messages/de.json` (German)
   - `/messages/it.json` (Italian)
4. **Never hardcode text**: Always use translation keys with the `useTranslations` hook
5. **Consistency**: Keep translation keys organized and consistent across ALL 6 language files
6. **No Exceptions**: If a feature has user-facing text, it MUST be translated to all 6 languages before committing

---

## Conventional Commits Standard

This repository follows [Conventional Commits](https://www.conventionalcommits.org/) specification to enable automated semantic versioning and changelog generation via `semantic-release`.

---

## Commit Message Format

Every commit message **MUST** follow this structure:

```
<type>(<scope>): <summary>

[optional body]

[optional footer(s)]
```

### Rules

- **type**: REQUIRED - must be one of the allowed types (see below)
- **scope**: RECOMMENDED - indicates the area/module affected (e.g., `auth`, `seo`, `ui`, `api`, `db`, `i18n`, `build`)
- **summary**: REQUIRED - short description in imperative mood, lowercase, no period at end
- **language**: Use English consistently throughout the repository
- **length**: Summary should be ≤ 72 characters

---

## Allowed Commit Types

| Type       | Effect            | Description                           | When to Use                                               |
| ---------- | ----------------- | ------------------------------------- | --------------------------------------------------------- |
| `feat`     | **MINOR** release | New feature for the user              | Adding new functionality, endpoints, UI components        |
| `fix`      | **PATCH** release | Bug fix for the user                  | Fixing broken behavior, errors, edge cases                |
| `perf`     | **PATCH** release | Performance improvement               | Optimizing queries, reducing bundle size, improving speed |
| `refactor` | No release        | Code change without functional impact | Restructuring code, renaming, cleaning up                 |
| `docs`     | No release        | Documentation changes                 | README, comments, markdown files                          |
| `test`     | No release        | Adding or fixing tests                | Unit tests, integration tests, e2e tests                  |
| `chore`    | No release        | Maintenance tasks                     | Dependencies update, config changes, tooling              |
| `ci`       | No release        | CI/CD pipeline changes                | GitHub Actions, build configs                             |
| `build`    | No release        | Build system changes                  | Webpack, Next.js config, bundler settings                 |
| `style`    | No release        | Code style changes                    | Formatting, linting fixes, whitespace                     |

### Important Notes

- `feat` → triggers **MINOR** version bump (1.x.0)
- `fix` → triggers **PATCH** version bump (1.0.x)
- `perf` → triggers **PATCH** version bump (1.0.x)
- Other types → **no release** by default

---

## Breaking Changes (MAJOR Release)

A breaking change **MUST** be indicated in two ways:

### 1. Add `!` after the type/scope:

```
feat(auth)!: switch to rotating refresh tokens
```

### 2. Include `BREAKING CHANGE:` in the commit body or footer:

```
feat(auth)!: switch to rotating refresh tokens

BREAKING CHANGE: All existing sessions will be invalidated.
Users must re-authenticate after deployment.
```

**Effect**: Triggers **MAJOR** version bump (x.0.0)

### Breaking Change Examples

```bash
# API contract change
feat(api)!: change topic response structure

BREAKING CHANGE: The topic API now returns `createdAt` instead of `created_at`.
Update all API clients accordingly.

# Removed functionality
feat(auth)!: remove legacy password reset flow

BREAKING CHANGE: The `/api/auth/reset-old` endpoint has been removed.
Use `/api/auth/reset` instead.

# Configuration change
build!: upgrade to Node 20

BREAKING CHANGE: Node.js 18 is no longer supported. Minimum version is now 20.
```

---

## How to Choose Type and Scope

### Type Selection Guide

| Situation                           | Type       | Example                                        |
| ----------------------------------- | ---------- | ---------------------------------------------- |
| Adding new user-facing feature      | `feat`     | `feat(topics): add markdown support`           |
| Fixing bug visible to users         | `fix`      | `fix(comments): prevent duplicate submissions` |
| Improving performance               | `perf`     | `perf(db): reduce N+1 queries on topic list`   |
| Refactoring without behavior change | `refactor` | `refactor(auth): extract validation logic`     |
| Updating documentation              | `docs`     | `docs: add deployment instructions`            |
| Adding/fixing tests                 | `test`     | `test(api): add topic creation tests`          |
| Updating dependencies               | `chore`    | `chore(deps): update next to 14.1.0`           |
| Changing CI/CD                      | `ci`       | `ci: add automated e2e tests`                  |
| Changing build config               | `build`    | `build: enable SWC minification`               |
| Code formatting only                | `style`    | `style: fix ESLint warnings`                   |

### Scope Selection Guide

Common scopes in this repository:

- `auth` - Authentication and authorization
- `topics` - Topic/debate functionality
- `comments` - Comment system
- `ui` - UI components
- `api` - API routes and handlers
- `db` - Database schema and queries
- `i18n` - Internationalization and translations
- `seo` - SEO optimization (metadata, schemas)
- `build` - Build configuration
- `deps` - Dependencies
- `dx` - Developer experience

**Scope is optional but highly recommended** - it helps with changelog organization and quick understanding of changes.

---

## Commit Message Examples

### ✅ Good Examples

```bash
feat(seo): add QAPage schema for topic pages
fix(api): handle null locale on topic fetch
perf(db): reduce N+1 queries on topic list
refactor(comments): extract vote logic to separate hook
docs(readme): add contributing guidelines
test(topics): add validation schema tests
chore(deps): update prisma to 5.8.0
ci: add semantic-release workflow
build: enable TypeScript strict mode
style(comments): fix indentation in comment-item
```

### ✅ With Body and Footer

```bash
feat(i18n): add German translations

Add complete German translation for all UI strings.
Includes navigation, forms, and error messages.

Closes #123
```

### ✅ Breaking Change

```bash
feat(auth)!: switch session tokens to rotating refresh tokens

This change improves security by implementing token rotation.
All existing sessions will be invalidated on deployment.

BREAKING CHANGE: Clients must re-authenticate once after deploy.
The session cookie structure has changed.

Refs: #456
```

### ❌ Bad Examples (DO NOT USE)

```bash
❌ update stuff
❌ WIP
❌ changes
❌ fix bug
❌ misc updates
❌ Updated the thing
❌ Fixed some issues
❌ feat: do a lot of things
```

---

## Referencing Issues and Tickets

Add issue references in the commit footer:

```bash
feat(topics): add vote count display

Closes #123
```

```bash
fix(api): prevent race condition on simultaneous votes

Fixes #456
Refs: #457
```

**Supported keywords**: `Closes`, `Fixes`, `Resolves`, `Refs`, `Related to`

---

## Quick Rules Checklist

- ✅ Use imperative mood: "add", "fix", "update" (not "added", "fixed", "updated")
- ✅ Keep summary lowercase
- ✅ No period (`.`) at end of summary
- ✅ One commit = one logical change
- ✅ Scope reflects the affected area
- ✅ Use `!` and `BREAKING CHANGE:` for breaking changes
- ❌ Never use "WIP", "misc", "update stuff", "changes"
- ❌ Don't combine unrelated changes in one commit
- ❌ Don't use vague descriptions

---

## GitHub Copilot Behavior Requirements

When GitHub Copilot suggests commit messages, it **MUST**:

1. **Always follow Conventional Commits format**: `<type>(<scope>): <summary>`
2. **Choose the correct type**:
   - Use `feat:` for new user-facing features
   - Use `fix:` for bug fixes
   - Use `perf:` for performance improvements
   - Use `refactor:` for code restructuring without functional changes
   - Use `docs:` for documentation-only changes
   - Use `test:` for test-only changes
   - Use `chore:` for maintenance tasks
3. **Include appropriate scope** when possible (e.g., `auth`, `api`, `ui`, `seo`)
4. **Write clear, imperative summaries** (e.g., "add feature" not "added feature")
5. **Detect breaking changes** and suggest `!` and `BREAKING CHANGE:` footer
6. **Avoid generic terms** like "update", "changes", "stuff", "WIP", "misc"
7. **Keep summary concise** (≤ 72 characters)
8. **Suggest body text** for complex changes that need explanation

### Examples of Copilot Suggestions

```bash
# When adding a new component
✅ feat(ui): add topic card hover animation

# When fixing a bug
✅ fix(comments): prevent double submission on fast clicks

# When optimizing
✅ perf(api): cache topic metadata for 5 minutes

# When restructuring code
✅ refactor(auth): extract JWT utilities to separate module

# When updating dependencies
✅ chore(deps): update next to 15.0.0
```

---

## Pull Request Title Requirements

If using **squash merge strategy**, the PR title becomes the commit message in `main`.

**PR titles MUST follow the same Conventional Commits format:**

```
feat(seo): add structured data for topics
```

The PR body can contain additional context, which will become the commit body.

---

## Integration with semantic-release

This repository uses `semantic-release` for automated versioning:

- **feat** commits → bump MINOR version (1.x.0)
- **fix** commits → bump PATCH version (1.0.x)
- **perf** commits → bump PATCH version (1.0.x)
- Commits with `!` or `BREAKING CHANGE:` → bump MAJOR version (x.0.0)
- Other types → no release

The changelog is automatically generated from commit messages, so **clear and accurate commit messages are critical**.

---

## Questions?

- Read [Conventional Commits specification](https://www.conventionalcommits.org/)
- Check [semantic-release documentation](https://semantic-release.gitbook.io/)
- When in doubt, ask the team or look at recent commit history

---

## Summary

Every commit and PR title in this repository must:

1. Follow `<type>(<scope>): <summary>` format
2. Use one of the allowed types (`feat`, `fix`, `perf`, `refactor`, `docs`, `test`, `chore`, `ci`, `build`, `style`)
3. Include scope when applicable
4. Write clear, imperative summaries
5. Mark breaking changes with `!` and `BREAKING CHANGE:` footer
6. Reference issues when applicable

**GitHub Copilot must strictly follow these rules when suggesting commits.**

---

## GitHub Copilot Development Rules

When developing features or fixing issues:

1. **Translations**: Always provide translations in ALL supported languages (en, pt, es, fr, de)
2. **Portuguese**: Use European Portuguese (pt-PT) exclusively, never Brazilian Portuguese
3. **Locale files**: Update all locale files when adding or modifying user-facing text
4. **Translation keys**: Never hardcode text - always use translation keys with `useTranslations` hook
5. **Consistency**: Maintain consistent translation key structure across all language files

---

## TypeScript and Code Quality Standards

**CRITICAL**: This project maintains strict TypeScript standards for code safety and maintainability.

### TypeScript Rules

1. **NEVER use `any` type**: Always use proper types or generics
   - ❌ Bad: `const data: any = await fetch(...)`
   - ✅ Good: `const data: User = await fetch(...)`
   - ✅ Good: `const data: User[] = await fetch(...)`
   - ✅ Good: `function process<T>(data: T): T { ... }`

2. **NEVER use `unknown` unnecessarily**: Use specific types whenever possible
   - ❌ Bad: `const error: unknown = e`
   - ✅ Good: `const error: Error = e`
   - ✅ Good: `if (error instanceof Error) { ... }`

3. **Use strict type definitions**: Define interfaces and types for all data structures

   ```typescript
   // ✅ Good
   interface UserProfile {
     id: string;
     name: string;
     email: string;
     role: "USER" | "ADMIN" | "MOD";
   }

   // ❌ Bad
   const user: any = { id: "1", name: "John" };
   ```

4. **Proper error handling with types**:

   ```typescript
   // ✅ Good
   try {
     // ...
   } catch (error) {
     if (error instanceof Error) {
       console.error(error.message);
     }
   }

   // ❌ Bad
   try {
     // ...
   } catch (error: any) {
     console.error(error.message);
   }
   ```

### Pre-Commit Requirements

**MANDATORY**: Before EVERY commit, you MUST run:

1. **Format code**: `pnpm format`
   - Automatically format code with Prettier
   - Ensure consistent code style across the project

2. **Lint check**: `pnpm lint`
   - Fix all ESLint warnings and errors
   - Ensure code follows project style guidelines

3. **Type check**: `pnpm typecheck`
   - Verify no TypeScript errors exist
   - Ensure all types are properly defined

4. **Build verification**: `pnpm build`
   - Confirm the project builds successfully
   - Catch any build-time errors

**Commit Workflow**:

```bash
# 1. Run quality checks
pnpm format
pnpm lint
pnpm typecheck
pnpm build

# 2. Only commit if all checks pass
git add .
git commit -m "feat(scope): description"
```

### Code Quality Checklist

Before committing, verify:

- [ ] No `any` types used anywhere
- [ ] No `unknown` types used unnecessarily
- [ ] All functions have proper return types
- [ ] All parameters have explicit types
- [ ] `pnpm format` passes with no errors
- [ ] `pnpm lint` passes with no errors
- [ ] `pnpm typecheck` passes with no errors
- [ ] `pnpm build` completes successfully
- [ ] All translations are complete for all languages
- [ ] Conventional commit format is followed

**GitHub Copilot must enforce these standards in all code suggestions and verify compliance before commits.**

---

## Code Modularity and Component Architecture

**CRITICAL**: This project follows strict modularity principles for maintainability and scalability.

### Component Size and Modularity Rules

1. **Keep components small and focused**:
   - ❌ Bad: Large page components with 500+ lines mixing logic, UI, and data fetching
   - ✅ Good: Pages < 200 lines that compose smaller, focused components
   - Each component should have a **single, clear responsibility**

2. **Break down large components into smaller modules**:
   - If a component exceeds 200-250 lines, consider splitting it
   - Extract logical sections into separate components
   - Create a clear component hierarchy

3. **Component organization patterns**:

   ```
   ✅ GOOD STRUCTURE:
   pages/
     events/
       [slug]/
         page.tsx              (< 150 lines - composition only)

   components/
     event-page-header.tsx     (< 100 lines - header section)
     event-main-content.tsx    (< 150 lines - main content)
     event-sidebar.tsx         (< 150 lines - sidebar)
     event-registration.tsx    (< 100 lines - registration form)
     event-comments.tsx        (< 200 lines - comments section)

   ❌ BAD STRUCTURE:
   pages/
     events/
       [slug]/
         page.tsx              (800 lines - everything in one file)
   ```

4. **Module extraction guidelines**:
   - **UI Sections**: Extract distinct visual sections (header, sidebar, footer, etc.)
   - **Form Logic**: Separate forms into dedicated components
   - **Data Display**: Create components for lists, cards, tables
   - **Business Logic**: Extract custom hooks for complex logic
   - **Utilities**: Move helper functions to `lib/` or `utils/`

5. **Clear naming conventions**:
   - Component names should describe their **single purpose**
   - Use descriptive names: `EventRegistrationForm` not `Form`
   - Group related components: `event-card.tsx`, `event-list.tsx`, `event-filters.tsx`

### Practical Examples

#### ❌ Bad: Monolithic Component

```typescript
// pages/events/[slug]/page.tsx (800 lines)
export default function EventPage() {
  // 100 lines of state management
  // 200 lines of data fetching
  // 500 lines of JSX mixing everything
  return (
    <div>
      {/* All UI inline - header, content, sidebar, comments, forms */}
    </div>
  );
}
```

#### ✅ Good: Modular Component

```typescript
// pages/events/[slug]/page.tsx (120 lines)
export default async function EventPage({ params }) {
  const event = await getEventData(params.slug);
  const user = await getCurrentUser();

  return (
    <div className="container">
      <EventPageHeader event={event} user={user} />
      <div className="grid lg:grid-cols-3">
        <EventMainContent event={event} className="lg:col-span-2" />
        <EventSidebar event={event} user={user} />
      </div>
      <EventComments eventId={event.id} />
    </div>
  );
}

// components/event-page-header.tsx (80 lines)
export function EventPageHeader({ event, user }) {
  return (
    <header>
      <EventBackButton />
      <EventTitle title={event.title} />
      <EventMeta date={event.date} location={event.location} />
      {user?.isAdmin && <EventAdminActions eventId={event.id} />}
    </header>
  );
}

// components/event-main-content.tsx (120 lines)
export function EventMainContent({ event, className }) {
  return (
    <main className={className}>
      <EventDescription description={event.description} />
      <EventVariantsList variants={event.variants} />
      <EventLocationMap coordinates={event.coordinates} />
    </main>
  );
}

// components/event-sidebar.tsx (100 lines)
export function EventSidebar({ event, user }) {
  return (
    <aside>
      <EventRegistration event={event} user={user} />
      <EventPricingPhases phases={event.pricingPhases} />
      <FriendsGoing eventId={event.id} userId={user?.id} />
    </aside>
  );
}
```

### Benefits of Modular Architecture

1. **Maintainability**: Easier to understand, modify, and debug small components
2. **Reusability**: Components can be reused across different pages
3. **Testing**: Smaller components are easier to test in isolation
4. **Performance**: Better code splitting and lazy loading opportunities
5. **Collaboration**: Multiple developers can work on different components simultaneously
6. **Readability**: Clear component hierarchy makes the codebase self-documenting

### Refactoring Guidelines

When you encounter a large component:

1. **Identify logical sections**: Group related UI and logic
2. **Extract components**: Create separate files for each section
3. **Define clear props**: Each component should have well-defined inputs
4. **Maintain single responsibility**: Each component does one thing well
5. **Update imports**: Ensure all imports are correct after extraction
6. **Test thoroughly**: Verify functionality after refactoring

### GitHub Copilot Requirements for Modularity

When creating or modifying components, GitHub Copilot **MUST**:

1. **Always suggest component extraction** when a component exceeds 200 lines
2. **Propose clear component names** that describe their single purpose
3. **Create proper file structure** with components in appropriate directories
4. **Define clear props interfaces** for all extracted components
5. **Maintain consistency** with existing component patterns in the project
6. **Prioritize readability** over cleverness - clear code over compact code

**Remember**: Small, focused components are easier to maintain, test, and understand. Always favor modularity over monolithic files.
