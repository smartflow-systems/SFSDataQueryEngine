import sqlite3 from "sqlite3";
import path from "path";
import fs from "fs";
import type { Database as SqliteDatabase } from "sqlite3";

const sqlite = sqlite3.verbose();

type Database = SqliteDatabase;

export interface QueryResult {
  rows: any[];
  columns: string[];
  rowCount: number;
  executionTime: number;
}

export interface QueryError {
  message: string;
  code?: string;
  position?: number;
}

export class DatabaseService {
  private connections: Map<string, SqliteDatabase> = new Map();

  // Only allow single-statement SELECT queries (no compound, no batch, no data modification)
  private isSafeSelectQuery(sql: string): boolean {
    // Remove leading/trailing whitespace, lower-case for easier checking
    const text = sql.trim().toLowerCase();
    // Only allow queries that start with "select" and do not contain dangerous stuff
    if (!text.startsWith("select")) return false;
    // Disallow multiple statements or special SQL injection vectors—very strict!
    if (text.includes(";")) return false;
    if (text.includes("--")) return false;
    if (text.includes("/*") || text.includes("*/")) return false;
    // Disallow nested data modification keywords
    const forbidden = ["insert", "update", "delete", "drop", "alter", "truncate", "create", "replace", "attach", "detach", "pragma"];
    for (const word of forbidden) {
      // match as a word
      if (new RegExp("\\b" + word + "\\b", "i").test(text)) return false;
    }
    return true;
  }

  async executeQuery(connectionString: string, sql: string, params: any[] = []): Promise<QueryResult> {
    const startTime = Date.now();
    
    try {
      // Security: Only allow safe SELECT queries from untrusted sources (users)
      if (!this.isSafeSelectQuery(sql)) {
        throw this.formatError({
          message: "Only single SELECT queries are allowed from the API.",
          code: "FORBIDDEN_SQL"
        });
      }
      const db = await this.getConnection(connectionString);
      
      return new Promise((resolve, reject) => {
        // For SELECT queries
        db.all(sql, params, (err, rows) => {
          if (err) {
            reject(this.formatError(err));
            return;
          }
          
          const columns = rows && rows.length > 0 ? Object.keys(rows[0]) : [];
          const executionTime = Date.now() - startTime;
          
          resolve({
            rows: rows || [],
            columns,
            rowCount: rows?.length || 0,
            executionTime
          });
        });
      });
    } catch (error) {
      throw this.formatError(error);
    }
  }

  async getTableSchema(connectionString: string): Promise<{
    tables: Array<{
      name: string;
      columns: Array<{
        name: string;
        type: string;
        nullable: boolean;
        primaryKey: boolean;
      }>;
    }>;
  }> {
    try {
      const db = await this.getConnection(connectionString);
      
      return new Promise((resolve, reject) => {
        // Get all table names
        db.all(
          "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'",
          [],
          (err, tables) => {
            if (err) {
              reject(this.formatError(err));
              return;
            }

            if (!tables || tables.length === 0) {
              resolve({ tables: [] });
              return;
            }

            let completedTables = 0;
            const tableInfo: any[] = [];

            tables.forEach((table: any) => {
              db.all(`PRAGMA table_info(${table.name})`, [], (err, columns) => {
                if (err) {
                  reject(this.formatError(err));
                  return;
                }

                tableInfo.push({
                  name: table.name,
                  columns: (columns || []).map((col: any) => ({
                    name: col.name,
                    type: col.type,
                    nullable: !col.notnull,
                    primaryKey: !!col.pk
                  }))
                });

                completedTables++;
                if (completedTables === tables.length) {
                  resolve({ tables: tableInfo });
                }
              });
            });
          }
        );
      });
    } catch (error) {
      throw this.formatError(error);
    }
  }

  async testConnection(connectionString: string): Promise<boolean> {
    try {
      const db = await this.getConnection(connectionString);
      return new Promise((resolve) => {
        db.get("SELECT 1 as test", [], (err) => {
          resolve(!err);
        });
      });
    } catch {
      return false;
    }
  }

  private async getConnection(connectionString: string): Promise<SqliteDatabase> {
    if (this.connections.has(connectionString)) {
      return this.connections.get(connectionString)!;
    }

    // Ensure directory exists
    const dbDir = path.dirname(connectionString);
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
    }

    return new Promise((resolve, reject) => {
      const db = new sqlite.Database(connectionString, (err) => {
        if (err) {
          reject(this.formatError(err));
          return;
        }
        
        this.connections.set(connectionString, db);
        resolve(db);
      });
    });
  }

  private formatError(error: any): QueryError {
    return {
      message: error.message || "Database query failed",
      code: error.code,
      position: error.position
    };
  }

  async closeAllConnections(): Promise<void> {
    const promises = Array.from(this.connections.values()).map(db => 
      new Promise<void>((resolve) => {
        db.close((err) => {
          if (err) console.error("Error closing database:", err);
          resolve();
        });
      })
    );
    
    await Promise.all(promises);
    this.connections.clear();
  }
}

export const databaseService = new DatabaseService();
