import { Router } from "express";
import { authRequired } from "../../middlewares/auth.js";
import { list, create, update, makeDefault, remove } from "./addresses.controller.js";

const router = Router();

/**
 * @swagger
 * /addresses:
 *   get:
 *     summary: List user addresses
 *     description: Retrieves all addresses for the authenticated user
 *     tags:
 *       - Addresses
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user addresses
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 addresses:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Address'
 *       401:
 *         description: Unauthorized
 *   post:
 *     summary: Create new address
 *     description: Adds a new address for the authenticated user
 *     tags:
 *       - Addresses
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: ['street', 'city', 'state', 'country']
 *             properties:
 *               street:
 *                 type: string
 *                 example: "123 Main Street"
 *               city:
 *                 type: string
 *                 example: "Lagos"
 *               state:
 *                 type: string
 *                 example: "Lagos"
 *               postal_code:
 *                 type: string
 *                 example: "101241"
 *               country:
 *                 type: string
 *                 example: "Nigeria"
 *               is_default:
 *                 type: boolean
 *                 example: false
 *     responses:
 *       201:
 *         description: Address created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Address'
 *       400:
 *         description: Invalid address data
 *       401:
 *         description: Unauthorized
 */
router.get("/", authRequired(), list);
router.post("/", authRequired(), create);

/**
 * @swagger
 * /addresses/{id}:
 *   patch:
 *     summary: Update address
 *     description: Updates an existing address
 *     tags:
 *       - Addresses
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Address ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               street:
 *                 type: string
 *               city:
 *                 type: string
 *               state:
 *                 type: string
 *               postal_code:
 *                 type: string
 *               country:
 *                 type: string
 *     responses:
 *       200:
 *         description: Address updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Address'
 *       404:
 *         description: Address not found
 *       401:
 *         description: Unauthorized
 *   delete:
 *     summary: Delete address
 *     description: Deletes an address
 *     tags:
 *       - Addresses
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
 *         description: Address deleted successfully
 *       404:
 *         description: Address not found
 *       401:
 *         description: Unauthorized
 */
router.patch("/:id", authRequired(), update);
router.delete("/:id", authRequired(), remove);

/**
 * @swagger
 * /addresses/{id}/default:
 *   patch:
 *     summary: Set address as default
 *     description: Sets the specified address as the user's default address
 *     tags:
 *       - Addresses
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Address ID
 *     responses:
 *       200:
 *         description: Default address updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Address'
 *       404:
 *         description: Address not found
 *       401:
 *         description: Unauthorized
 */
router.patch("/:id/default", authRequired(), makeDefault);

export default router;
