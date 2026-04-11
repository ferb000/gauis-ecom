import { addToCartSchema, updateCartItemSchema } from "./cart.validation.js";
import { getCartDetails, addToCart, updateCartItemQuantity, removeCartItem } from "./cart.service.js";

export async function getCart(req, res, next) {
  try {
    const data = await getCartDetails(req.user.id);
    res.json({ success: true, ...data });
  } catch (err) { next(err); }
}

export async function addItem(req, res, next) {
  try {
    const payload = addToCartSchema.parse(req.body);
    const result = await addToCart(req.user.id, payload.product_id, payload.quantity);
    res.status(201).json({ success: true, ...result });
  } catch (err) { next(err); }
}

export async function updateItem(req, res, next) {
  try {
    const payload = updateCartItemSchema.parse(req.body);
    const item = await updateCartItemQuantity(req.user.id, req.params.itemId, payload.quantity);
    res.json({ success: true, item });
  } catch (err) { next(err); }
}

export async function removeItem(req, res, next) {
  try {
    const result = await removeCartItem(req.user.id, req.params.itemId);
    if (!result.deleted) return res.status(404).json({ success: false, message: "Cart item not found" });
    res.json({ success: true, ...result });
  } catch (err) { next(err); }
}
