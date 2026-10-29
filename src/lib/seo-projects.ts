import type { Locale } from "@/lib/i18n-config";
import { projects, screenPoster, type Project, type ProjectVideo } from "@/lib/projects";
import { absoluteUrl, localePath, ORG_ID, SEO_COPY, WEBSITE_ID } from "@/lib/seo";

const projectUrl = (locale: Locale, slug: string) => absoluteUrl(localePath(locale, `/projects/${slug}`));

export function projectsListLd(locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: SEO_COPY[locale].projects.crumb,
    numberOfItems: projects.length,
    itemListElement: projects.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: projectUrl(locale, p.slug),
      name: p.title[locale],
    })),
  };
}

export function projectVideoLd(locale: Locale, project: Project, video: ProjectVideo) {
  return {
    "@type": "VideoObject",
    name: project.title[locale],
    description: project.description[locale],
    thumbnailUrl: absoluteUrl(screenPoster(video)),
    contentUrl: absoluteUrl(video.src),
    uploadDate: video.uploadDate,
    duration: `PT${video.duration}S`,
    width: video.width,
    height: video.height,
    inLanguage: locale === "en" ? "en-US" : "tr-TR",
  };
}

export function projectLd(locale: Locale, project: Project) {
  const url = projectUrl(locale, project.slug);
  const images = [project.cover, ...project.gallery].slice(0, 12);
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "@id": `${url}#work`,
    url,
    name: project.title[locale],
    headline: project.title[locale],
    abstract: project.tagline[locale],
    description: project.description[locale],
    inLanguage: locale === "en" ? "en-US" : "tr-TR",
    ...(project.status ? { creativeWorkStatus: project.status[locale] } : {}),
    keywords: project.scope.map((s) => s[locale]).join(", "),
    creator: { "@id": ORG_ID },
    publisher: { "@id": ORG_ID },
    isPartOf: { "@id": WEBSITE_ID },
    image: images.map((img) => ({
      "@type": "ImageObject",
      contentUrl: absoluteUrl(img.src),
      width: img.width,
      height: img.height,
      caption: img.alt[locale],
    })),
  };
}
