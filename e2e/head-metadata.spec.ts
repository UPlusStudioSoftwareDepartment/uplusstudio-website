import { expect, test } from "@playwright/test";

// A link followed before hydration finishes used to leave the previous page's title, canonical and
// hreflang tags in <head>. Slowing the CPU makes the click land before hydration, as on slow phones.
const ROUTES = [
  ["/en/projects", "/en/projects/butik-kafe"],
  ["/tr/services", "/tr/services/ic-mimarlik-ankara"],
  ["/en/guides", "/en/guides/banyo-yenileme-oncesi"],
] as const;

for (const [from, to] of ROUTES) {
  test(`${from} → ${to}: only the new page's metadata remains after an early click`, async ({ page, browserName }) => {
    test.skip(browserName !== "chromium", "CPU throttling needs the Chrome DevTools Protocol");
    test.setTimeout(180_000);
    const cdp = await page.context().newCDPSession(page);
    await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
    await page.goto(from);
    await page.locator(`main a[href="${to}"]`).first().click();
    await expect(page).toHaveURL(new RegExp(`${to}$`), { timeout: 60_000 });

    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical).toHaveCount(1, { timeout: 20_000 });
    await expect(canonical).toHaveAttribute("href", new RegExp(`${to}$`));
    await expect(page.locator("head title")).toHaveCount(1);
    await expect(page.locator('head meta[name="description"]')).toHaveCount(1);
    await expect(page.locator('head meta[property="og:url"]')).toHaveAttribute("content", new RegExp(`${to}$`));
    for (const lang of ["tr", "en", "x-default"]) await expect(page.locator(`link[rel="alternate"][hreflang="${lang}"]`)).toHaveCount(1);
  });
}
