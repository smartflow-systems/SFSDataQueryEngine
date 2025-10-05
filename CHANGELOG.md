# Changelog

## VERIFY
- Run `npm ci` to install dependencies.
- Start the development server with `npm run dev` and ensure it boots without errors.
- Request `http://localhost:5000/api/databases` or `http://localhost:5000/api/queries` and confirm the response is not a 404.
- Execute `npm test` and confirm the storage tests pass, including coverage for inactive databases.

## UNDO
- Revert the commit that introduced this change (e.g. `git revert <commit-hash>`).
- Restart the development server if it was running.
