# Quick Start: SocialScaleBooster Integration

Get started with DataLens + SocialScaleBooster integration in 5 minutes!

## Prerequisites

- Node.js 18+ installed
- SocialScaleBooster instance running
- PostgreSQL database accessible

## Step-by-Step Setup

### 1. Clone and Install (if not already done)

```bash
git clone https://github.com/smartflow-systems/SFSDataQueryEngine.git
cd SFSDataQueryEngine
npm install
```

### 2. Configure Environment

Create a `.env` file from the example:

```bash
cp .env.example .env
```

Edit `.env` and add your SocialScaleBooster database credentials:

```bash
# Your OpenAI API Key (required for natural language queries)
OPENAI_API_KEY=sk-your-key-here

# SocialScaleBooster Database Connection
SOCIAL_DB_HOST=localhost
SOCIAL_DB_PORT=5432
SOCIAL_DB_NAME=socialscalebooster
SOCIAL_DB_USER=postgres
SOCIAL_DB_PASSWORD=your_password
SOCIAL_DB_SSL=false

# Integration Features
SOCIAL_INTEGRATION_ENABLED=true
```

### 3. Start the Server

```bash
npm run dev
```

The server will start at `http://localhost:5000`

### 4. Add Database Connection in UI

1. Open your browser: `http://localhost:5000`
2. Navigate to **"Database Connections"**
3. Click **"+ New Connection"**
4. Fill in the form:
   ```
   Name: SocialScaleBooster Analytics
   Type: PostgreSQL
   Host: localhost
   Port: 5432
   Database: socialscalebooster
   Username: postgres
   Password: ********
   ```
5. Click **"Test Connection"** ✅
6. Click **"Save"**

### 5. Try Your First Query!

#### Option A: Use a Pre-built Template

1. Go to **"Query Templates"** tab
2. Browse templates (e.g., "Total Revenue - All Time")
3. Click **"Run Template"**
4. View results in table format
5. Click **"Visualize"** to create charts

#### Option B: Ask a Natural Language Question

1. Go to **"Natural Language Query"** tab
2. Type: `"What was my revenue from TikTok bots last month?"`
3. Click **"Translate to SQL"**
4. Review the generated SQL
5. Click **"Execute Query"**
6. View results and visualizations

### 6. Create Your First Dashboard

1. Click **"Save to Dashboard"** on any query result
2. Give your dashboard a name: "Social Media Performance"
3. Add multiple charts:
   - Revenue by Platform (Bar Chart)
   - Monthly Revenue Trend (Line Chart)
   - Engagement Rate (Gauge)
4. Arrange charts by dragging
5. Click **"Save Dashboard"**

## Example Queries to Try

### Revenue Analysis

```
What is my total revenue from all social media bots?
```

```
Show me revenue breakdown by platform
```

```
Which are my top 10 performing bots by revenue?
```

### Engagement Metrics

```
What is the engagement rate for each social media platform?
```

```
Show me daily engagement for the last 30 days
```

### Performance Tracking

```
Which bots performed exceptionally well in the last week?
```

```
Compare TikTok and Instagram performance
```

### ROI Insights

```
What are my conversion rates for each bot?
```

```
What is my revenue per click for each platform?
```

## Using the API Directly

### Get All Templates

```bash
curl http://localhost:5000/api/social/templates
```

### Execute a Template

```bash
curl -X POST http://localhost:5000/api/social/query-from-template \
  -H "Content-Type: application/json" \
  -d '{
    "templateId": "revenue-by-platform",
    "databaseId": "your-db-id",
    "parameters": ["your-user-id"]
  }'
```

### Get Analytics Summary

```bash
curl "http://localhost:5000/api/social/analytics/summary?databaseId=your-db-id&userId=your-user-id"
```

### Get Time-Series Data

```bash
curl "http://localhost:5000/api/social/analytics/timeseries?databaseId=your-db-id&userId=your-user-id&period=30&groupBy=day"
```

## Frontend Integration Example

```typescript
import { useQuery } from '@tanstack/react-query';

function SocialAnalyticsDashboard() {
  const databaseId = 'your-db-id';
  const userId = 'your-user-id';

  // Fetch summary metrics
  const { data: summary } = useQuery({
    queryKey: ['social-summary', databaseId, userId],
    queryFn: async () => {
      const res = await fetch(
        `/api/social/analytics/summary?databaseId=${databaseId}&userId=${userId}`
      );
      return res.json();
    }
  });

  // Fetch platform breakdown
  const { data: platforms } = useQuery({
    queryKey: ['social-platforms', databaseId, userId],
    queryFn: async () => {
      const res = await fetch(
        `/api/social/analytics/platforms?databaseId=${databaseId}&userId=${userId}`
      );
      return res.json();
    }
  });

  return (
    <div className="grid grid-cols-3 gap-4">
      <MetricCard
        title="Total Revenue"
        value={`$${summary?.totalRevenue?.toFixed(2) || 0}`}
        trend={summary?.monthlyGrowth}
      />
      <MetricCard
        title="Engagement Rate"
        value={`${summary?.engagementRate?.toFixed(1) || 0}%`}
      />
      <MetricCard
        title="Total Posts"
        value={summary?.totalPosts || 0}
      />

      <div className="col-span-3">
        <BarChart
          data={platforms}
          xKey="platform"
          yKey="revenue"
          title="Revenue by Platform"
        />
      </div>
    </div>
  );
}
```

## Pre-built Templates Overview

| Category | Templates | Use Case |
|----------|-----------|----------|
| **Revenue** | 4 templates | Track income, identify top earners |
| **Performance** | 4 templates | Bot rankings, activity analysis |
| **Engagement** | 2 templates | Social interactions, reach metrics |
| **ROI** | 3 templates | Conversion rates, profitability |
| **Trends** | 3 templates | Time-based patterns, growth |
| **Comparison** | 3 templates | Platform comparisons, user segments |

**Total: 18 ready-to-use templates!**

## Visualization Options

DataLens supports multiple chart types for your data:

- **Line Charts**: Time-series trends, growth over time
- **Bar Charts**: Platform comparisons, top performers
- **Pie Charts**: Distribution, market share
- **Area Charts**: Cumulative metrics, stacked trends
- **Tables**: Detailed data views, export-ready

## Export Your Data

Export query results in multiple formats:

1. **CSV**: Excel-compatible, spreadsheet analysis
2. **JSON**: API integration, programmatic access
3. **Excel**: Direct import to Microsoft Excel

Click the **"Export"** button on any query result and choose your format.

## Next Steps

1. **Explore All Templates**: Browse the 18 pre-built templates
2. **Create Custom Queries**: Ask questions in natural language
3. **Build Dashboards**: Combine multiple visualizations
4. **Schedule Reports**: Set up automated query execution (coming soon)
5. **Share Insights**: Export and share with your team

## Common Issues

### Can't connect to database?
- Verify PostgreSQL is running
- Check credentials in `.env`
- Ensure network connectivity

### No data returned?
- Verify you're using the correct userId
- Check that your SocialScaleBooster has data
- Review the SQL query for errors

### Templates not loading?
- Check that `config/social-query-templates.json` exists
- Restart the server after configuration changes

## Get Help

- Full Documentation: `/docs/SOCIAL_INTEGRATION.md`
- GitHub Issues: https://github.com/smartflow-systems/SFSDataQueryEngine/issues
- API Reference: See main documentation

---

**You're all set!** Start querying your social media analytics with natural language. 🚀
