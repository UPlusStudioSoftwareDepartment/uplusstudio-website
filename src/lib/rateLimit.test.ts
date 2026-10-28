import { afterEach, describe, it, expect, vi } from "vitest";
import { checkRateLimit, limitRequest } from "./rateLimit";

function mockRequest(ip?: string, path = "/api/test"): Request {
  const headers = new Headers();
  if (ip) headers.set("x-forwarded-for", ip);
  return new Request(`http://localhost${path}`, { headers });
}

describe("checkRateLimit", () => {
  it("allows first request", () => {
    const result = checkRateLimit(mockRequest("1.2.3.4"));
    expect(result.ok).toBe(true);
  });

  it("allows requests under limit", () => {
    const req = mockRequest("5.6.7.8");
    for (let i = 0; i < 10; i++) {
      const r = checkRateLimit(req);
      expect(r.ok).toBe(true);
    }
  });

  it("rejects when over limit", () => {
    const req = mockRequest("9.10.11.12");
    for (let i = 0; i < 10; i++) checkRateLimit(req);
    const result = checkRateLimit(req);
    expect(result.ok).toBe(false);
    expect(result.retryAfter).toBeDefined();
  });

  it("counts each endpoint separately so one booking never blocks the next step", () => {
    for (let i = 0; i < 11; i++) checkRateLimit(mockRequest("13.14.15.16", "/api/appointment-link"));
    expect(checkRateLimit(mockRequest("13.14.15.16", "/api/appointment-link")).ok).toBe(false);
    expect(checkRateLimit(mockRequest("13.14.15.16", "/api/appointment-email")).ok).toBe(true);
  });
});

describe("limitRequest", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it("uses the in-memory limit while Upstash is not configured", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    expect((await limitRequest(mockRequest("21.22.23.24"))).ok).toBe(true);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("counts in Upstash once it is configured", async () => {
    vi.stubEnv("UPSTASH_REDIS_REST_URL", "https://redis.example/");
    vi.stubEnv("UPSTASH_REDIS_REST_TOKEN", "token");
    const fetchMock = vi.fn(async () => Response.json([{ result: 11 }, { result: 0 }, { result: 42000 }]));
    vi.stubGlobal("fetch", fetchMock);
    expect(await limitRequest(mockRequest("31.32.33.34", "/api/contact"))).toEqual({ ok: false, retryAfter: 42 });
    const [url, init] = fetchMock.mock.calls[0] as unknown as [string, { body: string; headers: Record<string, string> }];
    expect(url).toBe("https://redis.example/pipeline");
    expect(init.headers.Authorization).toBe("Bearer token");
    expect(JSON.parse(init.body)[0]).toEqual(["INCR", "rate:/api/contact 31.32.33.34"]);
  });

  it("falls back to memory when Upstash is unreachable", async () => {
    vi.stubEnv("UPSTASH_REDIS_REST_URL", "https://redis.example");
    vi.stubEnv("UPSTASH_REDIS_REST_TOKEN", "token");
    vi.stubGlobal("fetch", vi.fn(async () => Promise.reject(new Error("offline"))));
    expect((await limitRequest(mockRequest("41.42.43.44"))).ok).toBe(true);
  });
});
