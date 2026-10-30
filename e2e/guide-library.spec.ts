import { expect, test } from "@playwright/test";
import { guides, guideTaxonomy } from "../src/lib/guides";

for (const locale of ["tr", "en"] as const) {
  const taxonomy = guideTaxonomy[locale];

  test(`${locale}: the library lists every guide in the HTML before any script runs`, async ({ request }) => {
    const html = await (await request.get(`/${locale}/guides`)).text();
    for (const guide of guides) expect(html, guide.slug).toContain(`href="/${locale}/guides/${guide.slug}"`);
    for (const label of Object.values(taxonomy.topics)) expect(html).toContain(label.replace(/'/g, "&#x27;"));
  });

  test(`${locale}: every guide is always visible, without a reader filter`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(`/${locale}/guides`);
    const library = page.locator("#guide-library");
    await expect(library.locator("h3 a")).toHaveCount(guides.length);
    await expect(library.getByRole("button")).toHaveCount(0);
    expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(false);
  });

  test(`${locale}: a guide lists its readers as plain text`, async ({ page }) => {
    await page.goto(`/${locale}/guides/ticari-mekan-kiralamadan-once`);
    await expect(page.getByText(taxonomy.audiences.business, { exact: false }).first()).toBeVisible();
    await expect(page.locator('a[href*="#kim-"]')).toHaveCount(0);
  });

  test(`${locale}: the İncek guide explains its drawing and opens official pages in a new tab`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(`/${locale}/guides/incek-golbasi-villa-yenileme`);
    const guide = guides.find((g) => g.slug === "incek-golbasi-villa-yenileme")!;
    const legend = page.locator("figure ol li");
    await expect(legend).toHaveCount(guide.diagram!.items[locale].length);
    const official = page.locator('section[aria-labelledby="guide-links"] a');
    await expect(official).toHaveCount(guide.links!.length);
    for (const link of await official.all()) {
      await expect(link).toHaveAttribute("target", "_blank");
      await expect(link).toHaveAttribute("rel", "noopener noreferrer");
      await expect(link).toHaveAttribute("href", /^https:\/\//);
    }
    await expect(page.locator('section[aria-labelledby="guide-faq"] dt')).toHaveCount(guide.copy[locale].faq!.length);
    await expect(page.locator('nav[aria-labelledby="guide-related"] a').first()).toHaveAttribute("href", new RegExp(`^/${locale}/guides/`));
  });

  test(`${locale}: services and projects point readers to the new guides`, async ({ request }) => {
    const service = await (await request.get(`/${locale}/services/ticari-mekan-tasarimi-ankara`)).text();
    expect(service).toContain(`/${locale}/guides/ticari-mekan-kiralamadan-once`);
    const project = await (await request.get(`/${locale}/projects/butik-kafe`)).text();
    expect(project).toContain(`/${locale}/guides/ticari-mekan-kiralamadan-once`);
    const home = await (await request.get(`/${locale}`)).text();
    expect(home).toContain(`/${locale}/guides/incek-golbasi-villa-yenileme`);
  });
}
