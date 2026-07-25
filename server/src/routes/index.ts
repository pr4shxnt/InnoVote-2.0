import { Router } from "express";
import { adminRouter } from "./adminRoutes.js";
import { authRouter } from "./authRoutes.js";
import { projectRouter } from "./projectRoutes.js";
import { researchPaperRouter } from "./researchPaperRoutes.js";
import { resultRouter } from "./resultRoutes.js";
import { userRouter } from "./userRoutes.js";
import { voteRouter } from "./voteRoutes.js";

export const apiRouter = Router();

apiRouter.get("/", (_req, res) => {
  res.json({ success: true, message: "InnoVote 2.0 API v1" });
});

apiRouter.use("/auth", authRouter);
apiRouter.use("/user", userRouter);
apiRouter.use("/votes", voteRouter);
apiRouter.use("/projects", projectRouter);
apiRouter.use("/research-papers", researchPaperRouter);
apiRouter.use("/results", resultRouter);
apiRouter.use("/admin", adminRouter);
