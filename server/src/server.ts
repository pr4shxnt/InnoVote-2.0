import { createRequire } from "node:module";
import cookieParser from "cookie-parser";
import cors from "cors";
import express, { type RequestHandler } from "express";
import { connectDb } from "./config/db.js";
import { env } from "./config/env.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";
import { apiRouter } from "./routes/index.js";

// helmet's package.json "exports" map resolves differently across pnpm versions under
// TS's NodeNext module resolution, which can pick a declaration file TS reads as
// non-callable (works locally, fails on Vercel's pnpm). Loading it via require sidesteps
// that type resolution entirely — the runtime behavior is identical either way.
const require = createRequire(import.meta.url);
const helmet: (options?: Record<string, unknown>) => RequestHandler = require("helmet");

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: env.CLIENT_ORIGIN,
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

app.get("/health", (_req, res) => {
  res.json({ success: true, status: "ok" });
});

app.use("/api/v1", apiRouter);

app.use(notFoundHandler);
app.use(errorHandler);

async function start(): Promise<void> {
  await connectDb();
  app.listen(env.PORT, () => {
    console.log(`[server] listening on port ${env.PORT}`);
  });
}

start().catch((err) => {
  console.error("[server] failed to start", err);
  process.exit(1);
});
