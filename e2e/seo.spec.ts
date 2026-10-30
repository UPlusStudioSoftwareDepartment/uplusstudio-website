import { expect, test } from "@playwright/test";
import { LOCALES, PATHS } from "./pages";
import { SITE_URL } from "../src/lib/seo";
import { projects } from "../src/lib/projects";

for (const locale of LOCALES) {
  test(`${locale}: every public route has server-rendered metadata and reciprocal language links`, async ({ request }) => {
    for (const path of PATHS.filter((path) => path !== "/kartvizit")) {
      const response = await request.get(`/${locale}${path}`);
      expect(response.status(), path).toBe(200);
      const html = await response.text();
      expect(html, path).toContain(`<html lang="${locale}"`);
      expect(html, path).toMatch(/<title>[^<]+<\/title>/);
      expect(html, path).toMatch(/<meta name="description" content="[^"]+"/);
      expect(html, path).toContain(`<link rel="canonical" href="${SITE_URL}/${locale}${path}"`);
      expect(html.match(/<h1\b/g), path).toHaveLength(1);
      expect(html, path).not.toMatch(/<meta name="(?:robots|googlebot)" content="[^"]*noindex/);
      for (const alternate of LOCALES) {
        expect(html, path).toContain(`hrefLang="${alternate}" href="${SITE_URL}/${alternate}${path}"`);
      }
    }
  });

  test(`${locale}: private helper pages remain outside the public indexing inventory`, async ({ request }) => {
    const sitemap = await (await request.get("/sitemap.xml")).text();
    for (const path of ["/kartvizit", "/randevu-yanit", "/randevu-kart/invalid-token"]) {
      const response = await request.get(`/${locale}${path}`);
      const html = await response.text();
      expect(sitemap).not.toContain(`${SITE_URL}/${locale}${path}`);
      expect(`${response.headers()["x-robots-tag"] ?? ""} ${html}`).toMatch(/noindex/);
    }
  });
}

test("the indexed home film is discoverable in HTML without autoplaying for reduced motion", async ({ page, request }) => {
  const html = await (await request.get("/en")).text();
  expect(html).toContain('<source src="/media/video/villa-transformation.mp4" type="video/mp4"');
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/en");
  expect(await page.locator("main video").first().evaluate((video: HTMLVideoElement) => video.paused)).toBe(true);
});

for (const project of projects.filter((project) => project.video)) {
  test(`${project.slug}: watch page loads the poster first and plays on demand`, async ({ page, request }) => {
    await page.goto(`/en/projects/${project.slug}/video`);
    const video = page.locator("main video");
    await expect(video).toHaveAttribute("preload", "none");
    await expect(video).toHaveAttribute("controls", "");
    const poster = new URL((await video.getAttribute("poster"))!, page.url());
    expect(poster.searchParams.get("url")).toBe(project.video?.poster.replace(/\.jpg$/, ".webp"));
    for (const format of ["image/avif", "image/webp"]) {
      const image = await request.get(poster.href, { headers: { Accept: format } });
      expect(image.status()).toBe(200);
      expect(image.headers()["content-type"]).toBe(format);
    }
    await video.evaluate(async (element: HTMLVideoElement) => {
      element.muted = true;
      await element.play();
    });
    await expect.poll(() => video.evaluate((element: HTMLVideoElement) => element.currentTime)).toBeGreaterThan(0);
  });
}

test("an unavailable video leaves its poster and project navigation available", async ({ page, request }) => {
  // WebKit can fetch media outside page.route interception. A real 404 exercises every engine.
  const unavailable = "/media/video/quality-test-missing-video.mp4";
  expect((await request.get(unavailable)).status()).toBe(404);
  await page.goto("/en/projects/ofis-yenileme/video");
  const video = page.locator("main video");
  await video.evaluate((element: HTMLVideoElement, src) => {
    element.src = src;
    element.load();
  }, unavailable);
  await video.scrollIntoViewIfNeeded();
  await video.click();
  const played = await video.evaluate((element: HTMLVideoElement) => {
    element.muted = true;
    return element.play().then(() => true, () => false);
  });
  expect(played).toBe(false);
  const poster = new URL((await video.getAttribute("poster"))!, page.url());
  expect(poster.searchParams.get("url")).toBe("/media/video/office-before-after.webp");
  await expect(page.getByRole("link", { name: "Project details" })).toBeVisible();
  await page.getByRole("link", { name: "Project details" }).click();
  await expect(page).toHaveURL(/\/en\/projects\/ofis-yenileme$/);
});

