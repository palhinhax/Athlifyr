# Google OAuth Authentication Documentation

## Overview

Athlifyr supports Google OAuth authentication for both web and mobile platforms, with separate endpoints optimized for each.

## Authentication Methods

### 1. Web Application (NextAuth)

**Default method** - Uses NextAuth.js with automatic session management.

**Endpoint**: `/api/auth/[...nextauth]`

**Configuration** (`lib/auth.ts`):

```typescript
Google({
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  authorization: {
    params: {
      prompt: "consent",
      access_type: "offline",
      response_type: "code",
    },
  },
});
```

**Usage**:

```typescript
import { signIn } from "next-auth/react";

// Trigger Google OAuth
await signIn("google", { callbackUrl: "/" });
```

**Features**:

- Automatic session management with cookies
- CSRF protection
- Built-in token refresh
- Database session storage via PrismaAdapter

---

### 2. Web Application (REST API - Alternative)

**Alternative method** - Direct REST API endpoint for more control.

**Endpoint**: `/api/auth/google-web`

**Flow**:

1. Call POST `/api/auth/google-web` with `{ action: "getAuthUrl" }`
2. Redirect user to returned `authUrl`
3. Google redirects to `/api/auth/google-web/callback`
4. User is authenticated with JWT tokens in cookies

**Usage**:

```typescript
// 1. Get auth URL
const response = await fetch("/api/auth/google-web", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ action: "getAuthUrl" }),
});
const { authUrl } = await response.json();

// 2. Redirect to Google
window.location.href = authUrl;
```

**Cookies Set**:

- `auth-token` - Access token (7 days)
- `refresh-token` - Refresh token (30 days)

---

### 3. Mobile Application (React Native)

**Endpoint**: `/api/auth/google-mobile`

**Flow**:

1. Mobile app uses `@react-native-google-signin/google-signin`
2. Gets `idToken` from Google Sign-In
3. Sends `idToken` to backend
4. Backend verifies and returns JWT tokens

**Usage** (Mobile):

```typescript
// 1. Sign in with Google (mobile app)
const userInfo = await GoogleSignin.signIn();
const idToken = userInfo.data?.idToken;

// 2. Authenticate with backend
const response = await fetch("/api/auth/google-mobile", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ idToken }),
});

const { accessToken, refreshToken, user } = await response.json();
```

**Environment Variables Required** (Mobile):

```bash
EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID="xxx.apps.googleusercontent.com"
EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID="xxx.apps.googleusercontent.com"
EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID="xxx.apps.googleusercontent.com"
```

---

## Google Cloud Console Setup

### 1. Create OAuth 2.0 Credentials

Go to: https://console.cloud.google.com/apis/credentials

### 2. Configure Authorized Redirect URIs

**For NextAuth (Web)**:

```
https://yourdomain.com/api/auth/callback/google
http://localhost:3000/api/auth/callback/google
```

**For REST API (Web Alternative)**:

```
https://yourdomain.com/api/auth/google-web/callback
http://localhost:3000/api/auth/google-web/callback
```

**For Mobile**:

- Mobile uses ID token verification, no redirect URI needed

### 3. Required Scopes

- `https://www.googleapis.com/auth/userinfo.email`
- `https://www.googleapis.com/auth/userinfo.profile`
- `openid`

---

## Environment Variables

```bash
# Web OAuth (NextAuth)
GOOGLE_CLIENT_ID="your-oauth-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-client-secret"

# NextAuth Configuration
NEXTAUTH_SECRET="your-nextauth-secret-key"
NEXTAUTH_URL="https://yourdomain.com"

# Mobile OAuth (Optional - if using separate credentials)
GOOGLE_MOBILE_WEB_CLIENT_ID="mobile-web-client-id.apps.googleusercontent.com"
GOOGLE_ANDROID_CLIENT_ID="android-client-id.apps.googleusercontent.com"
GOOGLE_IOS_CLIENT_ID="ios-client-id.apps.googleusercontent.com"
```

---

## Troubleshooting

### "invalid_grant" Error

**Common causes**:

1. **Redirect URI mismatch**
   - Ensure the redirect URI in Google Console matches exactly
   - Check for trailing slashes, http vs https

2. **Clock skew**
   - Ensure server time is synchronized
   - Check: `date` on server

3. **Client ID/Secret mismatch**
   - Verify `GOOGLE_CLIENT_ID` matches the project in Google Console
   - Check `GOOGLE_CLIENT_SECRET` is correct

4. **Cookie configuration issues**
   - Ensure `NEXTAUTH_URL` is set correctly
   - Check `trustHost: true` in NextAuth config
   - Verify cookie settings for production (secure, sameSite)

5. **PKCE issues**
   - Our fix: Custom cookie config in `lib/auth.ts`
   - Ensures PKCE code verifier persists correctly

### Testing

**Test NextAuth flow**:

```bash
curl http://localhost:3000/api/auth/signin
```

**Test REST API flow**:

```bash
curl -X POST http://localhost:3000/api/auth/google-web \
  -H "Content-Type: application/json" \
  -d '{"action":"getAuthUrl"}'
```

**Test Mobile flow**:

```bash
# Get idToken from mobile app, then:
curl -X POST http://localhost:3000/api/auth/google-mobile \
  -H "Content-Type: application/json" \
  -d '{"idToken":"your-id-token-here"}'
```

---

## Recommendations

### Use NextAuth (Default Method) When:

✅ Building traditional web application
✅ Need automatic session management
✅ Want built-in CSRF protection
✅ Prefer cookie-based auth

### Use REST API Method When:

✅ Need more control over auth flow
✅ Building SPA with custom state management
✅ Want explicit JWT token handling
✅ Need to customize redirect behavior

### Use Mobile Endpoint When:

✅ Building React Native / Expo app
✅ Using native Google Sign-In SDK
✅ Need cross-platform mobile auth

---

## Security Considerations

1. **Always use HTTPS in production**
2. **Set secure cookie flags** (`secure: true`, `httpOnly: true`)
3. **Validate redirect URIs** in Google Console
4. **Rotate secrets** regularly (NEXTAUTH_SECRET)
5. **Implement rate limiting** on auth endpoints
6. **Monitor failed auth attempts**
7. **Use short-lived access tokens** (7 days)
8. **Implement token refresh** for long sessions

---

## Related Files

- `lib/auth.ts` - NextAuth configuration
- `app/api/auth/[...nextauth]/route.ts` - NextAuth handler
- `app/api/auth/google-web/route.ts` - REST API endpoint (web)
- `app/api/auth/google-mobile/route.ts` - REST API endpoint (mobile)
- `lib/jwt.ts` - JWT token generation/verification
- `lib/auth-helpers.ts` - Unified auth helpers

---

## Current Issue (2026-02-13)

**Error**: `invalid_grant` from Google OAuth

**Applied Fix**:
Added explicit cookie configuration for PKCE in `lib/auth.ts`:

```typescript
cookies: {
  pkceCodeVerifier: {
    name: "next-auth.pkce.code_verifier",
    options: {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      secure: process.env.NODE_ENV === "production",
    },
  },
}
```

**Alternative Solution**:
Use the new REST API endpoint at `/api/auth/google-web` which bypasses NextAuth entirely.

**Next Steps**:

1. Deploy the fix
2. Clear browser cookies
3. Test OAuth flow
4. If issue persists, verify Google Console configuration
5. Consider switching to REST API method
