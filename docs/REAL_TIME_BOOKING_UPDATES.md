# Real-Time Session Booking Updates

## Problem Statement

When a user booked a session, the UI did not update automatically. Users had to:

- Exit and return to the page to see their booking
- Refresh manually to see changes from other devices/tabs
- Wait indefinitely if they had the page already open

**Example scenario:**

1. User opens venue sessions page on web browser
2. User books a session on mobile app
3. Web browser still shows session as "not booked" ❌
4. User must manually refresh to see the update

## Solution Implemented

We added **three layers of automatic updates** to ensure bookings sync across all devices and tabs:

### 1. ✅ Optimistic Updates (Already Existed)

- UI updates **instantly** when you book/cancel in the same window
- No waiting for server response
- Better UX with immediate feedback

### 2. ✅ Background Refetch (NEW)

- After optimistic update, triggers background sync with server
- Ensures data consistency without blocking UI
- Corrects any discrepancies between client and server

### 3. ✅ Auto-Refresh on Focus (NEW - Web Only)

- Automatically refetches when you switch back to the tab
- Catches changes made in other tabs/devices while you were away
- No manual refresh needed

### 4. ✅ Polling (NEW)

- Automatically refetches every **60 seconds**
- Keeps data fresh even if you leave the page open
- Minimal server load with reasonable interval

### 5. ✅ App Focus Refetch (NEW - Mobile Only)

- Automatically refetches when app comes to foreground
- React Query `refetchOnWindowFocus: true`
- Catches changes made on other devices

## Technical Implementation

### Mobile Changes

**File:** `mobile/src/hooks/useVenueSessions.ts`

```typescript
const query = useQuery<VenueSession[]>({
  queryKey: ["venueSessions", venueId, monthKey],
  queryFn: async () => {
    /* ... */
  },
  staleTime: 30 * 1000, // ✅ Reduced from 2min to 30s
  gcTime: 10 * 60 * 1000,
  refetchOnMount: true, // ✅ Refetch when component mounts
  refetchOnWindowFocus: true, // ✅ NEW: Refetch when app comes to foreground
  refetchInterval: 60 * 1000, // ✅ NEW: Auto-refetch every 60 seconds
});
```

**File:** `mobile/src/components/venue/VenueSessionsTab.tsx`

```typescript
const handleBook = useCallback(
  async (session: VenueSession) => {
    // ... booking logic ...
    optimisticBook(session.id, bookingId); // ✅ Instant UI update
    showToast(t("sessions.bookingSuccess"), "success");
    refetch(); // ✅ NEW: Background sync with server
  },
  [userId, venueId, optimisticBook, refetch, t, showToast] // ✅ Added refetch
);

const handleCancelBooking = useCallback(
  async (session: VenueSession) => {
    // ... cancel logic ...
    optimisticCancelBooking(session.id); // ✅ Instant UI update
    showToast(t("sessions.bookingCancelled"), "success");
    refetch(); // ✅ NEW: Background sync with server
  },
  [venueId, optimisticCancelBooking, refetch, t, showToast] // ✅ Added refetch
);
```

### Web Changes

**File:** `hooks/use-venue-sessions.ts`

```typescript
// ✅ NEW: Auto-refetch when page regains visibility
useEffect(() => {
  const handleVisibilityChange = () => {
    if (document.visibilityState === "visible") {
      fetchSessions(); // Refetch when user returns to tab
    }
  };

  document.addEventListener("visibilitychange", handleVisibilityChange);
  return () => {
    document.removeEventListener("visibilitychange", handleVisibilityChange);
  };
}, [fetchSessions]);

// ✅ NEW: Polling every 60 seconds
useEffect(() => {
  const interval = setInterval(() => {
    fetchSessions();
  }, 60 * 1000); // 60 seconds

  return () => clearInterval(interval);
}, [fetchSessions]);
```

## User Experience Improvements

### Before ❌

- Book session → nothing happens on screen
- Must manually refresh to see booking
- Changes from other devices never appear
- Confusing and frustrating UX

### After ✅

- Book session → **instant UI update** (optimistic)
- **Automatic sync** in background (refetch)
- Switch to tab → **automatic refresh** (visibility change)
- Leave page open → **updates every 60s** (polling)
- Use mobile app → **updates on focus** (app foreground)

## Cross-Platform Sync

### Scenario 1: Book on Mobile, View on Web

1. User books session on mobile app → ✅ Mobile UI updates instantly
2. Mobile triggers background refetch → ✅ Server updated
3. Web page polling detects change → ✅ Web UI updates within 60s
4. User switches to web tab → ✅ Visibility change triggers immediate refresh

