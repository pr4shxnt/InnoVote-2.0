import { Router } from "express";
import { getAdminAnalyticsHandler } from "../controllers/adminAnalyticsController.js";
import { adminLoginHandler, adminLogoutHandler, adminMeHandler } from "../controllers/adminAuthController.js";
import {
  blockUserHandler,
  listUsersHandler,
  unblockUserHandler,
} from "../controllers/adminUserController.js";
import {
  createProjectHandler,
  deleteProjectHandler,
  listProjectsAdminHandler,
  updateProjectHandler,
} from "../controllers/adminProjectController.js";
import {
  createResearchPaperHandler,
  deleteResearchPaperHandler,
  listResearchPapersAdminHandler,
  updateResearchPaperHandler,
} from "../controllers/adminResearchPaperController.js";
import { getRoundHandler, updateRoundHandler } from "../controllers/adminResultController.js";
import { uploadImageHandler } from "../controllers/adminUploadController.js";
import { adminAuthMiddleware } from "../middleware/adminAuthMiddleware.js";
import { imageUpload } from "../middleware/imageUpload.js";

export const adminRouter = Router();

// Public: admin login
adminRouter.post("/auth/login", adminLoginHandler);

// Everything below requires an admin session
adminRouter.use(adminAuthMiddleware);

adminRouter.post("/auth/logout", adminLogoutHandler);
adminRouter.get("/auth/me", adminMeHandler);

adminRouter.get("/projects", listProjectsAdminHandler);
adminRouter.post("/projects", createProjectHandler);
adminRouter.put("/projects/:id", updateProjectHandler);
adminRouter.delete("/projects/:id", deleteProjectHandler);

adminRouter.get("/research-papers", listResearchPapersAdminHandler);
adminRouter.post("/research-papers", createResearchPaperHandler);
adminRouter.put("/research-papers/:id", updateResearchPaperHandler);
adminRouter.delete("/research-papers/:id", deleteResearchPaperHandler);

adminRouter.get("/users", listUsersHandler);
adminRouter.post("/users/block", blockUserHandler);
adminRouter.post("/users/unblock", unblockUserHandler);

adminRouter.get("/analytics", getAdminAnalyticsHandler);

adminRouter.get("/results/round", getRoundHandler);
adminRouter.put("/results/round", updateRoundHandler);

adminRouter.post("/upload", imageUpload.single("image"), uploadImageHandler);
