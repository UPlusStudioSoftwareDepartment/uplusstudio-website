import { NextResponse } from "next/server";
import { z } from "zod";
import { checkRateLimit } from "@/lib/rateLimit";
import { buildStudioEmail } from "@/lib/appointmentEmail";
import { appointmentReference, readAppointmentToken, studioSignature } from "@/lib/appointmentToken";
import { canSendMail, sendMail, studioInbox } from "@/lib/mailer";

const bodySchema = z.object({ token: z.string().min(10) });

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
  if (!parsed.success) return NextResponse.json({ error: "Invalid request" }, { status: 400 });

  const { token } = parsed.data;
  const appointment = readAppointmentToken(token);
  if (!appointment) return NextResponse.json({ error: "Invalid token" }, { status: 400 });

  if (!canSendMail()) return NextResponse.json({ sent: false });

  const origin = new URL(req.url).origin;
  const respond = (action: "approve" | "decline") =>
    `${origin}/tr/randevu-yanit?a=${action}&t=${encodeURIComponent(token)}&s=${studioSignature(token)}`;
  const mail = buildStudioEmail(appointment, { reference: appointmentReference(token), approveUrl: respond("approve"), declineUrl: respond("decline") });
  try {
    await sendMail({ to: studioInbox(), replyTo: appointment.email, subject: mail.subject, html: mail.html, text: mail.text });
  } catch {
    return NextResponse.json({ error: "Randevu talebi gönderilemedi" }, { status: 502 });
  }
  return NextResponse.json({ sent: true });
}
