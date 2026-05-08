import * as z from "zod";

export const registerSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(8, "Password should be minimum 8 characters in length"),
  firstName: z.string().trim().min(1),
  lastName: z.string().trim().min(1),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

// Inferred Types
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
