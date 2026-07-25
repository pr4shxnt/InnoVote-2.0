import type { Request, Response } from "express";
import { ResearchPaperVoteModel } from "../models/ResearchPaperVote.js";
import { VoteModel } from "../models/Vote.js";
import { getActiveRound } from "../services/roundService.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getResultsHandler = asyncHandler(async (_req: Request, res: Response) => {
  const round = await getActiveRound();
  const revealed = round.isPublished || Boolean(round.resultRevealAt && round.resultRevealAt <= new Date());

  if (!revealed) {
    res.json({ success: true, revealed: false, resultRevealAt: round.resultRevealAt });
    return;
  }

  const tallies = await VoteModel.aggregate([
    { $match: { roundId: round._id } },
    { $group: { _id: "$projectId", voteCount: { $sum: 1 } } },
    { $lookup: { from: "projects", localField: "_id", foreignField: "_id", as: "project" } },
    { $unwind: "$project" },
    { $sort: { voteCount: -1 } },
    {
      $project: {
        _id: 0,
        projectId: "$_id",
        title: "$project.title",
        boothNumber: "$project.boothNumber",
        voteCount: 1,
      },
    },
  ]);

  res.json({ success: true, revealed: true, resultRevealAt: round.resultRevealAt, results: tallies });
});

export const getPaperResultsHandler = asyncHandler(async (_req: Request, res: Response) => {
  const round = await getActiveRound();
  const revealed = round.isPublished || Boolean(round.resultRevealAt && round.resultRevealAt <= new Date());

  if (!revealed) {
    res.json({ success: true, revealed: false, resultRevealAt: round.resultRevealAt });
    return;
  }

  const tallies = await ResearchPaperVoteModel.aggregate([
    { $match: { roundId: round._id } },
    { $group: { _id: "$paperId", voteCount: { $sum: 1 } } },
    { $lookup: { from: "researchpapers", localField: "_id", foreignField: "_id", as: "paper" } },
    { $unwind: "$paper" },
    { $sort: { voteCount: -1 } },
    {
      $project: {
        _id: 0,
        paperId: "$_id",
        title: "$paper.title",
        voteCount: 1,
      },
    },
  ]);

  res.json({ success: true, revealed: true, resultRevealAt: round.resultRevealAt, results: tallies });
});
