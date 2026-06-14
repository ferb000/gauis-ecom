import { Router } from "express";
import { authRequired, adminOnly } from "../../../middlewares/auth.js";
import { list, detail, adminList, create, update, remove } from "./products.controller.js";

const router = Router();

/**
 * @swagger
 * /products:
 *   get:
 *     summary: List all products
 *     description: Retrieves all products available in the catalog
 *     tags:
 *       - Products
 *     parameters:
 *       - in: query
 *         name: category_id
 *         schema:
 *           type: string
 *         description: Filter by category ID
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Items per page
 *     responses:
 *       200:
 *         description: List of products
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 products:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 *                 total:
 *                   type: integer
 *             examples:
 *               success:
 *                 value:
 *                   success: true
 *                   products:
 *                     - id: "prod_123"
 *                       name: "Wireless Headphones"
 *                       description: "Premium wireless headphones"
 *                       price: 15999.99
 *                       stock: 50
 *                   total: 1
 */
router.get("/", list);

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Get product details
 *     description: Retrieves detailed information about a specific product
 *     tags:
 *       - Products
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 product:
 *                   $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product not found
 */
router.get("/:id", detail);

/**
 * @swagger
 * /products/admin/all:
 *   get:
 *     summary: List all products (Admin only)
 *     description: Retrieves all products with admin details. Requires admin privileges.
 *     tags:
 *       - Products
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all products
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 products:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin only
 *   post:
 *     summary: Create new product (Admin only)
 *     description: Creates a new product. Requires admin privileges.
 *     tags:
 *       - Products
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: ['name', 'price', 'category_id']
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Wireless Headphones"
 *               description:
 *                 type: string
 *                 example: "Premium wireless headphones"
 *               price:
 *                 type: number
 *                 format: float
 *                 example: 15999.99
 *               category_id:
 *                 type: string
 *                 example: "cat_123"
 *               stock:
 *                 type: integer
 *                 example: 100
 *               image_url:
 *                 type: string
 *     responses:
 *       201:
 *         description: Product created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Invalid product data
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin only
 */
router.get("/admin/all", authRequired(), adminOnly(), adminList);

/**
 * @swagger
 * /products/admin/{id}:
 *   patch:
 *     summary: Update product (Admin only)
 *     description: Updates an existing product details
 *     tags:
 *       - Products
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
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               stock:
 *                 type: integer
 *               image_url:
 *                 type: string
 *     responses:
 *       200:
 *         description: Product updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin only
 *   delete:
 *     summary: Delete product (Admin only)
 *     description: Deletes a product from the catalog
 *     tags:
 *       - Products
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
 *         description: Product deleted successfully
 *       404:
 *         description: Product not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin only
 */
router.post("/admin", authRequired(), adminOnly(), create);
router.patch("/admin/:id", authRequired(), adminOnly(), update);
router.delete("/admin/:id", authRequired(), adminOnly(), remove);

export default router;
