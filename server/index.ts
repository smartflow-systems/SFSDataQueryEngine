import express from "express";
import { exec } from "node:child_process";
import * as path from "node:path";
import * as fs from "node:fs";

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
  exec(`bash scripts/sync.sh ${ref}`, (err, out, errout) =>
    err ? res.status(500).json({ ok: false, err: String(errout || err) })
        : res.json({ ok: true, ref, out })
  );
});

// Static serve in prod if /dist exists
const dist = path.resolve("dist");
if (fs.existsSync(dist)) {
  app.use(express.static(dist));
  app.get("*", (_q, r) => r.sendFile(path.join(dist, "index.html")));
}

const port = parseInt(process.env.PORT || "5000", 10);
app.listen(port, "0.0.0.0", () => console.log("serving on", port));
