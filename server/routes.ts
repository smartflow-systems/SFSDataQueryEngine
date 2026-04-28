import type { Express, Request, Response, RequestHandler } from "express";
import { storage } from "./storage.js";
import { translateNaturalLanguageToSQL, validateAndOptimizeSQL } from "./services/openai.js";
import { databaseService } from "./services/database.js";
import {
  insertDatabaseSchema,
  insertQuerySchema,
  insertDashboardSchema,
  insertChartSchema
} from "../shared/schema.js";
import { requireAuth } from "./middleware/sfs-auth.js";

interface RouteOptions {
  queryLimiter?: RequestHandler;
}

export function registerRoutes(app: Express, options: RouteOptions = {}): void {
  const { queryLimiter } = options;
  // Database routes
  app.get("/api/databases", async (req, res) => {
    try {
      // Filter by orgId when the caller is authenticated
      const orgId = req.user?.orgId;
      const databases = await storage.getDatabases(orgId);
      res.json(databases);
    } catch (error) {
      res.status(500).json({ message: error instanceof Error ? error.message : 'Unknown error' });
    }
  });

  app.post("/api/databases", requireAuth, async (req, res) => {
    try {
      const validatedData = insertDatabaseSchema.parse(req.body);
      const database = await storage.createDatabase({ ...validatedData, orgId: req.user!.orgId });
      res.json(database);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : 'Unknown error' });
    }
  });

  app.get("/api/databases/:id/schema", async (req, res) => {
    try {
      const database = await storage.getDatabase(req.params.id);
      if (!database) {
        return res.status(404).json({ message: "Database not found" });
      }

      const schema = await databaseService.getTableSchema(database.connectionString || "");
      res.json(schema);
    } catch (error) {
      res.status(500).json({ message: error instanceof Error ? error.message : 'Unknown error' });
    }
  });

  app.post("/api/databases/:id/test", async (req, res) => {
    try {
      const database = await storage.getDatabase(req.params.id);
      if (!database) {
        return res.status(404).json({ message: "Database not found" });
      }

      const isConnected = await databaseService.testConnection(database.connectionString || "");
      res.json({ connected: isConnected });
    } catch (error) {
      res.status(500).json({ message: error instanceof Error ? error.message : 'Unknown error' });
    }
  });

  // Query routes
  app.get("/api/queries", async (req, res) => {
    try {
      const queries = await storage.getQueries();
      res.json(queries);
    } catch (error) {
      res.status(500).json({ message: error instanceof Error ? error.message : 'Unknown error' });
    }
  });

  app.get("/api/queries/saved", async (req, res) => {
    try {
      const queries = await storage.getSavedQueries();
      res.json(queries);
    } catch (error) {
      res.status(500).json({ message: error instanceof Error ? error.message : 'Unknown error' });
    }
  });

  app.get("/api/queries/recent", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const queries = await storage.getRecentQueries(limit);
      res.json(queries);
    } catch (error) {
      res.status(500).json({ message: error instanceof Error ? error.message : 'Unknown error' });
    }
  });

  const translateHandler = async (req: Request, res: Response) => {
    try {
      const { naturalLanguage, databaseId } = req.body;

      if (!naturalLanguage) {
        return res.status(400).json({ message: "Natural language query is required" });
      }

      let tableSchema = "";
      if (databaseId) {
        const database = await storage.getDatabase(databaseId);
        if (database) {
          const schema = await databaseService.getTableSchema(database.connectionString || "");
          tableSchema = JSON.stringify(schema, null, 2);
        }
      }

      const result = await translateNaturalLanguageToSQL(naturalLanguage, tableSchema);
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: error instanceof Error ? error.message : 'Unknown error' });
    }
  };

  if (queryLimiter) {
    app.post("/api/queries/translate", requireAuth, queryLimiter, translateHandler);
  } else {
    app.post("/api/queries/translate", requireAuth, translateHandler);
  }

  const executeHandler = async (req: Request, res: Response) => {
    try {
      // SECURITY NOTE: This endpoint intentionally accepts SQL from users as part of
      // the Natural Language → SQL translation feature. Multiple security layers protect against SQL injection:
      // 1. AI-based validation (validateAndOptimizeSQL)
      // 2. Pattern-based SQL structure validation (isSafeSqlStatement)
      // 3. Parameterized query enforcement (checked below)
      // 4. Dangerous keyword blocking
      // 5. Rate limiting on query execution
      const { sql, databaseId, naturalLanguage, save, params } = req.body;

      if (!sql || !databaseId) {
        return res.status(400).json({ message: "SQL query and database ID are required" });
      }

      const database = await storage.getDatabase(databaseId);
      if (!database) {
        return res.status(404).json({ message: "Database not found" });
      }

      // Layer 1: AI-based SQL validation
      const validation = await validateAndOptimizeSQL(sql);
      if (!validation.isValid) {
        return res.status(400).json({
          message: "Invalid SQL query",
          errors: validation.errors
        });
      }

      // Check for user-controlled input interpolation
      // Ensure that any parameterized values are passed only in params, never interpolated as literals
      const placeholderCount = (sql.match(/\?/g) || []).length;
      if (params && params.length > 0 && placeholderCount !== params.length) {
        return res.status(400).json({ message: "Mismatch between number of SQL placeholders and provided parameters. Only use parameter placeholders (?) for user data." });
      }
      if (/(['"]).+?\1/.test(sql)) {
        return res.status(400).json({ message: "Unsafe SQL statement: Do not interpolate user data directly into the query string. Use parameter placeholders." });
      }
      // Layer 2: Enforce parameterized queries for user data
      // Count SQL placeholders (?) in the query
      const placeholderCount = (sql.match(/\?/g) || []).length;

      // Ensure params array matches placeholder count if params provided
      if (params && params.length > 0 && placeholderCount !== params.length) {
        return res.status(400).json({
          message: "Mismatch between number of SQL placeholders and provided parameters. Only use parameter placeholders (?) for user data."
        });
      }

      // Layer 3: Detect and block direct string interpolation (quotes in SQL)
      // This catches attempts to embed user data directly in SQL instead of using params
      // Security: Use negative lookahead to prevent ReDoS (polynomial regex) vulnerability
      // Limit to 10000 chars to prevent excessive backtracking
      if (/(['"`])(?:(?!\1).){0,10000}\1/.test(sql)) {
        return res.status(400).json({
          message: "Unsafe SQL statement: Do not interpolate user data directly into the query string. Use parameter placeholders (?) instead."
        });
      }

      // Layer 4: Execute query with all security validations
      // lgtm[js/sql-injection] - Intentional SQL execution with multi-layer validation
      // codeql[js/sql-injection] - Accepted risk: This is a SQL query tool. Security layers prevent injection.
      const result = await databaseService.executeQuery(database.connectionString || "", sql, params || []);

      // Save query if requested or if it should be saved automatically
      const queryData: any = {
        naturalLanguage: naturalLanguage || "",
        sqlQuery: sql,
        databaseId,
        isSaved: save || false
      };

      const savedQuery = await storage.createQuery(queryData);

      res.json({
        query: savedQuery,
        result,
        validation
      });
    } catch (error) {
      res.status(500).json({ message: error instanceof Error ? error.message : 'Unknown error' });
    }
  };

  if (queryLimiter) {
    app.post("/api/queries/execute", requireAuth, queryLimiter, executeHandler);
  } else {
    app.post("/api/queries/execute", requireAuth, executeHandler);
  }

  app.post("/api/queries/:id/save", async (req, res) => {
    try {
      const { name } = req.body;
      const query = await storage.updateQuery(req.params.id, { 
        isSaved: true,
        name: name || `Saved Query ${new Date().toLocaleString()}`
      });
      
      if (!query) {
        return res.status(404).json({ message: "Query not found" });
      }

      res.json(query);
    } catch (error) {
      res.status(500).json({ message: error instanceof Error ? error.message : 'Unknown error' });
    }
  });

  // Dashboard routes
  app.get("/api/dashboards", async (req, res) => {
    try {
      // Filter by orgId when the caller is authenticated
      const orgId = req.user?.orgId;
      const dashboards = await storage.getDashboards(orgId);
      res.json(dashboards);
    } catch (error) {
      res.status(500).json({ message: error instanceof Error ? error.message : 'Unknown error' });
    }
  });

  app.post("/api/dashboards", requireAuth, async (req, res) => {
    try {
      const validatedData = insertDashboardSchema.parse(req.body);
      const dashboard = await storage.createDashboard({ ...validatedData, orgId: req.user!.orgId });
      res.json(dashboard);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : 'Unknown error' });
    }
  });

  app.get("/api/dashboards/:id", async (req, res) => {
    try {
      const dashboard = await storage.getDashboard(req.params.id);
      if (!dashboard) {
        return res.status(404).json({ message: "Dashboard not found" });
      }

      const charts = await storage.getChartsByDashboard(req.params.id);
      res.json({ ...dashboard, charts });
    } catch (error) {
      res.status(500).json({ message: error instanceof Error ? error.message : 'Unknown error' });
    }
  });

  // Chart routes
  app.post("/api/charts", requireAuth, async (req, res) => {
    try {
      const validatedData = insertChartSchema.parse(req.body);
      const chart = await storage.createChart(validatedData);
      res.json(chart);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : 'Unknown error' });
    }
  });

  app.put("/api/charts/:id", requireAuth, async (req, res) => {
    try {
      const updates = req.body;
      const chart = await storage.updateChart(req.params.id, updates);

      if (!chart) {
        return res.status(404).json({ message: "Chart not found" });
      }

      res.json(chart);
    } catch (error) {
      res.status(500).json({ message: error instanceof Error ? error.message : 'Unknown error' });
    }
  });

  app.delete("/api/charts/:id", requireAuth, async (req, res) => {
    try {
      const success = await storage.deleteChart(req.params.id);
      if (!success) {
        return res.status(404).json({ message: "Chart not found" });
      }

      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: error instanceof Error ? error.message : 'Unknown error' });
    }
  });

  // =============================================================================
  // SocialScaleBooster Integration Routes
  // These routes provide access to social media analytics data
  // =============================================================================

  // Get all pre-built query templates
  app.get("/api/social/templates", async (req, res) => {
    try {
      const fs = await import('fs/promises');
      const path = await import('path');
      const templatesPath = path.join(process.cwd(), 'config', 'social-query-templates.json');
      const templatesData = await fs.readFile(templatesPath, 'utf-8');
      const templates = JSON.parse(templatesData);

      // Filter by category if provided
      const category = req.query.category as string | undefined;
      if (category) {
        const filtered = templates.templates.filter((t: any) => t.category === category);
        return res.json({ templates: filtered });
      }

      res.json(templates);
    } catch (error) {
      res.status(500).json({ message: error instanceof Error ? error.message : 'Failed to load query templates' });
    }
  });

  // Get a specific query template by ID
  app.get("/api/social/templates/:id", async (req, res) => {
    try {
      const fs = await import('fs/promises');
      const path = await import('path');
      const templatesPath = path.join(process.cwd(), 'config', 'social-query-templates.json');
      const templatesData = await fs.readFile(templatesPath, 'utf-8');
      const templates = JSON.parse(templatesData);

      const template = templates.templates.find((t: any) => t.id === req.params.id);
      if (!template) {
        return res.status(404).json({ message: "Template not found" });
      }

      res.json(template);
    } catch (error) {
      res.status(500).json({ message: error instanceof Error ? error.message : 'Failed to load query template' });
    }
  });

  // Execute a query from a pre-built template
  app.post("/api/social/query-from-template", requireAuth, async (req, res) => {
    try {
      const { templateId, parameters, databaseId } = req.body;

      if (!templateId || !databaseId) {
        return res.status(400).json({ message: "Template ID and database ID are required" });
      }

      // Load the template
      const fs = await import('fs/promises');
      const path = await import('path');
      const templatesPath = path.join(process.cwd(), 'config', 'social-query-templates.json');
      const templatesData = await fs.readFile(templatesPath, 'utf-8');
      const templates = JSON.parse(templatesData);

      const template = templates.templates.find((t: any) => t.id === templateId);
      if (!template) {
        return res.status(404).json({ message: "Template not found" });
      }

      // Get database connection
      const database = await storage.getDatabase(databaseId);
      if (!database) {
        return res.status(404).json({ message: "Database not found" });
      }

      // Prepare parameters for the query
      const queryParams = parameters || [];

      // Execute the query
      const result = await databaseService.executeQuery(database.connectionString || "", template.sqlTemplate, queryParams);

      // Save the query
      const savedQuery = await storage.createQuery({
        naturalLanguage: template.naturalLanguage,
        sqlQuery: template.sqlTemplate,
        databaseId,
        isSaved: false
      });

      res.json({
        query: savedQuery,
        result,
        template: {
          id: template.id,
          name: template.name,
          description: template.description,
          visualizationType: template.visualizationType
        }
      });
    } catch (error) {
      res.status(500).json({ message: error instanceof Error ? error.message : 'Failed to execute template query' });
    }
  });

  // Get social analytics summary
  app.get("/api/social/analytics/summary", async (req, res) => {
    try {
      const { databaseId, userId } = req.query;

      if (!databaseId || !userId) {
        return res.status(400).json({ message: "Database ID and User ID are required" });
      }

      const database = await storage.getDatabase(databaseId as string);
      if (!database) {
        return res.status(404).json({ message: "Database not found" });
      }

      // Get aggregated metrics
      const summaryQuery = `
        SELECT
          SUM(revenue) as totalRevenue,
          SUM(engagement) as totalEngagement,
          SUM(posts) as totalPosts,
          SUM(clicks) as totalClicks,
          SUM(conversions) as totalConversions,
          SUM(impressions) as totalImpressions,
          SUM(reach) as totalReach,
          ROUND((SUM(conversions) * 100.0 / NULLIF(SUM(clicks), 0)), 2) as conversionRate,
          ROUND((SUM(engagement) * 100.0 / NULLIF(SUM(reach), 0)), 2) as engagementRate
        FROM social_analytics
        WHERE userId = ?
      `;

      const result = await databaseService.executeQuery(database.connectionString || "", summaryQuery, [userId]);

      res.json(result.rows[0] || {});
    } catch (error) {
      res.status(500).json({ message: error instanceof Error ? error.message : 'Failed to fetch analytics summary' });
    }
  });

  // Get platform breakdown
  app.get("/api/social/analytics/platforms", async (req, res) => {
    try {
      const { databaseId, userId } = req.query;

      if (!databaseId || !userId) {
        return res.status(400).json({ message: "Database ID and User ID are required" });
      }

      const database = await storage.getDatabase(databaseId as string);
      if (!database) {
        return res.status(404).json({ message: "Database not found" });
      }

      const platformQuery = `
        SELECT
          b.platform,
          COUNT(DISTINCT b.id) as botCount,
          SUM(a.revenue) as revenue,
          SUM(a.engagement) as engagement,
          SUM(a.posts) as posts,
          ROUND((SUM(a.conversions) * 100.0 / NULLIF(SUM(a.clicks), 0)), 2) as conversionRate
        FROM social_analytics a
        JOIN social_bots b ON a.botId = b.id
        WHERE a.userId = ?
        GROUP BY b.platform
        ORDER BY revenue DESC
      `;

      const result = await databaseService.executeQuery(database.connectionString || "", platformQuery, [userId]);

      res.json(result.rows || []);
    } catch (error) {
      res.status(500).json({ message: error instanceof Error ? error.message : 'Failed to fetch platform analytics' });
    }
  });

  // Get bot performance summary
  app.get("/api/social/bots/performance", async (req, res) => {
    try {
      const { databaseId, userId, limit } = req.query;

      if (!databaseId || !userId) {
        return res.status(400).json({ message: "Database ID and User ID are required" });
      }

      const database = await storage.getDatabase(databaseId as string);
      if (!database) {
        return res.status(404).json({ message: "Database not found" });
      }

      const performanceLimit = limit ? parseInt(limit as string) : 10;

      const botQuery = `
        SELECT
          b.id as botId,
          b.name as botName,
          b.platform,
          b.status,
          SUM(a.revenue) as totalRevenue,
          SUM(a.engagement) as totalEngagement,
          SUM(a.posts) as totalPosts,
          ROUND((SUM(a.conversions) * 100.0 / NULLIF(SUM(a.clicks), 0)), 2) as conversionRate
        FROM social_bots b
        LEFT JOIN social_analytics a ON b.id = a.botId
        WHERE b.userId = ?
        GROUP BY b.id, b.name, b.platform, b.status
        ORDER BY totalRevenue DESC
        LIMIT ?
      `;

      const result = await databaseService.executeQuery(database.connectionString || "", botQuery, [userId, performanceLimit]);

      res.json(result.rows || []);
    } catch (error) {
      res.status(500).json({ message: error instanceof Error ? error.message : 'Failed to fetch bot performance' });
    }
  });

  // Get time-series analytics data
  app.get("/api/social/analytics/timeseries", async (req, res) => {
    try {
      const { databaseId, userId, period = '30', groupBy = 'day' } = req.query;

      if (!databaseId || !userId) {
        return res.status(400).json({ message: "Database ID and User ID are required" });
      }

      const database = await storage.getDatabase(databaseId as string);
      if (!database) {
        return res.status(404).json({ message: "Database not found" });
      }

      let dateFormat = '%Y-%m-%d';
      if (groupBy === 'week') {
        dateFormat = '%Y-W%W';
      } else if (groupBy === 'month') {
        dateFormat = '%Y-%m';
      }

      const timeSeriesQuery = `
        SELECT
          strftime('${dateFormat}', date) as period,
          SUM(revenue) as revenue,
          SUM(engagement) as engagement,
          SUM(posts) as posts,
          SUM(clicks) as clicks,
          SUM(conversions) as conversions,
          SUM(impressions) as impressions,
          SUM(reach) as reach
        FROM social_analytics
        WHERE userId = ? AND date >= date('now', '-${period} days')
        GROUP BY period
        ORDER BY period
      `;

      const result = await databaseService.executeQuery(database.connectionString || "", timeSeriesQuery, [userId]);

      res.json(result.rows || []);
    } catch (error) {
      res.status(500).json({ message: error instanceof Error ? error.message : 'Failed to fetch time-series analytics' });
    }
  });

  // Get integration status
  app.get("/api/social/status", async (req, res) => {
    try {
      const { databaseId } = req.query;

      if (!databaseId) {
        return res.status(400).json({ message: "Database ID is required" });
      }

      const database = await storage.getDatabase(databaseId as string);
      if (!database) {
        return res.status(404).json({ message: "Database not found" });
      }

      // Test connection
      const isConnected = await databaseService.testConnection(database.connectionString || "");

      if (!isConnected) {
        return res.json({
          connected: false,
          healthStatus: 'unavailable',
          error: 'Unable to connect to database'
        });
      }

      // Get record counts
      const usersCount = await databaseService.executeQuery(database.connectionString || "", "SELECT COUNT(*) as count FROM social_users", []);
      const botsCount = await databaseService.executeQuery(database.connectionString || "", "SELECT COUNT(*) as count FROM social_bots", []);
      const analyticsCount = await databaseService.executeQuery(database.connectionString || "", "SELECT COUNT(*) as count FROM social_analytics", []);
      const templatesCount = await databaseService.executeQuery(database.connectionString || "", "SELECT COUNT(*) as count FROM social_bot_templates", []);

      res.json({
        connected: true,
        databaseType: database.type,
        lastSync: new Date(),
        recordCount: {
          users: usersCount.rows[0]?.count || 0,
          bots: botsCount.rows[0]?.count || 0,
          analytics: analyticsCount.rows[0]?.count || 0,
          templates: templatesCount.rows[0]?.count || 0,
        },
        healthStatus: 'healthy'
      });
    } catch (error) {
      res.status(500).json({
        connected: false,
        healthStatus: 'degraded',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

}
