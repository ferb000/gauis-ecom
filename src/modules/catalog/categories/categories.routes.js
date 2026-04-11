import { Router } from "express";
import { authRequired, adminOnly } from "../../../middlewares/auth.js";
import { list, create, update, remove } from "./categories.controller.js";

const router = Router();

// Public (customer-facing)
router.get("/", list);

// Admin
router.post("/", authRequired(), adminOnly(), create);
router.patch("/:id", authRequired(), adminOnly(), update);
router.delete("/:id", authRequired(), adminOnly(), remove);

export default router;
