import { expect, test } from "@playwright/test";

for (const width of [320, 393, 768]) {
  test(`menu mascots sit beside the email and phone at ${width}px`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width, height: 852 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/tr/about");
    await page.getByRole("button", { name: "Menü", exact: true }).click();
    const menu = page.getByRole("dialog", { name: "Menü", exact: true });
    const whatsapp = menu.getByRole("link", { name: "WhatsApp’tan yaz", exact: true });
    await expect(whatsapp).toHaveAttribute("href", "https://wa.me/905453204007");
    await expect(whatsapp).toBeInViewport();
    const call = await menu.getByRole("link", { name: "Şimdi Ara", exact: true }).boundingBox();
    const whatsappBounds = await whatsapp.boundingBox();
    const directions = menu.getByRole("link", { name: "Yol tarifi", exact: true });
    await expect(directions).toBeInViewport();
    const directionsBounds = await directions.boundingBox();
    expect(directionsBounds!.y + directionsBounds!.height).toBeLessThanOrEqual(whatsappBounds!.y);
    expect(whatsappBounds!.y - (directionsBounds!.y + directionsBounds!.height)).toBeLessThanOrEqual(12);
    expect(whatsappBounds!.y + whatsappBounds!.height).toBeLessThanOrEqual(call!.y);
    expect(call!.y - (whatsappBounds!.y + whatsappBounds!.height)).toBeLessThan(24);
    await expect(menu.locator('ul a[href^="tel:"]')).toHaveCount(0);
    await expect(menu.locator('ul a[href^="https://wa.me/"]')).toHaveCount(0);
    const close = await menu.getByRole("button", { name: "Kapat", exact: true }).boundingBox();
    const english = await menu.getByRole("link", { name: "EN", exact: true }).boundingBox();
    expect(english!.x + english!.width).toBeLessThanOrEqual(close!.x);
    expect(close!.x - (english!.x + english!.width)).toBeLessThan(40);
    const email = menu.locator('a[href="mailto:info@uplusstudio.com.tr"]').first();
    const mascots = menu.locator('img[src*="-menu.svg"]');
    await expect(mascots).toHaveCount(2);
    await expect(email).toBeInViewport();
    const contact = await email.locator("..").boundingBox();
    for (const mascot of await mascots.all()) {
      await expect(mascot).toBeInViewport();
      const bounds = await mascot.boundingBox();
      expect(bounds!.x).toBeGreaterThanOrEqual(contact!.x + contact!.width);
      expect(Math.abs(bounds!.y + bounds!.height / 2 - (contact!.y + contact!.height / 2))).toBeLessThan(10);
      await expect.poll(() => mascot.evaluate((image: HTMLImageElement) => image.complete && image.naturalWidth > 0)).toBe(true);
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(false);
    const gapBeforeContact = await menu.locator("nav ul").evaluate((list) => {
      const footer = list.closest("nav")!.nextElementSibling!;
      return footer.getBoundingClientRect().top - list.getBoundingClientRect().bottom;
    });
    expect(gapBeforeContact).toBeGreaterThanOrEqual(0);
    expect(gapBeforeContact).toBeLessThanOrEqual(20);
    if (testInfo.project.name === "desktop") {
      await expect(menu).toHaveCSS("opacity", "1");
      await page.screenshot({ path: `reports/console-seo-2026-10-30/menu-${width}.png` });
    }
  });
}

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
