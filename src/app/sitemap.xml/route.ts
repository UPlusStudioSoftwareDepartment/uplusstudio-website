import { NextResponse } from "next/server";
import { locales } from "@/lib/i18n-config";
import { projects } from "@/lib/projects";
import { localePath, PAGE_PATH, SITE_URL } from "@/lib/seo";

const PATHS = [
  PAGE_PATH.home,
  PAGE_PATH.about,
  PAGE_PATH.services,
  PAGE_PATH.projects,
  ...projects.map((p) => `/projects/${p.slug}`),
  PAGE_PATH.contact,
  PAGE_PATH.faq,
  PAGE_PATH.glossary,
];

const PRIORITY: Record<string, string> = { "": "1.0", "/services": "0.9", "/projects": "0.9", "/contact": "0.9", "/about": "0.8" };

const xmlEscape = (s: string) => s.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");

export async function GET() {
  const urls = PATHS.flatMap((path) =>
    locales.map((locale) => {
      const alternates = [
        ...locales.map((l) => `    <xhtml:link rel="alternate" hreflang="${l}" href="${xmlEscape(SITE_URL + localePath(l, path))}"/>`),
        `    <xhtml:link rel="alternate" hreflang="x-default" href="${xmlEscape(SITE_URL + localePath("tr", path))}"/>`,
      ].join("\n");
      return `  <url>
    <loc>${xmlEscape(SITE_URL + localePath(locale, path))}</loc>
${alternates}
    <priority>${PRIORITY[path] ?? (path.startsWith("/projects/") ? "0.7" : "0.6")}</priority>
  </url>`;
    })
  );

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.join("\n")}
</urlset>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
