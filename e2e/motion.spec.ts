import { expect, test, type Page } from "@playwright/test";

// Motion and page-change behaviour; the measurements behind these live in motion-audit/MOTION-REPORT.md.

const skipCurtain = (page: Page) => page.addInitScript(() => sessionStorage.setItem("u-curtain", "1"));

test("menu mascots loop their facial smile without moving the body", async ({ page }) => {
  for (const name of ["designer", "builder"]) {
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.goto(`/media/mascots/${name}-menu.svg?v=smile-loop`);
    const smile = page.locator(".menu-smile").first();
    const expression = await smile.evaluate((element) => {
      const animation = element.getAnimations()[0];
      const timing = animation.effect!.getTiming();
      animation.pause();
      animation.currentTime = Number(timing.delay);
      const neutral = Number(getComputedStyle(element).opacity);
      animation.currentTime = Number(timing.delay) + Number(timing.duration) / 2;
      const happy = Number(getComputedStyle(element).opacity);
      animation.currentTime = Number(timing.delay) + Number(timing.duration);
      const repeated = Number(getComputedStyle(element).opacity);
      return { neutral, happy, repeated, loops: timing.iterations === Infinity,
        movesBody: document.getAnimations().some((item) => (item.effect as KeyframeEffect).getKeyframes().some((frame) => frame.transform && frame.transform !== "none")) };
    });
    expect(expression).toEqual({ neutral: 0, happy: 1, repeated: 0, loops: true, movesBody: false });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await expect(smile).toHaveCSS("animation-name", "none");
    await expect(smile).toHaveCSS("opacity", "1");
  }
});

for (const width of [768, 1440]) {
  test(`home directions stays still at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await skipCurtain(page);
    await page.goto("/tr");
    const icon = page.locator(width < 1024 ? "#home .directions-icon" : "nav .directions-icon").first();
    await expect(icon).toBeVisible();
    await expect(icon).toHaveCSS("animation-name", "none");
    await expect(icon).toHaveCSS("transform", "none");
  });
}

test("home directions pulse stays within its link and stops for reduced motion", async ({ page }) => {
  await page.setViewportSize({ width: 393, height: 852 });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await skipCurtain(page);
  await page.goto("/tr");
  const icon = page.locator("#home .directions-icon");
  await expect(icon).toBeVisible();
  await expect(icon).toHaveCSS("animation-name", "directions-pulse");
  const pulse = await icon.evaluate((element) => {
    const animation = element.getAnimations()[0];
    animation.pause();
    animation.currentTime = 1200;
    const rect = element.getBoundingClientRect();
    const link = element.closest("a")!.getBoundingClientRect();
    return {
      scale: new DOMMatrix(getComputedStyle(element).transform).a,
      contained: rect.left >= link.left && rect.right <= link.right && rect.top >= link.top && rect.bottom <= link.bottom,
    };
  });
  expect(pulse.scale).toBeCloseTo(1.5);
  expect(pulse.contained).toBe(true);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(icon).toHaveCSS("animation-name", "none");
  await expect(icon).toHaveCSS("transform", "none");
});

const styleWrites = (page: Page, ms: number) =>
  page.evaluate(
    (duration) =>
      new Promise<number>((done) => {
        let writes = 0;
        const observer = new MutationObserver((list) => (writes += list.length));
        observer.observe(document.body, { attributes: true, subtree: true, attributeFilter: ["style"] });
        setTimeout(() => {
          observer.disconnect();
          done(writes);
        }, duration);
      }),
    ms
  );

test("a page at rest does no animation work while the mascots are off screen", async ({ page }) => {
  await skipCurtain(page);
  await page.goto("/tr/about");
  await page.waitForLoadState("load");
  await page.waitForTimeout(3000);
  // Before the fix the looping mascots wrote ~330 styles a second from below the fold.
  expect(await styleWrites(page, 1500)).toBeLessThan(20);

  await page.locator("svg[viewBox='0 0 140 150']").last().scrollIntoViewIfNeeded();
  await expect.poll(() => styleWrites(page, 1500), { timeout: 8000 }).toBeGreaterThan(0);
});

test("Back lands on the list position at once instead of sliding from the top", async ({ page }) => {
  await skipCurtain(page);
  await page.goto("/tr/projects");
  await page.waitForLoadState("load");
  expect(await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior)).not.toBe("smooth");

  const card = page.locator("main a[href^='/tr/projects/']:not([href$='/video'])").filter({ visible: true }).nth(2);
  await card.scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);
  const saved = await page.evaluate(() => scrollY);
  expect(saved).toBeGreaterThan(400);
  await card.click();
  await expect(page).toHaveURL(/\/tr\/projects\/[^/]+$/);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  expect(await page.evaluate(() => scrollY)).toBeLessThan(5);

  await page.goBack();
  await expect(page).toHaveURL(/\/tr\/projects$/);
  await expect.poll(() => page.evaluate(() => scrollY), { timeout: 5000 }).toBeGreaterThan(saved - 150);
  expect(Math.abs((await page.evaluate(() => scrollY)) - saved)).toBeLessThan(150);
});

test("a quick second tap lands on the last page without errors or a stuck overlay", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(String(error)));
  await skipCurtain(page);
  await page.goto("/tr");
  await page.waitForLoadState("load");
  await page.locator("a[href='/tr/projects']").first().evaluate((a: HTMLAnchorElement) => a.click());
  await page.locator("a[href='/tr/about']").first().evaluate((a: HTMLAnchorElement) => a.click());
  await expect(page).toHaveURL(/\/tr\/about$/);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.locator("html")).not.toHaveAttribute("data-navigating", /.*/);
  await expect(page.locator(".page-curtain")).toHaveCount(0);
  await page.waitForTimeout(800);
  expect(errors).toEqual([]);
});

test("the pending line is gone once the next page is on screen", async ({ page }) => {
  await skipCurtain(page);
  await page.goto("/tr/services");
  await page.waitForLoadState("load");
  await page.getByRole("main").locator("a[href='/tr/contact']").filter({ visible: true }).first().click();
  await expect(page).toHaveURL(/\/tr\/contact$/);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.locator("html")).not.toHaveAttribute("data-navigating", /.*/);
});

test("unknown pages keep the site header and footer", async ({ page, isMobile }) => {
  const res = await page.goto("/en/no-such-page");
  expect(res?.status()).toBe(404);
  if (isMobile) await expect(page.getByRole("button", { name: "Menu" })).toBeVisible();
  else await expect(page.locator("nav").first().getByRole("link", { name: "Work", exact: true })).toBeVisible();
  await expect(page.getByRole("contentinfo")).toBeVisible();
  await expect(page.getByRole("main").getByRole("link", { name: /Back to home/i })).toHaveAttribute("href", "/en");
});
