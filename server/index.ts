import express from "express";
import { createServer } from "http";
import { setupVite, serveStatic, log } from "./vite.js";
import { registerRoutes } from "./routes.js";

const app = express();
const server = createServer(app);

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
