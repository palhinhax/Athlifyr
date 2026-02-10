# Athlifyr Mobile App

React Native mobile application for Athlifyr built with Expo Router.

## 📱 Tech Stack

- **Framework**: Expo SDK 54 with TypeScript
- **Navigation**: Expo Router (file-based routing)
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

3. **Configure environment variables**:

Copy the `.env.example` to `.env`:

```bash
cp .env.example .env
```

Update the `.env` file with your configuration:

```env
# API Configuration
EXPO_PUBLIC_API_URL=http://localhost:3000

# For Android emulator, use:
# EXPO_PUBLIC_API_URL=http://10.0.2.2:3000

# Google OAuth Configuration (required for Google Sign-In)
EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=your_web_client_id.apps.googleusercontent.com
EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID=your_android_client_id.apps.googleusercontent.com
EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID=your_ios_client_id.apps.googleusercontent.com
```

**Getting Google OAuth credentials:**

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable **Google+ API** (or Google Sign-In API)
4. Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
5. Create three OAuth clients:
   - **Web application** (for web client ID)
   - **Android** (for Android client ID, use package name from `app.json`)
   - **iOS** (for iOS client ID, use bundle identifier from `app.json`)
6. Copy the client IDs to your `.env` file

### Running the App

1. **Start the Next.js backend** (in the root directory):

```bash
cd ..
pnpm dev
```

2. **Start the mobile app** (in the mobile directory):

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
2. **Venues** - Coming soon
3. **Search** - Coming soon
4. **Profile** - Coming soon

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
const response = await api.get<EventsResponse>("/events?page=1&pageSize=20");
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
