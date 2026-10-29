import { expect, test, type Locator, type Page } from "@playwright/test";
import { SERVICE_LANDINGS } from "../src/lib/serviceLandings";
import { projects } from "../src/lib/projects";
import { studioInfo } from "../src/lib/studio-info";
import { LOCALES, PATHS } from "./pages";


function watchErrors(page: Page) {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(m.text());
  });
  return errors;
}

async function audit(page: Page) {
  return page.evaluate(() => {
    const visible = (el: Element) => {
      const r = el.getBoundingClientRect();
      return r.width > 0 && r.height > 0 && getComputedStyle(el).visibility !== "hidden";
    };
    const nameOf = (el: Element) => {
      const labelledBy = el.getAttribute("aria-labelledby");
      const labelled = labelledBy ? document.getElementById(labelledBy)?.textContent : "";
      return (el.getAttribute("aria-label") || labelled || el.textContent || el.getAttribute("title") || "").trim();
    };
    return {
      h1: document.querySelectorAll("h1").length,
      overflow: document.documentElement.scrollWidth - window.innerWidth,
      imagesWithoutAlt: [...document.querySelectorAll("img:not([alt])")].map((i) => (i as HTMLImageElement).src),
      unnamedButtons: [...document.querySelectorAll("button")].filter((b) => visible(b) && !nameOf(b)).map((b) => b.outerHTML.slice(0, 120)),
      unnamedLinks: [...document.querySelectorAll("a[href]")].filter((a) => visible(a) && !nameOf(a)).map((a) => a.outerHTML.slice(0, 120)),
      unsafeBlankLinks: [...document.querySelectorAll('a[target="_blank"]:not([rel~="noopener"])')].map((a) => a.getAttribute("href")),
      brokenAnchors: [...document.querySelectorAll('a[href^="#"]')]
        .map((a) => a.getAttribute("href")!.slice(1))
        .filter((id) => id && !document.getElementById(id)),
    };
  });
}

async function businessCardButton(page: Page) {
  const visible = page.getByRole("button", { name: "Kartviziti paylaş" }).filter({ visible: true });
  if ((await visible.count()) === 0) await page.getByRole("button", { name: "Menü" }).click();
  return visible.first();
}

async function expectFocusTrapped(page: Page, dialog: Locator) {
  for (const key of ["Tab", "Shift+Tab"]) {
    for (let i = 1; i <= 30; i++) {
      await page.keyboard.press(key);
      expect(await dialog.evaluate((el) => el.contains(document.activeElement)), `${key} ×${i}`).toBe(true);
    }
  }
}

async function lowContrastText(root: Locator) {
  return root.evaluate((rootEl) => {
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = 1;
    const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
    const paint = (colors: string[]) => {
      ctx.clearRect(0, 0, 1, 1);
      for (const color of colors) {
        ctx.fillStyle = color;
        ctx.fillRect(0, 0, 1, 1);
      }
      return [...ctx.getImageData(0, 0, 1, 1).data.slice(0, 3)];
    };
    const luminance = (rgb: number[]) =>
      rgb
        .map((v) => v / 255)
        .map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4))
        .reduce((sum, v, i) => sum + v * [0.2126, 0.7152, 0.0722][i], 0);
    const failures: string[] = [];
    for (const el of [rootEl, ...rootEl.querySelectorAll("*")]) {
      const text = [...el.childNodes]
        .filter((n) => n.nodeType === Node.TEXT_NODE)
        .map((n) => n.textContent?.trim())
        .join(" ")
        .trim();
      const style = getComputedStyle(el);
      const box = el.getBoundingClientRect();
      if (!text || box.width <= 1 || box.height <= 1 || style.visibility === "hidden") continue;
      const backgrounds = ["#fff"];
      for (let node: Element | null = el; node; node = node.parentElement) backgrounds.splice(1, 0, getComputedStyle(node).backgroundColor);
      const [a, b] = [luminance(paint([...backgrounds, style.color])), luminance(paint(backgrounds))];
      const ratio = (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
      const size = parseFloat(style.fontSize);
      const large = size >= 24 || (size >= 18.66 && Number(style.fontWeight) >= 700);
      if (ratio < (large ? 3 : 4.5)) failures.push(`${text} — ${ratio.toFixed(2)}:1 at ${style.fontSize}`);
    }
    return failures;
  });
}

