import { describe, it, expect } from "vitest";
import { gmailComposeUrl, mailPlatform, mailtoUrl } from "./gmailCompose";
import { STUDIO_SERVICES } from "./services";
import { SERVICE_LANDINGS, LANDING_BY_BOOKING } from "./serviceLandings";
import { getProject } from "./projects";
import { appointmentSchema } from "./validations";
import { guides } from "./guides";
import { homeMarketing, serviceDecisions } from "./marketingContent";

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
    for (const landing of SERVICE_LANDINGS) expect(LANDING_BY_BOOKING[landing.booking]).toBe(landing.slug);
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
