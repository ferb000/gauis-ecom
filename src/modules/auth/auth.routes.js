import { Router } from "express";
import { otpLimiter, requestOtp, verifyOtpHandler } from "./auth.controller.js";

const router = Router();

/**
 * @swagger
 * /auth/request-otp:
 *   post:
 *     summary: Request OTP for phone number
 *     description: Sends an OTP to the provided phone number. Limited to 5 requests per 10 minutes.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RequestOtpRequest'
 *           examples:
 *             valid:
 *               value:
 *                 phone_number: "+2348012345678"
 *     responses:
 *       200:
 *         description: OTP sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RequestOtpResponse'
 *             examples:
 *               success:
 *                 value:
 *                   success: true
 *                   message: "OTP sent"
 *                   expires_at: "2024-01-15T10:30:00Z"
 *                   dev_otp: "123456"
 *       429:
 *         description: Too many requests
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               tooMany:
 *                 value:
 *                   success: false
 *                   message: "Too many OTP requests. Try again later."
 *       400:
 *         description: Invalid phone number format
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post("/request-otp", otpLimiter, requestOtp);

/**
 * @swagger
 * /auth/verify-otp:
 *   post:
 *     summary: Verify OTP and get authentication token
 *     description: Verifies the OTP sent to the phone number and returns JWT token
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/VerifyOtpRequest'
 *           examples:
 *             valid:
 *               value:
 *                 phone_number: "+2348012345678"
 *                 otp: "123456"
 *     responses:
 *       200:
 *         description: OTP verified successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/VerifyOtpResponse'
 *             examples:
 *               success:
 *                 value:
 *                   success: true
 *                   message: "Phone verified"
 *                   token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwaG9uZSI6IisyMzQ4MDEyMzQ1Njc4In0.signature"
 *                   user:
 *                     id: "user_123"
 *                     phone_number: "+2348012345678"
 *                     email: "user@example.com"
 *                     first_name: "John"
 *                     last_name: "Doe"
 *       400:
 *         description: Invalid OTP or phone number
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               invalid:
 *                 value:
 *                   success: false
 *                   message: "Invalid OTP"
 *       401:
 *         description: OTP expired
 */
router.post("/verify-otp", verifyOtpHandler);

export default router;
