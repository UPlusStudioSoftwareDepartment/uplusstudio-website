// Read-only SEO crawl of a running site (default: production).
// Usage: node scripts/seo-audit.mjs [--out seo-audit] ; BASE_URL=http://localhost:3000 to audit a local build.
// Writes URL-, IMAGE- and VIDEO-INVENTORY.csv plus audit.json, prints FAIL/WARN lines, exits 1 on any FAIL.
import { mkdir, writeFile } from "node:fs/promises";

const BASE = (process.env.BASE_URL ?? "https://www.uplusstudio.com.tr").replace(/\/$/, "");
const CANONICAL_ORIGIN = process.env.CANONICAL_ORIGIN ?? "https://www.uplusstudio.com.tr";
const outArg = process.argv.indexOf("--out");
const OUT = outArg > -1 ? process.argv[outArg + 1] : "seo-audit";
const UA = "Mozilla/5.0 (compatible; UPlusSeoAudit/1.0; +https://www.uplusstudio.com.tr)";
const MAX_PAGES = 400;

const findings = [];
const flag = (level, where, message) => findings.push({ level, where, message });

const toLocal = (url) => (url.startsWith(CANONICAL_ORIGIN) ? BASE + url.slice(CANONICAL_ORIGIN.length) : url);
const toCanonical = (url) => (url.startsWith(BASE) ? CANONICAL_ORIGIN + url.slice(BASE.length) : url);
const decode = (s) =>
  s.replaceAll("&amp;", "&").replaceAll("&quot;", '"').replaceAll("&#x27;", "'").replaceAll("&#39;", "'").replaceAll("&lt;", "<").replaceAll("&gt;", ">");
