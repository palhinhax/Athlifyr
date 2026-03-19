# 🔒 Athlifyr Security Review Report

**Date:** 2026-03-17  
**Scope:** Full-stack security review (web app, APIs, authentication, database, storage, integrations)  
**Methodology:** Manual code review + static analysis of the Athlifyr codebase

---

## Executive Summary

This report documents the findings from a comprehensive security review of the Athlifyr platform. The review covered authentication flows, API authorization, input validation, file uploads, payment integrations, internal endpoints, and infrastructure configuration. **9 actionable vulnerabilities** were identified, with fixes implemented for the highest-priority items.

---

## Findings

### SEC-01 — Missing Rate Limiting on Authentication Endpoints

| Field           | Value                                                                         |
| --------------- | ----------------------------------------------------------------------------- |
| **Severity**    | 🔴 Critical                                                                   |
| **Component**   | `app/api/auth/login`, `register`, `forgot-password`, `reset-password`         |
| **Impact**      | Brute-force attacks, credential stuffing, email enumeration, account takeover |
| **Probability** | High                                                                          |
| **Status**      | ✅ Fixed                                                                      |

**Description:**  
None of the authentication endpoints had rate limiting. An attacker could make unlimited login attempts, enumerate valid emails via the registration endpoint, or flood the password reset flow.

**Steps to Reproduce:**

1. Send thousands of POST requests to `/api/auth/login` with different passwords for the same email.
2. Observe that all requests are processed without throttling.

**Fix Applied:**

- Created `lib/rate-limit.ts` with an in-memory sliding-window rate limiter.
- Applied rate limiting to all four auth endpoints:
  - Login: 7 attempts per 15 minutes (per IP + email)
  - Register: 3 attempts per 15 minutes (per IP)
  - Forgot-password: 3 attempts per 15 minutes (per IP)
  - Reset-password: 5 attempts per 15 minutes (per IP)
- Returns `429 Too Many Requests` with `Retry-After` header when exceeded.

**Recommendation for Hardening:**

- For multi-instance deployments (horizontal scaling), replace the in-memory store with Redis.

---

### SEC-02 — Internal Endpoints Bypass Secret Validation When Secret Is Unset

| Field           | Value                                                                                      |
| --------------- | ------------------------------------------------------------------------------------------ |
| **Severity**    | 🔴 Critical                                                                                |
| **Component**   | `app/api/internal/live-auth`, `live-config`, `live-status`, `live-results`, `live-friends` |
| **Impact**      | Unauthorized access to internal APIs, data exfiltration, race result manipulation          |
| **Probability** | Medium (depends on whether `LIVE_INTERNAL_SECRET` is deployed)                             |
| **Status**      | ✅ Fixed                                                                                   |

**Description:**  
All five internal endpoints used an `isLiveServer()` function that treated the shared secret as _optional_:

```typescript
// BEFORE (vulnerable):
if (expectedSecret && secret !== expectedSecret) return false;
// If LIVE_INTERNAL_SECRET is undefined → condition is always false → access granted
```

An attacker could access internal endpoints by simply setting the `x-live-server: true` header.

**Fix Applied:**

- Created `lib/internal-auth.ts` with a centralized `isLiveServer()` function.
- Secret is now **mandatory** — requests are rejected if `LIVE_INTERNAL_SECRET` is not configured.
- Uses `crypto.timingSafeEqual()` to prevent timing attacks on the secret comparison.
- All 5 internal endpoints now import from the shared module.

---

### SEC-03 — Cron Endpoint Secret Validation Is Optional

| Field           | Value                                                                  |
| --------------- | ---------------------------------------------------------------------- |
| **Severity**    | 🟠 High                                                                |
| **Component**   | `app/api/cron/regenerate-sessions/route.ts`                            |
| **Impact**      | Unauthorized execution of scheduled tasks, potential denial of service |
| **Probability** | Medium                                                                 |
| **Status**      | ✅ Fixed                                                               |

**Description:**  
The cron endpoint only validated the `CRON_SECRET` if it was set. If the environment variable was missing, the endpoint was publicly accessible.

```typescript
// BEFORE (vulnerable):
if (cronSecret && authHeader !== `Bearer ${cronSecret}`) { ... }
// If CRON_SECRET is undefined → entire check is skipped
```

