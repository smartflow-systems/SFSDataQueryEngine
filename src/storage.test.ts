import { strict as assert } from "node:assert";
import { MemStorage } from "./storage.js";
import express from "express";
import type { AddressInfo } from "node:net";

const storage = new MemStorage();

const inactiveDb = await storage.createDatabase({
  name: "Inactive database",
  type: "sqlite",
  connectionString: null,
  isActive: false,
});

assert.equal(
  inactiveDb.isActive,
  false,
  "createDatabase should preserve an explicit false isActive flag",
);

const defaultDb = await storage.createDatabase({
  name: "Default active database",
});

assert.equal(
  defaultDb.isActive,
  true,
  "createDatabase should default isActive to true when omitted",
);

const apiStorage = new MemStorage();

const app = express();
app.use(express.json());

app.post("/api/databases", async (req, res) => {
  const created = await apiStorage.createDatabase(req.body);
  res.json(created);
});

app.get("/api/databases", async (_req, res) => {
  const databases = await apiStorage.getDatabases();
  res.json(databases);
});

const server = await new Promise<ReturnType<typeof app.listen>>(resolve => {
  const instance = app.listen(0, () => resolve(instance));
});

try {
  const { port } = server.address() as AddressInfo;
  const baseUrl = `http://127.0.0.1:${port}`;

  const response = await fetch(`${baseUrl}/api/databases`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      name: "Inactive API Database",
      type: "sqlite",
      connectionString: null,
      isActive: false,
    }),
  });

  assert.equal(response.ok, true, "POST /api/databases should succeed");

  const created = await response.json() as { id: string };

  const listResponse = await fetch(`${baseUrl}/api/databases`);
  assert.equal(listResponse.ok, true, "GET /api/databases should succeed");

  const databases = await listResponse.json() as Array<{ id: string; isActive: boolean }>;
  const createdDatabase = databases.find(db => db.id === created.id);

  assert.ok(createdDatabase, "Created database should be returned by GET /api/databases");
  assert.equal(
    createdDatabase?.isActive,
    false,
    "GET /api/databases should return the stored isActive value",
  );
} finally {
  await new Promise(resolve => server.close(resolve));
}
