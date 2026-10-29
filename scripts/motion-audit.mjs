// Motion & loading measurements against a running build (default http://localhost:3100, start it with `npm run start -- -p 3100`).
// Usage: node scripts/motion-audit.mjs [--label before] [--only scroll,idle,load,nav,slow,phone,flows] [--browsers chromium,webkit,firefox]
// Writes motion-audit/<label>.json and prints a summary. Chromium numbers come from headless, software-rastered Chromium
// with CDP CPU throttling: compare runs with each other, never read them as real-device frame rates.
import { mkdir, writeFile } from "node:fs/promises";
import { chromium, firefox, webkit } from "@playwright/test";

const BASE = (process.env.BASE_URL ?? "http://localhost:3100").replace(/\/$/, "");
const arg = (name, fallback) => {
  const i = process.argv.indexOf(`--${name}`);
  return i > -1 ? process.argv[i + 1] : fallback;
};
const LABEL = arg("label", "run");
const ONLY = new Set(arg("only", "scroll,idle,load,nav,slow,flows").split(","));
const BROWSERS = arg("browsers", "chromium,webkit,firefox").split(",");
const ENGINES = { chromium, webkit, firefox };

const PHONE = { viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true };
const SMALL_PHONE = { viewport: { width: 320, height: 640 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true };
const TABLET = { viewport: { width: 820, height: 1180 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true };
const LAPTOP = { viewport: { width: 1366, height: 768 } };
const DESKTOP = { viewport: { width: 1440, height: 900 } };
const WIDE = { viewport: { width: 2560, height: 1440 } };
const DEVICES = { "phone-390": PHONE, "phone-320": SMALL_PHONE, "tablet-820": TABLET, "laptop-1366": LAPTOP, "desktop-1440": DESKTOP, "wide-2560": WIDE };

const SCROLL_PAGES = ["/tr", "/tr/projects", "/tr/projects/villa-donusumu", "/tr/about", "/tr/services", "/tr/contact"];
const IDLE_PAGES = ["/tr", "/tr/projects", "/tr/about"];

const results = { label: LABEL, base: BASE, at: new Date().toISOString(), scroll: [], idle: [], load: [], nav: [], slow: [], phone: [], profile: [], flows: [], errors: [] };

const pct = (values, p) => {
  if (!values.length) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.min(sorted.length - 1, Math.floor((p / 100) * sorted.length))];
};
const round = (n) => Math.round(n * 10) / 10;

async function context(engine, device, { curtain = false, reduce = false } = {}) {
  const browser = await ENGINES[engine].launch();
  const ctx = await browser.newContext({ ...device, ...(engine === "firefox" ? { isMobile: undefined } : {}), locale: "tr-TR", reducedMotion: reduce ? "reduce" : "no-preference" });
  if (!curtain) await ctx.addInitScript(() => sessionStorage.setItem("u-curtain", "1"));
  await ctx.addInitScript(() => {
    globalThis.__cls = 0;
    globalThis.__lcp = 0;
    globalThis.__loaf = [];
    globalThis.__events = [];
    const watch = (type, fn, extra = {}) => {
      try {
        new PerformanceObserver((list) => list.getEntries().forEach(fn)).observe({ type, buffered: true, ...extra });
      } catch {}
    };
    watch("layout-shift", (e) => !e.hadRecentInput && (globalThis.__cls += e.value));
    watch("largest-contentful-paint", (e) => (globalThis.__lcp = e.startTime));
    watch("long-animation-frame", (e) => globalThis.__loaf.push({ d: e.duration, block: e.blockingDuration, at: e.startTime }));
    watch("event", (e) => e.interactionId && globalThis.__events.push({ name: e.name, d: e.duration }), { durationThreshold: 16 });
    // Keep one recording across document navigation and back/forward cache restoration.
    // Frame timestamps use the absolute time origin, so a document change cannot reset the counter.
    globalThis.__startFrameRecording = () => {
      cancelAnimationFrame(globalThis.__frameId);
      globalThis.__frames = [];
      const step = (t) => {
        if (sessionStorage.getItem("motion-audit-recording") !== "1") return;
        const now = performance.timeOrigin + t;
        const previous = Number(sessionStorage.getItem("motion-audit-last-frame")) || now;
        globalThis.__frames.push(now - previous);
        sessionStorage.setItem("motion-audit-last-frame", String(now));
        globalThis.__frameId = requestAnimationFrame(step);
      };
      globalThis.__frameId = requestAnimationFrame(step);
    };
    addEventListener("pagehide", () => {
      cancelAnimationFrame(globalThis.__frameId);
      if (sessionStorage.getItem("motion-audit-recording") !== "1") return;
      const previous = JSON.parse(sessionStorage.getItem("motion-audit-frames") || "[]");
      sessionStorage.setItem("motion-audit-frames", JSON.stringify([...previous, ...globalThis.__frames]));
      globalThis.__frames = [];
    });
    addEventListener("pageshow", () => {
      if (sessionStorage.getItem("motion-audit-recording") === "1") globalThis.__startFrameRecording();
    });
  });
  const page = await ctx.newPage();
  page.on("pageerror", (err) => results.errors.push({ engine, url: page.url(), error: String(err) }));
  page.on("console", (msg) => msg.type() === "error" && results.errors.push({ engine, url: page.url(), console: msg.text().slice(0, 300) }));
  let cdp = null;
  if (engine === "chromium") cdp = await ctx.newCDPSession(page);
  return { browser, ctx, page, cdp };
}

async function throttle(cdp, rate) {
  if (cdp) await cdp.send("Emulation.setCPUThrottlingRate", { rate });
}

async function settle(page) {
  await page.waitForLoadState("load");
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(1200);
}

// Scrolls the page by script, one step per frame, and records frame-to-frame intervals and long animation frames.
async function scrollFrames(page, ms = 3000) {
  return page.evaluate(async (duration) => {
    const max = document.documentElement.scrollHeight - innerHeight;
    const speed = Math.max(1.2, Math.min(4, max / duration));
    const frames = [];
    const loafStart = globalThis.__loaf.length;
    await new Promise((done) => {
      const start = performance.now();
      let last = start;
      const step = (t) => {
        frames.push(t - last);
        last = t;
        scrollTo(0, Math.min(max, (t - start) * speed));
        if (t - start < duration && scrollY < max) requestAnimationFrame(step);
        else done();
      };
      requestAnimationFrame(step);
    });
    frames.shift();
    return { frames, loaf: globalThis.__loaf.slice(loafStart), reached: scrollY, max };
  }, ms);
}

function frameStats(frames) {
  return {
    n: frames.length,
    avg: round(frames.reduce((a, b) => a + b, 0) / Math.max(1, frames.length)),
    p95: round(pct(frames, 95)),
    max: round(Math.max(0, ...frames)),
    over25: frames.filter((f) => f > 25).length,
    over50: frames.filter((f) => f > 50).length,
  };
}

async function runScroll() {
  for (const [device, cpu] of [["phone-390", 4], ["desktop-1440", 1], ["desktop-1440", 4]]) {
    const { browser, page, cdp } = await context("chromium", DEVICES[device]);
    for (const path of SCROLL_PAGES) {
      await page.goto(BASE + path);
      await settle(page);
      await throttle(cdp, cpu);
      const run = await scrollFrames(page);
      await throttle(cdp, 1);
      const row = { path, device, cpu, ...frameStats(run.frames), loafCount: run.loaf.length, loafMax: round(Math.max(0, ...run.loaf.map((l) => l.d))) };
      results.scroll.push(row);
      console.log(`scroll ${device} cpu${cpu}x ${path}: avg ${row.avg}ms p95 ${row.p95}ms max ${row.max}ms >25ms ${row.over25}/${row.n} LoAF ${row.loafCount}`);
    }
    await browser.close();
  }
}

// Main-thread time spent while the page just sits there (no input): continuous animations show up here.
async function runIdle() {
  for (const device of ["phone-390", "desktop-1440"]) {
    const { browser, page, cdp } = await context("chromium", DEVICES[device]);
    await cdp.send("Performance.enable");
    for (const path of IDLE_PAGES) {
      await page.goto(BASE + path);
      await settle(page);
      await page.waitForTimeout(2500);
      for (const where of ["top", "middle"]) {
        if (where === "middle") {
          await page.evaluate(() => scrollTo({ top: document.documentElement.scrollHeight / 2, behavior: "instant" }));
          await page.waitForTimeout(1500);
        }
        const read = async () => Object.fromEntries((await cdp.send("Performance.getMetrics")).metrics.map((m) => [m.name, m.value]));
        const a = await read();
        await page.waitForTimeout(5000);
        const b = await read();
        const row = {
          path,
          device,
          where,
          taskMsPerSec: round(((b.TaskDuration - a.TaskDuration) * 1000) / 5),
          scriptMsPerSec: round(((b.ScriptDuration - a.ScriptDuration) * 1000) / 5),
          styleRecalcsPerSec: round((b.RecalcStyleCount - a.RecalcStyleCount) / 5),
          layoutsPerSec: round((b.LayoutCount - a.LayoutCount) / 5),
        };
        results.idle.push(row);
        console.log(`idle ${device} ${path} ${where}: task ${row.taskMsPerSec}ms/s script ${row.scriptMsPerSec}ms/s style ${row.styleRecalcsPerSec}/s layout ${row.layoutsPerSec}/s`);
      }
    }
    await browser.close();
  }
}

async function routeList() {
  const xml = await (await fetch(`${BASE}/sitemap.xml`)).text();
  const paths = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname);
  return [...paths, "/tr/kartvizit", "/en/kartvizit", "/tr/bu-sayfa-yok"];
}

