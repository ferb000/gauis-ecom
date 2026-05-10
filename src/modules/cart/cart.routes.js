import { Router } from "express";
import { authRequired } from "../../middlewares/auth.js";
import { getCart, addItem, updateItem, removeItem } from "./cart.controller.js";

const router = Router();

/**
 * @swagger
 * /cart:
 *   get:
 *     summary: Get shopping cart
 *     description: Retrieves the authenticated user's shopping cart with all items
 *     tags:
 *       - Cart
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User's shopping cart
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 cart:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     items:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/CartItem'
 *                     total:
 *                       type: number
 *                       format: float
 *       401:
 *         description: Unauthorized
 */
router.get("/", authRequired(), getCart);

/**
 * @swagger
 * /cart/items:
 *   post:
 *     summary: Add item to cart
 *     description: Adds a product to the user's shopping cart
 *     tags:
 *       - Cart
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
 *                 example: 2
 *                 minimum: 1
 *     responses:
 *       201:
 *         description: Item added to cart successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 cartItem:
 *                   $ref: '#/components/schemas/CartItem'
 *       400:
 *         description: Invalid product or quantity
 *       401:
 *         description: Unauthorized
 */
router.post("/items", authRequired(), addItem);

/**
 * @swagger
 * /cart/items/{itemId}:
 *   patch:
 *     summary: Update cart item
 *     description: Updates the quantity of an item in the cart
 *     tags:
 *       - Cart
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema:
 *           type: string
 *         description: Cart item ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: ['quantity']
 *             properties:
 *               quantity:
 *                 type: integer
 *                 example: 5
 *                 minimum: 1
 *     responses:
 *       200:
 *         description: Cart item updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CartItem'
 *       404:
 *         description: Cart item not found
 *       401:
 *         description: Unauthorized
 *   delete:
 *     summary: Remove item from cart
 *     description: Removes a product from the user's shopping cart
 *     tags:
 *       - Cart
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Item removed from cart successfully
 *       404:
 *         description: Cart item not found
 *       401:
 *         description: Unauthorized
 */
router.patch("/items/:itemId", authRequired(), updateItem);
router.delete("/items/:itemId", authRequired(), removeItem);

export default router;
