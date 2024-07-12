import { z } from "zod";

const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/;

export const UserFormValidation = z.object({
  name: z.string()
    .min(2, "Name must be at least 2 characters.")
    .max(40, "Name must be at most 40 characters."),
  email: z.string()
    .email("Invalid email address."),
  phone: z.string()
    .refine((phone) => phoneRegex.test(phone), { message: "Invalid phone number format." })
});
