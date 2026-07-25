import { Router } from "express";
import { castVoteHandler, getVotingStatusHandler } from "../controllers/voteController.js";
import { castPaperVoteHandler } from "../controllers/researchPaperVoteController.js";
import { cookieAuthMiddleware } from "../middleware/cookieAuthMiddleware.js";

export const voteRouter = Router();

// Public: voters need this before authenticating to know whether voting is open at all.
voteRouter.get("/status", getVotingStatusHandler);

voteRouter.use(cookieAuthMiddleware);
voteRouter.post("/cast", castVoteHandler);
voteRouter.post("/cast-paper", castPaperVoteHandler);
