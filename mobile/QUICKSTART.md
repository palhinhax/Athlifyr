# Athlifyr Mobile - Quick Start Guide

## What Changed

The mobile app has been updated to use **Expo Router** with the **Events page as the default screen**.

### Key Changes:

1. ✅ **Expo Router Navigation** - File-based routing system
2. ✅ **Events Screen** - Default landing page showing all events
3. ✅ **Same API** - Uses the Next.js API endpoints
4. ✅ **Event Cards** - Displays events with images, dates, and locations
5. ✅ **Search** - Real-time event search with debouncing
6. ✅ **Infinite Scroll** - Automatic pagination as you scroll
7. ✅ **Pull to Refresh** - Refresh events by pulling down

### New Structure:

```
mobile/
├── app/                    # Expo Router pages
│   ├── (tabs)/
│   │   ├── index.tsx       # 👈 Events screen (DEFAULT)
│   │   ├── venues.tsx
│   │   ├── search.tsx
│   │   └── profile.tsx
│   └── _layout.tsx
├── src/
│   └── components/
│       └── EventCard.tsx   # 👈 Event card component
```

## Quick Start

### 1. Install Dependencies

```bash
cd mobile
npm install
```

### 2. Start the Backend

```bash
cd ..
pnpm dev
```

### 3. Start the Mobile App

```bash
cd mobile
npx expo start
```

### 4. Run on Device/Simulator

- Press `i` for iOS
- Press `a` for Android
- Scan QR with Expo Go app

## What You'll See

When the app opens, you'll immediately see the **Events screen** with:

- A search bar at the top
- A grid of event cards showing:
  - Event image (or placeholder)
  - Event title
  - Date
  - Location (city, country)
  - Number of variants
- Pull down to refresh
- Scroll down to load more events

## API Connection

The mobile app connects to the same API as the web app:

- **Endpoint**: `http://localhost:3000/api/events`
- **Android Emulator**: Use `http://10.0.2.2:3000` in `.env`

## Troubleshooting

### Can't connect to API on Android Emulator?

Update `.env`:

```
EXPO_PUBLIC_API_URL=http://10.0.2.2:3000
```

### Metro bundler issues?

Clear cache:

```bash
npx expo start -c
```

### Module errors?

Reinstall:

```bash
rm -rf node_modules
npm install
```

## Next Steps

The following screens are placeholders and can be implemented next:

- [ ] Venues screen
- [ ] Search screen
- [ ] Profile screen
- [ ] Event detail page
- [ ] Authentication

## Features Available

✅ Events list with pagination
✅ Event search
✅ Pull to refresh
✅ Infinite scroll
✅ Event cards with images
✅ Multi-language support (en, pt, es, fr, de, it)
✅ Themed UI matching web app
✅ TypeScript types synced with API

Enjoy exploring events on mobile! 🎉
