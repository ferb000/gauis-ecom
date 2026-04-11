import { Router } from "express";
import { authRequired, adminOnly } from "../../middlewares/auth.js";
import { upsert, adjust, getOne, list } from "./inventory.contrroller.js";

const router = Router();

// Admin inventory management
router.get("/admin", authRequired(), adminOnly(), list);
router.get("/admin/:productId", authRequired(), adminOnly(), getOne);
router.post("/admin", authRequired(), adminOnly(), upsert);
router.patch("/admin/:productId/adjust", authRequired(), adminOnly(), adjust);

export default router;