// Cold load of every real route: LCP, CLS, console errors, heading visible, stuck overlays.
async function runLoad() {
  const routes = await routeList();
  for (const [engine, device] of [["chromium", "phone-390"], ["chromium", "desktop-1440"], ["webkit", "phone-390"], ["firefox", "desktop-1440"]]) {
    if (!BROWSERS.includes(engine)) continue;
    const { browser, page } = await context(engine, DEVICES[device]);
    for (const path of routes) {
      const t0 = Date.now();
      const res = await page.goto(BASE + path);
      await settle(page);
      const probe = await page.evaluate(() => {
        const h1 = document.querySelector("h1");
        const r = h1?.getBoundingClientRect();
        const blocker = document.elementFromPoint(innerWidth / 2, innerHeight / 2);
        return {
          cls: globalThis.__cls,
          lcp: globalThis.__lcp,
          h1: Boolean(h1 && r && r.width > 0 && r.height > 0),
          overlay: Boolean(document.querySelector(".page-curtain")) || "curtain" in document.documentElement.dataset,
          blockedBy: blocker?.closest("[aria-modal='true'], .page-curtain") ? blocker.className.toString().slice(0, 60) : null,
          hiddenText: [...document.querySelectorAll("main h2, main h3, main p")].filter((el) => getComputedStyle(el).opacity === "0").length,
        };
      });
      const row = { engine, device, path, status: res?.status(), ms: Date.now() - t0, cls: Math.round(probe.cls * 1000) / 1000, lcp: Math.round(probe.lcp), h1: probe.h1, overlay: probe.overlay, blockedBy: probe.blockedBy };
      results.load.push(row);
      if (row.cls > 0.1 || !row.h1 || row.overlay || row.blockedBy) console.log(`load WARN ${engine} ${device} ${path}`, row);
    }
    const mine = results.load.filter((r) => r.engine === engine && r.device === device);
    console.log(`load ${engine} ${device}: ${mine.length} routes, worst CLS ${Math.max(...mine.map((r) => r.cls))}, p75 LCP ${pct(mine.map((r) => r.lcp), 75)}ms, no-h1 ${mine.filter((r) => !r.h1).map((r) => r.path).join(" ") || "-"}`);
    await browser.close();
  }
}

