import { z } from "zod";

export const organizerLoginSchema = z.object({
  organizerEmail: z.string().email("Please provide a valid email address"),
  organizerPassword: z.string().min(6, "Invalid Password"),
});

export type OrganizerLoginInput = z.infer<typeof organizerLoginSchema>;
