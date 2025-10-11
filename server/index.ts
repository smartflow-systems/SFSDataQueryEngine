import express from "express";
import { exec } from "node:child_process";
import * as path from "node:path";
import * as fs from "node:fs";
import rateLimit from "express-rate-limit";
import { registerRoutes } from "./routes";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ ok: true, app: "SFSDataQueryEngine" });
});

// Rate limiter for sync endpoint: 5 requests per minute per IP
const syncLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5, // limit each IP to 5 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
});

// Force sync from GitHub (OVERWRITES)
app.post("/gh-sync", syncLimiter, (req, res) => {
  const ok = req.get("authorization") === `Bearer ${process.env.SYNC_TOKEN}`;
  if (!ok) return res.status(401).json({ ok: false });
  const ref = (req.body?.ref as string) || "main";
  exec(`bash scripts/sync.sh ${ref}`, (err, out, errout) =>
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

const port = Number.parseInt(process.env.PORT || "5000", 10);
const server = app.listen(port, "0.0.0.0", () => console.log("serving on", port));

export { app, server };
