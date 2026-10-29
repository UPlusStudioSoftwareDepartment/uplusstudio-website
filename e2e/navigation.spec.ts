import { expect, test } from "@playwright/test";

const screens = [
  { width: 320, height: 568 },
  { width: 360, height: 800 },
  { width: 375, height: 812 },
  { width: 384, height: 832 },
  { width: 390, height: 844 },
  { width: 393, height: 873 },
  { width: 412, height: 915 },
  { width: 430, height: 932 },
  { width: 844, height: 390 },
];

for (const screen of screens) {
  test(`curtain menu keeps controls usable at ${screen.width}x${screen.height}`, async ({
    page,
  }) => {
    await page.setViewportSize(screen);
    await page.addInitScript(() => sessionStorage.setItem("u-curtain", "1"));
    await page.goto("/tr/about");
    const toggle = page.getByRole("button", { name: "Menü", exact: true });
    await toggle.click();
    const menu = page.getByRole("dialog", { name: "Menü", exact: true });
    const close = menu.getByRole("button", { name: "Kapat", exact: true });
    await expect(close).toBeFocused();
    for (const control of await menu.locator("a, button").all()) {
      // WebKit rounds the masked row's border by a subpixel; still require virtually the whole tap target.
      if (await control.isVisible())
        await expect(control).toBeInViewport({ ratio: 0.98 });
    }
    await close.press("Tab");
    expect(
      await menu.evaluate((el) => el.contains(document.activeElement)),
    ).toBe(true);
    await page.keyboard.press("Escape");
    await expect(menu).toBeHidden();
    await expect(toggle).toBeFocused();
    expect(await page.evaluate(() => document.body.style.position)).toBe("");
    await toggle.click();
    await menu.getByRole("link", { name: /Hizmetler/ }).click();
    await expect(page).toHaveURL(/\/tr\/services$/);
    await expect(menu).toBeHidden();
    expect(await page.evaluate(() => scrollY)).toBe(0);
  });
}

test("reduced motion menu fades without sliding the page-sized layers", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/en/about");
  await page.getByRole("button", { name: "Menu", exact: true }).click();
  const menu = page.getByRole("dialog", { name: "Menu", exact: true });
  await expect(
    menu.getByRole("button", { name: "Close", exact: true }),
  ).toBeFocused();
  const movingLayers = await menu.evaluate((el) =>
    el
      .getAnimations({ subtree: true })
      .flatMap((animation) => {
        const effect = animation.effect;
        if (!(effect instanceof KeyframeEffect)) return [];
        if (!(effect.target instanceof Element)) return [];
        const box = effect.target.getBoundingClientRect();
        if (box.width < innerWidth / 2 || box.height < innerHeight / 2)
          return [];
        return effect
          .getKeyframes()
          .map((frame) => String(frame.transform ?? "none"));
      })
      .filter((transform) => /translate[^)]*-[1-9]/.test(transform)),
  );
  expect(movingLayers).toEqual([]);
  await page.keyboard.press("Escape");
  await expect(menu).toBeHidden();
});

test("the close button stays under the same finger during the opening curtain", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.addInitScript(() => sessionStorage.setItem("u-curtain", "1"));
  await page.goto("/tr/about");
  const toggle = page.getByRole("button", { name: "Menü", exact: true });
  const box = await toggle.boundingBox();
  expect(box).not.toBeNull();
  if (!box) throw new Error("Menu toggle is missing");
  const x = box.x + box.width / 2;
  const y = box.y + box.height / 2;
  await page.mouse.click(x, y);
  await expect(
    page.getByRole("button", { name: "Kapat", exact: true }),
  ).toBeFocused();
  await page.mouse.click(x, y);
  await expect(page.getByRole("dialog", { name: "Menü" })).toBeHidden();
  await expect(toggle).toBeFocused();
});

test("opening the menu does not start downloading every destination", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.addInitScript(() => sessionStorage.setItem("u-curtain", "1"));
  await page.goto("/tr/about");
  const destinations = new Set([
    "/tr/services",
    "/tr/glossary",
    "/tr/contact",
    "/tr/projects",
  ]);
  const prefetched: string[] = [];
  page.on("request", (request) => {
    const path = new URL(request.url()).pathname;
    if (request.headers()["next-router-prefetch"] && destinations.has(path))
      prefetched.push(path);
  });
  await page.getByRole("button", { name: "Menü", exact: true }).click();
  const menu = page.getByRole("dialog", { name: "Menü" });
  await expect
    .poll(() =>
      menu
        .locator('img[src*="/media/mascots/"]')
        .evaluateAll(
          (images) =>
            images.length === 2 &&
            images.every(
              (image) =>
                image instanceof HTMLImageElement &&
                image.complete &&
                image.naturalWidth > 0,
            ),
        ),
    )
    .toBe(true);
  // Observe the viewport-prefetch scheduling window, rather than checking an implementation prop.
  await page.waitForTimeout(1200);
  expect(prefetched).toEqual([]);
});

test("404 language links and home links render their destination", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.setViewportSize({ width: 390, height: 844 });
  await page.addInitScript(() => sessionStorage.setItem("u-curtain", "1"));
  await page.goto("/tr/projects/no-such-project");
  // Exercise the real header language link, followed by the real home link.
  await page
    .locator("nav")
    .first()
    .getByRole("link", { name: "EN", exact: true })
    .click();
  await expect(page).toHaveURL(/\/en\/projects\/no-such-project$/);
  await expect(
    page.getByRole("main").getByRole("heading", { level: 1 }),
  ).toContainText("404");
  await page
    .getByRole("main")
    .getByRole("link", { name: /Back to home/i })
    .click();
  await expect(page).toHaveURL(/\/en$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(
    page.getByRole("main").getByRole("heading", { level: 1 }),
  ).not.toContainText("404");
  expect(errors).toEqual([]);
});

for (const locale of ["tr", "en"]) {
  for (const suffix of [
    "/no-such-page",
    "/projects/no-such-project",
    "/services/no-such-service",
    "/projects/modern-villa/video",
    "/maintenance",
  ]) {
    test(`/${locale}${suffix} contains the full 404 in its server HTML`, async ({
      request,
    }) => {
      const response = await request.get(`/${locale}${suffix}`);
      expect(response.status()).toBe(404);
      const html = await response.text();
      expect(html).toMatch(new RegExp(`<html[^>]*lang="${locale}"`));
      expect(html).toContain("<nav");
      expect(html).toContain("<footer");
      expect(html).toMatch(/<meta[^>]*name="robots"[^>]*content="[^"]*noindex/);
    });
  }
}