// Click → new page usable, for the main route pairs, via the real links on the page.
const PAIRS = [
  ["/tr", "a[href='/tr/projects']", "/tr/projects"],
  ["/tr/projects", "a[href='/tr/projects/villa-donusumu']", "/tr/projects/villa-donusumu"],
  ["/tr/projects/villa-donusumu", "a[href^='/tr/projects/']:not([href$='/video']):last-of-type", null],
  ["/tr/projects/villa-donusumu", "a[href='/tr/projects']", "/tr/projects"],
  ["/tr/about", "a[href='/tr/services']", "/tr/services"],
  ["/tr/services", "a[href='/tr/contact']", "/tr/contact"],
  ["/tr/contact", "a[href='/tr/glossary']", "/tr/glossary"],
  ["/tr", "a[href='/tr/services/ic-mimarlik-ankara']", "/tr/services/ic-mimarlik-ankara"],
];

async function clickTo(page, selector, expected) {
  const link = page.locator(selector).filter({ visible: true }).first();
  await link.scrollIntoViewIfNeeded();
  const target = expected ?? new URL(await link.getAttribute("href"), BASE).pathname;
  const before = await page.evaluate(() => globalThis.__events.length);
  const t0 = Date.now();
  await link.click();
  await page.waitForFunction((p) => location.pathname === p && document.querySelector("h1")?.getBoundingClientRect().height > 0, target, { timeout: 8000 });
  const usable = Date.now() - t0;
  await page.waitForTimeout(700);
  const after = await page.evaluate(
    ([from]) => ({
      events: globalThis.__events.slice(from),
      scrollY: Math.round(scrollY),
      focus: document.activeElement?.tagName,
      overlay: Boolean(document.querySelector(".page-curtain")) || "curtain" in document.documentElement.dataset,
      title: document.title,
    }),
    [before]
  );
  return { target, usable, inp: Math.max(0, ...after.events.filter((e) => e.name === "click" || e.name === "pointerup").map((e) => e.d)), ...after };
}

