const windowMs = 60 * 1000;
const maxRequests = 10;

const store = new Map<string, { count: number; resetAt: number }>();

function getClientId(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  const realIp = req.headers.get("x-real-ip");
  const ip = forwarded?.split(",")[0]?.trim() || realIp || "unknown";
  return `${new URL(req.url).pathname} ${ip}`;
}

function dropExpired(now: number) {
  for (const [id, entry] of store) if (now > entry.resetAt) store.delete(id);
}

export function checkRateLimit(req: Request): { ok: boolean; retryAfter?: number } {
  const id = getClientId(req);
  const now = Date.now();
  const entry = store.get(id);

  if (!entry || now > entry.resetAt) {
    if (store.size > 1000) dropExpired(now);
    store.set(id, { count: 1, resetAt: now + windowMs });
    return { ok: true };
  }

  entry.count++;
  if (entry.count > maxRequests) {
    return { ok: false, retryAfter: Math.ceil((entry.resetAt - now) / 1000) };
  }
  return { ok: true };
}
