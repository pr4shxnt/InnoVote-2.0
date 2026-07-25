import bcrypt from "bcrypt";
import type { Request, Response } from "express";
import { env, isProduction } from "../config/env.js";
import { ApiError } from "../middleware/errorHandler.js";
import { ADMIN_SESSION_COOKIE, ADMIN_SESSION_MAX_AGE_MS, signAdminToken } from "../services/jwtService.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { adminLoginBodySchema } from "../utils/validation.js";

export const adminLoginHandler = asyncHandler(async (req: Request, res: Response) => {
  const { username, password } = adminLoginBodySchema.parse(req.body);

  const isMatch = username === env.ADMIN_USERNAME && (await bcrypt.compare(password, env.ADMIN_PASSWORD_HASH));
  if (!isMatch) {
    throw new ApiError(401, "Invalid admin credentials.");
  }

  const token = signAdminToken({ sub: username });

  res.cookie(ADMIN_SESSION_COOKIE, token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: "strict",
    maxAge: ADMIN_SESSION_MAX_AGE_MS,
  });

  res.json({ success: true, admin: { username } });
});

export const adminLogoutHandler = (_req: Request, res: Response): void => {
  res.clearCookie(ADMIN_SESSION_COOKIE);
  res.json({ success: true, message: "Logged out." });
};

export const adminMeHandler = (req: Request, res: Response): void => {
  res.json({ success: true, admin: req.admin });
};