**Fix Applied:**

- Made `CRON_SECRET` mandatory — requests are rejected with a 401 if the secret is not configured.

---

### SEC-04 — Giveaway Draw Secret Validation Bypass

| Field           | Value                                                |
| --------------- | ---------------------------------------------------- |
| **Severity**    | 🟠 High                                              |
| **Component**   | `app/api/giveaways/draw/route.ts`                    |
| **Impact**      | Unauthorized giveaway draws, manipulation of winners |
| **Probability** | Medium                                               |
| **Status**      | ✅ Fixed                                             |

**Description:**  
If `GIVEAWAY_DRAW_SECRET` was undefined, the comparison `authHeader !== "Bearer undefined"` would allow any authorization header that matched this literal string to pass authentication.

**Fix Applied:**

- Added explicit check: `if (!GIVEAWAY_DRAW_SECRET || ...)` to reject requests when the secret is not configured.

---

### SEC-05 — Weather Update Secret Validation Bypass

| Field           | Value                             |
| --------------- | --------------------------------- |
| **Severity**    | 🟠 High                           |
| **Component**   | `app/api/weather/update/route.ts` |
| **Impact**      | Unauthorized weather data updates |
| **Probability** | Low                               |
| **Status**      | ✅ Fixed                          |

**Description:**  
Same pattern as SEC-04: if `WEATHER_UPDATE_SECRET` was undefined, the endpoint could be called with `Bearer undefined`.

**Fix Applied:**

- Added explicit `!WEATHER_UPDATE_SECRET` check before comparing the authorization header.

---

### SEC-06 — Email Enumeration via Timing Attack on Forgot-Password

| Field           | Value                                                   |
| --------------- | ------------------------------------------------------- |
| **Severity**    | 🟡 Medium                                               |
| **Component**   | `app/api/auth/forgot-password/route.ts`                 |
| **Impact**      | Email enumeration (confirm which emails are registered) |
| **Probability** | Medium                                                  |
| **Status**      | ✅ Fixed                                                |

**Description:**  
While the response message was identical for existing and non-existing users (good practice), the response _timing_ differed:

- Non-existing user: ~50ms (just a DB query)
- Existing user: ~800ms+ (DB query + token creation + email send)

An attacker could enumerate valid emails by measuring response times.

**Fix Applied:**

- Added a minimum response time of 800ms when the user is not found, ensuring consistent response timing regardless of user existence.

---

### SEC-07 — CORS Wildcard on All API Routes

| Field           | Value                                                   |
| --------------- | ------------------------------------------------------- |
| **Severity**    | 🟡 Medium                                               |
| **Component**   | `next.config.mjs`                                       |
| **Impact**      | Cross-origin request abuse, potential CSRF-like attacks |
| **Probability** | Low (JWT auth mitigates most risks)                     |
| **Status**      | ✅ Fixed                                                |

**Description:**  
All API routes had `Access-Control-Allow-Origin: *`, allowing any website to make cross-origin requests to the API. While Bearer token authentication provides protection, a wildcard CORS policy is still a security concern.

**Fix Applied:**

- Changed CORS origin to be configurable via `ALLOWED_ORIGINS` environment variable.
- Falls back to `NEXT_PUBLIC_BASE_URL` if `ALLOWED_ORIGINS` is not set.
- Only defaults to `*` when neither variable is configured (development mode).
- Updated `.env.example` with documentation for the new variable.

---

## Additional Findings (No Code Changes Required)

### SEC-08 — Passwords Stored as Plain Text in Reset Tokens

| Field              | Value                                                                      |
| ------------------ | -------------------------------------------------------------------------- |
| **Severity**       | 🟡 Medium                                                                  |
| **Component**      | `app/api/auth/forgot-password/route.ts`                                    |
| **Impact**         | If database is compromised, reset tokens can be used to take over accounts |
| **Recommendation** | Store reset tokens as hashed values (SHA-256) in the database              |

### SEC-09 — Long JWT Access Token Expiry (7 Days)

| Field              | Value                                                               |
| ------------------ | ------------------------------------------------------------------- |
| **Severity**       | 🟡 Medium                                                           |
| **Component**      | `lib/jwt.ts`                                                        |
| **Impact**         | Stolen access tokens remain valid for a long time                   |
| **Recommendation** | Reduce access token expiry to 1–2 hours, rely on refresh token flow |

