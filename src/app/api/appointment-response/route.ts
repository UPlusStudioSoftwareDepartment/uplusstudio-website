import { NextResponse } from "next/server";
import { z } from "zod";
import { checkRateLimit } from "@/lib/rateLimit";
import { getEmailTransporter } from "@/lib/email";
import { logger } from "@/lib/logger";
import { buildClientEmail } from "@/lib/appointmentEmail";
import { appointmentReference, readAppointmentToken } from "@/lib/appointmentToken";

const CONTEXT = "api/appointment-response";

const bodySchema = z
  .object({
    token: z.string().min(10),
    action: z.enum(["approve", "decline"]),
    note: z.string().max(1000).default(""),
  })
  .refine((b) => b.action === "approve" || b.note.trim().length >= 3, {
    message: "Reddederken bir açıklama yazın",
    path: ["note"],
  });

export async function POST(req: Request) {
  try {
    const limit = checkRateLimit(req);
    if (!limit.ok) return NextResponse.json({ error: "Too many requests" }, { status: 429 });

    let raw: unknown;
    try {
      raw = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }
    const parsed = bodySchema.safeParse(raw);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues.map((i) => i.message).join(", ") }, { status: 400 });
    }

    const { token, action, note } = parsed.data;
    const appointment = readAppointmentToken(token);
    if (!appointment) return NextResponse.json({ error: "Bağlantı geçersiz ya da süresi dolmuş" }, { status: 400 });

    const origin = new URL(req.url).origin;
    const mail = buildClientEmail(appointment, {
      reference: appointmentReference(token),
      status: action === "approve" ? "approved" : "declined",
      note,
      bookingUrl: `${origin}/tr/contact`,
    });

    const transporter = getEmailTransporter();
    const fromEmail = process.env.GMAIL_USER;
    if (!transporter || !fromEmail) {
      return NextResponse.json({ compose: { to: appointment.email, subject: mail.subject, html: mail.html, text: mail.text } });
    }

    await transporter.sendMail({
      from: `"U+ Studio" <${fromEmail}>`,
      to: appointment.email,
      replyTo: `"U+ Studio" <${process.env.CONTACT_EMAIL || "info@uplusstudio.com.tr"}>`,
      subject: mail.subject,
      html: mail.html,
      text: mail.text,
      attachments: mail.ics
        ? [{ filename: "randevu.ics", content: mail.ics, contentType: "text/calendar; charset=utf-8; method=PUBLISH" }]
        : [],
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    logger.error(CONTEXT, "Failed to send response email", {
      error: err instanceof Error ? err.message : "Unknown error",
    });
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }
}
