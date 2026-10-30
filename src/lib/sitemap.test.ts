import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { GET } from "@/app/sitemap.xml/route";
import { projects, screenPoster } from "./projects";
import { SITE_URL } from "./seo";
import { projectLd, projectVideoLd } from "./seo-projects";
import { guides } from "./guides";
import { SERVICE_LANDINGS } from "./serviceLandings";
import { PAGE_PATH } from "./seo";

const publicFile = (url: string) => join(process.cwd(), "public", new URL(url, SITE_URL).pathname);

// Movie header box: version byte, then timescale and duration (32-bit in v0, 64-bit in v1).
function mp4Seconds(file: string) {
  const b = readFileSync(file);
  const i = b.indexOf("mvhd");
  const v1 = b[i + 4] === 1;
  const timescale = b.readUInt32BE(i + (v1 ? 24 : 16));
  const duration = v1 ? Number(b.readBigUInt64BE(i + 28)) : b.readUInt32BE(i + 20);
  return duration / timescale;
}

describe("sitemap", async () => {
  const xml = await (await GET()).text();
  const entries = [...xml.matchAll(/<url>([\s\S]*?)<\/url>/g)].map(([, body]) => ({
    loc: body.match(/<loc>([^<]+)<\/loc>/)?.[1] ?? "",
    images: [...body.matchAll(/<image:loc>([^<]+)<\/image:loc>/g)].map(([, src]) => src),
    videos: [...body.matchAll(/<video:video>([\s\S]*?)<\/video:video>/g)].map(([, v]) => v),
  }));

  it("lists unique absolute URLs on the canonical host and no hints Google ignores", () => {
    const locs = entries.map((e) => e.loc);
    expect(new Set(locs).size).toBe(locs.length);
    for (const loc of locs) expect(loc).toMatch(new RegExp(`^${SITE_URL}/(tr|en)(/|$)`));
    expect(xml).not.toMatch(/<priority>|<changefreq>|<lastmod>/);
  });

  it("only points at image files that exist", () => {
    for (const src of entries.flatMap((e) => e.images)) expect(existsSync(publicFile(src)), src).toBe(true);
  });

  it("includes the guide library and every guide in both languages", () => {
    for (const locale of ["tr", "en"]) {
      for (const path of ["/guides", ...guides.map(({ slug }) => `/guides/${slug}`)]) {
        expect(entries.some(({ loc }) => loc === `${SITE_URL}/${locale}${path}`)).toBe(true);
      }
    }
  });

  it("covers every public content route in both languages and excludes private helpers", () => {
    const paths = [
      ...Object.values(PAGE_PATH),
      ...SERVICE_LANDINGS.map(({ slug }) => `/services/${slug}`),
      ...projects.map(({ slug }) => `/projects/${slug}`),
      ...projects.filter(({ video }) => video).map(({ slug }) => `/projects/${slug}/video`),
      "/guides",
      ...guides.map(({ slug }) => `/guides/${slug}`),
    ];
    const expected = paths.flatMap((path) => ["tr", "en"].map((locale) => `${SITE_URL}/${locale}${path}`));
    expect(entries.map(({ loc }) => loc).sort()).toEqual(expected.sort());
    expect(xml).not.toMatch(/\/(kartvizit|randevu-kart|randevu-yanit|api)\b/);
    for (const path of paths) {
      for (const locale of ["tr", "en", "x-default"]) {
        expect(xml).toContain(`hreflang="${locale}" href="${SITE_URL}/${locale === "x-default" ? "tr" : locale}${path}"`);
      }
    }
  });

  it("lists every project photo on its project page", () => {
    for (const p of projects) {
      const listed = entries.find((e) => e.loc === `${SITE_URL}/tr/projects/${p.slug}`)?.images ?? [];
      const photos = [p.cover, ...p.gallery, ...(p.beforeAfter ? [p.beforeAfter.before, p.beforeAfter.after] : [])];
      for (const img of photos) expect(listed, `${p.slug} ${img.src}`).toContain(SITE_URL + img.src);
    }
  });

  it("puts each video only on its watch page and the home film, with the poster the page shows", () => {
    for (const e of entries.filter((e) => e.videos.length)) expect(e.loc).toMatch(/\/(tr|en)(\/projects\/[a-z0-9-]+\/video)?$/);
    for (const p of projects.filter((p) => p.video)) {
      const watch = entries.find((e) => e.loc === `${SITE_URL}/tr/projects/${p.slug}/video`);
      expect(watch?.videos, p.slug).toHaveLength(1);
      const video = watch!.videos[0];
      expect(video).toContain(`<video:thumbnail_loc>${SITE_URL}${screenPoster(p.video!)}</video:thumbnail_loc>`);
      expect(video).toContain(`<video:content_loc>${SITE_URL}${p.video!.src}</video:content_loc>`);
      expect(video).toContain(`<video:duration>${p.video!.duration}</video:duration>`);
      expect(entries.find((e) => e.loc === `${SITE_URL}/tr/projects/${p.slug}`)?.videos).toEqual([]);
    }
  });
});

describe("project videos", () => {
  for (const p of projects.filter((p) => p.video)) {
    const video = p.video!;
    it(`${p.slug}: files exist and the stated duration matches the file`, () => {
      for (const file of [video.src, video.poster, screenPoster(video)]) expect(existsSync(publicFile(file)), file).toBe(true);
      expect(Math.abs(mp4Seconds(publicFile(video.src)) - video.duration)).toBeLessThan(1);
      expect(video.duration).toBeGreaterThanOrEqual(1);
      expect(Number.isInteger(video.duration)).toBe(true);
    });

    it(`${p.slug}: VideoObject has Google's required fields and the same thumbnail as the sitemap`, () => {
      const ld = projectVideoLd("tr", p, video);
      expect(ld.name).toBeTruthy();
      expect(ld.uploadDate).toMatch(/^\d{4}-\d{2}-\d{2}T/);
      expect(ld.thumbnailUrl).toBe(SITE_URL + screenPoster(video));
      expect(ld.duration).toBe(`PT${video.duration}S`);
      expect(projectLd("tr", p)).not.toHaveProperty("video");
    });
  }
});
