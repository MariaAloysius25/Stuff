# Decisions

## Structure

This is an npm-workspaces monorepo with a platform-neutral `packages/core` and two thin apps. The controller is the ownership boundary for Read Later behavior: optimistic state, pending article IDs, idempotent `409`/`404` responses, hydration ordering, duplicate-mutation protection, and rollback on network failure live there. Web and native only provide rendering and a storage adapter. That structure makes a behavior change land in one package and be exercised by both surfaces.

## Trade-offs

1. **Shared controller over duplicated hooks.** I rejected separate web and native hooks because they would make a saving change easy to implement on one surface only. The cost is a small event-based abstraction rather than idiomatic framework-local state.

2. **In-process stub over a separate local HTTP server.** I rejected adding Express and a second process because it would add setup and port failure without testing a real backend. The cost is that transport serialization and browser/network CORS behavior are not covered. The stub still adds latency, random mutation failures, persistence, and the specified idempotent statuses.

3. **Native iOS via Expo over React Native Web for both.** I rejected one renderer because the exercise is specifically checking that a second surface can consume shared behavior. The cost is Expo/Xcode setup and a little platform glue, but the boundary is visible and testable.

4. **Revision guard over merging every hydration snapshot.** Hydration snapshots are ignored when a mutation starts while the read is in flight. This keeps a stale response from replacing newer optimistic state; a production API would instead provide revisions or server conflict metadata for a more complete merge strategy.

5. **Reject duplicate article mutations over a queue.** The controller returns `false` when an article is already pending. The UI also disables the action, and the core guard protects other callers without delaying unrelated article mutations.

## Testing

The core tests cover immediate optimistic state, rollback and error state after a failed request, persistence across API instances, stale hydration ordering, and `201`/`409`/`204`/`404` semantics. TypeScript project checks cover the shared and app boundaries, and the web/native component tests cover their basic rendering and save flows. I did not add screenshot or end-to-end tests: the UI is intentionally small, and the highest-risk behavior is in the shared controller. Before merging a production change I would add one device/browser flow test around restart, malformed storage, and retry.

## Not done / next

Before two million monthly users I would replace the stub with a typed generated API client, add authentication and server-side user isolation, use a durable local database with migrations, add an outbox and retry policy for offline writes, and replace the current per-article duplicate guard with a deliberate queue if queued user actions become necessary. I would add observability for mutation latency, failure rate, rollback rate, and storage corruption, plus accessibility audits, pagination, image caching, and automated iOS/browser smoke tests.

## AI use

AI was used to sketch the workspace files and initial UI. I reworked the state boundary so the mutation policy lives in core rather than in two platform components, added stale-hydration and duplicate-mutation protection, and kept the tests focused on failure, persistence, and ordering instead of accepting a happy-path-only scaffold. The final code was checked with `npm run check`, `npm run check-web-build-test`, and `npm run check-native-build-test`.
