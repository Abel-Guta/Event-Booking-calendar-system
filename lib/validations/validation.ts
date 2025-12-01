import { trim, z } from "zod";

export const authFormSchema = z.object({
  email: z
    .string()
    .email({ message: "Please enter a valid email address." })
    .trim()
    .min(1, { message: "Email is required." })
    .toLowerCase(),
  password: z
    .string()
    .trim()
    .min(8, { message: "Password must be at least 8 characters" })
    .max(100, { message: "Password must be at most 100 characters." }),
});

export const signupauthFormSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters" })
    .max(50, { message: "Name must be at most 50 characters." })
    .trim(),
  email: z
    .string()
    .email({ message: "Please enter a valid email address." })
    .trim()
    .min(1, { message: "Email is required." })
    .toLowerCase(),
  password: z
    .string()
    .trim()
    .min(8, { message: "Password must be at least 8 characters" })
    .max(100, { message: "Password must be at most 100 characters." }),
});
export const verifyFormSchema = z.object({
  email: z
    .string()
    .email({ message: "Please enter a valid email address." })
    .trim()
    .min(1, { message: "Email is required." })
    .toLowerCase(),
  code: z
    .string()
    .min(8, { message: "Code must be at least 8 characters" })
    .max(8, { message: "Code must be at most 8 characters." }),
});
