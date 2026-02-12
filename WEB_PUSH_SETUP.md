# Web Push Notifications Setup Guide

## 📱 Overview

This guide explains how to set up and use Web Push Notifications in the Athlifyr web application. Web Push allows users to receive browser notifications (Chrome, Firefox, Edge) even when the window is minimized.

---

## ✅ What's Implemented

### 1. **Service Worker** (`/public/sw.js`)

- Handles push events from the server
- Shows browser notifications
- Handles notification clicks (opens relevant page)
- Auto-installs and activates

### 2. **PWA Configuration** (`next.config.mjs`)

- `next-pwa` integration
- Automatic service worker generation
- Disabled in development (to avoid caching issues)

### 3. **Web Manifest** (`/app/site.webmanifest/route.ts`)

- PWA manifest with app info
- Icons for install prompts
- Theme colors and display mode

### 4. **Backend APIs**

#### Subscribe API (`/api/web-push/subscribe`)

- `POST` - Register browser push subscription
- `DELETE` - Unregister browser push subscription
- Stores subscription in `PushToken` table with `platform: "web"`

#### Send API (`/api/web-push/send`)

- `POST` - Send web push notification to specific user
- Handles invalid subscriptions (marks as inactive)

### 5. **Frontend Hook** (`/hooks/use-web-push.ts`)

- `useWebPush()` - React hook for managing web push
- Methods: `subscribe()`, `unsubscribe()`
- States: `isSubscribed`, `permission`, `isLoading`, `error`

### 6. **UI Component** (`/components/web-push-toggle.tsx`)

- Bell icon button in header
- Shows subscription status (bell/bellOff + green dot)
- One-click enable/disable notifications

### 7. **Push Notification Library** (`/lib/push-notifications.ts`)

- Updated to support both Expo (mobile) and Web Push
- `sendPushNotification()` - Automatically sends to all user devices (mobile + web)
- Handles invalid tokens cleanup

---

## 🔧 Setup Instructions

### 1. Add VAPID Keys to Environment Variables

The VAPID keys are already generated and added to `.env.example`:

```bash
# Web Push Notifications (VAPID Keys)
NEXT_PUBLIC_VAPID_PUBLIC_KEY="BAr4eyrVOovwOHHYgfZ-OT-5zzo9lMAYx-PoOpkUte2WyHEecOesDzqDbqEtX_-rRNoHHsVPduDN3JvvvgJX_YQ"
VAPID_PRIVATE_KEY="bVmDDwy3BaJnqjoqIZSNFCmVQ28OrcU36s402vn_a0k"
VAPID_SUBJECT="mailto:hello@athlifyr.com"
```

**⚠️ IMPORTANT:** Add these to your `.env.local` file!

### 2. Install Dependencies (Already Done)

```bash
pnpm add next-pwa web-push
pnpm add -D @types/web-push @types/web
```

### 3. Database Schema (No Changes Needed)

The `PushToken` model already supports web push:

- `platform` enum includes `"web"`
- `deviceId` stores the full subscription JSON
- `token` stores the subscription endpoint

---

## 🚀 How to Use

### For Users

1. **Log in** to Athlifyr web app
2. **Click the bell icon** in the header (next to notifications)
3. **Allow notifications** when browser prompts
4. **Done!** You'll now receive browser notifications for:
   - New chat messages
   - Event date changes
   - Event cancellations

### For Developers

#### Send notification to a user:

```typescript
import { sendChatMessageNotification } from "@/lib/push-notifications";

await sendChatMessageNotification({
  recipientUserId: "user_id",
  senderName: "John Doe",
  messageContent: "Hello!",
  conversationId: "conv_id",
  messageId: "msg_id",
});
```

This automatically sends to **all** user's devices (mobile app + web browsers).

#### Manually send web push:

```typescript
await fetch("/api/web-push/send", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    userId: "user_id",
    payload: {
      title: "New Message",
      body: "You have a new message!",
      data: {
        url: "/chat/123",
        conversationId: "123",
      },
    },
  }),
});
```

---

## 🔍 Testing

### 1. Test in Production Build (Development Mode Disabled)

```bash
pnpm build
pnpm start
```

### 2. Test Notification Flow

1. Open browser DevTools → Application → Service Workers
2. Verify `sw.js` is registered and activated
3. Click the bell icon → allow notifications
4. Send a test message in chat (from another account)
5. Minimize the browser window
6. **You should see a browser notification! 🎉**

### 3. Check Database

```bash
npx tsx scripts/check-push-tokens.ts
```

You should see:

```
👤 Your Name (your@email.com)
   ID: user_id
   Push Tokens: 1  # or more if you have mobile + web

   📱 Token 1:
      Platform: web
      Device: Web Browser
      Active: ✅
```

