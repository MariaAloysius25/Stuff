# Read Later

A small TypeScript monorepo demonstrating one Read Later feature shared by an Expo iOS surface and a React web surface.

## Requirements

- Node.js 20 or newer
- npm 10 or newer
- For Expo Go: the Expo Go app on a device or simulator
- For a local iOS build: macOS, Xcode, and CocoaPods

## Install

```sh
npm install
```

The repository is an npm workspace. Run commands from the repository root. The
shared `packages/core` package is compiled automatically when either app starts.

## Run the web app

```sh
npm run web
```

Open the URL printed by Vite, usually `http://localhost:5173`.

## Run the native app with Expo Go

```sh
npm run native
```

Then use the Expo CLI prompt to open the app in a simulator or scan the QR code
with Expo Go on a device. The native app currently uses Expo SDK 57, so Expo Go
must support SDK 57. No Expo account login is required for the local server.

If port 8081 is already in use, choose another port when Expo asks, or stop the
other Expo process first.

## Run a local iOS build

This path requires CocoaPods and an iOS simulator or connected device:

```sh
brew install cocoapods
npm --workspace @read-later/native exec -- expo prebuild --platform ios
npm --workspace @read-later/native exec -- expo run:ios
```

`expo prebuild` generates the local `ios/` project on a fresh clone, and
`expo run:ios` installs pods and builds the app in Xcode. Run these commands
from the repository root.

For a physical device, open the iOS project in Xcode and configure an Apple ID
under Signing & Capabilities. Expo account login is only needed for Expo
services such as EAS builds.

## Validate the project

```sh
# Typecheck and run all tests
npm run check

# Web build, typecheck, and tests
npm run check-web-build-test

# Native typecheck and tests
npm run check-native-build-test

# Web, in another terminal
npm run web

# Expo / iOS
npm run native

# Both web and native
npm run check-all
```

The API is an in-process network-like stub, so no server, API key, or environment
variables are needed.

## Structure

`packages/core` contains the Article contract, seeded API stub, storage adapter contract, and `ReadLaterController`. It owns optimistic updates, pending state, idempotent response handling, and rollback. The web app supplies `localStorage`; the native app supplies AsyncStorage. Both surfaces consume the same controller without changing it.

The stub adds small delays and a 12% mutation failure rate to make loading and recovery observable. Its state is persisted through the adapter, and each API instance hydrates from that adapter when the read-later list is requested.

The controller applies saves and removes optimistically, tracks pending article IDs, ignores stale hydration responses that began before a mutation, rejects duplicate toggles for an article while its request is pending, and rolls back only the affected article when a mutation fails. Web storage and native storage treat malformed persisted JSON as an empty list.

The native check script validates the native TypeScript boundary and shared tests;
it does not launch Expo or replace device-level iOS validation.
