import { expect, test, type Page } from "@playwright/test";
import { SERVICE_LANDINGS } from "../src/lib/serviceLandings";
import { projects } from "../src/lib/projects";

const PATHS = [
  "",
  "/about",
  "/services",
  ...SERVICE_LANDINGS.map((s) => `/services/${s.slug}`),
  "/projects",
  `/projects/${projects[0].slug}`,
  "/glossary",
  "/contact",
  "/kartvizit",
];
const LOCALES = ["tr", "en"] as const;

function watchErrors(page: Page) {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(m.text());
  });
  return errors;
}

async function audit(page: Page) {
  return page.evaluate(() => {
    const visible = (el: Element) => {
      const r = el.getBoundingClientRect();
      return r.width > 0 && r.height > 0 && getComputedStyle(el).visibility !== "hidden";
    };
    const nameOf = (el: Element) => {
      const labelledBy = el.getAttribute("aria-labelledby");
      const labelled = labelledBy ? document.getElementById(labelledBy)?.textContent : "";
      return (el.getAttribute("aria-label") || labelled || el.textContent || el.getAttribute("title") || "").trim();
    };
    return {
      h1: document.querySelectorAll("h1").length,
      overflow: document.documentElement.scrollWidth - window.innerWidth,
      imagesWithoutAlt: [...document.querySelectorAll("img:not([alt])")].map((i) => (i as HTMLImageElement).src),
      unnamedButtons: [...document.querySelectorAll("button")].filter((b) => visible(b) && !nameOf(b)).map((b) => b.outerHTML.slice(0, 120)),
      unnamedLinks: [...document.querySelectorAll("a[href]")].filter((a) => visible(a) && !nameOf(a)).map((a) => a.outerHTML.slice(0, 120)),
      unsafeBlankLinks: [...document.querySelectorAll('a[target="_blank"]:not([rel~="noopener"])')].map((a) => a.getAttribute("href")),
      brokenAnchors: [...document.querySelectorAll('a[href^="#"]')]
        .map((a) => a.getAttribute("href")!.slice(1))
        .filter((id) => id && !document.getElementById(id)),
    };
  });
}

for (const locale of LOCALES) {
  for (const path of PATHS) {
    test(`/${locale}${path} renders cleanly`, async ({ page }) => {
      const errors = watchErrors(page);
      const res = await page.goto(`/${locale}${path}`);
      expect(res?.status()).toBe(200);
      await page.waitForTimeout(800);
      const report = await audit(page);
      expect(report.h1, "exactly one h1").toBe(1);
      expect(report.overflow, "no horizontal scroll").toBeLessThanOrEqual(1);
      expect(report.imagesWithoutAlt).toEqual([]);
      expect(report.unnamedButtons).toEqual([]);
      expect(report.unnamedLinks).toEqual([]);
      expect(report.unsafeBlankLinks).toEqual([]);
      expect(report.brokenAnchors).toEqual([]);
      expect(errors).toEqual([]);
    });
  }
}

