"use client";

import { useRef } from "react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import InViewVideo from "@/components/studio/InViewVideo";
import Fullscreenable from "@/components/studio/Fullscreenable";
import { Eyebrow, LineReveal } from "@/components/studio/Reveal";

const REELS = [
  { key: "residence", slug: "konut-uygulama", src: "/media/video/residence-walkthrough.mp4", poster: "/media/video/residence-walkthrough.jpg", aspect: "aspect-[9/16]" },
  { key: "living", slug: "konut-ic-mekan", src: "/media/video/living-room.mp4", poster: "/media/video/living-room.jpg", aspect: "aspect-[3/2]" },
  { key: "office", slug: "ofis-yenileme", src: "/media/video/office-before-after.mp4", poster: "/media/video/office-before-after.jpg", aspect: "aspect-[9/16]" },
  { key: "bedroom", slug: "konut-ic-mekan", src: "/media/video/bedroom.mp4", poster: "/media/video/bedroom.jpg", aspect: "aspect-[4/3]" },
] as const;

export default function MotionReel() {
  const t = useTranslations("studio.motion");
  const locale = useLocale();
  const trackRef = useRef<HTMLDivElement>(null);

  const scrollBy = (dir: 1 | -1) => {
    const track = trackRef.current;
    if (track) track.scrollBy({ left: dir * track.clientWidth * 0.6, behavior: "smooth" });
  };

  return (
    <section className="py-28 sm:py-40">
      <div className="mx-auto mb-14 grid max-w-[2560px] grid-cols-1 gap-8 px-4 sm:px-8 lg:grid-cols-12 lg:items-end lg:px-12">
        <Eyebrow className="lg:col-span-3">{t("label")}</Eyebrow>
        <h2 className="display text-[clamp(2.5rem,5.5vw,5.5rem)] text-ink lg:col-span-6">
          <LineReveal lines={[t("title")]} />
        </h2>
        <div className="flex items-end justify-between gap-6 lg:col-span-3 lg:flex-col lg:items-end">
          <p className="max-w-xs text-[15px] leading-relaxed text-mute lg:text-right">{t("body")}</p>
          <div className="hidden gap-2 sm:flex">
            {([-1, 1] as const).map((dir) => (
              <button
                key={dir}
                type="button"
                onClick={() => scrollBy(dir)}
                aria-label={dir === -1 ? "←" : "→"}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-line text-ink transition-colors hover:border-ink hover:bg-night hover:text-bone"
              >
                {dir === -1 ? "←" : "→"}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div
        ref={trackRef}
        className="no-scrollbar flex flex-col gap-12 px-4 sm:snap-x sm:snap-mandatory sm:flex-row sm:gap-6 sm:overflow-x-auto sm:scroll-px-8 sm:px-8 lg:scroll-px-12 lg:px-12"
      >
        {REELS.map((reel, i) => (
          <Link
            key={reel.key}
            href={`/${locale}/projects/${reel.slug}`}
            className="group block sm:shrink-0 sm:snap-start"
          >
            <Fullscreenable className={`relative w-full overflow-hidden bg-paper-2 sm:h-[62vh] sm:max-h-[640px] sm:min-h-[380px] sm:w-auto ${reel.aspect}`}>
              <InViewVideo src={reel.src} poster={reel.poster} label={t(`items.${reel.key}`)} className="h-full w-full object-cover transition-transform duration-[1.4s] group-hover:scale-[1.03]" />
            </Fullscreenable>
            <div className="mt-4 flex items-baseline gap-4">
              <span className="font-mono text-[12px] text-mute">{String(i + 1).padStart(2, "0")}</span>
              <span className="text-[15px] text-ink transition-colors group-hover:text-clay">{t(`items.${reel.key}`)}</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
