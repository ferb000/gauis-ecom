import { updateOrderStatusSchema } from "./orders.validation.js";
import {
  listMyOrders,
  getMyOrderDetail,
  cancelMyOrder,
  adminListOrders,
  adminGetOrderDetail,
  adminUpdateOrderStatus,
} from "./orders.service.js";

// Customer
export async function myOrders(req, res, next) {
  try {
    const orders = await listMyOrders(req.user.id);
    res.json({ success: true, orders });
  } catch (err) { next(err); }
}

export async function myOrderDetail(req, res, next) {
  try {
    const data = await getMyOrderDetail(req.user.id, req.params.id);
    if (!data) return res.status(404).json({ success: false, message: "Order not found" });
    res.json({ success: true, ...data });
  } catch (err) { next(err); }
}

export async function myCancelOrder(req, res, next) {
  try {
    const updated = await cancelMyOrder(req.user.id, req.params.id);
    if (!updated) {
      return res.status(409).json({
        success: false,
        message: "Order cannot be cancelled (not found or not pending)",
      });
    }
    res.json({ success: true, order: updated });
  } catch (err) { next(err); }
}

// Admin
export async function adminOrders(req, res, next) {
  try {
    const { status } = req.query;
    const orders = await adminListOrders({ status });
    res.json({ success: true, orders });
  } catch (err) { next(err); }
}

export async function adminOrderDetail(req, res, next) {
  try {
    const data = await adminGetOrderDetail(req.params.id);
    if (!data) return res.status(404).json({ success: false, message: "Order not found" });
    res.json({ success: true, ...data });
  } catch (err) { next(err); }
}

export async function adminSetStatus(req, res, next) {
  try {
    const payload = updateOrderStatusSchema.parse(req.body);
    const updated = await adminUpdateOrderStatus(req.params.id, payload.status);
    if (!updated) return res.status(404).json({ success: false, message: "Order not found" });
    res.json({ success: true, order: updated });
  } catch (err) { next(err); }
}
