import { Router } from "express";
import { authRequired } from "../../middlewares/auth.js";
import { list, create, update, makeDefault, remove } from "./addresses.controller.js";

const router = Router();

router.get("/", authRequired(), list);
router.post("/", authRequired(), create);
router.patch("/:id", authRequired(), update);
router.patch("/:id/default", authRequired(), makeDefault);
router.delete("/:id", authRequired(), remove);

export default router;
