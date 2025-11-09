# SocialScaleBooster Integration Guide

## Overview

This guide explains how DataLens integrates with SocialScaleBooster to provide powerful natural language querying capabilities for social media analytics. The integration enables users to ask questions about their social media bot performance in plain English and receive SQL-powered insights.

## Table of Contents

1. [Features](#features)
2. [Architecture](#architecture)
3. [Setup Instructions](#setup-instructions)
4. [API Reference](#api-reference)
5. [Pre-built Query Templates](#pre-built-query-templates)
6. [Usage Examples](#usage-examples)
7. [Data Models](#data-models)
8. [Troubleshooting](#troubleshooting)

---

## Features

### Core Capabilities

- **Natural Language Queries**: Ask questions like "What was my total revenue from TikTok bots last month?" and get instant SQL-powered answers
- **Pre-built Templates**: 18 ready-to-use query templates for common analytics questions
- **Multi-Platform Analytics**: Analyze performance across TikTok, Instagram, Facebook, Twitter, YouTube, and multi-platform bots
- **Time-Series Analysis**: Track trends over days, weeks, and months
- **Performance Metrics**: Revenue, engagement, conversions, ROI, and more
- **Export Capabilities**: Export results to CSV, JSON, and Excel formats
- **Real-time Data**: Query live data from your SocialScaleBooster database

### Supported Platforms

| Platform | Icon | Features |
|----------|------|----------|
| TikTok | 🎵 | Viral video analytics, trend tracking |
| Instagram | 📸 | Stories, posts, reels performance |
| Facebook | 👥 | Multi-platform reach analysis |
| Twitter/X | 🐦 | Tweet engagement tracking |
| YouTube | 📹 | Video content analytics |
| Multi-Platform | 🌐 | Cross-platform comparison |

---

## Architecture

### Integration Approach

The integration uses a **hybrid architecture** that combines:

1. **Direct Database Connection**: DataLens connects directly to SocialScaleBooster's PostgreSQL database for querying
2. **REST API Layer**: New endpoints provide specialized analytics aggregations
3. **Query Templates**: Pre-built SQL templates mapped to natural language questions

### Data Flow

```
┌─────────────────────────────────────────────────┐
│         SocialScaleBooster                      │
│  ┌──────────────┐                               │
│  │ PostgreSQL   │                               │
│  │ - analytics  │                               │
│  │ - bots       │                               │
│  │ - users      │                               │
│  └──────────────┘                               │
└────────│────────────────────────────────────────┘
         │ Database Connection
         │
┌────────▼────────────────────────────────────────┐
│         DataLens Integration Layer              │
│  ┌──────────────┐    ┌──────────────┐          │
│  │ Schema Map   │    │  API Routes  │          │
│  │ - Social     │    │  - Templates │          │
│  │   Models     │    │  - Analytics │          │
│  └──────────────┘    └──────────────┘          │
│         │                      │                │
│         ▼                      ▼                │
│  ┌──────────────────────────────────┐          │
│  │    DataLens Query Engine         │          │
│  │  - Natural Language → SQL        │          │
│  │  - Query Validation              │          │
│  │  - Results Caching               │          │
│  └──────────────────────────────────┘          │
│         │                                        │
│         ▼                                        │
│  ┌──────────────────────────────────┐          │
│  │  Visualization & Export          │          │
│  │  - Charts (Line, Bar, Pie)       │          │
│  │  - Export (CSV, JSON, Excel)     │          │
│  └──────────────────────────────────┘          │
└─────────────────────────────────────────────────┘
```

### Database Schema

The integration adds the following models to DataLens:

- `SocialUser` - SocialScaleBooster users
- `SocialBot` - Social media automation bots
- `SocialAnalytics` - Performance metrics and analytics data
- `SocialBotTemplate` - Bot templates from the marketplace

---

## Setup Instructions

### Prerequisites

1. SocialScaleBooster instance with PostgreSQL database
2. DataLens installation
3. Database credentials for SocialScaleBooster

### Step 1: Configure Environment Variables

Copy `.env.example` to `.env` and configure the SocialScaleBooster database connection:

```bash
# SocialScaleBooster Database Connection
SOCIAL_DB_HOST=localhost          # Your PostgreSQL host
SOCIAL_DB_PORT=5432               # PostgreSQL port
SOCIAL_DB_NAME=socialscalebooster # Database name
SOCIAL_DB_USER=postgres            # Database user
SOCIAL_DB_PASSWORD=your_password   # Database password
SOCIAL_DB_SSL=false                # Use SSL? (true/false)

# Integration Features
SOCIAL_INTEGRATION_ENABLED=true
SOCIAL_REAL_TIME_ANALYTICS=true
SOCIAL_EXPORT_ENABLED=true
SOCIAL_DASHBOARD_TEMPLATES=true
```

### Step 2: Create Database Connection in DataLens

1. Open DataLens dashboard
2. Navigate to **Database Connections**
3. Click **"Add New Connection"**
4. Fill in the connection details:
   - **Name**: "SocialScaleBooster Analytics"
   - **Type**: PostgreSQL
   - **Host**: Your database host (from SOCIAL_DB_HOST)
   - **Port**: 5432
   - **Database**: socialscalebooster
   - **Username**: postgres
   - **Password**: Your password
5. Click **"Test Connection"** to verify
6. Click **"Save"**

### Step 3: Verify Integration

Test the integration by making a request to the status endpoint:

```bash
curl "http://localhost:5000/api/social/status?databaseId=YOUR_DATABASE_ID"
```

Expected response:
```json
{
  "connected": true,
  "databaseType": "postgresql",
  "lastSync": "2025-11-09T...",
  "recordCount": {
    "users": 10,
    "bots": 25,
    "analytics": 1500,
    "templates": 12
  },
  "healthStatus": "healthy"
}
```

### Step 4: Load Pre-built Query Templates

Pre-built templates are automatically available at:

```
GET /api/social/templates
```

No additional configuration needed!

---

## API Reference

### Authentication

Currently uses the database connection authentication configured in Step 2. Future versions will support API keys.

### Endpoints

#### 1. Get All Query Templates

**GET** `/api/social/templates`

Returns all pre-built query templates.

**Query Parameters:**
- `category` (optional): Filter by category (revenue, engagement, performance, comparison, trend, roi)

**Example:**
```bash
curl "http://localhost:5000/api/social/templates?category=revenue"
```

**Response:**
```json
{
  "templates": [
    {
      "id": "total-revenue-all-time",
      "name": "Total Revenue - All Time",
      "description": "Get total revenue generated across all social media bots",
      "category": "revenue",
      "naturalLanguage": "What is my total revenue from all social media bots?",
      "sqlTemplate": "SELECT SUM(revenue) as total_revenue...",
      "visualizationType": "table"
    }
  ]
}
```

---

#### 2. Get Specific Template

**GET** `/api/social/templates/:id`

Returns a specific query template by ID.

**Example:**
```bash
curl "http://localhost:5000/api/social/templates/revenue-by-platform"
```

---

#### 3. Execute Template Query

**POST** `/api/social/query-from-template`

Executes a pre-built query template with parameters.

**Request Body:**
```json
{
  "templateId": "revenue-by-platform",
  "databaseId": "your-database-id",
  "parameters": ["user-id-123"]
}
```

**Response:**
```json
{
  "query": {
    "id": "query-id",
    "naturalLanguage": "Show me revenue breakdown by platform",
    "sqlQuery": "SELECT b.platform, SUM(a.revenue)..."
  },
  "result": {
    "rows": [
      { "platform": "tiktok", "total_revenue": 5000 },
      { "platform": "instagram", "total_revenue": 3500 }
    ],
    "rowCount": 2
  },
  "template": {
    "id": "revenue-by-platform",
    "name": "Revenue by Platform",
    "visualizationType": "bar"
  }
}
```

---

#### 4. Get Analytics Summary

**GET** `/api/social/analytics/summary`

Returns aggregated analytics metrics for a user.

**Query Parameters:**
- `databaseId` (required): Database connection ID
- `userId` (required): SocialScaleBooster user ID

**Example:**
```bash
curl "http://localhost:5000/api/social/analytics/summary?databaseId=db-123&userId=user-456"
```

**Response:**
```json
{
  "totalRevenue": 12450.00,
  "totalEngagement": 45000,
  "totalPosts": 350,
  "totalClicks": 8500,
  "totalConversions": 425,
  "totalImpressions": 250000,
  "totalReach": 180000,
  "conversionRate": 5.0,
  "engagementRate": 25.0
}
```

---

#### 5. Get Platform Breakdown

**GET** `/api/social/analytics/platforms`

Returns performance metrics grouped by platform.

**Query Parameters:**
- `databaseId` (required)
- `userId` (required)

**Example:**
```bash
curl "http://localhost:5000/api/social/analytics/platforms?databaseId=db-123&userId=user-456"
```

**Response:**
```json
[
  {
    "platform": "tiktok",
    "botCount": 5,
    "revenue": 5000,
    "engagement": 20000,
    "posts": 150,
    "conversionRate": 6.5
  },
  {
    "platform": "instagram",
    "botCount": 3,
    "revenue": 3500,
    "engagement": 15000,
    "posts": 120,
    "conversionRate": 4.2
  }
]
```

---

#### 6. Get Bot Performance

**GET** `/api/social/bots/performance`

Returns performance summary for bots.

**Query Parameters:**
- `databaseId` (required)
- `userId` (required)
- `limit` (optional, default: 10)

**Example:**
```bash
curl "http://localhost:5000/api/social/bots/performance?databaseId=db-123&userId=user-456&limit=5"
```

---

#### 7. Get Time-Series Data

**GET** `/api/social/analytics/timeseries`

Returns time-series analytics data.

**Query Parameters:**
- `databaseId` (required)
- `userId` (required)
- `period` (optional, default: 30) - Number of days
- `groupBy` (optional, default: 'day') - Values: 'day', 'week', 'month'

**Example:**
```bash
curl "http://localhost:5000/api/social/analytics/timeseries?databaseId=db-123&userId=user-456&period=30&groupBy=day"
```

**Response:**
```json
[
  {
    "period": "2025-11-01",
    "revenue": 450,
    "engagement": 1500,
    "posts": 12,
    "clicks": 300,
    "conversions": 15,
    "impressions": 8000,
    "reach": 6000
  }
]
```

---

#### 8. Get Integration Status

**GET** `/api/social/status`

Returns the health status of the SocialScaleBooster integration.

**Query Parameters:**
- `databaseId` (required)

---

## Pre-built Query Templates

### Revenue Templates

| Template ID | Description | Visualization |
|-------------|-------------|---------------|
| `total-revenue-all-time` | Total revenue across all bots | Table |
| `revenue-by-platform` | Revenue breakdown by platform | Bar Chart |
| `monthly-revenue-trend` | 12-month revenue trend | Line Chart |
| `revenue-per-click` | Revenue per click by platform | Bar Chart |

### Performance Templates

| Template ID | Description | Visualization |
|-------------|-------------|---------------|
| `top-performing-bots` | Top 10 bots by revenue | Bar Chart |
| `platform-post-performance` | Avg engagement per post | Bar Chart |
| `recent-high-performers` | Exceptional performers (7 days) | Table |
| `bot-activity-timeline` | Bot activity over time | Table |

### Engagement Templates

| Template ID | Description | Visualization |
|-------------|-------------|---------------|
| `engagement-rate-by-platform` | Engagement rate comparison | Bar Chart |
| `impressions-to-engagement` | Conversion funnel analysis | Table |

### ROI Templates

| Template ID | Description | Visualization |
|-------------|-------------|---------------|
| `conversion-rate-analysis` | Conversion rates by bot | Table |
| `roi-by-bot` | ROI percentage by bot | Bar Chart |

### Trend Templates

| Template ID | Description | Visualization |
|-------------|-------------|---------------|
| `daily-performance-last-30-days` | Daily metrics (30 days) | Line Chart |
| `weekly-growth-rate` | Week-over-week growth | Line Chart |
| `best-performing-day` | Best day of week | Bar Chart |

### Comparison Templates

| Template ID | Description | Visualization |
|-------------|-------------|---------------|
| `tiktok-vs-instagram` | TikTok vs Instagram metrics | Bar Chart |
| `active-vs-paused-bots` | Active vs paused performance | Pie Chart |
| `premium-vs-free-performance` | Premium vs free users | Bar Chart |

---

## Usage Examples

### Example 1: Natural Language Query

```typescript
// User asks: "What was my revenue from Instagram bots last month?"

// 1. DataLens translates to SQL
POST /api/queries/translate
{
  "naturalLanguage": "What was my revenue from Instagram bots last month?",
  "databaseId": "social-db-id"
}

// 2. Response includes generated SQL
{
  "sql": "SELECT SUM(a.revenue) as total_revenue FROM social_analytics a JOIN social_bots b ON a.botId = b.id WHERE b.platform = 'instagram' AND a.date >= date('now', '-1 month')",
  "explanation": "This query calculates total revenue from Instagram bots in the last month",
  "confidence": 0.95
}

// 3. Execute the query
POST /api/queries/execute
{
  "sql": "...",
  "databaseId": "social-db-id",
  "naturalLanguage": "What was my revenue from Instagram bots last month?"
}
```

---

### Example 2: Using a Pre-built Template

```typescript
// Get all templates
const templates = await fetch('/api/social/templates');

// Execute the "Revenue by Platform" template
const result = await fetch('/api/social/query-from-template', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    templateId: 'revenue-by-platform',
    databaseId: 'social-db-id',
    parameters: ['user-123']  // userId
  })
});

const data = await result.json();

// Visualize with Chart.js
const chartData = {
  labels: data.result.rows.map(r => r.platform),
  datasets: [{
    label: 'Revenue by Platform',
    data: data.result.rows.map(r => r.total_revenue),
    backgroundColor: ['#000000', '#E4405F', '#1877F2', '#1DA1F2']
  }]
};
```

---

### Example 3: Building a Custom Dashboard

```typescript
// Fetch summary metrics
const summary = await fetch(
  '/api/social/analytics/summary?databaseId=db-123&userId=user-456'
).then(r => r.json());

// Fetch platform breakdown
const platforms = await fetch(
  '/api/social/analytics/platforms?databaseId=db-123&userId=user-456'
).then(r => r.json());

// Fetch time-series data for charts
const timeSeries = await fetch(
  '/api/social/analytics/timeseries?databaseId=db-123&userId=user-456&period=30'
).then(r => r.json());

// Display dashboard
<Dashboard>
  <MetricCard title="Total Revenue" value={summary.totalRevenue} />
  <MetricCard title="Engagement Rate" value={summary.engagementRate} />
  <PlatformChart data={platforms} />
  <TimeSeriesChart data={timeSeries} />
</Dashboard>
```

---

## Data Models

### SocialAnalytics

Primary table for analytics metrics.

```typescript
interface SocialAnalytics {
  id: string;
  userId: string;        // Foreign key to social_users
  botId: string | null;  // Foreign key to social_bots
  date: Date;            // Record timestamp
  revenue: number;       // Revenue generated
  engagement: number;    // Total engagement (likes, comments, shares)
  posts: number;         // Number of posts
  clicks: number;        // Total clicks
  conversions: number;   // Total conversions
  impressions: number;   // Total impressions
  reach: number;         // Total reach
}
```

### SocialBot

Bot configuration and metadata.

```typescript
interface SocialBot {
  id: string;
  userId: string;
  name: string;
  description: string | null;
  platform: 'tiktok' | 'instagram' | 'facebook' | 'twitter' | 'youtube' | 'multi';
  status: 'active' | 'paused' | 'stopped';
  config: string | null;  // JSON configuration
  metrics: string | null; // JSON metrics
  createdAt: Date;
}
```

---

## Troubleshooting

### Connection Issues

**Problem**: "Unable to connect to database"

**Solution**:
1. Verify PostgreSQL is running
2. Check database credentials in `.env`
3. Ensure network connectivity
4. Test connection: `psql -h localhost -U postgres -d socialscalebooster`

---

### Query Errors

**Problem**: "Table does not exist: social_analytics"

**Solution**:
1. Verify you're connected to the correct database
2. Check that SocialScaleBooster has run migrations
3. Verify table names match the schema mapping

---

### Performance Issues

**Problem**: Queries are slow

**Solution**:
1. Add indexes on frequently queried columns (date, userId, botId)
2. Limit time ranges for large datasets
3. Use aggregated endpoints instead of raw queries
4. Enable query result caching

---

### Template Not Found

**Problem**: "Template not found"

**Solution**:
1. Verify `config/social-query-templates.json` exists
2. Check template ID spelling
3. Ensure templates file is valid JSON

---

## Next Steps

1. **Explore Templates**: Browse all 18 pre-built templates
2. **Create Custom Queries**: Use natural language to ask unique questions
3. **Build Dashboards**: Create custom dashboards with your analytics
4. **Export Data**: Export results to CSV/JSON for further analysis
5. **Automate Reports**: Schedule queries to run automatically

---

## Support

For issues or questions:
- GitHub Issues: https://github.com/smartflow-systems/SFSDataQueryEngine/issues
- Documentation: `/docs`

---

**Happy Analyzing!** 🚀📊
