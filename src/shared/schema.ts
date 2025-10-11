export interface User {
  id: string;
  username: string;
  password: string;
}

export interface InsertUser {
  username: string;
  password: string;
}

export interface Database {
  id: string;
  name: string;
  type: string;
  connectionString: string | null;
  isActive: boolean;
  createdAt: Date;
}

export interface InsertDatabase {
  name: string;
  type?: string;
  connectionString?: string | null;
  isActive?: boolean;
}

export interface Query {
  id: string;
  name: string | null;
  naturalLanguage: string;
  sqlQuery: string;
  databaseId: string;
  results?: unknown;
  executionTime?: number;
  rowCount?: number;
  isSaved: boolean;
  createdAt?: Date;
}

export interface InsertQuery {
  name?: string | null;
  naturalLanguage: string;
  sqlQuery: string;
  databaseId?: string;
  results?: unknown;
  executionTime?: number;
  rowCount?: number;
  isSaved?: boolean;
}

export interface Dashboard {
  id: string;
  name: string;
  description: string | null;
  layout: unknown;
  isShared: boolean;
  createdAt?: Date;
}

export interface InsertDashboard {
  name: string;
  description?: string | null;
  layout: unknown;
  isShared?: boolean;
}

export interface Chart {
  id: string;
  dashboardId: string | null;
  queryId: string | null;
  type: string;
  config: unknown;
  position: unknown;
  createdAt?: Date;
}

export interface InsertChart {
  dashboardId: string;
  queryId?: string | null;
  type: string;
  config: unknown;
  position: unknown;
}

function ensureObject(value: unknown, label: string): Record<string, unknown> {
  if (typeof value !== "object" || value === null) {
    throw new Error(`Invalid ${label} payload`);
  }

  return value as Record<string, unknown>;
}

function readString(
  obj: Record<string, unknown>,
  key: string,
  { optional = false, allowNull = false }: { optional?: boolean; allowNull?: boolean } = {}
): string | undefined | null {
  if (!(key in obj)) {
    if (optional) return undefined;
    throw new Error(`Missing field: ${key}`);
  }

  const value = obj[key];
  if (value === null) {
    if (allowNull) return null;
    throw new Error(`Field ${key} cannot be null`);
  }

  if (typeof value !== "string") {
    throw new Error(`Field ${key} must be a string`);
  }

  return value;
}

function readBoolean(
  obj: Record<string, unknown>,
  key: string,
  { optional = false }: { optional?: boolean } = {}
): boolean | undefined {
  if (!(key in obj)) {
    if (optional) return undefined;
    throw new Error(`Missing field: ${key}`);
  }

  const value = obj[key];
  if (typeof value !== "boolean") {
    throw new Error(`Field ${key} must be a boolean`);
  }

  return value;
}

function readUnknown(
  obj: Record<string, unknown>,
  key: string,
  { optional = false }: { optional?: boolean } = {}
): unknown {
  if (!(key in obj)) {
    if (optional) return undefined;
    throw new Error(`Missing field: ${key}`);
  }

  return obj[key];
}

function buildObject<T extends Record<string, unknown | undefined | null>>(values: T): T {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(values)) {
    if (value !== undefined) {
      result[key] = value;
    }
  }

  return result as T;
}

export const insertUserSchema = {
  parse(value: unknown): InsertUser {
    const obj = ensureObject(value, "user");
    const username = readString(obj, "username");
    const password = readString(obj, "password");

    return { username: username!, password: password! };
  }
};

export const insertDatabaseSchema = {
  parse(value: unknown): InsertDatabase {
    const obj = ensureObject(value, "database");
    const name = readString(obj, "name");
    const type = readString(obj, "type", { optional: true });
    const connectionString = readString(obj, "connectionString", { optional: true, allowNull: true });
    const isActive = readBoolean(obj, "isActive", { optional: true });

    return buildObject({
      name: name!,
      type: type ?? undefined,
      connectionString: connectionString ?? undefined,
      isActive,
    });
  }
};

export const insertQuerySchema = {
  parse(value: unknown): InsertQuery {
    const obj = ensureObject(value, "query");
    const naturalLanguage = readString(obj, "naturalLanguage");
    const sqlQuery = readString(obj, "sqlQuery", { optional: true });
    const databaseId = readString(obj, "databaseId", { optional: true });
    const name = readString(obj, "name", { optional: true, allowNull: true });
    const isSaved = readBoolean(obj, "isSaved", { optional: true });
    const results = readUnknown(obj, "results", { optional: true });
    const executionTime = obj.executionTime;
    const rowCount = obj.rowCount;

    if (executionTime !== undefined && typeof executionTime !== "number") {
      throw new Error("Field executionTime must be a number");
    }

    if (rowCount !== undefined && typeof rowCount !== "number") {
      throw new Error("Field rowCount must be a number");
    }

    return buildObject({
      naturalLanguage: naturalLanguage!,
      sqlQuery: sqlQuery ?? "",
      databaseId: databaseId ?? undefined,
      name,
      isSaved,
      results,
      executionTime,
      rowCount,
    });
  }
};

export const insertDashboardSchema = {
  parse(value: unknown): InsertDashboard {
    const obj = ensureObject(value, "dashboard");
    const name = readString(obj, "name");
    const description = readString(obj, "description", { optional: true, allowNull: true });
    const layout = readUnknown(obj, "layout");
    const isShared = readBoolean(obj, "isShared", { optional: true });

    return buildObject({
      name: name!,
      description: description ?? null,
      layout,
      isShared,
    });
  }
};

export const insertChartSchema = {
  parse(value: unknown): InsertChart {
    const obj = ensureObject(value, "chart");
    const dashboardId = readString(obj, "dashboardId");
    const queryId = readString(obj, "queryId", { optional: true, allowNull: true });
    const type = readString(obj, "type");
    const config = readUnknown(obj, "config");
    const position = readUnknown(obj, "position");

    return {
      dashboardId: dashboardId!,
      queryId: queryId ?? null,
      type: type!,
      config,
      position,
    };
  }
};
