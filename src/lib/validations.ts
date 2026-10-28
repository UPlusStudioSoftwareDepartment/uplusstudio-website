import { z } from "zod";
import { TIME_SLOTS } from "./appointmentDate";

export function isPersonName(value: string) {
  return /^\p{L}[\p{L}\p{M}\s'’.-]*$/u.test(value.trim());
}

export function isPhoneNumber(value: string) {
  const compact = value.replace(/[\s().-]/g, "");
  const digits = compact.replace(/\D/g, "");
  if (/^(\+|00)/.test(compact) && !/^(\+|00)90/.test(compact)) return digits.length >= 8 && digits.length <= 15;
  return /^(?:90)?0?[2-58]\d{9}$/.test(digits);
}

export const getContactSchema = (t?: (key: string) => string) => {
  const nameError = t?.("nameError") || "Adınızı ve soyadınızı yazın";
  const phoneError = t?.("phoneError") || "Geçerli bir telefon numarası girin";
  const subjectError = t?.("subjectError") || "Konu seçin";
  const messageError = t?.("messageError") || "Mesajınız en az 10 karakter olmalıdır";
  return z.object({
    name: z.string({ error: nameError }).trim().min(3, nameError).refine(isPersonName, nameError),
    email: z.email({ error: t?.("emailError") || "Geçersiz e-posta adresi" }),
    phone: z.string({ error: phoneError }).refine(isPhoneNumber, phoneError),
    subject: z.string({ error: subjectError }).trim().min(1, subjectError),
    message: z
      .string({ error: messageError })
      .trim()
      .min(10, messageError)
      .max(2000, t?.("messageMax") || "Mesajınız en fazla 2000 karakter olabilir"),
  });
};

export const contactSchema = getContactSchema().extend({ locale: z.enum(["tr", "en"]).default("tr") });

export type ContactFormValues = z.infer<ReturnType<typeof getContactSchema>>;

export const appointmentSchema = z.object({
  name: z.string().trim().min(3, "Name is required").refine(isPersonName, "Invalid name"),
  email: z.email({ error: "Invalid email" }),
  phone: z.string().refine(isPhoneNumber, "Invalid phone"),
  service: z.string().min(1, "Service is required"),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date is required"),
  time: z.enum(TIME_SLOTS, { error: "Time is required" }),
  message: z.string().trim().min(10, "Message must be at least 10 characters").max(500),
  locale: z.enum(["tr", "en"]).default("tr"),
});
