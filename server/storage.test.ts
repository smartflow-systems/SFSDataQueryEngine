import { strict as assert } from "node:assert";
import { MemStorage } from "./storage";

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
