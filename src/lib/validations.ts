import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.email({ error: "Invalid email address" }),
  subject: z.string().min(2, "Subject is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export type ContactFormValues = z.infer<typeof contactSchema>;

export const getContactSchema = (t?: (key: string) => string) =>
  z.object({
    name: z.string().min(2, t?.("nameError") || "Ad en az 2 karakter olmalıdır"),
    email: z.email({ error: t?.("emailError") || "Geçersiz e-posta adresi" }),
    subject: z.string().min(2, t?.("subjectError") || "Konu zorunludur"),
    message: z.string().min(10, t?.("messageError") || "Mesaj en az 10 karakter olmalıdır"),
  });

const MAX_BASE64_IMAGE_BYTES = 2 * 1024 * 1024;

export const appointmentSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.email({ error: "Invalid email" }),
  phone: z.string().min(1, "Phone is required"),
  service: z.string().min(1, "Service is required"),
  date: z.string().default(""),
  time: z.string().default(""),
  message: z.string().trim().min(10, "Message must be at least 10 characters").max(500),
  passImage: z
    .string()
    .regex(/^data:image\/\w+;base64,/, "Invalid base64 image")
    .refine((val) => {
      const base64 = val.split(",")[1];
      if (!base64) return false;
      const size = (base64.length * 3) / 4;
      return size <= MAX_BASE64_IMAGE_BYTES;
    }, "Image too large"),
});

export type AppointmentPayload = z.infer<typeof appointmentSchema>;

export const appointmentApiSchema = appointmentSchema.omit({ passImage: true });
export type AppointmentApiPayload = z.infer<typeof appointmentApiSchema>;
