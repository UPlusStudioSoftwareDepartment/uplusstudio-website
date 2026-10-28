import { NextResponse } from "next/server";
import { locales, type Locale } from "@/lib/i18n-config";
import { getProject, projects, type Project } from "@/lib/projects";
import { SERVICE_LANDINGS } from "@/lib/serviceLandings";
import { localePath, PAGE_PATH, SITE_URL } from "@/lib/seo";

const PATHS = [
  PAGE_PATH.home,
  PAGE_PATH.about,
  PAGE_PATH.services,
  ...SERVICE_LANDINGS.map((s) => `/services/${s.slug}`),
  PAGE_PATH.projects,
  ...projects.map((p) => `/projects/${p.slug}`),
  ...projects.filter((p) => p.video).map((p) => `/projects/${p.slug}/video`),
  PAGE_PATH.contact,
  PAGE_PATH.glossary,
  PAGE_PATH.privacy,
];

const IMAGES: Record<string, string[]> = Object.fromEntries([
  ...projects.map((p) => [`/projects/${p.slug}`, [...new Set([p.cover.src, ...p.gallery.map((g) => g.src)])]]),
  ...SERVICE_LANDINGS.map((s) => [`/services/${s.slug}`, [s.image]]),
]);

const homeVideo = getProject("villa-donusumu");

const VIDEOS: Record<string, Project> = Object.fromEntries([
  ...projects.filter((p) => p.video).flatMap((p) => [[`/projects/${p.slug}`, p], [`/projects/${p.slug}/video`, p]]),
  ...(homeVideo ? [[PAGE_PATH.home, homeVideo]] : []),
]);

const PRIORITY: Record<string, string> = { "": "1.0", "/services": "0.9", "/projects": "0.9", "/contact": "0.9", "/about": "0.8", "/kvkk": "0.3" };

const xmlEscape = (s: string) => s.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");

function videoXml(project: Project | undefined, locale: Locale) {
  const video = project?.video;
  if (!project || !video) return [];
  return [
    "    <video:video>",
    `      <video:thumbnail_loc>${xmlEscape(SITE_URL + video.poster)}</video:thumbnail_loc>`,
    `      <video:title>${xmlEscape(project.title[locale])}</video:title>`,
    `      <video:description>${xmlEscape(project.description[locale])}</video:description>`,
    `      <video:content_loc>${xmlEscape(SITE_URL + video.src)}</video:content_loc>`,
    `      <video:publication_date>${video.uploadDate}</video:publication_date>`,
    "    </video:video>",
  ];
}

export async function GET() {
  const urls = PATHS.flatMap((path) =>
    locales.map((locale) =>
      [
        "  <url>",
        `    <loc>${xmlEscape(SITE_URL + localePath(locale, path))}</loc>`,
        ...locales.map((l) => `    <xhtml:link rel="alternate" hreflang="${l}" href="${xmlEscape(SITE_URL + localePath(l, path))}"/>`),
        `    <xhtml:link rel="alternate" hreflang="x-default" href="${xmlEscape(SITE_URL + localePath("tr", path))}"/>`,
        ...(IMAGES[path] ?? []).map((src) => `    <image:image><image:loc>${xmlEscape(SITE_URL + src)}</image:loc></image:image>`),
        ...videoXml(VIDEOS[path], locale),
        `    <priority>${PRIORITY[path] ?? (path.startsWith("/projects/") ? "0.7" : "0.6")}</priority>`,
        "  </url>",
      ].join("\n")
    )
  );

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
${urls.join("\n")}
</urlset>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
