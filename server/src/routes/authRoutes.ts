import { Router } from "express";
import { loginHandler, logoutHandler } from "../controllers/authController.js";

export const authRouter = Router();

authRouter.post("/login", loginHandler);
authRouter.post("/logout", logoutHandler);