---

## 🎯 Notification Click Behavior

When user clicks a notification:

| Notification Type  | Opens                    |
| ------------------ | ------------------------ |
| Chat Message       | `/chat/{conversationId}` |
| Event Date Change  | `/events/{eventSlug}`    |
| Event Cancellation | `/events/{eventSlug}`    |
| Custom             | `data.url` or `/`        |

---

## 🐛 Troubleshooting

### Notifications Not Showing?

1. **Check browser permissions:**
   - Chrome: `chrome://settings/content/notifications`
   - Verify `localhost:3000` or `athlifyr.com` is allowed

2. **Check service worker:**
   - DevTools → Application → Service Workers
   - Verify `sw.js` is installed and active
   - Try "Unregister" → refresh → re-subscribe

3. **Check push token in database:**
   - Run `npx tsx scripts/check-push-tokens.ts`
   - Verify `platform: "web"` token exists with `isActive: true`

4. **Check backend logs:**
   - Look for `✅ Web push sent to ...` or `❌ Failed to send web push...`
   - Verify VAPID keys are set in environment

### Bell Icon Not Showing?

- Only shows for logged-in users
- Only shows in supported browsers (Chrome, Firefox, Edge)
- Check browser console for errors

### Service Worker Not Registering?

- Must be on HTTPS in production (or `localhost` for development)
- Check `next.config.mjs` has `withPWA` wrapper
- Verify `/public/sw.js` exists

---

## 📊 Browser Support

| Browser     | Supported          |
| ----------- | ------------------ |
| Chrome 50+  | ✅                 |
| Firefox 44+ | ✅                 |
| Edge 17+    | ✅                 |
| Safari 16+  | ✅                 |
| Opera 37+   | ✅                 |
| iOS Safari  | ❌ (not supported) |

---

## 🔒 Security

- **VAPID keys** authenticate your server with push services
- **Public key** is safe to expose (sent to browsers)
- **Private key** must stay secret (never commit to repo)
- **Subscriptions** are user-specific and cannot be shared

---

## 📚 Architecture

```
┌─────────────────┐
│   Browser       │
│  (User's PC)    │
│                 │
│  1. Subscribe   │──────────┐
│     to Push     │          │
└─────────────────┘          │
                              ▼
                    ┌──────────────────┐
                    │   Next.js API    │
                    │   /api/web-push/ │
                    │    /subscribe    │
                    └──────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │   PostgreSQL     │
                    │   PushToken      │
                    │   (platform:web) │
                    └──────────────────┘

┌─────────────────┐
│   Another User  │
│  Sends Message  │──────────┐
└─────────────────┘          │
                              ▼
                    ┌──────────────────┐
                    │  Push Notif Lib  │
                    │  sendPushNotif() │
                    └──────────────────┘
                              │
                ┌─────────────┴─────────────┐
                ▼                           ▼
      ┌──────────────────┐        ┌──────────────────┐
      │   Expo Push API  │        │   Web Push API   │
      │  (Mobile App)    │        │  (Browser)       │
      └──────────────────┘        └──────────────────┘
                │                           │
                ▼                           ▼
      ┌──────────────────┐        ┌──────────────────┐
      │  User's Phone    │        │  User's Browser  │
      │  🔔 Notification │        │  🔔 Notification │
      └──────────────────┘        └──────────────────┘
```

---

## ✅ Next Steps

1. **Add these env vars to your `.env.local`**:

   ```bash
   NEXT_PUBLIC_VAPID_PUBLIC_KEY="BAr4eyrVOovwOHHYgfZ-OT-5zzo9lMAYx-PoOpkUte2WyHEecOesDzqDbqEtX_-rRNoHHsVPduDN3JvvvgJX_YQ"
   VAPID_PRIVATE_KEY="bVmDDwy3BaJnqjoqIZSNFCmVQ28OrcU36s402vn_a0k"
   VAPID_SUBJECT="mailto:hello@athlifyr.com"
   ```

2. **Restart dev server**: `pnpm dev`

3. **Test in production build**:

   ```bash
   pnpm build
   pnpm start
   ```

4. **Open browser** → Log in → Click bell icon → Allow notifications

5. **Send test message** (from another account) → Minimize browser → See notification! 🎉

---

## 🎉 Done!

You now have fully functional Web Push Notifications! Users can receive browser notifications for chat messages, event updates, and more - even when the window is minimized.

**Key Points:**

- ✅ Works in Chrome, Firefox, Edge
- ✅ Survives browser restarts (subscription persists)
- ✅ Automatically integrated with existing chat system
- ✅ Clean UI with bell icon toggle
- ✅ Handles invalid subscriptions gracefully
