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

type Limit = { ok: boolean; retryAfter?: number };

export async function limitRequest(req: Request): Promise<Limit> {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return checkRateLimit(req);
  const key = `rate:${getClientId(req)}`;
  try {
    const res = await fetch(`${url.replace(/\/$/, "")}/pipeline`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify([["INCR", key], ["PEXPIRE", key, windowMs, "NX"], ["PTTL", key]]),
      cache: "no-store",
    });
    if (!res.ok) return checkRateLimit(req);
    const [count, , ttl] = (await res.json()) as { result: number }[];
    return count.result > maxRequests ? { ok: false, retryAfter: Math.max(1, Math.ceil(ttl.result / 1000)) } : { ok: true };
  } catch {
    return checkRateLimit(req);
  }
}

export function checkRateLimit(req: Request): Limit {
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
