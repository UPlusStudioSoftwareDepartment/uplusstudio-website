import Link from "next/link";
import { fontVariables } from "@/app/fonts";

export default function NotFound() {
  return (
    <html lang="tr" className={fontVariables}>
      <body className="font-sans antialiased bg-paper text-ink">
        <main className="relative min-h-[100svh] bg-paper text-ink">
          <div className="mx-auto flex min-h-[100svh] max-w-[2560px] flex-col justify-center px-4 py-20 sm:px-8 lg:px-12">
            <p className="eyebrow flex flex-wrap items-center gap-x-4 gap-y-2 text-mute">
              <span className="whitespace-nowrap text-ink">U+ Studio</span>
              <span className="h-px w-10 bg-ink/40" aria-hidden />
              <span>Sayfa bulunamadı · Page not found</span>
            </p>

            <h1 className="display mt-8 text-[clamp(8rem,32vw,30rem)] leading-[0.82] text-ink">
              4<em className="font-serif font-normal italic tracking-normal">0</em>4
            </h1>

            <div className="mt-10 flex flex-col gap-6 border-t border-line pt-6 sm:flex-row sm:items-baseline sm:justify-between">
              <p className="font-mono text-[12px] uppercase tracking-[0.14em] text-mute">Ankara · TR</p>
              <div className="flex flex-wrap items-baseline gap-x-10 gap-y-4">
                <Link
                  href="/tr"
                  className="group inline-flex items-center gap-3 border-b border-ink pb-1 text-[17px] text-ink hover:border-clay hover:text-clay"
                >
                  <span className="transition-transform duration-300 group-hover:-translate-x-1" aria-hidden>←</span>
                  Ana sayfaya dön
                </Link>
                <Link href="/en" lang="en" className="font-mono text-[12px] uppercase tracking-[0.14em] text-mute hover:text-clay">
                  Back to home
                </Link>
              </div>
            </div>
          </div>
        </main>
      </body>
    </html>
  );
}
