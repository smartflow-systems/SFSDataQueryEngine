# SFSDataQueryEngine — Claude Context

Role: AI-powered natural language to SQL query engine.
Repo: https://github.com/smartflow-systems/SFSDataQueryEngine
Local: /home/garet/SFS/SFSDataQueryEngine

## Purpose
Transform natural language questions into SQL queries.
Connect to any database and get answers with visualisations.

## Key Features
- Natural language → SQL (OpenAI GPT-4o-mini)
- Multi-database support (SQLite, PostgreSQL, MySQL)
- Advanced visualisations (Chart.js, Recharts)
- Export to CSV / JSON / Excel
- Query history and templates
- SocialScaleBooster integration (18 pre-built templates)

## Stack
TypeScript, React, OpenAI GPT-4o-mini, Prisma, SQLite/PostgreSQL

## Key Files
- [src/query/] — NL to SQL engine
- [src/visualizations/] — chart components
- [src/templates/] — pre-built query templates
- [prisma/schema.prisma] — data model
- [.github/workflows/ci.yml] — CI pipeline

## Health Check
GET /health → {"ok":true}

## Common Commands
npm run dev      → Start dev server
npm run build    → Build
npx prisma migrate dev → Run migrations
npx prisma studio      → Open Prisma Studio

## Secrets
OPENAI_API_KEY, DATABASE_URL, SFS_PAT

## Query Focus
When working on NL→SQL, always test with at least 3 query types:
1. Simple SELECT with filter
2. JOIN across tables
3. Aggregate (COUNT, SUM, AVG)
