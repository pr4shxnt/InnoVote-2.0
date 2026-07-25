import { Router } from "express";
import { getPaperResultsHandler, getResultsHandler } from "../controllers/resultController.js";

export const resultRouter = Router();

resultRouter.get("/", getResultsHandler);
resultRouter.get("/research-papers", getPaperResultsHandler);
