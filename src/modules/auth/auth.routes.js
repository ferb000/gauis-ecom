import { Router } from "express";
import { otpLimiter, requestOtp, verifyOtpHandler } from "./auth.controller.js";

const router = Router();

router.post("/request-otp", otpLimiter, requestOtp);
router.post("/verify-otp", verifyOtpHandler);

export default router;
