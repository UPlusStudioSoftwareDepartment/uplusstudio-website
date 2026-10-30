import { expect, test } from "@playwright/test";
import { guides } from "../src/lib/guides";
import { homeMarketing, serviceDecisions } from "../src/lib/marketingContent";

for (const locale of ["tr", "en"] as const) {
  test(`${locale}: every service has its own server-rendered decision content`, async ({ request }) => {
    for (const [slug, copy] of Object.entries(serviceDecisions)) {
      const response = await request.get(`/${locale}/services/${slug}`);
      expect(response.status()).toBe(200);
      const html = await response.text();
      expect(html).toContain(copy[locale].heading);
      expect(html).toContain(copy[locale].decisions[0][0]);
      expect(html).toContain(`/${locale}/guides/mimari-teklif-karsilastirma`);
    }
    expect((await request.get(`/${locale}/guides/olmayan-rehber`)).status()).toBe(404);
  });

  test(`${locale}: visitors can choose a need and reach the relevant service`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(`/${locale}`);
    await expect(page.locator("#home [data-home-project-number]")).toHaveText(["01", "02", "03", "04", "05", "06"]);
    const featured = page.locator('[aria-labelledby="home-featured-projects"] [data-home-project-number]');
    const count = await featured.count();
    await expect(featured).toHaveText(Array.from({ length: count }, (_, index) => String(index + 1).padStart(2, "0")));
    const paths = page.locator('section[aria-labelledby="home-project-paths"]');
    for (const path of homeMarketing[locale].paths) {
      const article = paths.getByRole("article").filter({ has: page.getByRole("heading", { name: path.title, exact: true }) });
      await expect(article.getByRole("link", { name: homeMarketing[locale].serviceLink })).toHaveAttribute("href", `/${locale}/services/${path.service}`);
      await expect(article.getByRole("link", { name: path.projectLabel, exact: true }).filter({ hasText: path.projectLabel })).toHaveAttribute("href", `/${locale}/projects/${path.project}`);
    }
    await paths.getByRole("link", { name: homeMarketing[locale].serviceLink }).first().click();
    await expect(page).toHaveURL(new RegExp(`/${locale}/services/villa-mimari-proje-ankara$`));
    await expect(page.locator("#service-decisions")).toHaveText(serviceDecisions["villa-mimari-proje-ankara"][locale].heading);
    expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(false);
  });

  for (const guide of guides) {
    test(`${locale}: ${guide.slug} is readable, canonical and connected to services`, async ({ page, request }) => {
      const path = `/${locale}/guides/${guide.slug}`;
      const html = await (await request.get(path)).text();
      expect(html).toContain(guide.copy[locale].sections[0].title);
      await page.goto(`/${locale}/guides`);
      await page.locator("#guide-library").getByRole("link", { name: guide.copy[locale].title, exact: true }).first().click();
      await expect(page).toHaveURL(new RegExp(`${path}$`));
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(guide.copy[locale].title);
      // Sections, FAQ and official links, then the closing call section with its related-guides list.
      const extra = (guide.copy[locale].faq ? 1 : 0) + (guide.links ? 1 : 0) + 2;
      await expect(page.locator("main article section h2")).toHaveCount(guide.copy[locale].sections.length + extra);
      const canonical = page.locator('link[rel="canonical"]');
      await expect(canonical).toHaveCount(1);
      await expect(canonical).toHaveAttribute("href", new RegExp(`${path}$`));
      const alternate = page.locator(`link[hreflang="${locale === "tr" ? "en" : "tr"}"]`);
      await expect(alternate).toHaveCount(1);
      await expect(alternate).toHaveAttribute("href", new RegExp(`/${locale === "tr" ? "en" : "tr"}/guides/${guide.slug}$`));
      await expect(page.getByRole("main").getByRole("link", { name: locale === "tr" ? "Şimdi Ara" : "Call now", exact: true })).toHaveAttribute("href", "tel:+905453204007");
      expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(false);
    });
  }
}
