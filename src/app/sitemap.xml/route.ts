import { NextResponse } from "next/server";
import { locales, type Locale } from "@/lib/i18n-config";
import { getProject, projects, screenPoster, type Project } from "@/lib/projects";
import { SERVICE_LANDINGS } from "@/lib/serviceLandings";
import { localePath, PAGE_PATH, SITE_URL } from "@/lib/seo";
import { guides } from "@/lib/guides";
import { projectDiagram, projectInsights } from "@/lib/projectInsights";

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
  "/guides",
  ...guides.map(({ slug }) => `/guides/${slug}`),
];

const present = (src: string | undefined): src is string => Boolean(src);

// Photos plus the explanatory drawings published on each page (project, service and guide diagrams).
const IMAGES: Record<string, string[]> = Object.fromEntries([
  ...guides.map((guide) => [`/guides/${guide.slug}`, [getProject(guide.project)?.cover.src, guide.diagram?.src].filter(present)]),
  ...projects.map((p) => [
    `/projects/${p.slug}`,
    [...new Set([p.cover, ...p.gallery, ...(p.beforeAfter ? [p.beforeAfter.before, p.beforeAfter.after] : [])].map((i) => i.src)), ...(projectInsights[p.slug] ? [projectDiagram(p.slug)] : [])],
  ]),
  ...SERVICE_LANDINGS.map((s) => [`/services/${s.slug}`, [s.image, s.diagram].filter(present)]),
]);

// The home film fills the first screen; Google has indexed its English version as a video.
// Other project previews remain supporting media, so only their dedicated watch pages are listed.
const homeVideo = getProject("villa-donusumu");

const VIDEOS: Record<string, Project> = Object.fromEntries([
  ...projects.filter((p) => p.video).map((p) => [`/projects/${p.slug}/video`, p]),
  ...(homeVideo ? [[PAGE_PATH.home, homeVideo]] : []),
]);

const xmlEscape = (s: string) => s.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");

function videoXml(project: Project | undefined, locale: Locale) {
  const video = project?.video;
  if (!project || !video) return [];
  return [
    "    <video:video>",
    `      <video:thumbnail_loc>${xmlEscape(SITE_URL + screenPoster(video))}</video:thumbnail_loc>`,
    `      <video:title>${xmlEscape(project.title[locale])}</video:title>`,
    `      <video:description>${xmlEscape(project.description[locale])}</video:description>`,
    `      <video:content_loc>${xmlEscape(SITE_URL + video.src)}</video:content_loc>`,
    `      <video:duration>${video.duration}</video:duration>`,
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
