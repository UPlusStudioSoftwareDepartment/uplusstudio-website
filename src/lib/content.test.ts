import { describe, it, expect } from "vitest";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { gmailComposeUrl, mailPlatform, mailtoUrl } from "./gmailCompose";
import { STUDIO_SERVICES } from "./services";
import { OFFICE_LANDING, SERVICE_ORDER, SERVICE_LANDINGS, LANDINGS_BY_BOOKING } from "./serviceLandings";
import { getProject } from "./projects";
import { appointmentSchema } from "./validations";
import { guides } from "./guides";
import { homeMarketing, serviceDecisions } from "./marketingContent";
import { explainers } from "./explainers";
import { AUDIENCES } from "./serviceAudiences";
import { AUDIENCE_LANDINGS } from "./serviceLandingsExtra";
import { projectDiagram, projectInsights } from "./projectInsights";
import { projects } from "./projects";

const publicFile = (url: string) => join(process.cwd(), "public", url);

describe("mail links", () => {
  it("encodes Turkish text and line breaks in mailto links", () => {
    const url = mailtoUrl({ to: "info@uplusstudio.com.tr", subject: "Randevu — İç Mimarlık", text: "Ad: Şükrü\nTarih: 4 Kasım" });
    expect(url.startsWith("mailto:info@uplusstudio.com.tr?subject=")).toBe(true);
    expect(decodeURIComponent(url.split("body=")[1])).toBe("Ad: Şükrü\nTarih: 4 Kasım");
  });

  it("always puts the message into the Gmail draft", () => {
    expect(gmailComposeUrl({ to: "info@uplusstudio.com.tr", subject: "Konu", text: "Merhaba\nMetin" })).toContain("body=Merhaba%0AMetin");
    expect(gmailComposeUrl({ to: "info@uplusstudio.com.tr", subject: "", text: "" })).not.toContain("body=");
  });

  it("treats a server render as desktop", () => {
    expect(mailPlatform()).toBe("desktop");
  });
});

