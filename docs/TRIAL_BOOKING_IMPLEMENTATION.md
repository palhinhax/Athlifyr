# Trial Class Booking Feature - Implementation Guide

## Overview
This feature allows venues to offer trial classes to new users. A trial class is a one-time opportunity for users who have never booked at a venue to request a trial session, which requires owner approval.

## Core Business Rules

1. **Optional Feature**: Trial booking is controlled by the `enableTrialBooking` boolean in the Venue model (default: `false`)
2. **No Plan Required**: Trial bookings do NOT require an active subscription plan
3. **One-Time Eligibility**: Users can only request a trial class if they have NEVER had any booking at the venue (neither TRIAL nor NORMAL)
4. **Owner Approval**: All trial booking requests are created with `status: PENDING` and require owner approval
5. **Booking Conversion**: When accepted, the trial request becomes a confirmed booking (`status: BOOKED`) and occupies a session slot

## Database Schema Changes

### New Enums

```prisma
enum BookingType {
  NORMAL
  TRIAL
}

enum BookingStatus {
  PENDING    // NEW - for trial booking requests
  BOOKED
  CANCELLED
  NO_SHOW
  ATTENDED
  REJECTED   // NEW - for rejected trial requests
}
```

### Model Changes

```prisma
model Venue {
  // ... existing fields
  enableTrialBooking Boolean @default(false)  // NEW
}

model VenueBooking {
  // ... existing fields
  bookingType BookingType @default(NORMAL)  // NEW
  
  @@index([bookingType])  // NEW
}
```

## Backend API Routes

### 1. Create Trial Booking Request
**POST** `/api/venues/:venueId/trial-bookings`

Request Body:
```json
{
  "sessionId": "session_id_here"
}
```

Validations:
- User must be authenticated
- `enableTrialBooking` must be `true` on the venue
- User must have NO existing bookings (TRIAL or NORMAL) at this venue
- Session must exist, not be full, and not have started

Response (201):
```json
{
  "message": "Trial booking request created successfully",
  "booking": { /* booking object */ }
}
```

### 2. Get Pending Trial Requests (Owner/Admin Only)
**GET** `/api/venues/:venueId/trial-bookings?status=PENDING`

Authorization: Must be venue owner or admin

Response (200):
```json
{
  "trialBookings": [
    {
      "id": "booking_id",
      "createdAt": "2026-02-09T15:00:00.000Z",
      "user": {
        "id": "user_id",
        "name": "John Doe",
        "email": "john@example.com",
        "image": "https://..."
      },
      "session": {
        "id": "session_id",
        "title": "CrossFit Class",
        "startsAt": "2026-02-10T09:00:00.000Z",
        "endsAt": "2026-02-10T10:00:00.000Z"
      }
    }
  ]
}
```

### 3. Accept Trial Request
**POST** `/api/trial-bookings/:bookingId/accept`

Authorization: Must be venue owner or admin

Actions:
- Changes booking `status` from `PENDING` to `BOOKED`
- Session slot becomes occupied
- User becomes ineligible for future trial requests at this venue

Response (200):
```json
{
  "message": "Trial booking accepted successfully",
  "booking": { /* updated booking object */ }
}
```

### 4. Reject Trial Request
**POST** `/api/trial-bookings/:bookingId/reject`

Request Body (optional):
```json
{
  "reason": "Optional rejection reason"
}
```

Authorization: Must be venue owner or admin

Actions:
- Changes booking `status` from `PENDING` to `REJECTED`
- Session slot remains available
- Request is removed from pending list

Response (200):
```json
{
  "message": "Trial booking rejected successfully",
  "booking": { /* updated booking object */ }
}
```

## Frontend Components

### 1. TrialBookingButton
**Location**: `components/trial-booking-button.tsx`

**Purpose**: Displays a "Book Trial Class" button on the public venue page for eligible users

**Props**:
```typescript
interface TrialBookingButtonProps {
  venueId: string;
  venueName: string;
  userId?: string;
  enableTrialBooking: boolean;
  onSuccess?: () => void;
}
```

**Behavior**:
- Automatically checks user eligibility on mount
- Only renders if:
  - `enableTrialBooking === true`
  - User is authenticated (`userId` present)
  - User has NO bookings at the venue (eligible)
- Opens a dialog to guide user through trial booking request

**Integration Example**:
```tsx
import { TrialBookingButton } from "@/components/trial-booking-button";

<TrialBookingButton
  venueId={venue.id}
  venueName={venue.name}
  userId={session?.user?.id}
  enableTrialBooking={venue.enableTrialBooking ?? false}
  onSuccess={() => {
    // Refresh venue data or show success message
  }}
/>
```

### 2. TrialBookingRequestsPanel
**Location**: `components/trial-booking-requests-panel.tsx`

**Purpose**: Displays pending trial booking requests for venue owners/admins

**Props**:
```typescript
interface TrialBookingRequestsPanelProps {
  venueId: string;
  locale: string;
  onRequestHandled?: () => void;
}
```

**Behavior**:
- Fetches pending trial requests on mount
- Only renders if there are pending requests
- Allows owner/admin to accept or reject each request
- Automatically refreshes list after action

**Integration Example**:
```tsx
import { TrialBookingRequestsPanel } from "@/components/trial-booking-requests-panel";

// In owner/admin view, above the sessions calendar:
{isOwnerOrAdmin && (
  <TrialBookingRequestsPanel
    venueId={venue.id}
    locale={locale}
    onRequestHandled={() => {
      // Refresh sessions or bookings
      refreshSessions();
    }}
  />
)}
```

