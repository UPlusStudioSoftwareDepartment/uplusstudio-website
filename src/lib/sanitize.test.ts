import { describe, it, expect } from "vitest";
import { escapeHtml } from "./sanitize";

describe("escapeHtml", () => {
  it("escapes ampersand", () => {
    expect(escapeHtml("a & b")).toBe("a &amp; b");
  });

  it("escapes less than and greater than", () => {
    expect(escapeHtml("<script>")).toBe("&lt;script&gt;");
  });

  it("escapes double and single quotes", () => {
    expect(escapeHtml('"foo"')).toBe("&quot;foo&quot;");
    expect(escapeHtml("'bar'")).toBe("&#x27;bar&#x27;");
  });

  it("returns empty string for non-string input", () => {
    expect(escapeHtml(null as unknown as string)).toBe("");
    expect(escapeHtml(undefined as unknown as string)).toBe("");
  });

  it("leaves safe text unchanged", () => {
    expect(escapeHtml("Hello World")).toBe("Hello World");
  });
});
