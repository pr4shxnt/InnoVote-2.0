import { Router } from "express";
import { castVoteHandler } from "../controllers/voteController.js";
import { castPaperVoteHandler } from "../controllers/researchPaperVoteController.js";
import { cookieAuthMiddleware } from "../middleware/cookieAuthMiddleware.js";

export const voteRouter = Router();

voteRouter.use(cookieAuthMiddleware);
voteRouter.post("/cast", castVoteHandler);
voteRouter.post("/cast-paper", castPaperVoteHandler);
