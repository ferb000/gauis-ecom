import rateLimit from "express-rate-limit";
import { requestOtpSchema, verifyOtpSchema } from "./auth.validation.js";
import { createOtp, verifyOtp } from "./auth.service.js";

export const otpLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 5,
  message: { success: false, message: "Too many OTP requests. Try again later." },
});

export async function requestOtp(req, res, next) {
  try {
    const { phone_number } = requestOtpSchema.parse(req.body);

    const { otp, expiresAt } = await createOtp(phone_number);

    // yet TODO: integrate SMS provider for otp.
    const response = {
      success: true,
      message: "OTP sent",
      expires_at: expiresAt,
    };

    // Dev-only
    if (process.env.NODE_ENV !== "production") {
      response.dev_otp = otp;
    }

    return res.json(response);
  } catch (err) {
    return next(err);
  }
}

export async function verifyOtpHandler(req, res, next) {
  try {
    const { phone_number, otp } = verifyOtpSchema.parse(req.body);
    const result = await verifyOtp(phone_number, otp);

    return res.json({
      success: true,
      message: "Phone verified",
      token: result.token,
      user: result.user,
    });
  } catch (err) {
    return next(err);
  }
}
