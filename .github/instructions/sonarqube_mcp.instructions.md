---
applyTo: "**/*"
---

These are guidelines when using the SonarQube MCP server in the **Athlifyr** project — a multilingual Next.js application with strict TypeScript, code quality, and modularity standards.

# Important Tool Guidelines

## Basic Usage

- **IMPORTANT**: After you finish generating or modifying any code files at the very end of the task, you MUST call the `analyze_file_list` tool (if it exists) to analyze the files you created or modified.
- **IMPORTANT**: When starting a new task, you MUST disable automatic analysis with the `toggle_automatic_analysis` tool if it exists.
- **IMPORTANT**: When you are done generating code at the very end of the task, you MUST re-enable automatic analysis with the `toggle_automatic_analysis` tool if it exists.

## Project Keys

- When a user mentions a project key, use `search_my_sonarqube_projects` first to find the exact project key
- Don't guess project keys — always look them up

## Code Language Detection

- This project is primarily **TypeScript** (`.ts`, `.tsx`) with a **Next.js** framework
- When analyzing code snippets, detect the language from syntax; default to TypeScript if unclear
- Other languages in the project: SQL (Prisma), JSON (i18n messages), CSS (Tailwind)

## Branch and Pull Request Context

- This project follows a strict branch strategy:
  - `main` — integration branch, all development merges here first, protected, requires PR
  - `production/web` — web deployment branch, triggers CI/CD, semantic-release, and SonarCloud
  - `production/mobile` — mobile deployment branch, triggers iOS builds and App Store submissions
  - `feature/*` — new features and planned work
  - `hotfix/*` — urgent production fixes
- Many SonarQube operations support branch-specific analysis
- If the user mentions working on a `feature/*` or `hotfix/*` branch, always include the branch parameter
- If analyzing `production/web` or `production/mobile` branches, include the branch parameter
- PR titles follow Conventional Commits format — use this context when reviewing issues

## Code Issues and Violations

- After fixing issues, do not attempt to verify them using `search_sonar_issues_in_projects`, as the server will not yet reflect the updates

---

# Athlifyr-Specific Quality Rules

When analyzing or fixing SonarQube issues in this project, enforce these project-specific standards:

## TypeScript Strict Rules

- **NEVER use `any` type** — flag all `any` usages as critical issues
  - Use proper types, interfaces, or generics instead
  - `catch (error: any)` should be `catch (error)` + `if (error instanceof Error)`
- **NEVER use `unknown` unnecessarily** — use specific types whenever possible
- **All functions must have proper return types**
- **All parameters must have explicit types**
- When fixing type issues, prefer creating interfaces/types over using escape hatches

## Code Modularity

- Flag components exceeding **200-250 lines** as code smells — suggest extraction
- Each component should have a **single, clear responsibility**
- Large page components mixing logic, UI, and data fetching are anti-patterns
- Business logic should be extracted into custom hooks or utility functions under `lib/` or `hooks/`

## Internationalization (i18n)

- **NEVER hardcode user-facing text** — always use translation keys via `useTranslations` hook
- Hardcoded strings in UI components should be flagged as issues
- The project supports **6 languages**: en, pt (European Portuguese), es, fr, de, it
- All locale files are in `/messages/*.json`

## Security Standards

- Enforce OWASP Top 10 checks: injection, XSS, broken access control, SSRF, etc.
- Validate at system boundaries: user input, external APIs, form submissions
- Never expose secrets or credentials in code
- Ensure proper authentication/authorization checks on API routes

## Pre-Commit Quality Expectations

When issues are found, remind that the project requires all of these to pass before committing:

1. `pnpm format` — Prettier formatting
2. `pnpm lint` — ESLint (no warnings or errors)
3. `pnpm typecheck` — TypeScript strict mode (no errors)
4. `pnpm build` — Successful build

---

# Common Troubleshooting

## Authentication Issues

- SonarQube requires **USER tokens** (not project tokens)
- When the error `SonarQube answered with Not authorized` occurs, verify the token type

## Project Not Found

- Use `search_my_sonarqube_projects` to find available projects
- Verify project key spelling and format

## Code Analysis Issues

- Ensure programming language is correctly specified (default: TypeScript for this project)
- Remind users that snippet analysis doesn't replace full project scans
- Provide full file content for better analysis results
- For `.tsx` files, ensure SonarQube treats them as TypeScript with JSX
