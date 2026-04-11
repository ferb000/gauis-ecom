import { Router } from "express";
import { authRequired } from "../../middlewares/auth.js";
import { checkoutHandler } from "./checkout.controller.js";

const router = Router();

router.post("/", authRequired(), checkoutHandler);

export default router;
