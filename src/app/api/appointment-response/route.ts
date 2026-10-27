import { NextResponse } from "next/server";
import { z } from "zod";
import { checkRateLimit } from "@/lib/rateLimit";
import { buildClientEmail } from "@/lib/appointmentEmail";
import { appointmentReference, isStudioSignature, readAppointmentToken } from "@/lib/appointmentToken";
import { TIME_SLOTS, istanbulToday } from "@/lib/appointmentDate";
import { canSendMail, sendMail, studioInbox } from "@/lib/mailer";

const bodySchema = z
  .object({
    token: z.string().min(10),
    action: z.enum(["approve", "decline"]),
    note: z.string().max(1000).default(""),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
    time: z.enum(TIME_SLOTS).optional(),
    signature: z.string().optional(),
  })
  .refine((b) => b.action === "approve" || b.note.trim().length >= 3, {
    message: "Reddederken bir açıklama yazın",
    path: ["note"],
  });

export async function POST(req: Request) {
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

  const approving = action === "approve";
  const date = appointment.date || (approving && parsed.data.date) || "";
  const time = appointment.time || (approving && parsed.data.time) || "";
  if (approving && (!date || !time)) {
    return NextResponse.json({ error: "Onaylamak için görüşme gününü ve saatini seçin" }, { status: 400 });
  }
  if (approving && !appointment.date && date < istanbulToday()) {
    return NextResponse.json({ error: "Geçmiş bir gün seçilemez" }, { status: 400 });
  }

  const origin = new URL(req.url).origin;
  const mail = buildClientEmail({ ...appointment, date, time }, {
    reference: appointmentReference(token),
    status: action === "approve" ? "approved" : "declined",
    note,
    bookingUrl: `${origin}/${appointment.locale === "en" ? "en" : "tr"}/contact`,
  });

  if (canSendMail() && isStudioSignature(token, parsed.data.signature)) {
    try {
      await sendMail({ to: appointment.email, replyTo: studioInbox(), subject: mail.subject, html: mail.html, text: mail.text });
    } catch {
      return NextResponse.json({ error: "E-posta gönderilemedi, lütfen tekrar deneyin" }, { status: 502 });
    }
    return NextResponse.json({ sent: true, to: appointment.email });
  }
  return NextResponse.json({ compose: { to: appointment.email, subject: mail.subject, text: mail.text } });
}
