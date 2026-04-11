import crypto from "crypto";
import jwt from "jsonwebtoken";
import pool from "../../configs/db.js";

function generateOtp() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

function hashOtp(otp) {
  return crypto.createHash("sha256").update(otp).digest("hex");
}

export async function createOtp(phone_number) {
  const otp = generateOtp();
  const otpHash = hashOtp(otp);

  const expiryMinutes = Number(process.env.OTP_EXPIRY_MINUTES || 5);
  const expiresAt = new Date(Date.now() + expiryMinutes * 60 * 1000);

  await pool.query(
    `INSERT INTO otp_verifications (id, phone_number, otp_code, expires_at, is_used)
     VALUES (gen_random_uuid(), $1, $2, $3, FALSE)`,
    [phone_number, otpHash, expiresAt]
  );

  return { otp, expiresAt };
}

export async function verifyOtp(phone_number, otp) {
  const otpHash = hashOtp(otp);

  const { rows } = await pool.query(
    `SELECT id, otp_code, expires_at, is_used
     FROM otp_verifications
     WHERE phone_number = $1 AND is_used = FALSE
     ORDER BY created_at DESC
     LIMIT 1`,
    [phone_number]
  );

  if (rows.length === 0) {
    const err = new Error("OTP not found or already used");
    err.status = 400;
    throw err;
  }

  const record = rows[0];

  if (new Date(record.expires_at) < new Date()) {
    const err = new Error("OTP expired. Please request a new one.");
    err.status = 400;
    throw err;
  }

  if (record.otp_code !== otpHash) {
    const err = new Error("Invalid OTP");
    err.status = 400;
    throw err;
  }

  await pool.query(`UPDATE otp_verifications SET is_used = TRUE WHERE id = $1`, [record.id]);

  const userResult = await pool.query(
    `INSERT INTO users (id, phone_number, is_verified)
     VALUES (gen_random_uuid(), $1, TRUE)
     ON CONFLICT (phone_number)
     DO UPDATE SET is_verified = TRUE, updated_at = CURRENT_TIMESTAMP
     RETURNING id, phone_number, role, is_verified`,
    [phone_number]
  );

  const user = userResult.rows[0];

  const token = jwt.sign(
    { userId: user.id, role: user.role, phone_number: user.phone_number },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "45m" }
  );

  return { user, token };
}
