// import { Router } from "express";
// import { authRequired, adminOnly } from "../../middlewares/auth.js";
// import {
//   myOrders,
//   myOrderDetail,
//   myCancelOrder,
//   adminOrders,
//   adminOrderDetail,
//   adminSetStatus,
// } from "./orders.controller.js";

// const router = Router();

// // Customer routes
// router.get("/", authRequired(), myOrders);
// router.get("/:id", authRequired(), myOrderDetail);
// router.patch("/:id/cancel", authRequired(), myCancelOrder);

// // Admin routes
// router.get("/admin/all", authRequired(), adminOnly(), adminOrders);
// router.get("/admin/:id", authRequired(), adminOnly(), adminOrderDetail);
// router.patch("/admin/:id/status", authRequired(), adminOnly(), adminSetStatus);

// export default router;


// src/modules/orders/orders.routes.js
import { Router } from "express";
import { authRequired, adminOnly } from "../../middlewares/auth.js";
import {
  myOrders,
  myOrderDetail,
  myCancelOrder,
  adminOrders,
  adminOrderDetail,
  adminSetStatus,
} from "./orders.controller.js";

const router = Router();

/**
 * SAFEST ROUTE ORDER:
 * Put ALL fixed/static paths first, then param routes (/:id).
 * This prevents "/admin/..." being captured by "/:id".
 */

// ===== Admin routes (static prefixes first) =====
router.get("/admin/all", authRequired(), adminOnly(), adminOrders);
router.get("/admin/:id", authRequired(), adminOnly(), adminOrderDetail);
router.patch("/admin/:id/status", authRequired(), adminOnly(), adminSetStatus);

// ===== Customer routes =====
router.get("/", authRequired(), myOrders);
router.patch("/:id/cancel", authRequired(), myCancelOrder);
router.get("/:id", authRequired(), myOrderDetail);

export default router;
