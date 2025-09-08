import { 
  type User, 
  type InsertUser, 
  type Database, 
  type InsertDatabase,
  type Query,
  type InsertQuery,
  type Dashboard,
  type InsertDashboard,
  type Chart,
  type InsertChart
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Database methods
  getDatabases(): Promise<Database[]>;
  getDatabase(id: string): Promise<Database | undefined>;
  createDatabase(database: InsertDatabase): Promise<Database>;
  updateDatabase(id: string, updates: Partial<InsertDatabase>): Promise<Database | undefined>;
  deleteDatabase(id: string): Promise<boolean>;

  // Query methods
  getQueries(): Promise<Query[]>;
  getQuery(id: string): Promise<Query | undefined>;
  getQueriesByDatabase(databaseId: string): Promise<Query[]>;
  getSavedQueries(): Promise<Query[]>;
  getRecentQueries(limit?: number): Promise<Query[]>;
  createQuery(query: InsertQuery): Promise<Query>;
  updateQuery(id: string, updates: Partial<Query>): Promise<Query | undefined>;
  deleteQuery(id: string): Promise<boolean>;

  // Dashboard methods
  getDashboards(): Promise<Dashboard[]>;
  getDashboard(id: string): Promise<Dashboard | undefined>;
  createDashboard(dashboard: InsertDashboard): Promise<Dashboard>;
  updateDashboard(id: string, updates: Partial<InsertDashboard>): Promise<Dashboard | undefined>;
  deleteDashboard(id: string): Promise<boolean>;

  // Chart methods
  getCharts(): Promise<Chart[]>;
  getChart(id: string): Promise<Chart | undefined>;
  getChartsByDashboard(dashboardId: string): Promise<Chart[]>;
  createChart(chart: InsertChart): Promise<Chart>;
  updateChart(id: string, updates: Partial<InsertChart>): Promise<Chart | undefined>;
  deleteChart(id: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User> = new Map();
  private databases: Map<string, Database> = new Map();
  private queries: Map<string, Query> = new Map();
  private dashboards: Map<string, Dashboard> = new Map();
  private charts: Map<string, Chart> = new Map();

  constructor() {
    // Initialize with default SQLite database
    const defaultDb: Database = {
      id: randomUUID(),
      name: "main.db",
      type: "sqlite",
      connectionString: "./data/main.db",
      isActive: true,
      createdAt: new Date(),
    };
    this.databases.set(defaultDb.id, defaultDb);
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      id,
      username: insertUser.username,
      password: insertUser.password
    };
    this.users.set(id, user);
    return user;
  }

  // Database methods
  async getDatabases(): Promise<Database[]> {
    return Array.from(this.databases.values());
  }

  async getDatabase(id: string): Promise<Database | undefined> {
    return this.databases.get(id);
  }

  async createDatabase(insertDatabase: InsertDatabase): Promise<Database> {
    const id = randomUUID();
    const database: Database = { 
      id,
      name: insertDatabase.name,
      type: insertDatabase.type || 'sqlite',
      connectionString: insertDatabase.connectionString || null,
      isActive: insertDatabase.isActive || true,
      createdAt: new Date()
    };
    this.databases.set(id, database);
    return database;
  }

  async updateDatabase(id: string, updates: Partial<InsertDatabase>): Promise<Database | undefined> {
    const existing = this.databases.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...updates };
    this.databases.set(id, updated);
    return updated;
  }

  async deleteDatabase(id: string): Promise<boolean> {
    return this.databases.delete(id);
  }

  // Query methods
  async getQueries(): Promise<Query[]> {
    return Array.from(this.queries.values()).sort((a, b) => 
      (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0)
    );
  }

  async getQuery(id: string): Promise<Query | undefined> {
    return this.queries.get(id);
  }

  async getQueriesByDatabase(databaseId: string): Promise<Query[]> {
    return Array.from(this.queries.values()).filter(q => q.databaseId === databaseId);
  }

  async getSavedQueries(): Promise<Query[]> {
    return Array.from(this.queries.values()).filter(q => q.isSaved);
  }

  async getRecentQueries(limit: number = 10): Promise<Query[]> {
    return Array.from(this.queries.values())
      .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0))
      .slice(0, limit);
  }

  async createQuery(insertQuery: InsertQuery): Promise<Query> {
    const id = randomUUID();
    const query: Query = { 
      id,
      name: insertQuery.name || null,
      naturalLanguage: insertQuery.naturalLanguage,
      sqlQuery: insertQuery.sqlQuery,
      databaseId: insertQuery.databaseId || null,
      results: null,
      executionTime: null,
      rowCount: null,
      isSaved: insertQuery.isSaved || false,
      createdAt: new Date()
    };
    this.queries.set(id, query);
    return query;
  }

  async updateQuery(id: string, updates: Partial<Query>): Promise<Query | undefined> {
    const existing = this.queries.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...updates };
    this.queries.set(id, updated);
    return updated;
  }

  async deleteQuery(id: string): Promise<boolean> {
    return this.queries.delete(id);
  }

  // Dashboard methods
  async getDashboards(): Promise<Dashboard[]> {
    return Array.from(this.dashboards.values());
  }

  async getDashboard(id: string): Promise<Dashboard | undefined> {
    return this.dashboards.get(id);
  }

  async createDashboard(insertDashboard: InsertDashboard): Promise<Dashboard> {
    const id = randomUUID();
    const dashboard: Dashboard = { 
      id,
      name: insertDashboard.name,
      description: insertDashboard.description || null,
      layout: insertDashboard.layout,
      isShared: insertDashboard.isShared || false,
      createdAt: new Date()
    };
    this.dashboards.set(id, dashboard);
    return dashboard;
  }

  async updateDashboard(id: string, updates: Partial<InsertDashboard>): Promise<Dashboard | undefined> {
    const existing = this.dashboards.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...updates };
    this.dashboards.set(id, updated);
    return updated;
  }

  async deleteDashboard(id: string): Promise<boolean> {
    return this.dashboards.delete(id);
  }

  // Chart methods
  async getCharts(): Promise<Chart[]> {
    return Array.from(this.charts.values());
  }

  async getChart(id: string): Promise<Chart | undefined> {
    return this.charts.get(id);
  }

  async getChartsByDashboard(dashboardId: string): Promise<Chart[]> {
    return Array.from(this.charts.values()).filter(c => c.dashboardId === dashboardId);
  }

  async createChart(insertChart: InsertChart): Promise<Chart> {
    const id = randomUUID();
    const chart: Chart = { 
      id,
      dashboardId: insertChart.dashboardId || null,
      queryId: insertChart.queryId || null,
      type: insertChart.type,
      config: insertChart.config,
      position: insertChart.position,
      createdAt: new Date()
    };
    this.charts.set(id, chart);
    return chart;
  }

  async updateChart(id: string, updates: Partial<InsertChart>): Promise<Chart | undefined> {
    const existing = this.charts.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...updates };
    this.charts.set(id, updated);
    return updated;
  }

  async deleteChart(id: string): Promise<boolean> {
    return this.charts.delete(id);
  }
}

export const storage = new MemStorage();
