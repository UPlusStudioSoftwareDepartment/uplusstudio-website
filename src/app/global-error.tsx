"use client";

import "@/app/globals.css";
import { useEffect } from "react";
import { reportError } from "@/lib/errorReport";

export default function GlobalError({
  error,
  reset,
}: Readonly<{
  error: Error & { digest?: string };
  reset: () => void;
}>) {
  useEffect(() => reportError(error, { digest: error.digest }), [error]);

  return (
    <html lang="tr">
      <body className="min-h-screen bg-paper text-ink antialiased">
        <main className="mx-auto flex min-h-screen max-w-[2560px] flex-col justify-center px-4 py-20 sm:px-8 lg:px-12">
          <p className="eyebrow flex flex-wrap items-center gap-x-4 gap-y-2 text-mute">
            <span className="text-clay">Err</span>
            <span className="h-px w-10 bg-ink/40" aria-hidden />
            <span>{error.digest ? `ref ${error.digest}` : "U+ Studio"}</span>
          </p>

          <h1 className="display mt-8 max-w-5xl text-[clamp(3rem,9vw,8.5rem)] text-ink">Bir hata oluştu</h1>

          <div className="mt-12 grid grid-cols-1 gap-8 border-t border-line pt-6 lg:grid-cols-12">
            <p className="max-w-prose text-[17px] leading-relaxed text-mute lg:col-span-6">
              Beklenmeyen bir sorun oluştu. Lütfen sayfayı yenileyin.
            </p>
            <div className="lg:col-span-6 lg:text-right">
              <button
                type="button"
                onClick={reset}
                className="inline-flex items-center gap-3 border-b border-ink pb-1 text-[17px] text-ink hover:border-clay hover:text-clay"
              >
                Tekrar dene <span aria-hidden>↻</span>
              </button>
            </div>
          </div>
        </main>
      </body>
    </html>
  );
}
