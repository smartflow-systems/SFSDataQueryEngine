# Changelog

## VERIFY
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
- Using the API, create a database with `isActive: false`.
  Verify that a subsequent `GET /api/databases` response preserves the `false` flag.
- Review `docs/task-findings.md` for the latest maintenance task recommendations and triage them as needed.

## UNDO
- Revert the commit that introduced this change (e.g. `git revert <commit-hash>`).
- Remove the `sqlite3` dependency from `package.json` and reinstall.
- Restart the development server if it was running.
- Delete any databases created while verifying the change if they are no longer needed.
- Remove the exported `server` instance from `server/index.ts` if it is no longer needed.
- Delete the SQLite import in `server/services/database.ts` if removing the dependency manually.
- Delete the `vendor/openai` directory (and re-run dependency installation) to remove the local OpenAI stub if reverting.