test("every internal link resolves", async ({ request, isMobile }) => {
  test.skip(isMobile, "links are the same on every screen");
  test.setTimeout(180_000);
  const hrefs = new Set<string>();
  for (const locale of LOCALES) {
    for (const path of PATHS) {
      const html = await (await request.get(`/${locale}${path}`)).text();
      for (const [, href] of html.matchAll(/<a\b[^>]*\shref="(\/[^"#]*)/g)) hrefs.add(href.replaceAll("&amp;", "&"));
    }
  }
  const broken: string[] = [];
  for (const href of hrefs) {
    const res = await request.get(href, { maxRedirects: 5 });
    if (res.status() >= 400) broken.push(`${href} → ${res.status()}`);
  }
  expect(hrefs.size).toBeGreaterThan(20);
  expect(broken).toEqual([]);
});

test("unknown pages answer 404 with a way home", async ({ page }) => {
  const res = await page.goto("/tr/bu-sayfa-yok");
  expect(res?.status()).toBe(404);
  await expect(page.getByRole("main").getByRole("link", { name: /Ana sayfa|anasayfa/i }).first()).toHaveAttribute("href", "/tr");
});

test("language switch keeps the visitor on the same page", async ({ page }) => {
  await page.goto("/tr/services");
  await page.getByRole("button", { name: "EN", exact: true }).filter({ visible: true }).click();
  await expect(page).toHaveURL(/\/en\/services$/);
  await expect(page.locator("html")).toHaveAttribute("lang", /^en/);
});

test("page header intro shows before the app hydrates", async ({ page }) => {
  await page.route(/\/_next\/static\/chunks\/.+\.js$/, (route) => route.abort());
  await page.goto("/tr/about");
  const intro = page.locator("header:has(h1)").getByText("Her proje benzersiz bir hikaye anlatır");
  await expect(intro).toBeVisible();
  await expect
    .poll(() =>
      intro.evaluate((el) => {
        let opacity = 1;
        for (let node: Element | null = el; node; node = node.parentElement) opacity *= Number(getComputedStyle(node).opacity);
        return opacity;
      })
    )
    .toBe(1);
});

test("business card opens as a dialog and closes", async ({ page }) => {
  await page.goto("/tr/about");
  await page.getByRole("button", { name: "Kartviziti paylaş" }).filter({ visible: true }).first().click();
  const card = page.getByRole("dialog", { name: "Dijital kartvizit" });
  await expect(card).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(card).toBeHidden();
});

test.describe("phones", () => {
  test.skip(({ isMobile }) => !isMobile, "phone-only behaviour");

  test("menu opens, navigates and closes", async ({ page }) => {
    await page.goto("/tr");
    const toggle = page.getByRole("button", { name: "Menü" });
    await toggle.click();
    const menu = page.getByRole("dialog", { name: "Menü" });
    await expect(menu).toBeVisible();
    await menu.getByRole("button", { name: /Kapat/ }).click();
    await expect(menu).toBeHidden();
    await toggle.click();
    await menu.getByRole("link", { name: /Hakkımızda/ }).click();
    await expect(page).toHaveURL(/\/tr\/about$/);
    await expect(menu).toBeHidden();
  });

  test("business card share options scroll into view above the action bar", async ({ page }) => {
    await page.addInitScript(() => Object.defineProperty(Navigator.prototype, "share", { value: undefined }));
    await page.goto("/tr/about");
    await page.getByRole("button", { name: "Kartviziti paylaş" }).filter({ visible: true }).first().click();
    const card = page.getByRole("dialog", { name: "Dijital kartvizit" });
    const share = card.getByRole("button", { name: "Paylaş", exact: true });
    await expect(share).toBeVisible();
    await card.evaluate((el) => el.scrollTo(0, 0));
    await share.click();
    const copyLink = card.getByRole("button", { name: "Bağlantıyı kopyala" });
    await expect(copyLink).toBeInViewport({ ratio: 1 });
    await expect
      .poll(async () => ((await copyLink.boundingBox())?.y ?? 0) + ((await copyLink.boundingBox())?.height ?? 0) <= ((await share.boundingBox())?.y ?? 0))
      .toBe(true);
  });

  test("booking buttons call the studio, except on the contact page", async ({ page }) => {
    await page.goto("/tr");
    await expect(page.getByRole("link", { name: /Şimdi Ara/ }).first()).toHaveAttribute("href", "tel:+905453204007");
    await expect(page.getByRole("button", { name: /Randevu Al/ }).filter({ visible: true })).toHaveCount(0);
    await page.goto("/tr/contact");
    await expect(page.getByRole("main").getByRole("button", { name: /Randevu Al/ }).filter({ visible: true }).first()).toBeVisible();
  });
});

test.describe("desktop", () => {
  test.skip(({ isMobile }) => isMobile, "desktop-only behaviour");

  test("booking buttons open the appointment form", async ({ page }) => {
    await page.goto("/tr");
    await page.getByRole("button", { name: /Randevu Al/ }).filter({ visible: true }).first().click();
    await expect(page.getByRole("dialog", { name: "Randevu Al" })).toBeVisible();
  });
});
