import { NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/rateLimit";
import { contactSchema } from "@/lib/validations";
import { buildContactEmail } from "@/lib/contactEmail";
import { canSendMail, sendMail, studioInbox } from "@/lib/mailer";

export async function POST(req: Request) {
  const { ok, retryAfter } = checkRateLimit(req);
  if (!ok) {
    return NextResponse.json(
      { error: "Too many requests" },
      { status: 429, headers: retryAfter ? { "Retry-After": String(retryAfter) } : undefined }
    );
  }

  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  const parsed = contactSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues.map((i) => i.message).join(", ") }, { status: 400 });
  }

  const mail = buildContactEmail(parsed.data);
  if (!canSendMail()) return NextResponse.json({ sent: false, ...mail });
  try {
    await sendMail({ to: studioInbox(), replyTo: parsed.data.email, ...mail });
  } catch {
    return NextResponse.json({ error: "Mesaj gönderilemedi" }, { status: 502 });
  }
  return NextResponse.json({ sent: true });
}
