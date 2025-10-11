<<<<<<< HEAD
import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
=======
import express from "express";
import { exec } from "node:child_process";
import * as path from "node:path";
import * as fs from "node:fs";
import rateLimit from "express-rate-limit";
import { registerRoutes } from "./routes";
>>>>>>> 9cdd3c5756b8b1b37575aa0619b70d4cb07e67e6

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

<<<<<<< HEAD
(async () => {
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on the port specified in the environment variable PORT
  // Other ports are firewalled. Default to 5000 if not specified.
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = parseInt(process.env.PORT || '5000', 10);
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
  });
})();
=======
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
>>>>>>> 9cdd3c5756b8b1b37575aa0619b70d4cb07e67e6
