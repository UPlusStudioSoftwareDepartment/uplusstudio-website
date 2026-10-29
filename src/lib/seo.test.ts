import { describe, expect, it } from "vitest";
import { buildMetadata, serializeJsonLd } from "./seo";

describe("JSON-LD in an HTML script", () => {
  it("cannot terminate its script element, while preserving the original data", () => {
    const data = { "@type": "CreativeWork", name: '</script><img src=x onerror="alert(1)">', description: "İncek & Gölbaşı < Ankara" };
    const serialized = serializeJsonLd(data);
    expect(serialized).not.toContain("<");
    expect(serialized).toContain("\\u003c/script>");
    expect(JSON.parse(serialized)).toEqual(data);
  });

  it("also preserves arrays and nested schema nodes", () => {
    const data = [{ "@graph": [{ name: "<Project>" }] }, { name: "U+ Studio" }];
    expect(JSON.parse(serializeJsonLd(data))).toEqual(data);
  });
});

describe("localized metadata contract", () => {
  for (const locale of ["tr", "en"] as const) {
    it(`${locale}: keeps the page self-canonical and exposes both language equivalents`, () => {
      const metadata = buildMetadata({ locale, path: "/projects/villa-donusumu", title: "Villa", description: "Project description" });
      expect(metadata.alternates).toEqual({
        canonical: `/${locale}/projects/villa-donusumu`,
        languages: { tr: "/tr/projects/villa-donusumu", en: "/en/projects/villa-donusumu", "x-default": "/tr/projects/villa-donusumu" },
      });
    });
  }
});
