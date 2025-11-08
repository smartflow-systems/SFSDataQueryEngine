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

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | Landing page with pricing |
| `/login` | GET | User login page |
| `/signup` | GET | User registration page |
| `/dashboard` | GET | Main analytics dashboard |
| `/api/queries/translate` | POST | Translate natural language to SQL |
| `/api/queries/execute` | POST | Execute SQL queries |
| `/api/databases` | GET | List database connections |

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

- **Starter**: $29/month - Perfect for individuals
- **Professional**: $99/month - For growing teams
- **Enterprise**: Custom pricing - For large organizations

Visit our [landing page](/) for more details!

---

**Made with ❤️ by SmartFlow Systems**
