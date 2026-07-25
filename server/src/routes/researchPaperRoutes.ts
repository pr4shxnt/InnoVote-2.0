import { Router } from "express";
import { getResearchPaperHandler, listResearchPapersHandler } from "../controllers/researchPaperController.js";

export const researchPaperRouter = Router();

researchPaperRouter.get("/", listResearchPapersHandler);
researchPaperRouter.get("/:id", getResearchPaperHandler);
