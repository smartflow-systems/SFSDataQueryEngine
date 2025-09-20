#!/usr/bin/env bash
set -euo pipefail
branch_arg="${1-}"
if [[ -n "$branch_arg" ]]; then
  BRANCH="$branch_arg"
else
  BRANCH="$(git symbolic-ref -q --short refs/remotes/origin/HEAD 2>/dev/null | sed "s#^origin/##")"
  [[ -z "${BRANCH:-}" ]] && BRANCH="main"
fi
echo "🔁 Syncing $BRANCH..."
git fetch origin --prune
git rev-parse --verify "refs/remotes/origin/$BRANCH" >/dev/null
git reset --hard "origin/$BRANCH"
echo "✅ Synced $BRANCH"
