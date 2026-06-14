// import { Router } from "express";
// import { authRequired, adminOnly } from "../../middlewares/auth.js";
// import {
//   myOrders,
//   myOrderDetail,
//   myCancelOrder,
//   adminOrders,
//   adminOrderDetail,
//   adminSetStatus,
// } from "./orders.controller.js";

// const router = Router();

// // Customer routes
// router.get("/", authRequired(), myOrders);
// router.get("/:id", authRequired(), myOrderDetail);
// router.patch("/:id/cancel", authRequired(), myCancelOrder);

// // Admin routes
// router.get("/admin/all", authRequired(), adminOnly(), adminOrders);
// router.get("/admin/:id", authRequired(), adminOnly(), adminOrderDetail);
// router.patch("/admin/:id/status", authRequired(), adminOnly(), adminSetStatus);

// export default router;


// src/modules/orders/orders.routes.js
import { Router } from "express";
import { authRequired, adminOnly } from "../../middlewares/auth.js";
import {
  myOrders,
  myOrderDetail,
  myCancelOrder,
  adminOrders,
  adminOrderDetail,
  adminSetStatus,
} from "./orders.controller.js";

const router = Router();

/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Get user orders
 *     description: Retrieves all orders for the authenticated user
 *     tags:
 *       - Orders
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled']
 *         description: Filter by order status
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number for pagination
 *     responses:
 *       200:
 *         description: List of user orders
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 orders:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Order'
 *                 total:
 *                   type: integer
 *       401:
 *         description: Unauthorized
 */
router.get("/", authRequired(), myOrders);

/**
 * @swagger
 * /orders/{id}:
 *   get:
 *     summary: Get order details
 *     description: Retrieves detailed information about a specific order
 *     tags:
 *       - Orders
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *     responses:
 *       200:
 *         description: Order details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 order:
 *                   $ref: '#/components/schemas/Order'
 *       404:
 *         description: Order not found
 *       401:
 *         description: Unauthorized
 *   patch:
 *     summary: Cancel order
 *     description: Cancels a pending order
 *     tags:
 *       - Orders
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Order cancelled successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       400:
 *         description: Cannot cancel order in current status
 *       404:
 *         description: Order not found
 *       401:
 *         description: Unauthorized
 */
router.patch("/:id/cancel", authRequired(), myCancelOrder);
router.get("/:id", authRequired(), myOrderDetail);

/**
 * @swagger
 * /orders/admin/all:
 *   get:
 *     summary: List all orders (Admin only)
 *     description: Retrieves all orders in the system. Requires admin privileges.
 *     tags:
 *       - Orders
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled']
 *         description: Filter by order status
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of all orders
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 orders:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Order'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin only
 */
router.get("/admin/all", authRequired(), adminOnly(), adminOrders);

/**
 * @swagger
 * /orders/admin/{id}:
 *   get:
 *     summary: Get order details (Admin only)
 *     description: Retrieves detailed information about an order. Requires admin privileges.
 *     tags:
 *       - Orders
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Order details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       404:
 *         description: Order not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin only
 *   patch:
 *     summary: Update order status (Admin only)
 *     description: Updates the status of an order
 *     tags:
 *       - Orders
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: ['status']
 *             properties:
 *               status:
 *                 type: string
 *                 enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled']
 *                 example: "shipped"
 *     responses:
 *       200:
 *         description: Order status updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       400:
 *         description: Invalid status
 *       404:
 *         description: Order not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin only
 */
router.get("/admin/:id", authRequired(), adminOnly(), adminOrderDetail);
router.patch("/admin/:id/status", authRequired(), adminOnly(), adminSetStatus);

export default router;
