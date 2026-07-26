import type { Request, Response } from "express";
import { isProduction } from "../config/env.js";
import { ApiError } from "../middleware/errorHandler.js";
import { OtpModel } from "../models/Otp.js";
import { UserModel } from "../models/User.js";
import { normalizePhoneNumber } from "../services/hashService.js";
import {
  VOTER_SESSION_COOKIE,
  VOTER_SESSION_MAX_AGE_MS,
  signVoterToken,
} from "../services/jwtService.js";
import {
  requestOtp as sendOtp,
  verifyOtp as checkOtp,
} from "../services/otpService.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  requestOtpBodySchema,
  verifyOtpBodySchema,
} from "../utils/validation.js";

const OTP_RESEND_COOLDOWN_MS = 30 * 1000;

export const requestOtpHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const { phoneNumber } = requestOtpBodySchema.parse(req.body);
    const normalizedPhoneNumber = normalizePhoneNumber(phoneNumber);

    const existingUser = await UserModel.findOne({
      phoneNumber: normalizedPhoneNumber,
    });
    if (existingUser?.status === "BLOCKED") {
      throw new ApiError(403, "This number is blocked from voting.");
    }

    const lastOtp = await OtpModel.findOne({
      phoneNumber: normalizedPhoneNumber,
    }).sort({ createdAt: -1 });
    if (
      lastOtp &&
      Date.now() - lastOtp.createdAt.getTime() < OTP_RESEND_COOLDOWN_MS
    ) {
      throw new ApiError(429, "Please wait before requesting another OTP.");
    }

    await sendOtp(phoneNumber);
    res.json({ success: true, message: "OTP sent via SMSGATE." });
  },
);

export const verifyOtpHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const { phoneNumber, otp } = verifyOtpBodySchema.parse(req.body);
    const normalizedPhoneNumber = normalizePhoneNumber(phoneNumber);

    await checkOtp(phoneNumber, otp);

    let user;
    try {
      user = await UserModel.findOneAndUpdate(
        { phoneNumber: normalizedPhoneNumber },
        { $setOnInsert: { phoneNumber: normalizedPhoneNumber } },
        { upsert: true, new: true },
      );
    } catch (err) {
      if (
        typeof err === "object" &&
        err !== null &&
        "code" in err &&
        (err as { code: unknown }).code === 11000
      ) {
        // Another concurrent request already inserted the document — just fetch it.
        // Do NOT retry with upsert here; that could throw a second E11000 and escape this catch.
        user = await UserModel.findOne({ phoneNumber: normalizedPhoneNumber });
      } else {
        throw err;
      }
    }
    if (!user) {
      throw new ApiError(500, "Failed to resolve voter account.");
    }
    if (user.status === "BLOCKED") {
      throw new ApiError(403, "This number is blocked from voting.");
    }

    const token = signVoterToken({
      sub: user._id.toString(),
      phoneNumber: user.phoneNumber,
    });

    res.cookie(VOTER_SESSION_COOKIE, token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      maxAge: VOTER_SESSION_MAX_AGE_MS,
    });

    res.json({
      success: true,
      user: { phoneNumber: user.phoneNumber, hasVoted: user.hasVoted },
    });
  },
);

export const logoutHandler = (_req: Request, res: Response): void => {
  res.clearCookie(VOTER_SESSION_COOKIE);
  res.json({ success: true, message: "Logged out." });
};
