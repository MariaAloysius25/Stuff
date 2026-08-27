# Read Later

A small TypeScript monorepo demonstrating one Read Later feature shared by an Expo iOS surface and a React web surface.

## Requirements

- Node.js 20 or newer
- npm 10 or newer
- For iOS: Xcode with an iOS simulator, or the Expo Go app on a device

## Run it

```sh
npm install
npm run check

# Web build, typecheck, and tests
npm run check-web-build-test

# Native typecheck and tests
npm run check-native-build-test

# Web, in another terminal
npm --workspace @read-later/web run dev

# Expo / iOS
npm --workspace @read-later/native run ios
```

The web app opens at the URL Vite prints, usually `http://localhost:5173`. The Expo command opens the project in an iOS simulator. The API is an in-process network-like stub, so no server or environment variables are needed.

## Structure

`packages/core` contains the Article contract, seeded API stub, storage adapter contract, and `ReadLaterController`. It owns optimistic updates, pending state, idempotent response handling, and rollback. The web app supplies `localStorage`; the native app supplies AsyncStorage. Both surfaces consume the same controller without changing it.

The stub adds small delays and a 12% mutation failure rate to make loading and recovery observable. Its state is persisted through the adapter, and each API instance hydrates from that adapter when the read-later list is requested.

The controller applies saves and removes optimistically, tracks pending article IDs, ignores stale hydration responses that began before a mutation, rejects duplicate toggles for an article while its request is pending, and rolls back only the affected article when a mutation fails. Web storage and native storage treat malformed persisted JSON as an empty list.

The native check script validates the native TypeScript boundary and shared tests; it does not launch Expo or replace device-level iOS validation. Use `npm run ios` for that workflow.
