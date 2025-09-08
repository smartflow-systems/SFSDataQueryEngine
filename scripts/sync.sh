#!/usr/bin/env bash
set -euo pipefail
BRANCH="\${1:-main}"
echo "🔁 Syncing \$BRANCH..."
git fetch origin "\$BRANCH"
git reset --hard "origin/\$BRANCH"
echo "✅ Synced \$BRANCH"
