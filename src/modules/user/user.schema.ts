import { z } from "zod";
import { Auth, Role } from "../../generated/prisma/enums";

export const userSchema = z.object({
  firstname: z.string().min(2, "please enter a valid name"),
  lastname: z.string().min(2, "please enter a valid name"),
  email: z
    .string({ error: "email required" })
    .email("please enter valid email"),

  mobile: z.string().min(10, "please enter valid mobile number"),
  password: z
    .string({ error: "password required" })
    .min(10, "please enter password")
    .nullable()
    .optional(),
  token: z.string().optional(),
  address: z.string().min(1),
  authProvider:z.nativeEnum(Auth),
  authProviderId:z.string(),
  role: z.nativeEnum(Role),
});

export type Iuser = z.infer<typeof userSchema>;
