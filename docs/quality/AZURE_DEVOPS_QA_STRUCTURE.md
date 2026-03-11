# Azure DevOps — QA Backlog Structure for Athlifyr

> **Version:** 1.0
> **Last Updated:** March 2026
> **Status:** Active
> **Related Document:** `docs/quality/TESTING_STRATEGY.md`

---

## Table of Contents

1. [Overview](#1-overview)
2. [Work Item Hierarchy](#2-work-item-hierarchy)
3. [Epic Structure](#3-epic-structure)
4. [Feature Breakdown](#4-feature-breakdown)
5. [User Stories and Tasks](#5-user-stories-and-tasks)
6. [Sprint Planning Recommendations](#6-sprint-planning-recommendations)
7. [Test Case Management](#7-test-case-management)
8. [QA Workflow in Azure DevOps](#8-qa-workflow-in-azure-devops)
9. [Dashboards and Queries](#9-dashboards-and-queries)
10. [Tags and Labels](#10-tags-and-labels)

---

## 1. Overview

This document defines how testing activities are organized in **Azure DevOps** using the Agile work item hierarchy. It provides a ready-to-import backlog structure for the QA team to start planning and executing tests immediately.

### Methodology

The QA backlog follows the **Azure DevOps Agile** process template:

```
Epic → Feature → User Story → Task / Bug
```

Each level maps to a specific testing scope:

| Level | Testing Scope | Example |
|-------|--------------|---------|
| **Epic** | Major platform testing area | "Athlifyr Platform Testing" |
| **Feature** | Module or system being tested | "Events Testing" |
| **User Story** | Specific functionality validated | "Test event registration flow" |
| **Task** | Individual test creation or execution | "Create unit tests for checkout API" |
| **Bug** | Defect found during testing | "Payment fails for relay variant" |

---

## 2. Work Item Hierarchy

```
📦 EPIC: Athlifyr Platform Testing
│
├── 🔷 FEATURE: Authentication Testing
│   ├── 📋 USER STORY: Test user registration flow
│   │   ├── ✅ TASK: Create E2E test for email registration
│   │   ├── ✅ TASK: Create E2E test for Google OAuth
│   │   ├── ✅ TASK: Create unit test for input validation
│   │   └── 🐛 BUG: Registration fails with special characters in name
│   │
│   ├── 📋 USER STORY: Test login and session management
│   │   ├── ✅ TASK: Create E2E test for email login
│   │   ├── ✅ TASK: Create unit test for session expiration
│   │   └── ✅ TASK: Execute regression tests after auth changes
│   │
│   └── 📋 USER STORY: Test password recovery flow
│       ├── ✅ TASK: Create E2E test for forgot password
│       └── ✅ TASK: Create E2E test for password reset
│
├── 🔷 FEATURE: Events Testing
│   ├── 📋 USER STORY: Test event creation and management
│   ├── 📋 USER STORY: Test event registration flow
│   ├── 📋 USER STORY: Test event payment processing
│   └── 📋 USER STORY: Test event search and filtering
│
├── 🔷 FEATURE: Venues & Gyms Testing
│   ├── 📋 USER STORY: Test venue discovery and map
│   ├── 📋 USER STORY: Test class booking flow
│   ├── 📋 USER STORY: Test venue management (owner)
│   └── 📋 USER STORY: Test subscription management
│
├── 🔷 FEATURE: LiveRace Tracking Testing
│   ├── 📋 USER STORY: Test race start and control
│   ├── 📋 USER STORY: Test checkpoint tracking
│   ├── 📋 USER STORY: Test real-time leaderboard
│   └── 📋 USER STORY: Test results and export
│
├── 🔷 FEATURE: Mobile App Testing
│   ├── 📋 USER STORY: Test mobile authentication
│   ├── 📋 USER STORY: Test mobile event browsing
│   ├── 📋 USER STORY: Test push notifications
│   └── 📋 USER STORY: Test offline behavior
│
├── 🔷 FEATURE: Payments Testing
│   ├── 📋 USER STORY: Test Stripe checkout flow
│   ├── 📋 USER STORY: Test webhook processing
│   ├── 📋 USER STORY: Test subscription lifecycle
│   └── 📋 USER STORY: Test refund processing
│
├── 🔷 FEATURE: Administration Testing
│   ├── 📋 USER STORY: Test admin dashboard access
│   ├── 📋 USER STORY: Test user management
│   └── 📋 USER STORY: Test content moderation
│
├── 🔷 FEATURE: Internationalization Testing
│   ├── 📋 USER STORY: Test language switching
│   ├── 📋 USER STORY: Test translations completeness
│   └── 📋 USER STORY: Test locale-specific formatting
│
├── 🔷 FEATURE: Performance Testing
│   ├── 📋 USER STORY: Test API response times
│   ├── 📋 USER STORY: Test web page load performance
│   └── 📋 USER STORY: Test WebSocket scalability
│
└── 🔷 FEATURE: Security Testing
    ├── 📋 USER STORY: Test authentication security
    ├── 📋 USER STORY: Test authorization rules
    ├── 📋 USER STORY: Test input validation
    └── 📋 USER STORY: Test payment security
```

---

## 3. Epic Structure

### Epic: Athlifyr Platform Testing

| Field | Value |
|-------|-------|
| **Title** | Athlifyr Platform Testing |
| **Description** | Comprehensive testing of all Athlifyr platform systems including API, web frontend, mobile app, LiveRace engine, and infrastructure. |
| **Acceptance Criteria** | All P0 and P1 test cases pass. Coverage targets met. No open critical or high bugs. |
| **Priority** | 1 |
| **State** | Active |

---

## 4. Feature Breakdown

### Feature 1: Authentication Testing

| Field | Value |
|-------|-------|
| **Title** | Authentication Testing |
| **Description** | Test all authentication flows including registration, login, password recovery, Google OAuth, session management, and mobile auth. |
| **Area** | Auth API, NextAuth, Google OAuth |
| **Priority** | 1 (P0 — Critical) |
| **Estimated Effort** | 3 sprints |

**User Stories:**

| ID | Title | Priority | Est. Points |
|----|-------|----------|-------------|
| US-AUTH-01 | Test user registration flow (email + password) | P0 | 5 |
| US-AUTH-02 | Test user login and session management | P0 | 5 |
| US-AUTH-03 | Test Google OAuth login flow (web + mobile) | P0 | 8 |
| US-AUTH-04 | Test password recovery flow | P1 | 3 |
| US-AUTH-05 | Test email verification flow | P1 | 3 |
| US-AUTH-06 | Test role-based access control (Admin, Owner, Coach, Member) | P0 | 8 |
| US-AUTH-07 | Test banned user restrictions | P1 | 2 |
| US-AUTH-08 | Test session expiration and token refresh | P1 | 3 |

---

### Feature 2: Events Testing

| Field | Value |
|-------|-------|
| **Title** | Events Testing |
| **Description** | Test event lifecycle including creation, listing, registration, payment, check-in, and management. |
| **Area** | Events API, Stripe, Database |
| **Priority** | 1 (P0 — Critical) |
| **Estimated Effort** | 4 sprints |

**User Stories:**

| ID | Title | Priority | Est. Points |
|----|-------|----------|-------------|
| US-EVT-01 | Test event listing with pagination and filtering | P0 | 5 |
| US-EVT-02 | Test event details display in all languages | P1 | 5 |
| US-EVT-03 | Test event registration for free events | P0 | 3 |
| US-EVT-04 | Test event registration with Stripe payment | P0 | 8 |
| US-EVT-05 | Test event variant selection and pricing phases | P0 | 5 |
| US-EVT-06 | Test event check-in flow | P0 | 3 |
| US-EVT-07 | Test event creation by organizer | P1 | 5 |
| US-EVT-08 | Test event edit and update | P1 | 3 |
| US-EVT-09 | Test registration export (CSV) | P1 | 2 |
| US-EVT-10 | Test event custom fields | P1 | 3 |
| US-EVT-11 | Test event search by location and sport | P2 | 3 |
| US-EVT-12 | Test event SEO and structured data | P2 | 3 |

---

### Feature 3: Venues & Gyms Testing

| Field | Value |
|-------|-------|
| **Title** | Venues & Gyms Testing |
| **Description** | Test venue management, discovery, booking, subscriptions, and member management. |
| **Area** | Venues API, Stripe Connect, Database |
| **Priority** | 1 (P0 — Critical) |
| **Estimated Effort** | 4 sprints |

**User Stories:**

| ID | Title | Priority | Est. Points |
|----|-------|----------|-------------|
| US-VEN-01 | Test venue discovery on map | P1 | 5 |
| US-VEN-02 | Test venue details and schedule display | P1 | 3 |
| US-VEN-03 | Test class booking flow | P0 | 5 |
| US-VEN-04 | Test booking cancellation | P0 | 3 |
| US-VEN-05 | Test venue creation by owner | P1 | 5 |
| US-VEN-06 | Test member management (invite, remove, role change) | P1 | 5 |
| US-VEN-07 | Test session creation and management | P1 | 5 |
| US-VEN-08 | Test venue subscription plans and payment | P0 | 8 |
| US-VEN-09 | Test trial booking flow | P1 | 3 |
| US-VEN-10 | Test venue review system | P2 | 3 |
| US-VEN-11 | Test recurring session generation | P1 | 3 |
| US-VEN-12 | Test Stripe Connect setup for venue owners | P1 | 5 |

---

### Feature 4: LiveRace Tracking Testing

| Field | Value |
|-------|-------|
| **Title** | LiveRace Tracking Testing |
| **Description** | Test the complete LiveRace real-time tracking system including race control, checkpoint recording, leaderboard, and presentation. |
| **Area** | LiveRace Engine (NestJS), Socket.io, API |
| **Priority** | 1 (P0 — Critical) |
| **Estimated Effort** | 3 sprints |

**User Stories:**

| ID | Title | Priority | Est. Points |
|----|-------|----------|-------------|
| US-LR-01 | Test LiveRace readiness validation | P0 | 3 |
| US-LR-02 | Test race start and stop controls | P0 | 5 |
| US-LR-03 | Test checkpoint time recording | P0 | 5 |
| US-LR-04 | Test real-time leaderboard updates | P0 | 8 |
| US-LR-05 | Test WebSocket connection reliability | P0 | 5 |
| US-LR-06 | Test final results and leaderboard generation | P0 | 5 |
| US-LR-07 | Test LiveRace presentation page | P1 | 3 |
| US-LR-08 | Test concurrent participant tracking (performance) | P1 | 8 |
| US-LR-09 | Test results export functionality | P1 | 3 |
| US-LR-10 | Test LiveRace internal API authentication | P0 | 3 |

---

### Feature 5: Mobile App Testing

| Field | Value |
|-------|-------|
| **Title** | Mobile App Testing |
| **Description** | Test the Expo/React Native mobile application on iOS and Android including authentication, navigation, push notifications, and device-specific features. |
| **Area** | Mobile App (Expo/React Native) |
| **Priority** | 2 (P1 — High) |
| **Estimated Effort** | 3 sprints |

**User Stories:**

| ID | Title | Priority | Est. Points |
|----|-------|----------|-------------|
| US-MOB-01 | Test mobile app launch and onboarding | P0 | 3 |
| US-MOB-02 | Test mobile authentication (email + Google) | P0 | 5 |
| US-MOB-03 | Test event browsing and details | P1 | 5 |
| US-MOB-04 | Test venue map and search | P1 | 5 |
| US-MOB-05 | Test push notification receipt and handling | P1 | 5 |
| US-MOB-06 | Test chat messaging | P2 | 5 |
| US-MOB-07 | Test motion analysis video capture | P2 | 5 |
| US-MOB-08 | Test offline behavior and reconnection | P1 | 5 |
| US-MOB-09 | Test deep linking from notifications/URLs | P2 | 3 |
| US-MOB-10 | Test cross-device compatibility | P1 | 8 |

---

### Feature 6: Payments Testing

| Field | Value |
|-------|-------|
| **Title** | Payments Testing |
| **Description** | Test all payment flows including Stripe checkout, webhook processing, subscriptions, and refunds. |
| **Area** | Stripe, Payments API |
| **Priority** | 1 (P0 — Critical) |
| **Estimated Effort** | 2 sprints |

**User Stories:**

| ID | Title | Priority | Est. Points |
|----|-------|----------|-------------|
| US-PAY-01 | Test Stripe checkout session creation | P0 | 5 |
| US-PAY-02 | Test successful payment webhook | P0 | 5 |
| US-PAY-03 | Test failed payment webhook handling | P0 | 3 |
| US-PAY-04 | Test venue subscription payment | P0 | 5 |
| US-PAY-05 | Test subscription renewal and cancellation | P0 | 5 |
| US-PAY-06 | Test Stripe Connect for venue owners | P1 | 5 |
| US-PAY-07 | Test refund processing | P1 | 3 |
| US-PAY-08 | Test pricing phase transitions | P0 | 3 |

---

### Feature 7: Administration Testing

| Field | Value |
|-------|-------|
| **Title** | Administration Testing |
| **Description** | Test the admin panel including user management, content moderation, event approval, and reporting. |
| **Area** | Admin Panel, Admin API |
| **Priority** | 2 (P1 — High) |
| **Estimated Effort** | 2 sprints |

**User Stories:**

| ID | Title | Priority | Est. Points |
|----|-------|----------|-------------|
| US-ADM-01 | Test admin dashboard access and role restriction | P0 | 3 |
| US-ADM-02 | Test user management (ban/unban, role assignment) | P1 | 5 |
| US-ADM-03 | Test event moderation (approve, edit, delete) | P1 | 5 |
| US-ADM-04 | Test venue management and ownership claims | P1 | 3 |
| US-ADM-05 | Test content moderation (posts, comments) | P2 | 3 |
| US-ADM-06 | Test giveaway management | P2 | 3 |
| US-ADM-07 | Test analytics and reporting | P2 | 3 |

---

### Feature 8: Internationalization Testing

| Field | Value |
|-------|-------|
| **Title** | Internationalization Testing |
| **Description** | Test multilingual support across all 6 languages (en, pt, es, fr, de, it) including translations, formatting, and SEO. |
| **Area** | i18n, next-intl, Message Files |
| **Priority** | 2 (P1 — High) |
| **Estimated Effort** | 2 sprints |

**User Stories:**

| ID | Title | Priority | Est. Points |
|----|-------|----------|-------------|
| US-I18N-01 | Test language switching across all pages | P1 | 5 |
| US-I18N-02 | Test translation completeness for all 6 languages | P1 | 8 |
| US-I18N-03 | Test date, time, and currency formatting per locale | P1 | 3 |
| US-I18N-04 | Test event translations display | P1 | 3 |
| US-I18N-05 | Test SEO metadata in correct language | P2 | 3 |
| US-I18N-06 | Test missing translation fallback behavior | P2 | 2 |

---

### Feature 9: Performance Testing

| Field | Value |
|-------|-------|
| **Title** | Performance Testing |
| **Description** | Validate API response times, web page performance, and WebSocket scalability. |
| **Area** | All systems |
| **Priority** | 2 (P1 — High) |
| **Estimated Effort** | 2 sprints |

**User Stories:**

| ID | Title | Priority | Est. Points |
|----|-------|----------|-------------|
| US-PERF-01 | Test API response times under normal load | P1 | 8 |
| US-PERF-02 | Test API behavior under peak/stress load | P1 | 8 |
| US-PERF-03 | Test web page Core Web Vitals (Lighthouse) | P1 | 5 |
| US-PERF-04 | Test WebSocket scalability (LiveRace) | P1 | 8 |
| US-PERF-05 | Test database query performance | P2 | 5 |
| US-PERF-06 | Test mobile app performance metrics | P2 | 5 |

---

### Feature 10: Security Testing

| Field | Value |
|-------|-------|
| **Title** | Security Testing |
| **Description** | Validate authentication, authorization, input validation, and vulnerability scanning across the platform. |
| **Area** | All systems |
| **Priority** | 1 (P0 — Critical) |
| **Estimated Effort** | 2 sprints |

**User Stories:**

| ID | Title | Priority | Est. Points |
|----|-------|----------|-------------|
| US-SEC-01 | Test API authentication enforcement | P0 | 5 |
| US-SEC-02 | Test role-based authorization rules | P0 | 8 |
| US-SEC-03 | Test input validation and injection prevention | P0 | 5 |
| US-SEC-04 | Test XSS prevention in user content | P0 | 3 |
| US-SEC-05 | Test Stripe webhook signature verification | P0 | 3 |
| US-SEC-06 | Test file upload validation | P1 | 3 |
| US-SEC-07 | Test sensitive data exposure prevention | P0 | 5 |
| US-SEC-08 | Test CORS and CSRF protection | P1 | 3 |
| US-SEC-09 | Run dependency vulnerability scan | P1 | 2 |
| US-SEC-10 | Run OWASP ZAP dynamic scan | P1 | 5 |

---

## 5. User Stories and Tasks

### Detailed Example: US-EVT-04 — Test Event Registration with Stripe Payment

```
📋 USER STORY: Test event registration with Stripe payment
   │
   │  As a QA tester
   │  I want to validate the event registration and payment flow
   │  So that I can ensure users can register and pay for events correctly
   │
   │  Acceptance Criteria:
   │  - User can select event variant
   │  - Pricing phase is correctly applied
   │  - Stripe checkout session is created
   │  - Successful payment redirects to confirmation
   │  - Failed payment shows appropriate error
   │  - Registration record is created in database
   │  - Confirmation email is sent
   │
   ├── ✅ TASK: Create unit test for checkout API route
   │       Assignee: Developer
   │       Est: 3 hours
   │       Description: Test POST /api/events/[id]/checkout with mocked Stripe
   │
   ├── ✅ TASK: Create unit test for pricing phase calculation
   │       Assignee: Developer
   │       Est: 2 hours
   │       Description: Test correct pricing based on current date
   │
   ├── ✅ TASK: Create E2E test for registration flow
   │       Assignee: Developer
   │       Est: 4 hours
   │       Description: Playwright test from event page → variant select → checkout → confirmation
   │
   ├── ✅ TASK: Execute manual test for all event variants
   │       Assignee: Vanessa (QA)
   │       Est: 4 hours
   │       Description: Manually test registration for each variant type (individual, relay, doubles)
   │
   ├── ✅ TASK: Execute manual test for payment failure scenarios
   │       Assignee: Vanessa (QA)
   │       Est: 2 hours
   │       Description: Test with Stripe test cards (decline, insufficient funds, expired)
   │
   └── ✅ TASK: Document test results and edge cases
         Assignee: Vanessa (QA)
         Est: 1 hour
         Description: Update test case results in Azure DevOps
```

### Detailed Example: US-LR-03 — Test Checkpoint Time Recording

```
📋 USER STORY: Test checkpoint time recording
   │
   │  As a QA tester
   │  I want to validate that checkpoint times are accurately recorded
   │  So that race results are reliable and accurate
   │
   │  Acceptance Criteria:
   │  - Checkpoint times are recorded via LiveRace API
   │  - Times are stored with millisecond precision
   │  - Checkpoint order is validated (FINISH must have highest order)
   │  - Duplicate checkpoint times are rejected
   │  - WebSocket broadcasts updates to presentation clients
   │
   ├── ✅ TASK: Review existing unit tests for checkpoint logic
   │       Assignee: Developer
   │       Est: 1 hour
   │       Description: Verify coverage of route-engine.test.ts and live-time.test.ts
   │
   ├── ✅ TASK: Create integration test for checkpoint WebSocket events
   │       Assignee: Developer
   │       Est: 4 hours
   │       Description: Test that checkpoint recording triggers Socket.io events
   │
   ├── ✅ TASK: Execute manual test with simulated race
   │       Assignee: Vanessa (QA)
   │       Est: 3 hours
   │       Description: Start a test race, record checkpoint times, verify leaderboard
   │
   └── ✅ TASK: Test edge cases (out-of-order, duplicate, missing checkpoints)
         Assignee: Vanessa (QA)
         Est: 2 hours
         Description: Verify system handles invalid checkpoint scenarios correctly
```

---

## 6. Sprint Planning Recommendations

### Sprint 1: Foundation (Weeks 1-2)

**Focus:** Setup, existing test review, authentication testing

| Item | Type | Points | Assignee |
|------|------|--------|----------|
| Review and document all existing tests | Task | 3 | Developer |
| Set up Azure DevOps test plans and suites | Task | 5 | Vanessa |
| US-AUTH-01: Test user registration flow | Story | 5 | Dev + QA |
| US-AUTH-02: Test login and session management | Story | 5 | Dev + QA |
| US-SEC-01: Test API authentication enforcement | Story | 5 | Developer |
| **Total** | | **23** | |

### Sprint 2: Core Flows (Weeks 3-4)

**Focus:** Events, venues, and payment testing

| Item | Type | Points | Assignee |
|------|------|--------|----------|
| US-EVT-01: Test event listing | Story | 5 | Dev + QA |
| US-EVT-04: Test event registration with payment | Story | 8 | Dev + QA |
| US-VEN-03: Test class booking flow | Story | 5 | Dev + QA |
| US-PAY-01: Test Stripe checkout session | Story | 5 | Developer |
| US-PAY-02: Test payment webhook | Story | 5 | Developer |
| **Total** | | **28** | |

### Sprint 3: LiveRace & Coverage Expansion (Weeks 5-6)

**Focus:** LiveRace testing, more event/venue flows

| Item | Type | Points | Assignee |
|------|------|--------|----------|
| US-LR-01: Test LiveRace readiness | Story | 3 | Dev + QA |
| US-LR-02: Test race start and stop | Story | 5 | Dev + QA |
| US-LR-04: Test real-time leaderboard | Story | 8 | Dev + QA |
| US-EVT-06: Test event check-in | Story | 3 | Dev + QA |
| US-VEN-04: Test booking cancellation | Story | 3 | Dev + QA |
| US-AUTH-06: Test role-based access control | Story | 8 | Dev + QA |
| **Total** | | **30** | |

### Sprint 4: i18n, Mobile & Administration (Weeks 7-8)

**Focus:** Internationalization, mobile, admin testing

| Item | Type | Points | Assignee |
|------|------|--------|----------|
| US-I18N-01: Test language switching | Story | 5 | QA |
| US-I18N-02: Test translation completeness | Story | 8 | QA |
| US-MOB-01: Test mobile app launch | Story | 3 | Dev + QA |
| US-MOB-02: Test mobile authentication | Story | 5 | Dev + QA |
| US-ADM-01: Test admin dashboard access | Story | 3 | Dev + QA |
| **Total** | | **24** | |

### Sprint 5: Performance & Security (Weeks 9-10)

**Focus:** Non-functional testing

| Item | Type | Points | Assignee |
|------|------|--------|----------|
| US-PERF-01: Test API response times | Story | 8 | Developer |
| US-PERF-03: Test Core Web Vitals | Story | 5 | Developer |
| US-SEC-02: Test authorization rules | Story | 8 | Dev + QA |
| US-SEC-03: Test input validation | Story | 5 | Dev + QA |
| US-SEC-10: Run OWASP ZAP scan | Story | 5 | Developer |
| **Total** | | **31** | |

### Sprint 6: Regression & Hardening (Weeks 11-12)

**Focus:** Full regression, gap coverage, documentation

| Item | Type | Points | Assignee |
|------|------|--------|----------|
| Full regression test execution | Task | 8 | QA |
| Coverage gap analysis and remediation | Task | 5 | Developer |
| Update testing strategy document | Task | 2 | Dev + QA |
| Create automated regression suite | Task | 8 | Developer |
| Final QA sign-off report | Task | 3 | Vanessa |
| **Total** | | **26** | |

---

## 7. Test Case Management

### 7.1 Azure DevOps Test Plans

Create the following test plans:

| Test Plan | Scope | Frequency |
|-----------|-------|-----------|
| **Athlifyr Regression Suite** | All P0 and P1 test cases | Every release |
| **Sprint [X] Test Plan** | Test cases for current sprint stories | Per sprint |
| **Smoke Test Suite** | Quick validation of core flows | After each deployment |
| **Security Test Suite** | Security-focused test cases | Monthly |
| **Performance Test Suite** | Load and performance tests | Before major releases |

### 7.2 Test Case Template

Each test case in Azure DevOps should include:

| Field | Description |
|-------|-------------|
| **Title** | Clear description of what is being tested |
| **Area Path** | Module being tested (e.g., Athlifyr\Events) |
| **Iteration** | Sprint assignment |
| **State** | Design → Ready → Active → Closed |
| **Priority** | P0 / P1 / P2 / P3 |
| **Automation Status** | Not Automated / Planned / Automated |
| **Steps** | Numbered step-by-step test instructions |
| **Expected Results** | Expected outcome for each step |
| **Preconditions** | Required setup before execution |
| **Test Data** | Specific test user/data to use |
| **Linked User Story** | Associated user story |

### 7.3 Test Suite Organization

```
📁 Test Plans
│
├── 📁 Athlifyr Regression Suite
│   ├── 📂 Authentication Tests (12 cases)
│   ├── 📂 Events Tests (15 cases)
│   ├── 📂 Venues Tests (15 cases)
│   ├── 📂 LiveRace Tests (14 cases)
│   ├── 📂 Payments Tests (9 cases)
│   ├── 📂 Mobile Tests (10 cases)
│   ├── 📂 Admin Tests (7 cases)
│   ├── 📂 i18n Tests (7 cases)
│   └── 📂 Security Tests (15 cases)
│
├── 📁 Smoke Test Suite
│   ├── 📂 Login (2 cases)
│   ├── 📂 Event Registration (2 cases)
│   ├── 📂 Venue Booking (2 cases)
│   ├── 📂 LiveRace (2 cases)
│   └── 📂 Navigation (2 cases)
│
└── 📁 Sprint Test Plans
    ├── 📂 Sprint 1 (see sprint planning above)
    ├── 📂 Sprint 2
    └── ...
```

---

## 8. QA Workflow in Azure DevOps

### 8.1 Board Columns for QA Tasks

Configure the following board columns for test-related work items:

```
New → Analysis → Test Design → Ready for Test → In Testing → Verified → Done
```

| Column | Description | Owner |
|--------|-------------|-------|
| **New** | New test request or bug report | Anyone |
| **Analysis** | Reviewing requirements and testability | Vanessa |
| **Test Design** | Creating test cases and test data | Vanessa |
| **Ready for Test** | Feature is deployed and ready for testing | Developer |
| **In Testing** | Actively executing test cases | Vanessa |
| **Verified** | All test cases pass, QA approved | Vanessa |
| **Done** | Signed off and closed | Team |

### 8.2 QA Definition of Done

A user story is considered "Done" from QA perspective when:

- [ ] All associated test cases created and documented
- [ ] All P0 test cases pass
- [ ] All P1 test cases pass (or deferred with justification)
- [ ] No open Critical or High bugs
- [ ] Regression tests pass for affected areas
- [ ] Test execution results documented in Azure DevOps
- [ ] All 6 languages validated (if applicable)
- [ ] Screenshots/evidence attached for manual tests

### 8.3 Bug Workflow in Azure DevOps

```
New → Active → Resolved → Verified → Closed
                                 │
                           Reopened (if not fixed)
```

| State | Action | Owner |
|-------|--------|-------|
| **New** | Bug reported with full details | Vanessa |
| **Active** | Developer acknowledges and starts fix | Developer |
| **Resolved** | Fix implemented and deployed to staging | Developer |
| **Verified** | QA confirms the fix works correctly | Vanessa |
| **Closed** | Bug is fully resolved | Vanessa |
| **Reopened** | Fix did not resolve the issue | Vanessa |

---

## 9. Dashboards and Queries

### 9.1 Recommended Azure DevOps Queries

| Query Name | Type | Filter |
|------------|------|--------|
| Open Bugs by Severity | Flat | Type = Bug AND State != Closed AND State != Resolved |
| My Active Test Tasks | Flat | Type = Task AND State = Active AND Assigned To = @Me |
| Unassigned Test Cases | Flat | Type = Test Case AND Assigned To = Unassigned |
| Sprint Test Progress | Flat | Iteration = @CurrentIteration AND Area Path Contains "Testing" |
| P0 Test Cases - Not Automated | Flat | Priority = 1 AND Automation Status = Not Automated |
| Bugs Found This Sprint | Flat | Type = Bug AND Created Date >= @StartOfIteration |
| Regression Failures | Flat | Type = Bug AND Tags Contains "regression" |

### 9.2 Recommended Dashboard Widgets

| Widget | Data | Purpose |
|--------|------|---------|
| **Test Execution Trend** | Pass/fail over time | Track testing progress |
| **Bug Burndown** | Open bugs over time | Track bug resolution |
| **Test Pass Rate** | % tests passing | Sprint health indicator |
| **Coverage by Feature** | Test cases per feature | Identify coverage gaps |
| **Active Bugs by Severity** | Pie chart of bug severities | Prioritize bug fixing |
| **Sprint Velocity** | Story points completed | Planning accuracy |
| **Automation Progress** | Automated vs manual tests | Track automation goals |

---

## 10. Tags and Labels

### 10.1 Recommended Tags

Use consistent tags across all work items for easy filtering:

| Tag | Usage |
|-----|-------|
| `qa` | All QA-related work items |
| `automated` | Test cases that have automated tests |
| `manual` | Test cases that require manual execution |
| `regression` | Regression-related bugs or tests |
| `p0-critical` | Priority 0 critical items |
| `security` | Security-related tests or bugs |
| `performance` | Performance-related items |
| `i18n` | Internationalization-related items |
| `mobile` | Mobile-specific items |
| `liverace` | LiveRace-specific items |
| `blocked` | Items blocked by dependencies |
| `flaky` | Flaky or intermittent test failures |

### 10.2 Area Path Structure

```
Athlifyr
├── Authentication
├── Events
├── Venues
├── LiveRace
├── Mobile
├── Payments
├── Administration
├── Internationalization
├── Performance
├── Security
└── Infrastructure
```

---

## Appendix: Quick Reference

### Total Estimated Effort

| Feature | User Stories | Est. Points | Sprints |
|---------|------------|-------------|---------|
| Authentication | 8 | 37 | 3 |
| Events | 12 | 48 | 4 |
| Venues & Gyms | 12 | 53 | 4 |
| LiveRace | 10 | 48 | 3 |
| Mobile App | 10 | 44 | 3 |
| Payments | 8 | 34 | 2 |
| Administration | 7 | 25 | 2 |
| Internationalization | 6 | 24 | 2 |
| Performance | 6 | 39 | 2 |
| Security | 10 | 42 | 2 |
| **Total** | **89** | **394** | **~6 sprints** |

### Priority Distribution

| Priority | Count | Percentage |
|----------|-------|-----------|
| P0 (Critical) | 34 | 38% |
| P1 (High) | 38 | 43% |
| P2 (Medium) | 14 | 16% |
| P3 (Low) | 3 | 3% |

---

_This document should be imported into Azure DevOps and updated as the testing backlog evolves._