async function runNav() {
  for (const [engine, device, cpu] of [["chromium", "phone-390", 4], ["chromium", "desktop-1440", 1], ["webkit", "phone-390", 1], ["firefox", "desktop-1440", 1]]) {
    if (!BROWSERS.includes(engine)) continue;
    const { browser, page, cdp } = await context(engine, DEVICES[device]);
    await page.goto(BASE + "/tr");
    await settle(page);
    for (const [from, selector, to] of PAIRS) {
      if (new URL(page.url()).pathname !== from) {
        await page.goto(BASE + from);
        await settle(page);
      }
      await throttle(cdp, cpu);
      try {
        const r = await clickTo(page, selector, to);
        results.nav.push({ engine, device, cpu, from, ...r, events: undefined });
        console.log(`nav ${engine} ${device} cpu${cpu}x ${from} → ${r.target}: usable ${r.usable}ms, click event ${r.inp}ms, scrollY ${r.scrollY}, overlay ${r.overlay}`);
      } catch (error) {
        results.nav.push({ engine, device, cpu, from, selector, fail: String(error).slice(0, 200) });
        console.log(`nav FAIL ${engine} ${device} ${from} ${selector}: ${String(error).slice(0, 160)}`);
      }
      await throttle(cdp, 1);
    }
    await browser.close();
  }
}

