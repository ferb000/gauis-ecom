import { Router } from "express";
import { authRequired } from "../../middlewares/auth.js";

const router = Router();

/**
 * @swagger
 * /users/me:
 *   get:
 *     summary: Get current user profile
 *     description: Retrieves the authenticated user's profile information
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *             examples:
 *               success:
 *                 value:
 *                   success: true
 *                   user:
 *                     id: "user_123"
 *                     phone_number: "+2348012345678"
 *                     email: "user@example.com"
 *                     first_name: "John"
 *                     last_name: "Doe"
 *                     created_at: "2024-01-10T12:00:00Z"
 *       401:
 *         description: Unauthorized - Missing or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/me", authRequired(), (req, res) => {
  return res.json({
    success: true,
    user: req.user,
  });
});

export default router;
