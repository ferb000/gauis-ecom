import { Router } from "express";
import { authRequired, adminOnly } from "../../../middlewares/auth.js";
import { list, create, update, remove } from "./categories.controller.js";

const router = Router();

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: List all categories
 *     description: Retrieves all product categories
 *     tags:
 *       - Categories
 *     responses:
 *       200:
 *         description: List of categories
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 categories:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Category'
 *             examples:
 *               success:
 *                 value:
 *                   success: true
 *                   categories:
 *                     - id: "cat_123"
 *                       name: "Electronics"
 *                       description: "Electronic devices and accessories"
 *                       image_url: "https://example.com/images/electronics.jpg"
 *   post:
 *     summary: Create new category (Admin only)
 *     description: Creates a new product category. Requires admin privileges.
 *     tags:
 *       - Categories
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: ['name']
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Electronics"
 *               description:
 *                 type: string
 *                 example: "Electronic devices and accessories"
 *               image_url:
 *                 type: string
 *                 example: "https://example.com/images/electronics.jpg"
 *     responses:
 *       201:
 *         description: Category created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin only
 */
router.get("/", list);

/**
 * @swagger
 * /categories/{id}:
 *   patch:
 *     summary: Update category (Admin only)
 *     description: Updates an existing product category
 *     tags:
 *       - Categories
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
 *               image_url:
 *                 type: string
 *     responses:
 *       200:
 *         description: Category updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       404:
 *         description: Category not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin only
 *   delete:
 *     summary: Delete category (Admin only)
 *     description: Deletes a product category
 *     tags:
 *       - Categories
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
 *         description: Category deleted successfully
 *       404:
 *         description: Category not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin only
 */
router.post("/", authRequired(), adminOnly(), create);
router.patch("/:id", authRequired(), adminOnly(), update);
router.delete("/:id", authRequired(), adminOnly(), remove);

export default router;
