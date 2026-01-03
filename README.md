<!-- BADGES:START -->
[![SFS CI + Deploy](https://github.com/smartflow-systems/SFSDataQueryEngine/actions/workflows/ci.yml/badge.svg)](https://github.com/smartflow-systems/SFSDataQueryEngine/actions/workflows/ci.yml)
<!-- BADGES:END -->

# DataLens - AI-Powered Data Query Engine

> Transform natural language into powerful SQL queries. Visualize insights instantly. Make data-driven decisions faster than ever.

**DataLens** by SmartFlow Systems is a professional, production-ready data analytics platform that uses AI to translate natural language questions into optimized SQL queries, with advanced visualization and export capabilities.

## ✨ Features

- 🤖 **AI-Powered Query Translation** - Transform natural language into SQL using OpenAI GPT-4
- 📊 **Advanced Visualizations** - Create stunning charts and interactive dashboards
- 💾 **Multi-Database Support** - Connect to SQLite, PostgreSQL, MySQL, and more
- 📥 **Export Anywhere** - Export results to CSV, JSON, or Excel
- ⚡ **Lightning Fast** - Optimized query execution with intelligent caching
- 🔒 **Enterprise Security** - Rate limiting, security headers, and SQL validation
- 🎨 **Professional UI** - Classy dark theme with gold accents
- 📱 **Responsive Design** - Works beautifully on all devices
- 🌐 **SocialScaleBooster Integration** - Query social media analytics with natural language (18 pre-built templates!)

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- OpenAI API key ([Get one here](https://platform.openai.com/api-keys))

### Installation

```bash
# Clone the repository
git clone https://github.com/smartflow-systems/SFSDataQueryEngine.git
cd SFSDataQueryEngine

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Edit .env and add your OpenAI API key
# Required: OPENAI_API_KEY=your_key_here

# Set up the database
npm run prisma:generate
npm run prisma:migrate

# Start development server
npm run dev
```

Visit `http://localhost:5000` to see the landing page!

## 🌐 SocialScaleBooster Integration

DataLens now integrates with **SocialScaleBooster** to provide powerful natural language querying for social media analytics!

### Quick Start with Social Analytics

```bash
# Configure SocialScaleBooster database connection
# Add to your .env file:
SOCIAL_DB_HOST=localhost
SOCIAL_DB_PORT=5432
SOCIAL_DB_NAME=socialscalebooster
SOCIAL_DB_USER=postgres
SOCIAL_DB_PASSWORD=your_password
SOCIAL_INTEGRATION_ENABLED=true
```

### Features

- 📱 **Multi-Platform Analytics** - Query data from TikTok, Instagram, Facebook, Twitter, YouTube
- 📝 **18 Pre-built Templates** - Revenue, engagement, ROI, and performance queries ready to use
- 🎯 **Natural Language Queries** - Ask "What was my TikTok revenue last month?" and get instant answers
- 📊 **Specialized Dashboards** - Social media-specific visualizations and metrics
- ⚡ **Real-time Data** - Query live performance data from your bots

### Example Queries

- "What is my total revenue from all social media bots?"
- "Show me revenue breakdown by platform"
- "Which are my top 10 performing bots by revenue?"
- "What is the engagement rate for each platform?"
- "Compare TikTok and Instagram performance"

### Documentation

- **Full Integration Guide**: [`docs/SOCIAL_INTEGRATION.md`](docs/SOCIAL_INTEGRATION.md)
- **Quick Start Guide**: [`docs/QUICK_START_SOCIAL.md`](docs/QUICK_START_SOCIAL.md)
- **API Reference**: See integration guide for all endpoints

### Pre-built Query Templates

| Category | Templates | Examples |
|----------|-----------|----------|
| Revenue | 4 templates | Total revenue, platform breakdown, trends |
| Performance | 4 templates | Top bots, activity timeline, post performance |
| Engagement | 2 templates | Engagement rates, conversion funnels |
| ROI | 3 templates | Conversion rates, ROI by bot |
| Trends | 3 templates | Daily/weekly/monthly trends |
| Comparison | 3 templates | Platform comparisons, user segments |

**Total: 18 ready-to-use social media analytics templates!**

## 📦 Production Deployment

### Build for Production

```bash
# Build the application
npm run build

# Start production server
npm start
```

### Environment Variables

Create a `.env` file with the following required variables:

```env
NODE_ENV=production
PORT=5000
DATABASE_URL="file:./prod.db"
OPENAI_API_KEY=your_openai_api_key_here
SESSION_SECRET=your_random_secret_here
ADMIN_API_KEY=your_secure_admin_api_key_here
```

### Database Setup

```bash
# Generate Prisma client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# (Optional) Seed the database
npm run prisma:seed
```

### Health Check

The application includes a health check endpoint:

```bash
curl http://localhost:5000/health
# Response: {"ok":true}
```

## 🎯 Key Endpoints

| Endpoint | Method | Description | Auth Required |
|----------|--------|-------------|---------------|
| `/` | GET | Landing page with pricing | No |
| `/login` | GET | User login page | No |
| `/signup` | GET | User registration page | No |
| `/dashboard` | GET | Main analytics dashboard | No |
| `/api/leads` | POST | Submit lead form data | No |
| `/api/leads` | GET | Get all leads (admin only) | Yes (X-API-Key header) |
| `/api/queries/translate` | POST | Translate natural language to SQL | No |
| `/api/queries/execute` | POST | Execute SQL queries | No |
| `/api/databases` | GET | List database connections | No |

### Admin Authentication

Protected admin endpoints require the `X-API-Key` header:

```bash
curl -H "X-API-Key: your_admin_api_key" http://localhost:5000/api/leads
```

Rate limiting is applied to prevent brute force attacks (5 attempts per 15 minutes).

## 🛡️ Security Features

- **Rate Limiting**: API (100 req/15min), Queries (20 req/min)
- **Security Headers**: XSS protection, content type sniffing prevention
- **SQL Validation**: AI-powered SQL validation before execution
- **Input Sanitization**: Zod schema validation on all inputs
- **CORS Protection**: Configurable allowed origins

## 🏗️ Project Structure

```
SFSDataQueryEngine/
├── client/              # React frontend
│   ├── src/
│   │   ├── components/  # UI components
│   │   ├── pages/       # Page components
│   │   ├── hooks/       # Custom React hooks
│   │   └── lib/         # Utilities
├── server/              # Express backend
│   ├── services/        # Business logic
│   ├── routes.ts        # API routes
│   └── index.ts         # Server entry
├── prisma/              # Database schema
├── shared/              # Shared types/schemas
└── scripts/             # Deployment scripts
```

## 🎨 Tech Stack

### Frontend
- React 19 + TypeScript
- Vite (build tool)
- Tailwind CSS (styling)
- Radix UI (components)
- TanStack Query (state management)
- Recharts (visualizations)

### Backend
- Node.js + Express
- TypeScript
- Prisma ORM
- SQLite (default database)
- OpenAI API
- Express Rate Limit

## 📊 Usage Examples

### Natural Language Queries

Ask questions in plain English:
- "Show me total revenue by month for the last 6 months"
- "List all users who signed up this week"
- "Compare sales between Q1 and Q2"

### Export Data

Export query results in multiple formats:
- CSV for Excel/Google Sheets
- JSON for API integration
- Excel (.xls) for direct spreadsheet use

## 🔧 Development Scripts

```bash
npm run dev          # Start dev server with hot reload
npm run build        # Build for production
npm start            # Run production server
npm run health       # Check server health
npm run prisma:gen   # Generate Prisma client
npm run prisma:migrate  # Run database migrations
```

## 📝 Configuration

### Rate Limiting

Adjust rate limits in `server/index.ts`:

```typescript
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 100,                   // Max requests
});
```

### Database

Configure database in `prisma/schema.prisma` and `.env`:

```env
# SQLite (default)
DATABASE_URL="file:./dev.db"

# PostgreSQL
DATABASE_URL="postgresql://user:password@localhost:5432/mydb"

# MySQL
DATABASE_URL="mysql://user:password@localhost:3306/mydb"
```

## 🌐 Deployment Platforms

### Replit

1. Import from GitHub
2. Set environment variables: `OPENAI_API_KEY`, `DATABASE_URL`
3. Run automatically on port 5000

### Vercel/Netlify

1. Connect GitHub repository
2. Set build command: `npm run build`
3. Set start command: `npm start`
4. Add environment variables

### Docker

```dockerfile
# Coming soon
```

## 🤝 Contributing

Contributions are welcome! Please see our contributing guidelines.

## 📄 License

Copyright © 2025 SmartFlow Systems. All rights reserved.

## 🆘 Support

- 📧 Email: support@smartflowsystems.com
- 🐛 Issues: [GitHub Issues](https://github.com/smartflow-systems/SFSDataQueryEngine/issues)
- 📚 Docs: [Documentation](https://docs.smartflowsystems.com)

## 🎉 Pricing

- **Starter**: £29/month - Perfect for individuals
- **Professional**: £99/month - For growing teams
- **Enterprise**: Custom pricing - For large organizations

Visit our [landing page](/) for more details!

---

**Made with ❤️ by SmartFlow Systems**
