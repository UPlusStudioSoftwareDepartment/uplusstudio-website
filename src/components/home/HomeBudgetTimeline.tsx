import Link from "next/link";
import DiagramFigure from "@/components/studio/DiagramFigure";
import type { Locale } from "@/lib/i18n-config";

const COPY = {
  tr: {
    label: "Bütçe ve takvim",
    title: "Bütçe ve takvim, tasarımla birlikte netleşir.",
    intro: "İlk görüşmede en sık sorulan iki konu bütçe ve süre. İkisi de tek bir rakamla değil, kalemler ve kararlarla netleşir. Aşağıdaki iki şema, hangi başlıkları ayrı ayrı konuşacağımızı gösterir.",
    cards: [
      {
        title: "Proje bütçesi",
        src: "/media/diagrams/budget-structure.svg",
        alt: "Proje bütçesinin tasarım, uygulama, mobilya ve izin olarak dört kaleme ayrıldığını gösteren şema",
        body: "Tasarım hizmeti, uygulama, mobilya–ekipman ve izinler ayrı kalemlerdir. Teklif karşılaştırırken hangisinin kapsandığını sorun.",
        href: "/guides/mimarlik-ucreti-ve-butce",
        cta: "Bütçe rehberini okuyun",
        items: [
          ["Tasarım & çizim", "Konsept, 3D ve teknik çizim"],
          ["Uygulama", "Söküm, imalat ve montaj"],
          ["Mobilya & ekipman", "Özel üretim ve satın alma"],
          ["İzin & danışmanlık", "Belediye, denetim, statik"],
        ],
      },
      {
        title: "Ruhsat ve uygulama akışı",
        src: "/media/diagrams/permit-timeline.svg",
        alt: "Arsa incelemesinden iskâna kadar yapı ruhsatı aşamalarını gösteren zaman çizelgesi",
        body: "Arsa incelemesinden iskâna kadar adımlar birbirine bağlıdır. Sıra ve süreler belediyeye ve parsele göre değişir.",
        href: "/guides/ankara-yapi-ruhsati-sureci",
        cta: "Ruhsat yol haritasını okuyun",
        items: [
          ["Arsa & imar", "Belge ve ölçüm"],
          ["Konsept & avan", "İhtiyaç programı"],
          ["Ruhsat", "Belediye onayı"],
          ["Uygulama", "Detay ve metraj"],
          ["Şantiye & iskân", "Denetim"],
        ],
      },
    ],
    note: "Kesin bedel ve tarih, kapsam ve mevcut durum değerlendirildikten sonra konuşulur.",
    cta: "Projenizin kapsamını konuşalım",
  },
  en: {
    label: "Budget and timeline",
    title: "Budget and timeline take shape with the design.",
    intro: "Budget and duration are the two questions we hear first. Neither is settled by a single figure, but by headings and decisions. These two diagrams show what we discuss separately.",
    cards: [
      {
        title: "Project budget",
        src: "/media/diagrams/budget-structure.svg",
        alt: "Diagram showing a project budget split into design, construction, furniture and permits",
        body: "Design services, construction, furniture and equipment, and permits are separate headings. When comparing proposals, ask which are covered.",
        href: "/guides/mimarlik-ucreti-ve-butce",
        cta: "Read the budget guide",
        items: [
          ["Design & drawings", "Concept, 3D and technical drawings"],
          ["Construction", "Stripping out, building work, installation"],
          ["Furniture & equipment", "Bespoke and purchased items"],
          ["Permits & consultancy", "Municipal, inspection, structural"],
        ],
      },
      {
        title: "Permits and construction sequence",
        src: "/media/diagrams/permit-timeline.svg",
        alt: "Timeline of building permit stages from plot review to occupancy",
        body: "From plot review to occupancy the steps depend on one another. Order and duration vary by municipality and plot.",
        href: "/guides/ankara-yapi-ruhsati-sureci",
        cta: "Read the permit roadmap",
        items: [
          ["Plot & zoning", "Documents and survey"],
          ["Concept & schematic", "The brief"],
          ["Permit", "Municipal approval"],
          ["Construction", "Details and quantities"],
          ["Site & occupancy", "Inspection"],
        ],
      },
    ],
    note: "A firm fee and date are discussed once the scope and existing conditions have been assessed.",
    cta: "Let's discuss your scope",
  },
} as const;

export default function HomeBudgetTimeline({ locale }: Readonly<{ locale: Locale }>) {
  const copy = COPY[locale];
  return (
    <section aria-labelledby="home-budget" className="pt-16">
      <p className="eyebrow text-clay">{copy.label}</p>
      <h2 id="home-budget" className="mt-5 max-w-3xl font-serif text-[clamp(2rem,5vw,4rem)] leading-tight">
        {copy.title}
      </h2>
      <p className="mt-6 max-w-2xl text-[17px] leading-relaxed text-mute">{copy.intro}</p>
      <div className="mt-10 grid gap-10 xl:grid-cols-2">
        {copy.cards.map((card) => (
          <article key={card.href} className="flex min-w-0 flex-col border-t border-line pt-6">
            <DiagramFigure
              src={card.src}
              alt={card.alt}
              items={card.items}
              locale={locale}
            />
            <h3 className="mt-5 text-xl">{card.title}</h3>
            <p className="mt-3 flex-1 text-[16px] leading-relaxed text-mute">{card.body}</p>
            <Link
              href={`/${locale}${card.href}`}
              className="group mt-5 inline-flex min-h-11 w-fit items-center gap-3 border-b border-ink/40 pb-1 text-[15px] transition-colors hover:border-clay hover:text-clay"
            >
              {card.cta}
              <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
            </Link>
          </article>
        ))}
      </div>
      <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
        <p className="max-w-xl border-l border-clay pl-4 text-sm leading-relaxed text-mute">{copy.note}</p>
        <Link href={`/${locale}/contact`} className="inline-flex min-h-11 items-center underline underline-offset-4 hover:text-clay">
          {copy.cta} →
        </Link>
      </div>
    </section>
  );
}
