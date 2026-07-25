import type { Request, Response } from "express";
import { ApiError } from "../middleware/errorHandler.js";
import { ResearchPaperModel } from "../models/ResearchPaper.js";
import { ResearchPaperVoteModel } from "../models/ResearchPaperVote.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { objectIdSchema, researchPaperBodySchema, researchPaperUpdateBodySchema } from "../utils/validation.js";

function serializeResearchPaper(paper: InstanceType<typeof ResearchPaperModel>, voteCount = 0) {
  return {
    id: paper._id.toString(),
    title: paper.title,
    description: paper.description,
    imageUrl: paper.imageUrl,
    teamName: paper.teamName,
    teamMembers: paper.teamMembers,
    isActive: paper.isActive,
    voteCount,
    createdAt: paper.createdAt,
    updatedAt: paper.updatedAt,
  };
}

export const listResearchPapersAdminHandler = asyncHandler(async (_req: Request, res: Response) => {
  const [papers, tallies] = await Promise.all([
    ResearchPaperModel.find().sort({ createdAt: -1 }),
    ResearchPaperVoteModel.aggregate([{ $group: { _id: "$paperId", voteCount: { $sum: 1 } } }]),
  ]);

  const voteCountByPaperId = new Map(tallies.map((t) => [t._id.toString(), t.voteCount as number]));
  res.json({
    success: true,
    papers: papers.map((p) => serializeResearchPaper(p, voteCountByPaperId.get(p._id.toString()) ?? 0)),
  });
});

export const createResearchPaperHandler = asyncHandler(async (req: Request, res: Response) => {
  const data = researchPaperBodySchema.parse(req.body);
  const paper = await ResearchPaperModel.create(data);
  res.status(201).json({ success: true, paper: serializeResearchPaper(paper) });
});

export const updateResearchPaperHandler = asyncHandler(async (req: Request, res: Response) => {
  const id = objectIdSchema.parse(req.params.id);
  const data = researchPaperUpdateBodySchema.parse(req.body);

  const paper = await ResearchPaperModel.findByIdAndUpdate(id, data, { new: true });
  if (!paper) {
    throw new ApiError(404, "Research paper not found.");
  }

  const voteCount = await ResearchPaperVoteModel.countDocuments({ paperId: paper._id });
  res.json({ success: true, paper: serializeResearchPaper(paper, voteCount) });
});

export const deleteResearchPaperHandler = asyncHandler(async (req: Request, res: Response) => {
  const id = objectIdSchema.parse(req.params.id);

  const paper = await ResearchPaperModel.findByIdAndDelete(id);
  if (!paper) {
    throw new ApiError(404, "Research paper not found.");
  }

  res.json({ success: true, message: "Research paper deleted." });
});
