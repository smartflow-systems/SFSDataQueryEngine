// SmartFlow Systems — SFSDataQueryEngine
import 'dotenv/config'
import express, { type Request, type Response, type NextFunction } from 'express'
import type { AddressInfo } from 'node:net'
import { createServer } from "http";
import { setupVite, serveStatic, log } from "./vite.js";
import { registerRoutes } from "./routes.js";
import rateLimit from "express-rate-limit";

const app = express();
const server = createServer(app);

// Trust proxy for Replit environment
app.set('trust proxy', 1);

// Security headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  next();
});

// Rate limiting for API endpoints
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: { error: "Too many requests, please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});

// Stricter rate limit for query execution
const queryLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 20, // Limit to 20 queries per minute
  message: { error: "Too many queries, please slow down." },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api', apiLimiter);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: false, limit: '10mb' }));

app.get("/health", (_, res) => res.json({ ok: true }));
registerRoutes(app, { queryLimiter });

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
