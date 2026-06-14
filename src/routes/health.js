import express from 'express';

const router = express.Router();

/**
 * @swagger
 * /health:
 *   get:
 *     summary: API health check
 *     description: Checks if the API is running and responding
 *     tags:
 *       - Health
 *     responses:
 *       200:
 *         description: API is healthy
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HealthResponse'
 *             examples:
 *               success:
 *                 value:
 *                   ok: true
 */
router.get('/', (req, res) => res.json({ ok: true }));

export default router;
