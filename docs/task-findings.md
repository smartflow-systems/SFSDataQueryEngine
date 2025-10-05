# Maintenance Task Proposals

## Fix a Typo
- **Issue**: The base button variant combines `focus-visible:ring-offset-2` and `disabled:pointer-events-none` without a separating space, producing the unintended utility `focus-visible:ring-offset-2disabled:pointer-events-none`.
- **Impact**: The malformed class prevents the `disabled:pointer-events-none` rule from activating, so disabled buttons may still respond to pointer events.
- **Proposed Task**: Insert the missing whitespace so the utilities remain distinct (`... focus-visible:ring-offset-2 disabled:pointer-events-none ...`).
- **Location**: `client/src/components/ui/button.tsx`, line 8.【F:client/src/components/ui/button.tsx†L8-L20】

## Fix a Bug
- **Issue**: `QueryInput` attempts to select the first database by calling `useState(() => { ... })`, but `useState` initializers only run on the first render and do not react to fetched data updates. As a result, `selectedDatabaseId` stays empty even after databases load, forcing users to choose a database manually.
- **Impact**: Executing or translating a query without manually selecting a database triggers validation errors, breaking the “default connection” experience described in the UI.
- **Proposed Task**: Replace the misuse of `useState` with a `useEffect` that watches `databases` and `selectedDatabaseId`, ensuring the default database is set when data becomes available.
- **Location**: `client/src/components/query-input.tsx`, lines 22-27.【F:client/src/components/query-input.tsx†L22-L27】

## Fix Documentation/Comment Discrepancy
- **Issue**: `server/services/database.ts` is introduced as a “Database service for connecting to PostgreSQL databases,” yet the implementation exclusively instantiates SQLite connections.
- **Impact**: The misleading header comment can confuse contributors when debugging or extending database support, potentially leading to incorrect assumptions about dependencies.
- **Proposed Task**: Update the comment (and any related documentation) to describe the actual SQLite-backed implementation or explain the roadmap for PostgreSQL support.
- **Location**: `server/services/database.ts`, line 1.【F:server/services/database.ts†L1-L40】

## Improve a Test
- **Issue**: `server/storage.test.ts` only verifies the `isActive` flag on new databases. It does not cover query retrieval helpers like `getRecentQueries`, which guarantee sorted results and limit handling in production routes.
- **Impact**: Regressions in recent-query ordering or limiting would go unnoticed, undermining dashboards and history views that rely on correct chronology.
- **Proposed Task**: Extend the test suite to insert multiple queries with varying `createdAt` timestamps and assert that `getRecentQueries` returns them in descending order while respecting the requested limit.
- **Location**: `server/storage.test.ts`, lines 1-27.【F:server/storage.test.ts†L1-L27】
