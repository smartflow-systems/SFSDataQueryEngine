# Changelog

## VERIFY
- Run `npm ci` to install dependencies.
- Start the development server with `npm run dev` and ensure it boots without errors.
- Request `http://localhost:5000/api/databases` or `http://localhost:5000/api/queries` and confirm the response is not a 404.
- Run `npm test` and ensure the database API test suite passes.
- Issue a `POST http://localhost:5000/api/databases` with `{ "name": "test", "type": "sqlite", "isActive": false }` and confirm a subsequent `GET /api/databases` returns the new database with `isActive: false`.

## UNDO
- Revert the commit that introduced this change (e.g. `git revert <commit-hash>`).
- Restart the development server if it was running.
- Delete any databases created while verifying the change if they are no longer needed.
