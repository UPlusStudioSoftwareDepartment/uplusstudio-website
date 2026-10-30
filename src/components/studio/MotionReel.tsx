"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import InViewVideo from "@/components/studio/InViewVideo";
import Fullscreenable from "@/components/studio/Fullscreenable";
import { Eyebrow, LineReveal } from "@/components/studio/Reveal";

// Ordered as the work happens: design in 3D first, then renovation, then the finished construction.
const REELS = [
  { key: "living", slug: "konut-ic-mekan", src: "/media/video/living-room.mp4", poster: "/media/video/living-room.webp" },
  { key: "bedroom", slug: "konut-ic-mekan", src: "/media/video/bedroom.mp4", poster: "/media/video/bedroom.webp" },
  { key: "office", slug: "ofis-yenileme", src: "/media/video/office-before-after.mp4", poster: "/media/video/office-before-after.webp" },
  { key: "residence", slug: "konut-uygulama", src: "/media/video/residence-walkthrough.mp4", poster: "/media/video/residence-walkthrough.webp" },
] as const;

export default function MotionReel() {
  const t = useTranslations("studio.motion");
  const locale = useLocale();

  return (
    <section className="py-28 sm:py-40">
      <div className="mx-auto mb-14 grid max-w-[2560px] grid-cols-1 gap-8 px-4 sm:px-8 lg:grid-cols-12 lg:items-end lg:px-12">
        <Eyebrow className="lg:col-span-3">{t("label")}</Eyebrow>
        <h2 className="display text-[clamp(2.5rem,5.5vw,5.5rem)] text-ink lg:col-span-6">
          <LineReveal lines={[t("title")]} />
        </h2>
        <p className="max-w-xs text-[15px] leading-relaxed text-mute lg:col-span-3 lg:justify-self-end lg:text-right">
          {t("body")}
        </p>
      </div>

      <ul className="mx-auto grid max-w-[2560px] grid-cols-1 gap-x-6 gap-y-10 px-4 sm:grid-cols-2 sm:px-8 lg:grid-cols-4 lg:px-12">
        {REELS.map((reel, i) => (
          <li key={reel.key} className="group min-w-0">
            <Fullscreenable className="relative aspect-[4/5] w-full overflow-hidden bg-paper-2">
              <InViewVideo src={reel.src} poster={reel.poster} label={t(`items.${reel.key}`)} className="h-full w-full object-cover transition-transform duration-[1.4s] group-hover:scale-[1.03]" />
            </Fullscreenable>
            <Link href={`/${locale}/projects/${reel.slug}`} className="mt-4 flex min-h-11 items-baseline gap-4">
              <span className="font-mono text-[12px] text-mute">{String(i + 1).padStart(2, "0")}</span>
              <span className="text-[15px] text-ink transition-colors group-hover:text-clay">{t(`items.${reel.key}`)}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
