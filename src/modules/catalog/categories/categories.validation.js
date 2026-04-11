import { z } from "zod";

export const createCategorySchema = z.object({
  name: z.string().min(2).max(100),
  description: z.string().max(1000).optional(),
  image_url: z.string().url().optional(),
});

export const updateCategorySchema = z.object({
  name: z.string().min(2).max(100).optional(),
  description: z.string().max(1000).optional(),
  image_url: z.string().url().optional(),
});
