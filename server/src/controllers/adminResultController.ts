import type { Request, Response } from "express";
import { getActiveRound } from "../services/roundService.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { updateRoundBodySchema } from "../utils/validation.js";

export const getRoundHandler = asyncHandler(async (_req: Request, res: Response) => {
  const round = await getActiveRound();
  res.json({
    success: true,
    round: { id: round._id.toString(), name: round.name, resultRevealAt: round.resultRevealAt, isPublished: round.isPublished },
  });
});

export const updateRoundHandler = asyncHandler(async (req: Request, res: Response) => {
  const data = updateRoundBodySchema.parse(req.body);
  const round = await getActiveRound();

  if (data.resultRevealAt !== undefined) {
    round.resultRevealAt = data.resultRevealAt ? new Date(data.resultRevealAt) : null;
  }
  if (data.isPublished !== undefined) {
    round.isPublished = data.isPublished;
  }
  await round.save();

  res.json({
    success: true,
    round: { id: round._id.toString(), name: round.name, resultRevealAt: round.resultRevealAt, isPublished: round.isPublished },
  });
});
