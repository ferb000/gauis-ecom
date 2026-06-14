import { Router } from "express";
import { authRequired, adminOnly } from "../../middlewares/auth.js";
import { upsert, adjust, getOne, list } from "./inventory.contrroller.js";

const router = Router();

/**
 * @swagger
 * /inventory/admin:
 *   get:
 *     summary: List inventory (Admin only)
 *     description: Retrieves inventory information for all products
 *     tags:
 *       - Inventory
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of inventory items
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 inventory:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       product_id:
 *                         type: string
 *                       quantity:
 *                         type: integer
 *                       last_updated:
 *                         type: string
 *                         format: date-time
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin only
 *   post:
 *     summary: Create or update inventory (Admin only)
 *     description: Creates new inventory or updates existing inventory for a product
 *     tags:
 *       - Inventory
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: ['product_id', 'quantity']
 *             properties:
 *               product_id:
 *                 type: string
 *                 example: "prod_123"
 *               quantity:
 *                 type: integer
 *                 example: 100
 *                 minimum: 0
 *     responses:
 *       201:
 *         description: Inventory created or updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 inventory:
 *                   type: object
 *       400:
 *         description: Invalid inventory data
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin only
 */
router.get("/admin", authRequired(), adminOnly(), list);
router.post("/admin", authRequired(), adminOnly(), upsert);

/**
 * @swagger
 * /inventory/admin/{productId}:
 *   get:
 *     summary: Get inventory for product (Admin only)
 *     description: Retrieves inventory information for a specific product
 *     tags:
 *       - Inventory
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product inventory details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 inventory:
 *                   type: object
 *       404:
 *         description: Inventory not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin only
 *   patch:
 *     summary: Adjust inventory quantity (Admin only)
 *     description: Increases or decreases the inventory quantity for a product
 *     tags:
 *       - Inventory
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: ['adjustment']
 *             properties:
 *               adjustment:
 *                 type: integer
 *                 example: 10
 *                 description: Positive number increases stock, negative decreases
 *               reason:
 *                 type: string
 *                 example: "Stock received"
 *     responses:
 *       200:
 *         description: Inventory adjusted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       400:
 *         description: Invalid adjustment
 *       404:
 *         description: Inventory not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin only
 */
router.get("/admin/:productId", authRequired(), adminOnly(), getOne);
router.patch("/admin/:productId/adjust", authRequired(), adminOnly(), adjust);

export default router;
