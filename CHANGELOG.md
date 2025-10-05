# Changelog

## VERIFY
- Run `npm ci` to install dependencies.
- Start the development server with `npm run dev` and ensure it boots without errors.
- Request `http://localhost:5000/api/databases` or `http://localhost:5000/api/queries` and confirm the response is not a 404.
- With the dev server running, `POST http://localhost:5000/api/queries/translate` with a JSON body such as `{ "naturalLanguage": "List customers" }` and confirm it returns a JSON payload instead of an error.

## UNDO
- Revert the commit that introduced this change (e.g. `git revert <commit-hash>`).
- Restart the development server if it was running.
