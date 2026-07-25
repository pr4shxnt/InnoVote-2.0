import type { Request, Response } from "express";
import { ApiError } from "../middleware/errorHandler.js";
import { ProjectModel } from "../models/Project.js";
import { ResearchPaperModel } from "../models/ResearchPaper.js";
import { UserModel } from "../models/User.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { updateProfileBodySchema } from "../utils/validation.js";

export const getProfileHandler = asyncHandler(async (req: Request, res: Response) => {
  const user = await UserModel.findById(req.user!.id);
  if (!user) {
    throw new ApiError(404, "User not found.");
  }

  let votedProject = null;
  if (user.hasVoted && user.votedProjectId) {
    const project = await ProjectModel.findById(user.votedProjectId);
    if (project) {
      votedProject = { id: project._id.toString(), title: project.title, boothNumber: project.boothNumber };
    }
  }

  let votedPaper = null;
  if (user.hasVotedPaper && user.votedPaperId) {
    const paper = await ResearchPaperModel.findById(user.votedPaperId);
    if (paper) {
      votedPaper = { id: paper._id.toString(), title: paper.title };
    }
  }

  // Users created before this field existed never had it set explicitly — treat any
  // non-default display name as evidence they already went through the name prompt.
  const hasSetDisplayName = user.hasSetDisplayName || user.displayName !== "Voter";

  res.json({
    success: true,
    profile: {
      displayName: user.displayName,
      hasSetDisplayName,
      hasVoted: user.hasVoted,
      votedProject,
      hasVotedPaper: user.hasVotedPaper,
      votedPaper,
      sessionRemainingMs: Math.max(0, req.user!.sessionExpiresAt - Date.now()),
    },
  });
});

export const updateProfileHandler = asyncHandler(async (req: Request, res: Response) => {
  const { displayName } = updateProfileBodySchema.parse(req.body);

  const user = await UserModel.findByIdAndUpdate(
    req.user!.id,
    { displayName, hasSetDisplayName: true },
    { new: true },
  );
  if (!user) {
    throw new ApiError(404, "User not found.");
  }

  res.json({ success: true, profile: { displayName: user.displayName, hasSetDisplayName: true } });
});
