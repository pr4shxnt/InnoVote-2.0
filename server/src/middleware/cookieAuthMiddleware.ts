import type { NextFunction, Request, Response } from "express";
import { ApiError } from "./errorHandler.js";
import { VOTER_SESSION_COOKIE, verifyVoterToken } from "../services/jwtService.js";

export function cookieAuthMiddleware(req: Request, _res: Response, next: NextFunction): void {
  const token = req.cookies?.[VOTER_SESSION_COOKIE];
  if (!token) {
    next(new ApiError(401, "Not authenticated."));
    return;
  }

  try {
    const payload = verifyVoterToken(token);
    req.user = { id: payload.sub, phoneNumber: payload.phoneNumber, sessionExpiresAt: payload.exp * 1000 };
    next();
  } catch {
    next(new ApiError(401, "Session expired or invalid."));
  }
}
