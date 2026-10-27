import type { Metadata } from "next";
import JsonLd from "@/components/seo/JsonLd";
import { breadcrumbLd, pageMetadata, resolveLocale, SEO_COPY, webPageLd } from "@/lib/seo";
import ProjectsContent from "@/components/ProjectsContent";
import { projectsListLd } from "@/lib/seo-projects";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return pageMetadata(resolveLocale((await params).locale), "projects");
}

export default async function Page({ params }: Props) {
  const locale = resolveLocale((await params).locale);
  return (
    <>
      <JsonLd data={[webPageLd(locale, "projects", "CollectionPage"), breadcrumbLd(locale, [[SEO_COPY[locale].projects.crumb, "/projects"]]), projectsListLd(locale)]} />
      <ProjectsContent />
    </>
  );
}
