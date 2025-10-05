# Changelog

## VERIFY
- Run `npm ci` to install dependencies.
- Start the development server with `npm run dev` and ensure it boots without errors.
- Request `http://localhost:5000/api/databases` or `http://localhost:5000/api/queries` and confirm the response is not a 404.
- Open the query interface and confirm the database dropdown auto-selects the first connection once connections load.
- Execute a natural language query end-to-end to ensure translation and execution succeed without needing manual database selection.

## UNDO
- Revert the commit that introduced this change (e.g. `git revert <commit-hash>`).
- Restart the development server if it was running.
