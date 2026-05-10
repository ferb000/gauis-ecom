import { Router } from "express";
import { authRequired } from "../../middlewares/auth.js";
import { checkoutHandler } from "./checkout.controller.js";

const router = Router();

/**
 * @swagger
 * /checkout:
 *   post:
 *     summary: Process checkout
 *     description: Processes the checkout of items in the user's cart and creates an order
 *     tags:
 *       - Checkout
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: ['address_id', 'payment_method']
 *             properties:
 *               address_id:
 *                 type: string
 *                 example: "addr_123"
 *                 description: User's delivery address ID
 *               payment_method:
 *                 type: string
 *                 enum: ['card', 'bank_transfer', 'wallet']
 *                 example: "card"
 *               notes:
 *                 type: string
 *                 example: "Please leave at doorstep"
 *                 description: Optional delivery notes
 *     responses:
 *       201:
 *         description: Checkout completed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 order:
 *                   $ref: '#/components/schemas/Order'
 *                 payment_url:
 *                   type: string
 *                   description: Payment processing URL (if applicable)
 *             examples:
 *               success:
 *                 value:
 *                   success: true
 *                   order:
 *                     id: "order_123"
 *                     user_id: "user_456"
 *                     total_amount: 31999.98
 *                     status: "pending"
 *                     created_at: "2024-01-15T10:30:00Z"
 *       400:
 *         description: Invalid checkout data or empty cart
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               emptyCart:
 *                 value:
 *                   success: false
 *                   message: "Cart is empty"
 *       404:
 *         description: Address not found
 *       401:
 *         description: Unauthorized
 */
router.post("/", authRequired(), checkoutHandler);

export default router;
