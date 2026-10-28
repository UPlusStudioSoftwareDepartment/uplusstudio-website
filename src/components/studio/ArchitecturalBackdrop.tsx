"use client";

import { usePathname } from "next/navigation";
import { useLocale } from "next-intl";
import { m, useReducedMotion, useScroll, useTransform } from "framer-motion";

export default function ArchitecturalBackdrop() {
  const pathname = usePathname();
  const locale = useLocale();
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const glowA = useTransform(scrollYProgress, [0, 1], ["0%", "35%"]);
  const glowB = useTransform(scrollYProgress, [0, 1], ["0%", "-30%"]);

  const prefix = `/${locale}`;
  if (pathname === "/" || pathname === prefix) return null;

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-paper" aria-hidden>
      <m.div
        className="absolute -left-[20%] top-[-10%] h-[80vh] w-[80vw] rounded-full bg-[radial-gradient(closest-side,rgba(196,130,92,0.16),transparent)] blur-3xl"
        style={reduce ? undefined : { y: glowA }}
      />
      <m.div
        className="absolute -right-[25%] bottom-[-20%] h-[90vh] w-[85vw] rounded-full bg-[radial-gradient(closest-side,rgba(237,233,225,0.07),transparent)] blur-3xl"
        style={reduce ? undefined : { y: glowB }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_40%,transparent_55%,rgba(0,0,0,0.55))]" />
      <div className="grain absolute inset-0 opacity-80" />
    </div>
  );
}
