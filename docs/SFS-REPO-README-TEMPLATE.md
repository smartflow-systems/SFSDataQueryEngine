# SFSDataQueryEngine (DataLens Analytics)

> A business intelligence and data query engine — connect your data sources and get answers fast.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Visit-FFD700?style=for-the-badge&logo=replit&logoColor=black)](https://sfsdataqueryengine.replit.app)
[![SmartFlow Systems](https://img.shields.io/badge/SmartFlow-Systems-0a0a0a?style=for-the-badge)](https://github.com/smartflow-systems)

---

## What It Does

SFSDataQueryEngine (branded as DataLens Analytics) is the SmartFlow Systems data querying and business intelligence layer. It is designed to connect to business data sources and provide fast, accessible query results and dashboards — without requiring technical SQL knowledge from the end user.

> **Status:** This repo is under active development. The live demo is deployed and available. Full source code and documentation are being finalised.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Language | TypeScript / JavaScript |
| Runtime | Node.js 18+ |
| Framework | Express |
| Frontend | React + Tailwind CSS (SFS design system) |
| Database / Storage | To be confirmed — see live app |
| Key packages | To be confirmed |

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

# 4. Start the server
npm start
```

---

## Environment Variables

See `.env.example` in the repo root for the full list of required variables.

---

## How It Connects to SmartFlow Systems

- **Main hub** — [`smartflow-systems/SmartFlowSite`](https://github.com/smartflow-systems/SmartFlowSite) links to this repo's live demo from the DataLens Analytics product card on the homepage.
- **Design system** — follows the SFS design system (gold `#FFD700` on dark `#0a0a0a`). See [`sfs-claude-skills`](https://github.com/smartflow-systems/sfs-claude-skills) for the full token reference.

---

## Live Demo

**[sfsdataqueryengine.replit.app](https://sfsdataqueryengine.replit.app)**

---

## Design System

This repo follows the SmartFlow Systems design system.

- Brand colours: Gold `#FFD700` on dark background `#0a0a0a`
- Background: `#0D0D0D`
- Gold gradient CTAs: `linear-gradient(135deg, #FFD700, #E6C200)` with black text
- Typography: Inter (Google Fonts) — no substitutions
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
