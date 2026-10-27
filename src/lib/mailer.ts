import nodemailer, { type Transporter } from "nodemailer";
import { studioInfo } from "./studio-info";

let transport: Transporter | undefined;

export function canSendMail() {
  return Boolean(process.env.GMAIL_USER && process.env.GMAIL_PASS);
}

export function studioInbox() {
  return process.env.APPOINTMENT_TO || studioInfo.formInbox;
}

export async function sendMail(mail: { to: string; subject: string; text: string; html?: string; replyTo?: string }) {
  transport ??= nodemailer.createTransport({
    service: "gmail",
    auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_PASS },
  });
  await transport.sendMail({ from: `"U+ Studio" <${process.env.GMAIL_USER}>`, ...mail });
}
