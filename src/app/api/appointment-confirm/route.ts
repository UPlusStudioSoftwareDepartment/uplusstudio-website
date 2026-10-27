import { NextResponse } from "next/server";
import { z } from "zod";
import { checkRateLimit } from "@/lib/rateLimit";
import { getEmailTransporter } from "@/lib/email";
import { logger } from "@/lib/logger";
import { buildStudioEmail } from "@/lib/appointmentEmail";
import { appointmentReference, readAppointmentToken } from "@/lib/appointmentToken";

const CONTEXT = "api/appointment-confirm";
const APPOINTMENT_TO = process.env.APPOINTMENT_TO || "emrahkolemenoglu@gmail.com";

const bodySchema = z.object({ token: z.string().min(10) });

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
    if (!parsed.success) return NextResponse.json({ error: "Invalid request" }, { status: 400 });

    const { token } = parsed.data;
    const appointment = readAppointmentToken(token);
    if (!appointment) return NextResponse.json({ error: "Bağlantı geçersiz ya da süresi dolmuş" }, { status: 400 });

    const transporter = getEmailTransporter();
    const fromEmail = process.env.GMAIL_USER;
    if (!transporter || !fromEmail) {
      logger.warn(CONTEXT, "Email service not configured");
      return NextResponse.json({ error: "Email service not configured" }, { status: 500 });
    }

    const origin = new URL(req.url).origin;
    const respond = (action: "approve" | "decline") => `${origin}/tr/randevu-yanit?a=${action}&t=${encodeURIComponent(token)}`;
    const mail = buildStudioEmail(appointment, {
      reference: appointmentReference(token),
      approveUrl: respond("approve"),
      declineUrl: respond("decline"),
    });

    await transporter.sendMail({
      from: `"U+ Studio Randevu" <${fromEmail}>`,
      to: APPOINTMENT_TO,
      replyTo: `"${appointment.name.replace(/"/g, "")}" <${appointment.email}>`,
      subject: mail.subject,
      html: mail.html,
      text: mail.text,
      attachments: mail.ics
        ? [{ filename: "randevu.ics", content: mail.ics, contentType: "text/calendar; charset=utf-8; method=PUBLISH" }]
        : [],
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    logger.error(CONTEXT, "Failed to forward confirmed appointment", {
      error: err instanceof Error ? err.message : "Unknown error",
    });
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }
}
