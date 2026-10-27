import { NextResponse } from "next/server";
import { appointmentSchema } from "@/lib/validations";
import { checkRateLimit } from "@/lib/rateLimit";
import { createAppointmentToken } from "@/lib/appointmentToken";

export async function POST(req: Request) {
  const limit = checkRateLimit(req);
  if (!limit.ok) return NextResponse.json({ error: "Too many requests" }, { status: 429 });

  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  const locale = (raw as { locale?: string })?.locale === "en" ? "en" : "tr";
  const parsed = appointmentSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues.map((i) => i.message).join(", ") }, { status: 400 });
  }

  const token = createAppointmentToken(parsed.data);
  if (!token) return NextResponse.json({ error: "Not configured" }, { status: 500 });

  const origin = new URL(req.url).origin;
  const via = (raw as { via?: string })?.via === "mail" ? "?k=mail" : "";
  return NextResponse.json({
    token,
    url: `${origin}/${locale}/randevu-kart/${token}${via}`,
    image: `${origin}/api/appointment-card?t=${encodeURIComponent(token)}`,
  });
}
