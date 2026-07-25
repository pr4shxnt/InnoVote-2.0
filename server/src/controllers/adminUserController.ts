import type { Request, Response } from "express";
import { UserModel } from "../models/User.js";
import { normalizePhoneNumber } from "../services/hashService.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { blockUserBodySchema } from "../utils/validation.js";

function serializeUser(user: InstanceType<typeof UserModel>) {
  return {
    id: user._id.toString(),
    phoneNumber: user.phoneNumber,
    displayName: user.displayName,
    hasVoted: user.hasVoted,
    votedProjectId: user.votedProjectId?.toString() ?? null,
    votedAt: user.votedAt,
    status: user.status,
    createdAt: user.createdAt,
  };
}

export const listUsersHandler = asyncHandler(async (_req: Request, res: Response) => {
  const users = await UserModel.find().sort({ createdAt: -1 });
  res.json({ success: true, users: users.map(serializeUser) });
});

export const blockUserHandler = asyncHandler(async (req: Request, res: Response) => {
  const { phoneNumber } = blockUserBodySchema.parse(req.body);
  const normalizedPhoneNumber = normalizePhoneNumber(phoneNumber);

  const user = await UserModel.findOneAndUpdate(
    { phoneNumber: normalizedPhoneNumber },
    { status: "BLOCKED" },
    { new: true, upsert: true },
  );

  res.json({ success: true, user: serializeUser(user) });
});

export const unblockUserHandler = asyncHandler(async (req: Request, res: Response) => {
  const { phoneNumber } = blockUserBodySchema.parse(req.body);
  const normalizedPhoneNumber = normalizePhoneNumber(phoneNumber);

  const user = await UserModel.findOneAndUpdate(
    { phoneNumber: normalizedPhoneNumber },
    { status: "ACTIVE" },
    { new: true },
  );

  res.json({ success: true, user: user ? serializeUser(user) : null });
});
