import { ApiError } from "../middleware/errorHandler.js";
import { ResearchPaperModel, type ResearchPaperDocument } from "../models/ResearchPaper.js";
import { ResearchPaperVoteModel } from "../models/ResearchPaperVote.js";
import { UserModel } from "../models/User.js";
import { getActiveRound, isVotingOpen } from "./roundService.js";
import type { HydratedDocument } from "mongoose";

interface CastPaperVoteInput {
  userId: string;
  phoneNumber: string;
  paperId: string;
  ipAddress: string;
}

export async function castPaperVote(input: CastPaperVoteInput): Promise<HydratedDocument<ResearchPaperDocument>> {
  const paper = await ResearchPaperModel.findOne({ _id: input.paperId, isActive: true });
  if (!paper) {
    throw new ApiError(404, "Research paper not found.");
  }

  const round = await getActiveRound();
  if (!isVotingOpen(round)) {
    throw new ApiError(403, "Voting is currently closed.");
  }

  // Atomic guard: only one concurrent request can flip hasVotedPaper to true for this user.
  // Match on "not already true" (rather than strictly `false`) so users whose documents
  // predate this field (and so have it missing rather than explicitly false) aren't
  // incorrectly treated as already having voted.
  const updatedUser = await UserModel.findOneAndUpdate(
    { _id: input.userId, hasVotedPaper: { $ne: true } },
    { hasVotedPaper: true, votedPaperId: paper._id, votedPaperAt: new Date() },
    { new: true },
  );

  if (!updatedUser) {
    throw new ApiError(409, "You have already voted for a research paper.");
  }

  try {
    await ResearchPaperVoteModel.create({
      roundId: round._id,
      paperId: paper._id,
      voterPhoneNumber: input.phoneNumber,
      ipAddress: input.ipAddress,
    });
  } catch (err) {
    if (typeof err === "object" && err !== null && "code" in err && (err as { code: unknown }).code === 11000) {
      // The user-level guard above already marked hasVotedPaper — a vote row for this
      // round/phone existing already means the vote was already recorded elsewhere.
      throw new ApiError(409, "You have already voted for a research paper.");
    }
    throw err;
  }

  return paper;
}
