
import express from 'express';

const router = express.Router();

/**
 * @swagger
 * /check:
 *   get:
 *     summary: Check endpoint
 *     description: Returns test information
 *     tags:
 *       - Health
 *     responses:
 *       200:
 *         description: Check successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                   example: "A certain User"
 *                 password:
 *                   type: string
 *                   example: "ah well"
 */
router.get('/', (req, res) => {
    res.json({
        name: 'A certain User',
        password: 'ah well',
    });
});

export default router;