// Slow 4G + 4× CPU phone, tapping right after load so the link's prefetch may not have finished.
async function runSlow() {
  const { browser, page, cdp } = await context("chromium", PHONE);
  await cdp.send("Network.enable");
  for (const [from, selector, to] of PAIRS.filter(([, , to]) => to)) {
    await cdp.send("Network.emulateNetworkConditions", { offline: false, latency: 150, downloadThroughput: (1.6 * 1024 * 1024) / 8, uploadThroughput: (750 * 1024) / 8 });
    await page.goto(BASE + from, { waitUntil: "domcontentloaded" });
    // Tap as soon as React owns the links (before that a tap is an ordinary full page load).
    await page.waitForFunction(() => Object.keys(document.querySelector("main a") ?? {}).some((k) => k.startsWith("__reactProps")), null, { timeout: 30000 });
    await throttle(cdp, 4);
    try {
      const frozen = page.evaluate(() => {
        // Longest gap between frames right after the tap: the time the screen could not change.
        let last = performance.now();
        let worst = 0;
        const end = last + 3000;
        return new Promise((done) => {
          const step = (t) => {
            worst = Math.max(worst, t - last);
            last = t;
            if (t < end) requestAnimationFrame(step);
            else done(Math.round(worst));
          };
          requestAnimationFrame(step);
        });
      });
      const r = await clickTo(page, selector, to);
      const row = { engine: "chromium", device: "phone-390", network: "slow-4g", cpu: 4, from, target: r.target, usable: r.usable, longestFrameGap: await frozen.catch(() => null) };
      results.slow.push(row);
      console.log(`slow ${from} → ${r.target}: usable ${r.usable}ms, longest frame gap ${row.longestFrameGap}ms`);
    } catch (error) {
      results.slow.push({ from, selector, fail: String(error).slice(0, 200) });
      console.log(`slow FAIL ${from}: ${String(error).slice(0, 160)}`);
    }
    await throttle(cdp, 1);
  }
  await browser.close();
}

