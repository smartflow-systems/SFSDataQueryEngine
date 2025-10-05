declare module "sqlite3" {
  type Callback<T = unknown> = (err: Error | null, result?: T) => void;

  export interface RunResult {
    changes?: number;
    lastID?: number;
  }

  export class Database {
    constructor(filename: string, callback?: Callback<void>);
    all<T = any>(sql: string, params: any[], callback: Callback<T[]>): void;
    get<T = any>(sql: string, params: any[], callback: Callback<T>): void;
    run(sql: string, params: any[], callback: (this: RunResult, err: Error | null) => void): void;
    close(callback: Callback<void>): void;
  }

  export interface Sqlite3Module {
    Database: typeof Database;
    verbose(): Sqlite3Module;
  }

  const sqlite3: Sqlite3Module;
  export default sqlite3;
}
