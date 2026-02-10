# Athlifyr Mobile App

React Native mobile application for Athlifyr built with Expo Router.

## 📱 Tech Stack

- **Framework**: Expo SDK 54 with TypeScript
- **Navigation**: Expo Router (file-based routing)
- **Maps**: Mapbox GL Native (via @rnmapbox/maps)
- **API Client**: Axios with React Query
- **Internationalization**: i18next (6 languages: en, pt, es, fr, de, it)
- **State Management**: Zustand
- **Authentication**: Expo Secure Store
- **Icons**: Lucide React Native
- **Styling**: React Native StyleSheet (theme-based)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm (comes with Node.js)
- Expo CLI
- iOS Simulator (macOS) or Android Emulator

### Installation

1. Navigate to the mobile directory:

```bash
cd mobile
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

Configure the required environment variables:

```
EXPO_PUBLIC_API_URL=http://localhost:3000
EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN=your_mapbox_access_token_here
```

**Important**: 
- For Android emulator, use `EXPO_PUBLIC_API_URL=http://10.0.2.2:3000`
- Get your Mapbox access token from [Mapbox Account](https://account.mapbox.com/access-tokens/)

### Running the App

1. **Start the Next.js backend** (in the root directory):

```bash
cd ..
pnpm dev
```

2. **Start the mobile app** (in the mobile directory):

**Note**: Mapbox requires native modules, so you need to use a **development build** instead of Expo Go:

```bash
# Create a development build for Android
npx expo run:android

# Or for iOS (macOS only)
npx expo run:ios
```

For Expo Go (without map features):
```bash
npx expo start
```

Then:

- Press `i` for iOS simulator
- Press `a` for Android emulator
- Scan QR code with Expo Go app for physical device

## 📁 Project Structure

```
mobile/
├── app/                  # Expo Router app directory
│   ├── (tabs)/           # Tab navigation layout
│   │   ├── index.tsx     # Events screen (default)
│   │   ├── venues.tsx    # Venues screen
│   │   ├── search.tsx    # Search screen
│   │   ├── profile.tsx   # Profile screen
│   │   └── _layout.tsx   # Tab layout configuration
│   └── _layout.tsx       # Root layout
├── src/
│   ├── components/       # Reusable UI components
│   │   └── EventCard.tsx # Event card component
│   ├── lib/              # Utilities, API client, helpers
│   │   ├── api.ts        # Axios instance with interceptors
│   │   ├── i18n.ts       # i18next configuration
│   │   └── auth-store.ts # Authentication state management
│   ├── types/            # TypeScript type definitions
│   │   └── index.ts      # Event, Venue, User types
│   ├── constants/        # App constants (theme, sports, etc.)
│   │   ├── theme.ts      # Theme configuration
│   │   └── index.ts      # General constants
│   └── locales/          # Translation files
│       ├── en/common.json
│       ├── pt/common.json
│       ├── es/common.json
│       ├── fr/common.json
│       ├── de/common.json
│       └── it/common.json
├── App.tsx               # Expo Router entry point
├── package.json
└── .env                  # Environment variables
```

## ✨ Features

### Events Screen (Default)

The Events screen is the default page when the app opens, featuring:

- **Event List**: Browse all upcoming events with infinite scroll
- **Search**: Real-time search with debouncing
- **Event Cards**: Display event image, title, date, location, and variants
- **Pull to Refresh**: Refresh the events list
- **API Integration**: Connects to the same Next.js API as the web app

### Navigation

The app uses a bottom tab navigation with:

1. **Events** (default) - Browse and search events
2. **Map** - View events on an interactive map with clustering
3. **Venues** - Coming soon
4. **Feed** - Activity feed from the community
5. **Exercises** - Exercise tracking
6. **Profile** - User profile and settings

### Events Map

The Events Map screen provides an interactive Mapbox-based map with:

- **Event Markers**: Visual representation of all events with valid coordinates
- **Marker Clustering**: Automatic grouping of nearby events when zoomed out
- **Interactive Navigation**: Tap any marker to view event details
- **Performance Optimized**: Uses GeoJSON sources for efficient rendering
- **Missing Coordinates Handling**: Events without coordinates are logged but don't crash the app

## 🗺️ Mapbox Integration

### Setup Requirements

The Events Map feature requires Mapbox and uses native modules that are **not compatible with Expo Go**. You must use a **development build**.

### Get a Mapbox Access Token

1. Create a free account at [Mapbox](https://account.mapbox.com/auth/signup/)
2. Go to [Access Tokens](https://account.mapbox.com/access-tokens/)
3. Copy your default public token or create a new one
4. Add it to your `.env` file:

```env
EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN=pk.your_actual_token_here
```

### Running with Mapbox (Development Build)

Since Mapbox requires native modules, you need to build the app with native code:

#### Android

```bash
# First time or after dependency changes
npx expo prebuild --clean

# Build and run on Android device/emulator
npx expo run:android
```

#### iOS (macOS only)

```bash
# First time or after dependency changes
npx expo prebuild --clean

# Build and run on iOS simulator/device
npx expo run:ios
```

### Without Mapbox (Expo Go)

If you want to run the app in Expo Go without the map feature:

1. Remove the Mapbox access token from `.env`
2. The map screen will show an error message instead of crashing
3. All other features will work normally

```bash
npx expo start
# Scan QR code with Expo Go app
```

## 🌍 Internationalization

The app supports 6 languages:

- 🇬🇧 English (en)
- 🇵🇹 Portuguese (pt)
- 🇪🇸 Spanish (es)
- 🇫🇷 French (fr)
- 🇩🇪 German (de)
- 🇮🇹 Italian (it)

Language is auto-detected from device settings and persisted using AsyncStorage.

## 🎨 Theming

Theme configuration in `src/constants/theme.ts` matches the web app's design system:

- **Colors**: Primary, secondary, background, text, borders
- **Typography**: Font sizes, weights, line heights
- **Spacing**: Consistent spacing scale (xs, sm, md, lg, xl)
- **Border Radius**: Consistent border radius scale
- **Shadows**: Platform-specific elevation/shadows

## 🔧 API Integration

The mobile app uses the **same API** as the Next.js web app:

- **Base URL**: Configured via `EXPO_PUBLIC_API_URL`
- **Endpoints**: `/api/events`, `/api/venues`, etc.
- **Request Interceptor**: Adds auth tokens automatically
- **Response Interceptor**: Handles 401 errors and token refresh

Example API call:
```typescript
const response = await api.get<EventsResponse>('/events?page=1&pageSize=20');
```

## 📝 Type Safety

Full TypeScript support with shared types:

- `Event` - Event model with variants, triathlon segments
- `EventVariant` - Event distance/variant options
- `Venue` - Venue model
- `User` - User model
- API response types with pagination

## 🧪 Development Tips

### Hot Reloading

Expo provides fast refresh - changes to components will hot reload instantly.

### Network Debugging

To see API requests:

1. Shake device/simulator to open dev menu
2. Select "Debug Remote JS"
3. Open Chrome DevTools Network tab

### Clear Cache

If you encounter issues:

```bash
npx expo start -c
```

## 🐛 Troubleshooting

**Android emulator can't reach localhost:**
- Update `.env` to use `EXPO_PUBLIC_API_URL=http://10.0.2.2:3000`

**Metro bundler issues:**
- Clear cache: `npx expo start -c`
- Reset node_modules: `rm -rf node_modules && npm install`

**Module resolution errors:**
- Ensure `@` paths are configured in `tsconfig.json`
- Restart Metro bundler

## 📦 Building for Production

### EAS Build (Recommended)

```bash
npm install -g eas-cli
eas build --platform ios
eas build --platform android
```

### Classic Build

```bash
npx expo build:ios
npx expo build:android
```

## 📚 Learn More

- [Expo Router Documentation](https://docs.expo.dev/router/introduction/)
- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)

## 🤝 Contributing

- All translations should be provided for all 6 languages
- Follow TypeScript best practices
- Keep components modular and under 200 lines
- Use conventional commit messages
