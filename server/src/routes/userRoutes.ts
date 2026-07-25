import { Router } from "express";
import { getProfileHandler, updateProfileHandler } from "../controllers/profileController.js";
import { cookieAuthMiddleware } from "../middleware/cookieAuthMiddleware.js";

export const userRouter = Router();

userRouter.use(cookieAuthMiddleware);
userRouter.get("/profile", getProfileHandler);
userRouter.put("/profile", updateProfileHandler);
