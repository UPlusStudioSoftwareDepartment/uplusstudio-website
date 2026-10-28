import { NextResponse } from "next/server";
import { limitRequest } from "@/lib/rateLimit";
import { filledHoneypot, passesTurnstile } from "@/lib/botGuard";
import { contactSchema } from "@/lib/validations";
import { buildContactEmail, buildContactHtml } from "@/lib/contactEmail";
import { canSendMail, sendMail, studioInbox } from "@/lib/mailer";

export async function POST(req: Request) {
  const { ok, retryAfter } = await limitRequest(req);
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
  if (filledHoneypot(raw)) return NextResponse.json({ sent: true });
  if (!(await passesTurnstile(raw, req))) return NextResponse.json({ error: "Verification failed" }, { status: 403 });
  const parsed = contactSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues.map((i) => i.message).join(", ") }, { status: 400 });
  }

  const mail = buildContactEmail(parsed.data);
  if (!canSendMail()) return NextResponse.json({ sent: false, ...mail });
  try {
    await sendMail({ to: studioInbox(), replyTo: parsed.data.email, ...mail, html: buildContactHtml(parsed.data) });
  } catch {
    return NextResponse.json({ error: "Mesaj gönderilemedi" }, { status: 502 });
  }
  return NextResponse.json({ sent: true });
}
