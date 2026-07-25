import type { Request, Response } from "express";
import { ProjectModel } from "../models/Project.js";
import { ResearchPaperModel } from "../models/ResearchPaper.js";
import { ResearchPaperVoteModel } from "../models/ResearchPaperVote.js";
import { UserModel } from "../models/User.js";
import { VoteModel } from "../models/Vote.js";
import { getActiveRound } from "../services/roundService.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const HOURLY_BUCKET_FORMAT = "%Y-%m-%dT%H:00:00.000Z";

interface TimeBucketRow {
  _id: string;
  count: number;
}

export const getAdminAnalyticsHandler = asyncHandler(async (_req: Request, res: Response) => {
  const round = await getActiveRound();

  const [
    totalProjects,
    activeProjects,
    totalResearchPapers,
    activeResearchPapers,
    totalUsers,
    votedProjectUsers,
    votedPaperUsers,
    blockedUsers,
    totalProjectVotes,
    totalPaperVotes,
    votesByProject,
    votesByPaper,
    projectVotesOverTime,
    paperVotesOverTime,
  ] = await Promise.all([
    ProjectModel.countDocuments({}),
    ProjectModel.countDocuments({ isActive: true }),
    ResearchPaperModel.countDocuments({}),
    ResearchPaperModel.countDocuments({ isActive: true }),
    UserModel.countDocuments({}),
    UserModel.countDocuments({ hasVoted: true }),
    UserModel.countDocuments({ hasVotedPaper: true }),
    UserModel.countDocuments({ status: "BLOCKED" }),
    VoteModel.countDocuments({ roundId: round._id }),
    ResearchPaperVoteModel.countDocuments({ roundId: round._id }),
    VoteModel.aggregate([
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
    ]),
    ResearchPaperVoteModel.aggregate([
      { $match: { roundId: round._id } },
      { $group: { _id: "$paperId", voteCount: { $sum: 1 } } },
      { $lookup: { from: "researchpapers", localField: "_id", foreignField: "_id", as: "paper" } },
      { $unwind: "$paper" },
      { $sort: { voteCount: -1 } },
      { $project: { _id: 0, paperId: "$_id", title: "$paper.title", voteCount: 1 } },
    ]),
    VoteModel.aggregate<TimeBucketRow>([
      { $match: { roundId: round._id } },
      { $group: { _id: { $dateToString: { format: HOURLY_BUCKET_FORMAT, date: "$createdAt" } }, count: { $sum: 1 } } },
    ]),
    ResearchPaperVoteModel.aggregate<TimeBucketRow>([
      { $match: { roundId: round._id } },
      { $group: { _id: { $dateToString: { format: HOURLY_BUCKET_FORMAT, date: "$createdAt" } }, count: { $sum: 1 } } },
    ]),
  ]);

  const bucketMap = new Map<string, { bucket: string; projectVotes: number; paperVotes: number }>();
  for (const row of projectVotesOverTime) {
    bucketMap.set(row._id, { bucket: row._id, projectVotes: row.count, paperVotes: 0 });
  }
  for (const row of paperVotesOverTime) {
    const existing = bucketMap.get(row._id);
    if (existing) {
      existing.paperVotes = row.count;
    } else {
      bucketMap.set(row._id, { bucket: row._id, projectVotes: 0, paperVotes: row.count });
    }
  }
  const votesOverTime = Array.from(bucketMap.values()).sort((a, b) => a.bucket.localeCompare(b.bucket));

  res.json({
    success: true,
    totals: {
      totalProjects,
      activeProjects,
      totalResearchPapers,
      activeResearchPapers,
      totalProjectVotes,
      totalPaperVotes,
      totalUsers,
      votedProjectUsers,
      votedPaperUsers,
      blockedUsers,
    },
    votesByProject,
    votesByPaper,
    votesOverTime,
  });
});
