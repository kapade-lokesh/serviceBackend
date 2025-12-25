import { z } from "zod";

export const authSchema = z.object({
  email: z
    .string({ error: "Email Required" })
    .email("Please Enter  Valid Email"),
  password: z
    .string({ error: "Password is required" })
    .min(1, "Please Enter Valid Password"),
});

export type Iauth = z.infer<typeof authSchema>;
