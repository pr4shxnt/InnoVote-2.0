import type { Request, Response } from "express";
import { castPaperVote } from "../services/researchPaperVoteService.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { castPaperVoteBodySchema } from "../utils/validation.js";

export const castPaperVoteHandler = asyncHandler(async (req: Request, res: Response) => {
  const { paperId } = castPaperVoteBodySchema.parse(req.body);

  const paper = await castPaperVote({
    userId: req.user!.id,
    phoneNumber: req.user!.phoneNumber,
    paperId,
    ipAddress: req.ip ?? "",
  });

  res.json({
    success: true,
    message: "Vote recorded!",
    votedPaper: { id: paper._id.toString(), title: paper.title },
  });
});