## Venue Settings Integration

The `enableTrialBooking` toggle is already integrated in:
- **Component**: `components/venue-sessions-settings.tsx`
- **Location**: In the "Quick Book" section, below "Require Active Plan"

**Translation Keys**:
- Label: `venues.quickBook.enableTrialBooking`
- Hint: `venues.quickBook.enableTrialBookingHint`

## Translations

All translations are available in 6 languages:
- English (en)
- Portuguese (pt)
- Spanish (es)
- French (fr)
- German (de)
- Italian (it)

**Translation Namespace**: `venues.trialBooking`

**Available Keys**:
- `title`: "Trial Class"
- `bookTrial`: "Book Trial Class"
- `requestSent`: "Trial class request sent!"
- `requestPending`: "Trial class request pending"
- `requestDescription`: "Your trial class request has been sent..."
- `notEligible`: "Not eligible for trial class"
- `alreadyHasBooking`: "You've already had a class at this venue"
- `notEnabled`: "Trial classes are not available at this venue"
- `pendingRequests`: "Pending Trial Requests"
- `noPendingRequests`: "No pending trial class requests"
- `requestFrom`: "Request from {name}"
- `requestedOn`: "Requested on {date}"
- `requestedFor`: "Requested for {date} at {time}"
- `accept`: "Accept"
- `reject`: "Reject"
- `accepted`: "Trial class accepted"
- `rejected`: "Trial class rejected"
- `acceptSuccess`: "Trial class request accepted successfully"
- `rejectSuccess`: "Trial class request rejected successfully"
- `acceptError`: "Failed to accept trial class request"
- `rejectError`: "Failed to reject trial class request"

## Integration Points

### Public Venue Page
**File**: `app/[locale]/venues/[slug]/page.tsx` or `components/venue-detail-client.tsx`

**Suggested Location**: Near the top of the page, alongside other primary actions (e.g., "Join", "Subscribe")

**Code Addition**:
```tsx
{venue.enableTrialBooking && session?.user && (
  <TrialBookingButton
    venueId={venue.id}
    venueName={venue.name}
    userId={session.user.id}
    enableTrialBooking={venue.enableTrialBooking}
  />
)}
```

### Owner Dashboard / Sessions Calendar
**File**: `components/venue-sessions-calendar.tsx`

**Suggested Location**: Above the calendar, before the "Add Session" button

**Code Addition**:
```tsx
{isOwnerOrAdmin && (
  <TrialBookingRequestsPanel
    venueId={venueId}
    locale={locale}
    onRequestHandled={() => {
      fetchSessions(); // Refresh sessions after handling request
    }}
  />
)}
```

## Testing Checklist

### Backend
- [ ] Trial booking creation validates `enableTrialBooking === true`
- [ ] Trial booking creation validates user has no prior bookings
- [ ] Trial booking creation checks session availability and capacity
- [ ] Owner can fetch pending trial requests
- [ ] Owner can accept trial request (converts to BOOKED)
- [ ] Owner can reject trial request (marks as REJECTED)
- [ ] Non-owners cannot accept/reject trial requests (403 error)

### Frontend
- [ ] Trial booking button only shows for eligible users
- [ ] Trial booking button does not show if user has bookings
- [ ] Trial booking button does not show if feature is disabled
- [ ] Owner sees pending trial requests panel
- [ ] Owner can accept trial request
- [ ] Owner can reject trial request
- [ ] Panel refreshes after accepting/rejecting
- [ ] Venue settings toggle works correctly

### Translations
- [ ] All 6 languages have complete translations
- [ ] Translation keys are used correctly in components
- [ ] Date formatting respects locale

## Migration Instructions

1. **Run Database Migration**:
   ```bash
   npx prisma migrate deploy
   ```
   Or for development:
   ```bash
   npx prisma migrate dev
   ```

2. **Generate Prisma Client**:
   ```bash
   npx prisma generate
   ```

3. **Deploy Backend**:
   - Ensure all API routes are deployed
   - Verify environment variables are set

4. **Test Feature**:
   - Enable `enableTrialBooking` on a test venue
   - Create a test user with no bookings
   - Verify trial booking button appears
   - Submit a trial booking request
   - Log in as venue owner
   - Verify request appears in pending requests panel
   - Test accept/reject functionality

## Security Considerations

- ✅ All API routes verify user authentication
- ✅ Owner/admin actions verify authorization via `canManageVenue`
- ✅ Trial booking validation prevents abuse (one-time eligibility)
- ✅ Session validation prevents booking past/full sessions
- ✅ User data is properly sanitized in API responses

## Future Enhancements

Possible improvements for future iterations:
1. **Email Notifications**: Notify users when trial request is accepted/rejected
2. **Rejection Reasons**: Allow owners to provide custom rejection reasons
3. **Trial Booking History**: Show rejected/accepted history to owners
4. **Analytics**: Track trial booking conversion rates
5. **Automated Reminders**: Remind owners of pending trial requests
6. **Batch Actions**: Allow owners to accept/reject multiple requests at once
7. **Custom Trial Policies**: Allow venues to set custom trial booking rules (e.g., specific session types, times)

## Support

For questions or issues with this feature:
- Check API error responses for detailed error messages
- Review browser console for frontend errors
- Check server logs for backend errors
- Verify database migration was applied successfully
- Ensure Prisma client is regenerated after schema changes
