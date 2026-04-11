import { z } from "zod";

export const upsertInventorySchema = z.object({
  product_id: z.string().uuid(),
  quantity: z.number().int().nonnegative(),
  low_stock_alert: z.number().int().nonnegative().optional(),
});

export const adjustStockSchema = z.object({
  delta: z.number().int(), // can be + or -
  reason: z.string().min(2).max(255).optional(),
});
