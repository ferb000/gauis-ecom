import { z } from "zod";

export const checkoutSchema = z.object({
  address_id: z.string().uuid(),
});
