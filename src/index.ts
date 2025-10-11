import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import { prisma } from "./database.js";

const app = express();
app.use(express.json());
app.use(cors({ origin: process.env.CORS_ORIGIN?.split(",") ?? "*" }));
app.use(rateLimit({ windowMs: 60_000, limit: 60 }));

app.get("/health", (_req, res) => res.json({ ok: true }));

// Minimal v0.2 demo: increment a counter by writing a Boost row
app.post("/api/boost", async (_req, res) => {
  await prisma.boost.create({ data: {} });
  const count = await prisma.boost.count();
  res.json({ ok: true, count });
});

const PORT = Number(process.env.PORT || 5000);
app.listen(PORT, "0.0.0.0", () => console.log(`SFS DQE up on :${PORT}`));
