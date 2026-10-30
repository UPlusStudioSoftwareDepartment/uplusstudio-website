import { expect, test } from "@playwright/test";
import { projectScope } from "../src/lib/projectScope";
import { renovationGuide } from "../src/lib/renovationGuide";

for (const locale of ["tr", "en"] as const) {
  test(`${locale}: scope guidance works with keyboard and without JavaScript`, async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false, reducedMotion: "reduce" });
    try {
      const page = await context.newPage();
      await page.goto(`/${locale}`);
      const scope = page.locator('section[aria-labelledby="project-scope-title"]');
      await scope.scrollIntoViewIfNeeded();
      await expect(scope.locator("details").first()).toHaveAttribute("open", "");
      const second = scope.locator("details").nth(1);
      await second.locator("summary").focus();
      await page.keyboard.press("Enter");
      await expect(second.locator("p")).toBeVisible();
      await expect(scope.getByRole("link", { name: projectScope[locale].contact })).toHaveAttribute("href", `/${locale}/contact`);
      await scope.getByRole("link", { name: projectScope[locale].guide }).click();
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(renovationGuide.copy[locale].title);
      const image = page.locator('meta[property="og:image"]').first();
      await expect(image).toHaveAttribute("content", /\/media\/projects\//);
      const article = await page.locator('script[type="application/ld+json"]').allTextContents();
      expect(article.join(" ")).toContain('"@type":"Article"');
      expect(article.join(" ")).toContain('"image":');
    } finally {
      await context.close();
    }
  });

  for (const width of [320, 768, 1440]) {
    test(`${locale}: project scope fits ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 1000 });
      await page.emulateMedia({ reducedMotion: "reduce" });
      for (const path of ["", "/services/tadilat-donusum-ankara"]) {
        await page.goto(`/${locale}${path}`);
        const scope = page.locator('section[aria-labelledby="project-scope-title"]');
        await scope.scrollIntoViewIfNeeded();
        await expect(scope.getByRole("heading", { level: 2 })).toHaveText(projectScope[locale].title);
        await expect.poll(() => scope.locator("img").evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0)).toBe(true);
        for (const details of await scope.locator("details").all()) {
          if ((await details.getAttribute("open")) === null) await details.locator("summary").click();
        }
        expect(await scope.locator("img").evaluate((img) => getComputedStyle(img).animationName)).toBe("none");
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
        await scope.screenshot({ path: `reports/marketing-execution/scope-${locale}-${path ? "service" : "home"}-${width}.png` });
      }
      await page.goto(`/${locale}/guides/${renovationGuide.slug}`);
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(renovationGuide.copy[locale].title);
      const projectImage = page.locator("main article figure img");
      await projectImage.scrollIntoViewIfNeeded();
      await expect.poll(() => projectImage.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0)).toBe(true);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      await page.screenshot({ path: `reports/marketing-execution/guide-${locale}-${width}.png`, fullPage: true });
    });
  }
}
