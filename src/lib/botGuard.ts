export const HONEYPOT_FIELD = "u_hp";
export const TURNSTILE_FIELD = "turnstile";

const field = (body: unknown, name: string) => (typeof body === "object" && body !== null ? (body as Record<string, unknown>)[name] : undefined);

export function filledHoneypot(body: unknown): boolean {
  const value = field(body, HONEYPOT_FIELD);
  return typeof value === "string" && value.length > 0;
}

export async function passesTurnstile(body: unknown, req: Request): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true;
  const response = field(body, TURNSTILE_FIELD);
  if (typeof response !== "string" || !response) return false;
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  try {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body: new URLSearchParams({ secret, response, ...(ip ? { remoteip: ip } : {}) }),
    });
    return ((await res.json()) as { success?: boolean }).success === true;
  } catch {
    return false;
  }
}
