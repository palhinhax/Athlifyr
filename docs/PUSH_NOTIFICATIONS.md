# Push Notifications for Chat Messages

This document describes the push notifications implementation for the Athlifyr mobile app.

## Overview

The push notification system allows users to receive real-time notifications when they receive new chat messages, even when the app is not in the foreground. The implementation uses Expo Push Notifications and integrates with the backend API.

## Architecture

### Backend Components

1. **Database Model (`PushToken`)**
   - Stores device push tokens for each user
   - Supports multiple devices per user
   - Tracks token status (active/inactive) and last seen timestamp

2. **API Endpoints**
   - `POST /api/push-tokens` - Register a device token
   - `GET /api/push-tokens` - Get all tokens for the authenticated user
   - `DELETE /api/push-tokens` - Deactivate all tokens for the user
   - `DELETE /api/push-tokens/:token` - Deactivate a specific token

3. **Push Notification Service (`lib/push-notifications.ts`)**
   - Sends push notifications via Expo Push API
   - Handles token invalidation
   - Respects user notification preferences
   - Provides functions for sending chat message notifications

4. **Message Creation Integration**
   - Modified `/api/chat/conversations/[id]/messages` endpoint
   - Automatically sends push notifications to recipients when new messages are created

### Mobile Components

1. **Push Notification Hook (`usePushNotifications`)**
   - Requests notification permissions
   - Generates and manages Expo Push Token
   - Registers token with backend
   - Handles notification events (received, tapped)
   - Implements deep linking to chat threads

2. **Push Notification Provider**
   - Wraps the app to initialize push notifications
   - Manages registration/deregistration based on auth state

3. **App Configuration (`app.json`)**
   - Configures notification channel for Android
   - Sets up notification icon and sound

## Setup

### Prerequisites

