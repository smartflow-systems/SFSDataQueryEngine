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
   * Blocks dangerous SQL constructs to prevent SQL injection.
   *
   * Security layers:
   * 1. Whitelist allowed statement types
   * 2. Block dangerous SQL keywords and constructs
   * 3. Block comment syntax
   * 4. Block multiple statements
   * 5. Validate with parameterized queries (enforced by caller)
   */
  private isSafeSqlStatement(sql: string): boolean {
    const normalized = sql.trim().toLowerCase();

    // 1. Only allow SELECT, INSERT, UPDATE, DELETE at the beginning
    if (!/^(select|insert|update|delete)\b/.test(normalized)) return false;

    // 2. Block dangerous SQL keywords that could bypass security
    const dangerousKeywords = [
      'attach', 'detach', 'pragma', 'create', 'drop', 'alter', 'vacuum',
      'load_extension', 'exec', 'execute', 'char', 'nchar',
      'varchar', 'nvarchar', 'into outfile', 'into dumpfile', 'load data',
      'load_file', 'benchmark', 'sleep', 'waitfor', 'delay',
      'shutdown', 'grant', 'revoke', 'backup', 'restore'
    ];

    for (const keyword of dangerousKeywords) {
      if (normalized.includes(keyword)) return false;
    }

    // 3. Block SQL stacked queries and injection patterns
    // Disallow multiple statements by semicolon (no exceptions)
    if (sql.includes(";")) return false;

    // 4. Disallow SQL comments (injection vector)
    if (/--|\/*|\*\/|\/\*|\*\/|#/.test(sql)) return false;

    // 5. Block hex/binary encoding that could hide malicious SQL
    if (/0x[0-9a-f]+/i.test(sql)) return false;

    // 6. Limit UNION usage to prevent blind SQL injection
    // Allow UNION only in SELECT, not in sub-contexts that could exploit it
    const unionCount = (normalized.match(/\bunion\b/g) || []).length;
    if (unionCount > 2) return false; // Max 2 UNIONs for legitimate use cases

    return true;
  }

  /**
   * Executes a SQL query with security validations.
   *
   * Security measures:
   * - SQL structure is validated against whitelist of safe patterns
   * - Dangerous SQL keywords are blocked
   * - User-provided values MUST be passed via params array (parameterized queries)
   * - This prevents SQL injection by separating SQL structure from data
   *
   * @param connectionString - Database connection string
   * @param sql - SQL query structure (validated for safety)
   * @param params - User-provided values (safely bound to query placeholders)
   */
  async executeQuery(connectionString: string, sql: string, params: any[] = []): Promise<QueryResult> {
    const startTime = Date.now();

    try {
      // Validate SQL structure against injection patterns
      if (!this.isSafeSqlStatement(sql)) {
        throw {
          message: "Unsafe SQL statement detected. Only single SELECT, INSERT, UPDATE, DELETE statements are allowed.",
        };
      }

      // Sanitize params array to prevent object injection
      const sanitizedParams = params.map(param => {
        if (typeof param === 'object' && param !== null) {
          // Convert objects to JSON string to prevent query object injection
          return JSON.stringify(param);
        }
        return param;
      });

      const db = await this.getConnection(connectionString);

      return new Promise((resolve, reject) => {
        // For SELECT queries
        // SAFE: Using parameterized query - params are bound safely by SQLite driver
        if (sql.trim().toLowerCase().startsWith('select')) {
          db.all(sql, sanitizedParams, (err, rows) => {
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
          // SAFE: Using parameterized query - params are bound safely by SQLite driver
          const self = this;
          db.run(sql, sanitizedParams, function(err) {
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
              // SAFE: table.name comes from sqlite_master system table, not user input
              // Additionally, validate table name to ensure it's a safe identifier
              const tableName = String(table.name).replace(/[^a-zA-Z0-9_]/g, '');
              db.all(`PRAGMA table_info(${tableName})`, [], (err, columns) => {
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
