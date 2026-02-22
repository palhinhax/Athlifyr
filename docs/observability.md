# Observability — Error Monitoring & Performance Tracking

This document covers the Sentry integration used in Athlifyr for error monitoring, crash reporting, and performance tracing across the **web** (Next.js) and **mobile** (Expo / React Native) apps.

---

## Platform & Projects

| App    | Sentry Project    | SDK                    |
| ------ | ----------------- | ---------------------- |
| Web    | `athlifyr-web`    | `@sentry/nextjs`       |
| Mobile | `athlifyr-mobile` | `@sentry/react-native` |

Both projects live in the same Sentry organisation so issues can be correlated across platforms by `release` and `user.id`.

---

## Environments

| `NODE_ENV` value | Sentry `environment` tag      |
| ---------------- | ----------------------------- |
| `development`    | `development`                 |
| `preview`        | `preview` (Vercel PR deploys) |
| `production`     | `production`                  |

> Events are **disabled in `development`** by default to avoid noise. Set `enabled: true` in the config files if you need to test locally.

---

## What We Collect

| Data Type                 | Web | Mobile | Notes                                        |
| ------------------------- | --- | ------ | -------------------------------------------- |
| JS / RN error stack trace | ✅  | ✅     | De-minified via source maps                  |
| Browser / device info     | ✅  | ✅     | OS, browser version, app version             |
| App / release version     | ✅  | ✅     | Tagged per deploy                            |
| Pseudonymous user id      | ✅  | ✅     | Only when authenticated; no email            |
| URL / route name          | ✅  | ✅     | Helps reproduce the issue                    |
| Breadcrumbs               | ✅  | ✅     | Navigation events, console logs              |
| Performance traces        | ✅  | ✅     | 10 % sample rate in production               |
| Request headers           | ❌  | ❌     | Stripped before send (Authorization, Cookie) |
| Passwords / tokens        | ❌  | ❌     | Scrubbed by `beforeSend`                     |
| Email address             | ❌  | ❌     | Never attached to Sentry events              |
| Session Replay            | ❌  | ❌     | Disabled by default                          |

---

## What We Scrub

The `beforeSend` hook in both `sentry.client.config.ts` and `sentry.server.config.ts` (web) and `mobile/src/lib/sentry.ts` (mobile) removes:

- `Authorization` / `authorization` request headers
- `cookie` / `Cookie` request headers
- `x-auth-token` request headers
- All cookie values in `event.request.cookies`
- Query-string parameters matching `/token|password|secret|key|auth/i`
- Extra context keys matching `/password|token|secret|authorization|cookie/i`

---

## Data Retention

Retention is configured to **90 days** in the Sentry project settings. After 90 days, all event data is permanently deleted.

---

## Configuration Overview

### Web (Next.js)

| File                              | Purpose                                                                           |
| --------------------------------- | --------------------------------------------------------------------------------- |
| `sentry.client.config.ts`         | Browser-side init, `beforeSend` scrubbing, `ignoreErrors`                         |
| `sentry.server.config.ts`         | Node.js server init, `beforeSend` scrubbing                                       |
| `sentry.edge.config.ts`           | Edge runtime init (middleware)                                                    |
| `instrumentation.ts`              | Next.js App Router hook — loads server/edge configs; re-exports `onRequestError`  |
| `next.config.mjs`                 | Wraps config with `withSentryConfig` for source map upload + auto-instrumentation |
| `components/session-provider.tsx` | Calls `Sentry.setUser({ id })` after login; `Sentry.setUser(null)` on logout      |

### Mobile (Expo / React Native)

| File                       | Purpose                                                                 |
| -------------------------- | ----------------------------------------------------------------------- |
| `mobile/src/lib/sentry.ts` | Sentry init, `initSentry()`, `setSentryUser()`, `clearSentryUser()`     |
| `mobile/app/_layout.tsx`   | Calls `initSentry()` at startup; syncs user context from `useAuthStore` |
| `mobile/app.config.js`     | Adds `@sentry/react-native/expo` plugin for EAS source maps             |

