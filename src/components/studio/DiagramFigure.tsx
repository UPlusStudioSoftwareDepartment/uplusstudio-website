import Image from "next/image";
import type { Locale } from "@/lib/i18n-config";

export type DiagramItem = readonly [label: string, detail: string];

/**
 * Drawings with text labels shrink below legibility on narrow screens, so there the same
 * information is shown as a stacked list. Numbered drawings carry only number badges; they stay
 * visible at every size with the numbered legend beneath.
 */
export default function DiagramFigure({
  src,
  alt,
  caption,
  items,
  locale,
  className,
  numbered = false,
}: Readonly<{
  src: string;
  alt: string;
  caption?: string;
  items?: readonly DiagramItem[];
  locale: Locale;
  className?: string;
  numbered?: boolean;
}>) {
  const hasItems = Boolean(items && items.length > 0);
  return (
    <figure className={className}>
      <div className={hasItems && !numbered ? "hidden sm:block" : undefined}>
        <Image
          src={src}
          alt={alt}
          width={640}
          height={numbered ? 400 : 360}
          sizes="(min-width: 768px) 720px, 100vw"
          unoptimized={src.endsWith(".svg")}
          className="h-auto w-full rounded-[3px] bg-paper-2"
        />
      </div>
      {hasItems && (
        <ol className={numbered ? "mt-6 grid gap-x-8 gap-y-4 sm:grid-cols-2" : "border-t border-line sm:hidden"}>
          {items!.map(([label, detail], index) => (
            <li key={label} className={numbered ? "flex gap-3" : "flex gap-4 border-b border-line py-3"}>
              {numbered ? (
                <span aria-hidden className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-clay font-mono text-[12px] font-bold text-paper">{index + 1}</span>
              ) : (
                <span className="pt-0.5 font-mono text-[11px] tracking-[0.12em] text-clay">{String(index + 1).padStart(2, "0")}</span>
              )}
              <div className="min-w-0">
                <p className="text-[16px] leading-snug text-ink">{label}</p>
                <p className="mt-1 text-[14px] leading-relaxed text-mute">{detail}</p>
              </div>
            </li>
          ))}
        </ol>
      )}
      {caption && (
        <figcaption className="mt-4 max-w-2xl text-[14px] leading-relaxed text-mute">
          {caption}
          {hasItems && !numbered && (
            <span className="mt-1 block text-[12px] text-mute sm:hidden">
              {locale === "tr" ? "Şema, masaüstünde çizim olarak görünür." : "The drawing appears on larger screens."}
            </span>
          )}
        </figcaption>
      )}
    </figure>
  );
}
