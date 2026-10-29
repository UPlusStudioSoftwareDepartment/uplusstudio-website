import { expect, test } from "@playwright/test";
import { homeMarketing } from "../src/lib/marketingContent";
import { getProject } from "../src/lib/projects";

for (const width of [320, 375, 390, 768, 1024, 1280, 1440]) {
  test(`project decision media stays readable at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    for (const locale of ["tr", "en"] as const) {
      await page.goto(`/${locale}`);
      const paths = page.locator('section[aria-labelledby="home-project-paths"]');
      for (const path of homeMarketing[locale].paths) {
        const project = getProject(path.project)!;
        const figure = paths.getByRole("figure").filter({ hasText: project.title[locale] });
        await figure.scrollIntoViewIfNeeded();
        await expect(figure.getByRole("link")).toHaveAttribute("href", `/${locale}/projects/${path.project}`);
        await expect(figure.getByRole("img")).toHaveAttribute("alt", project.cover.alt[locale]);
        await expect.poll(() => figure.locator("img").evaluate((image: HTMLImageElement) => image.complete && image.naturalWidth > 0)).toBe(true);
      }
      const process = page.locator('section[aria-labelledby="home-process"]');
      await process.scrollIntoViewIfNeeded();
      await expect(process.locator('img[alt=""]')).toHaveCount(4);
      for (const image of await process.locator("img").all()) {
        await expect.poll(() => image.evaluate((element: HTMLImageElement) => element.complete && element.naturalWidth > 0)).toBe(true);
      }
      expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(false);
      if (width === 320 || width === 1440) {
        await paths.screenshot({ path: `reports/performance/2026-10-29/needs-${locale}-${width}.png` });
        await process.screenshot({ path: `reports/performance/2026-10-29/process-${locale}-${width}.png` });
      }
    }
  });
}

test("process and decision content remain available without JavaScript", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  try {
    const page = await context.newPage();
    await page.goto("/tr");
    await expect(page.locator("#home-project-paths")).toBeVisible();
    await expect(page.locator("#home-process")).toBeVisible();
    await expect(page.locator('section[aria-labelledby="home-process"] li h3')).toHaveCount(4);
  } finally { await context.close(); }
});
