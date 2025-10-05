# Changelog

## VERIFY
- Run `npm ci` to install dependencies (ensure `sqlite3` is present; if registry access is blocked, document the failure).
- Start the development server with `npm run dev` and ensure it boots without SQLite driver errors.
- Request `http://localhost:5000/api/databases` or `http://localhost:5000/api/queries` and confirm the response is not a 404.
- Execute `npm test` and confirm the storage tests pass, including coverage for inactive databases.
- Using the API, create a database with `isActive: false`.
  Verify that a subsequent `GET /api/databases` response preserves the `false` flag.

## UNDO
- Revert the commit that introduced this change (e.g. `git revert <commit-hash>`).
- Remove the `sqlite3` dependency from `package.json` and reinstall.
- Restart the development server if it was running.
