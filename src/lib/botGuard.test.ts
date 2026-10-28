import { afterEach, describe, expect, it, vi } from "vitest";
import { filledHoneypot, passesTurnstile } from "./botGuard";

const request = () => new Request("https://example.com/api/contact", { method: "POST", headers: { "x-forwarded-for": "1.2.3.4, 5.6.7.8" } });

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe("filledHoneypot", () => {
  it("lets people through and stops bots that fill the hidden field", () => {
    expect(filledHoneypot({ name: "Ayşe", u_hp: "" })).toBe(false);
    expect(filledHoneypot({ name: "Ayşe" })).toBe(false);
    expect(filledHoneypot(null)).toBe(false);
    expect(filledHoneypot({ u_hp: "https://spam.example" })).toBe(true);
  });
});

describe("passesTurnstile", () => {
  it("is open while no secret key is configured", async () => {
    expect(await passesTurnstile({}, request())).toBe(true);
  });

  it("asks Cloudflare once a secret key is set", async () => {
    vi.stubEnv("TURNSTILE_SECRET_KEY", "secret");
    const fetchMock = vi.fn(async () => Response.json({ success: true }));
    vi.stubGlobal("fetch", fetchMock);
    expect(await passesTurnstile({ turnstile: "token" }, request())).toBe(true);
    const body = (fetchMock.mock.calls[0] as unknown as [string, { body: URLSearchParams }])[1].body;
    expect(body.get("response")).toBe("token");
    expect(body.get("remoteip")).toBe("1.2.3.4");
  });

  it("rejects a missing token, a failed check and a network error", async () => {
    vi.stubEnv("TURNSTILE_SECRET_KEY", "secret");
    expect(await passesTurnstile({}, request())).toBe(false);
    vi.stubGlobal("fetch", vi.fn(async () => Response.json({ success: false })));
    expect(await passesTurnstile({ turnstile: "token" }, request())).toBe(false);
    vi.stubGlobal("fetch", vi.fn(async () => Promise.reject(new Error("offline"))));
    expect(await passesTurnstile({ turnstile: "token" }, request())).toBe(false);
  });
});