// Phones: frame times while a finger swipes (compositor-driven gesture), the menu opens/closes, a page changes,
// the before/after slider is dragged and the project filter changes, at several phone sizes and CPU slowdowns.
const PHONES = {
  "phone-320": SMALL_PHONE,
  "phone-360": { viewport: { width: 360, height: 780 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true },
  "phone-390": PHONE,
  "phone-430": { viewport: { width: 430, height: 932 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true },
  "landscape-844": { viewport: { width: 844, height: 390 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true },
};

async function framesDuring(page, action, tailMs = 600) {
  await page.evaluate(() => {
    sessionStorage.setItem("motion-audit-recording", "1");
    sessionStorage.setItem("motion-audit-frames", "[]");
    sessionStorage.setItem("motion-audit-last-frame", String(performance.timeOrigin + performance.now()));
    globalThis.__startFrameRecording();
  });
  await action();
  await page.waitForTimeout(tailMs);
  const frames = await page.evaluate(() => {
    cancelAnimationFrame(globalThis.__frameId);
    const previous = JSON.parse(sessionStorage.getItem("motion-audit-frames") || "[]");
    const frames = [...previous, ...globalThis.__frames].slice(1);
    for (const key of ["motion-audit-recording", "motion-audit-frames", "motion-audit-last-frame"]) sessionStorage.removeItem(key);
    return frames;
  });
  return frameStats(frames);
}

async function runPhone() {
  const phones = new Set(arg("phones", Object.keys(PHONES).join(",")).split(","));
  const cpus = arg("cpus", "4,6").split(",").map(Number);
  for (const [device, opts] of Object.entries(PHONES).filter(([name]) => phones.has(name))) {
    for (const cpu of cpus) {
      const { browser, page, cdp } = await context("chromium", opts);
      const w = opts.viewport.width, h = opts.viewport.height;
      const row = (what, stats) => {
        results.phone.push({ device, cpu, what, ...stats });
        console.log(`phone ${device} cpu${cpu}x ${what}: avg ${stats.avg}ms p95 ${stats.p95}ms max ${stats.max}ms >25ms ${stats.over25}/${stats.n}`);
      };
      const swipe = (distance) => cdp.send("Input.synthesizeScrollGesture", { x: Math.round(w / 2), y: Math.round(h * 0.75), yDistance: distance, speed: 1800, gestureSourceType: "touch" });

      for (const path of ["/tr", "/tr/projects", "/tr/about", "/tr/projects/villa-donusumu", "/tr/services"]) {
        await page.goto(BASE + path);
        await settle(page);
        await throttle(cdp, cpu);
        row(`swipe ${path}`, await framesDuring(page, async () => {
          await swipe(-Math.round(h * 3));
          await swipe(-Math.round(h * 3));
          await swipe(Math.round(h * 2));
        }));
        await throttle(cdp, 1);
      }

      if (w < 1024) {
        await page.goto(BASE + "/tr/about");
        await settle(page);
        await throttle(cdp, cpu);
        const toggle = page.getByRole("button", { name: /menü/i }).first();
        row("menu open", await framesDuring(page, () => toggle.tap(), 900));
        row("menu close", await framesDuring(page, () => page.getByRole("dialog").getByRole("button", { name: /kapat/i }).tap(), 700));
        row("menu → page", await framesDuring(page, async () => {
          await toggle.tap();
          await page.waitForTimeout(700);
          await page.getByRole("dialog").locator("a[href='/tr/services']").tap();
          await page.waitForURL(/\/tr\/services$/);
        }, 800));
        await throttle(cdp, 1);
      }

      await page.goto(BASE + "/tr/projects");
      await settle(page);
      await throttle(cdp, cpu);
      row("filter change", await framesDuring(page, () => page.locator("button[aria-pressed]").nth(1).tap(), 900));
      const card = page.locator("main a[href^='/tr/projects/']:not([href$='/video'])").filter({ visible: true }).first();
      await card.scrollIntoViewIfNeeded();
      row("page change (tap card)", await framesDuring(page, async () => {
        await card.tap();
        await page.waitForURL(/\/tr\/projects\/[^/]+$/);
      }, 800));
      row("back", await framesDuring(page, async () => {
        await page.goBack();
        await page.waitForURL(/\/tr\/projects$/);
      }, 600));
      await throttle(cdp, 1);

      await page.goto(BASE + "/tr/projects/villa-donusumu");
      await settle(page);
      const slider = page.getByRole("slider").first();
      await slider.scrollIntoViewIfNeeded();
      const box = await slider.evaluate((el) => {
        const r = el.parentElement.getBoundingClientRect();
        return { x: r.left, y: r.top, w: r.width, h: r.height };
      });
      await throttle(cdp, cpu);
      const y = Math.round(box.y + box.h / 2);
      row("before/after drag", await framesDuring(page, async () => {
        await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x: Math.round(box.x + box.w / 2), y }] });
        for (let i = 0; i <= 30; i++) {
          const x = Math.round(box.x + box.w * (0.5 + 0.4 * Math.sin((i / 30) * Math.PI / 2)));
          await cdp.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x, y }] });
          await page.waitForTimeout(16);
        }
        await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
      }, 300));
      const moved = await page.getByRole("slider").first().getAttribute("aria-valuenow");
      results.phone.push({ device, cpu, what: "slider moved", value: moved });
      if (Number(moved) < 80) results.errors.push({ device, cpu, error: "Touch drag did not move the slider to the right" });
      await throttle(cdp, 1);
      await browser.close();
    }
  }
}

