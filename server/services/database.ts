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

  /**
   * Checks if the SQL statement is safe to execute.
   * Only allows single SELECT, INSERT, UPDATE, DELETE statements.
   * Disallows semicolons except possibly at the end, and comments.
   */
  private isSafeSqlStatement(sql: string): boolean {
    const normalized = sql.trim().toLowerCase();
    // Only allow SELECT, INSERT, UPDATE, DELETE at the beginning
    if (!/^(select|insert|update|delete)\b/.test(normalized)) return false;
    // Disallow multiple statements by semicolon (except possibly at end, but safest is fully disallow)
    if (sql.includes(";")) return false;
    // Disallow SQL comments
    if (/--|\/*|\*\//.test(sql)) return false;
    return true;
  }

  async executeQuery(connectionString: string, sql: string, params: any[] = []): Promise<QueryResult> {
    const startTime = Date.now();
    
    try {
      if (!this.isSafeSqlStatement(sql)) {
        throw {
          message: "Unsafe SQL statement detected. Only single SELECT, INSERT, UPDATE, DELETE statements are allowed.",
        };
      }
      const db = await this.getConnection(connectionString);
      
      return new Promise((resolve, reject) => {
        // For SELECT queries
        if (sql.trim().toLowerCase().startsWith('select')) {
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
        } else {
          // For INSERT, UPDATE, DELETE queries
          const self = this;
          db.run(sql, params, function(err) {
            if (err) {
              reject(self.formatError(err));
              return;
            }
            
            const executionTime = Date.now() - startTime;
            
            resolve({
              rows: [],
              columns: [],
              rowCount: this.changes || 0,
              executionTime
            });
          });
        }
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
