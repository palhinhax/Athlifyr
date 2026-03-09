# TASK-06: Audit Trail for Manual Changes

## Summary

Create a database model and write logic to track all manual modifications to race
results. Every DQ, time adjustment, position override, or note edit must be recorded
with: who changed it, what changed, when, and the reason provided.

---

## Type

`feat(results)`

## Priority

**High** — Required for accountability and dispute resolution

## Estimate

3–5 Story Points

---

## User Story

> As a **platform admin**, I want to see a complete audit trail of all manual
> changes to event results, so that disputes can be resolved and accountability
> is maintained.

---

## Acceptance Criteria

### Database Model

- [ ] `ResultAuditLog` Prisma model created and migrated
- [ ] Fields:
  - `id` — CUID primary key
  - `resultId` — FK to Result
  - `eventId` — FK to Event
  - `userId` — FK to User (who made the change)
  - `action` — Enum string: `DSQ`, `DNF`, `REINSTATE`, `ADJUST_TIME`, `ADJUST_BIB`, `NOTE_EDIT`, `POSITION_OVERRIDE`
  - `before` — JSON snapshot of previous values
  - `after` — JSON snapshot of new values
  - `reason` — String (organizer-provided reason)
  - `createdAt` — Timestamp
- [ ] Indexed on `resultId` and `eventId` for efficient queries

### API

- [ ] `GET /api/events/[id]/results/audit-log` endpoint exists
- [ ] Auth: Platform admin or organizer with `OWNER` / `ADMIN` role
- [ ] Returns paginated audit log entries sorted by `createdAt DESC`
- [ ] Each entry includes: user name, action, before/after, reason, timestamp
- [ ] Supports `resultId` filter (optional)
- [ ] Audit log entries are immutable — no update or delete endpoints

### Write Logic

- [ ] `createAuditLogEntry()` utility function in `lib/result-audit.ts`
- [ ] Called by Task 05 (DQ/Adjust) on every manual change
- [ ] Captures full before/after state diff
- [ ] Fails silently if audit log write fails (does not block the main operation)

---

## Technical Implementation

### Prisma Schema Addition

```prisma
model ResultAuditLog {
  id        String   @id @default(cuid())
  resultId  String
  eventId   String
  userId    String
  action    String   // "DSQ" | "DNF" | "REINSTATE" | "ADJUST_TIME" | etc.
  before    Json     // { position: 5, notes: null, time: "03:45:21" }
  after     Json     // { position: null, notes: "DSQ", time: "03:45:21" }
  reason    String?
  createdAt DateTime @default(now())

  result    Result   @relation(fields: [resultId], references: [id], onDelete: Cascade)
  event     Event    @relation(fields: [eventId], references: [id], onDelete: Cascade)
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([resultId])
  @@index([eventId])
  @@index([eventId, createdAt])
}
```

### Update Related Models

Add relation fields:

```prisma
// In Result model:
auditLogs ResultAuditLog[]

// In Event model:
resultAuditLogs ResultAuditLog[]

// In User model:
resultAuditLogs ResultAuditLog[]
```

### Utility Function

```typescript
// lib/result-audit.ts

interface AuditLogEntry {
  resultId: string;
  eventId: string;
  userId: string;
  action: string;
  before: Record<string, unknown>;
  after: Record<string, unknown>;
  reason?: string;
}

export async function createAuditLogEntry(entry: AuditLogEntry): Promise<void> {
  try {
    await prisma.resultAuditLog.create({ data: entry });
  } catch (error) {
    // Log but do not throw — audit should not block main operation
    console.error("[AuditLog] Failed to create entry:", error);
  }
}
```

### File to Create — API

```
app/api/events/[id]/results/audit-log/route.ts
```

### Query Endpoint

```typescript
export async function GET(request, { params }) {
  // 1. Authenticate & authorize
  // 2. Parse pagination (page, limit)
  // 3. Fetch audit log entries
  const logs = await prisma.resultAuditLog.findMany({
    where: {
      eventId,
      ...(resultId ? { resultId } : {}),
    },
    include: {
      user: { select: { name: true, email: true, image: true } },
      result: {
        select: { userId: true, variantId: true },
        include: {
          user: { select: { name: true } },
          variant: { select: { name: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
    skip,
    take: limit,
  });

  return NextResponse.json({ logs, pagination: { page, limit, total } });
}
```

---

## Migration Steps

1. Add `ResultAuditLog` model to `prisma/schema.prisma`
2. Add relation fields to `Result`, `Event`, `User` models
3. Run `npx prisma migrate dev --name add_result_audit_log`
4. Generate Prisma client

---

## Dependencies

- Prisma schema (existing)
- Auth helpers (existing)

## Blocked By

None (model creation is independent)

## Blocks

- Task 05 (DQ/Adjust — uses audit log)
- Task 08 (Organizer UI — displays audit log)

---

## Testing

- [ ] `ResultAuditLog` model created in database
- [ ] `createAuditLogEntry()` successfully creates log entries
- [ ] `GET /api/events/[id]/results/audit-log` returns paginated logs
- [ ] Logs include user name, action, before/after, reason, timestamp
- [ ] Logs are sorted by `createdAt DESC`
- [ ] `resultId` filter works
- [ ] 403 for unauthorized user
- [ ] Audit log entries cannot be deleted via API
- [ ] Silent failure if audit write fails (main operation not blocked)
