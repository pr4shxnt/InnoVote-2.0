import type { NextFunction, Request, Response } from "express";
import { ApiError } from "./errorHandler.js";
import { ADMIN_SESSION_COOKIE, verifyAdminToken } from "../services/jwtService.js";

export function adminAuthMiddleware(req: Request, _res: Response, next: NextFunction): void {
  const token = req.cookies?.[ADMIN_SESSION_COOKIE];
  if (!token) {
    next(new ApiError(401, "Admin authentication required."));
    return;
  }

  try {
    const payload = verifyAdminToken(token);
    req.admin = { username: payload.sub };
    next();
  } catch {
    next(new ApiError(401, "Admin session expired or invalid."));
  }
}
