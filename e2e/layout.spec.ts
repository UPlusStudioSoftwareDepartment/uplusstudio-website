import { expect, test } from "@playwright/test";

for (const width of [320, 393, 768, 844, 1440]) {
  test(`about keeps contact beside founders in both languages at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: width === 844 ? 390 : 852 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.addInitScript(() => sessionStorage.setItem("u-curtain", "1"));
    for (const locale of ["tr", "en"]) {
      await page.goto(`/${locale}/about`);
      const header = page.locator("main header").first();
      const email = header.locator('a[href="mailto:info@uplusstudio.com.tr"]');
      await expect(email).toHaveText("info@uplusstudio.com.tr");
      await email.scrollIntoViewIfNeeded();
      await expect(email).toBeInViewport();
      const geometry = await header.locator("dl").evaluate((list) => {
        const items = [...list.children];
        const founders = items[2].getBoundingClientRect();
        const contact = items[3].getBoundingClientRect();
        const address = items[3].querySelector("a")!.getBoundingClientRect();
        return {
          sameRow: Math.abs(founders.top - contact.top) < 1,
          insideColumn: address.left >= contact.left - 1 && address.right <= contact.right + 1,
          overflow: document.documentElement.scrollWidth > innerWidth,
        };
      });
      expect(geometry).toEqual({ sameRow: true, insideColumn: true, overflow: false });
    }
  });
}

test("English menu shows Glossary without an extra Architecture line", async ({ page }) => {
  await page.setViewportSize({ width: 393, height: 852 });
  await page.goto("/en/about");
  await page.getByRole("button", { name: "Menu", exact: true }).click();
  const glossary = page.getByRole("dialog").locator('a[href="/en/glossary"]');
  await expect(glossary).toContainText("Glossary");
  await expect(glossary).not.toContainText("Architecture");
  await expect(glossary).toBeInViewport();
});
