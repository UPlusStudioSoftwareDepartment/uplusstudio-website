
import nodemailer from "nodemailer";
import type { Transporter } from "nodemailer";

let cachedTransporter: Transporter | null = null;

export function getEmailTransporter(): Transporter | null {
  if (cachedTransporter) return cachedTransporter;
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_PASS;
  if (!user || !pass) return null;
  cachedTransporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass },
  });
  return cachedTransporter;
}

export function getContactToEmail(): string {
  return process.env.CONTACT_EMAIL || process.env.GMAIL_USER || "info@uplusstudio.com.tr";
}
