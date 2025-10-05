import { test } from "node:test";
import assert from "node:assert/strict";
import express from "express";
import type { AddressInfo } from "node:net";

import { registerRoutes } from "../server/routes";

function startAppServer(app: express.Express) {
  return new Promise<ReturnType<typeof app.listen>>((resolve, reject) => {
    const server = app.listen(0, "127.0.0.1", () => resolve(server));
    server.on("error", reject);
  });
}

test("POST /api/databases preserves explicit false isActive", async t => {
  const app = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  registerRoutes(app);

  const server = await startAppServer(app);
  t.after(() => new Promise<void>((resolve, reject) => {
    server.close(error => (error ? reject(error) : resolve()));
  }));

  const { port } = server.address() as AddressInfo;
  const baseUrl = `http://127.0.0.1:${port}`;

  const createResponse = await fetch(`${baseUrl}/api/databases`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      name: "Inactive database",
      type: "sqlite",
      isActive: false,
    }),
  });

  assert.strictEqual(createResponse.status, 200);
  const createdDatabase = await createResponse.json();
  assert.strictEqual(createdDatabase.isActive, false);

  const listResponse = await fetch(`${baseUrl}/api/databases`);
  assert.strictEqual(listResponse.status, 200);

  const databases = await listResponse.json();
  const storedDatabase = Array.isArray(databases)
    ? databases.find((database: any) => database.id === createdDatabase.id)
    : undefined;

  assert.ok(storedDatabase, "Created database should be returned by /api/databases");
  assert.strictEqual(storedDatabase?.isActive, false);
});
