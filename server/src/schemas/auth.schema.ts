import { z } from "zod";

export const registerSchema = z
  .object({
    email: z.string().email("not a valid email"),
    password: z.string().min(8, "password must be atleast 8 characters long"),
    confirmPassword: z.string(),
  })
  .refine(
    (data) => data.password === data.confirmPassword,
    "passwords do not match"
  );

export const verifyEmailSchema = z.object({
  id: z.string(),
  code: z.string(),
});

export const loginSchema = z.object({
  email: z.string().email("not a valid email"),
  password: z.string(),
});
