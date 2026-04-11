import { Router } from "express";
import { authRequired } from "../../middlewares/auth.js";

const router = Router();

router.get("/me", authRequired(), (req, res) => {
  return res.json({
    success: true,
    user: req.user,
  });
});

export default router;
