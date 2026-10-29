import Link from "next/link";
import Image from "next/image";
import { homeMarketing } from "@/lib/marketingContent";
import { getProject } from "@/lib/projects";
import type { Locale } from "@/lib/i18n-config";

export default function HomeProjectPaths({ locale }: Readonly<{ locale: Locale }>) {
  const copy = homeMarketing[locale];
  return (
    <section aria-labelledby="home-project-paths" className="border-t border-line py-20 sm:py-28">
      <p className="eyebrow text-clay">{copy.label}</p>
      <h2 id="home-project-paths" className="mt-5 max-w-4xl font-serif text-[clamp(2.25rem,6vw,4.5rem)] leading-tight">{copy.title}</h2>
      <p className="mt-6 max-w-2xl text-[17px] leading-relaxed text-mute">{copy.intro}</p>
      <div className="mt-12 grid gap-x-12 gap-y-12 lg:grid-cols-2">
        {copy.paths.map((path, index) => {
          const project = getProject(path.project);
          return (
          <article key={path.service} className="flex flex-col border-t border-line pt-6">
            {project && (
              <figure className="mb-7">
                <Link href={`/${locale}/projects/${project.slug}`} aria-label={project.title[locale]} className="group relative block aspect-[16/9] overflow-hidden bg-paper-2">
                  <Image src={project.cover.src} alt={project.cover.alt[locale]} fill sizes="(min-width:1024px) 45vw, 100vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:transform-none" />
                </Link>
                <figcaption className="mt-3 text-[13px] text-mute">{project.title[locale]} · {project.cover.alt[locale]}</figcaption>
              </figure>
            )}
            <span className="font-mono text-[12px] text-clay">0{index + 1}</span>
            <h3 className="mt-4 max-w-xl text-[clamp(1.5rem,3vw,2rem)] font-light leading-tight">{path.title}</h3>
            <p className="mt-5 max-w-xl text-[17px] leading-relaxed">{path.situation}</p>
            <p className="mt-4 max-w-xl flex-1 text-[16px] leading-relaxed text-mute">{path.approach}</p>
            <div className="mt-6 flex flex-col items-start gap-2">
              <Link href={`/${locale}/services/${path.service}`} className="inline-flex min-h-11 items-center gap-3 underline decoration-clay underline-offset-4 hover:text-clay">{copy.serviceLink} <span aria-hidden>→</span></Link>
              <Link href={`/${locale}/projects/${path.project}`} className="inline-flex min-h-11 items-center text-[15px] text-mute underline underline-offset-4 hover:text-ink">{path.projectLabel}</Link>
            </div>
          </article>
          );
        })}
      </div>
      <div className="mt-20 border-t border-line pt-10">
        <h2 className="max-w-3xl font-serif text-[clamp(2rem,4vw,3.25rem)] leading-tight">{copy.approachTitle}</h2>
        <div className="mt-10 grid gap-8 lg:grid-cols-3">
          {copy.principles.map(([title, body]) => <div key={title}><h3 className="text-xl">{title}</h3><p className="mt-4 text-[16px] leading-relaxed text-mute">{body}</p></div>)}
        </div>
      </div>
    </section>
  );
}