---

## Environment Variables

### Web (Vercel)

| Variable                 | Required        | Notes                                          |
| ------------------------ | --------------- | ---------------------------------------------- |
| `NEXT_PUBLIC_SENTRY_DSN` | Yes             | Used by browser bundle                         |
| `SENTRY_DSN`             | Yes             | Used by server/edge runtime                    |
| `SENTRY_AUTH_TOKEN`      | Build-time only | Source map upload; **never expose to browser** |
| `SENTRY_ORG`             | Build-time      | Sentry organisation slug                       |
| `SENTRY_PROJECT`         | Build-time      | e.g. `athlifyr-web`                            |

### Mobile (EAS)

| Variable                 | Required        | Notes                     |
| ------------------------ | --------------- | ------------------------- |
| `EXPO_PUBLIC_SENTRY_DSN` | Yes             | Embedded in app bundle    |
| `SENTRY_AUTH_TOKEN`      | Build-time only | Source map upload via EAS |
| `SENTRY_ORG`             | Build-time      | Sentry organisation slug  |
| `SENTRY_PROJECT`         | Build-time      | e.g. `athlifyr-mobile`    |

> ⚠️ **Never commit real tokens.** Use Vercel / EAS secret management for all auth tokens.

---

## How to Reproduce & Find Issues

1. Open [sentry.io](https://sentry.io) → select the `athlifyr-web` or `athlifyr-mobile` project.
2. Filter by `environment: production` and the relevant `release`.
3. Click an issue to see the de-minified stack trace, breadcrumbs, and device context.
4. Use the `user.id` field to find all events for a specific user (cross-reference with your DB).

---

## How to Test Locally

By default, events are **not sent in `development`** (`enabled: false`).

To test Sentry locally:

```ts
// Temporarily override in sentry.client.config.ts or sentry.server.config.ts:
enabled: true,
```

Then trigger a test error:

```ts
// In any server component or API route:
throw new Error("Sentry test error — delete me");

// Or on the client:
import * as Sentry from "@sentry/nextjs";
Sentry.captureException(new Error("Sentry test error — delete me"));
```

---

## How to Disable / Limit Collection

| Goal                        | How                                                                                           |
| --------------------------- | --------------------------------------------------------------------------------------------- |
| Disable in dev              | `enabled: process.env.NODE_ENV !== "development"` (already default)                           |
| Reduce performance overhead | Lower `tracesSampleRate` toward `0`                                                           |
| Disable completely          | Remove `SENTRY_DSN` / `NEXT_PUBLIC_SENTRY_DSN` env vars                                       |
| Opt out individual users    | Not currently implemented; error monitoring relies on legitimate interest (GDPR Art. 6(1)(f)) |

---

## GDPR / Privacy Compliance Notes

- **Legal basis**: Legitimate interest — error monitoring is necessary for service stability and security.
- **Data minimisation**: Only pseudonymous user id is attached; no email, name, or other PII.
- **Scrubbing**: Auth tokens, cookies, and passwords are stripped before any event is sent.
- **Session Replay**: Disabled by default. If enabled in the future, all inputs must be masked and sensitive routes (auth, payment) must be blocklisted.
- **Retention**: 90 days max; configurable in Sentry project settings.
- **Sub-processor**: Sentry is listed in the Privacy Policy as a data processor.
- **User rights**: Users can request deletion of their pseudonymous data by contacting the team; we can search by `user.id` in Sentry and delete matching events.

---

## Alert Rules (Recommended)

Configure these rules in Sentry → Alerts → Create Alert Rule:

1. **Error spike** — triggers when > 50 new events occur in 10 minutes in `production`.
2. **New issue in production** — triggers on first occurrence of any new issue in `production`.
3. **Performance regression** — triggers when p95 response time exceeds 3 s on a key transaction.

Route alerts to the team email or Slack channel as appropriate.
