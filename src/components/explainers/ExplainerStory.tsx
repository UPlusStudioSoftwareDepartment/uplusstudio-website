import Link from "next/link";
import type { Locale } from "@/lib/i18n-config";
import { explainerLabels, explainers, type ExplainerId } from "@/lib/explainers";
import { ExplainerScene } from "./ExplainerScenes";
import PlayWhenVisible from "./PlayWhenVisible";

function LegendNumber({ n }: Readonly<{ n: number }>) {
  return (
    <span aria-hidden className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-clay font-mono text-[12px] font-bold text-paper">
      {n}
    </span>
  );
}

/** Full explanation: drawing, everyday comparison, numbered legend, worked example and Ankara-specific note. */
export function ExplainerBlock({ id, locale, index = 0, stacked = false }: Readonly<{ id: ExplainerId; locale: Locale; index?: number; stacked?: boolean }>) {
  const copy = explainers[id][locale];
  const labels = explainerLabels[locale];
  const flip = index % 2 === 1;
  return (
    <div id={id} className={`grid scroll-mt-28 items-start gap-8 border-t border-line pt-10 ${stacked ? "" : "lg:grid-cols-2 lg:gap-14"}`}>
      <PlayWhenVisible className={`overflow-hidden rounded-[3px] ${stacked ? "" : `lg:sticky lg:top-28 ${flip ? "lg:order-2" : ""}`}`}>
        <figure role="img" aria-label={`${copy.title} ${copy.short}`}>
          <ExplainerScene id={id} />
        </figure>
      </PlayWhenVisible>
      <div className="min-w-0">
        <p className="eyebrow text-clay">{copy.step}</p>
        <h2 className="mt-4 font-serif text-[clamp(1.75rem,4vw,2.5rem)] leading-tight">{copy.title}</h2>
        <p className="mt-5 text-[18px] leading-[1.75] text-ink/90">{copy.simple}</p>
        <ol className="mt-7 space-y-4">
          {copy.legend.map((item, i) => (
            <li key={item} className="flex gap-3 text-[16px] leading-relaxed text-ink/85">
              <LegendNumber n={i + 1} />
              <span>{item}</span>
            </li>
          ))}
        </ol>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <p className="border-l-2 border-clay bg-paper-2 px-4 py-4 text-[15px] leading-relaxed text-mute">
            <span className="eyebrow mb-2 block text-ink">{labels.example}</span>
            {copy.example}
          </p>
          <p className="border-l-2 border-[#6fa3a0] bg-paper-2 px-4 py-4 text-[15px] leading-relaxed text-mute">
            <span className="eyebrow mb-2 block text-ink">{labels.ankara}</span>
            {copy.ankara}
          </p>
        </div>
      </div>
    </div>
  );
}

export function ExplainerStory({ ids, locale, stacked = false }: Readonly<{ ids: readonly ExplainerId[]; locale: Locale; stacked?: boolean }>) {
  return (
    <div className="space-y-16 sm:space-y-20">
      {ids.map((id, i) => (
        <ExplainerBlock key={id} id={id} locale={locale} index={i} stacked={stacked} />
      ))}
      <p className="text-sm leading-relaxed text-mute">{explainerLabels[locale].note}</p>
    </div>
  );
}

/** Compact cards that lead to the full guide. */
export function ExplainerCards({ ids, locale, href, linkLabel }: Readonly<{ ids: readonly ExplainerId[]; locale: Locale; href: string; linkLabel: string }>) {
  return (
    <ul className="grid gap-x-6 gap-y-12 md:grid-cols-2 xl:grid-cols-3">
      {ids.map((id, i) => {
        const copy = explainers[id][locale];
        return (
          <li key={id} className={`flex min-w-0 flex-col ${ids.length % 2 === 1 && i === ids.length - 1 ? "md:col-span-2 xl:col-span-1" : ""}`}>
            <PlayWhenVisible className="overflow-hidden rounded-[3px]">
              <figure role="img" aria-label={`${copy.title} ${copy.short}`}>
                <ExplainerScene id={id} />
              </figure>
            </PlayWhenVisible>
            <p className="eyebrow mt-5 text-clay">{copy.step}</p>
            <h3 className="mt-3 text-[22px] leading-snug">{copy.title}</h3>
            <p className="mt-3 flex-1 text-[16px] leading-relaxed text-mute">{copy.short}</p>
            <Link href={`${href}#${id}`} className="group mt-5 inline-flex min-h-11 w-fit items-center gap-3 border-b border-ink/40 pb-1 text-[15px] transition-colors hover:border-clay hover:text-clay">
              {linkLabel}
              <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
