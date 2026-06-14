import { checkoutSchema } from "./checkout.validation.js";
import { checkout } from "./checkout.service.js";

export async function checkoutHandler(req, res, next) {
  try {
    const payload = checkoutSchema.parse(req.body);
    const result = await checkout(req.user.id, payload.address_id);

    return res.status(201).json({
      success: true,
      message: "Order created",
      order: result.order,
    });
  } catch (err) {
    next(err);
  }
}
