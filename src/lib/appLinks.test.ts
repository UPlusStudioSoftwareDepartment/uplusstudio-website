import { describe, expect, it } from "vitest";
import { linkedInIntent } from "./appLinks";

describe("linkedInIntent", () => {
  it("opens a profile in the LinkedIn app and falls back to the web page", () => {
    const url = "https://www.linkedin.com/in/r%C4%B1dvan-uyar-269abb149/";
    expect(linkedInIntent(url)).toBe(
      `intent://www.linkedin.com/in/r%C4%B1dvan-uyar-269abb149/#Intent;scheme=https;package=com.linkedin.android;S.browser_fallback_url=${encodeURIComponent(url)};end`
    );
  });

  it("keeps post paths", () => {
    expect(linkedInIntent("https://www.linkedin.com/feed/update/urn:li:activity:7510727589314015232/")).toContain(
      "intent://www.linkedin.com/feed/update/urn:li:activity:7510727589314015232/#Intent;"
    );
  });
});
