# SFSDataQueryEngine (DataLens Analytics)

> Natural language to SQL engine — type a plain-English question, get back a live query result and an interactive chart.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Visit-FFD700?style=for-the-badge&logo=replit&logoColor=black)](https://sfsdataqueryengine.replit.app)
[![SmartFlow Systems](https://img.shields.io/badge/SmartFlow-Systems-0a0a0a?style=for-the-badge)](https://github.com/smartflow-systems)

---

## What It Does

SFSDataQueryEngine is a full-stack data analytics application that lets anyone interrogate a database without writing SQL. Users connect a database, ask questions in plain English, and the app uses OpenAI GPT to translate those questions into SQL queries, execute them, and visualise the results as line, bar, or pie charts. Saved queries and dashboards allow teams to build persistent analytics views without any code. An optional integration with SocialScaleBooster enables natural language querying of social media analytics data directly.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Language | TypeScript |
| Runtime | Node.js 18+ |
| Framework | Express.js |
| Frontend | React 18 + Vite, Wouter (routing), Tailwind CSS, Shadcn/ui + Radix UI |
| Database / Storage | PostgreSQL via Drizzle ORM (Neon serverless) |
| Key packages | OpenAI GPT, Chart.js, TanStack Query, React Hook Form + Zod, express-session |

---

## How to Run Locally

```bash
# 1. Clone the repo
git clone https://github.com/smartflow-systems/SFSDataQueryEngine.git
cd SFSDataQueryEngine

# 2. Install dependencies
npm install

# 3. Copy the environment variables file and fill in your values
cp .env.example .env

# 4. Push the database schema
npm run migrate

# 5. Start the development server
npm run dev
```

The app will be available at `http://localhost:5000`.

---

## Environment Variables

| Variable | Required | Description | Example |
|---|---|---|---|
| `DATABASE_URL` | Yes | PostgreSQL connection string (Neon recommended) | `postgresql://user:pass@host/db` |
| `OPENAI_API_KEY` | Yes | OpenAI API key for NL-to-SQL translation | `sk-proj-abc123` |
| `SESSION_SECRET` | Yes | Secret for signing user sessions | `random-session-secret` |
| `PORT` | No | Port the server listens on | `5000` |
| `NODE_ENV` | No | Runtime environment | `production` |
| `SOCIAL_DB_HOST` | No | Host of the SocialScaleBooster DB (optional integration) | `localhost` |
| `SOCIAL_DB_PORT` | No | Port of the SocialScaleBooster DB | `5432` |
| `SOCIAL_DB_NAME` | No | Database name for social analytics | `socialscalebooster` |
| `SOCIAL_DB_USER` | No | Username for social DB connection | `postgres` |
| `SOCIAL_DB_PASSWORD` | No | Password for social DB connection | `yourpassword` |
| `SOCIAL_INTEGRATION_ENABLED` | No | Enable SocialScaleBooster analytics integration | `true` |

---

## API Endpoints

| Method | Route | Auth required | Description |
|---|---|---|---|
| `GET` | `/health` | No | Health check |
| `GET` | `/api/databases` | No | List connected database connections |
| `POST` | `/api/databases` | No | Add a new database connection |
| `GET` | `/api/databases/:id/schema` | No | Fetch the schema for a connected database |
| `POST` | `/api/databases/:id/test` | No | Test a database connection |
| `POST` | `/api/queries/translate` | No | Translate a natural language question to SQL |
| `POST` | `/api/queries/execute` | No | Execute a SQL query and return results |
| `GET` | `/api/queries` | No | List all queries |
| `GET` | `/api/queries/saved` | No | List saved queries |
| `GET` | `/api/queries/recent` | No | List recently executed queries |
| `POST` | `/api/queries/:id/save` | No | Save a query for reuse |
| `GET` | `/api/dashboards` | No | List dashboards |
| `GET` | `/api/dashboards/:id` | No | Get a single dashboard |
| `POST` | `/api/dashboards` | No | Create a new dashboard |
| `POST` | `/api/charts` | No | Create a chart within a dashboard |
| `PUT` | `/api/charts/:id` | No | Update a chart |
| `DELETE` | `/api/charts/:id` | No | Delete a chart |
| `GET` | `/api/social/templates` | No | List social analytics query templates |
| `GET` | `/api/social/templates/:id` | No | Get a single social template |
| `POST` | `/api/social/query-from-template` | No | Run a query using a social analytics template |
| `GET` | `/api/social/analytics/summary` | No | Get social analytics summary metrics |
| `GET` | `/api/social/analytics/platforms` | No | Get per-platform social analytics |
| `GET` | `/api/social/bots/performance` | No | Get social bot performance data |

---

## How It Connects to SmartFlow Systems

- **Main hub** — [`smartflow-systems/SmartFlowSite`](https://github.com/smartflow-systems/SmartFlowSite) links to this repo's live demo from the DataLens Analytics product card on the homepage.
- **Design system** — follows the SFS design system (gold `#FFD700` on dark `#0a0a0a`). See [`sfs-claude-skills`](https://github.com/smartflow-systems/sfs-claude-skills) for the full token reference.
- **Stripe** — Not used in this repo.
- **Other integrations** — OpenAI GPT for natural language processing; Neon serverless PostgreSQL for the application database; optional direct connection to SocialScaleBooster's PostgreSQL database for cross-product social analytics.

---

## Live Demo

**[sfsdataqueryengine.replit.app](https://sfsdataqueryengine.replit.app)** — Connect a database, ask a question in plain English, and see results rendered as interactive charts.

---

## Design System

This repo follows the SmartFlow Systems design system.

- Brand colours: Gold `#FFD700` on dark background `#0a0a0a`
- Background: `#0D0D0D`
- Gold gradient CTAs: `linear-gradient(135deg, #FFD700, #E6C200)` with black text
- Typography: Inter (headings), system-ui (body)
- Full token reference and component rules: [`sfs-claude-skills/sfs-design-system/SKILL.md`](https://github.com/smartflow-systems/sfs-claude-skills/blob/main/sfs-design-system/SKILL.md)

---

## Contact

| | |
|---|---|
| Sales enquiries | [sales@smartflowsystems.com](mailto:sales@smartflowsystems.com) |
| Book a demo | [calendly.com/boweazy123](https://calendly.com/boweazy123) |

---

## Part of the SmartFlow Systems Suite

SmartFlow Systems builds automation tools for modern businesses — booking, CRM, e-commerce, AI bots, analytics, and more.

| | |
|---|---|
| Website | [smartflowsystems.replit.app](https://smartflowsystems.replit.app) |
| All repos | [github.com/smartflow-systems](https://github.com/smartflow-systems) |

---

*Built by SmartFlow Systems.*
