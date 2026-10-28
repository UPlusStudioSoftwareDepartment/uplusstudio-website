import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProjectDetail from "@/components/ProjectDetail";
import JsonLd from "@/components/seo/JsonLd";
import { getProject, projects, type ProjectCategory } from "@/lib/projects";
import { locales, type Locale } from "@/lib/i18n-config";
import { breadcrumbLd, buildMetadata, resolveLocale, SEO_COPY } from "@/lib/seo";
import { projectLd } from "@/lib/seo-projects";
import { setRequestLocale } from "next-intl/server";

interface Params {
  params: Promise<{ locale: string; slug: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.flatMap((locale) => projects.map((p) => ({ locale, slug: p.slug })));
}

const CATEGORY: Record<Locale, Record<ProjectCategory, string>> = {
  tr: { architecture: "Mimari Proje", interior: "İç Mimarlık", renovation: "Yenileme & Dönüşüm", build: "Uygulama" },
  en: { architecture: "Architecture", interior: "Interior Architecture", renovation: "Renovation", build: "Construction" },
};

const STUDIO_LINE: Record<Locale, string> = {
  tr: "U+ Studio mimarlık & iç mimarlık ofisi, İncek · Gölbaşı / Ankara.",
  en: "U+ Studio architecture & interiors, İncek · Gölbaşı / Ankara.",
};

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale, slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  const l = resolveLocale(locale);

  return buildMetadata({
    locale: l,
    path: `/projects/${slug}`,
    title: `${project.title[l]} · ${CATEGORY[l][project.category]}`,
    description: `${project.tagline[l]} ${STUDIO_LINE[l]}`,
    type: "article",
    image: { url: project.cover.src, width: project.cover.width, height: project.cover.height, alt: project.cover.alt[l] },
  });
}

export default async function ProjectPage({ params }: Params) {
  const { locale, slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();
  const l = resolveLocale(locale);
  setRequestLocale(l);
  return (
    <>
      <JsonLd
        data={[
          projectLd(l, project),
          breadcrumbLd(l, [
            [SEO_COPY[l].projects.crumb, "/projects"],
            [project.title[l], `/projects/${slug}`],
          ]),
        ]}
      />
      <ProjectDetail slug={slug} />
    </>
  );
}
