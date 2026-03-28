# Classurrency

Expo (React Native) mobile app for Classurrency: authentication, transactions, settings, and admin flows. Built with TypeScript, React Navigation, and i18next.

## Requirements

- [Node.js](https://nodejs.org/) (LTS recommended)
- [npm](https://www.npmjs.com/) (comes with Node)
- For iOS: Xcode and CocoaPods
- For Android: Android Studio and an emulator or device
- [Expo CLI](https://docs.expo.dev/get-started/installation/) is used via `npx` / project scripts

## Setup

```bash
npm install
```

Copy the environment template and adjust the API URL if needed:

```bash
cp .env.example .env
```

The app reads `EXPO_PUBLIC_API_BASE_URL` (must include `/api/v1`, no trailing slash). If unset, it defaults to `http://localhost:3000/api/v1`. See `src/config/env.ts`.

## Running

| Command | Description |
|--------|-------------|
| `npm start` | Start the Expo dev server |
| `npm run start:dev` | Dev server with [development build](https://docs.expo.dev/develop/development-builds/introduction/) |
| `npm run ios` | Build and run on iOS simulator |
| `npm run android` | Build and run on Android emulator/device |
| `npm run web` | Run in the browser |

Deep linking uses the scheme `classurrency` (see `app.json`).

## API types

Regenerate TypeScript types from the OpenAPI spec when the backend contract changes:

```bash
npm run typegen
```

This writes `src/types/api.generated.ts` from `docs/openapi.json`.

## Testing

```bash
npm test              # Jest unit tests
npm run test:e2e:ios     # Detox on iOS (debug sim config)
npm run test:e2e:android # Detox on Android (debug emu config)
```

Ensure Detox is configured for your machine (simulators, build artifacts) per [Detox docs](https://wix.github.io/Detox/).

## Native projects

To generate or refresh `ios/` and `android/`:

```bash
npm run prebuild
```

## License 

GPLv3 — see [LICENSE](LICENSE)
