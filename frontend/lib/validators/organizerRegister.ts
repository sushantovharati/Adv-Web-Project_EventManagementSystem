import { z } from "zod";

export const organizerRegisterSchema = z.object({
  organizerName: z.string().min(3, "Name must be at least 3 characters long"),
  organizerEmail: z.string().email("Please provide a valid email address"),
  organizerPhone: z.string().min(11, "Please provide a valid phone number"),
  organizerGender: z.enum(["MALE", "FEMALE", "OTHER"], {message: "Please select a valid gender",}),
  organizerDob: z.string().min(1, "Date of birth is required"), 
  organizerJoiningDate: z.string().min(1, "Joining date is required"),
  organizerPassword: z.string().min(6, "Password must be at least 6 characters long"),
});

export type OrganizerRegisterInput = z.infer<typeof organizerRegisterSchema>;
