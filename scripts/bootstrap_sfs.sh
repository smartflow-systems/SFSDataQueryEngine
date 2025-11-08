#!/usr/bin/env bash
set -euo pipefail

# == Enter repo ==
for d in "$HOME/workspace/SFSDataQueryEngine" "$HOME/SFSDataQueryEngine" "$PWD"; do
  [ -d "$d/.git" ] && { cd "$d"; break; }; done
git rev-parse --is-inside-work-tree >/dev/null

TS="$(date -u +%Y%m%dT%H%M%SZ)"
BK=".sfs-backups/$TS"; mkdir -p "$BK"

backup(){ [ -f "$1" ] && { mkdir -p "$BK/$(dirname "$1")"; cp -a "$1" "$BK/$1"; echo "backup → $BK/$1"; } || true; }

# keep existing layout (server/) — do NOT overwrite if present
mkdir -p prisma src scripts

# package.json (only if missing)
if [ ! -f package.json ]; then
cat > package.json <<'JSON'
{
  "name": "sfs-data-query-engine",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "tsx watch server/index.ts",
    "start": "tsx server/index.ts",
    "typecheck": "tsc -p .",
    "health": "bash scripts/health.sh"
  },
  "dependencies": {
    "cors": "^2.8.5",
    "dotenv": "^16.4.5",
    "express": "^4.19.2",
    "express-rate-limit": "^7.4.0",
    "zod": "^3.23.8"
  },
  "devDependencies": {
    "tsx": "^4.19.1",
    "typescript": "^5.6.3",
    "@types/node": "^20.14.12"
  }
}
JSON
fi

# tsconfig.json (only if missing)
if [ ! -f tsconfig.json ]; then
cat > tsconfig.json <<'JSON'
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ES2022",
    "moduleResolution": "Bundler",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true
  },
  "include": ["server", "src"]
}
JSON
fi

# prisma schema (only if missing)
if [ ! -f prisma/schema.prisma ]; then
mkdir -p prisma
cat > prisma/schema.prisma <<'PRISMA'
generator client { provider = "prisma-client-js" }
datasource db   { provider = "sqlite"; url = env("DATABASE_URL") }

model Boost {
  id        Int      @id @default(autoincrement())
  createdAt DateTime @default(now())
}
PRISMA
fi

# health script
mkdir -p scripts
cat > scripts/health.sh <<'SH2'
#!/usr/bin/env bash
set -euo pipefail
curl -fsS "http://localhost:${PORT:-5000}/health" || { echo "health failed"; exit 1; }
echo
SH2
chmod +x scripts/health.sh

# env (append if missing keys)
touch .env
backup .env
grep -q '^PORT=' .env || echo 'PORT=5000' >> .env
grep -q '^NODE_ENV=' .env || echo 'NODE_ENV=development' >> .env
grep -q '^DATABASE_URL=' .env || echo 'DATABASE_URL="file:./dev.db"' >> .env

# deps (idempotent)
npm i >/dev/null
npm i -D typescript tsx @types/node >/dev/null || true

# Prisma only if schema exists
if [ -f prisma/schema.prisma ]; then
  npm i @prisma/client prisma >/dev/null
  npx prisma generate >/dev/null
  npx prisma migrate dev -n init || true
fi

echo "== Done. Use =="
echo "npm run dev      # starts server (PORT from .env)"
echo "PORT=0 npm run dev  # bind random free port"
