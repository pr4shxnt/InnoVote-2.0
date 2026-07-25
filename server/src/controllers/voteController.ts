import type { Request, Response } from "express";
import { castVote } from "../services/voteService.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { castVoteBodySchema } from "../utils/validation.js";

export const castVoteHandler = asyncHandler(async (req: Request, res: Response) => {
  const { projectId } = castVoteBodySchema.parse(req.body);

  const project = await castVote({
    userId: req.user!.id,
    phoneNumber: req.user!.phoneNumber,
    projectId,
    ipAddress: req.ip ?? "",
  });

  res.json({
    success: true,
    message: "Vote recorded!",
    votedProject: { id: project._id.toString(), title: project.title, boothNumber: project.boothNumber },
  });
});
