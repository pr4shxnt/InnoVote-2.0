import { Router } from "express";
import { logoutHandler, requestOtpHandler, verifyOtpHandler } from "../controllers/authController.js";
import { otpRequestLimiter } from "../middleware/rateLimiter.js";

export const authRouter = Router();

authRouter.post("/request-otp", otpRequestLimiter, requestOtpHandler);
authRouter.post("/verify-otp", verifyOtpHandler);
authRouter.post("/logout", logoutHandler);
