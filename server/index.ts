import express from "express";
import { execFile } from "node:child_process";
import * as path from "node:path";
import * as fs from "node:fs";

import { registerRoutes } from "./routes";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ ok: true, app: "SFSDataQueryEngine" });
});

// Force sync from GitHub (OVERWRITES)
app.post("/gh-sync", (req, res) => {
  const ok = req.get("authorization") === `Bearer ${process.env.SYNC_TOKEN}`;
  if (!ok) return res.status(401).json({ ok: false });
  const ref = (req.body?.ref as string) || "main";
  execFile("bash", ["scripts/sync.sh", ref], (err, out, errout) =>
    err ? res.status(500).json({ ok: false, err: String(errout || err) })
        : res.json({ ok: true, ref, out })
  );
});

// API routes
registerRoutes(app);

// Static serve in prod if /dist exists
const dist = path.resolve("dist");
if (fs.existsSync(dist)) {
  app.use(express.static(dist));
  app.get("*", (_q, r) => r.sendFile(path.join(dist, "index.html")));
}
// SmartFlow Systems — SFSDataQueryEngine
import 'dotenv/config'
import express, { type Request, type Response, type NextFunction } from 'express'
import type { AddressInfo } from 'node:net'
import { createServer } from "http";
import { setupVite, serveStatic, log } from "./vite.js";
import { registerRoutes } from "./routes.js";

const app = express();
const server = createServer(app);

// Trust proxy for Replit environment
app.set('trust proxy', 1);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/health", (_, res) => res.json({ ok: true }));
registerRoutes(app);

const PORT = Number(process.env.PORT) || 5000;
const isProduction = process.env.NODE_ENV === "production";

async function startServer() {
  if (isProduction) {
    serveStatic(app);
  } else {
    await setupVite(app, server);
  }

  server.listen(PORT, "0.0.0.0", () => {
    log(`Server running on port ${PORT} in ${isProduction ? 'production' : 'development'} mode`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
