import { z } from "zod";

export const createProductSchema = z.object({
  category_id: z.string().uuid(),
  name: z.string().min(2).max(255),
  description: z.string().max(5000).optional(),
  price: z.number().positive(),
  discount_price: z.number().positive().optional(),
  unit: z.string().max(50).optional(),
  image_url: z.string().url().optional(),
  is_active: z.boolean().optional(),
});

export const updateProductSchema = z.object({
  category_id: z.string().uuid().optional(),
  name: z.string().min(2).max(255).optional(),
  description: z.string().max(5000).optional(),
  price: z.number().positive().optional(),
  discount_price: z.number().positive().optional(),
  unit: z.string().max(50).optional(),
  image_url: z.string().url().optional(),
  is_active: z.boolean().optional(),
});
