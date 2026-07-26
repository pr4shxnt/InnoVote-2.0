import { Router } from "express";
import { logoutHandler, requestOtpHandler, verifyOtpHandler } from "../controllers/authController.js";

export const authRouter = Router();

authRouter.post("/request-otp", requestOtpHandler);
authRouter.post("/verify-otp", verifyOtpHandler);
authRouter.post("/logout", logoutHandler);
