# Mobile Chat Backend Fix Required

## Status: ⚠️ Known Issue

The mobile app chat feature is currently **not fully functional** due to backend authentication incompatibility.

## Problem

The mobile app uses **JWT tokens** for authentication, but the chat API routes in the backend are configured to work with **NextAuth sessions** (cookie-based authentication).

### Current Mobile Auth Flow

- Mobile app login generates JWT tokens (access token + refresh token)
- Tokens are stored in `expo-secure-store`
- API requests include `Authorization: Bearer <token>` header
- Token refresh happens automatically on 401 errors

### Current Backend Chat Routes

- Chat routes expect NextAuth session cookies
- Use `getAuthUser()` which tries to extract user from NextAuth session
- No support for JWT bearer tokens in chat endpoints

## Affected Routes

All routes under `/app/api/chat/`:

1. **`/api/chat/conversations`**
   - `GET` - List user conversations
   - `POST` - Create new conversation

2. **`/api/chat/conversations/[id]/messages`**
   - `GET` - Get conversation messages
   - `POST` - Send message

3. **`/api/chat/conversations/[id]/messages/poll`**
   - `GET` - Poll for new messages

4. **`/api/chat/conversations/[id]/seen`**
   - `POST` - Mark messages as seen

5. **`/api/chat/conversations/[id]/hide`**
   - `POST` - Hide conversation

6. **`/api/chat/notifications`**
   - `GET` - Get chat notifications

7. **`/api/chat/notifications/[id]/read`**
   - `POST` - Mark notification as read

8. **`/api/chat/notifications/read-all`**
   - `POST` - Mark all notifications as read

## Impact

- ❌ Mobile app users **cannot send or receive messages**
- ❌ Chat notifications **do not work** on mobile
- ❌ Conversation list is **empty** or shows errors
- ✅ Web app chat works fine (uses NextAuth cookies)

## Solution Required

### Option 1: Modify `getAuthUser()` to Support JWT (Recommended)

Update `/lib/auth.ts` to extract user from JWT tokens when present:

```typescript
export async function getAuthUser(): Promise<AuthUser | null> {
  // Try NextAuth session first (for web)
  const session = await getServerSession(authOptions);
  if (session?.user) {
    return {
      id: session.user.id,
      email: session.user.email,
      name: session.user.name,
      role: session.user.role,
    };
  }

  // Try JWT from Authorization header (for mobile)
  const headersList = headers();
  const authorization = headersList.get("authorization");

  if (authorization?.startsWith("Bearer ")) {
    const token = authorization.substring(7);
    try {
      const payload = verifyAccessToken(token);
      if (payload) {
        const user = await prisma.user.findUnique({
          where: { id: payload.userId },
          select: { id: true, email: true, name: true, role: true },
        });
        return user;
      }
    } catch (error) {
      console.error("JWT verification failed:", error);
    }
  }

  return null;
}
```

### Option 2: Create Separate Mobile Chat Routes

Create duplicate routes under `/api/mobile/chat/` that handle JWT auth:

- ❌ Not recommended - code duplication
- ❌ Harder to maintain two sets of routes

## Testing After Fix

Once the backend is updated, test mobile chat:

1. **Login on mobile** and verify token is stored
2. **Open Messages tab** - should load conversations
3. **Send a message** - should appear in chat
4. **Receive a message** - should show in real-time
5. **Check notifications** - should display unread count
6. **Mark as read** - should update notification badge

## Implementation Priority

**Priority**: High (blocks mobile chat completely)

**Estimated Effort**: 2-3 hours

- Modify `getAuthUser()` function
- Add JWT verification logic
- Test all chat routes with mobile tokens
- Verify web chat still works with NextAuth

## Files to Modify

1. **`/lib/auth.ts`**
   - Add JWT extraction and verification to `getAuthUser()`
   - Import `verifyAccessToken` from `/lib/jwt.ts`
   - Handle both NextAuth and JWT auth methods

2. **`/lib/jwt.ts`** (if needed)
   - Ensure `verifyAccessToken()` is exported and working
   - Add error handling for expired/invalid tokens

## Related

- Mobile auth implementation: `MOBILE_AUTH_IMPLEMENTATION.md`
- JWT token refresh: `mobile/src/lib/api.ts`
- Chat system docs: `docs/CHAT_SYSTEM.md`

---

**Created**: February 12, 2026  
**Last Updated**: February 12, 2026  
**Status**: Pending Implementation
