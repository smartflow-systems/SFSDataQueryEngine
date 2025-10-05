# Changelog

## VERIFY
- Inspect `tsconfig.json` to confirm it now contains a single merged configuration object and rerun `npm test` to validate TypeScript compilation succeeds.
- Visit the Queries, Reports, and Settings pages to confirm the dashboard-style background, marbled scroll region, and glass cards render consistently with the updated SmartFlow visual system.
- Run `npm ci` to install dependencies (ensure `sqlite3` is present; if registry access is blocked, document the failure).
- Start the development server with `npm run dev` and ensure it boots without SQLite driver errors.
- Request `http://localhost:5000/api/databases` or `http://localhost:5000/api/queries` and confirm the response is not a 404.
- Exercise `POST http://localhost:5000/api/queries/execute` with a simple SELECT query and confirm it succeeds without SQLite connection errors.
- With the dev server running, `POST http://localhost:5000/api/queries/translate` with a JSON body such as `{ "naturalLanguage": "List customers" }` and confirm it returns a JSON payload instead of an error.
- Open the query interface and confirm the database dropdown auto-selects the first connection once connections load.
- Execute a natural language query end-to-end to ensure translation and execution succeed without needing manual database selection.
- Run `npm test` and ensure the database API test suite passes.
- Issue a `POST http://localhost:5000/api/databases` with `{ "name": "test", "type": "sqlite", "isActive": false }` and confirm a subsequent `GET /api/databases` returns the new database with `isActive: false`.
- Confirm only a single "serving on" log appears to verify the listener is started once.
- Execute `npm test` and confirm the storage tests pass, including coverage for inactive databases.
- Send a POST to `http://localhost:5000/api/queries/execute` with a simple query (e.g. `SELECT 1`) to verify SQLite connections open successfully.
- POST `{"naturalLanguage":"List all customers"}` to `http://localhost:5000/api/queries/translate` and verify a JSON payload is returned without OpenAI module errors.
- In the query input UI, confirm the database dropdown selects the first available connection automatically and that queries run without needing to reselect the database.
- After manually selecting a different database in the query input UI, trigger a refresh of the database list and confirm the dropdown preserves the manual choice instead of resetting to the first option.
- Using the API, create a database with `isActive: false`.
  Verify that a subsequent `GET /api/databases` response preserves the `false` flag.
- Review `docs/task-findings.md` for the latest maintenance task recommendations and triage them as needed.

## UNDO
- Revert `tsconfig.json` to its prior duplicate-block structure if the consolidated configuration causes issues.
- Restore the Queries, Reports, and Settings page layouts to their previous ShadCN `Card` implementations if the SmartFlow glass treatment needs to be rolled back.
- Revert the commit that introduced this change (e.g. `git revert <commit-hash>`).
- Remove the `sqlite3` dependency from `package.json` and reinstall.
- Remove the query input guard that checks `userSelectedRef` if the dropdown should always default to the first database when the list reloads.
- Restart the development server if it was running.
- Delete any databases created while verifying the change if they are no longer needed.
- Remove the exported `server` instance from `server/index.ts` if it is no longer needed.
- Delete the SQLite import in `server/services/database.ts` if removing the dependency manually.
- Delete the `vendor/openai` directory (and re-run dependency installation) to remove the local OpenAI stub if reverting.