describe("service architecture", () => {
  it("lists the same ten services in both languages", () => {
    expect(STUDIO_SERVICES.tr).toHaveLength(10);
    expect(STUDIO_SERVICES.en).toHaveLength(10);
    expect(STUDIO_SERVICES.tr.map((s) => s.booking)).toEqual(STUDIO_SERVICES.en.map((s) => s.booking));
  });

  it("only links service pages to real projects and unique slugs", () => {
    const slugs = SERVICE_LANDINGS.map((s) => s.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const landing of SERVICE_LANDINGS) {
      for (const slug of landing.projects) expect(getProject(slug), `${landing.slug} → ${slug}`).toBeDefined();
      expect(landing.copy.tr.description.length).toBeLessThanOrEqual(160);
      expect(landing.copy.en.description.length).toBeLessThanOrEqual(160);
    }
  });

  it("maps each landing page to a bookable service", () => {
    for (const landing of SERVICE_LANDINGS) expect(LANDINGS_BY_BOOKING[landing.booking]).toContain(landing.slug);
    for (const [booking, slugs] of Object.entries(LANDINGS_BY_BOOKING)) expect(slugs.length, booking).toBeGreaterThan(0);
  });

  it("lists every service page once in the home order, apart from the office page", () => {
    expect(new Set(SERVICE_ORDER).size).toBe(SERVICE_ORDER.length);
    const audiencePages = new Set<string>(AUDIENCE_LANDINGS);
    const services = SERVICE_LANDINGS.map((l) => l.slug).filter((slug) => slug !== OFFICE_LANDING && !audiencePages.has(slug));
    expect([...SERVICE_ORDER].sort()).toEqual(services.sort());
  });

  it("gives every project matching insight copy and a shipped diagram", () => {
    for (const project of projects) {
      const insight = projectInsights[project.slug];
      expect(insight, project.slug).toBeDefined();
      expect(existsSync(publicFile(projectDiagram(project.slug))), project.slug).toBe(true);
      for (const key of ["items", "gains", "decisions", "goodFor", "questions"] as const) {
        expect(insight.tr[key].length, `${project.slug} ${key}`).toBe(insight.en[key].length);
        expect(insight.tr[key].length, `${project.slug} ${key}`).toBeGreaterThan(0);
      }
    }
  });

  it("links each audience only to published service pages", () => {
    const slugs = new Set(SERVICE_LANDINGS.map((l) => l.slug));
    for (const audience of AUDIENCES) {
      expect(audience.services.length, audience.key).toBeGreaterThan(0);
      for (const slug of audience.services) expect(slugs.has(slug), `${audience.key} → ${slug}`).toBe(true);
      expect(audience.copy.tr.gains.length).toBe(audience.copy.en.gains.length);
    }
  });

  it("gives every explainer complete, matching copy in both languages", () => {
    const used = [...guides.flatMap((g) => g.explainers ?? []), ...SERVICE_LANDINGS.flatMap((l) => l.explainers ?? [])];
    expect(used.length).toBeGreaterThan(0);
    for (const id of Object.keys(explainers) as (keyof typeof explainers)[]) {
      const { tr, en } = explainers[id];
      expect(tr.legend.length, id).toBe(en.legend.length);
      for (const copy of [tr, en]) {
        for (const field of [copy.step, copy.title, copy.short, copy.simple, copy.example, copy.ankara]) expect(field.trim(), id).not.toBe("");
      }
    }
    for (const id of used) expect(explainers[id], id).toBeDefined();
  });

  it("only references diagram files that ship in public/", () => {
    for (const landing of SERVICE_LANDINGS.filter((l) => l.diagram)) {
      expect(existsSync(publicFile(landing.diagram!)), `${landing.slug} → ${landing.diagram}`).toBe(true);
      expect(landing.copy.tr.diagramCaption, `${landing.slug} tr caption`).toBeTruthy();
      expect(landing.copy.en.diagramCaption, `${landing.slug} en caption`).toBeTruthy();
    }
    for (const guide of guides.filter((g) => g.diagram)) {
      expect(existsSync(publicFile(guide.diagram!.src)), `${guide.slug} → ${guide.diagram!.src}`).toBe(true);
      expect(guide.diagram!.caption.tr).toBeTruthy();
      expect(guide.diagram!.caption.en).toBeTruthy();
    }
  });
});

describe("marketing content links", () => {
  it("connects every customer path and guide to published services and real projects", () => {
    const serviceSlugs = new Set(SERVICE_LANDINGS.map(({ slug }) => slug));
    expect(Object.keys(serviceDecisions).sort()).toEqual([...serviceSlugs].sort());
    expect(new Set(guides.map(({ slug }) => slug)).size).toBe(guides.length);
    for (const locale of ["tr", "en"] as const) {
      for (const path of homeMarketing[locale].paths) {
        expect(serviceSlugs.has(path.service)).toBe(true);
        expect(getProject(path.project)).toBeDefined();
      }
      for (const guide of guides) {
        expect(serviceSlugs.has(guide.service)).toBe(true);
        expect(getProject(guide.project)).toBeDefined();
        expect(guide.copy[locale].description.length).toBeLessThanOrEqual(160);
      }
    }
  });
});

describe("appointment api schema", () => {
  const request = {
    name: "Test Kişi",
    email: "test@example.com",
    phone: "0532 123 45 67",
    service: "İç Mimarlık",
    message: "Salon ve mutfak için keşif görüşmesi.",
  };

  it("only accepts a request with the day and time the visitor picked", () => {
    expect(appointmentSchema.safeParse({ ...request, date: "2026-11-04", time: "14:00" }).success).toBe(true);
    expect(appointmentSchema.safeParse(request).success).toBe(false);
    expect(appointmentSchema.safeParse({ ...request, date: "2026-11-04" }).success).toBe(false);
    expect(appointmentSchema.safeParse({ ...request, date: "2026-11-04", time: "13:37" }).success).toBe(false);
  });
});
