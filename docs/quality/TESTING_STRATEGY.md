# Athlifyr — Comprehensive Testing Strategy

> **Version:** 1.0
> **Last Updated:** March 2026
> **Status:** Active
> **Audience:** Development Team, QA Team (Vanessa), Project Management

---

## Table of Contents

1. [Introduction](#1-introduction)
2. [Testing Objectives](#2-testing-objectives)
3. [Platform Architecture Overview](#3-platform-architecture-overview)
4. [Testing Types and Strategy](#4-testing-types-and-strategy)
5. [Testing Tools and Frameworks](#5-testing-tools-and-frameworks)
6. [Test Coverage Goals](#6-test-coverage-goals)
7. [Environment Strategy](#7-environment-strategy)
8. [Test Data Management](#8-test-data-management)
9. [QA Workflow and Processes](#9-qa-workflow-and-processes)
10. [Initial Test Suites and Test Cases](#10-initial-test-suites-and-test-cases)
11. [Regression Testing Strategy](#11-regression-testing-strategy)
12. [Performance and Load Testing](#12-performance-and-load-testing)
13. [Security Testing](#13-security-testing)
14. [Mobile Testing Strategy](#14-mobile-testing-strategy)
15. [CI/CD Integration](#15-cicd-integration)
16. [Bug Lifecycle and Defect Management](#16-bug-lifecycle-and-defect-management)
17. [Reporting and Metrics](#17-reporting-and-metrics)
18. [Risks and Mitigations](#18-risks-and-mitigations)
19. [Appendix](#19-appendix)

---

## 1. Introduction

### 1.1 Purpose

This document defines the comprehensive testing strategy for the **Athlifyr** platform — a multilingual sports and fitness application encompassing a web platform, mobile application, LiveRace tracking engine, and supporting backend services.

The strategy establishes standardized testing practices, tools, workflows, and coverage goals to ensure high reliability, scalability, and quality before production releases.

### 1.2 Scope

This strategy covers testing across all Athlifyr systems:

| System | Technology | Description |
|--------|-----------|-------------|
| **Backend API** | Next.js API Routes, Prisma, PostgreSQL | RESTful API handling authentication, events, venues, payments, and social features |
| **Web Frontend** | Next.js 16, React 19, Tailwind CSS, Radix UI | Multilingual web application with SSR/SSG |
| **Mobile App** | Expo / React Native | iOS and Android companion application |
| **LiveRace Engine** | NestJS, Socket.io | Real-time race tracking with WebSocket communication |
| **Database** | PostgreSQL, Prisma ORM | 80+ data models with complex relational schema |
| **Infrastructure** | Vercel, Railway, Neon, GitHub Actions | CI/CD, hosting, and deployment services |

### 1.3 Definitions

| Term | Definition |
|------|-----------|
| **SUT** | System Under Test |
| **UAT** | User Acceptance Testing |
| **E2E** | End-to-End Testing |
| **API** | Application Programming Interface |
| **QG** | Quality Gate (SonarCloud) |
| **MSW** | Mock Service Worker |
| **RTL** | React Testing Library |

---

## 2. Testing Objectives

### 2.1 Primary Goals

1. **Ensure functional correctness** across all platform features and user flows
2. **Prevent regressions** when introducing new features or fixing bugs
3. **Validate security** of authentication, authorization, and payment systems
4. **Verify performance** under expected and peak load conditions
5. **Guarantee multilingual integrity** across all 6 supported languages (en, pt, es, fr, de, it)
6. **Validate real-time systems** — LiveRace tracking, WebSocket communication, and live updates

### 2.2 Quality Principles

- **Shift-Left Testing**: Catch defects early through unit and integration testing
- **Automation First**: Automate repetitive tests to reduce manual effort
- **Risk-Based Testing**: Prioritize testing of critical business flows (payments, authentication, live tracking)
- **Continuous Validation**: Tests run on every PR via CI/CD pipeline
- **Cross-Platform Consistency**: Ensure parity between web and mobile experiences

---

## 3. Platform Architecture Overview

### 3.1 High-Level Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                          Clients                                  │
│  ┌─────────────┐  ┌──────────────┐  ┌─────────────────────────┐ │
│  │  Web App    │  │  Mobile App  │  │  LiveRace Presentation  │ │
│  │  (Next.js)  │  │  (Expo/RN)   │  │  (Next.js /live)        │ │
│  └──────┬──────┘  └──────┬───────┘  └────────────┬────────────┘ │
└─────────┼────────────────┼───────────────────────┼──────────────┘
          │                │                       │
          ▼                ▼                       ▼
┌──────────────────────────────────────────────────────────────────┐
│                     API Layer (Next.js API Routes)                │
│  ┌──────┐ ┌───────┐ ┌────────┐ ┌────────┐ ┌──────────────────┐ │
│  │ Auth │ │Events │ │Venues  │ │Payment │ │ Social/Messaging │ │
│  └──────┘ └───────┘ └────────┘ └────────┘ └──────────────────┘ │
└─────────────────────────────┬────────────────────────────────────┘
                              │
          ┌───────────────────┼───────────────────┐
          ▼                   ▼                   ▼
┌──────────────┐  ┌────────────────┐  ┌────────────────────┐
│  PostgreSQL  │  │   LiveRace     │  │  External Services │
│  (Prisma)    │  │   (NestJS +    │  │  Stripe, S3, Resend│
│              │  │    Socket.io)  │  │  OpenAI, Mapbox    │
└──────────────┘  └────────────────┘  └────────────────────┘
```

### 3.2 Critical User Flows

The following flows require comprehensive test coverage:

| Priority | Flow | Systems Involved |
|----------|------|-----------------|
| **P0** | User Registration and Login | Auth API, Database, Email (Resend) |
| **P0** | Event Registration and Payment | Events API, Stripe, Database |
| **P0** | LiveRace Real-Time Tracking | LiveRace Engine, WebSocket, Database |
| **P0** | Venue Booking and Payment | Venues API, Stripe, Database |
| **P1** | Venue Management (Owner/Coach) | Venues API, Database, Stripe Connect |
| **P1** | Event Management and Organization | Events API, Database, File Storage |
| **P1** | Mobile Authentication | Mobile App, Auth API, Google OAuth |
| **P2** | Training Plans and Workouts | API, Database |
| **P2** | Social Features (Posts, Comments) | API, Database, Real-time |
| **P2** | AI Video Analysis | API, OpenAI, File Storage |
| **P3** | Push Notifications | API, Web Push, Mobile Push |
| **P3** | Chat and Messaging | API, WebSocket |
| **P3** | Giveaway System | API, Database, CRON |

---

## 4. Testing Types and Strategy

### 4.1 Unit Testing

**Purpose:** Validate individual functions, utilities, and components in isolation.

**Scope:**
- API route handlers (request/response validation)
- Business logic functions (`lib/` utilities)
- React component rendering and behavior
- Prisma query builders and data transformations
- Validation schemas (Zod)
- Custom hooks

**Approach:**
- Mock external dependencies (database, external APIs, authentication)
- Test pure functions with multiple input scenarios
- Verify error handling and edge cases
- Test component rendering with React Testing Library

**Existing Coverage:**
- `__tests__/api/` — 25 API route tests
- `__tests__/lib/` — 10 utility/library tests
- `__tests__/components/` — 11 component tests

**Conventions:**
- Test files mirror source structure under `__tests__/`
- File naming: `{module-name}.test.ts` or `{module-name}.test.tsx`
- Use `jest.mock()` for module mocking
- Use MSW for API request interception when needed

### 4.2 Integration Testing

**Purpose:** Verify that multiple modules work correctly together.

**Scope:**
- API endpoints with database interactions
- Authentication flows with session management
- Payment processing with Stripe webhook handling
- File upload with S3/Backblaze storage
- Email sending with Resend
- Venue booking with scheduling logic

**Approach:**
- Test API routes with mocked database (Prisma client mock)
- Verify request → processing → response chains
- Test authentication middleware integration
- Validate webhook processing end-to-end

**Existing Coverage:**
- `__tests__/api/venues/bookings/cancel-booking-integration.test.ts`
- Jest config excludes files matching `integration.test.` from standard runs

**Conventions:**
- Integration test files suffixed with `-integration.test.ts`
- Run separately from unit tests when needed
- May require test database or external service mocks

### 4.3 End-to-End (E2E) Testing

**Purpose:** Validate complete user journeys through the application.

**Scope:**
- Authentication flows (login, register, password reset, Google OAuth)
- Event discovery, registration, and payment
- Venue discovery, booking, and management
- Role-based access control (Admin, Owner, Coach, Member, Free User)
- Multilingual navigation and content
- LiveRace presentation and tracking pages

**Approach:**
- Use Playwright with Chromium browser
- Test against running development server
- Use test user accounts (see `docs/TEST_USERS.md`)
- Validate visual elements, navigation, and data flow
- Capture screenshots on failure

**Existing Coverage:**
- `tests/e2e/auth-users.spec.ts` — Authentication and role-based testing
- `tests/e2e/functional-tests.spec.ts` — Core functional flows

**Available Test Scripts:**
```bash
pnpm test:e2e                    # All E2E tests
pnpm test:e2e:auth               # Authentication tests
pnpm test:e2e:functional         # Functional tests
pnpm test:e2e:admin              # Admin role tests
pnpm test:e2e:owner              # Owner role tests
pnpm test:e2e:coach              # Coach role tests
pnpm test:e2e:member             # Member role tests
pnpm test:e2e:free               # Free user tests
pnpm test:e2e:security           # Security tests
pnpm test:e2e:i18n               # Internationalization tests
```

**Conventions:**
- Tests located in `tests/e2e/`
- File naming: `{feature}.spec.ts`
- Sequential execution (not parallel) to avoid conflicts
- HTML reporter for test results
- Screenshots captured only on failure

### 4.4 API Testing

**Purpose:** Validate API contracts, request/response formats, and error handling.

**Scope:**
- All API routes under `app/api/`
- Request validation (method, headers, body)
- Response status codes and body structure
- Authentication and authorization checks
- Rate limiting and input sanitization
- Error responses and edge cases

**Approach:**
- Unit test API handlers with mocked dependencies
- Validate Zod schema enforcement
- Test authenticated and unauthenticated requests
- Verify proper HTTP status codes (200, 201, 400, 401, 403, 404, 500)
- Test pagination, filtering, and sorting

**API Endpoint Groups (40+ routes):**

| Group | Endpoints | Priority |
|-------|-----------|----------|
| Auth | `/api/auth/login`, `/api/auth/register`, `/api/auth/[...nextauth]`, `/api/auth/google`, `/api/auth/verify-email`, `/api/auth/forgot-password` | P0 |
| Events | `/api/events/[id]`, `/api/events/[id]/live-*`, `/api/events/checkin` | P0 |
| Registrations | `/api/registrations/`, `/api/events/[id]/registrations/export` | P0 |
| Venues | `/api/venues/[id]`, `/api/venues/map`, `/api/venues/invites` | P0 |
| Payments | Stripe webhook handlers, checkout sessions | P0 |
| User Profile | `/api/me`, `/api/me/bookings`, `/api/me/subscriptions` | P1 |
| Training | `/api/training-plans/[id]`, `/api/exercises/` | P2 |
| Social | `/api/posts/`, `/api/contact` | P2 |
| Admin | `/api/admin/*` | P1 |
| Internal/LiveRace | `/api/internal/live-*` | P0 |

### 4.5 UI Testing

**Purpose:** Validate UI components render correctly with proper styling, accessibility, and responsiveness.

**Scope:**
- Component rendering with different props and states
- User interaction flows (clicks, form submissions, navigation)
- Responsive layout behavior
- Dark/light theme switching
- Accessibility compliance (ARIA attributes, keyboard navigation)
- Animation and transition behavior

**Approach:**
- Use React Testing Library for component testing
- Test component composition and prop passing
- Validate conditional rendering logic
- Test form validation feedback
- Verify error states and loading indicators

### 4.6 Performance Testing

**Purpose:** Validate system behavior under load and ensure acceptable response times.

**Scope:**
- API response times under normal and peak load
- Database query performance (N+1 detection)
- WebSocket connection handling (LiveRace)
- Page load times and Core Web Vitals
- Image and asset optimization
- Bundle size analysis

**Approach:**
- Use k6 for API load testing
- Use Lighthouse for web performance audits
- Monitor Vercel Analytics and Speed Insights
- Use SonarCloud for code complexity analysis
- Profile database queries with Prisma logging

**Targets:**

| Metric | Target |
|--------|--------|
| API response time (P95) | < 500ms |
| Page load time (LCP) | < 2.5s |
| Time to Interactive (TTI) | < 3.5s |
| Cumulative Layout Shift (CLS) | < 0.1 |
| WebSocket latency | < 100ms |
| Concurrent users supported | 1000+ |

### 4.7 Security Testing

See [Section 13: Security Testing](#13-security-testing) for detailed strategy.

### 4.8 Regression Testing

See [Section 11: Regression Testing Strategy](#11-regression-testing-strategy) for detailed strategy.

### 4.9 Mobile Device Testing

See [Section 14: Mobile Testing Strategy](#14-mobile-testing-strategy) for detailed strategy.

---

## 5. Testing Tools and Frameworks

### 5.1 Current Tooling (Already Integrated)

| Tool | Purpose | Version | Configuration |
|------|---------|---------|---------------|
| **Jest** | Unit and integration testing | 30.2.0 | `jest.config.js` |
| **React Testing Library** | Component testing | 16.3.0 | Via `@testing-library/react` |
| **@testing-library/jest-dom** | DOM matchers | 6.9.1 | `jest.setup.ts` |
| **@testing-library/user-event** | User interaction simulation | 14.6.1 | Per-test import |
| **Playwright** | E2E browser testing | 1.58.0 | `playwright.config.ts` |
| **MSW** | API mocking | 2.12.4 | Per-test setup |
| **SWC/Jest** | Fast test transpilation | 0.2.39 | Jest transform |
| **SonarCloud** | Static analysis and coverage | — | `sonar-project.properties` |

### 5.2 Recommended Additional Tools

| Tool | Purpose | Recommendation |
|------|---------|---------------|
| **k6** | API load and performance testing | Load test critical API endpoints before releases |
| **Lighthouse CI** | Web performance auditing | Integrate into CI to track Core Web Vitals |
| **OWASP ZAP** | Dynamic security scanning | Run against staging environment before production |
| **Detox** (or **Maestro**) | Mobile E2E testing | Automated testing on iOS/Android simulators |
| **Postman / Bruno** | Manual API exploration | Already referenced in `POSTMAN_SETUP.md`; useful for QA manual testing |
| **Storybook** | Component visual testing | Optional — useful for isolated component development and visual regression |

### 5.3 Tool Selection Rationale

```
Unit Tests            → Jest + RTL           (already integrated, fast, reliable)
Integration Tests     → Jest + MSW           (mock external services, test API chains)
E2E Tests (Web)       → Playwright           (already integrated, Chromium-based)
E2E Tests (Mobile)    → Detox or Maestro     (native simulator testing)
Performance Tests     → k6 + Lighthouse CI   (industry standard, scriptable)
Security Tests        → SonarCloud + ZAP     (static + dynamic analysis)
API Exploration       → Postman / Bruno      (manual QA testing)
Code Quality          → SonarCloud + ESLint  (automated quality gates)
```

---

## 6. Test Coverage Goals

### 6.1 Coverage Targets

| Area | Current State | Target | Timeline |
|------|--------------|--------|----------|
| **API Route Handlers** | ~25 tests | 80% line coverage | Sprint 3 |
| **Library/Utilities** | ~10 tests | 90% line coverage | Sprint 2 |
| **React Components** | ~11 tests | 60% line coverage | Sprint 4 |
| **E2E Critical Flows** | 2 spec files | 100% of P0 flows | Sprint 3 |
| **LiveRace Engine** | 1 test | 80% line coverage | Sprint 3 |
| **Mobile App** | 0 tests | 50% line coverage | Sprint 5 |
| **Overall Project** | ~50 tests | 70% line coverage | Sprint 6 |

### 6.2 Critical Flow Validation (P0)

These flows must have **100% test coverage** (unit + E2E):

| Flow | Unit Tests | E2E Tests | Status |
|------|-----------|-----------|--------|
| User Registration (email) | ⬜ | ⬜ | Planned |
| User Login (email + password) | ⬜ | ✅ | Partial |
| Google OAuth Login | ✅ | ⬜ | Partial |
| Event Registration + Payment | ✅ | ⬜ | Partial |
| LiveRace Start/Stop/Track | ✅ | ⬜ | Partial |
| Venue Booking + Cancellation | ✅ | ⬜ | Partial |
| Stripe Webhook Processing | ⬜ | ⬜ | Planned |
| Admin User Management | ⬜ | ⬜ | Planned |

### 6.3 SonarCloud Quality Gate

The project enforces these quality thresholds on new code via SonarCloud:

| Metric | Threshold |
|--------|-----------|
| Coverage on New Code | ≥ 60% |
| Duplications on New Code | ≤ 3% |
| Reliability Rating | A |
| Security Rating | A |
| Maintainability Rating | A |
| New Bugs | 0 |
| New Vulnerabilities | 0 |

---

## 7. Environment Strategy

### 7.1 Environment Overview

| Environment | Purpose | Database | URL |
|-------------|---------|----------|-----|
| **Local** | Developer workstation | Local PostgreSQL or Neon Dev | `localhost:3000` |
| **CI** | Automated test execution (GitHub Actions) | Mocked (Jest) / Neon Dev (E2E) | N/A |
| **Staging** | Pre-production validation, QA testing | Neon Staging | Vercel Preview URL |
| **Production** | Live platform | Neon Production | `athlifyr.com` |

### 7.2 Environment Usage by Test Type

| Test Type | Environment | Database |
|-----------|-------------|----------|
| Unit Tests | CI (GitHub Actions) | Mocked via `jest.mock()` |
| Integration Tests | CI | Mocked Prisma Client |
| E2E Tests | Local / CI | Development Database |
| Performance Tests | Staging | Staging Database |
| Security Tests | Staging | Staging Database |
| UAT / Manual QA | Staging | Staging Database |

### 7.3 Test Data Management

- **Unit/Integration Tests**: Use mocked data defined inline in test files
- **E2E Tests**: Use dedicated test user accounts (see `docs/TEST_USERS.md`)
- **Database Seeding**: Prisma seed scripts in `/prisma/seeds/` for consistent test data
- **Data Reset**: `pnpm prisma migrate reset` or `pnpm prisma db seed` for clean state

---

## 8. Test Data Management

### 8.1 Test Users

The platform maintains 8 test user accounts covering all roles and scenarios:

| User | Role | Purpose |
|------|------|---------|
| Admin Master | ADMIN | Admin panel, moderation |
| João Owner | USER (Venue Owner) | Venue management, owner dashboard |
| Maria Coach | USER (Coach) | Coach dashboard, class management |
| Pedro Atleta | USER (Member) | Bookings, subscriptions, events |
| Ana Free | USER (Free) | Independent athlete, event discovery |
| Carlos Multi | USER (Multi-role) | Multiple venues, role switching |
| Sofia Nova | USER (New) | Onboarding, email verification |
| Banned User | USER (Banned) | Access restriction validation |

> Full details in `docs/TEST_USERS.md`

### 8.2 Test Data Principles

1. **Isolation**: Tests must not depend on or modify shared state
2. **Idempotency**: Tests should produce the same results on repeated runs
3. **Completeness**: Test data should cover happy paths, edge cases, and error states
4. **Cleanup**: E2E tests should clean up any created data after execution
5. **Determinism**: Avoid using random or time-dependent data without seeding

### 8.3 Mock Data Strategy

| Layer | Mocking Approach |
|-------|-----------------|
| Database (Prisma) | `jest.mock("@/lib/prisma")` with typed mock returns |
| Authentication | `jest.mock("next-auth/react")` with configurable session |
| External APIs (Stripe, OpenAI) | MSW handlers or `jest.mock()` |
| File Storage (S3/B2) | `jest.mock("@aws-sdk/client-s3")` |
| Email (Resend) | `jest.mock("resend")` |
| Socket.io | Mock server instances for WebSocket testing |

---

## 9. QA Workflow and Processes

### 9.1 QA Team Structure

| Role | Person | Responsibilities |
|------|--------|-----------------|
| **QA Tester** | Vanessa | Test case creation, manual testing, bug reporting, regression testing |
| **Developers** | Dev Team | Unit tests, integration tests, code reviews, bug fixes |
| **QA Lead** | TBD | Test strategy oversight, test plan reviews, release sign-off |

### 9.2 QA Workflow for Vanessa

#### Daily QA Activities

```
1. Review new PRs and associated changes
2. Execute manual test cases for features in review
3. Verify bug fixes against original issue
4. Update test case status in Azure DevOps
5. Report new bugs with reproduction steps
```

#### Sprint QA Activities

```
Sprint Planning:
  → Review user stories for testability
  → Estimate testing effort for each story
  → Identify test case creation needs

During Sprint:
  → Create test cases for new features
  → Execute test cases as features are completed
  → Perform exploratory testing
  → Report and track bugs

Sprint Review:
  → Present test execution results
  → Report test coverage metrics
  → Demonstrate critical flow validation

Sprint Retrospective:
  → Identify testing bottlenecks
  → Propose process improvements
  → Update testing strategy as needed
```

#### QA Process per Feature

```
┌─────────────────┐
│ 1. Feature       │
│    Specification │
│    Review        │
└────────┬────────┘
         ▼
┌─────────────────┐
│ 2. Test Case     │
│    Creation      │
│    (Azure DevOps)│
└────────┬────────┘
         ▼
┌─────────────────┐
│ 3. Development   │
│    Complete      │
│    (PR Created)  │
└────────┬────────┘
         ▼
┌─────────────────┐
│ 4. Smoke Testing │
│    (Quick        │
│     Validation)  │
└────────┬────────┘
         ▼
┌─────────────────┐
│ 5. Full Test     │
│    Execution     │
│    (Manual +     │
│     Automated)   │
└────────┬────────┘
         ▼
┌─────────────────┐     ┌──────────────┐
│ 6. Pass/Fail?   │────▶│ 7. Bug Report│
│                 │Fail │    (Azure    │
│                 │     │     DevOps)  │
└────────┬────────┘     └──────────────┘
         │ Pass
         ▼
┌─────────────────┐
│ 8. Sign-off and │
│    PR Approval  │
└─────────────────┘
```

### 9.3 Bug Reporting Standards

Every bug report in Azure DevOps must include:

| Field | Description | Example |
|-------|-------------|---------|
| **Title** | Clear, concise description | "Event registration fails when selecting relay variant" |
| **Severity** | Critical / High / Medium / Low | Critical |
| **Priority** | P0 / P1 / P2 / P3 | P0 |
| **Environment** | Where the bug was found | Staging / Production / Local |
| **Browser/Device** | Browser version or device | Chrome 120 / iPhone 15 Pro |
| **Steps to Reproduce** | Numbered step-by-step instructions | 1. Navigate to... 2. Click... |
| **Expected Result** | What should happen | Registration completes successfully |
| **Actual Result** | What actually happens | 500 error displayed |
| **Screenshots/Video** | Visual evidence | Attached |
| **Test Data Used** | User account, event, etc. | Pedro Atleta, Trail Manuelino 2026 |
| **Related User Story** | Azure DevOps link | US-123 |

### 9.4 Release QA Checklist

Before any production release, the following must be validated:

- [ ] All P0 test cases pass
- [ ] No open P0/P1 bugs
- [ ] Regression test suite passes
- [ ] SonarCloud Quality Gate passes
- [ ] Performance benchmarks within targets
- [ ] All 6 languages validated for new features
- [ ] Mobile app compatibility verified
- [ ] Stripe payment flows verified in test mode
- [ ] LiveRace flows verified (if applicable)
- [ ] Post-deployment verification plan ready

---

## 10. Initial Test Suites and Test Cases

### 10.1 Test Suite: Authentication (AUTH)

| ID | Test Case | Type | Priority | Status |
|----|-----------|------|----------|--------|
| AUTH-001 | Register new user with valid email and password | E2E | P0 | Planned |
| AUTH-002 | Register with already existing email shows error | Unit + E2E | P0 | Planned |
| AUTH-003 | Login with valid credentials | E2E | P0 | Existing |
| AUTH-004 | Login with invalid password shows error | Unit + E2E | P0 | Planned |
| AUTH-005 | Google OAuth login flow | Unit + E2E | P0 | Partial |
| AUTH-006 | Email verification flow | E2E | P0 | Planned |
| AUTH-007 | Password reset request and completion | E2E | P1 | Planned |
| AUTH-008 | Session expiration and refresh | Unit | P1 | Planned |
| AUTH-009 | Banned user cannot login | E2E | P1 | Planned |
| AUTH-010 | Unverified user limitations | E2E | P2 | Planned |
| AUTH-011 | Mobile app Google OAuth flow | Mobile E2E | P0 | Planned |
| AUTH-012 | JWT token validation for API requests | Unit | P0 | Planned |

### 10.2 Test Suite: Events (EVT)

| ID | Test Case | Type | Priority | Status |
|----|-----------|------|----------|--------|
| EVT-001 | List events with pagination and filtering | Unit + E2E | P0 | Planned |
| EVT-002 | View event details in all 6 languages | E2E | P0 | Planned |
| EVT-003 | Register for a free event | E2E | P0 | Planned |
| EVT-004 | Register for a paid event (Stripe checkout) | Unit + E2E | P0 | Partial |
| EVT-005 | Cancel event registration | E2E | P1 | Planned |
| EVT-006 | Event organizer creates new event | E2E | P1 | Planned |
| EVT-007 | Event organizer edits existing event | E2E | P1 | Planned |
| EVT-008 | Event variant selection and pricing phases | Unit | P0 | Partial |
| EVT-009 | Export registration list (CSV) | Unit | P1 | Existing |
| EVT-010 | Event check-in flow | Unit | P0 | Existing |
| EVT-011 | Event search by location and sport type | E2E | P2 | Planned |
| EVT-012 | Event SEO metadata in all languages | Unit | P2 | Planned |
| EVT-013 | Event FAQ display and management | E2E | P2 | Planned |
| EVT-014 | Event weather information display | Unit | P3 | Planned |
| EVT-015 | Custom fields in event registration | E2E | P1 | Planned |

### 10.3 Test Suite: Venues and Gyms (VEN)

| ID | Test Case | Type | Priority | Status |
|----|-----------|------|----------|--------|
| VEN-001 | Discover venues on map | E2E | P1 | Planned |
| VEN-002 | View venue details and schedule | E2E | P1 | Planned |
| VEN-003 | Book a gym class/session | E2E | P0 | Planned |
| VEN-004 | Cancel a booking | Unit + E2E | P0 | Existing |
| VEN-005 | Owner creates venue | E2E | P1 | Planned |
| VEN-006 | Owner manages members (invite, remove, change role) | E2E | P1 | Planned |
| VEN-007 | Owner creates and manages sessions | E2E | P1 | Planned |
| VEN-008 | Coach views assigned classes | E2E | P1 | Planned |
| VEN-009 | Member subscribes to a venue plan | E2E | P0 | Planned |
| VEN-010 | Venue booking validation (capacity, time conflicts) | Unit | P0 | Existing |
| VEN-011 | Venue authorization rules | Unit | P0 | Existing |
| VEN-012 | Recurring session generation | Unit | P1 | Planned |
| VEN-013 | Trial booking flow | E2E | P1 | Planned |
| VEN-014 | Venue review submission and display | E2E | P2 | Planned |
| VEN-015 | Venue ownership claim | E2E | P2 | Planned |

### 10.4 Test Suite: LiveRace Tracking (LR)

| ID | Test Case | Type | Priority | Status |
|----|-----------|------|----------|--------|
| LR-001 | LiveRace readiness validation | Unit | P0 | Existing |
| LR-002 | Start live race | Unit | P0 | Existing |
| LR-003 | Stop live race | Unit | P0 | Existing |
| LR-004 | Checkpoint time recording | Unit | P0 | Existing |
| LR-005 | Route engine calculations | Unit | P0 | Existing |
| LR-006 | LiveRace presentation page rendering | Unit | P0 | Existing |
| LR-007 | WebSocket connection and real-time updates | Integration | P0 | Planned |
| LR-008 | Final leaderboard generation | Unit | P0 | Existing |
| LR-009 | LiveRace status transitions | Unit | P0 | Existing |
| LR-010 | Concurrent participant tracking | Performance | P1 | Planned |
| LR-011 | Checkpoint order validation (FINISH must be max) | Unit | P0 | Existing |
| LR-012 | Live friends tracking | Unit | P1 | Existing |
| LR-013 | Results export | Unit | P1 | Planned |
| LR-014 | LiveRace authentication (internal API) | Unit | P0 | Existing |

### 10.5 Test Suite: Payments (PAY)

| ID | Test Case | Type | Priority | Status |
|----|-----------|------|----------|--------|
| PAY-001 | Create Stripe checkout session for event | Unit | P0 | Existing |
| PAY-002 | Process successful payment webhook | Unit | P0 | Planned |
| PAY-003 | Handle failed payment webhook | Unit | P0 | Planned |
| PAY-004 | Venue subscription payment | E2E | P0 | Planned |
| PAY-005 | Subscription renewal and cancellation | Unit | P0 | Planned |
| PAY-006 | Stripe Connect for venue owners | E2E | P1 | Planned |
| PAY-007 | Refund processing | Unit | P1 | Planned |
| PAY-008 | Pricing phase transitions | Unit | P0 | Planned |
| PAY-009 | Currency handling | Unit | P1 | Planned |

### 10.6 Test Suite: Mobile Application (MOB)

| ID | Test Case | Type | Priority | Status |
|----|-----------|------|----------|--------|
| MOB-001 | App launch and splash screen | Mobile E2E | P0 | Planned |
| MOB-002 | Login flow (email + Google) | Mobile E2E | P0 | Planned |
| MOB-003 | Event browsing and details | Mobile E2E | P1 | Planned |
| MOB-004 | Venue map and search | Mobile E2E | P1 | Planned |
| MOB-005 | Push notification receipt and handling | Mobile E2E | P1 | Planned |
| MOB-006 | Chat messaging | Mobile E2E | P2 | Planned |
| MOB-007 | Motion analysis video capture | Mobile E2E | P2 | Planned |
| MOB-008 | Offline behavior and connectivity | Mobile E2E | P1 | Planned |
| MOB-009 | Deep linking | Mobile E2E | P2 | Planned |

### 10.7 Test Suite: Administration (ADM)

| ID | Test Case | Type | Priority | Status |
|----|-----------|------|----------|--------|
| ADM-001 | Admin dashboard access (ADMIN role only) | E2E | P0 | Planned |
| ADM-002 | User management (ban/unban) | E2E | P1 | Planned |
| ADM-003 | Event moderation (approve, edit, delete) | E2E | P1 | Planned |
| ADM-004 | Venue management and claims | E2E | P1 | Planned |
| ADM-005 | Content moderation (posts, comments) | E2E | P2 | Planned |
| ADM-006 | Giveaway management | E2E | P2 | Planned |
| ADM-007 | Analytics and reporting dashboard | E2E | P2 | Planned |

### 10.8 Test Suite: Internationalization (I18N)

| ID | Test Case | Type | Priority | Status |
|----|-----------|------|----------|--------|
| I18N-001 | Language switching in navigation | E2E | P1 | Planned |
| I18N-002 | All pages render in all 6 languages | E2E | P1 | Planned |
| I18N-003 | Date and currency formatting per locale | Unit | P1 | Planned |
| I18N-004 | Event translations display correctly | E2E | P1 | Planned |
| I18N-005 | SEO metadata in correct language | Unit | P2 | Planned |
| I18N-006 | Missing translation fallback behavior | Unit | P2 | Planned |
| I18N-007 | RTL support readiness (future) | Unit | P3 | Planned |

---

## 11. Regression Testing Strategy

### 11.1 Approach

Regression testing ensures that existing functionality remains intact after code changes. The strategy combines automated and manual approaches:

```
Code Change (PR)
      │
      ▼
┌──────────────────┐
│ Automated        │
│ Regression       │
│ (CI Pipeline)    │
│                  │
│ • Jest unit tests│
│ • SonarCloud QG  │
│ • TypeScript     │
│   typecheck      │
│ • ESLint         │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Manual           │
│ Regression       │
│ (QA Tester)      │
│                  │
│ • P0 flow        │
│   validation     │
│ • Visual/UI      │
│   checks         │
│ • Cross-browser  │
│   testing        │
└──────────────────┘
```

### 11.2 Automated Regression

Runs on **every PR** via GitHub Actions:

1. **TypeScript Compilation**: `pnpm typecheck`
2. **Linting**: `pnpm lint`
3. **Unit Tests**: `pnpm test`
4. **Code Coverage**: `pnpm test:coverage`
5. **SonarCloud Analysis**: Static analysis and quality gate

### 11.3 Manual Regression Checklist

Before each production release:

- [ ] Login and registration flows
- [ ] Event listing, details, and registration
- [ ] Venue listing, details, and booking
- [ ] LiveRace start, track, and results (if applicable)
- [ ] Payment processing (test mode)
- [ ] Admin panel functionality
- [ ] Mobile app core flows
- [ ] Language switching and translations
- [ ] Navigation and routing
- [ ] Error pages and edge cases

### 11.4 Regression Test Triggers

| Change Type | Regression Scope |
|-------------|-----------------|
| API route modification | Related API tests + E2E flows |
| Component modification | Component tests + visual check |
| Database schema change | All integration tests + E2E |
| Authentication change | Full auth suite + all E2E |
| Payment logic change | Payment suite + event/venue E2E |
| i18n change | I18N suite + visual check |
| Infrastructure change | Full regression suite |

---

## 12. Performance and Load Testing

### 12.1 Performance Test Plan

#### API Load Testing (k6)

```
Scenarios:
1. Normal Load     → 100 concurrent users,  5 min duration
2. Peak Load       → 500 concurrent users, 10 min duration
3. Stress Test     → 1000 concurrent users, 15 min duration
4. Spike Test      → 0→500 users in 30s,    5 min hold
5. Endurance Test  → 200 concurrent users,  60 min duration
```

#### Target API Endpoints for Load Testing

| Endpoint | Scenario | Expected P95 |
|----------|----------|-------------|
| `GET /api/events` | List events | < 300ms |
| `GET /api/events/[id]` | Event details | < 200ms |
| `POST /api/registrations` | Event registration | < 500ms |
| `GET /api/venues/map` | Venue map data | < 400ms |
| `POST /api/auth/login` | User login | < 300ms |
| `WS /live` | WebSocket connection | < 100ms |

#### Web Performance Targets (Lighthouse)

| Metric | Mobile | Desktop |
|--------|--------|---------|
| Performance Score | ≥ 70 | ≥ 85 |
| Largest Contentful Paint | < 3.0s | < 2.0s |
| First Input Delay | < 200ms | < 100ms |
| Cumulative Layout Shift | < 0.1 | < 0.1 |
| Time to Interactive | < 5.0s | < 3.0s |

### 12.2 LiveRace Specific Performance

| Scenario | Target |
|----------|--------|
| Simultaneous active races | 10+ |
| Participants per race | 500+ |
| Checkpoint update latency | < 200ms |
| Leaderboard refresh rate | < 1s |
| WebSocket reconnection time | < 3s |

---

## 13. Security Testing

### 13.1 Security Testing Approach

| Layer | Testing Method | Tool |
|-------|---------------|------|
| **Static Analysis** | Automated code scanning | SonarCloud (integrated in CI) |
| **Dependency Scanning** | Vulnerability detection in dependencies | `npm audit`, GitHub Dependabot |
| **API Security** | Authentication, authorization, injection | Manual testing + OWASP ZAP |
| **Authentication** | Session management, token security | Manual testing + automated checks |
| **Authorization** | Role-based access control validation | E2E tests per role |
| **Input Validation** | XSS, SQL injection, SSRF prevention | Manual testing + automated scanning |
| **Payment Security** | PCI compliance, Stripe integration | Stripe test mode validation |

### 13.2 Security Test Cases

| ID | Test Case | Priority |
|----|-----------|----------|
| SEC-001 | API endpoints require authentication where expected | P0 |
| SEC-002 | Admin endpoints reject non-ADMIN users | P0 |
| SEC-003 | Venue owner endpoints reject non-owners | P0 |
| SEC-004 | SQL injection prevention in search/filter parameters | P0 |
| SEC-005 | XSS prevention in user-generated content (posts, comments) | P0 |
| SEC-006 | CSRF protection on state-changing operations | P0 |
| SEC-007 | Rate limiting on authentication endpoints | P1 |
| SEC-008 | Stripe webhook signature verification | P0 |
| SEC-009 | File upload validation (type, size, content) | P1 |
| SEC-010 | JWT token expiration and rotation | P1 |
| SEC-011 | Sensitive data not exposed in API responses | P0 |
| SEC-012 | HTTPS enforcement | P0 |
| SEC-013 | CORS policy validation | P1 |
| SEC-014 | Password strength requirements enforcement | P1 |
| SEC-015 | Account lockout after failed login attempts | P2 |

### 13.3 OWASP Top 10 Coverage

| Risk | Testing Approach | Status |
|------|-----------------|--------|
| A01 - Broken Access Control | Role-based E2E tests, API auth tests | Partial |
| A02 - Cryptographic Failures | Review password hashing (bcrypt), token generation | Planned |
| A03 - Injection | Input validation testing, parameterized queries (Prisma) | Partial |
| A04 - Insecure Design | Architecture review, threat modeling | Planned |
| A05 - Security Misconfiguration | Environment configuration review | Planned |
| A06 - Vulnerable Components | Dependency scanning, `npm audit` | Active |
| A07 - Auth Failures | Authentication flow testing | Partial |
| A08 - Software Integrity | CI/CD pipeline security, dependency verification | Active |
| A09 - Logging Failures | Log review, Sentry integration validation | Planned |
| A10 - SSRF | Server-side request validation testing | Planned |

---

## 14. Mobile Testing Strategy

### 14.1 Mobile App Overview

The Athlifyr mobile app is built with **Expo / React Native** and provides:
- Event browsing and registration
- Venue discovery via map
- Push notifications
- Chat messaging
- Motion analysis (video capture)
- Google OAuth authentication

### 14.2 Mobile Testing Approach

| Level | Tool | Scope |
|-------|------|-------|
| **Unit Tests** | Jest + React Native Testing Library | Components, hooks, utilities |
| **Integration Tests** | Jest + MSW | API communication, state management |
| **E2E Tests** | Detox or Maestro | Full user flows on simulators |
| **Device Testing** | Physical devices / BrowserStack | Cross-device compatibility |
| **Performance** | React Native Performance Monitor | Frame rate, memory, startup time |

### 14.3 Device Coverage Matrix

| Device | OS Version | Priority |
|--------|-----------|----------|
| iPhone 15 Pro | iOS 17+ | P0 |
| iPhone 14 | iOS 16+ | P0 |
| iPhone SE (3rd gen) | iOS 16+ | P1 |
| Samsung Galaxy S24 | Android 14 | P0 |
| Samsung Galaxy A54 | Android 13 | P1 |
| Google Pixel 8 | Android 14 | P1 |
| iPad (10th gen) | iPadOS 17 | P2 |

### 14.4 Mobile-Specific Test Cases

| Area | Test Cases |
|------|-----------|
| **Navigation** | Tab navigation, deep linking, back behavior |
| **Offline** | Offline mode, data sync on reconnect |
| **Push** | Notification receipt, tap-to-open, background handling |
| **Camera** | Video capture, permissions, quality settings |
| **Location** | Map rendering, GPS accuracy, permission handling |
| **Performance** | Cold start < 3s, smooth scrolling (60fps), memory usage |
| **Accessibility** | Screen reader support, font scaling, contrast |

---

## 15. CI/CD Integration

### 15.1 Current CI/CD Pipeline

```
PR Created / Push to Branch
         │
         ▼
┌────────────────────────────────┐
│ GitHub Actions Workflow        │
│                                │
│ 1. Checkout (fetch-depth: 0)   │
│ 2. Setup Node.js + pnpm       │
│ 3. Install dependencies       │
│ 4. Prisma generate            │
│ 5. TypeScript typecheck       │
│ 6. ESLint                     │
│ 7. Jest tests + coverage      │
│ 8. SonarCloud analysis        │
│                                │
│ Quality Gate: Pass / Fail      │
└────────────────┬───────────────┘
                 │
         ┌───────┴───────┐
         │               │
    ✅ Pass          ❌ Fail
         │               │
    PR Mergeable    Fix Required
```

### 15.2 Recommended CI Enhancements

| Enhancement | Benefit | Priority |
|-------------|---------|----------|
| Add Playwright E2E to CI | Automated E2E regression on every PR | P1 |
| Add Lighthouse CI | Track web performance metrics | P2 |
| Add `npm audit` check | Automated dependency vulnerability scanning | P1 |
| Add bundle size check | Prevent bundle size regressions | P2 |
| Add mobile build check | Verify mobile app compiles | P2 |

### 15.3 Test Execution in CI

```bash
# Current CI test commands
pnpm format --check        # Verify formatting
pnpm lint                  # ESLint checks
pnpm typecheck             # TypeScript strict mode
pnpm test                  # Jest unit tests
pnpm test:coverage         # Coverage report for SonarCloud

# Recommended additions
pnpm test:e2e              # Playwright E2E (on merge to main)
npx lighthouse-ci          # Performance audit (weekly)
npm audit --audit-level=high  # Dependency security check
```

---

## 16. Bug Lifecycle and Defect Management

### 16.1 Bug Lifecycle

```
┌──────┐    ┌───────┐    ┌────────┐    ┌──────────┐    ┌────────┐
│ New  │───▶│Active │───▶│Resolved│───▶│Verified  │───▶│ Closed │
└──────┘    └───┬───┘    └────────┘    └─────┬────┘    └────────┘
                │                            │
                │         ┌──────────┐       │
                └────────▶│Deferred  │       │
                          └──────────┘       │
                                             │
                          ┌──────────┐       │
                          │Reopened  │◀──────┘
                          └──────────┘  (if not fixed)
```

### 16.2 Bug Severity Definitions

| Severity | Definition | Example | SLA |
|----------|-----------|---------|-----|
| **Critical** | System is down or major feature completely broken | Cannot login, payments fail | Fix within 4 hours |
| **High** | Major feature significantly impaired | Event registration partially broken | Fix within 24 hours |
| **Medium** | Feature works but with issues | Incorrect translation, visual glitch | Fix within 1 sprint |
| **Low** | Minor cosmetic or UX issue | Button slightly misaligned, typo | Fix when convenient |

### 16.3 Bug Priority vs Severity Matrix

| | Critical Sev. | High Sev. | Medium Sev. | Low Sev. |
|---|---|---|---|---|
| **P0** | Fix immediately | Fix in 24h | — | — |
| **P1** | Fix in 24h | Fix in sprint | Fix in sprint | — |
| **P2** | — | Fix in sprint | Next sprint | Next sprint |
| **P3** | — | — | Backlog | Backlog |

---

## 17. Reporting and Metrics

### 17.1 Key QA Metrics

| Metric | Measurement | Target |
|--------|------------|--------|
| **Test Pass Rate** | Tests passed / Total tests | ≥ 95% |
| **Code Coverage** | Lines covered / Total lines | ≥ 70% |
| **Bug Escape Rate** | Bugs found in production / Total bugs | ≤ 5% |
| **Mean Time to Fix** | Average time from bug report to fix | ≤ 2 days |
| **Regression Rate** | Regressions per release | ≤ 2 |
| **Test Automation %** | Automated tests / Total tests | ≥ 60% |
| **E2E Test Duration** | Time to run full E2E suite | ≤ 30 min |

### 17.2 Sprint QA Report Template

```markdown
## Sprint [X] QA Report

### Summary
- Test Cases Executed: XX / XX
- Pass Rate: XX%
- New Bugs Found: XX
- Bugs Fixed: XX
- Open Bugs: XX

### Coverage
- Unit Test Coverage: XX%
- E2E Flows Covered: XX / XX

### Risk Areas
- [List any areas with insufficient testing]

### Recommendations
- [Testing improvements for next sprint]
```

### 17.3 Dashboards and Visibility

| Dashboard | Platform | Content |
|-----------|----------|---------|
| Test Results | Azure DevOps | Test case pass/fail status, execution history |
| Code Coverage | SonarCloud | Line coverage, branch coverage, coverage trends |
| Bug Tracking | Azure DevOps | Open bugs, severity distribution, age analysis |
| CI Status | GitHub Actions | Build status, test results, quality gate |
| Performance | Vercel Analytics | Core Web Vitals, page load times |

---

## 18. Risks and Mitigations

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Insufficient test coverage delays releases | High | Medium | Define coverage targets per sprint; automate where possible |
| Flaky E2E tests reduce CI reliability | Medium | High | Implement retry logic (already 2 retries in CI); isolate test data |
| Test environment differs from production | High | Medium | Use staging environment that mirrors production config |
| Manual testing bottleneck | Medium | High | Increase automation; prioritize automated tests for P0 flows |
| Third-party service outages (Stripe, Neon) | High | Low | Use mock services in tests; have fallback test plans |
| Mobile testing device coverage gaps | Medium | Medium | Use cloud device testing (BrowserStack) for coverage |
| LiveRace testing complexity | High | Medium | Create dedicated LiveRace test environment; simulation scripts |
| Multi-language testing overhead | Medium | Medium | Automate i18n validation; focus manual testing on Portuguese and English |

---

## 19. Appendix

### 19.1 Glossary

| Term | Definition |
|------|-----------|
| **Athlifyr** | Sports and fitness platform for events, venues, and training |
| **LiveRace** | Real-time race tracking system with checkpoint monitoring |
| **Venue** | Gym, CrossFit box, or fitness center managed on the platform |
| **Variant** | Different race categories within an event (e.g., 10km, 21km) |
| **Pricing Phase** | Time-based pricing period for event registration |
| **Checkpoint** | GPS waypoint along a race route for time tracking |
| **Quality Gate** | SonarCloud threshold that new code must pass |

### 19.2 Related Documents

| Document | Location |
|----------|----------|
| Test Users | `docs/TEST_USERS.md` |
| SonarCloud Setup | `docs/quality/sonarcloud.md` |
| Azure DevOps QA Structure | `docs/quality/AZURE_DEVOPS_QA_STRUCTURE.md` |
| Postman API Setup | `POSTMAN_SETUP.md` |
| Deployment Guide | `DEPLOYMENT.md` |
| LiveRace Documentation | `LIVERACE.md` |
| Post-Deployment Verification | `docs/POST-DEPLOYMENT-VERIFICATION.md` |

### 19.3 Test Commands Reference

```bash
# Unit Tests
pnpm test                         # Run all unit tests
pnpm test:watch                   # Watch mode
pnpm test:coverage                # Generate coverage report

# E2E Tests
pnpm test:e2e                     # All E2E tests
pnpm test:e2e:auth                # Authentication tests
pnpm test:e2e:functional          # Functional flow tests
pnpm test:e2e:admin               # Admin role tests
pnpm test:e2e:owner               # Venue owner tests
pnpm test:e2e:coach               # Coach role tests
pnpm test:e2e:member              # Member role tests
pnpm test:e2e:free                # Free user tests
pnpm test:e2e:security            # Security tests
pnpm test:e2e:i18n                # Internationalization tests

# Code Quality
pnpm format                       # Prettier formatting
pnpm lint                         # ESLint checks
pnpm typecheck                    # TypeScript strict mode
pnpm build                        # Full build verification
```

### 19.4 Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | March 2026 | Athlifyr Dev Team | Initial testing strategy document |

---

_This document is a living document and should be updated as the platform evolves, new features are added, and testing practices mature._
