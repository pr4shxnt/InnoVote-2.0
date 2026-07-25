import type { Request, Response } from "express";
import { ApiError } from "../middleware/errorHandler.js";
import { ResearchPaperModel } from "../models/ResearchPaper.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { objectIdSchema } from "../utils/validation.js";

export const listResearchPapersHandler = asyncHandler(async (_req: Request, res: Response) => {
  const papers = await ResearchPaperModel.find({ isActive: true }).sort({ title: 1 });

  res.json({
    success: true,
    papers: papers.map((p) => ({
      id: p._id.toString(),
      title: p.title,
      description: p.description,
      imageUrl: p.imageUrl,
      teamName: p.teamName,
      teamMembers: p.teamMembers,
    })),
  });
});

export const getResearchPaperHandler = asyncHandler(async (req: Request, res: Response) => {
  const id = objectIdSchema.parse(req.params.id);
  const paper = await ResearchPaperModel.findOne({ _id: id, isActive: true });
  if (!paper) {
    throw new ApiError(404, "Research paper not found.");
  }

  res.json({
    success: true,
    paper: {
      id: paper._id.toString(),
      title: paper.title,
      description: paper.description,
      imageUrl: paper.imageUrl,
      teamName: paper.teamName,
      teamMembers: paper.teamMembers,
    },
  });
});