async function runProfile() {
  const { browser, page, cdp } = await context("chromium", PHONE);
  await page.goto(BASE + "/tr/about");
  await settle(page);
  if (process.argv.includes("--without-mascots")) {
    await page.addStyleTag({ content: '[role="dialog"] svg[viewBox="0 0 140 150"] { display: none !important; }' });
  }
  if (process.argv.includes("--without-photo")) {
    await page.addStyleTag({ content: '[role="dialog"] img[src*="after.jpg"] { visibility: hidden !important; }' });
  }
  await throttle(cdp, 4);
  await cdp.send("Performance.enable");
  await cdp.send("Profiler.enable");
  const before = await cdp.send("Performance.getMetrics");
  const prefetchRequests = [];
  page.on("request", (request) => {
    if (request.headers()["next-router-prefetch"]) prefetchRequests.push(new URL(request.url()).pathname);
  });
  await cdp.send("Profiler.start");
  const frames = await framesDuring(page, () => page.getByRole("button", { name: "Menü", exact: true }).tap(), 1500);
  const { profile } = await cdp.send("Profiler.stop");
  const after = await cdp.send("Performance.getMetrics");
  const metrics = Object.fromEntries(after.metrics.map((m) => [m.name, m.value - (before.metrics.find((p) => p.name === m.name)?.value ?? 0)]));
  const nodes = new Map(profile.nodes.map((node) => [node.id, node]));
  const costs = new Map();
  for (const [i, sample] of profile.samples.entries()) {
    const frame = nodes.get(sample).callFrame;
    const key = `${frame.functionName || "(anonymous)"} ${frame.url}:${frame.lineNumber + 1}`;
    costs.set(key, (costs.get(key) ?? 0) + profile.timeDeltas[i]);
  }
  const summary = {
    frames,
    prefetchRequests,
    metrics: Object.fromEntries(["TaskDuration", "ScriptDuration", "LayoutDuration", "RecalcStyleDuration", "LayoutCount", "RecalcStyleCount"].map((key) => [key, metrics[key]])),
    hottest: [...costs.entries()].sort((a, b) => b[1] - a[1]).slice(0, 20).map(([fn, us]) => ({ fn, ms: round(us / 1000) })),
  };
  results.profile.push(summary);
  console.log(JSON.stringify(summary, null, 2));
  await browser.close();
}

