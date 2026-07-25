import { Router } from "express";
import { getProjectHandler, listProjectsHandler } from "../controllers/projectController.js";

export const projectRouter = Router();

projectRouter.get("/", listProjectsHandler);
projectRouter.get("/:id", getProjectHandler);
