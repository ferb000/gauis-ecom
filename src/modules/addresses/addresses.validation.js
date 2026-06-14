import { z } from "zod";

export const createAddressSchema = z.object({
  label: z.string().max(50).optional(),
  street: z.string().min(2),
  city: z.string().min(2),
  region: z.string().max(100).optional(),
  is_default: z.boolean().optional(), // if true, we’ll enforce it properly
});

export const updateAddressSchema = z.object({
  label: z.string().max(50).optional(),
  street: z.string().min(2).optional(),
  city: z.string().min(2).optional(),
  region: z.string().max(100).optional(),
});
