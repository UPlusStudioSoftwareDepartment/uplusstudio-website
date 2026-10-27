import { NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/rateLimit";
import { contactSchema } from "@/lib/validations";
import { getEmailTransporter, getContactToEmail } from "@/lib/email";
import { escapeHtml } from "@/lib/sanitize";
import { logger } from "@/lib/logger";

const CONTEXT = "api/contact";

export async function POST(req: Request) {
  try {
    const { ok, retryAfter } = checkRateLimit(req);
    if (!ok) {
      return NextResponse.json(
        { error: "Too many requests" },
        { status: 429, headers: retryAfter ? { "Retry-After": String(retryAfter) } : undefined }
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

    const body = await req.json();
    const parsed = contactSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { name, email, subject, message } = parsed.data;
    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safeSubject = escapeHtml(subject);
    const safeMessage = escapeHtml(message).replace(/\n/g, "<br>");

    await transporter.sendMail({
      from: `"U+ Studio Website" <${process.env.GMAIL_USER}>`,
      to: getContactToEmail(),
      replyTo: email,
      subject: `İletişim Formu: ${safeSubject}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px;">
          <h2>Yeni İletişim Mesajı</h2>
          <p><strong>Ad:</strong> ${safeName}</p>
          <p><strong>E-posta:</strong> ${safeEmail}</p>
          <p><strong>Konu:</strong> ${safeSubject}</p>
          <p><strong>Mesaj:</strong></p>
          <p>${safeMessage}</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    logger.error(CONTEXT, "Failed to send contact message", {
      error: err instanceof Error ? err.message : "Unknown error",
    });
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}