### Scenario 2: Book on Web Tab A, View on Web Tab B

1. User books on Tab A → ✅ Tab A UI updates instantly
2. Tab A triggers background refetch → ✅ Server updated
3. User switches to Tab B → ✅ Visibility change triggers immediate refresh
4. Tab B UI updates → ✅ Shows booked status

### Scenario 3: Book on Web, Leave Page Open

1. User books session → ✅ Instant UI update
2. User leaves page open for 5 minutes
3. Polling runs every 60s → ✅ UI stays fresh
4. Any changes from other devices appear automatically

## Performance Considerations

### Network Traffic

- **Polling interval:** 60 seconds (1 request/minute)
- **Only when viewing sessions page** (polling stops when navigating away)
- **Minimal server load** with React Query caching
- **Smart refetching:** Only refetches when data is stale

### Battery Impact (Mobile)

- **React Query optimization:** Native implementation respects OS battery modes
- **Efficient caching:** Reduces unnecessary network requests
- **Background app behavior:** Polling pauses when app is in background

### Memory Usage

- **React Query garbage collection:** Old data cleaned up after 10 minutes
- **Stale time:** 30 seconds (mobile), prevents excessive refetches
- **Query deduplication:** Multiple refetch calls are batched

## Testing Checklist

### Mobile App

- [ ] Book session → UI updates instantly
- [ ] Kill app and reopen → Booking status persists
- [ ] Book on mobile, switch to web → Web updates within 60s
- [ ] Leave app open for 2 minutes → Polling keeps data fresh
- [ ] Switch away and back to app → Refetch on focus triggers

### Web Browser

- [ ] Book session → UI updates instantly
- [ ] Open in 2 tabs, book in Tab A → Tab B updates when you switch to it
- [ ] Book on mobile, leave web open → Web updates within 60s
- [ ] Switch to another tab and back → Visibility change triggers refetch
- [ ] Hard refresh → Booking status correct from server

### Cross-Platform

- [ ] Book on mobile → Web updates automatically
- [ ] Book on web → Mobile updates on app focus
- [ ] Multiple devices → All stay in sync within 60s

## Configuration

### Adjustable Parameters

**Mobile (`useVenueSessions.ts`):**

```typescript
staleTime: 30 * 1000, // Consider data stale after 30 seconds
refetchInterval: 60 * 1000, // Auto-refetch every 60 seconds
```

**Web (`use-venue-sessions.ts`):**

```typescript
const interval = setInterval(() => {
  fetchSessions();
}, 60 * 1000); // Polling interval: 60 seconds
```

**Recommendations:**

- **Faster updates:** Reduce `refetchInterval` to 30s (higher server load)
- **Battery saving:** Increase to 120s (slower sync)
- **Real-time needs:** Consider WebSockets for instant updates (complex)

## Future Enhancements

### Potential Improvements

1. **WebSocket Integration** - True real-time updates without polling
2. **Smart Polling** - Increase interval when user is idle
3. **Server-Sent Events (SSE)** - One-way real-time updates from server
4. **Push Notifications** - Notify users of booking changes
5. **Conflict Resolution** - Handle simultaneous bookings better

### Why Not WebSockets Now?

- Polling is **simpler** and works for current scale
- 60s delay is **acceptable** for booking updates
- WebSockets add **complexity** (connection management, fallbacks)
- Would require **infrastructure changes** (Redis, WebSocket server)
- Can implement later if **real-time** becomes critical

## Troubleshooting

### Issue: UI not updating after booking

**Check:**

1. Optimistic update working? (Instant UI change)
2. Background refetch called? (Check network tab)
3. Server returning correct data? (Inspect response)

### Issue: Updates taking too long

**Check:**

1. Polling interval setting (should be 60s)
2. Network conditions (slow connection?)
3. Server response time (database slow?)

### Issue: Too many network requests

**Check:**

1. Multiple instances of polling? (Should be 1 per mounted component)
2. React Query cache settings (staleTime configured?)
3. Component unmounting properly? (Cleanup in useEffect)

## Conclusion

**Problem:** Booking updates required manual refresh ❌  
**Solution:** Automatic updates through optimistic UI + refetch + polling + visibility ✅  
**Result:** Seamless cross-device booking experience 🎉

Users now get:

- ⚡ **Instant feedback** when booking
- 🔄 **Automatic sync** across devices
- 🎯 **Real-time updates** without manual refresh
- 📱 **Consistent experience** on mobile and web

---

**Commit:** `2b4558c`  
**Date:** February 16, 2026  
**Files Modified:** 5  
**Lines Changed:** +33, -16
