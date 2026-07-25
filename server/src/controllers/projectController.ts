import type { Request, Response } from "express";
import { ApiError } from "../middleware/errorHandler.js";
import { ProjectModel } from "../models/Project.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { compareBoothNumbers } from "../utils/sort.js";
import { objectIdSchema } from "../utils/validation.js";

export const listProjectsHandler = asyncHandler(async (_req: Request, res: Response) => {
  const projects = await ProjectModel.find({ isActive: true });
  projects.sort((a, b) => compareBoothNumbers(a.boothNumber, b.boothNumber));

  res.json({
    success: true,
    projects: projects.map((p) => ({
      id: p._id.toString(),
      title: p.title,
      description: p.description,
      boothNumber: p.boothNumber,
      imageUrl: p.imageUrl,
      teamName: p.teamName,
      teamMembers: p.teamMembers,
    })),
  });
});

export const getProjectHandler = asyncHandler(async (req: Request, res: Response) => {
  const id = objectIdSchema.parse(req.params.id);
  const project = await ProjectModel.findOne({ _id: id, isActive: true });
  if (!project) {
    throw new ApiError(404, "Project not found.");
  }

  res.json({
    success: true,
    project: {
      id: project._id.toString(),
      title: project.title,
      description: project.description,
      boothNumber: project.boothNumber,
      imageUrl: project.imageUrl,
      teamName: project.teamName,
      teamMembers: project.teamMembers,
    },
  });
});
