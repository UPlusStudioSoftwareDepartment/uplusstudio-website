import { limitRequest } from "@/lib/rateLimit";

const MAX_BYTES = 4096;

export async function POST(req: Request) {
  const limit = await limitRequest(req);
  if (!limit.ok) return new Response(null, { status: 429 });
  const body = await req.text();
  if (body.length > MAX_BYTES) return new Response(null, { status: 413 });
  try {
    const report = JSON.parse(body) as Record<string, unknown>;
    const field = (name: string) => (typeof report[name] === "string" ? (report[name] as string) : undefined);
    console.error("[client-error]", JSON.stringify({ message: field("message"), page: field("page"), digest: field("digest"), stack: field("stack"), ua: req.headers.get("user-agent") }));
  } catch {
    return new Response(null, { status: 400 });
  }
  return new Response(null, { status: 204 });
}
