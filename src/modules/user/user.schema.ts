import { z } from "zod";
import { Role } from "@prisma/client";

export const userSchema = z.object({
  firstname: z.string().min(2, "please enter a valid name"),
  lastname: z.string().min(2, "please enter a valid name"),
  mobile: z.string().min(10, "please enter valid mobile number"),
  password: z
    .string({ error: "password required" })
    .min(10, "please enter password")
    .nonempty("please Enter a password"),
  address: z.string().min(1),
  role: z.nativeEnum(Role),
});

export type Iuser = z.infer<typeof userSchema>;