// Back/forward scroll restore, rapid double navigation, menu → page on phones, reduced-motion navigation.
async function runFlows() {
  for (const engine of BROWSERS) {
    const flow = (name, pass, detail) => {
      results.flows.push({ engine, name, pass, detail });
      console.log(`flow ${pass ? "PASS" : "FAIL"} ${engine} ${name}${detail ? ` — ${JSON.stringify(detail)}` : ""}`);
    };

    let { browser, page } = await context(engine, PHONE);
    await page.goto(BASE + "/tr/projects");
    await settle(page);
    await page.evaluate(() => scrollTo({ top: 1600, behavior: "instant" }));
    await page.waitForTimeout(400);
    const card = page.locator("main a[href^='/tr/projects/']:not([href$='/video'])").filter({ visible: true }).nth(2);
    await card.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    const savedY = await page.evaluate(() => Math.round(scrollY));
    await card.click();
    await page.waitForFunction(() => /^\/tr\/projects\/[^/]+$/.test(location.pathname));
    await settle(page);
    const topY = await page.evaluate(() => Math.round(scrollY));
    await page.goBack();
    await page.waitForFunction(() => location.pathname === "/tr/projects");
    await page.waitForTimeout(1200);
    const backY = await page.evaluate(() => Math.round(scrollY));
    const slid = await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior);
    flow("detail opens at top", topY < 5, { topY });
    flow("back restores instantly (no smooth slide)", slid !== "smooth", { scrollBehavior: slid });
    flow("back restores list scroll", Math.abs(backY - savedY) < 120, { savedY, backY });
    await page.goForward();
    await page.waitForFunction(() => /^\/tr\/projects\/[^/]+$/.test(location.pathname));
    await page.waitForTimeout(800);
    flow("forward reaches detail", true, { y: await page.evaluate(() => Math.round(scrollY)) });

    await page.goto(BASE + "/tr");
    await settle(page);
    const menu = page.getByRole("button", { name: /menü|menu/i }).first();
    await menu.click();
    const dialog = page.getByRole("dialog");
    await dialog.waitFor();
    const locked = await page.evaluate(() => document.body.style.position === "fixed");
    await dialog.locator("a[href='/tr/about']").click();
    await page.waitForFunction(() => location.pathname === "/tr/about", null, { timeout: 15000 });
    await page.waitForFunction(() => !document.querySelector("[role='dialog']"), null, { timeout: 10000 }).catch(() => {});
    const menuState = await page.evaluate(() => ({ open: Boolean(document.querySelector("[role='dialog']")), unlocked: document.body.style.position === "", y: Math.round(scrollY) }));
    flow("menu → page closes menu, unlocks scroll", locked && !menuState.open && menuState.unlocked && menuState.y < 5, { locked, ...menuState });

    await page.goto(BASE + "/tr");
    await settle(page);
    await page.locator("a[href='/tr/projects']").first().evaluate((a) => a.click());
    await page.locator("a[href='/tr/about']").first().evaluate((a) => a.click());
    await page.waitForTimeout(2500);
    const rapid = await page.evaluate(() => ({ path: location.pathname, h1: document.querySelector("h1")?.textContent?.slice(0, 40), overlay: Boolean(document.querySelector(".page-curtain")) }));
    flow("rapid double navigation lands on last click", rapid.path === "/tr/about" && !rapid.overlay, rapid);
    await browser.close();

    ({ browser, page } = await context(engine, DESKTOP, { reduce: true }));
    await page.goto(BASE + "/tr/about");
    await settle(page);
    await page.evaluate(() => scrollTo({ top: document.documentElement.scrollHeight * 0.6, behavior: "instant" }));
    await page.waitForTimeout(400);
    const hidden = await page.evaluate(() =>
      [...document.querySelectorAll("main *")].filter((el) => {
        const r = el.getBoundingClientRect();
        return r.bottom > 0 && r.top < innerHeight && el.textContent.trim() && getComputedStyle(el).opacity === "0";
      }).length
    );
    flow("reduced motion: on-screen text visible without waiting", hidden === 0, { hidden });
    await page.evaluate(() => scrollTo({ top: 0, behavior: "instant" }));
    await page.waitForTimeout(400);
    const r = await clickTo(page, "a[href='/tr/contact']", "/tr/contact");
    flow("reduced motion: navigation works", r.usable < 4000, { usable: r.usable });
    await browser.close();

    ({ browser, page } = await context(engine, DESKTOP, { curtain: true }));
    const t0 = Date.now();
    await page.goto(BASE + "/tr/about");
    await page.waitForFunction(() => !document.querySelector(".page-curtain"), null, { timeout: 8000 }).catch(() => {});
    const gone = Date.now() - t0;
    await page.goto(BASE + "/tr/contact");
    await page.waitForTimeout(300);
    const again = await page.evaluate(() => Boolean(document.querySelector(".page-curtain:not([style*='display: none'])")) && getComputedStyle(document.querySelector(".page-curtain")).display !== "none");
    flow("first-visit curtain lifts", gone < 6000, { goneMs: gone });
    flow("curtain does not replay in the same session", !again, { again });
    await browser.close();
  }
}

if (ONLY.has("scroll")) await runScroll();
if (ONLY.has("idle")) await runIdle();
if (ONLY.has("load")) await runLoad();
if (ONLY.has("nav")) await runNav();
if (ONLY.has("slow")) await runSlow();
if (ONLY.has("phone")) await runPhone();
if (ONLY.has("profile")) await runProfile();
if (ONLY.has("flows")) await runFlows();

await mkdir("motion-audit", { recursive: true });
await writeFile(`motion-audit/${LABEL}.json`, JSON.stringify(results, null, 2));
console.log(`errors: ${results.errors.length}`, results.errors.slice(0, 10));
console.log(`wrote motion-audit/${LABEL}.json`);