- Expo account and project ID
- Real Android or iOS device (push notifications don't work in simulators)

### Environment Variables

Add to your `.env` file (backend):

```bash
# No additional environment variables required for basic Expo Push Notifications
# The Expo Push API is publicly accessible and doesn't require an access token
```

### Mobile Setup

1. Install dependencies:

   ```bash
   cd mobile
   npm install --legacy-peer-deps
   ```

2. Update the project ID in `usePushNotifications.ts`:

   ```typescript
   const tokenData = await Notifications.getExpoPushTokenAsync({
     projectId: "your-actual-expo-project-id", // Replace with your Expo project ID
   });
   ```

3. Build and install the app on a real device:

   ```bash
   # For Android
   eas build --platform android --profile preview

   # For iOS (requires Apple Developer account)
   eas build --platform ios --profile preview
   ```

### Backend Setup

1. Database migration is already created in:

   ```
   prisma/migrations/20260210141350_add_push_notifications/migration.sql
   ```

2. Run the migration:

   ```bash
   npm run db:migrate:deploy
   ```

3. Regenerate Prisma Client:
   ```bash
   npx prisma generate
   ```

## Usage

### User Flow

1. **First Time Setup**
   - User logs into the mobile app
   - App automatically requests notification permissions
   - If granted, the app generates an Expo Push Token
   - Token is registered with the backend API

2. **Receiving Notifications**
   - User receives a new chat message
   - Backend sends push notification to all active devices
   - Notification appears on device (even if app is closed)
   - User taps notification
   - App opens and navigates to the chat thread

3. **Logout**
   - Tokens can optionally be deactivated on logout
   - User can re-register on next login

### Testing on Real Device

1. **Install the app** on a real Android or iOS device

2. **Grant notification permissions** when prompted

3. **Send a test message**:
   - Open the web app in a browser
   - Log in as a different user
   - Send a message to the mobile user
   - Notification should appear on the mobile device

4. **Test deep linking**:
   - Tap the notification
   - App should open and navigate to the correct chat thread

## Features

### V1 Features (Implemented)

- ✅ Expo push notifications setup for Android and iOS
- ✅ Request user permission for notifications
- ✅ Create notification channel on Android
- ✅ Generate and register Expo Push Token
- ✅ API endpoints to register/deactivate tokens
- ✅ PushToken database model
- ✅ Push notification sender using Expo Push API
- ✅ Trigger notifications on new message creation
- ✅ Deep-link navigation to chat thread
- ✅ Handle foreground and background notifications
- ✅ Multiple device support per user
- ✅ User notification preferences (`pushNotificationsEnabled`)
- ✅ Token invalidation handling

### Future Enhancements (Not Implemented)

- ⬜ Notification batching/throttling for rapid messages
- ⬜ Read receipts to avoid sending notifications for already-read messages
- ⬜ Presence tracking (don't send if user is actively viewing the thread)
- ⬜ Rich notifications with images/actions
- ⬜ Notification settings screen in mobile app
- ⬜ Analytics/tracking for notification delivery

## Troubleshooting

### Notifications Not Received

1. **Check permissions**: Ensure notification permissions are granted in device settings
2. **Check device**: Push notifications only work on real devices, not simulators
3. **Check token**: Verify token is registered in the database (`PushToken` table)
4. **Check user preferences**: Ensure `pushNotificationsEnabled` is `true` for the user
5. **Check backend logs**: Look for errors in push notification sending
6. **Check Expo status**: Visit [Expo Status](https://status.expo.dev/) to check service availability

### Deep Link Not Working

1. **Check notification data**: Ensure notification includes `conversationId` in data payload
2. **Check app state**: Verify the app is properly handling notification taps
3. **Check navigation**: Ensure Expo Router is properly configured

### Token Registration Failed

1. **Check network**: Ensure device has internet connectivity
2. **Check authentication**: Verify user is logged in
3. **Check API endpoint**: Test `/api/push-tokens` endpoint manually
4. **Check backend logs**: Look for errors in token registration

## Security Considerations

1. **Token Validation**: Tokens are validated by Expo Push API
2. **User Authorization**: Only authenticated users can register tokens
3. **Token Ownership**: Users can only deactivate their own tokens
4. **Message Preview**: Only truncated message preview is sent (max 80 chars)
5. **No Sensitive Data**: Notification body should not contain sensitive information

## API Reference

### POST /api/push-tokens

Register a new push token.

**Request:**

```json
{
  "token": "ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]",
  "platform": "android",
  "deviceId": "optional-device-id",
  "appVersion": "1.0.0"
}
```

**Response:**

```json
{
  "success": true,
  "token": {
    "id": "token-id",
    "userId": "user-id",
    "token": "ExponentPushToken[...]",
    "platform": "android",
    "isActive": true,
    "createdAt": "2026-02-10T14:00:00Z",
    "updatedAt": "2026-02-10T14:00:00Z"
  },
  "message": "Token registered successfully"
}
```

### GET /api/push-tokens

Get all active push tokens for the authenticated user.

**Response:**

```json
{
  "tokens": [
    {
      "id": "token-id",
      "token": "ExponentPushToken[...]",
      "platform": "android",
      "isActive": true,
      "lastSeenAt": "2026-02-10T14:00:00Z",
      "createdAt": "2026-02-10T13:00:00Z"
    }
  ]
}
```

### DELETE /api/push-tokens

Deactivate all tokens for the authenticated user.

**Response:**

```json
{
  "success": true,
  "message": "All tokens deactivated successfully"
}
```

### DELETE /api/push-tokens/:token

Deactivate a specific token.

**Response:**

```json
{
  "success": true,
  "message": "Token deactivated successfully"
}
```

## Testing Checklist

- [ ] Grant notification permissions on device
- [ ] Token registered successfully
- [ ] Send message from web app
- [ ] Notification received on mobile device
- [ ] Tap notification
- [ ] App opens and navigates to correct chat thread
- [ ] Send multiple messages rapidly (test batching behavior)
- [ ] Test with app in foreground
- [ ] Test with app in background
- [ ] Test with app completely closed
- [ ] Test logout and token deactivation
- [ ] Test with multiple devices
- [ ] Test notification preferences toggle

## Resources

- [Expo Push Notifications Documentation](https://docs.expo.dev/push-notifications/overview/)
- [Expo Push Notification Tool](https://expo.dev/notifications) - Test notifications manually
- [Expo Push API](https://docs.expo.dev/push-notifications/sending-notifications/)
