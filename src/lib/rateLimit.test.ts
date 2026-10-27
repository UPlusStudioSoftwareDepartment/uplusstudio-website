import { describe, it, expect } from "vitest";
import { checkRateLimit } from "./rateLimit";

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
