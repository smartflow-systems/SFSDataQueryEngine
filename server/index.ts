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

// Optional app modules (keep these if present in your repo)
import { registerRoutes } from './routes'
import { setupVite, serveStatic, log } from './vite'

const app = express()
app.set('trust proxy', true)
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// Health
app.get('/health', (_req: Request, res: Response) => res.json({ ok: true }))

// Attach routes if available
try { registerRoutes?.(app) } catch { /* routes not present */ }

// Central error handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  const status = Number(err?.status || err?.statusCode || 500)
  const message = String(err?.message || 'Internal Server Error')
  try { log?.(`ERROR ${status}: ${message}`) } catch {}
  if (!res.headersSent) res.status(status).json({ message })
})

// Respect PORT env; treat 0 as "pick any free port"
const envPort = process.env.PORT
const port = envPort !== undefined ? Number(envPort) : 5000

const server = app.listen(port, '0.0.0.0', () => {
  const addr = server.address() as AddressInfo | null
  const shown = typeof addr === 'object' && addr ? addr.port : port
  try { log?.(`serving on port ${shown}`) } catch { console.log(`serving on port ${shown}`) }
})

// Report actual bound port (useful when PORT=0)
app.get('/_port', (_req: Request, res: Response) => {
  const addr = server.address() as AddressInfo | null
  res.json({ port: typeof addr === 'object' && addr ? addr.port : null })
})

// Dev = Vite middleware; Prod = static
;(async () => {
  try {
    if (app.get('env') === 'development') {
      await setupVite?.(app, server)
    } else {
      serveStatic?.(app)
    }
  } catch (e) {
    try { log?.('vite/static setup failed: ' + (e as Error).message) } catch {}
  }
})().catch(() => void 0)

// Graceful shutdown
for (const sig of ['SIGINT','SIGTERM'] as const) {
  process.on(sig, () => {
    try { console.log(`received ${sig}, shutting down…`) } catch {}
    server.close(() => process.exit(0))
    setTimeout(() => process.exit(0), 3000).unref()
  })
}

export default app
