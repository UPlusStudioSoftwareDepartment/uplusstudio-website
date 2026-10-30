import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { AUDIENCE_SERVICE, GUIDE_AUDIENCES, GUIDE_TOPICS, guides, guidesForProject, guidesForService, guideTaxonomy, relatedGuides } from "./guides";
import { SERVICE_LANDINGS } from "./serviceLandings";
import { getProject, projects } from "./projects";
import { locales } from "./i18n-config";

const publicFile = (src: string) => join(process.cwd(), "public", src);
const services = new Set(SERVICE_LANDINGS.map(({ slug }) => slug));

describe("guide library", () => {
  it("has unique slugs and gives every topic shelf and every reader at least one guide", () => {
    expect(new Set(guides.map((g) => g.slug)).size).toBe(guides.length);
    for (const topic of GUIDE_TOPICS) expect(guides.some((g) => g.topic === topic), topic).toBe(true);
    for (const audience of GUIDE_AUDIENCES) expect(guides.some((g) => g.audiences.includes(audience)), audience).toBe(true);
  });

  it("only links readers and guides to published service pages and real projects", () => {
    for (const service of Object.values(AUDIENCE_SERVICE)) expect(services.has(service), service).toBe(true);
    for (const g of guides) {
      for (const service of [g.service, ...(g.alsoServices ?? [])]) expect(services.has(service), `${g.slug} → ${service}`).toBe(true);
      expect(getProject(g.project), g.slug).toBeDefined();
      expect(g.audiences.length, g.slug).toBeGreaterThan(0);
    }
  });

  it("points every card and drawing at a file that exists", () => {
    for (const g of guides) {
      expect(existsSync(publicFile(g.card)), `${g.slug} card ${g.card}`).toBe(true);
      if (g.diagram) expect(existsSync(publicFile(g.diagram.src)), `${g.slug} diagram`).toBe(true);
    }
  });

  it("explains every numbered badge in both languages", () => {
    for (const g of guides.filter((guide) => guide.diagram?.numbered)) {
      const svg = readFileSync(publicFile(g.diagram!.src), "utf8");
      const badges = new Set([...svg.matchAll(/font-weight="700"[^>]*>(\d+)<\/text>/g)].map(([, n]) => n)).size;
      for (const locale of locales) expect(g.diagram!.items[locale], `${g.slug} ${locale}`).toHaveLength(badges);
    }
  });

  it("only links official sources over HTTPS, with a label in every language", () => {
    for (const g of guides) {
      for (const link of g.links ?? []) {
        expect(link.href, g.slug).toMatch(/^https:\/\//);
        for (const locale of locales) expect(link.label[locale]).toBeTruthy();
      }
    }
  });

  it("keeps the same structure in Turkish and English", () => {
    for (const g of guides) {
      expect(g.copy.en.sections.length, g.slug).toBe(g.copy.tr.sections.length);
      expect(g.copy.en.faq?.length ?? 0, g.slug).toBe(g.copy.tr.faq?.length ?? 0);
    }
    for (const locale of locales) {
      expect(Object.keys(guideTaxonomy[locale].topics).sort()).toEqual([...GUIDE_TOPICS].sort());
      expect(Object.keys(guideTaxonomy[locale].audiences).sort()).toEqual([...GUIDE_AUDIENCES].sort());
    }
  });

  it("does not promise outcomes it cannot prove", () => {
    const banned = [/garanti ediyoruz/i, /kesin(likle)? (artar|satılır)/i, /değerini artırıyoruz/i, /%\s?\d+[^.]{0,30}(değer|kira|satış)/i, /\bguarantee(d)? (a|the|your)\b/i, /(increase|raise)s? (its |the |your )?value by/i];
    for (const g of guides) {
      const text = JSON.stringify(g.copy);
      for (const pattern of banned) expect(text, `${g.slug} ${pattern}`).not.toMatch(pattern);
    }
  });

  it("suggests related reading that excludes the guide itself and connects services and projects", () => {
    for (const g of guides) {
      const related = relatedGuides(g);
      expect(related.length, g.slug).toBeGreaterThan(0);
      expect(related.map((r) => r.slug)).not.toContain(g.slug);
    }
    expect(guidesForService("ticari-mekan-tasarimi-ankara").map((g) => g.slug)).toContain("ticari-mekan-kiralamadan-once");
    expect(guidesForService("cephe-tasarimi-yenileme-ankara").map((g) => g.slug)).toContain("incek-golbasi-villa-yenileme");
    expect(projects.filter((p) => guidesForProject(p.slug).length > 0).length).toBeGreaterThanOrEqual(6);
  });
});
