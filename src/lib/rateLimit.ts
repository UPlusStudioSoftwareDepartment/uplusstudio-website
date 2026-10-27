
const windowMs = 60 * 1000; 
const maxRequests = 5;

const store = new Map<string, { count: number; resetAt: number }>();

function getClientId(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  const realIp = req.headers.get("x-real-ip");
  return forwarded?.split(",")[0]?.trim() || realIp || "unknown";
}

export function checkRateLimit(req: Request): { ok: boolean; retryAfter?: number } {
  const id = getClientId(req);
  const now = Date.now();
  const entry = store.get(id);

  if (!entry) {
    store.set(id, { count: 1, resetAt: now + windowMs });
    return { ok: true };
  }

  if (now > entry.resetAt) {
    store.set(id, { count: 1, resetAt: now + windowMs });
    return { ok: true };
  }

  entry.count++;
  if (entry.count > maxRequests) {
    return { ok: false, retryAfter: Math.ceil((entry.resetAt - now) / 1000) };
  }
  return { ok: true };
}
