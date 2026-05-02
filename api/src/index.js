import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

import projectsRouter from "./routes/projects.js";
import experienceRouter from "./routes/experience.js";
import contactRouter from "./routes/contact.js";
import adminRouter from "./routes/admin.js";

const app = express();
const PORT = process.env.PORT || 3000;

// ── Security ─────────────────────────────────────────────────────────────────
app.use(helmet());
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGIN || "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

// ── Rate limiting ─────────────────────────────────────────────────────────────
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
const contactLimiter = rateLimit({ windowMs: 60 * 60 * 1000, max: 5 }); // 5/hr on contact

app.use(limiter);
app.use(express.json());

// ── Routes ────────────────────────────────────────────────────────────────────
app.use("/projects", projectsRouter);
app.use("/experience", experienceRouter);
app.use("/contact", contactLimiter, contactRouter);
app.use("/admin", adminRouter);

app.get("/health", (_req, res) => res.json({ status: "ok" }));

// ── Error handler ─────────────────────────────────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong" });
});

app.listen(PORT, () => console.log(`API running on port ${PORT}`));