const attr = (tag, name) => {
  const m = tag.match(new RegExp(`\\s${name}=(?:"([^"]*)"|'([^']*)')`, "i"));
  return m ? decode(m[1] ?? m[2]) : undefined;
};
const tags = (html, name) => [...html.matchAll(new RegExp(`<${name}\\b[^>]*>`, "gi"))].map((m) => m[0]);
const text = (s) => decode(s.replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();

async function get(url, { method = "GET", follow = true } = {}) {
  const chain = [];
  let current = url;
  for (let hop = 0; hop < 10; hop++) {
    let res;
    try {
      res = await fetch(current, { method, redirect: "manual", headers: { "User-Agent": UA } });
    } catch (error) {
      return { url, status: 0, error: String(error.cause?.code ?? error), chain };
    }
    if (res.status >= 300 && res.status < 400 && res.headers.get("location")) {
      chain.push(`${res.status} ${current}`);
      current = new URL(res.headers.get("location"), current).href;
      if (!follow) return { url, status: res.status, location: current, chain, headers: res.headers };
      continue;
    }
    const body = method === "GET" && /text|xml|json/.test(res.headers.get("content-type") ?? "") ? await res.text() : undefined;
    if (method === "GET" && body === undefined) await res.body?.cancel();
    return { url, finalUrl: current, status: res.status, headers: res.headers, body, chain };
  }
  return { url, status: 0, error: "redirect loop", chain };
}

async function pool(items, size, fn) {
  const results = [];
  let i = 0;
  await Promise.all(
    Array.from({ length: size }, async () => {
      while (i < items.length) {
        const index = i++;
        results[index] = await fn(items[index]);
      }
    })
  );
  return results;
}

// ---------- robots.txt + sitemap ----------
const robots = await get(`${BASE}/robots.txt`);
const robotsGroups = [];
if (robots.status === 200 && robots.body) {
  let group = null;
  for (const raw of robots.body.split(/\r?\n/)) {
    const line = raw.replace(/#.*/, "").trim();
    const [key, ...rest] = line.split(":");
    const value = rest.join(":").trim();
    if (/^user-agent$/i.test(key)) {
      if (!group || group.rules.length) robotsGroups.push((group = { agents: [], rules: [] }));
      group.agents.push(value.toLowerCase());
    } else if (/^(allow|disallow)$/i.test(key) && group) group.rules.push({ allow: /^allow$/i.test(key), path: value });
  }
} else flag("FAIL", "/robots.txt", `HTTP ${robots.status}`);
const sitemapDeclared = robots.body?.match(/^sitemap:\s*(\S+)/im)?.[1];
if (sitemapDeclared !== `${CANONICAL_ORIGIN}/sitemap.xml`) flag("FAIL", "/robots.txt", `Sitemap line is ${sitemapDeclared}`);

function robotsAllows(agent, path) {
  const group = robotsGroups.find((g) => g.agents.includes(agent)) ?? robotsGroups.find((g) => g.agents.includes("*"));
  if (!group) return true;
  const hits = group.rules.filter((r) => r.path && path.startsWith(r.path)).sort((a, b) => b.path.length - a.path.length || b.allow - a.allow);
  return hits.length ? hits[0].allow : true;
}

const sitemapRes = await get(`${BASE}/sitemap.xml`);
const sitemap = new Map();
if (sitemapRes.status !== 200 || !/xml/.test(sitemapRes.headers.get("content-type") ?? "")) flag("FAIL", "/sitemap.xml", `HTTP ${sitemapRes.status} ${sitemapRes.headers?.get("content-type")}`);
for (const block of sitemapRes.body?.match(/<url>[\s\S]*?<\/url>/g) ?? []) {
  const loc = decode(block.match(/<loc>([^<]+)<\/loc>/)[1]);
  sitemap.set(loc, {
    images: [...block.matchAll(/<image:loc>([^<]+)<\/image:loc>/g)].map((m) => decode(m[1])),
    videos: [...block.matchAll(/<video:video>([\s\S]*?)<\/video:video>/g)].map((m) => ({
      thumbnail: decode(m[1].match(/<video:thumbnail_loc>([^<]+)/)?.[1] ?? ""),
      title: decode(m[1].match(/<video:title>([^<]+)/)?.[1] ?? ""),
      description: decode(m[1].match(/<video:description>([^<]+)/)?.[1] ?? ""),
      content: decode(m[1].match(/<video:content_loc>([^<]+)/)?.[1] ?? ""),
      player: decode(m[1].match(/<video:player_loc>([^<]+)/)?.[1] ?? ""),
      date: m[1].match(/<video:publication_date>([^<]+)/)?.[1] ?? "",
    })),
    hreflang: [...block.matchAll(/hreflang="([^"]+)" href="([^"]+)"/g)].map((m) => [m[1], decode(m[2])]),
  });
}
if (sitemap.size > 50000 || (sitemapRes.body?.length ?? 0) > 50 * 1024 * 1024) flag("FAIL", "/sitemap.xml", "over 50,000 URLs or 50 MB");

// ---------- crawl ----------
const pages = new Map();
const linkedFrom = new Map();
const queue = [...sitemap.keys()].map(toLocal);
const seen = new Set(queue);
const normalise = (href, from) => {
  try {
    const u = new URL(href, from);
    if (u.origin !== new URL(BASE).origin) return null;
    u.hash = "";
    if (/^\/(api|_next|_vercel)\//.test(u.pathname) || /\.[a-z0-9]{2,5}$/i.test(u.pathname)) return null;
    return u.href;
  } catch {
    return null;
  }
};

while (queue.length && pages.size < MAX_PAGES) {
  const batch = queue.splice(0, 8);
  const results = await pool(batch, 8, (url) => get(url));
  for (const res of results) {
    const page = { url: res.url, status: res.status, finalUrl: res.finalUrl, chain: res.chain, error: res.error };
    pages.set(res.url, page);
    if (!res.body || !/html/.test(res.headers?.get("content-type") ?? "")) continue;
    const html = res.body;
    const head = html.slice(0, html.indexOf("</head>") + 7);
    page.xRobots = res.headers.get("x-robots-tag") ?? "";
    page.title = text(html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? "");
    page.description = attr(tags(head, "meta").find((t) => /name="description"/i.test(t)) ?? "", "content") ?? "";
    page.robotsMeta = tags(head, "meta")
      .filter((t) => /name="(robots|googlebot)"/i.test(t))
      .map((t) => `${attr(t, "name")}: ${attr(t, "content")}`)
      .join("; ");
    const canon = tags(head, "link").filter((t) => /rel="canonical"/i.test(t));
    page.canonicalCount = canon.length;
    page.canonical = canon[0] ? new URL(attr(canon[0], "href"), CANONICAL_ORIGIN).href : "";
    page.hreflang = tags(head, "link")
      .filter((t) => /rel="alternate"/i.test(t) && attr(t, "hreflang"))
      .map((t) => [attr(t, "hreflang"), new URL(attr(t, "href"), CANONICAL_ORIGIN).href]);
    page.ogUrl = attr(tags(head, "meta").find((t) => /property="og:url"/i.test(t)) ?? "", "content") ?? "";
    page.ogImage = attr(tags(head, "meta").find((t) => /property="og:image"/i.test(t)) ?? "", "content") ?? "";
    page.lang = attr(tags(html, "html")[0] ?? "", "lang") ?? "";
    page.h1 = [...html.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi)].map((m) => text(m[1]));
    page.words = text(html.replace(/<(script|style|noscript)\b[\s\S]*?<\/\1>/gi, "").match(/<body[\s\S]*<\/body>/i)?.[0] ?? "").split(" ").length;
    page.jsonLd = [];
    for (const m of html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)) {
      try {
        const data = JSON.parse(m[1]);
        const nodes = (Array.isArray(data) ? data : [data]).flatMap((d) => d["@graph"] ?? [d]);
        page.jsonLd.push(...nodes.map((n) => [n["@type"]].flat().join("+")));
        for (const n of nodes.flatMap(function walk(node) {
          return node && typeof node === "object" ? [node, ...Object.values(node).flatMap((v) => (Array.isArray(v) ? v.flatMap(walk) : walk(v)))] : [];
        })) {
          if (n["@type"] === "VideoObject") {
            for (const key of ["name", "thumbnailUrl", "uploadDate"]) if (!n[key]) flag("FAIL", res.url, `VideoObject missing ${key}`);
            (page.videoObjects ??= []).push(n);
          }
        }
      } catch (error) {
        flag("FAIL", res.url, `JSON-LD does not parse: ${error.message}`);
      }
    }
    page.images = tags(html, "img").map((t) => ({
      src: attr(t, "src") ?? "",
      srcset: attr(t, "srcset") ?? "",
      alt: attr(t, "alt"),
      loading: attr(t, "loading") ?? "",
      width: attr(t, "width") ?? "",
      height: attr(t, "height") ?? "",
      fetchpriority: attr(t, "fetchpriority") ?? "",
    }));
    page.videos = [...html.matchAll(/<video\b[^>]*>([\s\S]*?)<\/video>/gi)].map((m) => {
      const t = m[0].match(/<video\b[^>]*>/i)[0];
      const source = tags(m[1], "source")[0];
      return { src: attr(t, "src") ?? (source && attr(source, "src")) ?? "", poster: attr(t, "poster") ?? "", controls: /\scontrols(\s|=|>)/i.test(t), autoplay: /\sautoplay/i.test(t), loop: /\sloop/i.test(t), muted: /\smuted/i.test(t), label: attr(t, "aria-label") ?? "" };
    });
    page.iframes = tags(html, "iframe").map((t) => attr(t, "src") ?? "");
    page.cssBackgrounds = [...html.matchAll(/background-image:\s*url\(([^)]+)\)/gi)].map((m) => m[1].replace(/["']/g, ""));
    page.links = [];
    for (const t of tags(html, "a")) {
      const href = attr(t, "href");
      if (!href) continue;
      const target = normalise(href, res.finalUrl);
      if (!target) continue;
      page.links.push(target);
      if (!linkedFrom.has(target)) linkedFrom.set(target, new Set());
      linkedFrom.get(target).add(res.url);
      if (!seen.has(target)) {
        seen.add(target);
        queue.push(target);
      }
    }
  }
}

// ---------- page checks ----------
const titles = new Map();
const descriptions = new Map();
const inSitemap = new Set([...sitemap.keys()].map(toLocal));
for (const page of pages.values()) {
  const where = page.url.replace(BASE, "");
  page.inSitemap = inSitemap.has(page.url);
  page.inlinks = linkedFrom.get(page.url)?.size ?? 0;
  page.noindex = /noindex/i.test(`${page.robotsMeta} ${page.xRobots}`);
  page.robotsAllowed = robotsAllows("googlebot", new URL(page.url).pathname);
  if (page.status >= 300 && page.status < 400) {
    page.class = "REDIRECT";
    if (page.inSitemap) flag("FAIL", where, "redirect in sitemap");
    if (page.inlinks) flag("WARN", where, `linked internally (${page.inlinks} pages) but redirects`);
    continue;
  }
  if (page.chain?.length) {
    page.class = "REDIRECT";
    if (page.inSitemap) flag("FAIL", where, `sitemap URL redirects: ${page.chain.join(" → ")}`);
    else if (page.inlinks) flag("WARN", where, `internal link redirects: ${page.chain.join(" → ")} (from ${[...linkedFrom.get(page.url)][0].replace(BASE, "")})`);
    continue;
  }
  if (page.status !== 200) {
    page.class = page.status === 404 || page.status === 410 ? "GONE" : "UNKNOWN/BLOCKED";
    if (page.inSitemap) flag("FAIL", where, `sitemap URL returns ${page.status}`);
    if (page.inlinks) flag("FAIL", where, `broken internal link (${page.status}) from ${[...linkedFrom.get(page.url)].map((u) => u.replace(BASE, "")).join(", ")}`);
    continue;
  }
  page.class = page.noindex ? "INTENTIONALLY_NOT_INDEXED" : page.inSitemap ? "INDEXABLE_REQUIRED" : "INDEXABLE_OPTIONAL";
  if (page.noindex && page.inSitemap) flag("FAIL", where, "noindex page is in the sitemap");
  if (!page.robotsAllowed && page.inSitemap) flag("FAIL", where, "sitemap URL is disallowed by robots.txt");
  if (page.noindex) continue;
  if (!page.inSitemap) flag("WARN", where, "indexable page missing from the sitemap");
  if (page.canonicalCount !== 1) flag("FAIL", where, `${page.canonicalCount} canonical tags`);
  if (page.canonical !== toCanonical(page.url)) flag(page.inSitemap ? "FAIL" : "WARN", where, `canonical points to ${page.canonical}`);
  if (page.ogUrl && new URL(page.ogUrl, CANONICAL_ORIGIN).href !== page.canonical) flag("WARN", where, `og:url ${page.ogUrl} differs from canonical`);
  if (!page.title) flag("FAIL", where, "no <title>");
  if (!page.description) flag("FAIL", where, "no meta description");
  if (page.h1.length !== 1) flag(page.h1.length ? "WARN" : "FAIL", where, `${page.h1.length} <h1> elements`);
  if (page.inlinks === 0 && new URL(page.url).pathname.split("/").length > 2) flag("WARN", where, "no internal links point here (orphan)");
  const expectedLang = new URL(page.url).pathname.split("/")[1];
  if (!page.lang.toLowerCase().startsWith(expectedLang)) flag("FAIL", where, `<html lang="${page.lang}">`);
  const sm = sitemap.get(toCanonical(page.url));
  if (sm) {
    const a = JSON.stringify([...page.hreflang].sort()), b = JSON.stringify([...sm.hreflang].sort());
    if (a !== b) flag("WARN", where, "hreflang in HTML differs from sitemap");
  }
  for (const [, href] of page.hreflang) if (!pages.has(toLocal(href)) || pages.get(toLocal(href)).status !== 200) flag("FAIL", where, `hreflang target ${href} is not a 200 page`);
  for (const img of page.images) {
    if (img.alt === undefined) flag("FAIL", where, `<img> without alt: ${img.src}`);
    if (!img.src) flag("FAIL", where, "<img> with empty src");
  }
  for (const bg of page.cssBackgrounds) flag("WARN", where, `inline CSS background image ${bg} (not indexed by Google Images)`);
  for (const [k, list] of [[page.title, titles], [page.description, descriptions]]) list.set(k, [...(list.get(k) ?? []), where]);
}
for (const [value, where] of titles) if (value && where.length > 1) flag("WARN", where.join(", "), `duplicate title "${value}"`);
for (const [value, where] of descriptions) if (value && where.length > 1) flag("WARN", where.join(", "), "duplicate meta description");
for (const loc of sitemap.keys()) if (!loc.startsWith(`${CANONICAL_ORIGIN}/`) && loc !== CANONICAL_ORIGIN) flag("FAIL", loc, "sitemap URL is not on the canonical origin");

// ---------- assets ----------
const imageUse = new Map();
const addImage = (url, page, how, extra = {}) => {
  if (!url || url.startsWith("data:")) return;
  const abs = new URL(url, CANONICAL_ORIGIN).href;
  let original = abs;
  const u = new URL(abs);
  if (u.pathname === "/_next/image") original = new URL(u.searchParams.get("url"), CANONICAL_ORIGIN).href;
  const entry = imageUse.get(original) ?? { url: original, pages: new Set(), how: new Set(), alts: new Set(), fetchUrl: abs, sitemapPages: new Set() };
  if (page) entry.pages.add(page);
  entry.how.add(how);
  if (extra.alt !== undefined) entry.alts.add(extra.alt);
  if (extra.sitemapPage) entry.sitemapPages.add(extra.sitemapPage);
  imageUse.set(original, entry);
};
for (const page of pages.values()) {
  if (page.class !== "INDEXABLE_REQUIRED" && page.class !== "INDEXABLE_OPTIONAL") continue;
  const where = page.url.replace(BASE, "");
  for (const img of page.images ?? []) addImage(img.src, where, "img", { alt: img.alt });
  for (const v of page.videos ?? []) if (v.poster) addImage(v.poster, where, "video-poster");
  if (page.ogImage) addImage(page.ogImage, where, "og:image");
  for (const bg of page.cssBackgrounds ?? []) addImage(bg, where, "css-background");
}
for (const [loc, entry] of sitemap) {
  for (const src of entry.images) addImage(src, null, "sitemap", { sitemapPage: loc.replace(CANONICAL_ORIGIN, "") });
  for (const v of entry.videos) addImage(v.thumbnail, null, "sitemap-video-thumbnail", { sitemapPage: loc.replace(CANONICAL_ORIGIN, "") });
}
await pool([...imageUse.values()], 8, async (entry) => {
  const res = await get(toLocal(entry.url), { method: "GET" });
  entry.status = res.status;
  entry.type = res.headers?.get("content-type") ?? "";
  entry.bytes = Number(res.headers?.get("content-length") ?? 0);
  entry.xRobots = res.headers?.get("x-robots-tag") ?? "";
  entry.robotsAllowed = robotsAllows("googlebot-image", new URL(entry.url).pathname);
  if (entry.status !== 200) flag("FAIL", entry.url, `image HTTP ${entry.status} (used by ${[...entry.pages, ...entry.sitemapPages].join(", ")})`);
  else if (!entry.type.startsWith("image/")) flag("FAIL", entry.url, `image served as ${entry.type}`);
  if (/noindex|noimageindex/.test(entry.xRobots)) flag("WARN", entry.url, `X-Robots-Tag ${entry.xRobots}`);
  if (!entry.robotsAllowed) flag("FAIL", entry.url, "image disallowed by robots.txt");
  for (const sp of entry.sitemapPages) {
    const page = pages.get(BASE + sp);
    const onPage = page?.images?.some((i) => {
      const u = new URL(i.src, CANONICAL_ORIGIN);
      return (u.pathname === "/_next/image" ? new URL(u.searchParams.get("url"), CANONICAL_ORIGIN).href : u.href) === entry.url;
    }) || page?.videos?.some((v) => v.poster && new URL(v.poster, CANONICAL_ORIGIN).href === entry.url) || page?.ogImage === entry.url;
    if (!onPage) flag("WARN", entry.url, `listed in sitemap for ${sp} but not in that page's HTML <img>`);
  }
  if (entry.how.has("img") && [...entry.alts].every((a) => !a) && !entry.how.has("sitemap")) entry.decorative = true;
});

const videoUse = new Map();
for (const page of pages.values()) {
  if (page.class !== "INDEXABLE_REQUIRED" && page.class !== "INDEXABLE_OPTIONAL") continue;
  const where = page.url.replace(BASE, "");
  for (const v of page.videos ?? []) {
    const key = v.src || `${where}#${v.label || "video"}`;
    const entry = videoUse.get(key) ?? { src: v.src, label: v.label, uses: [] };
    entry.uses.push({ page: where, ...v, videoObject: page.videoObjects?.find((o) => v.src && new URL(o.contentUrl ?? "", CANONICAL_ORIGIN).pathname === v.src) });
    videoUse.set(key, entry);
  }
}
for (const [loc, entry] of sitemap) {
  for (const v of entry.videos) {
    const src = new URL(v.content || v.player, CANONICAL_ORIGIN).pathname;
    const e = videoUse.get(src) ?? { src, uses: [] };
    (e.sitemap ??= []).push({ page: loc.replace(CANONICAL_ORIGIN, ""), ...v });
    videoUse.set(src, e);
    const page = pages.get(toLocal(loc));
    if (!page?.videos?.some((pv) => pv.src === src)) flag("WARN", loc.replace(CANONICAL_ORIGIN, ""), `sitemap lists video ${src} but the page HTML has no <video src> for it (only after JS / scroll)`);
  }
}
await pool([...videoUse.values()].filter((v) => v.src), 4, async (entry) => {
  const res = await fetch(toLocal(new URL(entry.src, CANONICAL_ORIGIN).href), { headers: { Range: "bytes=0-1", "User-Agent": UA } }).catch(() => null);
  entry.status = res?.status ?? 0;
  entry.type = res?.headers.get("content-type") ?? "";
  entry.range = res?.status === 206;
  entry.bytes = Number(res?.headers.get("content-range")?.split("/")[1] ?? 0);
  await res?.body?.cancel();
  if (![200, 206].includes(entry.status)) flag("FAIL", entry.src, `video HTTP ${entry.status}`);
  else if (!entry.type.startsWith("video/")) flag("FAIL", entry.src, `video served as ${entry.type}`);
});

// ---------- variants and soft 404 ----------
const variants = [
  [`${BASE}/`, "redirect to /tr"],
  [`${BASE}/tr/`, "redirect to /tr"],
  [`${BASE}/tr/projects/`, "redirect to /tr/projects"],
  [`${BASE}/TR/projects`, "redirect or 404"],
  [`${BASE}/tr/projects/bu-proje-yok-${Date.now()}`, "404"],
  [`${BASE}/tr/bu-sayfa-yok-${Date.now()}`, "404"],
  [`${BASE}/de`, "404"],
  [`${BASE}/tr/faq`, "redirect to /tr/contact"],
  [`${BASE}/tr/projects?utm_source=test`, "200 with canonical /tr/projects"],
];
const variantResults = [];
for (const [url, expected] of variants) {
  const res = await get(url, { follow: false });
  let note = res.location ? `${res.status} → ${res.location.replace(BASE, "")}` : `${res.status}`;
  if (expected === "404" && res.status !== 404) {
    const final = await get(url);
    note += ` → final ${final.status}`;
    flag(final.status === 404 ? "WARN" : "FAIL", url.replace(BASE, ""), final.status === 404 ? `redirects (${res.status}) before answering 404` : `expected 404, got ${note} (soft 404)`);
  }
  if (expected.startsWith("redirect") && !(res.status === 301 || res.status === 308)) flag("WARN", url.replace(BASE, ""), `expected a permanent redirect, got ${note}`);
  if (expected.startsWith("200")) {
    const full = await get(url);
    const canon = full.body?.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
    note += ` canonical ${canon}`;
    if (canon !== `${CANONICAL_ORIGIN}/tr/projects`) flag("FAIL", url, `query URL canonical is ${canon}`);
  }
  variantResults.push({ url: url.replace(BASE, ""), expected, got: note });
}

// ---------- rendered DOM (--render): JS-run page compared with the HTML response ----------
const renderRows = [];
if (process.argv.includes("--render")) {
  const { chromium } = await import("@playwright/test");
  const browser = await chromium.launch();
  // Googlebot renders with a phone-width but very tall viewport, so lazy content near the top half loads without scrolling.
  const context = await browser.newContext({ viewport: { width: 412, height: 5000 }, userAgent: `${UA} Mobile`, serviceWorkers: "block" });
  await context.addInitScript(() => sessionStorage.setItem("u-curtain", "1"));
  await pool([...pages.values()].filter((p) => p.class === "INDEXABLE_REQUIRED"), 4, async (page) => {
    const tab = await context.newPage();
    const errors = [];
    tab.on("pageerror", (e) => errors.push(e.message));
    tab.on("console", (m) => m.type() === "error" && errors.push(m.text()));
    await tab.goto(page.url, { waitUntil: "networkidle", timeout: 60000 }).catch((e) => errors.push(String(e)));
    const dom = await tab.evaluate(() => ({
      title: document.title,
      canonical: document.querySelector('link[rel="canonical"]')?.href ?? "",
      robots: document.querySelector('meta[name="robots"]')?.content ?? "",
      h1: [...document.querySelectorAll("h1")].map((h) => h.textContent.replace(/\s+/g, " ").trim()),
      words: document.body.innerText.split(/\s+/).length,
      images: document.images.length,
      brokenImages: [...document.images].filter((i) => i.complete && i.currentSrc && i.naturalWidth === 0).map((i) => i.currentSrc),
      videosWithSrc: [...document.querySelectorAll("video")].filter((v) => v.currentSrc || v.src).length,
      videos: document.querySelectorAll("video").length,
    }));
    await tab.close();
    const where = page.url.replace(BASE, "");
    if (dom.title !== page.title) flag("FAIL", where, `rendered title "${dom.title}" differs from HTML "${page.title}"`);
    if (dom.canonical !== toLocal(page.canonical) && dom.canonical !== page.canonical) flag("FAIL", where, `rendered canonical ${dom.canonical} differs from HTML`);
    if (/noindex/.test(dom.robots)) flag("FAIL", where, "JS adds noindex");
    if (dom.h1.length !== 1) flag("WARN", where, `rendered page has ${dom.h1.length} <h1>`);
    for (const src of dom.brokenImages) flag("FAIL", where, `image fails to decode in the browser: ${src}`);
    for (const e of errors) flag("WARN", where, `console: ${e.slice(0, 160)}`);
    renderRows.push([page.url.replace(BASE, CANONICAL_ORIGIN), dom.title === page.title ? "same" : "DIFFERENT", dom.h1.join(" | "), page.words, dom.words, page.images.length, dom.images, dom.brokenImages.length, `${dom.videosWithSrc}/${dom.videos}`, errors.length]);
  });
  await browser.close();
}

// ---------- output ----------
const csv = (rows) => rows.map((r) => r.map((v) => `"${String(v ?? "").replaceAll('"', '""')}"`).join(",")).join("\n") + "\n";
await mkdir(OUT, { recursive: true });
const pageRows = [...pages.values()].sort((a, b) => a.url.localeCompare(b.url));
await writeFile(
  `${OUT}/URL-INVENTORY.csv`,
  csv([
    ["URL", "Class", "HTTP", "Final URL / redirect chain", "In sitemap", "Inlinks", "Canonical", "Robots meta", "X-Robots-Tag", "robots.txt allows Googlebot", "lang", "Title", "Title length", "Description length", "H1", "Words in HTML", "img count", "video count", "JSON-LD types", "hreflang"],
    ...pageRows.map((p) => [
      p.url.replace(BASE, CANONICAL_ORIGIN), p.class, p.status, p.chain?.length ? `${p.chain.join(" → ")} → ${p.finalUrl ?? p.location}` : "", p.inSitemap ? "yes" : "no", p.inlinks, p.canonical, p.robotsMeta, p.xRobots, p.robotsAllowed ? "yes" : "no", p.lang, p.title, p.title?.length, p.description?.length, p.h1?.join(" | "), p.words, p.images?.length, p.videos?.length, [...new Set(p.jsonLd ?? [])].join(" "), p.hreflang?.map((h) => h[0]).join(" "),
    ]),
  ])
);
const imageRows = [...imageUse.values()].sort((a, b) => a.url.localeCompare(b.url));
const imageClass = (e) => (e.url.includes("/media/projects/") || e.url.includes("/media/video/") ? "SEARCH_IMAGE" : e.how.has("og:image") && e.how.size === 1 ? "SUPPORTING_IMAGE" : e.decorative || /icon|logo|favicon|mascot/i.test(e.url) ? "DECORATIVE/PRIVATE" : "SUPPORTING_IMAGE");
await writeFile(
  `${OUT}/IMAGE-INVENTORY.csv`,
  csv([
    ["Image URL", "Category", "Used as", "Pages (HTML)", "Sitemap pages", "HTTP", "Content-Type", "Bytes", "X-Robots-Tag", "robots.txt allows Googlebot-Image", "Alt texts"],
    ...imageRows.map((e) => [e.url, imageClass(e), [...e.how].join(" "), [...e.pages].join(" "), [...e.sitemapPages].join(" "), e.status, e.type, e.bytes, e.xRobots, e.robotsAllowed ? "yes" : "no", [...e.alts].join(" | ")]),
  ])
);
await writeFile(
  `${OUT}/VIDEO-INVENTORY.csv`,
  csv([
    ["Video file", "HTTP", "Content-Type", "Byte ranges", "Bytes", "Host pages (HTML <video>)", "src in HTML", "Poster", "controls", "autoplay/loop/muted", "VideoObject on page", "Sitemap pages", "Sitemap thumbnail", "Sitemap date"],
    ...[...videoUse.values()].map((v) => [
      v.src || `(src set by JS on scroll/play) ${v.uses[0]?.label ?? ""}`, v.status, v.type, v.range ? "yes" : "no", v.bytes,
      v.uses.map((u) => u.page).join(" "), v.uses.map((u) => (u.src ? "yes" : "no")).join(" "), [...new Set(v.uses.map((u) => u.poster))].join(" "),
      v.uses.map((u) => (u.controls ? "yes" : "no")).join(" "), v.uses.map((u) => [u.autoplay && "autoplay", u.loop && "loop", u.muted && "muted"].filter(Boolean).join("+") || "-").join(" "),
      v.uses.map((u) => (u.videoObject ? "yes" : "no")).join(" "), (v.sitemap ?? []).map((s) => s.page).join(" "), [...new Set((v.sitemap ?? []).map((s) => s.thumbnail))].join(" "), [...new Set((v.sitemap ?? []).map((s) => s.date))].join(" "),
    ]),
  ])
);
if (renderRows.length)
  await writeFile(
    `${OUT}/RENDER-CHECK.csv`,
    csv([["URL", "Title (HTML vs DOM)", "Rendered H1", "Words in HTML", "Words rendered", "img in HTML", "img rendered", "Broken images", "Videos with src (rendered)", "Console errors"], ...renderRows.sort((a, b) => a[0].localeCompare(b[0]))])
  );
const count = (fn) => [...pages.values()].filter(fn).length;
const summary = {
  base: BASE,
  crawledAt: new Date().toISOString(),
  pages: { crawled: pages.size, indexableRequired: count((p) => p.class === "INDEXABLE_REQUIRED"), indexableOptional: count((p) => p.class === "INDEXABLE_OPTIONAL"), noindex: count((p) => p.class === "INTENTIONALLY_NOT_INDEXED"), redirects: count((p) => p.class === "REDIRECT"), gone: count((p) => p.class === "GONE"), other: count((p) => p.class === "UNKNOWN/BLOCKED") },
  sitemap: { urls: sitemap.size, images: [...sitemap.values()].reduce((n, s) => n + s.images.length, 0), videos: [...sitemap.values()].reduce((n, s) => n + s.videos.length, 0) },
  images: { unique: imageUse.size, searchImages: imageRows.filter((e) => imageClass(e) === "SEARCH_IMAGE").length, ok: imageRows.filter((e) => e.status === 200 && e.type.startsWith("image/")).length },
  videos: { unique: [...videoUse.values()].filter((v) => v.src).length, ok: [...videoUse.values()].filter((v) => [200, 206].includes(v.status)).length },
  variants: variantResults,
  fail: findings.filter((f) => f.level === "FAIL").length,
  warn: findings.filter((f) => f.level === "WARN").length,
  findings,
};
await writeFile(`${OUT}/audit.json`, JSON.stringify(summary, null, 2));
for (const f of findings) console.log(`${f.level.padEnd(4)} ${f.where}  ${f.message}`);
console.log(JSON.stringify({ ...summary, variants: undefined, findings: undefined }, null, 2));
if (summary.fail) process.exitCode = 1;
