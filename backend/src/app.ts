import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import { logger } from "./logger";
import flagsRoutes from "./routes/flags.routes";
import { errorHandler } from "./middleware/errorHandler";

dotenv.config();

export const app = express();

// Middleware
app.use(cors({
  origin: "*",
}));

app.use(express.json());

app.use("/flags", flagsRoutes);

app.use(errorHandler);

// Simple request logger
app.use((req, _res, next) => {
  logger.info({ method: req.method, path: req.path }, "Incoming request");
  next();
});

// Health check route
app.get("/health", (_req, res) => {
  res.json({ status: "ok", uptime: process.uptime() });
});
