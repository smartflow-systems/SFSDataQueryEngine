export interface RunContext {
  changes: number;
}

export type Callback<T = any> = (err: Error | null, result?: T) => void;

export class Database {
  constructor(filename: string, callback?: Callback<void>);
  all<T = any>(sql: string, params: any[], callback: Callback<T[]>): void;
  run(sql: string, params: any[], callback?: (this: RunContext, err: Error | null) => void): void;
  get<T = any>(sql: string, params: any[], callback: Callback<T>): void;
  close(callback?: Callback<void>): void;
}

export function verbose(): { Database: typeof Database };

declare const sqlite3: {
  Database: typeof Database;
  verbose: typeof verbose;
};

export default sqlite3;
