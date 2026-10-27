import { describe, it, expect } from "vitest";
import { STUDIO_ADDRESS, calendarUrl, whatsappNumber } from "./appointmentLinks";

describe("whatsappNumber", () => {
  it.each([
    ["0532 123 45 67", "905321234567"],
    ["532 123 45 67", "905321234567"],
    ["+90 532 123 45 67", "905321234567"],
    ["0090 532 123 45 67", "905321234567"],
    ["+44 20 7946 0000", "442079460000"],
  ])("turns %s into %s", (phone, digits) => {
    expect(whatsappNumber(phone)).toBe(digits);
  });
});

describe("calendarUrl", () => {
  it("books one hour in Istanbul time at the studio address", () => {
    const url = new URL(calendarUrl({ date: "2026-11-04", time: "14:00", title: "U+ Studio — Ayşe", details: "Not" }));
    expect(url.searchParams.get("dates")).toBe("20261104T110000Z/20261104T120000Z");
    expect(url.searchParams.get("location")).toBe(STUDIO_ADDRESS);
    expect(url.searchParams.get("ctz")).toBe("Europe/Istanbul");
  });

  it("blocks the whole day instead of inventing a time when only a day was chosen", () => {
    const url = new URL(calendarUrl({ date: "2026-11-04", time: "", title: "t", details: "d" }));
    expect(url.searchParams.get("dates")).toBe("20261104/20261105");
  });

  it("rolls the all-day end over month boundaries", () => {
    const url = new URL(calendarUrl({ date: "2026-11-30", time: "", title: "t", details: "d" }));
    expect(url.searchParams.get("dates")).toBe("20261130/20261201");
  });

  it("offers no calendar link without a date", () => {
    expect(calendarUrl({ date: "", time: "14:00", title: "t", details: "d" })).toBe("");
  });
});
