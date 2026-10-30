import type { Metadata } from "next";
import { getImageProps } from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { preload } from "react-dom";
import { setRequestLocale } from "next-intl/server";
import JsonLd from "@/components/seo/JsonLd";
import { locales, type Locale } from "@/lib/i18n-config";
import { getProject, projects, screenPoster } from "@/lib/projects";
import { breadcrumbLd, buildMetadata, resolveLocale, SEO_COPY } from "@/lib/seo";
import { projectVideoLd } from "@/lib/seo-projects";

type Params = { params: Promise<{ locale: string; slug: string }> };

const COPY: Record<Locale, { title: string; label: string; crumb: string; back: string; studio: string }> = {
  tr: { title: "Proje Videosu", label: "Proje videosu", crumb: "Video", back: "Projenin ayrıntıları", studio: "U+ Studio, İncek · Gölbaşı / Ankara." },
  en: { title: "Project Video", label: "Project video", crumb: "Video", back: "Project details", studio: "U+ Studio, İncek · Gölbaşı / Ankara." },
};

export function generateStaticParams() {
  return locales.flatMap((locale) => projects.filter((p) => p.video).map((p) => ({ locale, slug: p.slug })));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale: raw, slug } = await params;
  const locale = resolveLocale(raw);
  const project = getProject(slug);
  if (!project?.video) return {};
  const { video } = project;
  return buildMetadata({
    locale,
    path: `/projects/${slug}/video`,
    title: `${project.title[locale]} · ${COPY[locale].title}`,
    description: `${project.tagline[locale]} ${COPY[locale].studio}`,
    image: { url: video.poster, width: video.width, height: video.height, alt: project.title[locale] },
  });
}

export default async function Page({ params }: Params) {
  const { locale: raw, slug } = await params;
  const locale = resolveLocale(raw);
  setRequestLocale(locale);
  const project = getProject(slug);
  if (!project?.video) notFound();
  const { video } = project;
  const c = COPY[locale];
  const portrait = video.height > video.width;
  const { props: { src: poster } } = getImageProps({
    src: screenPoster(video),
    alt: "",
    width: video.width,
    height: video.height,
  });
  preload(poster, { as: "image", fetchPriority: "high" });

  return (
    <>
      <JsonLd
        data={[
          breadcrumbLd(locale, [
            [SEO_COPY[locale].projects.crumb, "/projects"],
            [project.title[locale], `/projects/${slug}`],
            [c.crumb, `/projects/${slug}/video`],
          ]),
          { "@context": "https://schema.org", ...projectVideoLd(locale, project, video) },
        ]}
      />
      <section className="min-h-[100svh] bg-night px-4 pb-24 pt-28 text-bone sm:px-8 sm:pt-36 lg:px-12">
        <div className="mx-auto max-w-6xl">
          <p className="eyebrow text-bone/60">{c.label}</p>
          <h1 className="display mt-4 text-[clamp(2.2rem,6vw,5rem)]">{project.title[locale]}</h1>
          <p className="mt-4 max-w-2xl text-[17px] leading-relaxed text-bone/75">{project.tagline[locale]}</p>
          <div
            className={`mx-auto mt-10 overflow-hidden bg-black ${portrait ? "aspect-[9/16] w-[min(100%,calc(min(78svh,900px)*9/16))]" : "w-full"}`}
            style={portrait ? undefined : { aspectRatio: `${video.width} / ${video.height}` }}
          >
            <video src={video.src} poster={poster} controls playsInline preload="none" className="h-full w-full object-contain" aria-label={project.title[locale]} />
          </div>
          <p className="mt-10 max-w-3xl text-[17px] leading-relaxed text-bone/85">{project.description[locale]}</p>
          <Link href={`/${locale}/projects/${slug}`} className="mt-8 inline-flex min-h-11 items-center gap-3 border border-bone/40 px-5 font-mono text-[12px] uppercase tracking-[0.12em] transition-colors hover:border-bone hover:bg-bone/10">
            {c.back} <span aria-hidden>→</span>
          </Link>
        </div>
      </section>
    </>
  );
}
