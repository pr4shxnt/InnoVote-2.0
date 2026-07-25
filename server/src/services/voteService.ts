import { ApiError } from "../middleware/errorHandler.js";
import { ProjectModel, type ProjectDocument } from "../models/Project.js";
import { UserModel } from "../models/User.js";
import { VoteModel } from "../models/Vote.js";
import { getActiveRound, isVotingOpen } from "./roundService.js";
import type { HydratedDocument } from "mongoose";

interface CastVoteInput {
  userId: string;
  phoneNumber: string;
  projectId: string;
  ipAddress: string;
}

export async function castVote(
  input: CastVoteInput,
): Promise<HydratedDocument<ProjectDocument>> {
  const project = await ProjectModel.findOne({
    _id: input.projectId,
    isActive: true,
  });
  if (!project) {
    throw new ApiError(404, "Project not found.");
  }

  const round = await getActiveRound();
  if (!isVotingOpen(round)) {
    throw new ApiError(403, "Voting is currently closed.");
  }

  // Atomic guard: only one concurrent request can flip hasVoted to true for this user.
  // Match on "not already true" (rather than strictly `false`) so users whose documents
  // predate this field (and so have it missing rather than explicitly false) aren't
  // incorrectly treated as already having voted.
  const updatedUser = await UserModel.findOneAndUpdate(
    { _id: input.userId, hasVoted: { $ne: true } },
    { hasVoted: true, votedProjectId: project._id, votedAt: new Date() },
    { new: true },
  );

  if (!updatedUser) {
    throw new ApiError(409, "You have already voted.");
  }

  await VoteModel.create({
    roundId: round._id,
    projectId: project._id,
    voterPhoneNumber: input.phoneNumber,
    ipAddress: input.ipAddress,
  });

  return project;
}
