import { Router } from "express";
import { authRequired, adminOnly } from "../../../middlewares/auth.js";
import { list, detail, adminList, create, update, remove } from "./products.controller.js";

const router = Router();

// Public
router.get("/", list);
router.get("/:id", detail);

// Admin
router.get("/admin/all", authRequired(), adminOnly(), adminList);
router.post("/admin", authRequired(), adminOnly(), create);
router.patch("/admin/:id", authRequired(), adminOnly(), update);
router.delete("/admin/:id", authRequired(), adminOnly(), remove);

export default router;
