#!/usr/bin/env bash
set -euo pipefail; set +H

# 1) enter repo
for d in "$HOME/workspace/SFSDataQueryEngine" "$HOME/SFSDataQueryEngine" "$PWD"; do
  [ -d "$d/.git" ] && { cd "$d"; break; }
done

echo "== check if something is already healthy on :5000 =="
if curl -fsS "http://localhost:5000/health" >/dev/null 2>&1; then
  echo "OK: something is already serving /health on :5000"
else
  echo "== free :5000 and stray dev processes =="
  npx -y kill-port 5000 || true
  PIDS="$(ps -ef | awk '/(node|tsx).*(server\/index\.ts|vite|dist\/index\.js)/ && !/awk/ {print $2}')"
  [ -n "${PIDS:-}" ] && { echo "Killing: $PIDS"; kill -15 $PIDS || true; sleep 1; kill -9 $PIDS || true; } || echo "none"

  echo "== ensure .env doesn't pin a conflicting PORT =="
  [ -f .env ] && awk 'BEGIN{FS=OFS="="} /^PORT=/{next} {print}' .env > .env.tmp && mv .env.tmp .env || true

  echo "== start dev on :5000 =="
  PORT=5000 npm run dev &
  sleep 0.5
fi

echo "== wait for /health =="
for i in {1..20}; do
  if curl -fsS "http://localhost:5000/health" >/dev/null 2>&1; then
    echo "OK: local /health"
    break
  fi
  sleep 0.5
  [ $i -eq 20 ] && { echo "timeout waiting for server"; exit 1; }
done

echo "== try /_port (if exposed) =="
curl -fsS "http://localhost:5000/_port" 2>/dev/null || echo '{"note":"/_port not exposed"}'

echo "== public URL =="
echo "https://sfs-data-query-engine-Smart-F-Syst.replit.app/health"