### SEC-10 — No Magic Byte Validation for File Uploads

| Field              | Value                                                                          |
| ------------------ | ------------------------------------------------------------------------------ |
| **Severity**       | 🟡 Medium                                                                      |
| **Component**      | `lib/b2-storage.ts`                                                            |
| **Impact**         | Malicious files disguised with valid MIME types could bypass upload validation |
| **Recommendation** | Add `file-type` library for magic byte verification                            |

### SEC-11 — CSP Allows `'unsafe-inline'` and `'unsafe-eval'`

| Field              | Value                                                                  |
| ------------------ | ---------------------------------------------------------------------- |
| **Severity**       | ℹ️ Low                                                                 |
| **Component**      | `next.config.mjs` (CSP headers)                                        |
| **Impact**         | Reduces effectiveness of CSP against XSS attacks                       |
| **Recommendation** | Transition to nonce-based CSP when feasible (requires Next.js support) |

### SEC-12 — In-Memory Rate Limit Store (Single Instance)

| Field              | Value                                                       |
| ------------------ | ----------------------------------------------------------- |
| **Severity**       | ℹ️ Low                                                      |
| **Component**      | `lib/rate-limit.ts`, `lib/verify-integrity.ts`              |
| **Impact**         | Rate limiting is not shared across serverless instances     |
| **Recommendation** | Use Redis or Upstash for shared rate limiting in production |

---

## Positive Security Findings ✅

| Area                        | Status           | Details                                                               |
| --------------------------- | ---------------- | --------------------------------------------------------------------- |
| Password Hashing            | ✅ Secure        | bcrypt with 10 salt rounds                                            |
| SQL Injection               | ✅ Protected     | Prisma ORM with parameterized queries, no raw SQL                     |
| Input Validation            | ✅ Good          | Zod schemas on registration and other forms                           |
| Stripe Webhooks             | ✅ Verified      | Proper signature verification + idempotency checking                  |
| Admin Endpoints             | ✅ Protected     | All admin routes check `session.user.role === "ADMIN"`                |
| IDOR Protection             | ✅ Mostly Good   | Resource ownership checks on posts, workouts, registrations           |
| XSS Prevention              | ✅ React         | React's default escaping + CSP headers                                |
| HTTPS                       | ✅ Enforced      | HSTS with preload, upgrade-insecure-requests                          |
| Security Headers            | ✅ Comprehensive | X-Frame-Options, X-Content-Type-Options, Referrer-Policy              |
| Upload Security             | ✅ Good          | MIME validation, size limits, filename sanitization, folder whitelist |
| Play Integrity              | ✅ Enabled       | Mobile requests verified via Play Integrity API                       |
| Email Enumeration (message) | ✅ Fixed         | Same response message for existing and non-existing users             |

---

## Prioritized Remediation Plan

### Priority 1 — Critical (Implemented)

1. ✅ **SEC-01**: Rate limiting on auth endpoints
2. ✅ **SEC-02**: Mandatory secret validation for internal endpoints
3. ✅ **SEC-03**: Mandatory cron secret validation
4. ✅ **SEC-04**: Giveaway draw secret validation fix
5. ✅ **SEC-05**: Weather update secret validation fix

### Priority 2 — High (Implemented)

6. ✅ **SEC-06**: Timing-safe forgot-password response
7. ✅ **SEC-07**: CORS origin restriction

### Priority 3 — Medium (Recommended)

8. ⬜ **SEC-08**: Hash password reset tokens in database
9. ⬜ **SEC-09**: Reduce JWT access token expiry to 1–2 hours
10. ⬜ **SEC-10**: Add magic byte validation for uploads

### Priority 4 — Hardening

11. ⬜ **SEC-11**: Transition to nonce-based CSP
12. ⬜ **SEC-12**: Move rate limiting to Redis for multi-instance deployments

---

## Quick Wins (Already Implemented)

- ✅ Rate limiting on login, register, forgot-password, reset-password
- ✅ Mandatory secret validation on all protected endpoints
- ✅ Timing-safe email enumeration prevention
- ✅ Configurable CORS origins via environment variable
- ✅ Centralized internal auth module with timing-safe comparison
- ✅ Updated `.env.example` with all required security secrets
