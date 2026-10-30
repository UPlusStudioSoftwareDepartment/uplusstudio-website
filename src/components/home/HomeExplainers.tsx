import Link from "next/link";
import { ExplainerCards } from "@/components/explainers/ExplainerStory";
import type { Locale } from "@/lib/i18n-config";

const GUIDE = "/guides/ankara-ev-yaptirma-adim-adim";

const COPY = {
  tr: {
    label: "Mimarlık, en sade haliyle",
    title: "Ev yaptırmadan önce bilmeniz gereken üç şey.",
    intro: "Arsanın ne kadar bina taşıdığı, toprağın neden incelendiği ve Ankara kışının tasarımı nasıl etkilediği. Her biri tek bir hareketli çizim ve günlük bir benzetmeyle.",
    link: "Resmin anlattığını okuyun",
    all: "Altı adımın tamamını görün",
  },
  en: {
    label: "Architecture, made simple",
    title: "Three things to know before you build.",
    intro: "How much building a plot can carry, why the soil is tested and how Ankara's winter shapes the design. Each explained with one animated drawing and an everyday comparison.",
    link: "Read what the drawing shows",
    all: "See all six steps",
  },
} as const;

export default function HomeExplainers({ locale }: Readonly<{ locale: Locale }>) {
  const copy = COPY[locale];
  const href = `/${locale}${GUIDE}`;
  return (
    <section aria-labelledby="home-explainers" className="pt-16">
      <p className="eyebrow text-clay">{copy.label}</p>
      <h2 id="home-explainers" className="mt-5 max-w-3xl font-serif text-[clamp(2rem,5vw,4rem)] leading-tight">
        {copy.title}
      </h2>
      <p className="mt-6 max-w-2xl text-[17px] leading-relaxed text-mute">{copy.intro}</p>
      <div className="mt-10">
        <ExplainerCards ids={["imar", "zemin", "iklim"]} locale={locale} href={href} linkLabel={copy.link} />
      </div>
      <Link href={href} className="mt-10 inline-flex min-h-12 items-center border border-ink px-6 py-3 text-[16px] transition-colors hover:bg-night hover:text-bone">
        {copy.all} →
      </Link>
    </section>
  );
}
