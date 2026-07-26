import type { Request, Response } from "express";
import { isProduction } from "../config/env.js";
import { UserModel } from "../models/User.js";
import { normalizePhoneNumber } from "../services/hashService.js";
import {
  VOTER_SESSION_COOKIE,
  VOTER_SESSION_MAX_AGE_MS,
  signVoterToken,
} from "../services/jwtService.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { loginBodySchema } from "../utils/validation.js";

export const loginHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const { phoneNumber, displayName } = loginBodySchema.parse(req.body);
    const normalizedPhoneNumber = normalizePhoneNumber(phoneNumber);

    let user;
    try {
      user = await UserModel.create({
        phoneNumber: normalizedPhoneNumber,
        displayName: displayName,
      });
    } catch (err) {
      if (
        typeof err === "object" &&
        err !== null &&
        "code" in err &&
        (err as { code: unknown }).code === 11000
      ) {
        // Race: another concurrent insert won — just fetch the existing document.
        user = await UserModel.findOne({ phoneNumber: normalizedPhoneNumber });
      } else {
        throw err;
      }
    }

    const token = signVoterToken({
      sub: user!._id.toString(),
      phoneNumber: user!.phoneNumber,
    });

    res.cookie(VOTER_SESSION_COOKIE, token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      maxAge: VOTER_SESSION_MAX_AGE_MS,
    });

    res.json({
      success: true,
      user: { phoneNumber: user!.phoneNumber, hasVoted: user!.hasVoted },
    });
  },
);

export const logoutHandler = (_req: Request, res: Response): void => {
  res.clearCookie(VOTER_SESSION_COOKIE);
  res.json({ success: true, message: "Logged out." });
};
