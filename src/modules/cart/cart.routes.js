import { Router } from "express";
import { authRequired } from "../../middlewares/auth.js";
import { getCart, addItem, updateItem, removeItem } from "./cart.controller.js";

const router = Router();

router.get("/", authRequired(), getCart);
router.post("/items", authRequired(), addItem);
router.patch("/items/:itemId", authRequired(), updateItem);
router.delete("/items/:itemId", authRequired(), removeItem);

export default router;
