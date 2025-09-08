import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { translateNaturalLanguageToSQL, validateAndOptimizeSQL } from "./services/openai";
import { databaseService } from "./services/database-temp";
import { 
  insertDatabaseSchema, 
  insertQuerySchema, 
  insertDashboardSchema, 
  insertChartSchema 
} from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Database routes
  app.get("/api/databases", async (req, res) => {
    try {
      const databases = await storage.getDatabases();
      res.json(databases);
    } catch (error) {
      res.status(500).json({ message: error instanceof Error ? error.message : 'Unknown error' });
    }
  });

  app.post("/api/databases", async (req, res) => {
    try {
      const validatedData = insertDatabaseSchema.parse(req.body);
      const database = await storage.createDatabase(validatedData);
      res.json(database);
    } catch (error) {
      res.status(400).json({ message: error.message });
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

  app.post("/api/queries/translate", async (req, res) => {
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
  });

  app.post("/api/queries/execute", async (req, res) => {
    try {
      const { sql, databaseId, naturalLanguage, save } = req.body;
      
      if (!sql || !databaseId) {
        return res.status(400).json({ message: "SQL query and database ID are required" });
      }

      const database = await storage.getDatabase(databaseId);
      if (!database) {
        return res.status(404).json({ message: "Database not found" });
      }

      // Validate SQL first
      const validation = await validateAndOptimizeSQL(sql);
      if (!validation.isValid) {
        return res.status(400).json({ 
          message: "Invalid SQL query", 
          errors: validation.errors 
        });
      }

      // Execute query
      const result = await databaseService.executeQuery(database.connectionString || "", sql);
      
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
  });

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
      const dashboards = await storage.getDashboards();
      res.json(dashboards);
    } catch (error) {
      res.status(500).json({ message: error instanceof Error ? error.message : 'Unknown error' });
    }
  });

  app.post("/api/dashboards", async (req, res) => {
    try {
      const validatedData = insertDashboardSchema.parse(req.body);
      const dashboard = await storage.createDashboard(validatedData);
      res.json(dashboard);
    } catch (error) {
      res.status(400).json({ message: error.message });
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
  app.post("/api/charts", async (req, res) => {
    try {
      const validatedData = insertChartSchema.parse(req.body);
      const chart = await storage.createChart(validatedData);
      res.json(chart);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });

  app.put("/api/charts/:id", async (req, res) => {
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

  app.delete("/api/charts/:id", async (req, res) => {
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

  const httpServer = createServer(app);
  return httpServer;
}
