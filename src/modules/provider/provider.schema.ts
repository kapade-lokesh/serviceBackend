import { z } from "zod";

export const providerSchema = z.object({
  location: z.string(),
  availability: z.boolean(),
  verified: z.boolean(),
});
