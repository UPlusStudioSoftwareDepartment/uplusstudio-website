import { pad, type Term } from "@/lib/glossary";

export default function GlossaryList({ sections, counts }: Readonly<{ sections: { letter: string; items: Term[] }[]; counts: Record<string, number> }>) {
  return (
    <div className="mt-4">
      {sections.map((section) => (
        <section key={section.letter} aria-labelledby={`letter-${section.letter}`} className="pt-16 sm:pt-24">
          <div className="grid grid-cols-1 items-end gap-x-8 border-b border-ink pb-4 lg:grid-cols-12">
            <h2 id={`letter-${section.letter}`} className="font-serif text-[clamp(5rem,12vw,10rem)] font-normal leading-[0.8] tracking-normal text-ink lg:col-span-3">
              {section.letter}
            </h2>
            <p className="mt-4 font-mono text-[12px] uppercase tracking-[0.14em] tabular-nums text-mute lg:col-span-9 lg:mt-0 lg:text-right">
              {pad(counts[section.letter] ?? 0, 3)}
            </p>
          </div>
          <ul>
            {section.items.map((item, i) => (
              <li
                key={item.key}
                id={item.key}
                className="group grid scroll-mt-28 grid-cols-1 gap-x-8 gap-y-3 border-b border-line py-7 [contain-intrinsic-size:auto_220px] [content-visibility:auto] sm:py-9 lg:grid-cols-12"
              >
                <h3 className="min-w-0 break-words font-sans text-[clamp(1.5rem,2.6vw,2.25rem)] font-light leading-[1.1] tracking-[-0.025em] text-ink transition-colors group-hover:text-clay lg:col-span-4">
                  <span className="mr-[0.04em] font-serif font-normal italic tracking-normal">{item.term.charAt(0)}</span>
                  {item.term.slice(1)}
                </h3>
                <div className="min-w-0 lg:col-span-6">
                  <p className="text-[17px] leading-relaxed text-ink">{item.simple_definition}</p>
                  <p className="mt-3 max-w-prose text-[15px] leading-relaxed text-mute">{item.definition}</p>
                </div>
                <p className="order-first font-mono text-[12px] uppercase tracking-[0.14em] text-mute lg:order-none lg:col-span-2 lg:pt-2 lg:text-right">
                  {item.category || `${section.letter}.${pad(i + 1)}`}
                </p>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
