import { NextResponse } from "next/server";
import { appointmentApiSchema } from "@/lib/validations";
import { checkRateLimit } from "@/lib/rateLimit";
import { getEmailTransporter } from "@/lib/email";
import { buildCustomerPassEmail } from "@/lib/appointmentEmail";
import { appointmentReference, createAppointmentToken } from "@/lib/appointmentToken";
import { logger } from "@/lib/logger";

const CONTEXT = "api/send-appointment";

export async function POST(req: Request) {
  try {
    const rateLimitResult = checkRateLimit(req);
    if (!rateLimitResult.ok) {
      return NextResponse.json(
        { error: "Too many requests" },
        {
          status: 429,
          headers: rateLimitResult.retryAfter
            ? { "Retry-After": String(rateLimitResult.retryAfter) }
            : undefined,
        }
      );
    }

    const transporter = getEmailTransporter();
    if (!transporter) {
      logger.warn(CONTEXT, "Email service not configured");
      return NextResponse.json(
        { error: "Email service not configured" },
        { status: 500 }
      );
    }

    const fromEmail = process.env.GMAIL_USER;
    if (!fromEmail) {
      logger.warn(CONTEXT, "GMAIL_USER not configured");
      return NextResponse.json(
        { error: "Email service not configured" },
        { status: 500 }
      );
    }

    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const parseResult = appointmentApiSchema.safeParse(body);
    if (!parseResult.success) {
      const messages = parseResult.error.issues.map((i) => i.message);
      const message = messages.length > 0 ? messages.join(", ") : "Invalid request";
      return NextResponse.json({ error: message }, { status: 400 });
    }

    const { name, email, phone, service, date, time, message } = parseResult.data;

    const details = { name, email, phone, service, date, time, message };
    const token = createAppointmentToken(details);
    if (!token) {
      logger.warn(CONTEXT, "APPOINTMENT_SECRET not configured");
      return NextResponse.json({ error: "Email service not configured" }, { status: 500 });
    }
    const origin = new URL(req.url).origin;
    const link = (page: string) => `${origin}/tr/${page}?t=${encodeURIComponent(token)}`;
    const mail = buildCustomerPassEmail(details, {
      reference: appointmentReference(token),
      confirmUrl: link("randevu-onay"),
      editUrl: link("randevu-duzelt"),
      cancelUrl: link("randevu-iptal"),
    });

    await transporter.sendMail({
      from: `"U+ Studio" <${fromEmail}>`,
      to: email,
      replyTo: `"U+ Studio" <${process.env.CONTACT_EMAIL || "info@uplusstudio.com.tr"}>`,
      subject: mail.subject,
      html: mail.html,
      text: mail.text,
    });
    return NextResponse.json({ success: true });
  } catch (err) {
    logger.error(CONTEXT, "Failed to send appointment email", {
      error: err instanceof Error ? err.message : "Unknown error",
    });
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }
}
