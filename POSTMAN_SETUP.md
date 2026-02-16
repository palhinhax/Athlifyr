# Athlifyr API - Postman Setup Guide

This guide will help you import and use the Athlifyr API Postman collection for testing.

## Files Included

- `athlifyr.postman_collection.json` - Complete API endpoint collection
- `athlifyr.postman_environment.json` - Environment variables for the collection

## Quick Start

### 1. Import Collection

1. Open Postman
2. Click **Import** button (top left)
3. Drag and drop `athlifyr.postman_collection.json` or click to browse
4. Click **Import**

### 2. Import Environment

1. Click **Environments** tab in the left sidebar
2. Click **Import** button
3. Drag and drop `athlifyr.postman_environment.json` or click to browse
4. Click **Import**

### 3. Activate Environment

1. In the top-right corner, select **Athlifyr Environment** from the dropdown
2. The environment is now active

## Configuration

### Setting Up Variables

After importing, you'll need to configure the following environment variables:

#### Required Variables

- **baseUrl**: API base URL
  - Local: `http://localhost:3000`
  - Production: `https://your-production-domain.com`

#### Authentication

- **authToken**: Your JWT authentication token
  - Leave empty initially
  - After logging in via NextAuth, copy your token here
  - The token is automatically included in all authenticated requests

#### Dynamic Variables (Set as needed)

These will be populated as you work with the API:

- **venueId**: ID of a venue
- **sessionId**: ID of a session
- **userId**: ID of a user
- **bookingId**: ID of a booking
- **planId**: ID of a subscription plan
- **subscriptionId**: ID of a subscription
- **workoutId**: ID of a workout
- **exerciseId**: ID of an exercise

## Collection Structure

The collection is organized into the following folders:

### 1. Authentication

- Get current user
- Forgot/reset password
- Email verification
- Token refresh
- Logout

### 2. Venues

- List, create, update, delete venues
- Search and filter venues
- Map data

### 3. Venue Sessions

- Manage sessions (list, create, update, delete)
- Recurring sessions
- Session booking (easy book)
- Bulk operations (assign coach/workout)
- Add/remove participants

### 4. Venue Bookings

- User bookings
- Cancel bookings

### 5. Venue Members

- List and search members
- Update member roles
- Remove members

### 6. Venue Invites

- Create and manage invites
- Accept/respond to invites

### 7. Venue Plans & Subscriptions

- Manage subscription plans
- Create and manage subscriptions
- Mark as paid, renew subscriptions

### 8. Workouts & Exercises

- CRUD operations for workouts
- Exercise library management
- Workout logs

### 9. Training Plans

- Create and manage training programs
- Assign plans to users

### 10. Events

- Weekly/monthly events
- Map events

### 11. Admin Endpoints

- User management (ban, role updates)
- Venue management (status, ownership)
- Reports and contacts
- Media management

## Usage Tips

### Testing Authentication Flow

1. **First, get an auth token:**
   - Use NextAuth to login via the web interface
   - Copy the JWT token from your browser cookies or localStorage
   - Paste into the `authToken` environment variable

2. **Test authenticated endpoints:**
   - All requests inherit the Bearer token from the environment
   - Some requests override this (marked with "No Auth")

### Working with Dynamic IDs

1. **After creating a resource:**
   - Copy the `id` from the response
   - Update the corresponding environment variable (e.g., `venueId`)
   - Use this variable in subsequent requests

2. **Example workflow:**
   ```
   1. Create Venue → Copy venue ID
   2. Update environment variable: venueId = "clxxxxx..."
   3. Create Session using {{venueId}}
   4. Copy session ID
   5. Update environment variable: sessionId = "clyyyyy..."
   6. Easy Book Session using {{sessionId}}
   ```

### Query Parameters

Many endpoints support optional query parameters:

- **Venues**: `page`, `pageSize`, `search`, `city`, `services`, `sports`, `lat`, `lng`, `radius`
- **Sessions**: `from`, `to`, `type`
- **Exercises**: `q` (search query)

Enable/disable query parameters using the checkboxes in Postman.

### Request Bodies

All POST/PATCH/PUT requests include realistic example payloads. Customize these based on your needs.

### Response Examples

The collection doesn't include pre-saved responses. After making requests, you can:

1. Click "Save Response" to add example responses
2. Use "Save as Example" for documentation

## Common Workflows

### 1. Create and Manage a Venue

```
1. POST /api/venues (Create venue)
2. PATCH /api/venues/:id (Update details)
3. POST /api/venues/:id/sessions (Add sessions)
4. POST /api/venues/:id/plans (Create subscription plans)
```

### 2. Book a Session

```
1. GET /api/venues/:id/sessions (Find available sessions)
2. POST /api/venues/:id/sessions/:sessionId/easy-book (Book session)
3. GET /api/venues/:id/bookings/user (View my bookings)
```

### 3. Manage Members

```
1. POST /api/venues/:id/invites (Invite a coach)
2. GET /api/venues/:id/members (View all members)
3. PATCH /api/venues/:id/members/:userId (Update member role)
```

## Environment Management

### Multiple Environments

You can create separate environments for different stages:

1. **Athlifyr Local**
   - baseUrl: `http://localhost:3000`

2. **Athlifyr Staging**
   - baseUrl: `https://staging.athlifyr.com`

3. **Athlifyr Production**
   - baseUrl: `https://athlifyr.com`

Switch between environments using the dropdown in the top-right.

## Troubleshooting

### 401 Unauthorized

- Check that `authToken` is set in your environment
- Verify the token hasn't expired
- Use the `/api/auth/refresh` endpoint to get a new token

### 404 Not Found

- Verify the resource ID exists
- Check that you're using the correct environment variables
- Ensure the route path is correct

### 403 Forbidden

- Check that your user has the required permissions
- Venue owners/coaches/admins have different access levels

### 500 Internal Server Error

- Check the server logs
- Verify request body format matches the expected schema
- Ensure required fields are included

## API Documentation

For detailed API documentation, refer to:

- Route files in `app/api/**/route.ts`
- Authorization utilities in `lib/venues/authorization.ts`
- Database schema in `prisma/schema.prisma`

## Support

For issues or questions:

- GitHub: https://github.com/anthropics/claude-code/issues
- Documentation: Check the codebase README

---

**Last Updated**: February 16, 2026
**API Version**: v1
**Collection Version**: 1.0.0
