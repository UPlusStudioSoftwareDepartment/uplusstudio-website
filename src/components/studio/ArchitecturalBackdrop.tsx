"use client";

import { usePathname } from "next/navigation";
import { useLocale } from "next-intl";

export default function ArchitecturalBackdrop() {
  const pathname = usePathname();
  const locale = useLocale();

  const prefix = `/${locale}`;
  if (pathname === "/" || pathname === prefix) return null;

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-paper" aria-hidden>
      <div
        className="absolute -left-[20%] top-[-10%] h-[80vh] w-[80vw] rounded-full bg-[radial-gradient(closest-side,rgba(196,130,92,0.16),transparent)]"
      />
      <div
        className="absolute -right-[25%] bottom-[-20%] h-[90vh] w-[85vw] rounded-full bg-[radial-gradient(closest-side,rgba(237,233,225,0.07),transparent)]"
      />
      <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_40%,transparent_55%,rgba(0,0,0,0.55))]" />
      <div className="grain absolute inset-0 opacity-80" />
    </div>
  );
}
