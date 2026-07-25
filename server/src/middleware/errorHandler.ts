import type { NextFunction, Request, Response } from "express";
import { MulterError } from "multer";
import { ZodError } from "zod";

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export function notFoundHandler(req: Request, res: Response): void {
  res.status(404).json({ success: false, error: `Route not found: ${req.method} ${req.path}` });
}

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction): void {
  if (err instanceof ApiError) {
    res.status(err.status).json({ success: false, error: err.message });
    return;
  }

  if (err instanceof ZodError) {
    res.status(400).json({ success: false, error: err.issues[0]?.message ?? "Invalid request." });
    return;
  }

  if (err instanceof MulterError) {
    const message = err.code === "LIMIT_FILE_SIZE" ? "Image must be smaller than 5MB." : err.message;
    res.status(400).json({ success: false, error: message });
    return;
  }

  if (typeof err === "object" && err !== null && "code" in err && (err as { code: unknown }).code === 11000) {
    res.status(409).json({ success: false, error: "Conflict: this action was already performed." });
    return;
  }

  console.error("[unhandled error]", err);
  res.status(500).json({ success: false, error: "Internal server error" });
}
