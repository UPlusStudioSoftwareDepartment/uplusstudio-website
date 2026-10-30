"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { GuideAudience, GuideTopic } from "@/lib/guides";
import type { Locale } from "@/lib/i18n-config";

export type GuideCardData = Readonly<{
  slug: string;
  title: string;
  description: string;
  topic: GuideTopic;
  audiences: readonly GuideAudience[];
  minutes: number;
  image: string;
}>;

type Labels = Readonly<{
  minutes: string;
  read: string;
}>;

/**
 * Column span for the i-th of n cards so no row is left with empty cells:
 * two columns from md (an odd last card spans both), three from xl on a six-track grid
 * (a final pair shares the row, a single leftover turns the last four into a 2 × 2 block).
 */
function spanClass(i: number, n: number) {
  const md = n % 2 === 1 && i === n - 1 ? "md:col-span-2" : "md:col-span-1";
  const rem = n % 3;
  let xl = "xl:col-span-2";
  if (n === 1) xl = "xl:col-span-6";
  else if (rem === 2 && i >= n - 2) xl = "xl:col-span-3";
  else if (rem === 1 && i >= n - 4) xl = "xl:col-span-3";
  return `${md} ${xl}`;
}

/** All guides render initially; reader choices narrow the topic shelves. */
export default function GuideLibrary({
  locale,
  cards,
  topics,
  topicLabels,
  audiences,
  audienceLabels,
  labels,
}: Readonly<{
  locale: Locale;
  cards: readonly GuideCardData[];
  topics: readonly GuideTopic[];
  topicLabels: Record<GuideTopic, string>;
  audiences: readonly GuideAudience[];
  audienceLabels: Record<GuideAudience, string>;
  labels: Labels;
}>) {
  const [audience, setAudience] = useState<GuideAudience | "all">("all");
  const visibleCards = audience === "all" ? cards : cards.filter((card) => card.audiences.includes(audience));
  const tr = locale === "tr";
  return (
    <section id="guide-library" aria-label={topics.map((topic) => topicLabels[topic]).join(", ")} className="scroll-mt-24 border-b border-line pb-16 sm:pb-20">
      <fieldset className="pt-10">
        <legend className="font-serif text-2xl">{tr ? "Size uygun rehberleri bulun" : "Find guides for your situation"}</legend>
        <div className="mt-5 flex flex-wrap gap-3">
          {(["all", ...audiences] as const).map((key) => (
            <button key={key} type="button" aria-pressed={audience === key} onClick={() => setAudience(key)} aria-controls="guide-shelves"
              className={audience === key ? "min-h-11 border border-ink bg-ink px-4 py-2 text-[15px] text-paper" : "min-h-11 border border-line px-4 py-2 text-[15px] transition-colors hover:border-clay hover:text-clay"}>
              {key === "all" ? (tr ? "Tüm rehberler" : "All guides") : audienceLabels[key]}
            </button>
          ))}
        </div>
      </fieldset>
      <p role="status" className="mt-5 text-sm text-mute">{visibleCards.length} {tr ? "rehber" : "guides"}</p>
      <div id="guide-shelves">
      {topics.map((topic) => {
        const items = visibleCards.filter((card) => card.topic === topic);
        if (!items.length) return null;
        return (
          <div key={topic} className="mt-14 border-t border-line pt-10 first:border-t-0">
            <h2 className="font-serif text-[clamp(1.6rem,3.2vw,2.4rem)] leading-tight">{topicLabels[topic]}</h2>
            <ul className="mt-8 grid grid-cols-1 gap-x-8 gap-y-12 md:grid-cols-2 xl:grid-cols-6">
              {items.map((card, index) => (
                <li key={card.slug} className={`group min-w-0 @container ${spanClass(index, items.length)}`}>
                  {/* A card that spans a whole row lays out side by side instead of stretching its image. */}
                  <div className="flex h-full flex-col @[52rem]:grid @[52rem]:grid-cols-2 @[52rem]:items-center @[52rem]:gap-x-10">
                    <Link href={`/${locale}/guides/${card.slug}`} tabIndex={-1} aria-hidden aria-label={card.title} className="relative block aspect-[16/10] overflow-hidden rounded-[3px] bg-paper-2">
                      <Image
                        src={card.image}
                        alt=""
                        fill
                        sizes="(min-width: 1280px) 45vw, (min-width: 768px) 90vw, 100vw"
                        unoptimized={card.image.endsWith(".svg")}
                        className={`transition-transform duration-[1.2s] ease-out-studio group-hover:scale-[1.03] ${card.image.endsWith(".svg") ? "object-contain" : "object-cover"}`}
                      />
                    </Link>
                    <div className="flex flex-1 flex-col">
                      <p className="eyebrow mt-5 text-mute">{card.minutes} {labels.minutes}</p>
                      <h3 className="mt-3 text-[clamp(1.3rem,2.1vw,1.6rem)] font-light leading-snug">
                        <Link href={`/${locale}/guides/${card.slug}`} className="transition-colors hover:text-clay">{card.title}</Link>
                      </h3>
                      <p className="mt-3 flex-1 text-[16px] leading-relaxed text-mute">{card.description}</p>
                      <Link href={`/${locale}/guides/${card.slug}`} className="mt-5 inline-flex min-h-11 w-fit items-center gap-3 border-b border-ink/40 pb-1 text-[15px] transition-colors hover:border-clay hover:text-clay">
                        {labels.read}
                        <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
                      </Link>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
      </div>
    </section>
  );
}