for (const locale of LOCALES) {
  for (const path of PATHS) {
    test(`/${locale}${path} renders cleanly`, async ({ page }) => {
      const errors = watchErrors(page);
      const res = await page.goto(`/${locale}${path}`);
      expect(res?.status()).toBe(200);
      await page.waitForTimeout(800);
      const report = await audit(page);
      expect(report.h1, "exactly one h1").toBe(1);
      expect(report.overflow, "no horizontal scroll").toBeLessThanOrEqual(1);
      expect(report.imagesWithoutAlt).toEqual([]);
      expect(report.unnamedButtons).toEqual([]);
      expect(report.unnamedLinks).toEqual([]);
      expect(report.unsafeBlankLinks).toEqual([]);
      expect(report.brokenAnchors).toEqual([]);
      expect(errors).toEqual([]);
    });
  }
}

test("every internal link resolves", async ({ request, isMobile }) => {
  test.skip(isMobile, "links are the same on every screen");
  test.setTimeout(180_000);
  const hrefs = new Set<string>();
  for (const locale of LOCALES) {
    for (const path of PATHS) {
      const html = await (await request.get(`/${locale}${path}`)).text();
      for (const [, href] of html.matchAll(/<a\b[^>]*\shref="(\/[^"#]*)/g)) hrefs.add(href.replaceAll("&amp;", "&"));
    }
  }
  const broken: string[] = [];
  for (const href of hrefs) {
    const res = await request.get(href, { maxRedirects: 5 });
    if (res.status() >= 400) broken.push(`${href} → ${res.status()}`);
  }
  expect(hrefs.size).toBeGreaterThan(20);
  expect(broken).toEqual([]);
});

test("the sitemap lists only indexable canonical pages and leaves the FAQ out", async ({ request, isMobile }) => {
  test.skip(isMobile, "the sitemap is the same on every screen");
  test.setTimeout(120_000);
  const xml = await (await request.get("/sitemap.xml")).text();
  const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(([, loc]) => loc);
  expect(locs.length).toBeGreaterThan(40);
  for (const loc of locs) {
    const res = await request.get(new URL(loc).pathname, { maxRedirects: 0 });
    expect(res.status(), loc).toBe(200);
    const html = await res.text();
    expect(html, loc).toContain(`<link rel="canonical" href="${loc}"/>`);
    expect(html, loc).not.toMatch(/<meta name="robots" content="[^"]*noindex/);
  }
  for (const locale of ["tr", "en"]) {
    expect((await request.get(`/${locale}/maintenance`, { maxRedirects: 0 })).status()).toBe(404);
    expect(locs.some((loc) => loc.endsWith(`/${locale}/faq`))).toBe(false);
    const res = await request.get(`/${locale}/faq`, { maxRedirects: 0 });
    expect(res.status()).toBe(308);
    expect(res.headers().location).toBe(`/${locale}/contact`);
  }
});

test("every project video has its own watch page, linked from the project and listed in the sitemap", async ({ page, request }) => {
  const withVideo = projects.filter((p) => p.video);
  expect(withVideo.length).toBeGreaterThan(0);
  const xml = await (await request.get("/sitemap.xml")).text();
  for (const project of withVideo) {
    const watch = `/tr/projects/${project.slug}/video`;
    await page.goto(`/tr/projects/${project.slug}`);
    await expect(page.getByRole("link", { name: /Videoyu ayrı sayfada izle/ })).toHaveAttribute("href", watch);
    await page.goto(watch);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(project.title.tr);
    await expect(page.locator("video")).toHaveAttribute("src", project.video?.src ?? "");
    await expect(page.locator("video")).toHaveAttribute("controls", "");
    expect((await page.locator('script[type="application/ld+json"]').allTextContents()).some((ld) => ld.includes('"VideoObject"'))).toBe(true);
    expect(xml).toContain(`${watch}</loc>`);
  }
});

test("the curtain plays once per visit, and internal links fade with a view transition unless motion is reduced", async ({ page, isMobile }) => {
  test.skip(isMobile, "the desktop nav carries the links");
  const countTransitions = () =>
    page.evaluate(() => {
      const w = window as Window & { transitions?: number };
      w.transitions = 0;
      const start = document.startViewTransition.bind(document);
      document.startViewTransition = ((update) => {
        w.transitions = (w.transitions ?? 0) + 1;
        return start(update);
      }) as typeof document.startViewTransition;
    });
  const curtainGone = () => expect(page.locator(".page-curtain")).toHaveCount(0, { timeout: 8000 });

  await page.goto("/tr/about");
  await expect(page.locator(".page-curtain")).toBeVisible();
  await curtainGone();
  await page.reload();
  await expect(page.locator(".page-curtain")).toBeHidden();
  await countTransitions();
  await page.locator("nav").first().getByRole("link", { name: "Projeler", exact: true }).click();
  await expect(page).toHaveURL(/\/tr\/projects$/);
  await expect(page.locator(".page-curtain")).toHaveCount(0);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  expect(await page.evaluate(() => (window as Window & { transitions?: number }).transitions)).toBe(1);

  await page.emulateMedia({ reducedMotion: "reduce" });
  await countTransitions();
  await page.locator("nav").first().getByRole("link", { name: "İletişim", exact: true }).click();
  await expect(page).toHaveURL(/\/tr\/contact$/);
  expect(await page.evaluate(() => (window as Window & { transitions?: number }).transitions)).toBe(0);
});

test("unknown pages answer 404 with a way home", async ({ page }) => {
  const res = await page.goto("/tr/bu-sayfa-yok");
  expect(res?.status()).toBe(404);
  await expect(page.getByRole("main").getByRole("link", { name: /Ana sayfa|anasayfa/i }).first()).toHaveAttribute("href", "/tr");
});

test("language switch keeps the visitor on the same page", async ({ page }) => {
  await page.goto("/tr/services");
  await page.getByRole("button", { name: "EN", exact: true }).filter({ visible: true }).click();
  await expect(page).toHaveURL(/\/en\/services$/);
  await expect(page.locator("html")).toHaveAttribute("lang", /^en/);
});

test("studio icons sit in the top bar only on screens without the menu", async ({ page, isMobile }) => {
  test.skip(isMobile, "phones are covered by the menu test");
  const whatsapp = page.getByRole("link", { name: "WhatsApp" }).filter({ visible: true });
  const menu = page.getByRole("button", { name: "Menü" });
  await page.setViewportSize({ width: 1000, height: 800 });
  await page.goto("/tr/about");
  await expect(menu).toBeVisible();
  await expect(whatsapp).toHaveCount(0);
  await page.setViewportSize({ width: 1280, height: 800 });
  await expect(menu).toBeHidden();
  await expect(whatsapp).toHaveCount(1);
});

test("project pages link to the service landing that lists them", async ({ page }) => {
  const landing = SERVICE_LANDINGS.find((s) => s.projects.includes("modern-villa"))!;
  await page.goto("/tr/projects/modern-villa");
  const link = page.getByRole("link", { name: landing.copy.tr.title });
  await expect(link).toHaveAttribute("href", `/tr/services/${landing.slug}`);
  await link.click();
  await expect(page).toHaveURL(new RegExp(`/tr/services/${landing.slug}$`));
});

test("page header intro shows before the app hydrates", async ({ page }) => {
  await page.route(/\/_next\/static\/chunks\/.+\.js$/, (route) => route.abort());
  await page.goto("/tr/about");
  const intro = page.locator("header:has(h1)").getByText("Her proje benzersiz bir hikaye anlatır");
  await expect(intro).toBeVisible();
  await expect
    .poll(() =>
      intro.evaluate((el) => {
        let opacity = 1;
        for (let node: Element | null = el; node; node = node.parentElement) opacity *= Number(getComputedStyle(node).opacity);
        return opacity;
      })
    )
    .toBe(1);
});

test("home continues past the film with the studio, every service, featured work and the footer", async ({ page }) => {
  await page.goto("/tr");
  const studio = page.locator("main > div").last();
  for (const service of SERVICE_LANDINGS) {
    await expect(studio.getByRole("link", { name: new RegExp(`^\\d{2} ${service.copy.tr.crumb}$`) })).toHaveAttribute("href", `/tr/services/${service.slug}`);
  }
  for (const project of projects.filter((p) => p.featured)) {
    await expect(studio.getByRole("link", { name: new RegExp(`\\d{2} ${project.title.tr} `) })).toHaveAttribute("href", `/tr/projects/${project.slug}`);
  }
  await page.getByRole("contentinfo").scrollIntoViewIfNeeded();
  await expect(page.getByRole("contentinfo")).toBeInViewport();
});

test("the home film plays silently until the visitor turns the music on, and only the film icon controls it", async ({ page, browserName }) => {
  test.skip(browserName === "webkit" && process.platform === "linux", "WebKit on Linux (GStreamer) stalls the film after it resumes; Safari is covered by the macOS job");
  await page.goto("/tr");
  const video = page.locator("#home video");
  const music = page.locator("#home audio");
  const unmute = page.getByRole("button", { name: "Filmin müziğini aç" });
  const play = page.getByRole("button", { name: "Filmi sesli oynat" });
  const stop = page.getByRole("button", { name: "Filmi durdur" });
  expect(await video.evaluate((v: HTMLVideoElement) => v.loop)).toBe(false);
  await expect.poll(() => video.evaluate((v: HTMLVideoElement) => v.currentTime > 0)).toBe(true);
  await video.evaluate((v: HTMLVideoElement) => (v.currentTime = 0));
  await expect(unmute).toBeVisible();
  await page.locator("h1").click();
  expect(await music.evaluate((a: HTMLAudioElement) => a.paused)).toBe(true);
  await unmute.click();
  await expect.poll(() => music.evaluate((a: HTMLAudioElement) => !a.paused)).toBe(true);
  await stop.click();
  await expect.poll(() => video.evaluate((v: HTMLVideoElement) => v.paused)).toBe(true);
  await play.click();
  await expect.poll(() => video.evaluate((v: HTMLVideoElement) => !v.paused)).toBe(true);
  await expect.poll(() => page.locator("#home audio").evaluate((a: HTMLAudioElement) => !a.paused && a.currentTime > 0)).toBe(true);
  await expect(stop).toBeVisible();
  await stop.click();
  await expect.poll(() => page.locator("#home audio").evaluate((a: HTMLAudioElement) => a.paused)).toBe(true);
});

test("founders, the villa story and the service area are on the page", async ({ page }) => {
  await page.goto("/tr");
  await expect(page.getByText("Türkiye", { exact: true })).toBeVisible();
  await page.goto("/tr/about");
  await expect(page.getByRole("link", { name: "Hacer Uyar — LinkedIn" })).toHaveAttribute("href", studioInfo.founderLinkedIn.hacer);
  await expect(page.getByRole("link", { name: "Rıdvan Uyar — LinkedIn" })).toHaveAttribute("href", studioInfo.founderLinkedIn.ridvan);
  await page.goto("/tr/projects/villa-donusumu");
  await expect(page.getByText("Uygulama büyük ölçüde tamamlandı, peyzaj sürüyor")).toBeVisible();
  await expect(page.getByRole("link", { name: /Süreci LinkedIn'de izleyin/ })).toHaveAttribute("href", /activity:7510727589314015232/);
});

test("business card opens as a dialog and closes", async ({ page }) => {
  await page.goto("/tr/about");
  await (await businessCardButton(page)).click();
  const card = page.getByRole("dialog", { name: "Dijital kartvizit" });
  await expect(card).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(card).toBeHidden();
});

test("business card dialog holds keyboard focus and returns it to its button", async ({ page }) => {
  await page.goto("/tr/contact");
  const trigger = await businessCardButton(page);
  const card = page.getByRole("dialog", { name: "Dijital kartvizit" });
  await trigger.click();
  await expect(card.locator(":focus")).toHaveAccessibleName("Kapat");
  await page.keyboard.press("Enter");
  await expect(card).toBeHidden();
  await expect(trigger).toBeFocused();
  await trigger.click();
  await expect(card.locator(":focus")).toHaveAccessibleName("Kapat");
  await expectFocusTrapped(page, card);
  await page.keyboard.press("Escape");
  await expect(card).toBeHidden();
  await expect(trigger).toBeFocused();
});

test("footer and business card small print meet AA contrast", async ({ page }) => {
  await page.goto("/tr/about");
  expect(await lowContrastText(page.getByRole("contentinfo"))).toEqual([]);
  await page.goto("/tr/kartvizit");
  expect(await lowContrastText(page.getByRole("main"))).toEqual([]);
});

test("business card logo loads eagerly only on the card page", async ({ page }) => {
  const preload = page.locator('link[rel="preload"][as="image"][imagesrcset*="general_black_cuted"]');
  await page.goto("/tr/about");
  await (await businessCardButton(page)).click();
  await expect(page.getByRole("dialog", { name: "Dijital kartvizit" }).getByRole("img", { name: "U+ Studio" })).toHaveAttribute("loading", "lazy");
  await expect(preload).toHaveCount(0);
  await page.goto("/tr/kartvizit");
  await expect(page.getByRole("main").getByRole("img", { name: "U+ Studio" })).not.toHaveAttribute("loading", "lazy");
  await expect(preload).toHaveCount(1);
});

test.describe("phones", () => {
  test.skip(({ isMobile }) => !isMobile, "phone-only behaviour");

  test("menu opens, navigates and closes", async ({ page }) => {
    await page.goto("/tr");
    const toggle = page.getByRole("button", { name: "Menü" });
    await toggle.click();
    const menu = page.getByRole("dialog", { name: "Menü" });
    await expect(menu).toBeVisible();
    await menu.getByRole("button", { name: /Kapat/ }).click();
    await expect(menu).toBeHidden();
    await toggle.click();
    await menu.getByRole("link", { name: /Hakkımızda/ }).click();
    await expect(page).toHaveURL(/\/tr\/about$/);
    await expect(menu).toBeHidden();
  });

  test("leaving a scrolled page through the menu opens the next page at the top with a steady top bar", async ({ page }) => {
    await page.addInitScript(() => sessionStorage.setItem("u-curtain", "1"));
    await page.goto("/tr/about");
    const toggle = page.getByRole("button", { name: "Menü" });
    await page.evaluate(() => scrollTo({ top: 1400, behavior: "instant" }));
    await expect(async () => {
      await page.evaluate(() => scrollBy({ top: -60, behavior: "instant" }));
      await page.waitForTimeout(700);
      await expect(toggle).toBeInViewport({ ratio: 1, timeout: 500 });
    }).toPass();
    expect(await page.evaluate(() => scrollY)).toBeGreaterThan(400);
    const menu = page.getByRole("dialog", { name: "Menü" });
    await toggle.dispatchEvent("click");
    await expect(menu).toBeVisible();
    await page.evaluate(() => {
      const w = window as unknown as { scrolls: number[] };
      w.scrolls = [scrollY];
      addEventListener("scroll", () => w.scrolls.push(scrollY), { passive: true });
    });
    await menu.getByRole("link", { name: /Projeler/ }).click();
    await expect(page).toHaveURL(/\/tr\/projects$/);
    await expect(menu).toBeHidden();
    const navHeights: number[] = [];
    for (let i = 0; i < 12; i++) {
      navHeights.push(await page.evaluate(() => Math.round(document.querySelector("nav")!.getBoundingClientRect().height)));
      await page.waitForTimeout(50);
    }
    const scrolls = await page.evaluate(() => (window as unknown as { scrolls: number[] }).scrolls);
    expect(Math.max(...scrolls)).toBe(0);
    expect(new Set(navHeights).size).toBe(1);
  });

  test("menu holds keyboard focus and returns it to the toggle", async ({ page }) => {
    await page.goto("/tr");
    const toggle = page.getByRole("button", { name: "Menü" });
    const menu = page.getByRole("dialog", { name: "Menü" });
    const close = menu.getByRole("button", { name: /Kapat/ });
    await toggle.click();
    await expect(close).toBeFocused();
    await expectFocusTrapped(page, menu);
    await close.click();
    await expect(menu).toBeHidden();
    await expect(toggle).toBeFocused();
    await toggle.click();
    await expect(close).toBeFocused();
    await page.keyboard.press("Escape");
    await expect(menu).toBeHidden();
    await expect(toggle).toBeFocused();
  });

  test("menu contact links are comfortable tap targets on small phones", async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 568 });
    await page.goto("/tr");
    await page.getByRole("button", { name: "Menü" }).click();
    const menu = page.getByRole("dialog", { name: "Menü" });
    for (const name of [studioInfo.email, studioInfo.phoneDisplay]) {
      expect((await menu.getByRole("link", { name }).boundingBox())?.height ?? 0, name).toBeGreaterThanOrEqual(24);
    }
    await expect(menu.getByRole("link", { name: /Şimdi Ara/ })).toBeInViewport({ ratio: 1 });
  });

  test("the menu carries the studio links instead of a second icon row", async ({ page, viewport }) => {
    test.skip((viewport?.width ?? 0) >= 640, "tablets and phones held sideways have no call link");
    await page.goto("/tr/about");
    await expect(page.getByRole("link", { name: "WhatsApp" }).filter({ visible: true })).toHaveCount(0);
    await page.getByRole("button", { name: "Menü" }).click();
    const menu = page.getByRole("dialog", { name: "Menü" });
    const links: [string, string][] = [
      ["Yol tarifi", studioInfo.directionsUrl],
      ["Ara", studioInfo.phoneHref],
      ["WhatsApp", studioInfo.whatsappUrl],
      ["E-posta", `mailto:${studioInfo.email}`],
      ["Google Maps", studioInfo.mapsUrl],
      ["Instagram", studioInfo.instagramUrl],
      ["Yandex Maps", studioInfo.yandexMapsUrl],
      ["Armut", studioInfo.armutUrl],
      ["Peyzaj Rehber", studioInfo.peyzajRehberUrl],
    ];
    for (const [name, href] of links) {
      await expect(menu.getByRole("link", { name, exact: true })).toHaveAttribute("href", href);
    }
    const cardButton = menu.getByRole("button", { name: "Kartviziti paylaş" });
    await cardButton.click();
    const card = page.getByRole("dialog", { name: "Dijital kartvizit" });
    await expect(card.locator(":focus")).toHaveAccessibleName("Kapat");
    await page.keyboard.press("Escape");
    await expect(card).toBeHidden();
    await expect(menu).toBeVisible();
    await expect(cardButton).toBeFocused();
  });

  test("language buttons answer taps around their small letters", async ({ page }) => {
    await page.goto("/tr/about");
    const en = page.locator("nav").first().getByRole("button", { name: "EN", exact: true }).filter({ visible: true });
    const box = await en.boundingBox();
    await expect(async () => {
      await page.mouse.click((box?.x ?? 0) + (box?.width ?? 0) / 2, (box?.y ?? 0) - 9);
      await expect(page).toHaveURL(/\/en\/about$/, { timeout: 1000 });
    }).toPass();
  });

  test("home page ends the bottom featured project row with directions, WhatsApp and Instagram", async ({ page }) => {
    await page.goto("/tr");
    const hero = page.locator("#home");
    const row: [string, string][] = [
      ["Yol tarifi", studioInfo.directionsUrl],
      ["WhatsApp", studioInfo.whatsappUrl],
      ["Instagram", studioInfo.instagramUrl],
    ];
    const icons = row.map(([name]) => hero.getByRole("link", { name, exact: true }));
    for (const [i, [, href]] of row.entries()) await expect(icons[i]).toHaveAttribute("href", href);
    const boxes = await Promise.all([hero.getByRole("link", { name: /önce \/ sonra/ }), ...icons].map((link) => link.boundingBox()));
    expect(boxes.every((b, i) => b && (i === 0 || b.x >= (boxes[i - 1]?.x ?? 0) + (boxes[i - 1]?.width ?? 0) - 1))).toBe(true);
    const middle = (i: number) => (boxes[i]?.y ?? 0) + (boxes[i]?.height ?? 0) / 2;
    expect([1, 2, 3].every((i) => Math.abs(middle(i) - middle(0)) <= 2)).toBe(true);
  });

  test("business card share options scroll into view above the action bar", async ({ page }) => {
    await page.addInitScript(() => Object.defineProperty(Navigator.prototype, "share", { value: undefined }));
    await page.goto("/tr/about");
    await (await businessCardButton(page)).click();
    const card = page.getByRole("dialog", { name: "Dijital kartvizit" });
    const share = card.getByRole("button", { name: "Paylaş", exact: true });
    await expect(share).toBeVisible();
    await card.evaluate((el) => el.scrollTo(0, 0));
    await share.click();
    const copyLink = card.getByRole("button", { name: "Bağlantıyı kopyala" });
    await expect(copyLink).toBeInViewport({ ratio: 1 });
    await expect
      .poll(async () => ((await copyLink.boundingBox())?.y ?? 0) + ((await copyLink.boundingBox())?.height ?? 0) <= ((await share.boundingBox())?.y ?? 0))
      .toBe(true);
  });

  test("booking buttons call the studio, except on the contact page", async ({ page, viewport }) => {
    test.skip((viewport?.width ?? 0) >= 640, "tablets and phones held sideways book instead of calling");
    await page.goto("/tr");
    await expect(page.getByRole("link", { name: /Şimdi Ara/ }).first()).toHaveAttribute("href", "tel:+905453204007");
    await expect(page.getByRole("button", { name: /Randevu Al/ }).filter({ visible: true })).toHaveCount(0);
    await page.goto("/tr/contact");
    await expect(page.getByRole("main").getByRole("button", { name: /Randevu Al/ }).filter({ visible: true }).first()).toBeVisible();
  });
});

test.describe("desktop", () => {
  test.skip(({ isMobile }) => isMobile, "desktop-only behaviour");

  test("booking buttons open the appointment form", async ({ page }) => {
    await page.goto("/tr");
    await page.getByRole("button", { name: /Randevu Al/ }).filter({ visible: true }).first().click();
    await expect(page.getByRole("dialog", { name: "Randevu Al" })).toBeVisible();
  });

  test("footer links to every service page", async ({ page, request }) => {
    for (const locale of LOCALES) {
      await page.goto(`/${locale}/about`);
      const footer = page.getByRole("contentinfo");
      for (const { slug, copy } of SERVICE_LANDINGS) {
        const href = `/${locale}/services/${slug}`;
        await expect(footer.getByRole("link", { name: copy[locale].crumb, exact: true })).toHaveAttribute("href", href);
        expect((await request.get(href)).status(), href).toBe(200);
      }
    }
  });
});
