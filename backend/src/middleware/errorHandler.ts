import { Request, Response, NextFunction } from "express";
import { logger } from "../logger";

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  _next: NextFunction
) {
  logger.error({ err, path: req.path, method: req.method }, "Unhandled error");

  if (err.statusCode) {
    return res.status(err.statusCode).json({ error: err.message });
  }

  res.status(500).json({ error: "Internal Server Error" });
}
