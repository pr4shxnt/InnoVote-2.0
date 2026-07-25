import type { Request, Response } from "express";
import { ApiError } from "../middleware/errorHandler.js";
import { ProjectModel } from "../models/Project.js";
import { VoteModel } from "../models/Vote.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { compareBoothNumbers } from "../utils/sort.js";
import { objectIdSchema, projectBodySchema, projectUpdateBodySchema } from "../utils/validation.js";

function serializeProject(project: InstanceType<typeof ProjectModel>, voteCount = 0) {
  return {
    id: project._id.toString(),
    title: project.title,
    description: project.description,
    boothNumber: project.boothNumber,
    imageUrl: project.imageUrl,
    teamName: project.teamName,
    teamMembers: project.teamMembers,
    isActive: project.isActive,
    voteCount,
    createdAt: project.createdAt,
    updatedAt: project.updatedAt,
  };
}

export const listProjectsAdminHandler = asyncHandler(async (_req: Request, res: Response) => {
  const [projects, tallies] = await Promise.all([
    ProjectModel.find(),
    VoteModel.aggregate([{ $group: { _id: "$projectId", voteCount: { $sum: 1 } } }]),
  ]);
  projects.sort((a, b) => compareBoothNumbers(a.boothNumber, b.boothNumber));

  const voteCountByProjectId = new Map(tallies.map((t) => [t._id.toString(), t.voteCount as number]));
  res.json({
    success: true,
    projects: projects.map((p) => serializeProject(p, voteCountByProjectId.get(p._id.toString()) ?? 0)),
  });
});

export const createProjectHandler = asyncHandler(async (req: Request, res: Response) => {
  const data = projectBodySchema.parse(req.body);
  const project = await ProjectModel.create(data);
  res.status(201).json({ success: true, project: serializeProject(project) });
});

export const updateProjectHandler = asyncHandler(async (req: Request, res: Response) => {
  const id = objectIdSchema.parse(req.params.id);
  const data = projectUpdateBodySchema.parse(req.body);

  const project = await ProjectModel.findByIdAndUpdate(id, data, { new: true });
  if (!project) {
    throw new ApiError(404, "Project not found.");
  }

  const voteCount = await VoteModel.countDocuments({ projectId: project._id });
  res.json({ success: true, project: serializeProject(project, voteCount) });
});

export const deleteProjectHandler = asyncHandler(async (req: Request, res: Response) => {
  const id = objectIdSchema.parse(req.params.id);

  const project = await ProjectModel.findByIdAndDelete(id);
  if (!project) {
    throw new ApiError(404, "Project not found.");
  }

  res.json({ success: true, message: "Project deleted." });
});
