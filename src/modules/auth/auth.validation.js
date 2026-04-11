import { z } from "zod";

export const requestOtpSchema = z.object({
  phone_number: z.string().min(7).max(20),
});

export const verifyOtpSchema = z.object({
  phone_number: z.string().min(7).max(20),
  otp: z.string().min(4).max(10),
});