for (const path of ["/en", "/en/projects/ofis-yenileme"]) {
  test(`${path}: changing the motion preference pauses a playing video`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.goto(path);
    const video = page.locator("main video").first();
    await video.scrollIntoViewIfNeeded();
    await video.evaluate(async (element: HTMLVideoElement) => {
      element.muted = true;
      await element.play();
    });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await expect.poll(() => video.evaluate((element: HTMLVideoElement) => element.paused)).toBe(true);
  });
}

test("supporting video sources render in HTML and controls respect reduced motion", async ({ page, request }) => {
  const response = await request.get("/en/projects/ofis-yenileme");
  const html = await response.text();
  expect(html).toMatch(/<video[^>]+src="\/media\/video\/office-before-after\.mp4"[^>]+controls/);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/en/projects/ofis-yenileme");
  const video = page.locator("main video").first();
  await video.scrollIntoViewIfNeeded();
  await expect(video).toHaveAttribute("controls", "");
  await expect(video).toHaveAttribute("poster", /\.webp$/);
  await expect(video).not.toHaveAttribute("autoplay", /.*/);
  expect(await video.evaluate((el: HTMLVideoElement) => el.paused)).toBe(true);
});

test("animated heading lines preserve word boundaries for search and assistive technology", async ({ page }) => {
  await page.goto("/en/about");
  await expect(page.locator("#about-people")).toHaveText("The two people behind your project.");
});

test("the fullscreen fallback traps focus, closes with Escape and returns focus", async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(Element.prototype, "requestFullscreen", { configurable: true, value: undefined });
    Object.defineProperty(HTMLVideoElement.prototype, "webkitEnterFullscreen", { configurable: true, value: undefined });
  });
  await page.goto("/en/projects/ofis-yenileme");
  const opener = page.getByRole("button", { name: "Full screen", exact: true }).first();
  await opener.click();
  const dialog = page.getByRole("dialog", { name: "Full screen", exact: true });
  const close = dialog.getByRole("button", { name: "Exit full screen" });
  await expect(close).toBeFocused();
  await page.keyboard.press("Tab");
  expect(await dialog.evaluate((el) => el.contains(document.activeElement))).toBe(true);
  await page.keyboard.press("Shift+Tab");
  expect(await dialog.evaluate((el) => el.contains(document.activeElement))).toBe(true);
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(opener).toBeFocused();
});

test("touch devices enlarge photos without entering browser fullscreen", async ({ page, isMobile }) => {
  test.skip(!isMobile, "Photo overlays replace browser fullscreen on touch devices.");
  await page.addInitScript(() => {
    Element.prototype.requestFullscreen = async () => {
      document.documentElement.dataset.nativeFullscreenRequested = "true";
    };
  });
  await page.goto("/en/projects/ofis-yenileme");
  const photo = page.locator('[class~="group/fs"]').filter({
    has: page.locator("img"),
    hasNot: page.locator("video"),
  }).first();
  const opener = photo.getByRole("button", { name: "Full screen", exact: true });
  await opener.click();
  const dialog = page.getByRole("dialog", { name: "Full screen", exact: true });
  await expect(dialog).toBeVisible();
  expect(await page.locator("html").getAttribute("data-native-fullscreen-requested")).toBeNull();
  await dialog.getByRole("button", { name: "Exit full screen" }).click();
  await expect(dialog).toBeHidden();
  await expect(opener).toBeFocused();
});
