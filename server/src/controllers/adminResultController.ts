import type { Request, Response } from "express";
import { getActiveRound, isVotingOpen } from "../services/roundService.js";
import type { VotingRoundDocument } from "../models/VotingRound.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { updateRoundBodySchema } from "../utils/validation.js";
import type { HydratedDocument } from "mongoose";

function serializeRound(round: HydratedDocument<VotingRoundDocument>) {
  return {
    id: round._id.toString(),
    name: round.name,
    resultRevealAt: round.resultRevealAt,
    isPublished: round.isPublished,
    votingOpensAt: round.votingOpensAt,
    votingClosesAt: round.votingClosesAt,
    votingManualOverride: round.votingManualOverride,
    votingOpen: isVotingOpen(round),
  };
}

export const getRoundHandler = asyncHandler(async (_req: Request, res: Response) => {
  const round = await getActiveRound();
  res.json({ success: true, round: serializeRound(round) });
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
  if (data.votingOpensAt !== undefined) {
    round.votingOpensAt = data.votingOpensAt ? new Date(data.votingOpensAt) : null;
  }
  if (data.votingClosesAt !== undefined) {
    round.votingClosesAt = data.votingClosesAt ? new Date(data.votingClosesAt) : null;
  }
  if (data.votingManualOverride !== undefined) {
    round.votingManualOverride = data.votingManualOverride;
  }
  await round.save();

  res.json({ success: true, round: serializeRound(round) });
});
