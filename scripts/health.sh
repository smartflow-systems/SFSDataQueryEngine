#!/usr/bin/env bash
set -euo pipefail
curl -fsS "http://localhost:${PORT:-5000}/health" | jq . || cat
