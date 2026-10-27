import { NextResponse } from "next/server";
import { z } from "zod";
import { checkRateLimit } from "@/lib/rateLimit";
import { buildStudioEmail } from "@/lib/appointmentEmail";
import { appointmentReference, readAppointmentToken } from "@/lib/appointmentToken";

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

  const origin = new URL(req.url).origin;
  const respond = (action: "approve" | "decline") => `${origin}/tr/randevu-yanit?a=${action}&t=${encodeURIComponent(token)}`;
  const mail = buildStudioEmail(appointment, {
    reference: appointmentReference(token),
    approveUrl: respond("approve"),
    declineUrl: respond("decline"),
  });
  return NextResponse.json({ subject: mail.subject, html: mail.html, text: mail.text });
}
