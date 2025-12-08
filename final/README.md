# Contact Manager

A modern contact management app built with Expo Router, React Native, and Firebase. It supports authentication, creating/editing contacts with avatars, and polished, consistent alerts.

## Features

- Email/password authentication (Firebase Auth)
- Create, list, update, and delete contacts (Firestore)
- Avatar support with image picker (camera or library) using a themed action sheet
- Custom styled alerts and confirmations (including sign-out and destructive actions)
- Phone number formatting/validation utilities
- Expo Router navigation with tab layout

## Tech Stack

- React Native + Expo (SDK 54)
- Expo Router
- Firebase (Auth, Firestore)
- React Native Paper (theming + Portal for alerts)
- @expo/react-native-action-sheet for image selection UI

## Prerequisites

- Node.js 18+
- Expo CLI (`npm i -g expo`)
- Firebase project (Web app) with Firestore & Auth enabled

## Setup

1. Install dependencies

```bash
npm install
```

2. Configure environment
   Create an `.env` (or `.env.local`) in the project root with your Firebase Web config:

```bash
EXPO_PUBLIC_API_KEY=your-key
EXPO_PUBLIC_AUTH_DOMAIN=your-domain.firebaseapp.com
EXPO_PUBLIC_PROJECT_ID=your-project-id
EXPO_PUBLIC_STORAGE_BUCKET=your-bucket.appspot.com
EXPO_PUBLIC_MESSAGING_SENDER_ID=your-sender-id
EXPO_PUBLIC_APP_ID=your-app-id
EXPO_PUBLIC_MEASUREMENT_ID=your-measurement-id
```

> Expo automatically exposes `EXPO_PUBLIC_*` vars to the app.

3. Start the app

```bash
npm start
```

Then launch on iOS Simulator, Android Emulator, or a physical device with Expo Go.

## Usage Notes

- **Image Picker:** Opens a themed action sheet, then launches camera or library. Permissions are requested as needed.
- **Alerts:** Custom modal alerts via `AlertProvider` and helpers `showAlert` / `showConfirm` for consistent styling.
- **Sign Out:** Settings screen uses a confirmation dialog before signing out.

## Key Paths

- App shell: `src/app/_layout.jsx`
- Auth: `src/auth/AuthContext.jsx`
- Firebase config: `src/firebase/firebaseConfig.js`
- Alerts: `src/components/AlertProvider.jsx`, `src/utils/alertUtils.js`
- Contacts list & create: `src/app/(tabs)/index.jsx`
- Contact detail: `src/app/(tabs)/contact-detail.jsx`
- Settings (password change, sign-out): `src/app/(tabs)/settings.jsx`
- Shared styles: `src/styles/theme.js`

## Styling & UX

- Centralized theme tokens for color, spacing, radius, and typography
- Modern, color-coded alerts with top indicator bar
- Themed action sheet for photo selection

## Testing & Linting

- No automated tests are included. Use Expo CLI for manual runs: `npm start`.

## Troubleshooting

- If you see TypeScript warnings in dependencies, reload VS Code; app functionality is unaffected.
- For image picker issues, ensure camera/library permissions are granted in device settings.

## License

This project is part of an academic course assignment and is provided for educational purposes only.
