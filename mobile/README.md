# Athlifyr Mobile App

React Native mobile application for Athlifyr built with Expo.

## 📱 Tech Stack

- **Framework**: Expo SDK with TypeScript
- **Navigation**: Expo Router + React Navigation
- **API Client**: Axios with React Query
- **Internationalization**: i18next (6 languages: en, pt, es, fr, de, it)
- **State Management**: Zustand
- **Authentication**: Expo Secure Store
- **Maps**: React Native Maps
- **Styling**: React Native StyleSheet (theme-based)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or pnpm
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

3. Create `.env` file from example:

```bash
cp .env.example .env
```

4. Update `.env` with your API URL:

```
EXPO_PUBLIC_API_URL=http://localhost:3000
```

### Running the App

Start the development server:

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
├── src/
│   ├── components/       # Reusable UI components
│   ├── lib/              # Utilities, API client, helpers
│   │   ├── api.ts        # Axios instance with interceptors
│   │   ├── i18n.ts       # i18next configuration
│   │   └── auth-store.ts # Authentication state management
│   ├── hooks/            # Custom React hooks
│   ├── types/            # TypeScript type definitions
│   ├── constants/        # App constants (theme, sports, etc.)
│   │   ├── theme.ts      # Theme configuration
│   │   └── index.ts      # General constants
│   └── locales/          # Translation files
│       ├── en/
│       ├── pt/
│       ├── es/
│       ├── fr/
│       ├── de/
│       └── it/
├── App.tsx               # Entry point
├── package.json
└── .env.example          # Environment variables template
```

## 🌍 Internationalization

The app supports 6 languages out of the box:

- 🇬🇧 English (en)
- 🇵🇹 Portuguese - European (pt-PT)
- 🇪🇸 Spanish (es)
- 🇫🇷 French (fr)
- 🇩🇪 German (de)
- 🇮🇹 Italian (it)

Language is auto-detected from device settings and can be changed in app settings.

## 🔐 Authentication

Authentication uses JWT tokens stored securely with Expo Secure Store:

- Access token for API requests
- Refresh token for token rotation
- Automatic token refresh on 401 responses

## 🎨 Theming

The app uses a centralized theme configuration (`src/constants/theme.ts`) matching the web app's design:

- Colors (primary, secondary, semantic)
- Typography (font sizes, weights, line heights)
- Spacing system
- Border radius
- Shadows

## 🔧 API Integration

API client is configured in `src/lib/api.ts` with:

- Base URL from environment variables
- Request interceptor for auth tokens
- Response interceptor for error handling
- Automatic token refresh on 401

## 📝 Type Safety

Full TypeScript support with type definitions in `src/types/`:

- User, Event, Venue models
- API response types
- Filter types
- Navigation types

## 🧪 Development

### Environment Variables

Copy `.env.example` to `.env` and configure:

```
EXPO_PUBLIC_API_URL=http://localhost:3000
```

Note: Use `http://10.0.2.2:3000` for Android emulator to access localhost.

### Running Backend

Make sure the Next.js backend is running:

```bash
cd ..
pnpm dev
```

## 📦 Building for Production

### iOS

```bash
npx expo build:ios
```

### Android

```bash
npx expo build:android
```

## 📚 Learn More

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)
- [React Navigation](https://reactnavigation.org/)
- [Expo Router](https://expo.github.io/router/docs/)

## 🤝 Contributing

Follow the main project's contributing guidelines and ensure:

- All translations are provided for all 6 languages
- Code follows TypeScript best practices
- Components are modular and under 200 lines
- Conventional commit messages are used
